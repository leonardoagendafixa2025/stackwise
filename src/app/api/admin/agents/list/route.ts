import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data: agents, error } = await supabase
      .from("agent_definitions")
      .select("*")
      .order("code", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ agents: agents || [] });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao listar agentes";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
