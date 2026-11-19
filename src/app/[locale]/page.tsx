import React from "react";
import Link from "next/link";
import { type Locale, getDictionary } from "@/lib/i18n/dictionaries";
import {
  Search,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Brain,
  Users,
  Cpu,
  Mail,
  CheckSquare,
  Globe,
  Star,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface HomePageProps {
  params: {
    locale: Locale;
  };
}

export default function HomePage({ params }: HomePageProps) {
  const { locale } = params;
  const dict = getDictionary(locale);

  const categories = [
    {
      slug: "inteligencia-artificial",
      title: locale === "pt-br" ? "Inteligência Artificial" : "Artificial Intelligence",
      description: locale === "pt-br" ? "Assistentes, LLMs e automação cognitiva" : "Assistants, LLMs & cognitive engines",
      icon: Brain,
      count: 24,
    },
    {
      slug: "crm",
      title: "CRM & Vendas",
      description: locale === "pt-br" ? "Gestão de clientes, pipelines e negócios" : "Client tracking, pipelines & deals",
      icon: Users,
      count: 18,
    },
    {
      slug: "automacao",
      title: locale === "pt-br" ? "Automação No-Code" : "Workflow Automation",
      description: locale === "pt-br" ? "Integração de APIs, webhooks e rotinas" : "API integration, webhooks & scripts",
      icon: Cpu,
      count: 15,
    },
    {
      slug: "email-marketing",
      title: "E-mail Marketing",
      description: locale === "pt-br" ? "Disparos, funis de nutrição e newsletter" : "Broadcasts, newsletters & drip funnels",
      icon: Mail,
      count: 14,
    },
    {
      slug: "produtividade",
      title: locale === "pt-br" ? "Produtividade & Wikis" : "Productivity & Workspaces",
      description: locale === "pt-br" ? "Gestão de tarefas, notas e colaboração" : "Task tracking, notes & agile teamwork",
      icon: CheckSquare,
      count: 20,
    },
    {
      slug: "criacao-de-sites",
      title: locale === "pt-br" ? "Criação de Sites" : "Website & Funnel Builders",
      description: locale === "pt-br" ? "Landing pages, lojas e CMS sem código" : "Landing pages, e-com & no-code CMS",
      icon: Globe,
      count: 16,
    },
  ];

  const featuredSoftware = [
    {
      name: "HubSpot CRM",
      slug: "hubspot",
      category: "CRM & Vendas",
      rating: 4.8,
      verifiedPrice: "Grátis / A partir de $20/mês",
      hasFreePlan: true,
      hasTrial: true,
      tag: "Mais Popular",
      summary:
        locale === "pt-br"
          ? "Ecossistema completo de CRM, marketing, vendas e atendimento com generoso plano gratuito."
          : "Comprehensive CRM, marketing, sales and support suite with a powerful free forever tier.",
      affiliateSlug: "hubspot",
    },
    {
      name: "Notion",
      slug: "notion",
      category: "Produtividade",
      rating: 4.9,
      verifiedPrice: "Grátis / $10/mês",
      hasFreePlan: true,
      hasTrial: true,
      tag: "Escolha Editorial",
      summary:
        locale === "pt-br"
          ? "Workspace flexível combinando documentos, wikis de equipe e bancos de dados relacionais."
          : "Modular team workspace unifying docs, internal wikis, and flexible relational databases.",
      affiliateSlug: "notion",
    },
    {
      name: "ActiveCampaign",
      slug: "activecampaign",
      category: "E-mail Marketing",
      rating: 4.7,
      verifiedPrice: "A partir de $19/mês",
      hasFreePlan: false,
      hasTrial: true,
      tag: "Melhor Automação",
      summary:
        locale === "pt-br"
          ? "Referência global em automação comportamental avançada e segmentação de campanhas de e-mail."
          : "Global leader in behavioral email workflows, customer segmentation, and drip automation.",
      affiliateSlug: "activecampaign",
    },
  ];

  const popularComparisons = [
    {
      title: "HubSpot vs ActiveCampaign",
      slug: "hubspot-vs-activecampaign",
      badge: "CRM vs Automação",
      summary:
        locale === "pt-br"
          ? "Descubra qual oferece o melhor custo-benefício para equipes que precisam de nutrição de leads."
          : "Side-by-side cost and feature analysis for teams focusing on lead nurturing and pipeline sales.",
    },
    {
      title: "Notion vs ClickUp",
      slug: "notion-vs-clickup",
      badge: "Espaço de Trabalho",
      summary:
        locale === "pt-br"
          ? "Comparação detalhada entre flexibilidade documental e rigor no gerenciamento de projetos ágeis."
          : "Document-centric flexibility vs structured sprint and task management capabilities.",
    },
    {
      title: "Systeme.io vs Hotmart",
      slug: "systeme-vs-hotmart",
      badge: "Infoprodutos & Funis",
      summary:
        locale === "pt-br"
          ? "Análise de taxas, infraestrutura de checkout, hospedagem de cursos e facilidade de configuração."
          : "Fee structure, checkout options, course hosting, and email funnel conversion comparison.",
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-slate-50 via-white to-white py-20 dark:border-slate-800 dark:from-slate-950 dark:via-slate-900/40 dark:to-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <Badge variant="verified" className="px-3 py-1 gap-1.5 text-xs font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              {dict.hero.badge}
            </Badge>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              {dict.hero.title}
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              {dict.hero.subtitle}
            </p>

            {/* Live Search Bar */}
            <div className="mx-auto max-w-xl pt-4">
              <form
                action={`/${locale}/categories`}
                method="GET"
                className="relative flex items-center shadow-lg rounded-xl overflow-hidden border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent"
              >
                <div className="pl-4 text-slate-400">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  name="q"
                  placeholder={dict.nav.searchPlaceholder}
                  className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
                />
                <div className="pr-2">
                  <Button size="sm" type="submit" className="font-semibold">
                    {dict.hero.searchCta}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {dict.home.categoriesTitle}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {dict.home.categoriesSubtitle}
            </p>
          </div>
          <Link
            href={`/${locale}/categories`}
            className="mt-3 sm:mt-0 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
          >
            Ver todas as 10 categorias <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.slug} href={`/${locale}/categories/${cat.slug}`}>
                <Card className="h-full hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between group">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 group-hover:scale-105 transition-transform">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-400">
                        {cat.count} softwares
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {cat.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                    <span>Explorar catálogo</span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Software Cards */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {dict.home.featuredTitle}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {dict.home.featuredSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredSoftware.map((soft) => (
            <Card key={soft.slug} className="flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-[11px]">
                    {soft.category}
                  </Badge>
                  <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {soft.tag}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {soft.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>{soft.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {soft.summary}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/40 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Preço verificado:</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {soft.verifiedPrice}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Plano Gratuito:</span>
                    <span className={soft.hasFreePlan ? "text-emerald-600 font-semibold" : "text-slate-600"}>
                      {soft.hasFreePlan ? "Sim, vitalício" : "Apenas teste"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <Link href={`/${locale}/software/${soft.slug}`} className="text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400">
                  Ver Análise
                </Link>
                <Link
                  href={`/go/${soft.affiliateSlug}`}
                  target="_blank"
                  rel="sponsored nofollow noopener"
                >
                  <Button size="sm" className="gap-1.5 text-xs font-semibold">
                    <span>Acessar Fornecedor</span>
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Side-by-side Comparisons Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {dict.home.compareTitle}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {dict.home.compareSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularComparisons.map((comp) => (
            <Card key={comp.slug} className="flex flex-col justify-between hover:border-slate-400 transition-colors">
              <div className="space-y-3">
                <Badge variant="outline" className="text-[11px]">
                  {comp.badge}
                </Badge>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {comp.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {comp.summary}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href={`/${locale}/compare/${comp.slug}`}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>Comparar Recursos Lado a Lado</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Secondary Revenue Channel: Custom Systems Callout */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white p-8 dark:border-blue-900/50 dark:from-blue-950/40 dark:via-slate-900 dark:to-slate-900 sm:p-10">
          <div className="max-w-2xl space-y-4">
            <Badge variant="verified" className="bg-blue-100 text-blue-800 border-blue-200">
              <Sparkles className="h-3.5 w-3.5 text-blue-600 mr-1" />
              {dict.commercial.badge}
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {dict.commercial.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {dict.commercial.subtitle}
            </p>
            <div className="pt-2">
              <Link href={`/${locale}/custom-systems`}>
                <Button size="lg" className="font-semibold gap-2">
                  <span>Solicitar Briefing com IA</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
