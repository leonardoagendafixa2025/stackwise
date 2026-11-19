-- ==============================================================================
-- STACKWISE — MIGRATION 001: INITIAL SCHEMA (26 ENTITIES)
-- ==============================================================================

-- Enums
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'editor', 'agent');
CREATE TYPE affiliate_status AS ENUM ('discovered', 'under_review', 'application_pending', 'approved', 'rejected', 'suspended', 'terminated');
CREATE TYPE commission_status AS ENUM ('pending', 'approved', 'paid', 'reversed');
CREATE TYPE agent_task_status AS ENUM ('queued', 'running', 'completed', 'failed', 'needs_review');
CREATE TYPE content_status AS ENUM ('draft', 'in_review', 'published', 'archived');
CREATE TYPE content_type AS ENUM ('software_review', 'comparison', 'alternatives', 'guide', 'listicle', 'institutional');
CREATE TYPE lead_status AS ENUM ('new', 'qualified', 'briefing_ready', 'accepted', 'declined');

-- 1. Profiles & RBAC
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role user_role NOT NULL DEFAULT 'editor',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Categories
CREATE TABLE categories (
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

-- 3. Products (SaaS Tools)
CREATE TABLE products (
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
CREATE TABLE product_features (
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
CREATE TABLE product_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    plan_name TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'USD',
    billing_cycle TEXT NOT NULL DEFAULT 'monthly', -- 'monthly', 'annually', 'one_time', 'free'
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    has_free_trial BOOLEAN NOT NULL DEFAULT FALSE,
    trial_days INT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Product Sources
CREATE TABLE product_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    source_name TEXT NOT NULL,
    source_url TEXT NOT NULL,
    verified_by TEXT NOT NULL,
    verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes TEXT
);

-- 7. Affiliate Networks
CREATE TABLE affiliate_networks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    portal_url TEXT,
    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 8. Affiliate Programs
CREATE TABLE affiliate_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    network_id UUID REFERENCES affiliate_networks(id) ON DELETE SET NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    official_terms_url TEXT,
    commission_rate TEXT NOT NULL,
    commission_type TEXT NOT NULL DEFAULT 'percentage', -- 'percentage', 'fixed', 'hybrid'
    is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
    cookie_duration_days INT,
    payout_method TEXT,
    min_payout NUMERIC(10,2),
    status affiliate_status NOT NULL DEFAULT 'discovered',
    reviewed_at TIMESTAMPTZ,
    notes TEXT
);

-- 9. Affiliate Applications
CREATE TABLE affiliate_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES affiliate_programs(id) ON DELETE CASCADE,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    response_at TIMESTAMPTZ,
    status affiliate_status NOT NULL DEFAULT 'application_pending',
    notes TEXT
);

-- 10. Affiliate Links
CREATE TABLE affiliate_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES affiliate_programs(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    internal_slug TEXT NOT NULL UNIQUE,
    destination_url TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Affiliate Clicks
CREATE TABLE affiliate_clicks (
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
CREATE TABLE affiliate_conversions (
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
CREATE TABLE affiliate_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversion_id UUID NOT NULL REFERENCES affiliate_conversions(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status commission_status NOT NULL DEFAULT 'pending',
    payout_date TIMESTAMPTZ,
    notes TEXT
);

-- 14. Content
CREATE TABLE content (
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
CREATE TABLE content_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
    locale TEXT NOT NULL, -- 'pt-br', 'en'
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
CREATE TABLE keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keyword TEXT NOT NULL,
    locale TEXT NOT NULL DEFAULT 'pt-br',
    search_intent TEXT, -- 'commercial', 'informational', 'navigational', 'transactional'
    estimated_volume INT DEFAULT 0,
    difficulty INT DEFAULT 0,
    target_content_id UUID REFERENCES content(id) ON DELETE SET NULL,
    notes TEXT,
    UNIQUE (keyword, locale)
);

-- 17. SEO Audits
CREATE TABLE seo_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_url TEXT NOT NULL,
    locale TEXT NOT NULL DEFAULT 'pt-br',
    score_technical INT NOT NULL DEFAULT 100,
    issues JSONB NOT NULL DEFAULT '[]'::jsonb,
    recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
    audited_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. Agent Definitions
CREATE TABLE agent_definitions (
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
CREATE TABLE agent_tasks (
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
CREATE TABLE agent_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES agent_tasks(id) ON DELETE CASCADE,
    agent_code TEXT NOT NULL,
    log_level TEXT NOT NULL DEFAULT 'info',
    message TEXT NOT NULL,
    context JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 21. Scheduled Jobs
CREATE TABLE scheduled_jobs (
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
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'info', -- 'info', 'warning', 'error', 'critical'
    requires_attention BOOLEAN NOT NULL DEFAULT FALSE,
    is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 23. Operational Costs
CREATE TABLE operational_costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name TEXT NOT NULL,
    plan_tier TEXT NOT NULL DEFAULT 'Free Tier',
    cost_brl NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    billing_date DATE,
    is_authorized BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT
);

-- 24. System Settings
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 25. Project Leads (Custom Systems Demand)
CREATE TABLE project_leads (
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
CREATE TABLE project_briefings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES project_leads(id) ON DELETE CASCADE,
    technical_scope JSONB NOT NULL DEFAULT '{}'::jsonb,
    estimated_hours INT,
    complexity_level TEXT NOT NULL DEFAULT 'medium',
    ai_recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance & high-scale search
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_published ON products(is_published);
CREATE INDEX idx_affiliate_links_slug ON affiliate_links(internal_slug);
CREATE INDEX idx_affiliate_clicks_link ON affiliate_clicks(link_id, created_at);
CREATE INDEX idx_content_slug ON content(slug);
CREATE INDEX idx_content_translations_locale ON content_translations(locale, status);
CREATE INDEX idx_agent_tasks_status ON agent_tasks(status, agent_id);
CREATE INDEX idx_notifications_attention ON notifications(requires_attention, is_resolved);
