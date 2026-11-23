import { NextResponse } from "next/server";
import {
  getFinancialSummary,
  getRecentConversions,
  getOperationalCostsList,
} from "@/services/financial";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [summary, conversions, costs] = await Promise.all([
      getFinancialSummary(),
      getRecentConversions(50),
      getOperationalCostsList(),
    ]);

    return NextResponse.json({
      summary,
      conversions,
      costs,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao carregar dados financeiros";
    console.error("[FINANCIAL SUMMARY API ERROR]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
