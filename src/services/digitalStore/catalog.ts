import { createAdminClient } from "@/lib/supabase/admin";
import {
  fetchAllSupplierProducts,
  fulfillProductFromSupplier,
  FulfillmentResult,
} from "./suppliers";

export interface DigitalProductRecord {
  id: string;
  external_product_id: string;
  supplier_code: "aivault" | "prime_digital" | "ventebot";
  supplier_name: string;
  name: string;
  category: string;
  description: string;
  cost_price: number;
  sale_price: number;
  profit_margin_pct: number;
  currency: string;
  is_active: boolean;
  stock_status: string;
  created_at?: string;
}

export interface DigitalOrderRecord {
  id: string;
  order_code: string;
  product_id?: string;
  product_name: string;
  supplier_code: string;
  customer_email: string;
  customer_name?: string;
  amount_usdt: number;
  binance_pay_id: string;
  binance_tx_id?: string;
  status: "pending_payment" | "verifying" | "completed" | "failed" | "manual_review";
  delivered_item?: string;
  supplier_order_id?: string;
  created_at: string;
  completed_at?: string;
}

// In-memory cache fallback to ensure the store is immediately functional even before migration execution
let inMemoryProductsCache: DigitalProductRecord[] = [];
const inMemoryOrdersCache: DigitalOrderRecord[] = [];

export async function syncProductsFromSuppliers(defaultMarginPct = 40): Promise<{
  syncedCount: number;
  products: DigitalProductRecord[];
}> {
  const supplierProducts = await fetchAllSupplierProducts();
  const supabase = createAdminClient();

  const synced: DigitalProductRecord[] = [];

  for (const sp of supplierProducts) {
    const cost = sp.costPrice;
    // Calculate sale price with profit margin
    const sale = Number((cost * (1 + defaultMarginPct / 100)).toFixed(2));

    const record: DigitalProductRecord = {
      id: `${sp.supplierCode}_${sp.externalId}`,
      external_product_id: sp.externalId,
      supplier_code: sp.supplierCode,
      supplier_name: sp.supplierName,
      name: sp.name,
      category: sp.category,
      description: sp.description,
      cost_price: cost,
      sale_price: sale,
      profit_margin_pct: defaultMarginPct,
      currency: "USDT",
      is_active: true,
      stock_status: sp.inStock ? "in_stock" : "out_of_stock",
    };

    // Try upserting to Supabase
    try {
      await supabase
        .from("digital_products")
        .upsert(
          {
            supplier_code: sp.supplierCode,
            external_product_id: sp.externalId,
            name: sp.name,
            category: sp.category,
            description: sp.description,
            cost_price: cost,
            sale_price: sale,
            profit_margin_pct: defaultMarginPct,
            currency: "USDT",
            is_active: true,
            stock_status: record.stock_status,
          },
          { onConflict: "supplier_code, external_product_id" }
        );
    } catch {
      // In-memory fallback
    }

    synced.push(record);
  }

  inMemoryProductsCache = synced;
  return {
    syncedCount: synced.length,
    products: synced,
  };
}

export async function getStoreProducts(activeOnly = true): Promise<DigitalProductRecord[]> {
  const supabase = createAdminClient();

  try {
    let query = supabase.from("digital_products").select("*").order("name");
    if (activeOnly) {
      query = query.eq("is_active", true);
    }
    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data as DigitalProductRecord[];
    }
  } catch {
    // fallback
  }

  // If DB empty or not yet migrated, initialize cache with live suppliers!
  if (inMemoryProductsCache.length === 0) {
    await syncProductsFromSuppliers(35);
  }

  if (activeOnly) {
    return inMemoryProductsCache.filter((p) => p.is_active);
  }
  return inMemoryProductsCache;
}

export async function updateProductPricing(
  id: string,
  updates: {
    sale_price?: number;
    profit_margin_pct?: number;
    is_active?: boolean;
  }
): Promise<boolean> {
  const supabase = createAdminClient();

  try {
    const { error } = await supabase
      .from("digital_products")
      .update(updates)
      .eq("id", id);
    if (!error) return true;
  } catch {
    // fallback
  }

  const idx = inMemoryProductsCache.findIndex((p) => p.id === id);
  if (idx !== -1) {
    inMemoryProductsCache[idx] = {
      ...inMemoryProductsCache[idx],
      ...updates,
    };
    return true;
  }

  return false;
}

