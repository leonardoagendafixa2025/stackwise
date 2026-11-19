-- ==============================================================================
-- STACKWISE — MASTER MIGRATION SCRIPT (EXECUTE NO SQL EDITOR DO SUPABASE)
-- Contém: 26 Tabelas + RLS Completo + Funções de Redirecionamento + Seed Inicial
-- ==============================================================================

-- -----------------------------------------------------------------------------
-- 1. ENUMS
-- -----------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('owner', 'admin', 'editor', 'agent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE affiliate_status AS ENUM ('discovered', 'under_review', 'application_pending', 'approved', 'rejected', 'suspended', 'terminated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE commission_status AS ENUM ('pending', 'approved', 'paid', 'reversed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE agent_task_status AS ENUM ('queued', 'running', 'completed', 'failed', 'needs_review');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE content_status AS ENUM ('draft', 'in_review', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE content_type AS ENUM ('software_review', 'comparison', 'alternatives', 'guide', 'listicle', 'institutional');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE lead_status AS ENUM ('new', 'qualified', 'briefing_ready', 'accepted', 'declined');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- -----------------------------------------------------------------------------
-- 2. TABELAS
-- -----------------------------------------------------------------------------

-- 1. Profiles & RBAC
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role user_role NOT NULL DEFAULT 'editor',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Categories
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name_pt TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description_pt TEXT,
    description_en TEXT,
    icon TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Products
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    logo_url TEXT,
    short_description_pt TEXT NOT NULL,
    short_description_en TEXT NOT NULL,
    full_description_pt TEXT,
    full_description_en TEXT,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    official_website TEXT NOT NULL,
    free_plan_available BOOLEAN NOT NULL DEFAULT FALSE,
    free_trial_days INT,
    rating_editorial NUMERIC(3,2) NOT NULL DEFAULT 4.50,
    last_verified_at TIMESTAMPTZ,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Product Features
CREATE TABLE IF NOT EXISTS product_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    feature_key TEXT NOT NULL,
    name_pt TEXT NOT NULL,
    name_en TEXT NOT NULL,
    is_supported BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT,
    UNIQUE (product_id, feature_key)
);

-- 5. Product Prices
CREATE TABLE IF NOT EXISTS product_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    plan_name TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'USD',
    billing_cycle TEXT NOT NULL DEFAULT 'monthly',
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    has_free_trial BOOLEAN NOT NULL DEFAULT FALSE,
    trial_days INT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Product Sources
CREATE TABLE IF NOT EXISTS product_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    source_name TEXT NOT NULL,
    source_url TEXT NOT NULL,
    verified_by TEXT NOT NULL,
    verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes TEXT
);

-- 7. Affiliate Networks
CREATE TABLE IF NOT EXISTS affiliate_networks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    portal_url TEXT,
    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 8. Affiliate Programs
CREATE TABLE IF NOT EXISTS affiliate_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    network_id UUID REFERENCES affiliate_networks(id) ON DELETE SET NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    official_terms_url TEXT,
    commission_rate TEXT NOT NULL,
    commission_type TEXT NOT NULL DEFAULT 'percentage',
    is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
    cookie_duration_days INT,
    payout_method TEXT,
    min_payout NUMERIC(10,2),
    status affiliate_status NOT NULL DEFAULT 'discovered',
    reviewed_at TIMESTAMPTZ,
    notes TEXT
);

-- 9. Affiliate Applications
CREATE TABLE IF NOT EXISTS affiliate_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES affiliate_programs(id) ON DELETE CASCADE,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    response_at TIMESTAMPTZ,
    status affiliate_status NOT NULL DEFAULT 'application_pending',
    notes TEXT
);

