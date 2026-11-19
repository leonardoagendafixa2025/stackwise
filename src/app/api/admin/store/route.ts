import { NextRequest, NextResponse } from "next/server";
import {
  getStoreProducts,
  syncProductsFromSuppliers,
  updateProductPricing,
  getRecentDigitalOrders,
} from "@/services/digitalStore/catalog";
import { getAllSupplierBalances } from "@/services/digitalStore/suppliers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [products, balances, orders] = await Promise.all([
      getStoreProducts(false),
      getAllSupplierBalances(),
      getRecentDigitalOrders(),
    ]);

    return NextResponse.json({
      success: true,
      products,
      balances,
      orders,
      binancePayId: "1257797463",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao carregar dados do admin da loja";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const defaultMargin = Number(body.defaultMargin) || 40;

    const result = await syncProductsFromSuppliers(defaultMargin);
    return NextResponse.json({
      success: true,
      message: `${result.syncedCount} produtos sincronizados dos 3 fornecedores com margem de ${defaultMargin}%.`,
      result,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao sincronizar fornecedores";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, sale_price, profit_margin_pct, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: "id é obrigatório." }, { status: 400 });
    }

    const updated = await updateProductPricing(id, {
      sale_price: sale_price !== undefined ? Number(sale_price) : undefined,
      profit_margin_pct: profit_margin_pct !== undefined ? Number(profit_margin_pct) : undefined,
      is_active: is_active !== undefined ? Boolean(is_active) : undefined,
    });

    return NextResponse.json({ success: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao atualizar produto";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
