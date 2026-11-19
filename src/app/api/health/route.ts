import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();

  try {
    const supabase = createAdminClient();

    // 1. Check DB connectivity & products
    const { count: productsCount, error: prodErr } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true });

    // 2. Check operational budget setting
    const { data: budgetSetting } = await supabase
      .from("system_settings")
      .select("value")
      .eq("key", "budget_monthly_cap")
      .maybeSingle();

    // 3. Check active agents
    const { count: activeAgentsCount } = await supabase
      .from("agent_definitions")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true);

    const latencyMs = Date.now() - startTime;

    if (prodErr) {
      return NextResponse.json(
        {
          status: "unhealthy",
          database: "error",
          error: prodErr.message,
          latencyMs,
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: "healthy",
      mode: "autonomous_supervised",
      database: "connected",
      latencyMs,
      productsCount: productsCount || 0,
      activeAgentsCount: activeAgentsCount || 0,
      budgetMonthlyCapBRL: Number(budgetSetting?.value) || 0.0,
      zeroCostLockEnforced: true,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro desconhecido no health check";
    return NextResponse.json(
      {
        status: "down",
        error: msg,
        latencyMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
