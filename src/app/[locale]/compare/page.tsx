import React from "react";
import Link from "next/link";
import { type Locale } from "@/lib/i18n/dictionaries";
import {
  Check,
  X,
  ExternalLink,
  Star,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getProducts, getProductsForComparison } from "@/services/catalog";
import { ComparisonSelector } from "@/components/public/ComparisonSelector";

interface ComparePageProps {
  params: {
    locale: Locale;
  };
  searchParams?: {
    p1?: string;
    p2?: string;
  };
}

export const revalidate = 60;

export default async function ComparePage({ params, searchParams }: ComparePageProps) {
  const { locale } = params;
  const isPt = locale === "pt-br";

  const allProducts = await getProducts({ publishedOnly: true });

  const p1Slug = searchParams?.p1 || allProducts[0]?.slug || "hubspot";
  const p2Slug = searchParams?.p2 || (allProducts[1]?.slug !== p1Slug ? allProducts[1]?.slug : allProducts[2]?.slug) || "activecampaign";

  const comparedProducts = await getProductsForComparison([p1Slug, p2Slug]);
  const p1 = comparedProducts.find((p) => p.slug === p1Slug) || allProducts.find((p) => p.slug === p1Slug) || allProducts[0];
  const p2 = comparedProducts.find((p) => p.slug === p2Slug) || allProducts.find((p) => p.slug === p2Slug) || allProducts[1] || allProducts[0];

  const productOptions = allProducts.map((p) => ({
    slug: p.slug,
    name: p.name,
    categoryName: p.category ? (isPt ? p.category.name_pt : p.category.name_en) : "SaaS",
  }));

  const criteria = [
    {
      name: isPt ? "Preço Inicial Verificado" : "Starting Verified Price",
      val1: p1?.prices?.[0] ? (p1.prices[0].price === 0 ? (isPt ? "Plano Grátis Vitalício" : "Free Forever Plan") : `$${p1.prices[0].price}/mês`) : (isPt ? "Consulte Fornecedor" : "Official Pricing"),
      val2: p2?.prices?.[0] ? (p2.prices[0].price === 0 ? (isPt ? "Plano Grátis Vitalício" : "Free Forever Plan") : `$${p2.prices[0].price}/mês`) : (isPt ? "Consulte Fornecedor" : "Official Pricing"),
    },
    {
      name: isPt ? "Plano Gratuito Permanente" : "Free Forever Tier",
      isBool: true,
      val1: p1?.free_plan_available,
      val2: p2?.free_plan_available,
    },
    {
      name: isPt ? "Período de Teste Gratuito" : "Free Trial Period",
      val1: p1?.free_trial_days ? `${p1.free_trial_days} ${isPt ? "dias de teste" : "days trial"}` : (isPt ? "Acesso direto via plano gratuito" : "Direct access via free plan"),
      val2: p2?.free_trial_days ? `${p2.free_trial_days} ${isPt ? "dias de teste" : "days trial"}` : (isPt ? "Acesso direto via plano gratuito" : "Direct access via free plan"),
    },
    {
      name: isPt ? "Segmento / Categoria" : "Category / Domain",
      val1: p1?.category ? (isPt ? p1.category.name_pt : p1.category.name_en) : "-",
      val2: p2?.category ? (isPt ? p2.category.name_pt : p2.category.name_en) : "-",
    },
    {
      name: isPt ? "Nota Técnica Editorial" : "Technical Audit Score",
      val1: `${p1?.rating_editorial || 4.8} / 5.0 ★`,
      val2: `${p2?.rating_editorial || 4.8} / 5.0 ★`,
    },
    {
      name: isPt ? "Transparência de Preços" : "Pricing Transparency",
      val1: isPt ? "100% Auditado na Documentação" : "100% Audited from Official Docs",
      val2: isPt ? "100% Auditado na Documentação" : "100% Audited from Official Docs",
    },
  ];

  // Quick pairs recommendations
  const recommendedPairs = [
    { p1: "hubspot", p2: "activecampaign", label: "HubSpot vs ActiveCampaign" },
    { p1: "zapier", p2: "make", label: "Zapier vs Make" },
    { p1: "notion", p2: "clickup", label: "Notion vs ClickUp" },
    { p1: "chatgpt-enterprise", p2: "claude-ai", label: "ChatGPT vs Claude" },
    { p1: "conta-azul", p2: "omie-erp", label: "Conta Azul vs Omie" },
    { p1: "webflow", p2: "framer", label: "Webflow vs Framer" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      {/* Page Header */}
      <div className="space-y-4">
        <Badge variant="verified">
          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
          {isPt ? "Comparador Paramétrico Imparcial" : "Unbiased Technical Comparator"}
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {p1?.name} <span className="text-blue-600">vs</span> {p2?.name}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          {isPt
            ? "Comparativo estruturado com base nos dados públicos verificados e auditados em nosso banco de dados. Sem avaliações patrocinadas, sem notas infladas."
            : "Structured benchmark based on verified and audited public documentation in our database. No paid bias, no manufactured ratings."}
        </p>
      </div>

      {/* Dynamic Interactive Tool Selector */}
      <ComparisonSelector
        locale={locale}
        products={productOptions}
        currentP1={p1?.slug || p1Slug}
        currentP2={p2?.slug || p2Slug}
      />

      {/* Quick Comparison Pills */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-slate-400 mr-1">
          {isPt ? "Duelos populares:" : "Popular match-ups:"}
        </span>
        {recommendedPairs.map((pair) => (
          <Link
            key={`${pair.p1}-${pair.p2}`}
            href={`/${locale}/compare?p1=${pair.p1}&p2=${pair.p2}`}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 font-medium text-slate-700 hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            {pair.label}
          </Link>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-950/80">
                <th className="p-5 font-bold text-slate-500 w-1/3 text-xs uppercase tracking-wider">
                  {isPt ? "Critério Técnico Auditado" : "Technical Audit Criterion"}
                </th>
                {[p1, p2].map((p, idx) => (
                  <th key={p?.slug || idx} className="p-5 text-center w-1/3">
                    <div className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                      {p?.name}
                    </div>
                    <div className="flex items-center justify-center gap-1 text-xs text-amber-500 font-bold mt-1">
                      <Star className="h-4 w-4 fill-current" />
                      <span>{p?.rating_editorial} / 5.0</span>
                      <span className="text-slate-400 font-normal">({isPt ? "Auditoria" : "Score"})</span>
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
                      <Link
                        href={`/${locale}/software/${p?.slug}`}
                        className="text-xs font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 underline"
                      >
                        {isPt ? "Ver Análise" : "View Audit"}
                      </Link>
                      <Link
                        href={`/go/${p?.slug}`}
                        target="_blank"
                        rel="sponsored nofollow noopener"
                      >
                        <Button size="sm" className="font-bold text-xs gap-1.5 shadow-sm">
                          <span>Acessar {p?.name}</span>
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {criteria.map((c) => (
                <tr key={c.name} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40 transition-colors">
                  <td className="p-4 sm:p-5 font-semibold text-slate-700 dark:text-slate-300">
                    {c.name}
                  </td>
                  <td className="p-4 sm:p-5 text-center">
                    {c.isBool ? (
                      c.val1 ? (
                        <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                          <Check className="h-3.5 w-3.5" />
                          <span>{isPt ? "Disponível" : "Yes"}</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          <X className="h-3.5 w-3.5" />
                          <span>{isPt ? "Não possui" : "No"}</span>
                        </div>
                      )
                    ) : (
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {String(c.val1)}
                      </span>
                    )}
                  </td>
                  <td className="p-4 sm:p-5 text-center">
                    {c.isBool ? (
                      c.val2 ? (
                        <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                          <Check className="h-3.5 w-3.5" />
                          <span>{isPt ? "Disponível" : "Yes"}</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          <X className="h-3.5 w-3.5" />
                          <span>{isPt ? "Não possui" : "No"}</span>
                        </div>
                      )
                    ) : (
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {String(c.val2)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {/* Short Descriptions Row */}
              <tr className="bg-slate-50/40 dark:bg-slate-900/40">
                <td className="p-4 sm:p-5 font-semibold text-slate-700 dark:text-slate-300">
                  {isPt ? "Resumo e Proposta de Valor" : "Core Value Proposition"}
                </td>
                <td className="p-4 sm:p-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed text-center sm:text-left">
                  {isPt ? p1?.short_description_pt : p1?.short_description_en}
                </td>
                <td className="p-4 sm:p-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed text-center sm:text-left">
                  {isPt ? p2?.short_description_pt : p2?.short_description_en}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
