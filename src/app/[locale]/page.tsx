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
  TrendingUp,
  BarChart3,
  MessageSquare,
  Briefcase,
  ShoppingBag,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getCategories, getProducts } from "@/services/catalog";
import { getStoreProducts } from "@/services/digitalStore/catalog";

interface HomePageProps {
  params: {
    locale: Locale;
  };
}

export const revalidate = 60; // ISR cache 60 seconds

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const isPt = locale === "pt-br";

  const [dbCategories, dbProducts, storeProducts] = await Promise.all([
    getCategories(),
    getProducts({ limit: 6, featuredOnly: true }),
    getStoreProducts(true),
  ]);

  const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    "inteligencia-artificial": Brain,
    "crm": Users,
    "automacao": Cpu,
    "marketing-digital": TrendingUp,
    "email-marketing": Mail,
    "produtividade": CheckSquare,
    "gestao-empresarial": BarChart3,
    "criacao-de-sites": Globe,
    "atendimento-ao-cliente": MessageSquare,
    "pequenas-empresas": Briefcase,
  };

  const popularComparisons = [
    {
      title: "HubSpot CRM vs ActiveCampaign",
      p1: "hubspot",
      p2: "activecampaign",
      badge: isPt ? "CRM vs Automação" : "CRM vs Automation",
      summary: isPt
        ? "Descubra qual oferece o melhor custo-benefício e ferramentas de nutrição de leads para seu estágio."
        : "Side-by-side cost and feature analysis for teams focusing on lead nurturing and sales pipelines.",
    },
    {
      title: "ChatGPT Enterprise vs Claude AI",
      p1: "chatgpt-enterprise",
      p2: "claude-ai",
      badge: isPt ? "Duelo de Modelos LLM" : "LLM Model Benchmark",
      summary: isPt
        ? "Análise comparativa entre GPT-4o e Claude 3.5 Sonnet para engenharia de software e análise documental."
        : "Deep technical comparison between OpenAI GPT-4o and Anthropic Claude 3.5 Sonnet.",
    },
    {
      title: "Zapier vs Make (Integromat)",
      p1: "zapier",
      p2: "make",
      badge: isPt ? "Automação No-Code" : "No-Code Automation",
      summary: isPt
        ? "Análise de limites de operações mensais, complexidade visual de cenários e custo real por execução."
        : "Monthly operation allowances, visual scenario complexity, and cost-per-execution comparison.",
    },
    {
      title: "Notion vs ClickUp",
      p1: "notion",
      p2: "clickup",
      badge: isPt ? "Gestão & Produtividade" : "Workspaces & Productivity",
      summary: isPt
        ? "Comparação entre flexibilidade documental e rigor no gerenciamento de sprints e tarefas ágeis."
        : "Document-centric flexibility vs structured sprint and task management capabilities.",
    },
    {
      title: "Conta Azul vs Omie ERP",
      p1: "conta-azul",
      p2: "omie-erp",
      badge: isPt ? "Gestão Empresarial" : "Cloud ERP",
      summary: isPt
        ? "Emissão de notas fiscais, conciliação bancária automática com Pix e conexão direta com contabilidade."
        : "Tax compliance, bank statement integration and financial ledger automation compared side-by-side.",
    },
    {
      title: "Webflow vs Framer",
      p1: "webflow",
      p2: "framer",
      badge: isPt ? "Criação de Sites" : "Visual CMS & Design",
      summary: isPt
        ? "Controle granular de código e CMS corporativo versus velocidade de prototipação estilo Figma."
        : "Granular CSS and enterprise CMS control vs lightning-fast Figma-to-site velocity.",
    },
  ];

  const quickSearchTags = [
    { label: "ChatGPT & IA", q: "ia" },
    { label: "HubSpot & CRM", q: "crm" },
    { label: "Zapier & Automação", q: "automacao" },
    { label: "Notion & Produtividade", q: "produtividade" },
    { label: "E-mail Marketing", q: "email" },
  ];

  return (
    <div className="space-y-20 pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-blue-50/40 via-white to-slate-50/50 py-20 lg:py-28 dark:border-slate-800 dark:from-slate-950 dark:via-slate-900/60 dark:to-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/90 px-3.5 py-1 text-xs font-bold text-blue-700 shadow-xs dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              <span>{dict.hero.badge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              {dict.hero.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              {dict.hero.subtitle}
            </p>

            {/* Live Search Bar with Instant Suggestions */}
            <div className="mx-auto max-w-xl pt-4 space-y-3">
              <form
                action={`/${locale}/categories`}
                method="GET"
                className="relative flex items-center shadow-lg rounded-2xl overflow-hidden border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent transition-all"
              >
                <div className="pl-4 text-slate-400">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  name="q"
                  placeholder={dict.nav.searchPlaceholder}
                  className="w-full bg-transparent px-3 py-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
                />
                <div className="pr-2">
                  <Button size="sm" type="submit" className="font-bold px-4 py-2 text-xs shadow-xs">
                    {dict.hero.searchCta}
                  </Button>
                </div>
              </form>

              {/* Quick Filter Tags */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
                <span className="text-slate-400 font-medium">{isPt ? "Mais buscados:" : "Trending:"}</span>
                {quickSearchTags.map((tag) => (
                  <Link
                    key={tag.q}
                    href={`/${locale}/categories?q=${tag.q}`}
                    className="rounded-full border border-slate-200/80 bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:border-blue-400 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
                  >
                    {tag.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Trust Proof Badges */}
            <div className="pt-8 border-t border-slate-200/60 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">10 Áreas</div>
                <div className="text-xs text-slate-500 mt-0.5">Categorias Auditadas</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">20+ Softwares</div>
                <div className="text-xs text-slate-500 mt-0.5">Planos Verificados</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">100% Oficial</div>
                <div className="text-xs text-slate-500 mt-0.5">Dados Direto da Fonte</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">R$ 0 Custo</div>
                <div className="text-xs text-slate-500 mt-0.5">Acesso 100% Gratuito</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-2 w-2 rounded-full bg-blue-600" />
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                {isPt ? "Diretório Estruturado" : "Structured Directory"}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {dict.home.categoriesTitle}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {dict.home.categoriesSubtitle}
            </p>
          </div>
          <Link
            href={`/${locale}/categories`}
            className="mt-3 sm:mt-0 text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 group"
          >
            <span>Ver todas as {dbCategories.length} categorias</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {dbCategories.slice(0, 6).map((cat) => {
            const Icon = categoryIcons[cat.slug] || Cpu;
            return (
              <Link key={cat.slug} href={`/${locale}/categories/${cat.slug}`}>
                <Card className="h-full hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between group p-6">
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-blue-400 group-hover:scale-110 transition-transform">
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        Auditado
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {isPt ? cat.name_pt : cat.name_en}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {isPt ? cat.description_pt : cat.description_en}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                    <span>Explorar catálogo</span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Software Cards (Live from Supabase) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              {isPt ? "Soluções em Destaque" : "Top Tier Solutions"}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {dict.home.featuredTitle}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {dict.home.featuredSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dbProducts.map((soft) => {
            const lowestPrice = soft.prices?.[0];
            const priceText = lowestPrice
              ? lowestPrice.price === 0
                ? isPt ? "Plano Grátis / A partir de $" + (soft.prices?.[1]?.price || 0) + "/mês" : "Free Forever / From $" + (soft.prices?.[1]?.price || 0) + "/mo"
                : `$${lowestPrice.price} / mês`
              : isPt ? "Preço Verificado Oficial" : "Verified Official Pricing";

            return (
              <Card key={soft.slug} className="flex flex-col justify-between hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-[11px] font-semibold">
                      {soft.category ? (isPt ? soft.category.name_pt : soft.category.name_en) : "SaaS"}
                    </Badge>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                      <CheckCircle2 className="h-3 w-3" />
                      Auditado
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        {soft.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs font-black text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span>{soft.rating_editorial}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed line-clamp-3">
                      {isPt ? soft.short_description_pt : soft.short_description_en}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/40 space-y-2 text-xs border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Preço verificado:</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {priceText}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Plano Gratuito:</span>
                      <span className={soft.free_plan_available ? "text-emerald-600 font-bold" : "text-slate-600"}>
                        {soft.free_plan_available ? "Sim, vitalício" : `${soft.free_trial_days || 14} dias teste`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <Link
                    href={`/${locale}/software/${soft.slug}`}
                    className="text-xs font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                  >
                    Ver Análise Completa
                  </Link>
                  <Link
                    href={`/go/${soft.slug}`}
                    target="_blank"
                    rel="sponsored nofollow noopener"
                  >
                    <Button size="sm" className="gap-1.5 text-xs font-bold shadow-xs">
                      <span>Acessar</span>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Side-by-side Comparisons Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-2 w-2 rounded-full bg-blue-600" />
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                {isPt ? "Comparativos Paramétricos" : "Parametric Comparisons"}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {dict.home.compareTitle}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {dict.home.compareSubtitle}
            </p>
          </div>
          <Link
            href={`/${locale}/compare`}
            className="mt-3 sm:mt-0 text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 group"
          >
            <span>Abrir Comparador Geral</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularComparisons.slice(0, 3).map((comp) => (
            <Card key={comp.title} className="flex flex-col justify-between hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-600 transition-all p-6">
              <div className="space-y-3">
                <Badge variant="outline" className="text-[11px] font-semibold">
                  {comp.badge}
                </Badge>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {comp.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {comp.summary}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href={`/${locale}/compare?p1=${comp.p1}&p2=${comp.p2}`}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>Comparar Recursos Lado a Lado</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Digital Products Store Preview Callout */}
      {storeProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-white p-8 dark:border-emerald-900/50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 sm:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-100/80 px-3 py-0.5 text-xs font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                  <Zap className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Loja Digital & Ativação Imediata</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  Licenças de IA, Vouchers & Ferramentas Oficiais
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Adquira contas oficiais, créditos para ChatGPT Plus, Midjourney e automações com entrega automática de licença e pagamento via Binance Pay.
                </p>
              </div>

              <div className="shrink-0">
                <Link href={`/${locale}/store`}>
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 text-sm shadow-md">
                    <ShoppingBag className="h-4 w-4" />
                    <span>Acessar Loja Digital ({storeProducts.length} itens)</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Cards of Store Products */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-emerald-200/60 dark:border-emerald-900/40">
              {storeProducts.slice(0, 3).map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900/90 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {item.category}
                    </Badge>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                      ${item.sale_price} USDT
                    </span>
                  </div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                    {item.name}
                  </div>
                  <Link
                    href={`/${locale}/store/checkout?productId=${item.id}`}
                    className="inline-block text-[11px] font-bold text-emerald-600 hover:underline pt-1"
                  >
                    Comprar agora →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Custom Systems Callout */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white p-8 dark:border-blue-900/50 dark:from-blue-950/40 dark:via-slate-900 dark:to-slate-900 sm:p-10">
          <div className="max-w-2xl space-y-4">
            <Badge variant="verified" className="bg-blue-100 text-blue-800 border-blue-200">
              <Sparkles className="h-3.5 w-3.5 text-blue-600 mr-1" />
              {dict.commercial.badge}
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {dict.commercial.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {dict.commercial.subtitle}
            </p>
            <div className="pt-2">
              <Link href={`/${locale}/custom-systems`}>
                <Button size="lg" className="font-bold gap-2 text-sm shadow-sm">
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