-- 10. Affiliate Links
CREATE TABLE IF NOT EXISTS affiliate_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES affiliate_programs(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    internal_slug TEXT NOT NULL UNIQUE,
    destination_url TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Affiliate Clicks
CREATE TABLE IF NOT EXISTS affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    link_id UUID NOT NULL REFERENCES affiliate_links(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    referer TEXT,
    user_agent TEXT,
    device_type TEXT,
    country_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Affiliate Conversions
CREATE TABLE IF NOT EXISTS affiliate_conversions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    link_id UUID NOT NULL REFERENCES affiliate_links(id) ON DELETE CASCADE,
    external_conversion_id TEXT,
    amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    commission_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'USD',
    status commission_status NOT NULL DEFAULT 'pending',
    conversion_date TIMESTAMPTZ NOT NULL,
    reported_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Affiliate Commissions
CREATE TABLE IF NOT EXISTS affiliate_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversion_id UUID NOT NULL REFERENCES affiliate_conversions(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status commission_status NOT NULL DEFAULT 'pending',
    payout_date TIMESTAMPTZ,
    notes TEXT
);

-- 14. Content
CREATE TABLE IF NOT EXISTS content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    type content_type NOT NULL,
    primary_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    secondary_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    target_category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. Content Translations
CREATE TABLE IF NOT EXISTS content_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
    locale TEXT NOT NULL,
    title TEXT NOT NULL,
    meta_title TEXT NOT NULL,
    meta_description TEXT NOT NULL,
    content_markdown TEXT NOT NULL,
    status content_status NOT NULL DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (content_id, locale)
);

-- 16. Keywords
CREATE TABLE IF NOT EXISTS keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keyword TEXT NOT NULL,
    locale TEXT NOT NULL DEFAULT 'pt-br',
    search_intent TEXT,
    estimated_volume INT DEFAULT 0,
    difficulty INT DEFAULT 0,
    target_content_id UUID REFERENCES content(id) ON DELETE SET NULL,
    notes TEXT,
    UNIQUE (keyword, locale)
);

-- 17. SEO Audits
CREATE TABLE IF NOT EXISTS seo_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_url TEXT NOT NULL,
    locale TEXT NOT NULL DEFAULT 'pt-br',
    score_technical INT NOT NULL DEFAULT 100,
    issues JSONB NOT NULL DEFAULT '[]'::jsonb,
    recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
    audited_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. Agent Definitions
CREATE TABLE IF NOT EXISTS agent_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role_description TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    hourly_rate_limit INT NOT NULL DEFAULT 10,
    daily_token_cap INT NOT NULL DEFAULT 50000,
    current_daily_tokens INT NOT NULL DEFAULT 0
);

-- 19. Agent Tasks
CREATE TABLE IF NOT EXISTS agent_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES agent_definitions(id) ON DELETE CASCADE,
    task_type TEXT NOT NULL,
    input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_payload JSONB,
    status agent_task_status NOT NULL DEFAULT 'queued',
    error_message TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    retry_count INT NOT NULL DEFAULT 0
);

-- 20. Agent Logs
CREATE TABLE IF NOT EXISTS agent_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES agent_tasks(id) ON DELETE CASCADE,
    agent_code TEXT NOT NULL,
    log_level TEXT NOT NULL DEFAULT 'info',
    message TEXT NOT NULL,
    context JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 21. Scheduled Jobs
CREATE TABLE IF NOT EXISTS scheduled_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    cron_expression TEXT NOT NULL,
    agent_id UUID REFERENCES agent_definitions(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_run_at TIMESTAMPTZ,
    next_run_at TIMESTAMPTZ,
    status TEXT DEFAULT 'idle'
);

-- 22. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'info',
    requires_attention BOOLEAN NOT NULL DEFAULT FALSE,
    is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 23. Operational Costs
CREATE TABLE IF NOT EXISTS operational_costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name TEXT NOT NULL,
    plan_tier TEXT NOT NULL DEFAULT 'Free Tier',
    cost_brl NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    billing_date DATE,
    is_authorized BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT
);

-- 24. System Settings
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 25. Project Leads
CREATE TABLE IF NOT EXISTS project_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    company_name TEXT,
    project_summary TEXT NOT NULL,
    budget_range TEXT,
    status lead_status NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 26. Project Briefings
