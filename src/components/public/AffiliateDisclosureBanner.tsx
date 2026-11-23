import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { type Locale, getDictionary } from "@/lib/i18n/dictionaries";

interface AffiliateDisclosureBannerProps {
  locale: Locale;
}

export function AffiliateDisclosureBanner({ locale }: AffiliateDisclosureBannerProps) {
  const dict = getDictionary(locale);

  return (
    <div className="border-b border-slate-200/80 bg-slate-900 text-slate-300 px-4 py-2 text-[11px] font-medium tracking-wide">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 truncate">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
          <span className="truncate">
            {locale === "pt-br"
              ? "Transparência Editorial: Avaliações técnicas 100% independentes. Alguns links podem gerar comissão de afiliados sem custo extra para você."
              : "Editorial Transparency: 100% independent technical evaluations. Partner links may earn commissions at zero extra cost to you."}
          </span>
        </div>
        <Link
          href={`/${locale}/affiliate-disclosure`}
          className="shrink-0 text-white font-semibold hover:text-emerald-300 underline underline-offset-4 transition-colors"
        >
          {dict.home.howWeEvaluate} →
        </Link>
      </div>
    </div>
  );
}
