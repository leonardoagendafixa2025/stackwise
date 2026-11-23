import React from "react";
import Link from "next/link";
import { getDictionary, type Locale } from "@/lib/i18n/dictionaries";
import { Layers, CheckCircle2, Shield, ShoppingBag, Sparkles, SlidersHorizontal, BookOpen } from "lucide-react";

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  const dict = getDictionary(locale);
  const isPt = locale === "pt-br";

  return (
    <footer className="border-t border-slate-200 bg-slate-50/90 dark:border-slate-800 dark:bg-slate-950 text-slate-600 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <Link href={`/${locale}`} className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-sm">
                <Layers className="h-5 w-5" />
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                STACK<span className="text-blue-600">WISE</span>
              </span>
            </Link>
            <p className="max-w-sm text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {dict.brand.tagline}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Dados 100% Auditados
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <Shield className="h-3.5 w-3.5 text-blue-600" />
                Independência Editorial
              </span>
            </div>
          </div>

          {/* Directory Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              {dict.nav.categories}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/${locale}/categories/inteligencia-artificial`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Inteligência Artificial
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/categories/crm`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  CRM & Vendas
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/categories/automacao`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Automação No-Code
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/categories/email-marketing`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  E-mail Marketing
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/categories/produtividade`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Produtividade & Gestão
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/categories`} className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
                  Ver todas as 10 áreas →
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Sections */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Plataforma
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/${locale}/compare`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-blue-600" />
                  <span>{dict.nav.comparisons}</span>
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/blog`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                  <span>{dict.nav.editorial}</span>
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/custom-systems`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                  <span>{dict.nav.customSystems}</span>
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/store`} className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                  <ShoppingBag className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{isPt ? "Loja Digital (USDT)" : "Digital Store"}</span>
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium">
                  {dict.nav.admin}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal and Institutional */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Institucional
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/${locale}/about`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {dict.footer.about}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/affiliate-disclosure`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {dict.footer.disclosure}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/privacy`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {dict.footer.privacy}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {dict.footer.terms}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Affiliate Disclosure Bottom Note */}
        <div className="mt-10 border-t border-slate-200/80 pt-6 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
          <p className="mb-2">{dict.home.transparencyText}</p>
          <p>© {new Date().getFullYear()} STACKWISE. {dict.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
