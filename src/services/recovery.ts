import { createAdminClient } from "@/lib/supabase/admin";
import { executeAgentTask } from "./agentRunner";

export interface RecoveryResult {
  totalFailedFound: number;
  retriedCount: number;
  recoveredCount: number;
  escalatedCount: number;
  details: {
    taskId: string;
    taskType: string;
    previousRetryCount: number;
    outcome: "recovered" | "failed_again" | "escalated_to_human";
    error?: string;
  }[];
}

export interface ScheduledJobItem {
  id: string;
  name: string;
  cron_expression: string;
  agent_code?: string;
  agent_name?: string;
  is_active: boolean;
  last_run_at: string | null;
  next_run_at: string | null;
  status: string;
}

/**
 * Scans for failed agent tasks and executes automated recovery with exponential backoff.
 * Tasks with 3+ failures are escalated to the human supervisor via the notifications table.
 */
export async function recoverFailedTasks(): Promise<RecoveryResult> {
  const supabase = createAdminClient();

  // 1. Fetch failed tasks
  const { data: failedTasks, error } = await supabase
    .from("agent_tasks")
    .select(`
      id,
      task_type,
      input_payload,
      retry_count,
      error_message
    `)
    .eq("status", "failed")
    .order("started_at", { ascending: false })
    .limit(10);

  if (error || !failedTasks) {
    console.error("[RECOVERY ENGINE] Error fetching failed tasks:", error);
    return {
      totalFailedFound: 0,
      retriedCount: 0,
      recoveredCount: 0,
      escalatedCount: 0,
      details: [],
    };
  }

  const details: RecoveryResult["details"] = [];
  let recoveredCount = 0;
  let escalatedCount = 0;
  let retriedCount = 0;

  for (const t of failedTasks) {
    const currentRetries = t.retry_count || 0;

    // If max retries (3) exceeded, escalate to human attention
    if (currentRetries >= 3) {
      await supabase
        .from("agent_tasks")
        .update({ status: "needs_review" })
        .eq("id", t.id);

      await supabase.from("notifications").insert({
        type: "PERSISTENT_TASK_FAILURE",
        title: `Falha Persistente: Tarefa ${t.task_type}`,
        message: `A tarefa ${t.id} falhou após 3 tentativas automáticas de auto-recuperação. Erro: ${t.error_message || "Desconhecido"}. Requer inspeção.`,
        severity: "critical",
        requires_attention: true,
        action_url: "/admin/agents",
      });

      escalatedCount++;
      details.push({
        taskId: t.id,
        taskType: t.task_type,
        previousRetryCount: currentRetries,
        outcome: "escalated_to_human",
      });
      continue;
    }

    // Attempt retry
    retriedCount++;
    const nextRetry = currentRetries + 1;

    await supabase.from("agent_logs").insert({
      task_id: t.id,
      agent_code: t.task_type,
      log_level: "warn",
      message: `Iniciando auto-recuperação (Tentativa ${nextRetry}/3).`,
      context: { previousError: t.error_message },
    });

    try {
      // Re-execute task
      const result = await executeAgentTask(
        t.task_type,
        (t.input_payload as Record<string, unknown>) || {}
      );

      if (result.success) {
        recoveredCount++;
        // Mark previous failed task as recovered
        await supabase
          .from("agent_tasks")
          .update({
            status: "completed",
            retry_count: nextRetry,
            error_message: null,
          })
          .eq("id", t.id);

        details.push({
          taskId: t.id,
          taskType: t.task_type,
          previousRetryCount: currentRetries,
          outcome: "recovered",
        });
      } else {
        await supabase
          .from("agent_tasks")
          .update({
            retry_count: nextRetry,
          })
          .eq("id", t.id);

        details.push({
          taskId: t.id,
          taskType: t.task_type,
          previousRetryCount: currentRetries,
          outcome: "failed_again",
          error: result.message,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido na auto-recuperação";
      await supabase
        .from("agent_tasks")
        .update({
          retry_count: nextRetry,
          error_message: msg,
        })
        .eq("id", t.id);

      details.push({
        taskId: t.id,
        taskType: t.task_type,
        previousRetryCount: currentRetries,
        outcome: "failed_again",
        error: msg,
      });
    }
  }

  return {
    totalFailedFound: failedTasks.length,
    retriedCount,
    recoveredCount,
    escalatedCount,
    details,
  };
}

export async function getScheduledJobs(): Promise<ScheduledJobItem[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("scheduled_jobs")
    .select(`
      id,
      name,
      cron_expression,
      is_active,
      last_run_at,
      next_run_at,
      status,
      agent:agent_definitions(name, code)
    `)
    .order("name", { ascending: true });

  if (error || !data) {
    console.error("[RECOVERY ENGINE] Error fetching scheduled jobs:", error);
    return [];
  }

  interface RawScheduledJob {
    id: string;
    name: string;
    cron_expression: string;
    is_active: boolean;
    last_run_at: string | null;
    next_run_at: string | null;
    status: string;
    agent?: {
      name?: string;
      code?: string;
    };
  }

  return (data as unknown as RawScheduledJob[]).map((j) => ({
    id: j.id,
    name: j.name,
    cron_expression: j.cron_expression,
    agent_code: j.agent?.code,
    agent_name: j.agent?.name,
    is_active: j.is_active,
    last_run_at: j.last_run_at,
    next_run_at: j.next_run_at,
    status: j.status || "idle",
  }));
}
