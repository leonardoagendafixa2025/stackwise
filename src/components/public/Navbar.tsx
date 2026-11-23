"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getDictionary, type Locale } from "@/lib/i18n/dictionaries";
import {
  ShieldCheck,
  Compass,
  SlidersHorizontal,
  Sparkles,
  Layers,
  BookOpen,
  ShoppingBag,
  Menu,
  X,
  Search,
  ChevronDown,
  Brain,
  Users,
  Cpu,
  Mail,
  CheckSquare,
  ArrowRight,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  locale: Locale;
}

const TOP_CATEGORIES = [
  { slug: "inteligencia-artificial", name_pt: "Inteligência Artificial", name_en: "Artificial Intelligence", icon: Brain, desc_pt: "LLMs, geradores e copilotos", desc_en: "LLMs, generators & copilots" },
  { slug: "crm", name_pt: "CRM & Vendas", name_en: "CRM & Sales", icon: Users, desc_pt: "Pipelines e gestão de clientes", desc_en: "Pipelines and customer management" },
  { slug: "automacao", name_pt: "Automação No-Code", name_en: "No-Code Automation", icon: Cpu, desc_pt: "Integrações, fluxos e robôs", desc_en: "Integrations, workflows & bots" },
  { slug: "email-marketing", name_pt: "E-mail Marketing", name_en: "Email Marketing", icon: Mail, desc_pt: "Campanhas, automações e newsletters", desc_en: "Campaigns, automations & newsletters" },
  { slug: "produtividade", name_pt: "Produtividade & Gestão", name_en: "Productivity & Management", icon: CheckSquare, desc_pt: "Quadros, tarefas e documentação", desc_en: "Boards, tasks and docs" },
  { slug: "criacao-de-sites", name_pt: "Criação de Sites", name_en: "Website Builders", icon: Globe, desc_pt: "Landing pages e plataformas web", desc_en: "Landing pages & web platforms" },
];

