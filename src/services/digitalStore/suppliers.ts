/**
 * STACKWISE DIGITAL RESELLER ENGINE
 * Unified Adapters for the 3 Digital Product Suppliers:
 * 1. AIVault Hub (https://reseller.aivaulthub.store)
 * 2. Prime Digital AI (https://prime-digital-ai.com)
 * 3. VenteBot Reseller (https://web-production-1c7b1.up.railway.app)
 */

export interface UnifiedProduct {
  externalId: string;
  supplierCode: "aivault" | "prime_digital" | "ventebot";
  supplierName: string;
  name: string;
  description: string;
  category: string;
  costPrice: number;
  currency: string;
  inStock: boolean;
  stockCount?: number;
  metadata?: Record<string, unknown>;
}

export interface SupplierBalanceInfo {
  supplierCode: "aivault" | "prime_digital" | "ventebot";
  name: string;
  balance: number;
  currency: string;
  status: "connected" | "error";
  username?: string;
  error?: string;
}

export interface FulfillmentResult {
  success: boolean;
  orderId?: string;
  deliveredContent?: string;
  status: string;
  rawResponse?: Record<string, unknown>;
  error?: string;
}

const SUPPLIER_KEYS = {
  aivault: process.env.AIVAULT_API_KEY || "rsk_xoRh91sYD_riS6kfzNABr3mwBwiwOzZZsNOh47ddfto",
  prime_digital: process.env.PRIME_DIGITAL_API_KEY || "psk_5211cf9becc48f8950f78b4b0583c822ed1bd4a9b92f06c2",
  ventebot: process.env.VENTEBOT_API_KEY || "vbr_live_9807908167_nVf9QVsC1CKn0FA5aXx5Tr4OH_8hoF7IF9aHAQQMZII",
};

