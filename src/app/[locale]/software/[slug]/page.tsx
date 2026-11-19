import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { type Locale } from "@/lib/i18n/dictionaries";
import {
  CheckCircle2,
  Star,
  ExternalLink,
  ChevronRight,
  Clock,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getProductBySlug } from "@/services/catalog";
import { formatDate } from "@/lib/utils";

interface SoftwarePageProps {
  params: {
    locale: Locale;
    slug: string;
  };
}

export const revalidate = 60;

export default async function SoftwareDetailPage({ params }: SoftwarePageProps) {
  const { locale, slug } = params;
  const isPt = locale === "pt-br";

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const primarySource = product.sources?.[0];
  const lowestPrice = product.prices?.[0];
  const priceDisplay = lowestPrice
    ? lowestPrice.price === 0
      ? isPt ? "Grátis vitalício / A partir de $" + (product.prices?.[1]?.price || 0) + "/mês" : "Free Forever / From $" + (product.prices?.[1]?.price || 0) + "/mo"
      : `$${lowestPrice.price} / mês`
    : isPt ? "Preço Verificado Oficial" : "Verified Official Pricing";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href={`/${locale}`} className="hover:underline">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/${locale}/categories`} className="hover:underline">Categorias</Link>
        <ChevronRight className="h-3 w-3" />
        {product.category && (
          <>
            <Link href={`/${locale}/categories/${product.category.slug}`} className="hover:underline">
              {isPt ? product.category.name_pt : product.category.name_en}
            </Link>
            <ChevronRight className="h-3 w-3" />
          </>
        )}
        <span className="font-semibold text-slate-900 dark:text-slate-100">{product.name}</span>
      </nav>

      {/* Main Header Hero */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {product.category ? (isPt ? product.category.name_pt : product.category.name_en) : "SaaS"}
              </Badge>
              <Badge variant="verified" className="text-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mr-1" />
                {isPt ? "Preço Verificado" : "Audited Pricing"}
              </Badge>
              {product.free_plan_available && (
                <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {isPt ? "Possui Plano Grátis" : "Free Plan Available"}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {product.name}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {isPt ? product.short_description_pt : product.short_description_en}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-1 font-bold text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                <span>{product.rating_editorial} / 5.0</span>
                <span className="text-slate-400 font-normal">({isPt ? "Nota Editorial" : "Editorial Score"})</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>{isPt ? `Verificado em ${formatDate(product.last_verified_at)}` : `Verified on ${formatDate(product.last_verified_at, "en")}`}</span>
              </div>
            </div>
          </div>

          {/* Quick CTA Box */}
          <div className="lg:w-72 shrink-0 rounded-xl bg-slate-50 p-5 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isPt ? "Preço Verificado" : "Verified Pricing"}
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {priceDisplay}
            </div>

            <Link
              href={`/go/${product.slug}`}
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
                ? "Você será direcionado diretamente ao site oficial do fornecedor."
                : "You will be redirected safely to the official vendor portal."}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      {product.full_description_pt && (
        <Card className="p-6 space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {isPt ? "Visão Técnica Geral" : "Technical Overview"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {isPt ? product.full_description_pt : product.full_description_en}
          </p>
        </Card>
      )}

      {/* Plans & Pricing Cards */}
      {product.prices && product.prices.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isPt ? "Planos & Estrutura de Preços Auditada" : "Audited Pricing & Plans"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.prices.map((plan) => (
              <Card key={plan.id} className="p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {plan.plan_name}
                    </h3>
                    <span className="text-xs text-slate-500 capitalize">{plan.billing_cycle}</span>
                  </div>
                  <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                    {plan.price === 0 ? (isPt ? "Grátis" : "Free") : `$${plan.price} / mês`}
                  </div>
                  {Array.isArray(plan.features) && (
                    <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                      {plan.features.map((f: string) => (
                        <li key={f} className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="pt-4">
                  <Link
                    href={`/go/${product.slug}`}
                    target="_blank"
                    rel="sponsored nofollow noopener"
                  >
                    <Button size="sm" variant="outline" className="w-full text-xs font-semibold">
                      {isPt ? `Acessar Plano ${plan.plan_name}` : `Inspect ${plan.plan_name} Plan`}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Source Verification Box */}
      {primarySource && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/60 space-y-2 text-xs">
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{isPt ? "Fonte Auditada de Informações" : "Audited Information Source"}</span>
          </div>
          <div className="text-slate-600 dark:text-slate-400">
            {isPt ? "Fonte Oficial:" : "Official Source:"}{" "}
            <a
              href={primarySource.source_url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              {primarySource.source_name} ({primarySource.source_url})
            </a>
          </div>
          <div className="text-[11px] text-slate-400">
            {isPt
              ? `Verificado por ${primarySource.verified_by} em ${formatDate(primarySource.verified_at)}.`
              : `Audited by ${primarySource.verified_by} on ${formatDate(primarySource.verified_at, "en")}.`}
          </div>
        </div>
      )}
    </div>
  );
}