export function Navbar({ locale }: NavbarProps) {
  const dict = getDictionary(locale);
  const pathname = usePathname();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const otherLocale: Locale = locale === "pt-br" ? "en" : "pt-br";
  const otherLocaleLabel = locale === "pt-br" ? "EN" : "PT";
  const isPt = locale === "pt-br";

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
  }, [pathname]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoriesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${locale}/categories?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    {
      href: `/${locale}/compare`,
      label: dict.nav.comparisons,
      icon: SlidersHorizontal,
      active: pathname.startsWith(`/${locale}/compare`),
    },
    {
      href: `/${locale}/blog`,
      label: isPt ? "Artigos & Guias" : "Guides & Audits",
      icon: BookOpen,
      active: pathname.startsWith(`/${locale}/blog`),
    },
    {
      href: `/${locale}/custom-systems`,
      label: isPt ? "Sistemas IA" : "Custom AI",
      icon: Sparkles,
      highlight: true,
      active: pathname.startsWith(`/${locale}/custom-systems`),
    },
    {
      href: `/${locale}/store`,
      label: isPt ? "Loja Digital" : "Digital Store",
      icon: ShoppingBag,
      store: true,
      active: pathname.startsWith(`/${locale}/store`),
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-header shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2.5 group shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-500 text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <Layers className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              STACK<span className="text-blue-600">WISE</span>
            </span>
            <span className="text-[9px] -mt-1 font-bold text-slate-500 uppercase tracking-widest">
              Software Intelligence
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-semibold">
          {/* Categories Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              onMouseEnter={() => setCategoriesOpen(true)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all whitespace-nowrap",
                pathname.startsWith(`/${locale}/categories`) || categoriesOpen
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 shadow-xs"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
              )}
            >
              <Compass className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>{dict.nav.categories}</span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 text-slate-400 transition-transform duration-200",
                  categoriesOpen && "rotate-180 text-blue-600"
                )}
              />
            </button>

            {/* Dropdown Menu */}
            {categoriesOpen && (
              <div
                onMouseLeave={() => setCategoriesOpen(false)}
                className="absolute left-0 top-full mt-2 w-84 rounded-2xl border border-slate-200/90 bg-white/98 p-3.5 shadow-2xl backdrop-blur-xl ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-900/98 animate-in fade-in-50 slide-in-from-top-2 duration-150 z-50"
              >
                <div className="px-2.5 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {isPt ? "Categorias Auditadas" : "Audited Categories"}
                </div>
                <div className="space-y-1 mt-1">
                  {TOP_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <Link
                        key={cat.slug}
                        href={`/${locale}/categories/${cat.slug}`}
                        onClick={() => setCategoriesOpen(false)}
                        className="flex items-center gap-3 rounded-xl p-2.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-blue-400 group-hover:scale-105 transition-transform shrink-0">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                            {isPt ? cat.name_pt : cat.name_en}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {isPt ? cat.desc_pt : cat.desc_en}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <div className="mt-2.5 border-t border-slate-100 pt-2 dark:border-slate-800">
                  <Link
                    href={`/${locale}/categories`}
                    onClick={() => setCategoriesOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/50 transition-colors"
                  >
                    <span>{isPt ? "Ver todas as 10 categorias" : "View all 10 categories"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Standard Navigation Links */}
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all whitespace-nowrap",
                  link.active
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 shadow-xs"
                    : link.store
                    ? "text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50/70 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    link.active
                      ? "text-blue-600 dark:text-blue-400"
                      : link.store
                      ? "text-emerald-600 dark:text-emerald-400"
                      : link.highlight
                      ? "text-blue-600"
                      : "text-slate-400"
                  )}
                />
                <span>{link.label}</span>
                {link.store && (
                  <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[10px] font-extrabold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                    USDT
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Actions: Search Input, Language Switcher, Admin Button, Mobile Toggle */}
        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex relative items-center"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isPt ? "Buscar software..." : "Search software..."}
              className="h-8.5 w-40 xl:w-48 rounded-xl border border-slate-200 bg-slate-50/80 pl-8 pr-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 transition-all shadow-inner"
            />
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-400" />
          </form>

          {/* Locale Switcher */}
          <Link
            href={`/${otherLocale}`}
            className="inline-flex h-8.5 px-2.5 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-extrabold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors shadow-2xs"
            title={`Alternar para ${otherLocaleLabel}`}
          >
            {otherLocaleLabel}
          </Link>

          {/* Admin Operations Hub */}
          <Link
            href="/admin"
            className="hidden sm:inline-flex h-8.5 items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 text-xs font-bold text-white shadow-xs hover:bg-slate-800 dark:border-slate-700 dark:bg-white dark:text-slate-900 transition-colors whitespace-nowrap"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-blue-400 dark:text-blue-600" />
            <span>{dict.nav.admin}</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir Menu de Navegação"
            className="inline-flex md:hidden h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/98 backdrop-blur-xl px-4 py-5 dark:border-slate-800 dark:bg-slate-950/98 animate-in slide-in-from-top-3 duration-200 space-y-4 shadow-xl">
          {/* Mobile Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isPt ? "Buscar qualquer software ou categoria..." : "Search software or category..."}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          </form>

          {/* Primary Nav Links */}
          <nav className="flex flex-col space-y-1">
            <Link
              href={`/${locale}/categories`}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-bold transition-colors",
                pathname.startsWith(`/${locale}/categories`)
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                  : "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
              )}
            >
              <div className="flex items-center gap-3">
                <Compass className="h-4 w-4 text-blue-600" />
                <span>{dict.nav.categories}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </Link>

            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-bold transition-colors",
                    link.active
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                      : link.store
                      ? "text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                      : "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("h-4 w-4", link.store ? "text-emerald-600" : "text-blue-600")} />
                    <span>{link.label}</span>
                  </div>
                  {link.store && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                      USDT / Pay
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Categories Bar for Mobile */}
          <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-900/60 space-y-2 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
              {isPt ? "Categorias Populares" : "Popular Categories"}
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {TOP_CATEGORIES.slice(0, 4).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${locale}/categories/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl border border-slate-200/80 bg-white p-2.5 font-bold text-slate-800 hover:border-blue-400 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 transition-colors text-center"
                >
                  {isPt ? cat.name_pt : cat.name_en}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Admin Link */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-md hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              <ShieldCheck className="h-4 w-4 text-blue-400 dark:text-blue-600" />
              <span>Acessar {dict.nav.admin}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