CREATE TABLE IF NOT EXISTS project_briefings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES project_leads(id) ON DELETE CASCADE,
    technical_scope JSONB NOT NULL DEFAULT '{}'::jsonb,
    estimated_hours INT,
    complexity_level TEXT NOT NULL DEFAULT 'medium',
    ai_recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. INDEXES
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_published ON products(is_published);
CREATE INDEX IF NOT EXISTS idx_affiliate_links_slug ON affiliate_links(internal_slug);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_link ON affiliate_clicks(link_id, created_at);
CREATE INDEX IF NOT EXISTS idx_content_slug ON content(slug);
CREATE INDEX IF NOT EXISTS idx_content_translations_locale ON content_translations(locale, status);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_status ON agent_tasks(status, agent_id);
CREATE INDEX IF NOT EXISTS idx_notifications_attention ON notifications(requires_attention, is_resolved);

-- -----------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS)
-- -----------------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE operational_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_briefings ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS user_role AS $$
    SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Public Access
DO $$ BEGIN
    CREATE POLICY "Public can view active categories" ON categories FOR SELECT USING (is_active = TRUE);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Public can view published products" ON products FOR SELECT USING (is_published = TRUE);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Public can view active affiliate links for redirect" ON affiliate_links FOR SELECT USING (is_active = TRUE);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Public can log affiliate clicks" ON affiliate_clicks FOR INSERT WITH CHECK (TRUE);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Public can submit project leads" ON project_leads FOR INSERT WITH CHECK (TRUE);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- -----------------------------------------------------------------------------
-- 5. FUNÇÕES & TRIGGERS
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION log_affiliate_click_and_resolve(
    p_internal_slug TEXT,
    p_referer TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_device_type TEXT DEFAULT NULL,
    p_country_code TEXT DEFAULT NULL
)
RETURNS TABLE (
    destination_url TEXT,
    product_name TEXT,
    is_valid BOOLEAN
) AS $$
DECLARE
    v_link_id UUID;
    v_product_id UUID;
    v_dest_url TEXT;
    v_prod_name TEXT;
BEGIN
    SELECT l.id, l.product_id, l.destination_url, p.name
    INTO v_link_id, v_product_id, v_dest_url, v_prod_name
    FROM affiliate_links l
    JOIN products p ON p.id = l.product_id
    WHERE l.internal_slug = p_internal_slug
      AND l.is_active = TRUE
      AND p.is_published = TRUE
    LIMIT 1;

    IF v_link_id IS NULL THEN
        RETURN QUERY SELECT NULL::TEXT, NULL::TEXT, FALSE;
        RETURN;
    END IF;

    INSERT INTO affiliate_clicks (
        link_id,
        product_id,
        referer,
        user_agent,
        device_type,
        country_code
    ) VALUES (
        v_link_id,
        v_product_id,
        p_referer,
        p_user_agent,
        p_device_type,
        p_country_code
    );

    RETURN QUERY SELECT v_dest_url, v_prod_name, TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- 6. SEED DATA
