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

interface ComparePageProps {
  params: {
    locale: Locale;
  };
}

export default function ComparePage({ params }: ComparePageProps) {
  const { locale } = params;

  const comparisonData = {
    title: "HubSpot CRM vs ActiveCampaign",
    subtitle:
      locale === "pt-br"
        ? "Comparação técnica estruturada entre CRM inbound multicanal e automação comportamental de e-mail."
        : "Structured technical comparison between all-in-one inbound CRM and behavioral email marketing automation.",
    products: [
      {
        name: "HubSpot CRM",
        slug: "hubspot",
        rating: 4.8,
        priceStarting: "Grátis / $20/mês",
        freePlan: true,
        billingCycle: "Mensal / Anual",
        easeOfUse: "Excelente (Interface Intuitiva)",
        languages: "Português, Inglês, Espanhol, +5",
        integrations: "Mais de 1.500 apps oficiais",
        targetAudience: "Startups, PMEs e Times Comerciais",
        keyLimitation: "Planos avançados (Enterprise) possuem custo elevado",
        support: "Base de conhecimento, Chat e E-mail",
        affiliateSlug: "hubspot",
      },
      {
        name: "ActiveCampaign",
        slug: "activecampaign",
        rating: 4.7,
        priceStarting: "$19/mês (sem plano grátis)",
        freePlan: false,
        billingCycle: "Mensal / Anual",
        easeOfUse: "Média (Curva de Aprendizado Inicial)",
        languages: "Português, Inglês, Espanhol, +4",
        integrations: "Mais de 900 conectores nativos",
        targetAudience: "Infoprodutores, E-commerces e Automação Avançada",
        keyLimitation: "Sem plano gratuito vitalício (apenas teste de 14 dias)",
        support: "Chat ao vivo, Tickets e Fórum",
        affiliateSlug: "activecampaign",
      },
    ],
    features: [
      { name: "Gestão Visual de Pipeline / Deals", p1: true, p2: true },
      { name: "Plano Gratuito Vitalício", p1: true, p2: false },
      { name: "Automação Visual de Fluxos de Trabalho", p1: true, p2: true },
      { name: "Segmentação Preditiva com IA", p1: true, p2: true },
      { name: "Landing Pages Nativas", p1: true, p2: true },
      { name: "Chatbot no Site", p1: true, p2: false },
      { name: "Rastreamento de Visitas de Página no CRM", p1: true, p2: true },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      <div>
        <Badge variant="verified" className="mb-3">
          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
          Dados Estruturados & Verificados
        </Badge>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {comparisonData.title}
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-3xl">
          {comparisonData.subtitle}
        </p>
      </div>

      {/* Comparison Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            {/* Headers */}
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                <th className="p-4 font-semibold text-slate-500 w-1/3">Critério Técnico</th>
                {comparisonData.products.map((p) => (
                  <th key={p.slug} className="p-4 text-center w-1/3">
                    <div className="text-base font-bold text-slate-900 dark:text-white">
                      {p.name}
                    </div>
                    <div className="flex items-center justify-center gap-1 text-xs text-amber-500 font-bold mt-1">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>{p.rating} / 5.0</span>
                    </div>
                    <div className="mt-3">
                      <Link
                        href={`/go/${p.affiliateSlug}`}
                        target="_blank"
                        rel="sponsored nofollow noopener"
                      >
                        <Button size="sm" className="font-semibold text-xs gap-1">
                          <span>Acessar {p.name}</span>
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">Preço Inicial</td>
                <td className="p-4 text-center font-bold text-emerald-600 dark:text-emerald-400">
                  {comparisonData.products[0].priceStarting}
                </td>
                <td className="p-4 text-center font-bold text-slate-900 dark:text-slate-100">
                  {comparisonData.products[1].priceStarting}
                </td>
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">Plano Grátis Vitalício</td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                    <Check className="h-4 w-4" /> Sim
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center gap-1 text-slate-400">
                    <X className="h-4 w-4" /> Não (14 dias teste)
                  </span>
                </td>
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">Facilidade de Uso</td>
                <td className="p-4 text-center text-slate-600 dark:text-slate-300">
                  {comparisonData.products[0].easeOfUse}
                </td>
                <td className="p-4 text-center text-slate-600 dark:text-slate-300">
                  {comparisonData.products[1].easeOfUse}
                </td>
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">Idiomas Suportados</td>
                <td className="p-4 text-center text-slate-600 dark:text-slate-300">
                  {comparisonData.products[0].languages}
                </td>
                <td className="p-4 text-center text-slate-600 dark:text-slate-300">
                  {comparisonData.products[1].languages}
                </td>
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">Público Recomendado</td>
                <td className="p-4 text-center text-slate-600 dark:text-slate-300">
                  {comparisonData.products[0].targetAudience}
                </td>
                <td className="p-4 text-center text-slate-600 dark:text-slate-300">
                  {comparisonData.products[1].targetAudience}
                </td>
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">Principal Limitação</td>
                <td className="p-4 text-center text-amber-700 dark:text-amber-400 bg-amber-50/30 dark:bg-amber-950/20">
                  {comparisonData.products[0].keyLimitation}
                </td>
                <td className="p-4 text-center text-amber-700 dark:text-amber-400 bg-amber-50/30 dark:bg-amber-950/20">
                  {comparisonData.products[1].keyLimitation}
                </td>
              </tr>

              {/* Feature Matrix Checkmarks */}
              {comparisonData.features.map((f) => (
                <tr key={f.name}>
                  <td className="p-4 font-medium text-slate-600 dark:text-slate-300">{f.name}</td>
                  <td className="p-4 text-center">
                    {f.p1 ? (
                      <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {f.p2 ? (
                      <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-slate-300 mx-auto" />
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
