import React from "react";
import { type Locale } from "@/lib/i18n/dictionaries";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default function TermsPage({ params }: { params: { locale: Locale } }) {
  const isPt = params.locale === "pt-br";

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8 space-y-8">
      <div>
        <Badge variant="secondary" className="mb-3">
          <FileText className="h-3.5 w-3.5 mr-1 text-slate-700" />
          {isPt ? "Condições Legais" : "Legal Terms"}
        </Badge>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {isPt ? "Termos de Uso" : "Terms of Service"}
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          {isPt ? "Última atualização: Novembro de 2026" : "Last updated: November 2026"}
        </p>
      </div>

      <div className="border-t border-slate-200 pt-8 dark:border-slate-800 space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {isPt ? "1. Objeto da Plataforma" : "1. Purpose of the Platform"}
        </h2>
        <p>
          {isPt
            ? "A STACKWISE é uma plataforma informativa e comparativa de soluções tecnológicas. Nós não somos proprietários, fabricantes, distribuidores ou prestadores de suporte técnico dos softwares SaaS exibidos em nossos diretórios e comparativos."
            : "STACKWISE provides independent educational and comparative intelligence on SaaS solutions. We are neither owners, vendors, nor technical support operators of the third-party products featured on our platform."}
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {isPt ? "2. Condições Comerciais dos Fornecedores" : "2. Third-Party Vendor Pricing & Terms"}
        </h2>
        <p>
          {isPt
            ? "Preços, funcionalidades, planos gratuitos e termos de serviço de softwares afiliados são determinados exclusivamente por seus respectivos fabricantes e podem sofrer alterações a qualquer momento. Embora auditemos regularmente nossos dados, encorajamos que você sempre confirme as condições finais no site oficial do fornecedor antes da compra."
            : "Pricing, terms of use, feature sets, and free trial allowances are governed solely by respective software vendors and may change without notice. While STACKWISE audits data regularly, users are advised to verify latest terms on official vendor pages prior to purchase."}
        </p>
      </div>
    </div>
  );
}