-- -----------------------------------------------------------------------------
INSERT INTO categories (slug, name_pt, name_en, description_pt, description_en, icon, sort_order) VALUES
('inteligencia-artificial', 'Inteligência Artificial', 'Artificial Intelligence', 'Ferramentas de IA generativa, assistentes e automação cognitiva para empresas.', 'Generative AI tools, enterprise assistants and cognitive automation.', 'Brain', 1),
('crm', 'CRM & Vendas', 'CRM & Sales', 'Sistemas de gestão de clientes, pipelines de vendas e automação de contatos.', 'Customer relationship management platforms and sales pipeline tracking.', 'Users', 2),
('automacao', 'Automação de Processos', 'Workflow Automation', 'Plataformas de integração no-code, webhooks e fluxos de dados sem código.', 'No-code integration platforms, automated pipelines and webhooks.', 'Cpu', 3),
('marketing-digital', 'Marketing Digital', 'Digital Marketing', 'Plataformas de análise de tráfego, SEO e campanhas multicanal.', 'Web analytics, search engine optimization and marketing intelligence.', 'TrendingUp', 4),
('email-marketing', 'E-mail Marketing', 'Email Marketing', 'Soluções de newsletters, automação de disparos e funis de nutrição.', 'Email broadcast solutions, behavioral automation sequences and newsletters.', 'Mail', 5),
('produtividade', 'Produtividade & Tarefas', 'Productivity & Workspaces', 'Espaços colaborativos, gestão de tarefas ágeis e documentação de times.', 'Collaborative team workspaces, agile project tracking and internal wikis.', 'CheckSquare', 6),
('gestao-empresarial', 'Gestão Empresarial (ERP)', 'Business Management (ERP)', 'Controle financeiro, emissão fiscal e faturamento para negócios.', 'Financial control, invoicing and operational management.', 'BarChart3', 7),
('criacao-de-sites', 'Criação de Sites & Landing Pages', 'Website & Funnel Builders', 'Construtores de páginas de alta conversão e lojas virtuais sem código.', 'High-converting landing page builders and visual CMS.', 'Globe', 8),
('atendimento-ao-cliente', 'Atendimento ao Cliente', 'Customer Support & Helpdesk', 'Plataformas de tickets, chat ao vivo e suporte com IA.', 'Help desk ticketing, live chat and conversational support bots.', 'MessageSquare', 9),
('pequenas-empresas', 'Ferramentas para Pequenas Empresas', 'Small Business Essentials', 'Softwares fundamentais e acessíveis para estruturar e crescer microempresas.', 'Essential, cost-effective toolkits to operate small businesses.', 'Briefcase', 10)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO system_settings (key, value) VALUES
('budget_control', '{"budget_monthly_cap": 0.00, "currency": "BRL", "allow_auto_upgrades": false}'::jsonb),
('editorial_policy', '{"require_human_approval_for_publish": true, "disallow_unverified_prices": true}'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO agent_definitions (code, name, role_description, is_active, hourly_rate_limit, daily_token_cap) VALUES
('AGENT_1_RESEARCHER', 'Agente 1 — Pesquisador', 'Pesquisa e descobre softwares SaaS, programas de afiliados e fontes oficiais.', TRUE, 12, 40000),
('AGENT_2_SEO', 'Agente 2 — SEO & Oportunidades', 'Analisa intenções de busca comerciais e sugere comparativos X vs Y.', TRUE, 15, 30000),
('AGENT_3_EDITORIAL', 'Agente 3 — Editorial & Comparações', 'Gera rascunhos de análises e comparações sem inventar preços.', TRUE, 10, 50000),
('AGENT_4_AUDITOR', 'Agente 4 — Auditor Técnico & Links', 'Verifica periodicamente status HTTP de links afiliados e obsolescência.', TRUE, 20, 20000),
('AGENT_5_GROWTH', 'Agente 5 — Growth & Conversão', 'Monitora CTR por página e cliques em links de parceiros.', TRUE, 10, 25000),
('AGENT_6_FINANCIAL', 'Agente 6 — Financeiro & Conciliação', 'Processa relatórios CSV de redes de afiliados e concilia comissões.', TRUE, 10, 20000),
('AGENT_7_COMMERCIAL', 'Agente 7 — Consultor Comercial', 'Recebe e qualifica interessados em desenvolvimento sob medida.', TRUE, 30, 35000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO operational_costs (service_name, plan_tier, cost_brl, is_authorized, notes) VALUES
('Vercel Hosting', 'Hobby Tier', 0.00, TRUE, 'Hospedagem global gratuita com suporte a Next.js Server Components.'),
('Supabase Database', 'Free Tier', 0.00, TRUE, 'PostgreSQL 500MB com Auth, RLS e Storage.'),
('Google Gemini API', 'Free Tier (15 RPM)', 0.00, TRUE, 'API gratuita de IA para execução controlada dos 7 agentes.')
ON CONFLICT DO NOTHING;
