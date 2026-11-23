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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      {/* Page Header */}
      <div className="space-y-4">
        <Badge variant="verified" className="mb-1">
          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
          {isPt ? "Catálogo Central de Soluções" : "Central Solutions Catalog"}
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {dict.nav.categories}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          {isPt
            ? "Explore nosso diretório estruturado de ferramentas SaaS. Todos os softwares listados passam por verificação editorial de preços e recursos técnicos."
            : "Explore our verified directory of enterprise SaaS solutions. All products are audited for pricing validity and technical capabilities."}
        </p>

        {/* Live Search Form */}
        <div className="max-w-xl pt-2">
          <form
            action={`/${locale}/categories`}
            method="GET"
            className="relative flex items-center shadow-xs rounded-xl overflow-hidden border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent"
          >
            <div className="pl-3.5 text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder={isPt ? "Filtrar por nome, categoria ou recurso..." : "Filter by name, category, or feature..."}
              className="w-full bg-transparent px-3 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
            />
            {query && (
              <Link
                href={`/${locale}/categories`}
                className="pr-2 text-xs font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                Limpar
              </Link>
            )}
            <div className="pr-1.5">
              <Button size="sm" type="submit" className="text-xs font-semibold">
                {isPt ? "Buscar" : "Search"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Query Search Results for Softwares (if query present) */}
      {query && (
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Filter className="h-4 w-4 text-blue-600" />
              <span>
                {isPt
                  ? `Softwares encontrados para "${query}" (${matchingProducts.length})`
                  : `Software results for "${query}" (${matchingProducts.length})`}
              </span>
            </h2>
          </div>

          {matchingProducts.length === 0 ? (
            <Card className="p-8 text-center text-slate-500 text-xs sm:text-sm">
              {isPt
                ? "Nenhum software com esse termo foi encontrado no momento. Nossos robôs de catalogação estão indexando novas ferramentas semanalmente."
                : "No softwares found matching this term. Our indexing routines index new enterprise tools weekly."}
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {matchingProducts.map((p) => {
                const lowestPrice = p.prices?.[0];
                const priceText = lowestPrice
                  ? lowestPrice.price === 0
                    ? isPt ? "Plano Grátis / A partir de $" + (p.prices?.[1]?.price || 0) + "/mês" : "Free / From $" + (p.prices?.[1]?.price || 0) + "/mo"
                    : `$${lowestPrice.price}/mês`
                  : isPt ? "Preço Verificado" : "Audited Pricing";

                return (
                  <Card key={p.slug} className="flex flex-col justify-between hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all p-5">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-[11px]">
                          {p.category ? (isPt ? p.category.name_pt : p.category.name_en) : "SaaS"}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span>{p.rating_editorial}</span>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {p.name}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {isPt ? p.short_description_pt : p.short_description_en}
                      </p>

                      <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/40 text-xs flex items-center justify-between">
                        <span className="text-slate-400">Preço:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{priceText}</span>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <Link
                        href={`/${locale}/software/${p.slug}`}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {isPt ? "Ver Análise Completa" : "Read Full Audit"}
                      </Link>
                      <Link
                        href={`/go/${p.slug}`}
                        target="_blank"
                        rel="sponsored nofollow noopener"
                      >
                        <Button size="sm" className="h-7 text-[11px] gap-1 px-2.5">
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

      {/* Categories Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {query
            ? isPt
              ? `Categorias Relacionadas (${filteredCategories.length})`
              : `Matching Categories (${filteredCategories.length})`
            : isPt
            ? "Todas as Categorias"
            : "All Categories"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => {
            const Icon = iconMap[cat.slug] || Cpu;
            const categoryProductCount = allProducts.filter((p) => p.category?.slug === cat.slug).length;

            return (
              <Link key={cat.slug} href={`/${locale}/categories/${cat.slug}`}>
                <Card className="h-full hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between group p-6 border-slate-200 dark:border-slate-800">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 text-blue-600 dark:bg-blue-950/70 dark:text-blue-400 group-hover:scale-110 transition-transform">
                        <Icon className="h-6 w-6" />
                      </div>
                      <Badge variant="outline" className="text-[11px] font-mono">
                        {categoryProductCount} {categoryProductCount === 1 ? "software" : "softwares"}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {isPt ? cat.name_pt : cat.name_en}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed line-clamp-3">
                        {isPt ? cat.description_pt : cat.description_en}
                      </p>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <span>{isPt ? "Ver softwares auditados" : "View audited softwares"}</span>
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
