import { createAdminClient } from "@/lib/supabase/admin";
import { Category, Product, ProductFeature, ProductPrice, ProductSource } from "@/types/database";

export async function getCategories(): Promise<Category[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[CATALOG SERVICE] Error fetching categories:", error.message);
    return [];
  }
  return data || [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("[CATALOG SERVICE] Error fetching category by slug:", error.message);
    return null;
  }
  return data;
}

export interface DetailedProduct extends Product {
  features?: ProductFeature[];
  prices?: ProductPrice[];
  sources?: ProductSource[];
  affiliate_link?: {
    internal_slug: string;
    destination_url: string;
  } | null;
}

export async function getProducts(options?: {
  categorySlug?: string;
  featuredOnly?: boolean;
  publishedOnly?: boolean;
  limit?: number;
}): Promise<DetailedProduct[]> {
  const supabase = createAdminClient();
  let query = supabase.from("products").select(`
    *,
    category:categories(*),
    prices:product_prices(*),
    features:product_features(*),
    affiliate_links(internal_slug, destination_url, is_active)
  `);

  if (options?.publishedOnly !== false) {
    query = query.eq("is_published", true);
  }

  if (options?.featuredOnly) {
    query = query.eq("is_featured", true);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query.order("rating_editorial", { ascending: false });

  if (error) {
    console.error("[CATALOG SERVICE] Error fetching products:", error.message);
    return [];
  }

  // Filter by category slug if provided
  let results = data || [];
  if (options?.categorySlug) {
    results = results.filter((p) => p.category?.slug === options.categorySlug);
  }

  return results.map((item) => ({
    ...item,
    affiliate_link: (item.affiliate_links as unknown as { is_active: boolean; internal_slug: string; destination_url: string }[])?.find((l) => l.is_active) || null,
  }));
}

export async function getProductBySlug(slug: string): Promise<DetailedProduct | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*),
      prices:product_prices(*),
      features:product_features(*),
      sources:product_sources(*),
      affiliate_links(internal_slug, destination_url, is_active)
    `)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    console.error("[CATALOG SERVICE] Error fetching product by slug:", error?.message);
    return null;
  }

  return {
    ...data,
    affiliate_link: (data.affiliate_links as unknown as { is_active: boolean; internal_slug: string; destination_url: string }[])?.find((l) => l.is_active) || null,
  };
}

export async function getProductsForComparison(slugs: string[]): Promise<DetailedProduct[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*),
      prices:product_prices(*),
      features:product_features(*),
      affiliate_links(internal_slug, destination_url, is_active)
    `)
    .in("slug", slugs);

  if (error || !data) {
    console.error("[CATALOG SERVICE] Error fetching comparison products:", error?.message);
    return [];
  }

  return data.map((item) => ({
    ...item,
    affiliate_link: (item.affiliate_links as unknown as { is_active: boolean; internal_slug: string; destination_url: string }[])?.find((l) => l.is_active) || null,
  }));
}
