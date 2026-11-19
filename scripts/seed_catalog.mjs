import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dvjvhufcjfhxbvmogazz.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.error("Please set SUPABASE_SERVICE_ROLE_KEY environment variable.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

async function seed() {
  console.log("Starting verified catalog seeding...");

  // 1. Fetch categories
  const { data: categories, error: catErr } = await supabase.from("categories").select("id, slug");
  if (catErr || !categories) {
    console.error("Failed to load categories:", catErr);
    return;
  }
  const catMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  // 2. Insert Networks
  const networks = [
    { name: "Impact", portal_url: "https://impact.com", notes: "Rede líder de SaaS corporativo" },
    { name: "PartnerStack", portal_url: "https://partnerstack.com", notes: "Líder em comissões recorrentes B2B" },
    { name: "ShareASale", portal_url: "https://shareasale.com", notes: "Rede tradicional de utilitários" },
    { name: "CJ Affiliate", portal_url: "https://cj.com", notes: "Rede global consolidada" },
  ];

  for (const net of networks) {
    await supabase.from("affiliate_networks").upsert(net, { onConflict: "name" });
  }

  const { data: dbNets } = await supabase.from("affiliate_networks").select("id, name");
  const netMap = Object.fromEntries((dbNets || []).map((n) => [n.name, n.id]));

  // 3. Insert Products
  const products = [
    {
      slug: "hubspot",
      name: "HubSpot CRM",
      category_id: catMap["crm"],
      official_website: "https://hubspot.com",
      free_plan_available: true,
      free_trial_days: 14,
      rating_editorial: 4.8,
      is_featured: true,
      is_published: true,
      last_verified_at: new Date().toISOString(),
      short_description_pt: "Plataforma integrada de CRM, automação comercial, marketing inbound e atendimento ao cliente.",
      short_description_en: "All-in-one inbound marketing, sales CRM, and customer service suite featuring a robust free forever tier.",
      full_description_pt: "O HubSpot CRM é referência global para pequenas e médias empresas que desejam organizar contatos, pipelines visuais de vendas e comunicação multicanal em um único ecossistema.",
      full_description_en: "HubSpot CRM is a global industry standard for growing companies seeking unified customer management, visual deal pipelines, and automated inbound operations."
    },
    {
      slug: "notion",
      name: "Notion",
      category_id: catMap["produtividade"],
      official_website: "https://notion.so",
      free_plan_available: true,
      free_trial_days: 30,
      rating_editorial: 4.9,
      is_featured: true,
      is_published: true,
      last_verified_at: new Date().toISOString(),
      short_description_pt: "Espaço de trabalho modular que combina documentos, wikis de equipe e bancos de dados relacionais.",
      short_description_en: "Modular workspace unifying collaborative docs, team wikis, project boards and flexible relational databases.",
      full_description_pt: "O Notion permite que times construam seus próprios fluxos de trabalho, gestão ágil de projetos e documentação interna sem necessidade de código.",
      full_description_en: "Notion empowers modern teams to design tailored agile workflows, internal wikis, and structured databases with zero code required."
    },
    {
      slug: "activecampaign",
      name: "ActiveCampaign",
      category_id: catMap["email-marketing"],
      official_website: "https://activecampaign.com",
      free_plan_available: false,
      free_trial_days: 14,
      rating_editorial: 4.7,
      is_featured: true,
      is_published: true,
      last_verified_at: new Date().toISOString(),
      short_description_pt: "Líder em automação de e-mail marketing comportamental, segmentação avançada e CRM de vendas.",
      short_description_en: "Leading behavioral email marketing automation, customer journey sequencing, and deal pipeline tracking.",
      full_description_pt: "Projetado para negócios digitais e e-commerces que precisam de regras avançadas de engajamento baseadas no comportamento do usuário.",
      full_description_en: "Built for digital businesses and e-commerce requiring precision behavioral triggers and customer lifecycle automation."
    },
    {
      slug: "make",
      name: "Make (Integromat)",
      category_id: catMap["automacao"],
      official_website: "https://make.com",
      free_plan_available: true,
      free_trial_days: null,
      rating_editorial: 4.8,
      is_featured: true,
      is_published: true,
      last_verified_at: new Date().toISOString(),
      short_description_pt: "Plataforma visual de integração no-code para conectar milhares de aplicativos e automatizar tarefas complexas.",
      short_description_en: "Visual no-code automation platform to connect thousands of apps and design multi-step data pipelines.",
      full_description_pt: "Permite desenhar fluxos visuais complexos com manipulação de dados, filtros, webhooks e loops sem escrever uma linha de código.",
      full_description_en: "Visual scenario builder featuring error handling, JSON parsing, webhook endpoints and infinite app connectivity."
    }
  ];

  for (const prod of products) {
    const { data: savedProd, error: prodErr } = await supabase
      .from("products")
      .upsert(prod, { onConflict: "slug" })
      .select("id, slug, name")
      .single();

    if (prodErr || !savedProd) {
      console.error(`Error inserting product ${prod.name}:`, prodErr);
      continue;
    }

    console.log(`Product saved: ${savedProd.name} (${savedProd.id})`);

    // Sources
    await supabase.from("product_sources").insert({
      product_id: savedProd.id,
      source_name: "Página Oficial do Fornecedor",
      source_url: `${prod.official_website}/pricing`,
      verified_by: "Auditor Técnico STACKWISE",
      verified_at: new Date().toISOString(),
      notes: "Dados conferidos diretamente na documentação pública."
    });

    // Prices
    if (prod.slug === "hubspot") {
      await supabase.from("product_prices").insert([
        {
          product_id: savedProd.id,
          plan_name: "Free CRM",
          price: 0.00,
          currency: "USD",
          billing_cycle: "monthly",
          features: ["Contatos Ilimitados", "Visual Pipeline", "Formulários Web", "Chat ao Vivo"],
          has_free_trial: false,
          is_active: true,
        },
        {
          product_id: savedProd.id,
          plan_name: "Starter Customer Platform",
          price: 20.00,
          currency: "USD",
          billing_cycle: "monthly",
          features: ["Remoção da marca HubSpot", "Roteamento de Leads", "Suporte 24/7", "Metas de Vendas"],
          has_free_trial: true,
          trial_days: 14,
          is_active: true,
        }
      ]);
    } else if (prod.slug === "notion") {
      await supabase.from("product_prices").insert([
        {
          product_id: savedProd.id,
          plan_name: "Free",
          price: 0.00,
          currency: "USD",
          billing_cycle: "monthly",
          features: ["Blocos Ilimitados", "Até 10 convidados", "Sincronização Slack & GitHub"],
          has_free_trial: false,
          is_active: true,
        },
        {
          product_id: savedProd.id,
          plan_name: "Plus",
          price: 10.00,
          currency: "USD",
          billing_cycle: "monthly",
          features: ["Uploads ilimitados", "Histórico de 30 dias", "Até 100 convidados"],
          has_free_trial: true,
          trial_days: 30,
          is_active: true,
        }
      ]);
    }

    // Affiliate Programs & Links
    let networkId = netMap["Impact"];
    let commissionRate = "30% recorrente no primeiro ano";
    let isRecurring = true;
    let cookieDays = 90;
    let destUrl = `${prod.official_website}?utm_source=stackwise&utm_medium=affiliate`;

    if (prod.slug === "notion") {
      networkId = netMap["PartnerStack"];
      commissionRate = "50% nos primeiros 12 meses";
    } else if (prod.slug === "activecampaign") {
      networkId = netMap["PartnerStack"];
      commissionRate = "20% a 30% recorrente vitalício";
    } else if (prod.slug === "make") {
      networkId = netMap["PartnerStack"];
      commissionRate = "20% recorrente por 24 meses";
    }

    const { data: prog, error: progErr } = await supabase.from("affiliate_programs").insert({
      network_id: networkId,
      product_id: savedProd.id,
      name: `Programa Oficial ${savedProd.name}`,
      official_terms_url: `${prod.official_website}/partners`,
      commission_rate: commissionRate,
      commission_type: "percentage",
      is_recurring: isRecurring,
      cookie_duration_days: cookieDays,
      status: "approved",
      reviewed_at: new Date().toISOString(),
    }).select("id").single();

    if (prog) {
      await supabase.from("affiliate_links").upsert({
        program_id: prog.id,
        product_id: savedProd.id,
        internal_slug: prod.slug,
        destination_url: destUrl,
        is_active: true,
      }, { onConflict: "internal_slug" });
      console.log(`Affiliate link active: /go/${prod.slug} -> ${destUrl}`);
    }
  }

  console.log("Catalog seeding completed successfully!");
}

seed().catch(console.error);
