-- ==============================================================================
-- STACKWISE — DIGITAL PRODUCTS STORE & RESELLER MARKETPLACE MIGRATION
-- Adiciona: reseller_suppliers, digital_products, digital_orders + RLS
-- ==============================================================================

-- 1. Reseller Suppliers (Os 3 Fornecedores de API)
CREATE TABLE IF NOT EXISTS reseller_suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE, -- 'aivault', 'prime_digital', 'ventebot'
    name TEXT NOT NULL,
    base_url TEXT NOT NULL,
    api_key TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    cached_balance NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'USD',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Digital Products (Catálogo de Produtos Digitais com Margem de Lucro)
CREATE TABLE IF NOT EXISTS digital_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID REFERENCES reseller_suppliers(id) ON DELETE SET NULL,
    supplier_code TEXT NOT NULL, -- 'aivault', 'prime_digital', 'ventebot'
    external_product_id TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Geral',
    description TEXT,
    cost_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    sale_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    profit_margin_pct NUMERIC(5,2) NOT NULL DEFAULT 35.00,
    currency TEXT NOT NULL DEFAULT 'USDT',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    stock_status TEXT NOT NULL DEFAULT 'in_stock',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (supplier_code, external_product_id)
);

-- 3. Digital Orders (Pedidos e Pagamento Binance Pay ID 1257797463)
CREATE TABLE IF NOT EXISTS digital_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_code TEXT NOT NULL UNIQUE, -- ex: 'STK-7492'
    product_id UUID REFERENCES digital_products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    supplier_code TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_name TEXT,
    amount_usdt NUMERIC(10,2) NOT NULL,
    binance_pay_id TEXT NOT NULL DEFAULT '1257797463',
    binance_tx_id TEXT, -- ID do comprovante da Binance inserido pelo cliente
    status TEXT NOT NULL DEFAULT 'pending_payment', -- 'pending_payment', 'verifying', 'completed', 'failed', 'manual_review'
    delivered_item TEXT, -- Licença / Cupom / Chave entregue
    supplier_order_id TEXT, -- ID retornado pela API do fornecedor
    supplier_response JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_digital_products_active ON digital_products(is_active);
CREATE INDEX IF NOT EXISTS idx_digital_orders_code ON digital_orders(order_code);
CREATE INDEX IF NOT EXISTS idx_digital_orders_status ON digital_orders(status);

-- RLS
ALTER TABLE reseller_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_orders ENABLE ROW LEVEL SECURITY;

-- Public can view active digital products
DO $$ BEGIN
    CREATE POLICY "Public can view active digital products" 
    ON digital_products FOR SELECT USING (is_active = TRUE);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Public can create and query their own digital order by order_code
DO $$ BEGIN
    CREATE POLICY "Public can create digital orders" 
    ON digital_orders FOR INSERT WITH CHECK (TRUE);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Public can view order by code" 
    ON digital_orders FOR SELECT USING (TRUE);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Seed dos 3 Fornecedores com as Chaves de API Oficiais
INSERT INTO reseller_suppliers (code, name, base_url, api_key, currency) VALUES
('aivault', 'AIVault Hub', 'https://reseller.aivaulthub.store', 'rsk_xoRh91sYD_riS6kfzNABr3mwBwiwOzZZsNOh47ddfto', 'USD'),
('prime_digital', 'Prime Digital AI', 'https://prime-digital-ai.com', 'psk_5211cf9becc48f8950f78b4b0583c822ed1bd4a9b92f06c2', 'USD'),
('ventebot', 'VenteBot Reseller', 'https://web-production-1c7b1.up.railway.app', 'vbr_live_9807908167_nVf9QVsC1CKn0FA5aXx5Tr4OH_8hoF7IF9aHAQQMZII', 'USD')
ON CONFLICT (code) DO UPDATE SET
    api_key = EXCLUDED.api_key,
    base_url = EXCLUDED.base_url;
