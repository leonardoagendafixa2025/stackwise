import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      network_id,
      product_id,
      official_terms_url,
      commission_rate,
      commission_type,
      is_recurring,
      cookie_duration_days,
      payout_method,
      min_payout,
      internal_slug,
      destination_url,
    } = body;

    if (!name || !network_id || !product_id || !internal_slug || !destination_url) {
      return NextResponse.json(
        { error: "Nome, rede, produto, slug interno e URL de destino são obrigatórios." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // 1. Create affiliate program
    const { data: program, error: progErr } = await supabase
      .from("affiliate_programs")
      .insert({
        name,
        network_id,
        product_id,
        official_terms_url,
        commission_rate,
        commission_type: commission_type || "percentage",
        is_recurring: Boolean(is_recurring),
        cookie_duration_days: cookie_duration_days ? parseInt(cookie_duration_days, 10) : 90,
        payout_method,
        min_payout: min_payout ? parseFloat(min_payout) : null,
        status: "approved",
        reviewed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (progErr || !program) {
      return NextResponse.json({ error: progErr?.message || "Erro ao criar programa" }, { status: 500 });
    }

    // 2. Create affiliate link
    const { data: link, error: linkErr } = await supabase
      .from("affiliate_links")
      .insert({
        program_id: program.id,
        product_id,
        internal_slug,
        destination_url,
        is_active: true,
      })
      .select()
      .single();

    if (linkErr) {
      return NextResponse.json({ error: linkErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, program, link });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    console.error("[ADMIN AFFILIATES API ERROR]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