// ============================================================================
// 1. AIVault Hub Adapter
// ============================================================================
export async function getAIVaultBalance(): Promise<SupplierBalanceInfo> {
  try {
    const res = await fetch("https://reseller.aivaulthub.store/api/v1/me", {
      headers: { "X-API-Key": SUPPLIER_KEYS.aivault },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    return {
      supplierCode: "aivault",
      name: "AIVault Hub",
      balance: Number(data.balance) || 0.0,
      currency: data.currency || "USD",
      status: "connected",
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro desconhecido";
    return {
      supplierCode: "aivault",
      name: "AIVault Hub",
      balance: 0.0,
      currency: "USD",
      status: "error",
      error: msg,
    };
  }
}

export async function getAIVaultProducts(): Promise<UnifiedProduct[]> {
  try {
    const res = await fetch("https://reseller.aivaulthub.store/api/v1/products", {
      headers: { "X-API-Key": SUPPLIER_KEYS.aivault },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const products = data.products || [];

    interface RawAIVaultItem {
      service_id: string;
      name: string;
      description?: string;
      price?: number;
      category?: string;
      in_stock?: boolean;
    }

    return (products as RawAIVaultItem[]).map((p) => ({
      externalId: String(p.service_id),
      supplierCode: "aivault",
      supplierName: "AIVault Hub",
      name: p.name,
      description: p.description ? p.description.replace(/<[^>]+>/g, " ") : p.name,
      category: p.category || "Contas de IA & Licenças",
      costPrice: Number(p.price) || 5.0,
      currency: "USDT",
      inStock: p.in_stock !== false,
    }));
  } catch (err) {
    console.error("[SUPPLIER AIVAULT] Error fetching products:", err);
    return [];
  }
}

export async function orderAIVault(serviceId: string, orderCode: string): Promise<FulfillmentResult> {
  try {
    const res = await fetch("https://reseller.aivaulthub.store/api/v1/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": SUPPLIER_KEYS.aivault,
      },
      body: JSON.stringify({
        service_id: serviceId,
        quantity: 1,
        external_order_id: orderCode,
      }),
      signal: AbortSignal.timeout(15000),
    });

    const data = await res.json();
    if (!res.ok || data.status === "failed") {
      return {
        success: false,
        status: "failed",
        error: data.message || data.error || `HTTP ${res.status}`,
        rawResponse: data,
      };
    }

    return {
      success: true,
      orderId: String(data.order_id || data.id || orderCode),
      deliveredContent: data.data || data.credentials || data.code || JSON.stringify(data),
      status: "completed",
      rawResponse: data,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Timeout na API AIVault";
    return { success: false, status: "error", error: msg };
  }
}

// ============================================================================
// 2. Prime Digital AI Adapter
// ============================================================================
export async function getPrimeDigitalBalance(): Promise<SupplierBalanceInfo> {
  try {
    const res = await fetch("https://prime-digital-ai.com/api/v1/balance", {
      headers: {
        "X-API-Key": SUPPLIER_KEYS.prime_digital,
        "Authorization": `Bearer ${SUPPLIER_KEYS.prime_digital}`,
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    return {
      supplierCode: "prime_digital",
      name: "Prime Digital AI",
      balance: Number(data.balance || data.data?.balance) || 0.0,
      currency: data.currency || "USD",
      status: "connected",
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro desconhecido";
    return {
      supplierCode: "prime_digital",
      name: "Prime Digital AI",
      balance: 0.0,
      currency: "USD",
      status: "error",
      error: msg,
    };
  }
}

export async function getPrimeDigitalProducts(): Promise<UnifiedProduct[]> {
  try {
    const res = await fetch("https://prime-digital-ai.com/api/products", {
      headers: {
        "X-API-Key": SUPPLIER_KEYS.prime_digital,
        "Authorization": `Bearer ${SUPPLIER_KEYS.prime_digital}`,
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.data || [];

    interface RawPrimeItem {
      id: string | number;
      name: string;
      description?: string;
      price?: number;
      stock?: number;
      inStock?: boolean;
    }

    return (list as RawPrimeItem[]).map((p) => ({
      externalId: String(p.id),
      supplierCode: "prime_digital",
      supplierName: "Prime Digital AI",
      name: p.name,
      description: p.description ? p.description.replace(/<[^>]+>/g, " ") : p.name,
      category: "Softwares & Tokens",
      costPrice: Number(p.price) || 0.02,
      currency: "USDT",
      inStock: p.inStock !== false && (p.stock === undefined || p.stock > 0),
      stockCount: p.stock,
    }));
  } catch (err) {
    console.error("[SUPPLIER PRIME DIGITAL] Error fetching products:", err);
    return [];
  }
}

export async function orderPrimeDigital(productId: string, orderCode: string): Promise<FulfillmentResult> {
  try {
    const res = await fetch("https://prime-digital-ai.com/api/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": SUPPLIER_KEYS.prime_digital,
        "Authorization": `Bearer ${SUPPLIER_KEYS.prime_digital}`,
        "Idempotency-Key": orderCode,
      },
      body: JSON.stringify({
        productId: productId,
        quantity: 1,
      }),
      signal: AbortSignal.timeout(15000),
    });

    const data = await res.json();
    if (!res.ok || data.success === false) {
      return {
        success: false,
        status: "failed",
        error: data.message || data.error || `HTTP ${res.status}`,
        rawResponse: data,
      };
    }

    const orderData = data.data || data;
    const delivered = orderData.code || orderData.credentials || orderData.item || JSON.stringify(orderData);

    return {
      success: true,
      orderId: String(orderData.id || orderCode),
      deliveredContent: delivered,
      status: "completed",
      rawResponse: data,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Timeout na API Prime Digital";
    return { success: false, status: "error", error: msg };
  }
}

// ============================================================================
// 3. VenteBot Reseller Adapter
// ============================================================================
export async function getVenteBotBalance(): Promise<SupplierBalanceInfo> {
  try {
    const res = await fetch("https://web-production-1c7b1.up.railway.app/api/reseller/me", {
      headers: {
        "X-API-Key": SUPPLIER_KEYS.ventebot,
        "Authorization": `Bearer ${SUPPLIER_KEYS.ventebot}`,
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    return {
      supplierCode: "ventebot",
      name: "VenteBot Reseller",
      balance: Number(data.wallet_balance) || 0.0,
      currency: "USD",
      username: data.username || "leonardodesigner",
      status: "connected",
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro desconhecido";
    return {
      supplierCode: "ventebot",
      name: "VenteBot Reseller",
      balance: 0.0,
      currency: "USD",
      status: "error",
      error: msg,
    };
  }
}

export async function getVenteBotProducts(): Promise<UnifiedProduct[]> {
  try {
    const res = await fetch("https://web-production-1c7b1.up.railway.app/api/reseller/products", {
      headers: {
        "X-API-Key": SUPPLIER_KEYS.ventebot,
        "Authorization": `Bearer ${SUPPLIER_KEYS.ventebot}`,
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const list = data.products || [];

    interface RawVenteItem {
      id: number | string;
      name: string;
      description?: string;
      price?: number;
      amount_usd?: number;
      category?: string;
    }

    return (list as RawVenteItem[]).map((p) => ({
      externalId: String(p.id),
      supplierCode: "ventebot",
      supplierName: "VenteBot Reseller",
      name: p.name,
      description: p.description ? p.description.replace(/<[^>]+>/g, " ") : p.name,
      category: "Contas Criador & Áudio IA",
      costPrice: Number(p.amount_usd || p.price) || 8.0,
      currency: "USDT",
      inStock: true,
    }));
  } catch (err) {
    console.error("[SUPPLIER VENTEBOT] Error fetching products:", err);
    return [];
  }
}

export async function orderVenteBot(productId: string | number, orderCode: string): Promise<FulfillmentResult> {
  try {
    const res = await fetch("https://web-production-1c7b1.up.railway.app/api/reseller/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": SUPPLIER_KEYS.ventebot,
        "Authorization": `Bearer ${SUPPLIER_KEYS.ventebot}`,
      },
      body: JSON.stringify({
        product_id: Number(productId),
        quantity: 1,
        idempotency_key: orderCode,
      }),
      signal: AbortSignal.timeout(15000),
    });

    const data = await res.json();
    if (!res.ok || data.success === false) {
      return {
        success: false,
        status: "failed",
        error: data.detail || data.error || `HTTP ${res.status}`,
        rawResponse: data,
      };
    }

    const orderObj = data.order || data;
    const delivered = orderObj.items?.[0]?.account_data || orderObj.activation_code || JSON.stringify(orderObj);

    return {
      success: true,
      orderId: String(orderObj.id || orderCode),
      deliveredContent: delivered,
      status: "completed",
      rawResponse: data,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Timeout na API VenteBot";
    return { success: false, status: "error", error: msg };
  }
}

// ============================================================================
// Unified Orchestrator Functions
// ============================================================================
export async function getAllSupplierBalances(): Promise<SupplierBalanceInfo[]> {
  const [aivault, prime, ventebot] = await Promise.all([
    getAIVaultBalance(),
    getPrimeDigitalBalance(),
    getVenteBotBalance(),
  ]);
  return [aivault, prime, ventebot];
}

export async function fetchAllSupplierProducts(): Promise<UnifiedProduct[]> {
  const [aivaultProds, primeProds, ventebotProds] = await Promise.all([
    getAIVaultProducts(),
    getPrimeDigitalProducts(),
    getVenteBotProducts(),
  ]);
  return [...aivaultProds, ...primeProds, ...ventebotProds];
}

export async function fulfillProductFromSupplier(
  supplierCode: string,
  externalProductId: string,
  orderCode: string
): Promise<FulfillmentResult> {
  switch (supplierCode) {
    case "aivault":
      return orderAIVault(externalProductId, orderCode);
    case "prime_digital":
      return orderPrimeDigital(externalProductId, orderCode);
    case "ventebot":
      return orderVenteBot(externalProductId, orderCode);
    default:
      return {
        success: false,
        status: "error",
        error: `Fornecedor desconhecido: ${supplierCode}`,
      };
  }
}
