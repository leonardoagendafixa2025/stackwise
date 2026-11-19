import React from "react";
import Link from "next/link";
import { getDictionary, type Locale } from "@/lib/i18n/dictionaries";
import { ShieldCheck, Compass, SlidersHorizontal, Sparkles, Layers, BookOpen } from "lucide-react";

interface NavbarProps {
  locale: Locale;
}

export function Navbar({ locale }: NavbarProps) {
  const dict = getDictionary(locale);
  const otherLocale: Locale = locale === "pt-br" ? "en" : "pt-br";
  const otherLocaleLabel = locale === "pt-br" ? "EN" : "PT";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900">
            <Layers className="h-5 w-5 transition-transform group-hover:scale-105" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              STACK<span className="text-blue-600">WISE</span>
            </span>
            <span className="text-[10px] -mt-1 font-medium text-slate-500 uppercase tracking-wider">
              Software Intelligence
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link
            href={`/${locale}/categories`}
            className="flex items-center gap-1.5 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            <Compass className="h-4 w-4" />
            {dict.nav.categories}
          </Link>
          <Link
            href={`/${locale}/compare`}
            className="flex items-center gap-1.5 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {dict.nav.comparisons}
          </Link>
          <Link
            href={`/${locale}/blog`}
            className="flex items-center gap-1.5 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            <BookOpen className="h-4 w-4" />
            {dict.nav.editorial}
          </Link>
          <Link
            href={`/${locale}/custom-systems`}
            className="flex items-center gap-1.5 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            <Sparkles className="h-4 w-4 text-blue-600" />
            {dict.nav.customSystems}
          </Link>
        </nav>

        {/* Right CTA & Locale Switcher */}
        <div className="flex items-center gap-3">
          <Link
            href={`/${otherLocale}`}
            className="inline-flex h-8 items-center rounded-md border border-slate-200 px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            title={`Switch to ${otherLocaleLabel}`}
          >
            {otherLocaleLabel}
          </Link>

          <Link
            href="/admin"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 text-xs font-medium text-slate-800 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">{dict.nav.admin}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
