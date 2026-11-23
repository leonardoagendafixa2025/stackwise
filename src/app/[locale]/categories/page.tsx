import React from "react";
import Link from "next/link";
import { type Locale, getDictionary } from "@/lib/i18n/dictionaries";
import {
  Brain,
  Users,
  Cpu,
  Mail,
  CheckSquare,
  BarChart3,
  Globe,
  MessageSquare,
  Briefcase,
  ArrowRight,
  TrendingUp,
  Search,
  Star,
  ExternalLink,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getCategories, getProducts } from "@/services/catalog";

interface CategoriesPageProps {
  params: {
    locale: Locale;
  };
  searchParams?: {
    q?: string;
  };
}

export const revalidate = 60;

export default async function CategoriesPage({ params, searchParams }: CategoriesPageProps) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const isPt = locale === "pt-br";
  const query = (searchParams?.q || "").trim().toLowerCase();

  const [categories, allProducts] = await Promise.all([
    getCategories(),
    getProducts({ publishedOnly: true }),
  ]);

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
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

  // Filter categories by query if given
  const filteredCategories = query
    ? categories.filter((c) =>
        (isPt ? c.name_pt : c.name_en).toLowerCase().includes(query) ||
        (isPt ? c.description_pt : c.description_en)?.toLowerCase().includes(query) ||
        c.slug.includes(query)
      )
    : categories;

  // Filter products by query if given
  const matchingProducts = query
    ? allProducts.filter((p) =>
        p.name.toLowerCase().includes(query) ||
        (isPt ? p.short_description_pt : p.short_description_en)?.toLowerCase().includes(query) ||
        p.slug.toLowerCase().includes(query) ||
        (p.category && (isPt ? p.category.name_pt : p.category.name_en)?.toLowerCase().includes(query))
      )
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50/60 to-blue-50/30 p-8 sm:p-12 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-bold text-blue-700 shadow-2xs dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300">
            <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
            <span>{isPt ? "Catálogo Central de Soluções Auditadas" : "Central Audited Solutions Directory"}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            {dict.nav.categories}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {isPt
              ? "Explore nosso diretório estruturado de ferramentas SaaS. Todos os softwares listados passam por verificação editorial de preços oficiais, termos de licença e capacidades técnicas."
              : "Explore our verified directory of enterprise SaaS solutions. All products are audited for pricing validity and technical capabilities."}
          </p>

          {/* Live Search Form */}
          <div className="pt-3 max-w-2xl">
            <form
              action={`/${locale}/categories`}
              method="GET"
              className="relative flex items-center shadow-md rounded-2xl overflow-hidden border border-slate-300/80 bg-white p-1.5 dark:border-slate-700 dark:bg-slate-900 focus-within:ring-2 focus-within:ring-blue-600 transition-all"
            >
              <div className="pl-3.5 text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder={isPt ? "Filtrar por nome, categoria ou recurso..." : "Filter by name, category, or feature..."}
                className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
              />
              {query && (
                <Link
                  href={`/${locale}/categories`}
                  className="px-2 text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors whitespace-nowrap"
                >
                  Limpar
                </Link>
              )}
              <Button size="sm" type="submit" className="rounded-xl font-bold px-4 text-xs shadow-xs">
                {isPt ? "Buscar" : "Search"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Query Search Results for Softwares (if query present) */}
      {query && (
        <div className="space-y-6 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600" />
              <span>
                {isPt
                  ? `Softwares encontrados para "${query}" (${matchingProducts.length})`
                  : `Software results for "${query}" (${matchingProducts.length})`}
              </span>
            </h2>
          </div>

          {matchingProducts.length === 0 ? (
            <Card className="p-10 text-center text-slate-500 text-sm rounded-2xl border-dashed">
              {isPt
                ? "Nenhum software com esse termo foi encontrado no momento. Nossos robôs de catalogação estão indexando novas ferramentas semanalmente."
                : "No softwares found matching this term. Our indexing routines index new enterprise tools weekly."}
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingProducts.map((p) => {
                const lowestPrice = p.prices?.[0];
                const priceText = lowestPrice
                  ? lowestPrice.price === 0
                    ? isPt ? "Plano Grátis / A partir de $" + (p.prices?.[1]?.price || 0) + "/mês" : "Free / From $" + (p.prices?.[1]?.price || 0) + "/mo"
                    : `$${lowestPrice.price}/mês`
                  : isPt ? "Preço Oficial Auditado" : "Audited Pricing";

                return (
                  <Card key={p.slug} className="flex flex-col justify-between hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-600 transition-all p-6 rounded-2xl border-slate-200/90 bg-white dark:bg-slate-900">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-[11px] font-bold">
                          {p.category ? (isPt ? p.category.name_pt : p.category.name_en) : "SaaS"}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs font-black text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span>{p.rating_editorial}</span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">
                          {p.name}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                          {isPt ? p.short_description_pt : p.short_description_en}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/40 text-xs flex items-center justify-between border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-400 font-medium">Preço auditado:</span>
                        <span className="font-extrabold text-slate-900 dark:text-slate-100">{priceText}</span>
                      </div>
                    </div>

                    <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <Link
                        href={`/${locale}/software/${p.slug}`}
                        className="text-xs font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                      >
                        {isPt ? "Ver Análise Completa" : "Read Full Audit"}
                      </Link>
                      <Link
                        href={`/go/${p.slug}`}
                        target="_blank"
                        rel="sponsored nofollow noopener"
                      >
                        <Button size="sm" className="rounded-xl font-bold text-xs gap-1.5 px-3 shadow-xs">
                          <span>Acessar</span>
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Categories Bento Grid */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {query
              ? isPt
                ? `Categorias Relacionadas (${filteredCategories.length})`
                : `Matching Categories (${filteredCategories.length})`
              : isPt
              ? "Todas as Categorias do Ecossistema"
              : "All Ecosystem Categories"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Selecione uma área para explorar softwares e comparativos paramétricos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => {
            const Icon = iconMap[cat.slug] || Cpu;
            const categoryProductCount = allProducts.filter((p) => p.category?.slug === cat.slug).length;

            return (
              <Link key={cat.slug} href={`/${locale}/categories/${cat.slug}`}>
                <Card className="h-full hover:shadow-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all flex flex-col justify-between group p-7 rounded-3xl border-slate-200/90 bg-white dark:bg-slate-900">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform">
                        <Icon className="h-6 w-6" />
                      </div>
                      <Badge variant="outline" className="text-[11px] font-bold font-mono">
                        {categoryProductCount} {categoryProductCount === 1 ? "software" : "softwares"}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {isPt ? cat.name_pt : cat.name_en}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed line-clamp-3 font-normal">
                        {isPt ? cat.description_pt : cat.description_en}
                      </p>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                    <span>{isPt ? "Explorar softwares auditados" : "Explore audited softwares"}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
