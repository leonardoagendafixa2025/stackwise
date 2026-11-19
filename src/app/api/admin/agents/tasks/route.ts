import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentCode = searchParams.get("agentCode");

    const supabase = createAdminClient();
    let query = supabase
      .from("agent_tasks")
      .select(`
        *,
        agent:agent_definitions(name, code),
        logs:agent_logs(*)
      `)
      .order("started_at", { ascending: false })
      .limit(20);

    if (agentCode) {
      query = query.eq("task_type", agentCode);
    }

    const { data: tasks, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ tasks: tasks || [] });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao carregar tarefas";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
