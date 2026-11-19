import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { type Locale } from "@/lib/i18n/dictionaries";
import {
  CheckCircle2,
  Star,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getCategoryBySlug, getProducts } from "@/services/catalog";

interface CategorySlugProps {
  params: {
    locale: Locale;
    slug: string;
  };
}

export const revalidate = 60;

export default async function CategoryDetailPage({ params }: CategorySlugProps) {
  const { locale, slug } = params;
  const isPt = locale === "pt-br";

  const [category, products] = await Promise.all([
    getCategoryBySlug(slug),
    getProducts({ categorySlug: slug }),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href={`/${locale}`} className="hover:underline">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/${locale}/categories`} className="hover:underline">Categorias</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-semibold text-slate-900 dark:text-slate-100">
          {isPt ? category.name_pt : category.name_en}
        </span>
      </nav>

      {/* Header */}
      <div className="border-b border-slate-200 pb-6 dark:border-slate-800">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {isPt ? category.name_pt : category.name_en}
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-3xl">
          {isPt ? category.description_pt : category.description_en}
        </p>
      </div>

      {/* Product List */}
      <div className="space-y-6">
        {products.length === 0 ? (
          <Card className="p-8 text-center text-slate-500 text-sm">
            Nenhum software publicado nesta categoria no momento. Nossos agentes de pesquisa estão auditando novas opções.
          </Card>
        ) : (
          products.map((p) => {
            const lowestPrice = p.prices?.[0];
            const priceText = lowestPrice
              ? lowestPrice.price === 0
                ? isPt ? "Grátis / A partir de $" + (p.prices?.[1]?.price || 0) : "Free Forever / From $" + (p.prices?.[1]?.price || 0)
                : `$${lowestPrice.price} / mês`
              : isPt ? "Preço Verificado" : "Audited Price";

            return (
              <Card key={p.slug} className="p-6 hover:border-slate-300 transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-3 max-w-3xl">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {p.name}
                      </h2>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span>{p.rating_editorial}</span>
                      </div>
                      <Badge variant="verified" className="text-[11px]">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Preços Verificados
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {isPt ? p.short_description_pt : p.short_description_en}
                    </p>

                    {/* Features Badges */}
                    {p.features && p.features.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {p.features.map((f) => (
                          <span
                            key={f.id}
                            className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          >
                            {isPt ? f.name_pt : f.name_en}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Pricing & CTA */}
                  <div className="lg:w-64 shrink-0 rounded-xl bg-slate-50 p-4 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3 text-center">
                    <div className="text-xs text-slate-500">Faixa de Preço</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {priceText}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {p.free_plan_available
                        ? isPt ? "Plano Grátis Disponível" : "Free Plan Available"
                        : `${p.free_trial_days || 14} dias de teste gratuito`}
                    </div>

                    <Link
                      href={`/go/${p.slug}`}
                      target="_blank"
                      rel="sponsored nofollow noopener"
                      className="block"
                    >
                      <Button size="sm" className="w-full gap-1.5 font-semibold text-xs">
                        <span>Acessar Fornecedor</span>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>

                    <Link
                      href={`/${locale}/software/${p.slug}`}
                      className="text-[11px] font-medium text-blue-600 hover:underline block pt-1"
                    >
                      Ver Análise Completa
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
