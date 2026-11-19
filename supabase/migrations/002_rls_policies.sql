-- ==============================================================================
-- STACKWISE — MIGRATION 002: ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
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

-- Helper function: Get current user role
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS user_role AS $$
    SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- 1. PROFILES POLICIES
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Owners and Admins can view all profiles"
    ON profiles FOR SELECT
    USING (get_current_user_role() IN ('owner', 'admin'));

CREATE POLICY "Only Owners can modify roles"
    ON profiles FOR UPDATE
    USING (get_current_user_role() = 'owner');

-- -----------------------------------------------------------------------------
-- 2. PUBLIC READ POLICIES (Catalog & Editorial)
-- -----------------------------------------------------------------------------
CREATE POLICY "Public can view active categories"
    ON categories FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Public can view published products"
    ON products FOR SELECT
    USING (is_published = TRUE);

CREATE POLICY "Public can view features of published products"
    ON product_features FOR SELECT
    USING (EXISTS (SELECT 1 FROM products WHERE products.id = product_features.product_id AND products.is_published = TRUE));

CREATE POLICY "Public can view active prices of published products"
    ON product_prices FOR SELECT
    USING (is_active = TRUE AND EXISTS (SELECT 1 FROM products WHERE products.id = product_prices.product_id AND products.is_published = TRUE));

CREATE POLICY "Public can view sources of published products"
    ON product_sources FOR SELECT
    USING (EXISTS (SELECT 1 FROM products WHERE products.id = product_sources.product_id AND products.is_published = TRUE));

CREATE POLICY "Public can view published content"
    ON content FOR SELECT
    USING (EXISTS (SELECT 1 FROM content_translations WHERE content_translations.content_id = content.id AND content_translations.status = 'published'));

CREATE POLICY "Public can view published translations"
    ON content_translations FOR SELECT
    USING (status = 'published');

CREATE POLICY "Public can view active affiliate links for redirect"
    ON affiliate_links FOR SELECT
    USING (is_active = TRUE);

-- -----------------------------------------------------------------------------
-- 3. PUBLIC INSERT POLICIES (Clicks & Leads)
-- -----------------------------------------------------------------------------
CREATE POLICY "Public can log affiliate clicks"
    ON affiliate_clicks FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY "Public can submit project leads"
    ON project_leads FOR INSERT
    WITH CHECK (TRUE);

-- -----------------------------------------------------------------------------
-- 4. STAFF & EDITORIAL POLICIES (Owner, Admin, Editor)
-- -----------------------------------------------------------------------------
CREATE POLICY "Staff can view and edit categories"
    ON categories FOR ALL
    USING (get_current_user_role() IN ('owner', 'admin', 'editor'));

CREATE POLICY "Staff can view and edit products"
    ON products FOR ALL
    USING (get_current_user_role() IN ('owner', 'admin', 'editor'));

CREATE POLICY "Staff can view and edit product features"
    ON product_features FOR ALL
    USING (get_current_user_role() IN ('owner', 'admin', 'editor'));

CREATE POLICY "Staff can view and edit product prices"
    ON product_prices FOR ALL
    USING (get_current_user_role() IN ('owner', 'admin', 'editor'));

CREATE POLICY "Staff can view and edit product sources"
    ON product_sources FOR ALL
    USING (get_current_user_role() IN ('owner', 'admin', 'editor'));

CREATE POLICY "Staff can manage content and translations"
    ON content FOR ALL
    USING (get_current_user_role() IN ('owner', 'admin', 'editor'));

CREATE POLICY "Staff can manage content_translations"
    ON content_translations FOR ALL
    USING (get_current_user_role() IN ('owner', 'admin', 'editor'));

CREATE POLICY "Staff can view and manage keywords"
    ON keywords FOR ALL
    USING (get_current_user_role() IN ('owner', 'admin', 'editor'));

CREATE POLICY "Staff can view SEO audits"
    ON seo_audits FOR ALL
    USING (get_current_user_role() IN ('owner', 'admin', 'editor'));

-- -----------------------------------------------------------------------------
-- 5. ADMINISTRATIVE & FINANCIAL RESTRICTIONS (Owner & Admin ONLY)
-- -----------------------------------------------------------------------------
CREATE POLICY "Admins manage affiliate networks and programs"
    ON affiliate_networks FOR ALL
    USING (get_current_user_role() IN ('owner', 'admin'));

CREATE POLICY "Admins manage affiliate programs"
    ON affiliate_programs FOR ALL
    USING (get_current_user_role() IN ('owner', 'admin'));

CREATE POLICY "Admins manage affiliate applications"
    ON affiliate_applications FOR ALL
    USING (get_current_user_role() IN ('owner', 'admin'));

CREATE POLICY "Admins manage affiliate links"
    ON affiliate_links FOR ALL
    USING (get_current_user_role() IN ('owner', 'admin'));

CREATE POLICY "Admins view affiliate clicks"
    ON affiliate_clicks FOR SELECT
    USING (get_current_user_role() IN ('owner', 'admin'));

CREATE POLICY "Admins manage conversions and commissions"
    ON affiliate_conversions FOR ALL
    USING (get_current_user_role() IN ('owner', 'admin'));

CREATE POLICY "Admins manage affiliate commissions"
    ON affiliate_commissions FOR ALL
    USING (get_current_user_role() IN ('owner', 'admin'));

CREATE POLICY "Admins view and manage operational costs"
    ON operational_costs FOR ALL
    USING (get_current_user_role() IN ('owner', 'admin'));

CREATE POLICY "Admins manage system settings"
    ON system_settings FOR ALL
    USING (get_current_user_role() IN ('owner', 'admin'));

CREATE POLICY "Admins manage project leads and briefings"
    ON project_leads FOR ALL
    USING (get_current_user_role() IN ('owner', 'admin'));

CREATE POLICY "Admins manage project briefings"
    ON project_briefings FOR ALL
    USING (get_current_user_role() IN ('owner', 'admin'));

CREATE POLICY "Staff can view notifications"
    ON notifications FOR ALL
    USING (get_current_user_role() IN ('owner', 'admin', 'editor'));

-- -----------------------------------------------------------------------------
-- 6. AGENT SYSTEM PERMISSIONS (Owner, Admin & Agent)
-- -----------------------------------------------------------------------------
CREATE POLICY "Staff and Agents can view agent definitions"
    ON agent_definitions FOR SELECT
    USING (get_current_user_role() IN ('owner', 'admin', 'editor', 'agent'));

CREATE POLICY "Agents can update their own tasks"
    ON agent_tasks FOR ALL
    USING (get_current_user_role() IN ('owner', 'admin', 'agent'));

CREATE POLICY "Agents can insert logs"
    ON agent_logs FOR ALL
    USING (get_current_user_role() IN ('owner', 'admin', 'agent'));

CREATE POLICY "Admins manage scheduled jobs"
    ON scheduled_jobs FOR ALL
    USING (get_current_user_role() IN ('owner', 'admin'));
