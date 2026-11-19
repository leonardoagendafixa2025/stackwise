import React from "react";
import { type Locale } from "@/lib/i18n/dictionaries";
import { ShieldCheck, CheckCircle2, Award } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default function AboutPage({ params }: { params: { locale: Locale } }) {
  const isPt = params.locale === "pt-br";

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8 space-y-10">
      <div>
        <Badge variant="verified" className="mb-3">
          <ShieldCheck className="h-3.5 w-3.5 mr-1" />
          {isPt ? "Independência Editorial" : "Editorial Independence"}
        </Badge>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {isPt ? "Sobre a STACKWISE" : "About STACKWISE"}
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
          {isPt
            ? "A STACKWISE é uma plataforma internacional de descoberta, comparação e inteligência de softwares corporativos e ferramentas SaaS. Nosso propósito é ajudar empreendedores, líderes de tecnologia e equipes operacionais a escolher as ferramentas exatas para alavancar seus negócios com base em dados técnicos verificados."
            : "STACKWISE is an independent global discovery and comparison platform for enterprise SaaS and digital toolkits. Our mission is to guide founders, tech leaders and operators toward the right software decisions through verified technical data."}
        </p>
      </div>

      <div className="border-t border-slate-200 pt-8 dark:border-slate-800 space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {isPt ? "Nossa Metodologia de Avaliação" : "Our Evaluation Methodology"}
        </h2>
        <p>
          {isPt
            ? "Diferente de portais tradicionais que dependem de resenhas anônimas ou promoções patrocinadas, a STACKWISE baseia suas comparações em dados estruturados: planos públicos, recursos confirmados na documentação oficial dos fornecedores, testes reais de facilidade de uso e métricas de suporte."
            : "Unlike conventional review sites bloated with fabricated feedback or opaque sponsored placements, STACKWISE benchmarks software on verified structural facts: official pricing, documented API limits, interface ergonomics, and support SLA."}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              {isPt ? "Preços & Planos Auditados" : "Audited Pricing & Plans"}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isPt
                ? "Nenhum preço é estimado ou inventado. Se o fabricante alterar valores, nosso sistema de auditoria alerta para atualização imediata."
                : "No pricing assumptions. Whenever a SaaS provider changes tiers, our automated monitoring routines trigger review."}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-600" />
              {isPt ? "Neutralidade Comercial" : "Commercial Neutrality"}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isPt
                ? "Programas de afiliados não determinam posição no ranking nem notas editoriais. Nossos critérios técnicos são 100% independentes."
                : "Affiliate partnerships do not alter rankings or technical scores. Editorial integrity is strictly decoupled from commercial links."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
