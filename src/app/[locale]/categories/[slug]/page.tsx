import React from "react";
import Link from "next/link";
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

interface CategorySlugProps {
  params: {
    locale: Locale;
    slug: string;
  };
}

export default function CategoryDetailPage({ params }: CategorySlugProps) {
  const { locale, slug } = params;

  // Sample verified category items
  const categoryTitles: Record<string, { pt: string; en: string; descPt: string; descEn: string }> = {
    "crm": {
      pt: "CRM & Vendas",
      en: "CRM & Sales",
      descPt: "Softwares de gestão comercial, automação de pipeline e relacionamento com clientes.",
      descEn: "Sales pipeline tracking, deal closing, and customer relationship solutions.",
    },
    "inteligencia-artificial": {
      pt: "Inteligência Artificial",
      en: "Artificial Intelligence",
      descPt: "Modelos cognitivos, assistentes de IA generativa e automação de texto/imagem.",
      descEn: "Cognitive AI engines, generative models, and enterprise assistant tools.",
    },
    "automacao": {
      pt: "Automação de Processos",
      en: "Workflow Automation",
      descPt: "Plataformas de integração webhooks, rotinas no-code e sincronização de dados.",
      descEn: "No-code integration connectors, webhooks, and multi-app orchestration.",
    },
  };

  const currentCategory = categoryTitles[slug] || {
    pt: slug.replace(/-/g, " ").toUpperCase(),
    en: slug.replace(/-/g, " ").toUpperCase(),
    descPt: "Ferramentas catalogadas e verificadas editorialmente.",
    descEn: "Audited and editorially verified software solutions.",
  };

  const sampleProducts = [
    {
      name: "HubSpot CRM",
      slug: "hubspot",
      rating: 4.8,
      verifiedPrice: "Grátis / A partir de $20/mês",
      hasFreePlan: true,
      freeTrialDays: 14,
      verifiedAt: "18/11/2026",
      summary:
        locale === "pt-br"
          ? "Líder global de mercado em CRM integrado com automação de marketing e vendas para PMEs e empresas em escala."
          : "Market-leading CRM tightly integrated with inbound marketing and sales automation for growing teams.",
      features: ["Pipeline Visual de Vendas", "Formulários e Landing Pages", "Rastreamento de E-mails", "Gestão de Contatos Ilimitada"],
      affiliateSlug: "hubspot",
    },
    {
      name: "Pipedrive",
      slug: "pipedrive",
      rating: 4.6,
      verifiedPrice: "A partir de $14/mês",
      hasFreePlan: false,
      freeTrialDays: 14,
      verifiedAt: "15/11/2026",
      summary:
        locale === "pt-br"
          ? "CRM desenhado por vendedores para vendedores, focado em alta velocidade de fechamento e visualização de funil."
          : "Sales-first CRM built by dealmakers, focusing on deal velocity and streamlined pipeline visualization.",
      features: ["Funis Personalizáveis", "Assistente de Vendas com IA", "Automação de Tarefas", "Relatórios de Desempenho"],
      affiliateSlug: "pipedrive",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href={`/${locale}`} className="hover:underline">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/${locale}/categories`} className="hover:underline">Categorias</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-semibold text-slate-900 dark:text-slate-100">
          {locale === "pt-br" ? currentCategory.pt : currentCategory.en}
        </span>
      </nav>

      {/* Header */}
      <div className="border-b border-slate-200 pb-6 dark:border-slate-800">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {locale === "pt-br" ? currentCategory.pt : currentCategory.en}
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          {locale === "pt-br" ? currentCategory.descPt : currentCategory.descEn}
        </p>
      </div>

      {/* Product List */}
      <div className="space-y-6">
        {sampleProducts.map((p) => (
          <Card key={p.slug} className="p-6 hover:border-slate-300 transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {p.name}
                  </h2>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span>{p.rating}</span>
                  </div>
                  <Badge variant="verified" className="text-[11px]">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Preços Verificados
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {p.summary}
                </p>

                {/* Features Badges */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {p.features.map((f) => (
                    <span
                      key={f}
                      className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="lg:w-64 shrink-0 rounded-xl bg-slate-50 p-4 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3 text-center">
                <div className="text-xs text-slate-500">Faixa de Preço</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {p.verifiedPrice}
                </div>
                <div className="text-[11px] text-slate-400">
                  {p.hasFreePlan ? "Plano Grátis Disponível" : `${p.freeTrialDays} dias de teste gratuito`}
                </div>

                <Link
                  href={`/go/${p.affiliateSlug}`}
                  target="_blank"
                  rel="sponsored nofollow noopener"
                  className="block"
                >
                  <Button size="sm" className="w-full gap-1.5 font-semibold text-xs">
                    <span>Acessar Fornecedor</span>
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </Link>

                <div className="text-[10px] text-slate-400">
                  Verificado em {p.verifiedAt}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
