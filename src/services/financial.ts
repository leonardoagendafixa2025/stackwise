import { createAdminClient } from "@/lib/supabase/admin";
import { parseAndProcessCommissionsCSV } from "./agents/financial";

export interface FinancialSummary {
  grossRevenue: number; // Only paid commissions
  approvedCommissions: number; // Approved, awaiting payout
  pendingCommissions: number; // In validation period
  reversedCommissions: number; // Cancelled / refunded
  totalOperationalCosts: number;
  netProfit: number;
  conversionsCount: number;
  targetGross: number; // e.g. 1,000,000
  targetProgressPercentage: number;
}

export interface DetailedConversion {
  id: string;
  external_conversion_id: string | null;
  link_id: string;
  link_slug?: string;
  product_name?: string;
  amount: number;
  commission_amount: number;
  currency: string;
  status: "pending" | "approved" | "paid" | "reversed";
  conversion_date: string;
  reported_at: string;
}

export interface OperationalCostItem {
  id: string;
  service_name: string;
  plan_tier: string;
  cost_brl: number;
  billing_date: string | null;
  is_authorized: boolean;
  notes: string | null;
}

export async function getFinancialSummary(): Promise<FinancialSummary> {
  const supabase = createAdminClient();

  // 1. Fetch all conversions
  const { data: conversions, error: convErr } = await supabase
    .from("affiliate_conversions")
    .select("amount, commission_amount, status");

  if (convErr) {
    console.error("[FINANCIAL SERVICE] Error fetching conversions:", convErr);
  }

  let grossRevenue = 0; // paid
  let approvedCommissions = 0; // approved
  let pendingCommissions = 0; // pending
  let reversedCommissions = 0; // reversed
  const conversionsCount = conversions?.length || 0;

  if (conversions) {
    for (const c of conversions) {
      const val = Number(c.commission_amount) || 0;
      if (c.status === "paid") {
        grossRevenue += val;
      } else if (c.status === "approved") {
        approvedCommissions += val;
      } else if (c.status === "pending") {
        pendingCommissions += val;
      } else if (c.status === "reversed") {
        reversedCommissions += val;
      }
    }
  }

  // 2. Fetch operational costs
  const { data: costs, error: costErr } = await supabase
    .from("operational_costs")
    .select("cost_brl");

  if (costErr) {
    console.error("[FINANCIAL SERVICE] Error fetching costs:", costErr);
  }

  let totalOperationalCosts = 0;
  if (costs) {
    for (const cost of costs) {
      totalOperationalCosts += Number(cost.cost_brl) || 0;
    }
  }

  // 3. Fetch Target
  const { data: targetSetting } = await supabase
    .from("system_settings")
    .select("value")
    .eq("key", "financial_target_gross")
    .maybeSingle();

  const targetGross = Number(targetSetting?.value) || 1000000;
  const netProfit = grossRevenue - totalOperationalCosts;
  const targetProgressPercentage = targetGross > 0
    ? Number(((grossRevenue / targetGross) * 100).toFixed(2))
    : 0;

  return {
    grossRevenue,
    approvedCommissions,
    pendingCommissions,
    reversedCommissions,
    totalOperationalCosts,
    netProfit,
    conversionsCount,
    targetGross,
    targetProgressPercentage,
  };
}

export async function getRecentConversions(limit = 50): Promise<DetailedConversion[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("affiliate_conversions")
    .select(`
      id,
      external_conversion_id,
      link_id,
      amount,
      commission_amount,
      currency,
      status,
      conversion_date,
      reported_at,
      link:affiliate_links(
        internal_slug,
        product:products(name)
      )
    `)
    .order("conversion_date", { ascending: false })
    .limit(limit);

  if (error || !data) {
    console.error("[FINANCIAL SERVICE] Error fetching recent conversions:", error);
    return [];
  }

  interface RawConversionRecord {
    id: string;
    external_conversion_id: string | null;
    link_id: string;
    amount: number;
    commission_amount: number;
    currency: string;
    status: "pending" | "approved" | "paid" | "reversed";
    conversion_date: string;
    reported_at: string;
    link?: {
      internal_slug?: string;
      product?: {
        name?: string;
      };
    };
  }

  return (data as unknown as RawConversionRecord[]).map((item) => ({
    id: item.id,
    external_conversion_id: item.external_conversion_id,
    link_id: item.link_id,
    link_slug: item.link?.internal_slug || "desconhecido",
    product_name: item.link?.product?.name || "Produto Afiliado",
    amount: Number(item.amount) || 0,
    commission_amount: Number(item.commission_amount) || 0,
    currency: item.currency || "USD",
    status: item.status,
    conversion_date: item.conversion_date,
    reported_at: item.reported_at,
  }));
}

export async function getOperationalCostsList(): Promise<OperationalCostItem[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("operational_costs")
    .select("*")
    .order("cost_brl", { ascending: false });

  if (error || !data) {
    console.error("[FINANCIAL SERVICE] Error fetching operational costs list:", error);
    return [];
  }

  return data.map((c) => ({
    id: c.id,
    service_name: c.service_name,
    plan_tier: c.plan_tier,
    cost_brl: Number(c.cost_brl) || 0,
    billing_date: c.billing_date,
    is_authorized: Boolean(c.is_authorized),
    notes: c.notes,
  }));
}

export async function addOperationalCost(input: {
  service_name: string;
  plan_tier: string;
  cost_brl: number;
  billing_date?: string;
  is_authorized: boolean;
  notes?: string;
}) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("operational_costs")
    .insert({
      service_name: input.service_name,
      plan_tier: input.plan_tier,
      cost_brl: input.cost_brl,
      billing_date: input.billing_date || null,
      is_authorized: input.is_authorized,
      notes: input.notes || null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Falha ao registrar custo operacional: ${error.message}`);
  }

  return data;
}

export async function importCommissionsCSV(csvContent: string) {
  // Delegate parsing and database injection to Agent 6 (Financial Agent)
  const agentResult = await parseAndProcessCommissionsCSV(csvContent);
  return agentResult.data;
}
