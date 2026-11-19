import React from "react";
import Link from "next/link";
import { Info } from "lucide-react";
import { type Locale, getDictionary } from "@/lib/i18n/dictionaries";

interface AffiliateDisclosureBannerProps {
  locale: Locale;
}

export function AffiliateDisclosureBanner({ locale }: AffiliateDisclosureBannerProps) {
  const dict = getDictionary(locale);

  return (
    <div className="border-b border-blue-100 bg-blue-50/70 px-4 py-2.5 text-xs text-blue-900 dark:border-blue-900/30 dark:bg-blue-950/20 dark:text-blue-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
          <span>
            {locale === "pt-br"
              ? "Transparência: Alguns links nesta página são links de afiliados. Não cobramos nada a mais de você e mantemos rigorosa independência editorial."
              : "Disclosure: Some links on this site are affiliate links. We may earn a commission at no cost to you, with zero influence on our ratings."}
          </span>
        </div>
        <Link
          href={`/${locale}/affiliate-disclosure`}
          className="shrink-0 font-medium underline underline-offset-2 hover:text-blue-700 dark:hover:text-blue-300"
        >
          {dict.home.howWeEvaluate}
        </Link>
      </div>
    </div>
  );
}
