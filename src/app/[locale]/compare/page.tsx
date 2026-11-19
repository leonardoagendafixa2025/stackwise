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

  const allProducts = await getProducts();
  const p1Slug = searchParams?.p1 || "hubspot";
  const p2Slug = searchParams?.p2 || "activecampaign";

  const comparedProducts = await getProductsForComparison([p1Slug, p2Slug]);
  const p1 = comparedProducts.find((p) => p.slug === p1Slug) || allProducts[0];
  const p2 = comparedProducts.find((p) => p.slug === p2Slug) || allProducts[1] || allProducts[0];

  const criteria = [
    {
      name: isPt ? "Preço Inicial" : "Starting Price",
      val1: p1?.prices?.[0] ? (p1.prices[0].price === 0 ? (isPt ? "Plano Grátis" : "Free Plan") : `$${p1.prices[0].price}/mês`) : "Consulte",
      val2: p2?.prices?.[0] ? (p2.prices[0].price === 0 ? (isPt ? "Plano Grátis" : "Free Plan") : `$${p2.prices[0].price}/mês`) : "Consulte",
    },
    {
      name: isPt ? "Plano Gratuito Vitalício" : "Free Forever Plan",
      isBool: true,
      val1: p1?.free_plan_available,
      val2: p2?.free_plan_available,
    },
    {
      name: isPt ? "Período de Teste Gratuito" : "Free Trial Period",
      val1: p1?.free_trial_days ? `${p1.free_trial_days} dias` : (isPt ? "Sem teste temporário" : "No timed trial"),
      val2: p2?.free_trial_days ? `${p2.free_trial_days} dias` : (isPt ? "Sem teste temporário" : "No timed trial"),
    },
    {
      name: isPt ? "Categoria" : "Category",
      val1: p1?.category ? (isPt ? p1.category.name_pt : p1.category.name_en) : "-",
      val2: p2?.category ? (isPt ? p2.category.name_pt : p2.category.name_en) : "-",
    },
    {
      name: isPt ? "Nota Técnica Editorial" : "Technical Rating",
      val1: `${p1?.rating_editorial || 4.5} / 5.0`,
      val2: `${p2?.rating_editorial || 4.5} / 5.0`,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      <div>
        <Badge variant="verified" className="mb-3">
          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
          {isPt ? "Comparador Técnico Paramétrico" : "Parametric Technical Comparator"}
        </Badge>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {p1?.name} vs {p2?.name}
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-3xl">
          {isPt
            ? "Comparativo estruturado com base nos dados públicos verificados e auditados em nosso banco de dados."
            : "Structured benchmark based on verified and audited public documentation in our database."}
        </p>
      </div>

      {/* Quick Tool Selector Bar */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-4 text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          {isPt ? "Escolha outras ferramentas para comparar:" : "Select other tools to compare:"}
        </span>
        <div className="flex flex-wrap gap-2">
          {allProducts.map((prod) => (
            <Link
              key={prod.slug}
              href={`/${locale}/compare?p1=${p1Slug}&p2=${prod.slug}`}
              className={`px-2.5 py-1 rounded-md border font-medium transition-colors ${
                prod.slug === p2Slug
                  ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              vs {prod.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                <th className="p-4 font-semibold text-slate-500 w-1/3">
                  {isPt ? "Critério Técnico" : "Technical Criterion"}
                </th>
                {[p1, p2].map((p, idx) => (
                  <th key={p?.slug || idx} className="p-4 text-center w-1/3">
                    <div className="text-base font-bold text-slate-900 dark:text-white">
                      {p?.name}
                    </div>
                    <div className="flex items-center justify-center gap-1 text-xs text-amber-500 font-bold mt-1">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>{p?.rating_editorial} / 5.0</span>
                    </div>
                    <div className="mt-3">
                      <Link
                        href={`/go/${p?.slug}`}
                        target="_blank"
                        rel="sponsored nofollow noopener"
                      >
                        <Button size="sm" className="font-semibold text-xs gap-1">
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
                <tr key={c.name}>
                  <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                    {c.name}
                  </td>
                  <td className="p-4 text-center">
                    {c.isBool ? (
                      c.val1 ? (
                        <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="h-4 w-4 text-slate-400 mx-auto" />
                      )
                    ) : (
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {String(c.val1)}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {c.isBool ? (
                      c.val2 ? (
                        <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="h-4 w-4 text-slate-400 mx-auto" />
                      )
                    ) : (
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {String(c.val2)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
