import { NextResponse } from "next/server";
import { getStoreProducts } from "@/services/digitalStore/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await getStoreProducts(true);
    return NextResponse.json({
      success: true,
      products,
      binancePayId: "1257797463",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao carregar produtos digitais";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
