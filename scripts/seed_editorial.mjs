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
  console.log("Starting verified editorial content seeding...");

  // Get categories and products
  const { data: prods } = await supabase.from("products").select("id, slug");
  const { data: cats } = await supabase.from("categories").select("id, slug");

  const prodMap = Object.fromEntries((prods || []).map((p) => [p.slug, p.id]));
  const catMap = Object.fromEntries((cats || []).map((c) => [c.slug, c.id]));

  // Article 1: HubSpot vs ActiveCampaign
  const { data: art1 } = await supabase
    .from("content")
    .upsert({
      slug: "hubspot-vs-activecampaign-comparativo",
      type: "comparison",
      primary_product_id: prodMap["hubspot"],
      secondary_product_id: prodMap["activecampaign"],
      target_category_id: catMap["crm"],
    }, { onConflict: "slug" })
    .select("id")
    .single();

  if (art1) {
    // PT translation
    await supabase.from("content_translations").upsert({
      content_id: art1.id,
      locale: "pt-br",
      title: "HubSpot CRM vs ActiveCampaign: Comparativo Técnico de Custo, Recursos e Entregabilidade em 2026",
      meta_title: "HubSpot CRM vs ActiveCampaign: Comparativo Completo 2026 | STACKWISE",
      meta_description: "Análise imparcial entre HubSpot e ActiveCampaign. Compare planos gratuitos, automação comportamental de e-mail, entregabilidade e custos reais.",
      content_markdown: `## Introdução e Contexto de Mercado

Ao planejar a infraestrutura de vendas e marketing de uma empresa, poucas decisões geram tanto impacto a médio prazo quanto a escolha entre **HubSpot CRM** e **ActiveCampaign**. Ambas as plataformas são líderes consolidadas, porém foram concebidas com filosofias de produto radicalmente distintas.

Nesta análise técnica, examinamos custos ocultos, limites de contatos, facilidade de implementação e o retorno operacional de cada solução.

## Filosofia de Cada Ferramenta

- **HubSpot CRM:** Projetado como um ecossistema inbound all-in-one. Sua principal vantagem é a centralização de contatos, negócios visuais, formulários, chat e suporte em uma única interface intuitiva. O plano gratuito vitalício permite começar sem investimento inicial.
- **ActiveCampaign:** Desenvolvido prioritariamente como um motor avançado de automação de e-mail marketing comportamental, complementado por um módulo de CRM focado em rotatividade de negócios.

## Comparação de Preços e Escalabilidade

Um dos principais pontos de atenção para líderes de tecnologia é a curva de custos à medida que a base de contatos se expande:

- **HubSpot:** O plano gratuito atende equipes em estágio inicial com contatos ilimitados. Contudo, a migração para os planos Professional ou Enterprise envolve saltos tarifários significativos e taxa obrigatória de onboarding.
- **ActiveCampaign:** Não oferece plano gratuito vitalício (apenas teste de 14 dias), mas sua precificação inicial (a partir de $19/mês) oferece automações avançadas por um custo acessível.

## Veredito Editorial STACKWISE

1. **Escolha o HubSpot CRM se:** Você busca uma interface visual moderna, valoriza a centralização de atendimento e vendas e deseja começar com custo fixo zero aproveitando o plano gratuito.
2. **Escolha o ActiveCampaign se:** Sua estratégia de receita depende criticamente de sequências complexas de nutrição, múltiplos gatilhos comportamentais de e-mail e alta precisão de segmentação.`,
      status: "published",
      published_at: new Date().toISOString(),
    }, { onConflict: "content_id, locale" });

    // EN translation
    await supabase.from("content_translations").upsert({
      content_id: art1.id,
      locale: "en",
      title: "HubSpot CRM vs ActiveCampaign: Technical Head-to-Head Benchmark on Cost, Deliverability & Automation (2026)",
      meta_title: "HubSpot CRM vs ActiveCampaign: 2026 Comparison | STACKWISE",
      meta_description: "Objective side-by-side benchmark of HubSpot and ActiveCampaign. Compare pricing tiers, behavioral automation, deliverability, and CRM pipelines.",
      content_markdown: `## Executive Overview

When architecting a high-converting go-to-market tech stack, choosing between **HubSpot CRM** and **ActiveCampaign** is a defining decision. Both platforms lead global SaaS benchmarks, yet their underlying architectures solve distinct operational bottlenecks.

This structured benchmark evaluates feature completeness, total cost of ownership (TCO), and implementation overhead based on audited technical documentation.

## Core Architectural Differences

- **HubSpot CRM:** Built from day one as a unified inbound customer platform. It consolidates contact tracking, visual pipeline deals, landing pages, and ticketing into a clean, modern UI.
- **ActiveCampaign:** Engineered primarily as a precision behavioral automation engine with rich conditional triggers and a lightweight sales pipeline.

## Pricing Tiers & Long-term TCO

- **HubSpot:** The free-forever tier allows startups to operate without SaaS overhead. However, stepping up to Professional tiers introduces steeper price jumps and mandatory onboarding commitments.
- **ActiveCampaign:** Starts at $19/month without a permanent free tier, but unlocks sophisticated conditional workflows at a competitive entry point.

## STACKWISE Editorial Recommendation

- **Opt for HubSpot CRM** if you prioritize CRM adoption speed, seamless team onboarding, and need a free-forever foundational hub.
- **Opt for ActiveCampaign** if your revenue engine relies heavily on advanced email trigger conditions and predictive sending algorithms.`,
      status: "published",
      published_at: new Date().toISOString(),
    }, { onConflict: "content_id, locale" });
  }

  // Article 2: Como Escolher o CRM
  const { data: art2 } = await supabase
    .from("content")
    .upsert({
      slug: "como-escolher-crm-pequenas-empresas",
      type: "guide",
      primary_product_id: prodMap["hubspot"],
      target_category_id: catMap["crm"],
    }, { onConflict: "slug" })
    .select("id")
    .single();

  if (art2) {
    await supabase.from("content_translations").upsert({
      content_id: art2.id,
      locale: "pt-br",
      title: "Como Escolher o CRM Ideal para Pequenas Empresas: Critérios Técnicos sem Achismos",
      meta_title: "Como Escolher o Melhor CRM para PMEs em 2026 | STACKWISE",
      meta_description: "Guia prático para escolher o CRM ideal para sua empresa. Descubra os 5 critérios técnicos fundamentais para não desperdiçar orçamento com ferramentas inadequadas.",
      content_markdown: `## Por que a Maioria das Implementações de CRM Falha?

Estudos de mercado indicam que mais de 40% das implementações de CRM em pequenas e médias empresas são abandonadas nos primeiros 6 meses. O motivo raramente é a falta de recursos da ferramenta — e sim a escolha de sistemas excessivamente burocráticos ou com custos imprevisíveis.

Neste guia, apresentamos um roteiro objetivo de 5 passos para selecionar a ferramenta certa com orçamento controlado.

## Os 5 Critérios Técnicos Essenciais

1. **Adesão e Curva de Aprendizado:** Um CRM que sua equipe não preenche diariamente é inútil. Priorize interfaces fluidas e campos customizáveis fáceis de editar.
2. **Existência de Plano Gratuito ou Teste Real:** Nunca assine contratos anuais sem validar o fluxo de ponta a ponta durante pelo menos 14 dias.
3. **Integração Nativa com seu E-mail e WhatsApp:** A captura automática de conversas poupa horas semanais de trabalho manual.
4. **Visibilidade de Pipeline (Funil):** A visualização em estilo Kanban permite identificar gargalos comerciais em segundos.
5. **Transparência de Custos na Escala:** Verifique quanto o fornecedor cobra por cada usuário adicional antes de tomar a decisão final.`,
      status: "published",
      published_at: new Date().toISOString(),
    }, { onConflict: "content_id, locale" });

    await supabase.from("content_translations").upsert({
      content_id: art2.id,
      locale: "en",
      title: "How to Choose the Right CRM for Growing Small Businesses: A No-Nonsense Guide",
      meta_title: "How to Choose the Right CRM in 2026 | STACKWISE",
      meta_description: "A pragmatic guide to selecting the right CRM for modern SMBs. Evaluate key technical criteria without falling for software hype.",
      content_markdown: `## Why Most SMB CRM Implementations Fail

Over 40% of small business CRM rollouts are abandoned within the first 6 months. The root cause is rarely a lack of software features — it is almost always poor usability and steep friction in day-to-day data entry.

Here are the 5 architectural benchmarks every decision-maker must evaluate before committing budget.

## 5 Essential Technical Criteria

1. **User Ergonomics & Adoption:** If updating deals requires more than two clicks, team adoption will plummet. Simplicity wins over bloated capability.
2. **Free Forever Tier or Unrestricted Trial:** Validate core workflows for at least two weeks before considering annual agreements.
3. **Native Communication Integrations:** Bidirectional synchronization with Gmail, Outlook, and team chats saves hours of manual logging every week.
4. **Visual Pipeline Velocity:** Kanban deal flows give leadership immediate clarity over deal blockages and win rates.
5. **Predictable Seat Pricing:** Audit what the provider charges per additional seat before expanding your sales headcount.`,
      status: "published",
      published_at: new Date().toISOString(),
    }, { onConflict: "content_id, locale" });
  }

  console.log("Editorial content seeding finished successfully!");
}

seed().catch(console.error);
