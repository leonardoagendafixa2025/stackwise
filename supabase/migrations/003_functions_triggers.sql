-- ==============================================================================
-- STACKWISE — MIGRATION 003: FUNCTIONS & TRIGGERS
-- ==============================================================================

-- 1. Atomic Affiliate Click Logger & Redirector Resolver
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
    -- Locate active link
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

    -- Log click asynchronously / atomically
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

-- 2. Budget Lock Trigger (Prevents Unauthorized Paid Service Additions)
CREATE OR REPLACE FUNCTION enforce_zero_budget_lock()
RETURNS TRIGGER AS $$
DECLARE
    v_budget_cap NUMERIC;
BEGIN
    SELECT COALESCE((value->>'budget_monthly_cap')::NUMERIC, 0.00)
    INTO v_budget_cap
    FROM system_settings
    WHERE key = 'budget_control';

    IF NEW.cost_brl > 0 AND (NEW.is_authorized IS NOT TRUE OR NEW.cost_brl > v_budget_cap) THEN
        RAISE EXCEPTION 'STACKWISE VIOLATION: Operação tarifada de R$ % rejeitada. Orçamento autorizado atual é de R$ %',
            NEW.cost_brl, COALESCE(v_budget_cap, 0.00);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_operational_costs
    BEFORE INSERT OR UPDATE ON operational_costs
    FOR EACH ROW
    EXECUTE FUNCTION enforce_zero_budget_lock();

-- 3. Notification Dispatcher on Critical Events
CREATE OR REPLACE FUNCTION trigger_lead_notification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (
        type,
        title,
        message,
        severity,
        requires_attention,
        action_url
    ) VALUES (
        'LEAD_RECEIVED',
        'Novo Projeto Solicitado: ' || NEW.contact_name,
        'Lead recebido com resumo: ' || SUBSTRING(NEW.project_summary FROM 1 FOR 80) || '...',
        'info',
        TRUE,
        '/admin/leads'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_new_lead_notification
    AFTER INSERT ON project_leads
    FOR EACH ROW
    EXECUTE FUNCTION trigger_lead_notification();
