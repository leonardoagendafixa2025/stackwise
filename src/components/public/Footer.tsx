import React from "react";
import Link from "next/link";
import { getDictionary, type Locale } from "@/lib/i18n/dictionaries";
import { Layers, CheckCircle2, Shield } from "lucide-react";

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  const dict = getDictionary(locale);

  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 text-slate-600 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                <Layers className="h-4 w-4" />
              </div>
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                STACK<span className="text-blue-600">WISE</span>
              </span>
            </div>
            <p className="max-w-md text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {dict.brand.tagline}
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Dados Verificados
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300">
                <Shield className="h-3.5 w-3.5 text-blue-600" />
                Independência Editorial
              </span>
            </div>
          </div>

          {/* Directory Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              {dict.nav.categories}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/categories/inteligencia-artificial`} className="hover:text-blue-600 transition-colors">
                  Inteligência Artificial
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/categories/crm`} className="hover:text-blue-600 transition-colors">
                  CRM & Vendas
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/categories/automacao`} className="hover:text-blue-600 transition-colors">
                  Automação No-Code
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/categories/email-marketing`} className="hover:text-blue-600 transition-colors">
                  E-mail Marketing
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal and Institutional */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Institucional
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/about`} className="hover:text-blue-600 transition-colors">
                  {dict.footer.about}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/affiliate-disclosure`} className="hover:text-blue-600 transition-colors">
                  {dict.footer.disclosure}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/privacy`} className="hover:text-blue-600 transition-colors">
                  {dict.footer.privacy}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className="hover:text-blue-600 transition-colors">
                  {dict.footer.terms}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Affiliate Disclosure Bottom Note */}
        <div className="mt-8 border-t border-slate-200/80 pt-6 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
          <p className="mb-2">{dict.home.transparencyText}</p>
          <p>© {new Date().getFullYear()} STACKWISE. {dict.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
