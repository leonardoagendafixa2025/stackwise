import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      slug,
      type,
      primary_product_id,
      target_category_id,
      locale,
      title,
      meta_title,
      meta_description,
      content_markdown,
      status,
    } = body;

    if (!slug || !title || !content_markdown) {
      return NextResponse.json(
        { error: "Slug, título e conteúdo são obrigatórios." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // 1. Create or fetch base content
    const { data: content, error: contentErr } = await supabase
      .from("content")
      .upsert({
        slug,
        type: type || "guide",
        primary_product_id: primary_product_id || null,
        target_category_id: target_category_id || null,
      }, { onConflict: "slug" })
      .select()
      .single();

    if (contentErr || !content) {
      return NextResponse.json({ error: contentErr?.message || "Erro ao criar conteúdo" }, { status: 500 });
    }

    // 2. Create translation
    const { data: translation, error: transErr } = await supabase
      .from("content_translations")
      .upsert({
        content_id: content.id,
        locale: locale || "pt-br",
        title,
        meta_title: meta_title || title,
        meta_description: meta_description || title,
        content_markdown,
        status: status || "published",
        published_at: status === "published" ? new Date().toISOString() : null,
      }, { onConflict: "content_id, locale" })
      .select()
      .single();

    if (transErr) {
      return NextResponse.json({ error: transErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, content, translation });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    console.error("[ADMIN EDITORIAL API ERROR]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