export async function createDigitalOrder(input: {
  productId: string;
  customerEmail: string;
  customerName?: string;
}): Promise<DigitalOrderRecord> {
  const products = await getStoreProducts(false);
  const product = products.find((p) => p.id === input.productId);

  if (!product) {
    throw new Error("Produto digital não encontrado.");
  }

  // Generate unique order code (e.g. STK-8492)
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderCode = `STK-${randomSuffix}`;

  const orderRecord: DigitalOrderRecord = {
    id: `ord_${Date.now()}_${randomSuffix}`,
    order_code: orderCode,
    product_id: product.id,
    product_name: product.name,
    supplier_code: product.supplier_code,
    customer_email: input.customerEmail,
    customer_name: input.customerName || "Cliente Digital",
    amount_usdt: product.sale_price,
    binance_pay_id: "1257797463",
    status: "pending_payment",
    created_at: new Date().toISOString(),
  };

  const supabase = createAdminClient();
  try {
    await supabase.from("digital_orders").insert({
      order_code: orderCode,
      product_name: product.name,
      supplier_code: product.supplier_code,
      customer_email: input.customerEmail,
      customer_name: orderRecord.customer_name,
      amount_usdt: product.sale_price,
      binance_pay_id: "1257797463",
      status: "pending_payment",
    });
  } catch {
    // fallback
  }

  inMemoryOrdersCache.unshift(orderRecord);
  return orderRecord;
}

export async function confirmAndFulfillOrder(
  orderCode: string,
  binanceTxId: string
): Promise<{
  success: boolean;
  order: DigitalOrderRecord;
  fulfillment: FulfillmentResult;
  message: string;
}> {
  // Find order
  let order = inMemoryOrdersCache.find((o) => o.order_code === orderCode);

  const supabase = createAdminClient();
  if (!order) {
    try {
      const { data } = await supabase
        .from("digital_orders")
        .select("*")
        .eq("order_code", orderCode)
        .single();
      if (data) order = data as DigitalOrderRecord;
    } catch {
      // fallback
    }
  }

  if (!order) {
    throw new Error(`Pedido com código ${orderCode} não encontrado.`);
  }

  // Update order with TxID and verifying status
  order.binance_tx_id = binanceTxId;
  order.status = "verifying";

  // Find product external id
  const products = await getStoreProducts(false);
  const product = products.find((p) => p.name === order.product_name || p.id === order.product_id);
  const externalId = product?.external_product_id || "1";

  // Trigger automated supplier fulfillment
  const fulfillment = await fulfillProductFromSupplier(
    order.supplier_code,
    externalId,
    orderCode
  );

  if (fulfillment.success) {
    order.status = "completed";
    order.delivered_item = fulfillment.deliveredContent;
    order.supplier_order_id = fulfillment.orderId;
    order.completed_at = new Date().toISOString();

    try {
      await supabase
        .from("digital_orders")
        .update({
          binance_tx_id: binanceTxId,
          status: "completed",
          delivered_item: fulfillment.deliveredContent,
          supplier_order_id: fulfillment.orderId,
          completed_at: order.completed_at,
        })
        .eq("order_code", orderCode);
    } catch {
      // fallback
    }

    return {
      success: true,
      order,
      fulfillment,
      message: "Pagamento confirmado e produto liberado com sucesso!",
    };
  } else {
    // Mark for manual review so the owner can approve or check supplier balance
    order.status = "manual_review";
    try {
      await supabase
        .from("digital_orders")
        .update({
          binance_tx_id: binanceTxId,
          status: "manual_review",
        })
        .eq("order_code", orderCode);
    } catch {
      // fallback
    }

    return {
      success: false,
      order,
      fulfillment,
      message: fulfillment.error?.includes("balance") || fulfillment.error?.includes("wallet")
        ? "Pagamento recebido! Seu pedido está em ativação rápida pela equipe (saldo do revendedor sendo recarregado)."
        : `Erro ao liberar na API do fornecedor: ${fulfillment.error}`,
    };
  }
}

export async function getRecentDigitalOrders(): Promise<DigitalOrderRecord[]> {
  const supabase = createAdminClient();
  try {
    const { data, error } = await supabase
      .from("digital_orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (!error && data && data.length > 0) {
      return data as DigitalOrderRecord[];
    }
  } catch {
    // fallback
  }

  return inMemoryOrdersCache;
}
