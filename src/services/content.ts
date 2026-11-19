import { createAdminClient } from "@/lib/supabase/admin";
import { Content, ContentTranslation, ContentStatus } from "@/types/database";

export interface DetailedContentArticle extends Content {
  translations?: ContentTranslation[];
  translation?: ContentTranslation;
  primary_product?: {
    name: string;
    slug: string;
  };
  category?: {
    name_pt: string;
    name_en: string;
    slug: string;
  };
}

export async function getPublishedArticles(locale: string = "pt-br"): Promise<DetailedContentArticle[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("content")
    .select(`
      *,
      translations:content_translations(*),
      primary_product:products!primary_product_id(name, slug),
      category:categories(name_pt, name_en, slug)
    `)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("[CONTENT SERVICE] Error fetching articles:", error?.message);
    return [];
  }

  // Filter only those with published translation in the target locale
  const articles: DetailedContentArticle[] = [];
  for (const item of data as unknown as DetailedContentArticle[]) {
    const translation = item.translations?.find(
      (t: ContentTranslation) => t.locale === locale && t.status === "published"
    );
    if (translation) {
      articles.push({
        ...item,
        translation,
      });
    }
  }

  return articles;
}

export async function getArticleBySlug(slug: string, locale: string = "pt-br"): Promise<DetailedContentArticle | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("content")
    .select(`
      *,
      translations:content_translations(*),
      primary_product:products!primary_product_id(name, slug, official_website),
      category:categories(name_pt, name_en, slug)
    `)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    console.error("[CONTENT SERVICE] Error fetching article by slug:", error?.message);
    return null;
  }

  const translation = data.translations?.find((t: ContentTranslation) => t.locale === locale);

  return {
    ...data,
    translation: translation || data.translations?.[0],
  };
}

export async function getAllEditorialContentForAdmin(): Promise<DetailedContentArticle[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("content")
    .select(`
      *,
      translations:content_translations(*),
      primary_product:products!primary_product_id(name, slug)
    `)
    .order("updated_at", { ascending: false });

  if (error || !data) {
    console.error("[CONTENT SERVICE] Error fetching admin content:", error?.message);
    return [];
  }

  return data;
}

export async function updateTranslationStatus(
  translationId: string,
  newStatus: ContentStatus
): Promise<boolean> {
  const supabase = createAdminClient();
  const updateData: Record<string, string | null> = {
    status: newStatus,
    updated_at: new Date().toISOString(),
  };

  if (newStatus === "published") {
    updateData.published_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("content_translations")
    .update(updateData)
    .eq("id", translationId);

  if (error) {
    console.error("[CONTENT SERVICE] Error updating status:", error.message);
    return false;
  }
  return true;
}
