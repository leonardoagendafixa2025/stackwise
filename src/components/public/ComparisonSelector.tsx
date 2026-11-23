"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { type Locale } from "@/lib/i18n/dictionaries";
import { ArrowRightLeft } from "lucide-react";

interface ProductOption {
  slug: string;
  name: string;
  categoryName: string;
}

interface ComparisonSelectorProps {
  locale: Locale;
  products: ProductOption[];
  currentP1: string;
  currentP2: string;
}

export function ComparisonSelector({
  locale,
  products,
  currentP1,
  currentP2,
}: ComparisonSelectorProps) {
  const router = useRouter();
  const isPt = locale === "pt-br";

  const handleP1Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    router.push(`/${locale}/compare?p1=${val}&p2=${currentP2}`);
  };

  const handleP2Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    router.push(`/${locale}/compare?p1=${currentP1}&p2=${val}`);
  };

  const handleSwap = () => {
    router.push(`/${locale}/compare?p1=${currentP2}&p2=${currentP1}`);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
        {isPt ? "Selecione as ferramentas para o duelo lado a lado:" : "Select tools for side-by-side comparison:"}
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Tool 1 */}
        <div className="w-full sm:flex-1">
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
            {isPt ? "Ferramenta 1" : "Tool 1"}
          </label>
          <select
            value={currentP1}
            onChange={handleP1Change}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            {products.map((p) => (
              <option key={`p1-${p.slug}`} value={p.slug}>
                {p.name} ({p.categoryName})
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="pt-4 sm:pt-4">
          <button
            type="button"
            onClick={handleSwap}
            title={isPt ? "Inverter posições" : "Swap tools"}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </button>
        </div>

        {/* Tool 2 */}
        <div className="w-full sm:flex-1">
          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
            {isPt ? "Ferramenta 2" : "Tool 2"}
          </label>
          <select
            value={currentP2}
            onChange={handleP2Change}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            {products.map((p) => (
              <option key={`p2-${p.slug}`} value={p.slug}>
                {p.name} ({p.categoryName})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
