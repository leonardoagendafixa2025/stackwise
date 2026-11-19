import { NextResponse } from "next/server";
import { recoverFailedTasks, getScheduledJobs } from "@/services/recovery";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const [jobs, failedTasksCount] = await Promise.all([
      getScheduledJobs(),
      supabase
        .from("agent_tasks")
        .select("id", { count: "exact", head: true })
        .eq("status", "failed"),
    ]);

    return NextResponse.json({
      scheduledJobs: jobs,
      failedTasksCount: failedTasksCount.count || 0,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao carregar status de automação";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST() {
  try {
    const result = await recoverFailedTasks();
    return NextResponse.json({
      success: true,
      result,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao executar rotina de auto-recuperação";
    console.error("[SELF HEALING API ERROR]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
