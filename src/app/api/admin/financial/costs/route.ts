import { NextRequest, NextResponse } from "next/server";
import { addOperationalCost } from "@/services/financial";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { service_name, plan_tier, cost_brl, billing_date, is_authorized, notes } = body;

    if (!service_name) {
      return NextResponse.json(
        { error: "service_name é obrigatório." },
        { status: 400 }
      );
    }

    const costNum = Number(cost_brl) || 0;

    // Safety policy: warn if unauthorized cost is added above R$ 0.00
    if (costNum > 0 && !is_authorized) {
      return NextResponse.json(
        { error: "Trava de custo zero ativa: Custos acima de R$ 0,00 exigem autorização expressa (is_authorized: true)." },
        { status: 403 }
      );
    }

    const costRecord = await addOperationalCost({
      service_name,
      plan_tier: plan_tier || "Free Tier",
      cost_brl: costNum,
      billing_date,
      is_authorized: Boolean(is_authorized),
      notes,
    });

    return NextResponse.json({
      success: true,
      cost: costRecord,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao cadastrar custo operacional";
    console.error("[FINANCIAL COST CREATE ERROR]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
