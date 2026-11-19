import { NextRequest, NextResponse } from "next/server";
import { createDigitalOrder } from "@/services/digitalStore/catalog";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, customerEmail, customerName } = body;

    if (!productId || !customerEmail) {
      return NextResponse.json(
        { error: "productId e customerEmail são obrigatórios." },
        { status: 400 }
      );
    }

    const order = await createDigitalOrder({
      productId,
      customerEmail,
      customerName,
    });

    return NextResponse.json({
      success: true,
      order,
      binancePayId: "1257797463",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao gerar pedido";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
