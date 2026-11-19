-- ==============================================================================
-- STACKWISE — MIGRATION 004: SEED DATA
-- ==============================================================================

-- 1. Insert 10 Essential Categories
INSERT INTO categories (slug, name_pt, name_en, description_pt, description_en, icon, sort_order) VALUES
('inteligencia-artificial', 'Inteligência Artificial', 'Artificial Intelligence', 'Ferramentas de IA generativa, assistentes, visão computacional e automação cognitiva para empresas.', 'Generative AI tools, enterprise assistants, computer vision and cognitive automation for modern business.', 'Brain', 1),
('crm', 'CRM & Vendas', 'CRM & Sales', 'Sistemas de gestão de relacionamento com o cliente, pipelines de vendas e automação de contatos.', 'Customer relationship management platforms, sales pipeline tracking, and revenue operations.', 'Users', 2),
('automacao', 'Automação de Processos', 'Workflow Automation', 'Plataformas de integração no-code, webhooks, orquestração e fluxos de dados sem programação.', 'No-code integration platforms, automated pipelines, webhooks, and enterprise connectivity.', 'Cpu', 3),
('marketing-digital', 'Marketing Digital', 'Digital Marketing', 'Plataformas de análise de tráfego, SEO, campanhas multicanal e inteligência de mercado.', 'Web analytics, search engine optimization, marketing intelligence, and campaign performance.', 'TrendingUp', 4),
('email-marketing', 'E-mail Marketing', 'Email Marketing', 'Soluções de newsletters, automação de disparos, funis de nutrição e entregabilidade.', 'Email broadcast solutions, behavioral automation sequences, drip campaigns, and deliverability.', 'Mail', 5),
('produtividade', 'Produtividade & Tarefas', 'Productivity & Workspaces', 'Espaços de trabalho colaborativos, gestão de tarefas ágeis, wikis e documentação de times.', 'Collaborative team workspaces, agile project tracking, internal wikis, and document hubs.', 'CheckSquare', 6),
('gestao-empresarial', 'Gestão Empresarial (ERP)', 'Business Management (ERP)', 'Controle financeiro, emissão fiscal, faturamento e planejamento para negócios em crescimento.', 'Financial control, invoicing, reporting, resource planning, and operational dashboards.', 'BarChart3', 7),
('criacao-de-sites', 'Criação de Sites & Landing Pages', 'Website & Funnel Builders', 'Construtores visuais de páginas de alta conversão, lojas virtuais e portais sem código.', 'High-converting landing page builders, visual CMS, e-commerce storefronts, and web design engines.', 'Globe', 8),
('atendimento-ao-cliente', 'Atendimento ao Cliente', 'Customer Support & Helpdesk', 'Plataformas de tickets, chat ao vivo, suporte multicanal e bases de conhecimento com IA.', 'Help desk ticketing, live chat, conversational support bots, and self-service knowledge centers.', 'MessageSquare', 9),
('pequenas-empresas', 'Ferramentas para Pequenas Empresas', 'Small Business Essentials', 'Softwares fundamentais e acessíveis para estruturar, organizar e crescer microempresas.', 'Essential, cost-effective toolkits designed to operate, structure, and scale small businesses.', 'Briefcase', 10)
ON CONFLICT (slug) DO NOTHING;

-- 2. System Settings (Zero Budget & Strict Editorial Compliance)
INSERT INTO system_settings (key, value) VALUES
('budget_control', '{
    "budget_monthly_cap": 0.00,
    "currency": "BRL",
    "allow_auto_upgrades": false,
    "enforce_zero_cost": true,
    "last_reviewed_at": "2026-11-19T00:00:00Z"
}'::jsonb),
('editorial_policy', '{
    "require_human_approval_for_publish": true,
    "disallow_unverified_prices": true,
    "disallow_unverified_reviews": true,
    "enforce_affiliate_disclosure": true,
    "citation_required": true
}'::jsonb),
('affiliate_tracking', '{
    "rel_attributes": "sponsored nofollow noopener",
    "redirect_status_code": 307,
    "track_device_aggregate": true,
    "strip_personal_identifiers": true
}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 3. Define the 7 AI Autonomous Agents
INSERT INTO agent_definitions (code, name, role_description, is_active, hourly_rate_limit, daily_token_cap) VALUES
('AGENT_1_RESEARCHER', 'Agente 1 — Pesquisador', 'Pesquisa e descobre softwares SaaS, programas de afiliados e fontes oficiais de verificação.', TRUE, 12, 40000),
('AGENT_2_SEO', 'Agente 2 — SEO & Oportunidades', 'Analisa intenções de busca comerciais, sugere comparativos X vs Y e identifica lacunas de palavras-chave.', TRUE, 15, 30000),
('AGENT_3_EDITORIAL', 'Agente 3 — Editorial & Comparações', 'Gera rascunhos rigorosos de análises e comparações sem inventar preços ou opiniões falsas.', TRUE, 10, 50000),
('AGENT_4_AUDITOR', 'Agente 4 — Auditor Técnico & Links', 'Verifica periodicamente status HTTP de links afiliados, datas de preços e obsolescência de páginas.', TRUE, 20, 20000),
('AGENT_5_GROWTH', 'Agente 5 — Growth & Conversão', 'Monitora CTR por página, cliques em links e recomenda melhorias de posicionamento e CTAs.', TRUE, 10, 25000),
('AGENT_6_FINANCIAL', 'Agente 6 — Financeiro & Conciliação', 'Processa relatórios CSV de redes de afiliados e concilia comissões pendentes, aprovadas e pagas.', TRUE, 10, 20000),
('AGENT_7_COMMERCIAL', 'Agente 7 — Consultor Comercial', 'Recebe e qualifica interessados em desenvolvimento de sistemas personalizados, gerando briefings técnicos.', TRUE, 30, 35000)
ON CONFLICT (code) DO NOTHING;

-- 4. Initial Major Affiliate Networks
INSERT INTO affiliate_networks (name, portal_url, notes, is_active) VALUES
('Impact', 'https://impact.com', 'Rede líder internacional para grandes SaaS corporativos.', TRUE),
('PartnerStack', 'https://partnerstack.com', 'Especializada em SaaS B2B com suporte a comissões recorrentes.', TRUE),
('ShareASale', 'https://www.shareasale.com', 'Rede tradicional com ampla variedade de ferramentas e utilitários digitais.', TRUE),
('CJ Affiliate', 'https://www.cj.com', 'Plataforma global com marcas consolidadas e relatórios estruturados.', TRUE)
ON CONFLICT (name) DO NOTHING;

-- 5. Operational Cost Baseline (Documenting R$ 0,00 Initial Status)
INSERT INTO operational_costs (service_name, plan_tier, cost_brl, is_authorized, notes) VALUES
('Vercel Hosting', 'Hobby Tier', 0.00, TRUE, 'Hospedagem global gratuita com suporte a Next.js Server Components.'),
('Supabase Database', 'Free Tier', 0.00, TRUE, 'PostgreSQL 500MB com Auth, RLS e Storage.'),
('Google Gemini API', 'Free Tier (15 RPM)', 0.00, TRUE, 'API gratuita de IA para execução controlada dos 7 agentes.'),
('GitHub Actions', 'Free Tier (2000 min)', 0.00, TRUE, 'Execução agendada de rotinas de auditoria e CI.'),
('Cloudflare DNS & CDN', 'Free Plan', 0.00, TRUE, 'Segurança de borda, SSL e proteção contra requisições abusivas.')
ON CONFLICT DO NOTHING;
