import { createAdminClient } from "@/lib/supabase/admin";
import { AffiliateNetwork, AffiliateProgram, AffiliateLink } from "@/types/database";

export async function getAffiliateNetworks(): Promise<AffiliateNetwork[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("affiliate_networks")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("[AFFILIATE SERVICE] Error fetching networks:", error.message);
    return [];
  }
  return data || [];
}

export interface DetailedProgram extends Omit<AffiliateProgram, "product"> {
  network?: AffiliateNetwork;
  product?: {
    name: string;
    slug: string;
  };
  link?: AffiliateLink;
}

export async function getAffiliatePrograms(): Promise<DetailedProgram[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("affiliate_programs")
    .select(`
      *,
      network:affiliate_networks(*),
      product:products(name, slug),
      affiliate_links(*)
    `)
    .order("name", { ascending: true });

  if (error) {
    console.error("[AFFILIATE SERVICE] Error fetching programs:", error.message);
    return [];
  }

  return (data || []).map((item) => ({
    ...item,
    link: item.affiliate_links?.[0] || null,
  }));
}

export async function getAffiliateClickStats(): Promise<{
  totalClicks: number;
  clicksLast7Days: number;
  topProducts: { name: string; count: number }[];
}> {
  const supabase = createAdminClient();
  
  // Total clicks count
  const { count: totalClicks } = await supabase
    .from("affiliate_clicks")
    .select("*", { count: "exact", head: true });

  // Last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { count: clicksLast7Days } = await supabase
    .from("affiliate_clicks")
    .select("*", { count: "exact", head: true })
    .gte("created_at", sevenDaysAgo.toISOString());

  // Recent clicks grouped by product
  const { data: recentClicks } = await supabase
    .from("affiliate_clicks")
    .select("product_id, products(name)")
    .limit(100);

  const productCounts: Record<string, { name: string; count: number }> = {};
  if (recentClicks) {
    for (const c of recentClicks as unknown as { product_id: string; products: { name: string } | null }[]) {
      const prodName = c.products?.name || "Desconhecido";
      if (!productCounts[prodName]) {
        productCounts[prodName] = { name: prodName, count: 0 };
      }
      productCounts[prodName].count += 1;
    }
  }

  const topProducts = Object.values(productCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalClicks: totalClicks || 0,
    clicksLast7Days: clicksLast7Days || 0,
    topProducts,
  };
}
