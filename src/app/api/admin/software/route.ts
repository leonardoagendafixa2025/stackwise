import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      category_id,
      official_website,
      short_description_pt,
      short_description_en,
      free_plan_available,
      free_trial_days,
      rating_editorial,
      source_name,
      source_url,
      plan_name,
      plan_price,
      plan_currency,
    } = body;

    if (!name || !slug || !category_id || !official_website || !source_url) {
      return NextResponse.json(
        { error: "Nome, slug, categoria, site oficial e URL da fonte são obrigatórios." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // 1. Insert product
    const { data: product, error: prodErr } = await supabase
      .from("products")
      .insert({
        name,
        slug,
        category_id,
        official_website,
        short_description_pt,
        short_description_en,
        free_plan_available: Boolean(free_plan_available),
        free_trial_days: free_trial_days ? parseInt(free_trial_days, 10) : null,
        rating_editorial: parseFloat(rating_editorial) || 4.5,
        is_published: true,
        last_verified_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (prodErr || !product) {
      return NextResponse.json({ error: prodErr?.message || "Erro ao criar produto" }, { status: 500 });
    }

    // 2. Insert verified source
    await supabase.from("product_sources").insert({
      product_id: product.id,
      source_name: source_name || "Página Oficial do Fornecedor",
      source_url,
      verified_by: "Painel Administrativo STACKWISE",
      verified_at: new Date().toISOString(),
    });

    // 3. Insert initial price
    if (plan_price) {
      await supabase.from("product_prices").insert({
        product_id: product.id,
        plan_name: plan_name || "Starter",
        price: parseFloat(plan_price) || 0.0,
        currency: plan_currency || "USD",
        billing_cycle: "monthly",
        is_active: true,
      });
    }

    return NextResponse.json({ success: true, product });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    console.error("[ADMIN SOFTWARE API ERROR]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
