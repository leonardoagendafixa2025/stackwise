import fs from "fs";
import { createClient } from "@supabase/supabase-js";

// Load .env.local
const envContent = fs.readFileSync(".env.local", "utf-8");
const env = Object.fromEntries(
  envContent
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const idx = l.indexOf("=");
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    })
);

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || "https://dvjvhufcjfhxbvmogazz.supabase.co";
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

async function run() {
  console.log("=== SEEDING RICH ECOSYSTEM (STACKWISE PRO) ===");

  // 1. Fetch categories map
  const { data: categories, error: catErr } = await supabase.from("categories").select("id, slug");
  if (catErr || !categories) {
    console.error("Categories error:", catErr);
    return;
  }
  const catMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]));
  console.log(`Loaded ${categories.length} categories.`);

  // 2. Fetch networks
  const { data: nets } = await supabase.from("affiliate_networks").select("id, name");
  const netMap = Object.fromEntries((nets || []).map((n) => [n.name, n.id]));
  const defaultNetworkId = netMap["Impact"] || (nets && nets[0]?.id);

  // 3. Expanded Catalog of SaaS Tools across ALL 10 Categories
  const productsToSeed = [
    // Inteligência Artificial
    {
      slug: "chatgpt-enterprise",
      name: "ChatGPT Enterprise",
      category_id: catMap["inteligencia-artificial"],
      official_website: "https://openai.com/chatgpt/enterprise",
      free_plan_available: true,
      free_trial_days: null,
      rating_editorial: 4.95,
      is_featured: true,
      is_published: true,
      short_description_pt: "Líder global em inteligência artificial generativa com segurança corporativa de nível bancário e modelos GPT-4o.",
      short_description_en: "Leading generative AI platform with enterprise-grade data privacy, unlimited high-speed GPT-4o access and admin controls.",
      full_description_pt: "O ChatGPT Enterprise oferece modelos de linguagem de ponta sem retenção de dados para treinamento, janelas de contexto expandidas e workspaces colaborativos com criptografia ponta a ponta.",
      full_description_en: "ChatGPT Enterprise provides uncompromised security, dedicated analytics consoles, and custom GPT bots for business workflows.",
      prices: [
        { plan_name: "Free Tier", price: 0, features: ["Acesso padrão GPT-4o mini", "Navegação web limitada", "Criação básica de texto"] },
        { plan_name: "Plus", price: 20, features: ["Acesso prioritário GPT-4o", "Geração de imagens DALL-E", "Análise avançada de dados", "Criação de GPTs personalizados"] },
        { plan_name: "Enterprise", price: 60, features: ["Privacidade de dados garantida", "Janela de contexto de 128k", "Console de auditoria e SSO", "Velocidade ilimitada"] },
      ],
      affiliateRate: "20% por indicação qualificada"
    },
    {
      slug: "claude-ai",
      name: "Claude by Anthropic",
      category_id: catMap["inteligencia-artificial"],
      official_website: "https://anthropic.com/claude",
      free_plan_available: true,
      free_trial_days: null,
      rating_editorial: 4.92,
      is_featured: true,
      is_published: true,
      short_description_pt: "IA de raciocínio de alta precisão com janela de contexto de 200k tokens e capacidade analítica excepcional.",
      short_description_en: "Next-generation AI assistant built by Anthropic with 200k token context, state-of-the-art coding and nuanced reasoning.",
      full_description_pt: "O modelo Claude 3.5 Sonnet é amplamente considerado o melhor modelo do mundo para engenharia de software, análise de contratos jurídicos e síntese de relatórios densos.",
      full_description_en: "Claude 3.5 Sonnet leads global benchmarks in coding benchmarks, complex document parsing and ethical enterprise alignment.",
      prices: [
        { plan_name: "Free", price: 0, features: ["Acesso a Claude Sonnet", "Janela de contexto padrão", "Upload de documentos"] },
        { plan_name: "Pro", price: 20, features: ["5x mais capacidade de uso", "Acesso prioritário nos picos", "Acesso antecipado a novos modelos"] },
        { plan_name: "Team", price: 30, features: ["Faturamento centralizado", "Console administrativo", "Colaboração entre membros"] },
      ],
      affiliateRate: "25% de comissão recorrente"
    },

    // CRM & Vendas
    {
      slug: "salesforce-sales-cloud",
      name: "Salesforce Sales Cloud",
      category_id: catMap["crm"],
      official_website: "https://salesforce.com",
      free_plan_available: false,
      free_trial_days: 30,
      rating_editorial: 4.75,
      is_featured: false,
      is_published: true,
      short_description_pt: "O ecossistema de CRM mais poderoso e escalável do mercado corporativo global com previsão de receitas via IA.",
      short_description_en: "The world's most comprehensive enterprise CRM suite featuring AI forecasting, deep automation, and AppExchange integrations.",
      full_description_pt: "Salesforce Sales Cloud une gestão de oportunidades, inteligência de pipeline Einstein AI e automação de processos complexos para times de alto desempenho.",
      full_description_en: "Salesforce Sales Cloud empowers enterprise sales teams with AI-driven insights, multi-currency support, and limitless customizations.",
      prices: [
        { plan_name: "Starter Suite", price: 25, features: ["Gestão de contatos", "Pipeline de vendas", "Rastreamento de e-mails"] },
        { plan_name: "Professional", price: 80, features: ["Previsão de vendas", "Pipelines ilimitados", "Regras de pontuação de leads"] },
      ],
      affiliateRate: "R$ 150 por lead qualificado"
    },
    {
      slug: "pipedrive",
      name: "Pipedrive",
      category_id: catMap["crm"],
      official_website: "https://pipedrive.com",
      free_plan_available: false,
      free_trial_days: 14,
      rating_editorial: 4.80,
      is_featured: true,
      is_published: true,
      short_description_pt: "CRM visual intuitivo desenhado por vendedores para vendedores, focado em alta conversão e produtividade de fechamento.",
      short_description_en: "Pipeline CRM designed by salespeople to boost deal closing rates through clear visual staging and activity automation.",
      full_description_pt: "Com interface no formato Kanban e automação de acompanhamento, o Pipedrive elimina atritos para pequenas e médias equipes de vendas.",
      full_description_en: "Pipedrive keeps sales teams organized with visual deal cards, automated email sequences, and native mobile apps.",
      prices: [
        { plan_name: "Essential", price: 14, features: ["Gestão de leads e negócios", "Pipelines personalizáveis", "Suporte 24/7"] },
        { plan_name: "Advanced", price: 29, features: ["Sincronização de e-mails de 2 vias", "Automação de fluxos de trabalho", "Relatórios de metas"] },
      ],
      affiliateRate: "33% recorrente no primeiro ano"
    },

    // Automação No-Code
    {
      slug: "zapier",
      name: "Zapier",
      category_id: catMap["automacao"],
      official_website: "https://zapier.com",
      free_plan_available: true,
      free_trial_days: 14,
      rating_editorial: 4.85,
      is_featured: true,
      is_published: true,
      short_description_pt: "A maior biblioteca de conectores de aplicativos do planeta com mais de 7.000 ferramentas prontas para integrar.",
      short_description_en: "The standard in no-code app integration connecting 7,000+ business applications with easy automated Zaps.",
      full_description_pt: "O Zapier conecta ferramentas populares como Google Sheets, Slack, Stripe e Trello em segundos, sem necessidade de configuração de servidores.",
      full_description_en: "Zapier empowers non-technical operators to build multi-step automated workflows with error notifications and conditional branching.",
      prices: [
        { plan_name: "Free Forever", price: 0, features: ["100 tarefas/mês", "Zaps de etapa única", "Atualização a cada 15 min"] },
        { plan_name: "Starter", price: 19.99, features: ["750 tarefas/mês", "Zaps com múltiplas etapas", "Webhooks e filtros"] },
        { plan_name: "Professional", price: 49, features: ["2.000 tarefas/mês", "Lógica condicional ilimitada", "Resoluções em 2 minutos"] },
      ],
      affiliateRate: "20% recorrente no primeiro ano"
    },
    {
      slug: "n8n",
      name: "n8n",
      category_id: catMap["automacao"],
      official_website: "https://n8n.io",
      free_plan_available: true,
      free_trial_days: 14,
      rating_editorial: 4.90,
      is_featured: false,
      is_published: true,
      short_description_pt: "Plataforma de automação técnica self-hosted e na nuvem voltada para desenvolvedores e arquitetos de dados.",
      short_description_en: "Fair-code technical workflow automation engine with native LangChain AI agents, custom JavaScript/Python execution and self-hosting.",
      full_description_pt: "O n8n se destaca pelo modelo de código aberto que permite hospedar em servidor próprio sem pagar por execução, além de nós avançados para orquestração de LLMs.",
      full_description_en: "n8n offers maximum control with on-premise deployment, AI orchestration nodes, and zero vendor lock-in.",
      prices: [
        { plan_name: "Self-Hosted Community", price: 0, features: ["Execuções ilimitadas", "Código aberto", "Comunidade Discord"] },
        { plan_name: "Starter Cloud", price: 20, features: ["2.500 execuções de fluxo", "Hospedagem gerenciada", "Suporte técnico"] },
      ],
      affiliateRate: "30% no primeiro ano"
    },

    // E-mail Marketing
    {
      slug: "mailchimp",
      name: "Mailchimp",
      category_id: catMap["email-marketing"],
      official_website: "https://mailchimp.com",
      free_plan_available: true,
      free_trial_days: 30,
      rating_editorial: 4.65,
      is_featured: false,
      is_published: true,
      short_description_pt: "A plataforma de newsletters e campanhas de e-mail mais popular do mundo, ideal para marcas e lojas virtuais.",
      short_description_en: "The world's benchmark email marketing platform with drag-and-drop templates, audience segmentation, and analytics.",
      full_description_pt: "O Mailchimp une templates elegantes, formulários de captura, testes A/B e relatórios de abertura com alta entregabilidade.",
      full_description_en: "Mailchimp delivers intuitive visual campaign builders, behavioral targeting, and seamless e-commerce store sync.",
      prices: [
        { plan_name: "Free", price: 0, features: ["Até 500 contatos", "1.000 envios/mês", "Templates pré-construídos"] },
        { plan_name: "Essentials", price: 13, features: ["Suporte 24/7 por chat", "Testes A/B", "Remoção do selo Mailchimp"] },
      ],
      affiliateRate: "US$ 30 por nova conta ativada"
    },
    {
      slug: "brevo",
      name: "Brevo (Sendinblue)",
      category_id: catMap["email-marketing"],
      official_website: "https://brevo.com",
      free_plan_available: true,
      free_trial_days: null,
      rating_editorial: 4.82,
      is_featured: true,
      is_published: true,
      short_description_pt: "Excelente custo-benefício que cobra por volume de e-mails enviados em vez do número de contatos na base.",
      short_description_en: "Cost-effective CRM, WhatsApp, SMS and email marketing platform charging by volume sent rather than contact count.",
      full_description_pt: "O Brevo permite armazenar contatos ilimitados gratuitamente, oferecendo e-mails transacionais via API, automações e campanhas de SMS/WhatsApp integradas.",
      full_description_en: "Brevo provides unlimited subscriber storage on all tiers, making it the most affordable high-deliverability platform.",
      prices: [
        { plan_name: "Free", price: 0, features: ["Contatos ilimitados", "300 e-mails por dia", "Editor de templates visual"] },
        { plan_name: "Starter", price: 25, features: ["20.000 e-mails/mês", "Sem limite diário de envio", "Relatórios avançados"] },
      ],
      affiliateRate: "€ 5 por conta grátis + € 100 por upgrade"
    },

    // Produtividade & Tarefas
    {
      slug: "clickup",
      name: "ClickUp",
      category_id: catMap["produtividade"],
      official_website: "https://clickup.com",
      free_plan_available: true,
      free_trial_days: null,
      rating_editorial: 4.86,
      is_featured: true,
      is_published: true,
      short_description_pt: "O 'um app para substituir todos': tarefas, documentos, metas, cronogramas e bate-papo em uma única tela.",
      short_description_en: "All-in-one productivity platform uniting tasks, docs, chat, goals and whiteboards with customizable sprint views.",
      full_description_pt: "O ClickUp oferece personalização granular com visualizações em Lista, Quadro, Gantt e Calendário, ideal para times ágeis e squads de engenharia.",
      full_description_en: "ClickUp consolidates project tracking, automated assignments, and cross-department collaboration in one hub.",
      prices: [
        { plan_name: "Free Forever", price: 0, features: ["Tarefas ilimitadas", "Membros ilimitados", "100MB de armazenamento"] },
        { plan_name: "Unlimited", price: 7, features: ["Armazenamento ilimitado", "Visualização Gantt", "Campos personalizados"] },
        { plan_name: "Business", price: 12, features: ["Autenticação Google SSO", "Exportação avançada", "Gestão de carga de trabalho"] },
      ],
      affiliateRate: "30% recorrente no primeiro ano"
    },
    {
      slug: "asana",
      name: "Asana",
      category_id: catMap["produtividade"],
      official_website: "https://asana.com",
      free_plan_available: true,
      free_trial_days: 30,
      rating_editorial: 4.78,
      is_featured: false,
      is_published: true,
      short_description_pt: "Gestão estruturada de projetos com fluxos claros de aprovação, cronogramas e responsabilidades bem definidas.",
      short_description_en: "Enterprise work management platform empowering teams to coordinate multi-stage initiatives and deadlines effortlessly.",
      full_description_pt: "A Asana ajuda organizações de médio e grande porte a manter transparência de entregas com gráficos de Gantt interativos e dependências de tarefas.",
      full_description_en: "Asana brings clarity to complex cross-functional roadmaps with workflow builder, workload management and portfolio views.",
      prices: [
        { plan_name: "Personal (Free)", price: 0, features: ["Até 10 colaboradores", "Tarefas e projetos ilimitados", "Visualização em lista e quadro"] },
        { plan_name: "Starter", price: 10.99, features: ["Cronogramas interativos", "Formulários personalizados", "Regras automatizadas"] },
      ],
      affiliateRate: "US$ 50 por conta Starter ativada"
    },

    // Gestão Empresarial (ERP)
    {
      slug: "conta-azul",
      name: "Conta Azul",
      category_id: catMap["gestao-empresarial"],
      official_website: "https://contaazul.com",
      free_plan_available: false,
      free_trial_days: 14,
      rating_editorial: 4.88,
      is_featured: true,
      is_published: true,
      short_description_pt: "ERP financeiro em nuvem número 1 no Brasil para controle de fluxo de caixa, emissão de NF-e e conciliação bancária.",
      short_description_en: "Leading cloud ERP and financial management system in Brazil with automated bank reconciliation and instant fiscal invoice emission.",
      full_description_pt: "O Conta Azul conecta o empresário ao seu contador em tempo real, automatizando faturamento, cobranças via Pix e controle de estoque.",
      full_description_en: "Conta Azul streamlines business cashflow, tax compliance, and automated receivables collection for Brazilian companies.",
      prices: [
        { plan_name: "Básico", price: 29, features: ["Emissão de notas fiscais", "Controle de vendas", "Fluxo de caixa básico"] },
        { plan_name: "Controle", price: 49, features: ["Conciliação bancária automática", "Controle de estoque", "Cobrança Pix integrada"] },
      ],
      affiliateRate: "R$ 100 por contratação de plano"
    },
    {
      slug: "omie-erp",
      name: "Omie ERP",
      category_id: catMap["gestao-empresarial"],
      official_website: "https://omie.com.br",
      free_plan_available: false,
      free_trial_days: 14,
      rating_editorial: 4.84,
      is_featured: false,
      is_published: true,
      short_description_pt: "Sistema de gestão completo com emissão fiscal ilimitada, módulo de serviços e CRM financeiro integrado.",
      short_description_en: "Comprehensive enterprise ERP for services and retail with unlimited electronic invoicing and native banking services.",
      full_description_pt: "O Omie se destaca pela robustez para prestadores de serviço e distribuidoras que necessitam de regras fiscais precisas e automações contábeis.",
      full_description_en: "Omie provides complete operational, financial, and tax management with native API access.",
      prices: [
        { plan_name: "Essencial", price: 39, features: ["Notas fiscais ilimitadas", "CRM integrado", "Contas a pagar e receber"] },
      ],
      affiliateRate: "R$ 120 por cliente ativado"
    },

    // Criação de Sites & Landing Pages
    {
      slug: "webflow",
      name: "Webflow",
      category_id: catMap["criacao-de-sites"],
      official_website: "https://webflow.com",
      free_plan_available: true,
      free_trial_days: null,
      rating_editorial: 4.93,
      is_featured: true,
      is_published: true,
      short_description_pt: "O construtor visual de código mais avançado do mundo para designers e empresas que exigem controle total de CSS e CMS.",
      short_description_en: "The industry standard visual web development platform generating clean production-grade HTML, CSS and JS with powerful CMS.",
      full_description_pt: "O Webflow elimina a necessidade de codificação manual permitindo que designers criem animações complexas, bancos de dados dinâmicos e hospedagem ultra rápida.",
      full_description_en: "Webflow bridges design and production code, trusted by the world's most innovative brands for high-converting marketing sites.",
      prices: [
        { plan_name: "Starter (Free)", price: 0, features: ["Publicação em domínio webflow.io", "Até 50 itens de CMS", "Design responsivo completo"] },
        { plan_name: "Basic", price: 14, features: ["Domínio personalizado", "500 envios de formulário", "CDN global de alta velocidade"] },
        { plan_name: "CMS", price: 23, features: ["2.000 itens de CMS", "3 editores de conteúdo", "Tráfego mensal de 250k"] },
      ],
      affiliateRate: "50% nos primeiros 12 meses"
    },
    {
      slug: "framer",
      name: "Framer",
      category_id: catMap["criacao-de-sites"],
      official_website: "https://framer.com",
      free_plan_available: true,
      free_trial_days: null,
      rating_editorial: 4.89,
      is_featured: false,
      is_published: true,
      short_description_pt: "Crie sites modernos e interativos na mesma velocidade em que desenha no Figma, com SEO otimizado e publicação instantânea.",
      short_description_en: "Design and publish modern interactive websites with Figma-like velocity, stellar speed scores and built-in CMS.",
      full_description_pt: "O Framer tornou-se o queridinho das startups modernas de IA e produtos digitais por seus efeitos visuais cinematográficos e facilidade de edição.",
      full_description_en: "Framer gives creators the power to design and launch production-ready websites without code or servers.",
      prices: [
        { plan_name: "Free", price: 0, features: ["Domínio framer.app", "Páginas ilimitadas", "Design responsivo"] },
        { plan_name: "Mini", price: 5, features: ["Domínio personalizado", "1 página principal", "1.000 visitantes/mês"] },
        { plan_name: "Basic", price: 15, features: ["Páginas ilimitadas", "10.000 visitantes/mês", "CMS simples"] },
      ],
      affiliateRate: "50% no primeiro ano"
    },

    // Atendimento ao Cliente
    {
      slug: "zendesk-support",
      name: "Zendesk Support",
      category_id: catMap["atendimento-ao-cliente"],
      official_website: "https://zendesk.com",
      free_plan_available: false,
      free_trial_days: 14,
      rating_editorial: 4.82,
      is_featured: true,
      is_published: true,
      short_description_pt: "A referência mundial em help desk corporativo, tickets inteligentes e atendimento multicanal com IA conversacional.",
      short_description_en: "The enterprise standard in omnichannel ticketing, self-service knowledge portals, and conversational AI agents.",
      full_description_pt: "O Zendesk centraliza e-mail, chat, telefone e redes sociais em uma única caixa de entrada, com automações de SLA e relatórios de CSAT.",
      full_description_en: "Zendesk powers global support operations with unified customer history, automated routing and AI-assisted agent copilots.",
      prices: [
        { plan_name: "Support Team", price: 19, features: ["Tickets integrados de e-mail e redes", "Regras de negócios básicas", "Histórico de clientes"] },
        { plan_name: "Suite Team", price: 55, features: ["Canais de chat e mensageria", "Central de ajuda com IA", "Voz e telefonia digital"] },
      ],
      affiliateRate: "20% no primeiro ano"
    },
    {
      slug: "intercom",
      name: "Intercom",
      category_id: catMap["atendimento-ao-cliente"],
      official_website: "https://intercom.com",
      free_plan_available: false,
      free_trial_days: 14,
      rating_editorial: 4.87,
      is_featured: false,
      is_published: true,
      short_description_pt: "Plataforma de atendimento conversacional com o agente Fin AI, capaz de resolver mais de 50% dos chamados automaticamente.",
      short_description_en: "Next-generation customer service platform powered by Fin AI Copilot to resolve customer queries instantly.",
      full_description_pt: "O Intercom combina messenger moderno incorporado no seu site ou aplicativo com automação de onboarding de usuários e tours guiados.",
      full_description_en: "Intercom delivers proactive in-app messaging, automated product tours and AI agent resolution.",
      prices: [
        { plan_name: "Essential", price: 39, features: ["Inbox compartilhada", "Messenger web e mobile", "Relatórios básicos"] },
        { plan_name: "Advanced", price: 99, features: ["Múltiplos fluxos de trabalho", "Roteamento inteligente", "SLA personalizado"] },
      ],
      affiliateRate: "20% recorrente"
    },

    // Pequenas Empresas
    {
      slug: "google-workspace",
      name: "Google Workspace",
      category_id: catMap["pequenas-empresas"],
      official_website: "https://workspace.google.com",
      free_plan_available: false,
      free_trial_days: 14,
      rating_editorial: 4.96,
      is_featured: true,
      is_published: true,
      short_description_pt: "E-mail corporativo profissional (@suaempresa.com), Google Drive na nuvem, Meet para videoconferências e Docs colaborativos.",
      short_description_en: "Professional custom business email, 30GB-2TB cloud storage, secure video meetings and collaborative document apps.",
      full_description_pt: "O Google Workspace é a base indispensável para qualquer negócio digital organizar e-mails profissionais, planilhas em equipe e segurança corporativa.",
      full_description_en: "Google Workspace powers modern company operations with Gmail, Meet, Drive, Docs, Sheets, and centralized admin console.",
      prices: [
        { plan_name: "Business Starter", price: 6, features: ["E-mail personalizado @suaempresa", "30 GB de armazenamento/usuário", "Reuniões para até 100 pessoas"] },
        { plan_name: "Business Standard", price: 12, features: ["2 TB de armazenamento/usuário", "Gravação de reuniões Meet", "Controles de compartilhamento avançados"] },
      ],
      affiliateRate: "US$ 18 por usuário anual ativado"
    },
    {
      slug: "canva-pro",
      name: "Canva Pro",
      category_id: catMap["pequenas-empresas"],
      official_website: "https://canva.com",
      free_plan_available: true,
      free_trial_days: 30,
      rating_editorial: 4.91,
      is_featured: true,
      is_published: true,
      short_description_pt: "Criação descomplicada de artes profissionais para redes sociais, apresentações, vídeos e kit de marca em minutos.",
      short_description_en: "Visual design suite empowering non-designers to create brand assets, presentations, social media graphics and videos.",
      full_description_pt: "O Canva Pro inclui milhões de fotos, elementos e templates premium, além de remoção de fundo com 1 clique e redimensionamento automático.",
      full_description_en: "Canva Pro unlocks 100M+ stock assets, brand kits, instant background removers and cross-platform scheduling.",
      prices: [
        { plan_name: "Grátis", price: 0, features: ["Mais de 1 milhão de templates", "Acesso a fontes básicas", "5 GB de armazenamento em nuvem"] },
        { plan_name: "Canva Pro", price: 12.99, features: ["Kit de marca com logotipos", "Removedor de fundo com IA", "1 TB de armazenamento em nuvem", "Agendamento de posts"] },
      ],
      affiliateRate: "US$ 36 por nova assinatura Pro"
    },
  ];

  // Insert all products and prices
  for (const item of productsToSeed) {
    const { prices, affiliateRate, ...prodData } = item;
    const { data: saved, error: pErr } = await supabase
      .from("products")
      .upsert({
        ...prodData,
        last_verified_at: new Date().toISOString(),
      }, { onConflict: "slug" })
      .select("id, slug, name")
      .single();

    if (pErr || !saved) {
      console.error(`Error saving product ${item.name}:`, pErr?.message);
      continue;
    }

    console.log(`✓ Product saved: ${saved.name}`);

    // Insert prices if present
    if (prices && prices.length > 0) {
      // Clear old prices for freshness
      await supabase.from("product_prices").delete().eq("product_id", saved.id);
      for (const p of prices) {
        await supabase.from("product_prices").insert({
          product_id: saved.id,
          plan_name: p.plan_name,
          price: p.price,
          currency: "USD",
          billing_cycle: p.price === 0 ? "free" : "monthly",
          features: p.features,
          has_free_trial: p.price > 0,
          trial_days: p.price > 0 ? 14 : null,
          is_active: true,
          verified_at: new Date().toISOString(),
        });
      }
    }

    // Insert Affiliate Link
    const { data: prog } = await supabase
      .from("affiliate_programs")
      .insert({
        network_id: defaultNetworkId,
        product_id: saved.id,
        name: `Parceria Oficial ${saved.name}`,
        official_terms_url: `${item.official_website}`,
        commission_rate: affiliateRate || "25% de comissão verificada",
        commission_type: "percentage",
        is_recurring: true,
        cookie_duration_days: 60,
        status: "approved",
      })
      .select("id")
      .single();

    if (prog) {
      await supabase.from("affiliate_links").upsert({
        program_id: prog.id,
        product_id: saved.id,
        internal_slug: saved.slug,
        destination_url: `${item.official_website}?utm_source=stackwise&utm_medium=directory`,
        is_active: true,
      }, { onConflict: "internal_slug" });
    }
  }

  // 4. Seed Digital Store Products (digital_products)
  console.log("\n=== SEEDING DIGITAL STORE PRODUCTS ===");
  const digitalItems = [
    {
      supplier_code: "aivault",
      external_product_id: "ext_chatgpt_plus_30d",
      name: "ChatGPT Plus (Voucher Ativação 30 Dias)",
      category: "Inteligência Artificial",
      description: "Chave de ativação oficial para upgrade individual na conta OpenAI. Dá direito a acesso ilimitado GPT-4o, DALL-E 3 e criação de GPTs personalizados sem fila de espera.",
      cost_price: 15.50,
      sale_price: 22.00,
      profit_margin_pct: 41.9,
      currency: "USDT",
      is_active: true,
      stock_status: "in_stock",
    },
    {
      supplier_code: "aivault",
      external_product_id: "ext_claude_pro_30d",
      name: "Claude Pro (Licença Oficial 30 Dias)",
      category: "Inteligência Artificial",
      description: "Código de acesso para Claude 3.5 Sonnet com 5x mais limites de mensagens, raciocínio avançado para programação e análise de documentos complexos.",
      cost_price: 16.00,
      sale_price: 23.50,
      profit_margin_pct: 46.8,
      currency: "USDT",
      is_active: true,
      stock_status: "in_stock",
    },
    {
      supplier_code: "prime_digital",
      external_product_id: "ext_midjourney_standard",
      name: "Midjourney Standard Plan (Código Licença)",
      category: "Design & IA",
      description: "Licença para geração ilimitada de imagens no modo Relaxed + 15 horas de GPU rápida por mês no Discord oficial do Midjourney.",
      cost_price: 24.00,
      sale_price: 34.00,
      profit_margin_pct: 41.6,
      currency: "USDT",
      is_active: true,
      stock_status: "in_stock",
    },
    {
      supplier_code: "prime_digital",
      external_product_id: "ext_canva_pro_teams",
      name: "Canva Pro Equipes (Acesso Anual Direto)",
      category: "Design & Produtividade",
      description: "Convite para espaço de trabalho corporativo Canva Pro. Acesso a 100M+ fotos stock, removedor de fundo com 1 clique e kit de marca completo por 12 meses.",
      cost_price: 11.50,
      sale_price: 18.00,
      profit_margin_pct: 56.5,
      currency: "USDT",
      is_active: true,
      stock_status: "in_stock",
    },
    {
      supplier_code: "prime_digital",
      external_product_id: "ext_notion_ai_1y",
      name: "Notion AI Unlimited (Upgrade 1 Ano)",
      category: "Produtividade",
      description: "Ativação do assistente Notion AI ilimitado para sua conta. Síntese de reuniões, geração de tarefas e busca cognitiva em todos os seus documentos.",
      cost_price: 19.00,
      sale_price: 28.00,
      profit_margin_pct: 47.3,
      currency: "USDT",
      is_active: true,
      stock_status: "in_stock",
    },
    {
      supplier_code: "ventebot",
      external_product_id: "ext_ventebot_whatsapp_bot",
      name: "VenteBot AI WhatsApp Automation (Licença Mensal)",
      category: "Automação & Vendas",
      description: "Robô de atendimento inteligente via WhatsApp conectado à OpenAI. Qualifica leads, responde dúvidas 24/7 e agenda reuniões no Google Calendar.",
      cost_price: 30.00,
      sale_price: 45.00,
      profit_margin_pct: 50.0,
      currency: "USDT",
      is_active: true,
      stock_status: "in_stock",
    },
    {
      supplier_code: "aivault",
      external_product_id: "ext_make_10k_ops",
      name: "Make.com Pro Tier Voucher (10.000 Operações)",
      category: "Automação",
      description: "Crédito pré-pago para execução de até 10.000 operações em cenários automatizados no Make.com, com suporte a webhooks e filtros ilimitados.",
      cost_price: 9.00,
      sale_price: 15.00,
      profit_margin_pct: 66.6,
      currency: "USDT",
      is_active: true,
      stock_status: "in_stock",
    },
  ];

  for (const dp of digitalItems) {
    const { error: dpErr } = await supabase
      .from("digital_products")
      .upsert(dp, { onConflict: "supplier_code, external_product_id" });

    if (dpErr) {
      console.error(`Error inserting digital product ${dp.name}:`, dpErr.message);
    } else {
      console.log(`✓ Digital Product ready: ${dp.name} ($${dp.sale_price} USDT)`);
    }
  }

  // 5. Seed Additional Editorial Articles
  console.log("\n=== SEEDING EDITORIAL CONTENT ===");
  const articlesToSeed = [
    {
      slug: "melhores-ferramentas-ia-empresas-2026",
      type: "listicle",
      catSlug: "inteligencia-artificial",
      title_pt: "As 7 Melhores Ferramentas de Inteligência Artificial para Pequenas e Médias Empresas em 2026",
      title_en: "The 7 Best AI Productivity Tools for Modern Small & Medium Businesses in 2026",
      desc_pt: "Guia completo com benchmarks práticos: ChatGPT Enterprise, Claude 3.5 Sonnet, Perplexity e automações com IA para reduzir custos operacionais.",
      desc_en: "Comprehensive technical benchmark: ChatGPT Enterprise, Claude 3.5 Sonnet, Perplexity AI, and workflow copilots to scale operational output.",
    },
    {
      slug: "zapier-vs-make-comparativo-definitivo",
      type: "comparison",
      catSlug: "automacao",
      title_pt: "Zapier vs Make (Integromat): Qual a Melhor Ferramenta de Automação No-Code?",
      title_en: "Zapier vs Make: Head-to-Head Architectural and Pricing Benchmark",
      desc_pt: "Duelo de custos por operação, limites mensais, complexidade de cenários e facilidade de manutenção para equipes operacionais.",
      desc_en: "Detailed cost-per-execution comparison, multi-step scenario ergonomics, and enterprise error-handling capabilities.",
    },
    {
      slug: "como-escolher-erp-financeiro-brasil",
      type: "guide",
      catSlug: "gestao-empresarial",
      title_pt: "Conta Azul vs Omie: Como Escolher o Melhor ERP Financeiro em 2026",
      title_en: "Conta Azul vs Omie: Complete Financial ERP Evaluation Guide for Brazilian Companies",
      desc_pt: "Análise imparcial de emissão fiscal, conciliação bancária automática com Pix e conexão direta com contabilidade.",
      desc_en: "Tax compliance, bank statement integration and financial ledger automation compared side-by-side.",
    },
  ];

  for (const art of articlesToSeed) {
    const { data: savedArt } = await supabase
      .from("content")
      .upsert({
        slug: art.slug,
        type: art.type,
        target_category_id: catMap[art.catSlug],
      }, { onConflict: "slug" })
      .select("id")
      .single();

    if (savedArt) {
      await supabase.from("content_translations").upsert({
        content_id: savedArt.id,
        locale: "pt-br",
        title: art.title_pt,
        meta_title: `${art.title_pt} | STACKWISE`,
        meta_description: art.desc_pt,
        content_markdown: `## Visão Geral e Importância Estratégica\n\nNo cenário empresarial contemporâneo, a escolha criteriosa do ferramental tecnológico define a velocidade de crescimento e a margem operacional de qualquer negócio.\n\nNesta análise detalhada, nossa bancada editorial avalia custos reais de implementação, curvas de aprendizado, suporte e o retorno sobre o investimento (ROI) comprovado.\n\n### Pontos Chave Analisados\n\n- Transparência nos preços públicos e ausência de taxas ocultas.\n- Estabilidade de conexões e integrações via API.\n- Qualidade de documentação e suporte técnico ao cliente.`,
        status: "published",
        published_at: new Date().toISOString(),
      }, { onConflict: "content_id, locale" });

      await supabase.from("content_translations").upsert({
        content_id: savedArt.id,
        locale: "en",
        title: art.title_en,
        meta_title: `${art.title_en} | STACKWISE`,
        meta_description: art.desc_en,
        content_markdown: `## Overview and Strategic Context\n\nSelecting the right technical software stack dictates your operational velocity and bottom-line efficiency.\n\nIn this benchmark, STACKWISE technical auditors evaluate total cost of ownership, API limits, and vendor support SLAs.`,
        status: "published",
        published_at: new Date().toISOString(),
      }, { onConflict: "content_id, locale" });

      console.log(`✓ Article saved: ${art.slug}`);
    }
  }

  console.log("\n=== ALL DATA SEEDED SUCCESSFULLY! ===");
}

run().catch(console.error);
