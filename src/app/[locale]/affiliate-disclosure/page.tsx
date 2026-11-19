import React from "react";
import { type Locale } from "@/lib/i18n/dictionaries";
import { Info, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default function AffiliateDisclosurePage({ params }: { params: { locale: Locale } }) {
  const isPt = params.locale === "pt-br";

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8 space-y-8">
      <div>
        <Badge variant="verified" className="mb-3">
          <Info className="h-3.5 w-3.5 mr-1" />
          {isPt ? "Transparência Legal" : "Legal Disclosure"}
        </Badge>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {isPt ? "Divulgação de Afiliados & Transparência" : "Affiliate Disclosure & Transparency"}
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          {isPt ? "Última atualização: Novembro de 2026" : "Last updated: November 2026"}
        </p>
      </div>

      <div className="border-t border-slate-200 pt-8 dark:border-slate-800 space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <p>
          {isPt
            ? "Em cumprimento às melhores práticas internacionais de defesa do consumidor e diretrizes de conformidade do Google e da Federal Trade Commission (FTC), a STACKWISE declara com total transparência como nosso modelo de negócios opera."
            : "In full compliance with international consumer protection standards and disclosure guidelines from Google and the FTC, STACKWISE transparently explains how our business model functions."}
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {isPt ? "Como a STACKWISE se Mantém Gratuita" : "How STACKWISE Remains 100% Free"}
        </h2>
        <p>
          {isPt
            ? "A STACKWISE participa de diversos programas de afiliados de softwares corporativos e SaaS. Isso significa que, quando você clica em determinados botões ou links que direcionam para o site oficial do fornecedor de um software e conclui uma contratação, podemos receber uma comissão de indicação."
            : "STACKWISE participates in reputable software affiliate programs. When you click on certain buttons or links directing to an official SaaS provider's website and complete a purchase, we may receive an affiliate referral commission."}
        </p>

        <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-5 dark:border-blue-900 dark:bg-blue-950/20 space-y-2">
          <div className="font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
            {isPt ? "Impacto Zero no seu Preço Final" : "Zero Extra Cost to You"}
          </div>
          <p className="text-xs text-blue-800 dark:text-blue-300">
            {isPt
              ? "Você nunca paga um centavo a mais por utilizar nossos links de afiliados. Em muitos casos, inclusive, links de parceiros oferecem testes estendidos ou descontos negociados com os fabricantes."
              : "You never pay a penny more for utilizing our partner links. In fact, many partner links provide extended free trials or negotiated perks directly from SaaS vendors."}
          </p>
        </div>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {isPt ? "Nossos Compromissos Éticos" : "Our Ethical Commitments"}
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
          <li>
            <strong>{isPt ? "Independência Editorial:" : "Editorial Independence:"}</strong>{" "}
            {isPt
              ? "Nenhum fornecedor pode pagar para receber uma nota técnica mais alta ou esconder limitações de sua ferramenta."
              : "No software vendor can pay to increase its technical rating or suppress recorded product limitations."}
          </li>
          <li>
            <strong>{isPt ? "Links Claramente Identificados:" : "Clear Link Marking:"}</strong>{" "}
            {isPt
              ? "Todos os links comerciais utilizam atributos 'rel=\"sponsored nofollow\"' em conformidade com as diretrizes de mecanismos de busca."
              : "All commercial partner links utilize standard 'rel=\"sponsored nofollow\"' attributes in compliance with search engine guidelines."}
          </li>
          <li>
            <strong>{isPt ? "Não Vendemos Direto:" : "We Never Sell Directly:"}</strong>{" "}
            {isPt
              ? "A STACKWISE não processa pagamentos, não armazena dados de cartão de crédito e não é responsável pela entrega técnica dos softwares contratados."
              : "STACKWISE does not process payments, does not store credit card credentials, and is not responsible for vendor software delivery."}
          </li>
        </ul>
      </div>
    </div>
  );
}
