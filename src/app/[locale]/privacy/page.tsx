import React from "react";
import { type Locale } from "@/lib/i18n/dictionaries";
import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default function PrivacyPage({ params }: { params: { locale: Locale } }) {
  const isPt = params.locale === "pt-br";

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8 space-y-8">
      <div>
        <Badge variant="secondary" className="mb-3">
          <Shield className="h-3.5 w-3.5 mr-1 text-blue-600" />
          {isPt ? "Conformidade LGPD & GDPR" : "Privacy & Data Protection"}
        </Badge>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {isPt ? "Política de Privacidade" : "Privacy Policy"}
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          {isPt ? "Última atualização: Novembro de 2026" : "Last updated: November 2026"}
        </p>
      </div>

      <div className="border-t border-slate-200 pt-8 dark:border-slate-800 space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <p>
          {isPt
            ? "A STACKWISE valoriza a privacidade de seus visitantes e segue rigorosamente os preceitos da Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018) e do Regulamento Geral de Proteção de Dados da União Europeia (GDPR)."
            : "STACKWISE respects your privacy and complies with modern international data protection standards, including the LGPD and EU GDPR regulations."}
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {isPt ? "1. Minimização de Dados e Coleta" : "1. Data Minimization & Collection"}
        </h2>
        <p>
          {isPt
            ? "Não exigimos cadastro de usuários finais para navegar pelo catálogo de softwares, ler comparações ou utilizar ferramentas de busca. Nosso sistema de rastreamento de cliques em links de afiliados (/go/*) armazena dados puramente agregados (país de origem, tipo genérico de dispositivo e data/hora), sem armazenar endereços IP completos ou identificadores biométricos."
            : "We do not require end-user accounts to search our software index or read benchmarks. Our internal affiliate redirection pipeline (/go/*) records only aggregated telemetry (origin country, device category, timestamp) without persisting complete IP addresses or personal device fingerprints."}
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {isPt ? "2. Formulário de Sistemas Sob Medida" : "2. Custom Systems Lead Inquiries"}
        </h2>
        <p>
          {isPt
            ? "Ao enviar uma solicitação através do formulário de sistemas sob medida, coletamos apenas seu nome, e-mail corporativo, empresa e requisitos do projeto, exclusivamente para elaboração do briefing técnico e contato comercial. Esses dados nunca são vendidos ou compartilhados com terceiros."
            : "When submitting a request via our custom systems briefing module, we store your name, email, organization, and project scope strictly for architectural feasibility review. Your contact details are never monetized or distributed."}
        </p>
      </div>
    </div>
  );
}
