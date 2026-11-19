import { NextRequest, NextResponse } from "next/server";
import { confirmAndFulfillOrder } from "@/services/digitalStore/catalog";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderCode, binanceTxId } = body;

    if (!orderCode || !binanceTxId) {
      return NextResponse.json(
        { error: "orderCode e binanceTxId são obrigatórios." },
        { status: 400 }
      );
    }

    const result = await confirmAndFulfillOrder(orderCode, binanceTxId);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao processar verificação de pagamento";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
