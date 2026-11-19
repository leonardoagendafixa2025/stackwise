import { createAdminClient } from "@/lib/supabase/admin";
import { runResearcherAgent } from "./agents/researcher";
import { runSEOAgent } from "./agents/seo";
import { runEditorialAgent } from "./agents/editorial";
import { runAuditorAgent } from "./agents/auditor";
import { runGrowthAgent } from "./agents/growth";
import { parseAndProcessCommissionsCSV } from "./agents/financial";
import { runCommercialAgentForLead } from "./agents/commercial";

export async function executeAgentTask(
  agentCode: string,
  inputPayload: Record<string, unknown> = {}
): Promise<{
  success: boolean;
  taskId: string;
  output: Record<string, unknown>;
  tokensUsed: number;
  message?: string;
}> {
  const supabase = createAdminClient();

  // 1. Fetch Agent Definition
  const { data: agent, error: agentErr } = await supabase
    .from("agent_definitions")
    .select("*")
    .eq("code", agentCode)
    .single();

  if (agentErr || !agent) {
    throw new Error(`Agente com código '${agentCode}' não encontrado no banco.`);
  }

  if (!agent.is_active) {
    throw new Error(`Agente '${agent.name}' está desativado administrativamente.`);
  }

  // 2. Rate limit & token check
  if (agent.current_daily_tokens >= agent.daily_token_cap) {
    throw new Error(
      `Limite diário de tokens excedido para ${agent.name} (${agent.current_daily_tokens}/${agent.daily_token_cap}). Tarefa suspensa por segurança de custo zero.`
    );
  }

  // 3. Create Task Record in queued state
  const { data: task, error: taskErr } = await supabase
    .from("agent_tasks")
    .insert({
      agent_id: agent.id,
      task_type: agentCode,
      input_payload: inputPayload,
      status: "running",
      started_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (taskErr || !task) {
    throw new Error(`Falha ao registrar tarefa na fila: ${taskErr?.message}`);
  }

  // Log start
  await supabase.from("agent_logs").insert({
    task_id: task.id,
    agent_code: agent.code,
    log_level: "info",
    message: `Iniciando execução da tarefa do ${agent.name}.`,
    context: inputPayload,
  });

  try {
    let output: Record<string, unknown> = {};
    let tokensUsed = 0;

    switch (agentCode) {
      case "AGENT_1_RESEARCHER": {
        const res = await runResearcherAgent(inputPayload as { targetCategory?: string; query?: string });
        output = res.data as unknown as Record<string, unknown>;
        tokensUsed = res.tokensUsed;
        break;
      }
      case "AGENT_2_SEO": {
        const res = await runSEOAgent(inputPayload as { targetCategory?: string });
        output = res.data as unknown as Record<string, unknown>;
        tokensUsed = res.tokensUsed;
        break;
      }
      case "AGENT_3_EDITORIAL": {
        const res = await runEditorialAgent({
          topic: (inputPayload.topic as string) || "Comparativo de Softwares SaaS",
          primaryProductName: inputPayload.primaryProductName as string | undefined,
          locale: (inputPayload.locale as "pt-br" | "en") || "pt-br",
        });
        output = res.data as unknown as Record<string, unknown>;
        tokensUsed = res.tokensUsed;
        break;
      }
      case "AGENT_4_AUDITOR": {
        const res = await runAuditorAgent();
        output = res.data as unknown as Record<string, unknown>;
        tokensUsed = res.tokensUsed;
        break;
      }
      case "AGENT_5_GROWTH": {
        const res = await runGrowthAgent();
        output = res.data as unknown as Record<string, unknown>;
        tokensUsed = res.tokensUsed;
        break;
      }
      case "AGENT_6_FINANCIAL": {
        const res = await parseAndProcessCommissionsCSV((inputPayload.csvContent as string) || "");
        output = res.data as unknown as Record<string, unknown>;
        tokensUsed = res.tokensUsed;
        break;
      }
      case "AGENT_7_COMMERCIAL": {
        if (!inputPayload.leadId) {
          throw new Error("leadId é obrigatório para execução do Agente Comercial.");
        }
        const res = await runCommercialAgentForLead(inputPayload.leadId as string);
        output = res.data as unknown as Record<string, unknown>;
        tokensUsed = res.tokensUsed;
        break;
      }
      default:
        throw new Error(`Tipo de tarefa desconhecido para o agente: ${agentCode}`);
    }

    // 4. Update task to completed
    await supabase
      .from("agent_tasks")
      .update({
        status: "completed",
        output_payload: output,
        completed_at: new Date().toISOString(),
      })
      .eq("id", task.id);

    // 5. Update agent token counter
    await supabase
      .from("agent_definitions")
      .update({
        current_daily_tokens: agent.current_daily_tokens + tokensUsed,
      })
      .eq("id", agent.id);

    // Log success
    await supabase.from("agent_logs").insert({
      task_id: task.id,
      agent_code: agent.code,
      log_level: "info",
      message: `Tarefa executada com sucesso. Tokens consumidos: ${tokensUsed}.`,
      context: output,
    });

    return {
      success: true,
      taskId: task.id,
      output,
      tokensUsed,
      message: `Tarefa concluída com sucesso pelo ${agent.name}.`,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Erro desconhecido durante execução";

    // Update task to failed
    await supabase
      .from("agent_tasks")
      .update({
        status: "failed",
        error_message: errorMsg,
        completed_at: new Date().toISOString(),
      })
      .eq("id", task.id);

    // Log error
    await supabase.from("agent_logs").insert({
      task_id: task.id,
      agent_code: agent.code,
      log_level: "error",
      message: `Falha na execução: ${errorMsg}`,
    });

    return {
      success: false,
      taskId: task.id,
      output: {},
      tokensUsed: 0,
      message: errorMsg,
    };
  }
}
