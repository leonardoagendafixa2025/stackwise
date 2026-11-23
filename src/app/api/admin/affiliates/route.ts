import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const [programsRes, networksRes, categoriesRes] = await Promise.all([
      supabase
        .from("affiliate_programs")
        .select(`
          *,
          network:affiliate_networks(*),
          product:products(id, name, slug),
          affiliate_links(*)
        `)
        .order("name", { ascending: true }),
      supabase
        .from("affiliate_networks")
        .select("*")
        .eq("is_active", true)
        .order("name", { ascending: true }),
      supabase
        .from("categories")
        .select("id, name_pt, slug")
        .order("sort_order", { ascending: true }),
    ]);

    if (programsRes.error) {
      return NextResponse.json({ error: programsRes.error.message }, { status: 500 });
    }

    const programs = (programsRes.data || []).map((p) => ({
      ...p,
      link: p.affiliate_links?.[0] || null,
    }));

    return NextResponse.json({
      programs,
      networks: networksRes.data || [],
      categories: categoriesRes.data || [],
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      network_id,
      product_id,
      category_id,
      destination_url,
      internal_slug,
      commission_rate,
      cookie_duration_days,
      payout_method,
    } = body;

    if (!name || !destination_url) {
      return NextResponse.json(
        { error: "Nome da ferramenta e Link de Afiliado (URL) são obrigatórios." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // 1. Resolve or create product
    let targetProductId = product_id;
    const targetSlug = internal_slug
      ? internal_slug.toLowerCase().trim().replace(/[^a-z0-9_-]/g, "-")
      : name.toLowerCase().trim().replace(/[^a-z0-9_-]/g, "-");

    if (!targetProductId) {
      // Find category or default to first category
      let catId = category_id;
      if (!catId) {
        const { data: firstCat } = await supabase.from("categories").select("id").limit(1).single();
        catId = firstCat?.id;
      }

      // Check if product exists with this slug
      const { data: existingProd } = await supabase
        .from("products")
        .select("id")
        .eq("slug", targetSlug)
        .maybeSingle();

      if (existingProd) {
        targetProductId = existingProd.id;
      } else {
        const { data: newProd, error: prodErr } = await supabase
          .from("products")
          .insert({
            name,
            slug: targetSlug,
            category_id: catId,
            official_website: destination_url,
            short_description_pt: `Ferramenta recomendada: ${name}.`,
            is_published: true,
            is_featured: false,
          })
          .select()
          .single();

        if (prodErr || !newProd) {
          return NextResponse.json({ error: `Erro ao criar produto: ${prodErr?.message}` }, { status: 500 });
        }
        targetProductId = newProd.id;
      }
    }

    // 2. Resolve network
    let targetNetworkId = network_id;
    if (!targetNetworkId) {
      const { data: defaultNet } = await supabase.from("affiliate_networks").select("id").limit(1).single();
      targetNetworkId = defaultNet?.id;
    }

    // 3. Create or update affiliate program
    const { data: program, error: progErr } = await supabase
      .from("affiliate_programs")
      .insert({
        name: `Programa ${name}`,
        network_id: targetNetworkId,
        product_id: targetProductId,
        commission_rate: commission_rate || "Comissão Padrão",
        commission_type: "percentage",
        is_recurring: true,
        cookie_duration_days: cookie_duration_days ? parseInt(cookie_duration_days, 10) : 60,
        payout_method: payout_method || "Transferência Bancária / Pix",
        status: "approved",
        reviewed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (progErr || !program) {
      return NextResponse.json({ error: `Erro ao criar programa: ${progErr?.message}` }, { status: 500 });
    }

    // 4. Create or update affiliate link
    // Remove old link for same slug if exists
    await supabase.from("affiliate_links").delete().eq("internal_slug", targetSlug);

    const { data: link, error: linkErr } = await supabase
      .from("affiliate_links")
      .insert({
        program_id: program.id,
        product_id: targetProductId,
        internal_slug: targetSlug,
        destination_url: destination_url.trim(),
        is_active: true,
      })
      .select()
      .single();

    if (linkErr) {
      return NextResponse.json({ error: `Erro ao gerar link: ${linkErr.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, program, link });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { link_id, program_id, destination_url, commission_rate } = body;

    if (!link_id && !program_id) {
      return NextResponse.json({ error: "link_id ou program_id são obrigatórios." }, { status: 400 });
    }

    const supabase = createAdminClient();

    if (link_id && destination_url) {
      const { error: linkErr } = await supabase
        .from("affiliate_links")
        .update({ destination_url: destination_url.trim() })
        .eq("id", link_id);

      if (linkErr) {
        return NextResponse.json({ error: linkErr.message }, { status: 500 });
      }
    }

    if (program_id && commission_rate) {
      const { error: progErr } = await supabase
        .from("affiliate_programs")
        .update({ commission_rate })
        .eq("id", program_id);

      if (progErr) {
        return NextResponse.json({ error: progErr.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, message: "Link atualizado com sucesso." });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id"); // program_id

    if (!id) {
      return NextResponse.json({ error: "ID do programa é obrigatório." }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Delete linked affiliate_links first
    await supabase.from("affiliate_links").delete().eq("program_id", id);

    // Delete program
    const { error } = await supabase.from("affiliate_programs").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Programa e link removidos com sucesso." });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
