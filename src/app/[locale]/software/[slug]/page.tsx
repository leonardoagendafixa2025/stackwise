import React from "react";
import Link from "next/link";
import { type Locale } from "@/lib/i18n/dictionaries";
import {
  CheckCircle2,
  Star,
  ExternalLink,
  ChevronRight,
  Clock,
  Check,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface SoftwarePlan {
  name: string;
  price: string;
  cycle: string;
  features: string[];
}

interface SoftwareItem {
  name: string;
  category: string;
  categorySlug: string;
  officialWebsite: string;
  editorialRating: number;
  verifiedPrice: string;
  hasFreePlan: boolean;
  hasTrial: boolean;
  trialDays: number;
  lastVerifiedAt: string;
  source: string;
  shortDescription: string;
  pros: string[];
  cons: string[];
  targetAudience: string;
  languages: string;
  integrations: string;
  plans: SoftwarePlan[];
  alternatives: { name: string; slug: string; why: string }[];
  affiliateSlug: string;
}

interface SoftwarePageProps {
  params: {
    locale: Locale;
    slug: string;
  };
}

export default function SoftwareDetailPage({ params }: SoftwarePageProps) {
  const { locale, slug } = params;
  const isPt = locale === "pt-br";

  // Data structure for software tools
  const softwareCatalog: Record<string, SoftwareItem> = {
    hubspot: {
      name: "HubSpot CRM",
      category: "CRM & Vendas",
      categorySlug: "crm",
      officialWebsite: "https://hubspot.com",
      editorialRating: 4.8,
      verifiedPrice: "Grátis vitalício / Planos pagos a partir de $20/mês",
      hasFreePlan: true,
      hasTrial: true,
      trialDays: 14,
      lastVerifiedAt: "18 de Novembro de 2026",
      source: "Página oficial de preços do HubSpot (hubspot.com/pricing)",
      shortDescription: isPt
        ? "Plataforma completa de inbound marketing, gestão comercial e atendimento, com generoso plano gratuito sem limite de tempo."
        : "All-in-one inbound marketing, sales CRM, and customer service hub featuring a permanent free tier.",
      pros: [
        isPt ? "Plano gratuito robusto com contatos e negócios ilimitados" : "Generous free plan with unlimited contacts and deal tracking",
        isPt ? "Mais de 1.500 integrações no ecossistema App Marketplace" : "Over 1,500 turnkey app integrations in its marketplace",
        isPt ? "Interface extremamente intuitiva com curva de aprendizado baixa" : "Modern ergonomic UI with minimal staff onboarding time",
        isPt ? "Automações visuais de pipelines de vendas e marketing" : "Visual sequence builders for deals and lead nurturing",
      ],
      cons: [
        isPt ? "Recursos de nível Enterprise possuem custos elevados para equipes pequenas" : "Enterprise-tier modules require steep upfront investment",
        isPt ? "Algumas personalizações avançadas exigem contratação de onboarding obrigatório" : "Selected high-end plans mandate onboarding setup fees",
      ],
      targetAudience: isPt
        ? "Equipes comerciais, agências, startups e empresas em fase de expansão que buscam centralizar vendas e marketing."
        : "Sales development teams, marketing agencies, scaling startups and mid-market organizations.",
      languages: "Português (Brasil), Inglês, Espanhol, Francês, Alemão, Japonês",
      integrations: "Gmail, Google Workspace, Outlook, Zapier, Slack, WordPress, Stripe, Shopify",
      plans: [
        {
          name: "Free CRM",
          price: "R$ 0,00",
          cycle: isPt ? "Vitalício" : "Free Forever",
          features: [
            isPt ? "Gestão de contatos e empresas" : "Contact & company records",
            isPt ? "Funil visual de vendas" : "Deal visual pipeline",
            isPt ? "Formulários de captura de leads" : "Lead capture web forms",
            isPt ? "Caixa de entrada compartilhada" : "Shared team inbox",
          ],
        },
        {
          name: "Starter Customer Platform",
          price: "$20 / mês",
          cycle: isPt ? "Faturamento mensal" : "Monthly billing",
          features: [
            isPt ? "Remoção da marca HubSpot em formulários" : "HubSpot branding removed",
            isPt ? "Roteamento automatizado de leads" : "Automated deal routing",
            isPt ? "Suporte técnico via chat e e-mail" : "Chat & email tech support",
            isPt ? "Metas de vendas e relatórios simples" : "Sales targets & simple reporting",
          ],
        },
      ],
      alternatives: [
        { name: "Pipedrive", slug: "pipedrive", why: isPt ? "Mais focado exclusivamente em fechamento ágil de vendas" : "Tighter focus on velocity deal pipeline" },
        { name: "ActiveCampaign", slug: "activecampaign", why: isPt ? "Melhor para automação de funis complexos de e-mail" : "Superior advanced behavioral email workflows" },
      ],
      affiliateSlug: "hubspot",
    },
    notion: {
      name: "Notion",
      category: "Produtividade & Wikis",
      categorySlug: "produtividade",
      officialWebsite: "https://notion.so",
      editorialRating: 4.9,
      verifiedPrice: "Grátis vitalício / Plus a partir de $10/usuário/mês",
      hasFreePlan: true,
      hasTrial: true,
      trialDays: 30,
      lastVerifiedAt: "17 de Novembro de 2026",
      source: "Documentação oficial de planos do Notion (notion.so/pricing)",
      shortDescription: isPt
        ? "Espaço de trabalho modular que une documentos, wikis colaborativas, cronogramas ágeis e bancos de dados relacionais flexíveis."
        : "Modular workspace unifying docs, internal wikis, project boards and flexible relational databases.",
      pros: [
        isPt ? "Extrema flexibilidade para desenhar fluxos internos sem código" : "Infinite flexibility to design tailored internal wikis and processes",
        isPt ? "Bancos de dados relacionais com visualizações Kanban, Tabela e Calendário" : "Relational databases with Kanban, timeline and board views",
        isPt ? "Recursos integrados de Notion AI para redação e síntese de notas" : "Native Notion AI capabilities for summarization and drafting",
      ],
      cons: [
        isPt ? "Pode exigir disciplina da equipe para evitar páginas desorganizadas" : "Requires internal team structure to prevent sprawl",
        isPt ? "Não substitui softwares de contabilidade ou ERPs tradicionais" : "Cannot replace strict accounting or ERP engines",
      ],
      targetAudience: isPt
        ? "Equipes remotas, desenvolvedores, designers, criadores de conteúdo e empresas que buscam uma base única de conhecimento."
        : "Distributed teams, tech founders, agencies and product squads seeking a centralized knowledge base.",
      languages: "Português, Inglês, Espanhol, Francês, Alemão, Japonês, Coreano",
      integrations: "Slack, GitHub, Figma, Google Drive, Jira, Zapier",
      plans: [
        {
          name: "Free",
          price: "R$ 0,00",
          cycle: isPt ? "Vitalício" : "Free Forever",
          features: [
            isPt ? "Páginas e blocos colaborativos" : "Collaborative pages and blocks",
            isPt ? "Integrações com Slack e GitHub" : "Slack and GitHub sync",
            isPt ? "Compartilhamento com até 10 convidados" : "Up to 10 guest collaborators",
          ],
        },
        {
          name: "Plus",
          price: "$10 / mês",
          cycle: isPt ? "Por usuário / faturado anualmente" : "Per user / billed annually",
          features: [
            isPt ? "Uploads ilimitados de arquivos" : "Unlimited file uploads",
            isPt ? "Histórico de versão de 30 dias" : "30-day page version history",
            isPt ? "Até 100 convidados de equipe" : "Up to 100 team guests",
          ],
        },
      ],
      alternatives: [
        { name: "ClickUp", slug: "clickup", why: isPt ? "Mais estruturado para gerenciamento de projetos tradicional" : "More rigid agile project tracking features" },
        { name: "Coda", slug: "coda", why: isPt ? "Foco em automações e fórmulas poderosas" : "Advanced formula and automation capabilities" },
      ],
      affiliateSlug: "notion",
    },
  };

  const product = softwareCatalog[slug] || softwareCatalog["hubspot"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href={`/${locale}`} className="hover:underline">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/${locale}/categories`} className="hover:underline">Categorias</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/${locale}/categories/${product.categorySlug}`} className="hover:underline">
          {product.category}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-semibold text-slate-900 dark:text-slate-100">{product.name}</span>
      </nav>

      {/* Main Header Hero */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {product.category}
              </Badge>
              <Badge variant="verified" className="text-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mr-1" />
                {isPt ? "Preço Verificado" : "Audited Pricing"}
              </Badge>
              {product.hasFreePlan && (
                <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {isPt ? "Possui Plano Grátis" : "Free Plan Available"}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {product.name}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {product.shortDescription}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-1 font-bold text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                <span>{product.editorialRating} / 5.0</span>
                <span className="text-slate-400 font-normal">({isPt ? "Nota Editorial" : "Editorial Score"})</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>{isPt ? `Verificado em ${product.lastVerifiedAt}` : `Verified on ${product.lastVerifiedAt}`}</span>
              </div>
            </div>
          </div>

          {/* Quick CTA Box */}
          <div className="lg:w-72 shrink-0 rounded-xl bg-slate-50 p-5 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isPt ? "Preço Verificado" : "Verified Pricing"}
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {product.verifiedPrice}
            </div>

            <Link
              href={`/go/${product.affiliateSlug}`}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="block"
            >
              <Button size="md" className="w-full font-semibold gap-1.5 text-xs">
                <span>{isPt ? "Acessar Fornecedor Oficial" : "Visit Official Provider"}</span>
                <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>

            <p className="text-[10px] text-slate-400 leading-tight">
              {isPt
                ? "Você será direcionado diretamente ao site seguro do fabricante."
                : "You will be redirected safely to the official vendor portal."}
            </p>
          </div>
        </div>
      </div>

      {/* Pros and Cons Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-emerald-200/80 bg-emerald-50/20 dark:border-emerald-900/40 dark:bg-emerald-950/10 p-6 space-y-3">
          <h2 className="text-base font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            {isPt ? "Vantagens Confirmadas" : "Confirmed Advantages"}
          </h2>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {product.pros.map((pro: string) => (
              <li key={pro} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="border-amber-200/80 bg-amber-50/20 dark:border-amber-900/40 dark:bg-amber-950/10 p-6 space-y-3">
          <h2 className="text-base font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            {isPt ? "Limitações Conhecidas" : "Known Limitations"}
          </h2>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {product.cons.map((con: string) => (
              <li key={con} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Plans & Pricing Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {isPt ? "Planos & Estrutura de Preços" : "Pricing Structure & Plans"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {product.plans.map((plan: SoftwarePlan) => (
            <Card key={plan.name} className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {plan.name}
                  </h3>
                  <span className="text-xs text-slate-500">{plan.cycle}</span>
                </div>
                <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                  {plan.price}
                </div>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {plan.features.map((f: string) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4">
                <Link
                  href={`/go/${product.affiliateSlug}`}
                  target="_blank"
                  rel="sponsored nofollow noopener"
                >
                  <Button size="sm" variant="outline" className="w-full text-xs font-semibold">
                    {isPt ? `Ver Detalhes do Plano ${plan.name}` : `Inspect ${plan.name} Plan`}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Metadata & Source Box */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/60 space-y-3 text-xs">
        <div className="font-bold text-slate-900 dark:text-white">
          {isPt ? "Informações Técnicas Adicionais" : "Additional Technical Metadata"}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600 dark:text-slate-400">
          <div>
            <strong>{isPt ? "Público Recomendado:" : "Recommended For:"}</strong> {product.targetAudience}
          </div>
          <div>
            <strong>{isPt ? "Idiomas Nativos:" : "Languages:"}</strong> {product.languages}
          </div>
          <div>
            <strong>{isPt ? "Integrações Suportadas:" : "Key Integrations:"}</strong> {product.integrations}
          </div>
          <div>
            <strong>{isPt ? "Fonte Verificada:" : "Verified Source:"}</strong>{" "}
            <a href={product.officialWebsite} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
              {product.source}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
