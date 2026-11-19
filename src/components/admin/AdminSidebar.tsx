"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Layers,
  LayoutDashboard,
  Box,
  Link2,
  FileText,
  Bot,
  DollarSign,
  Search,
  Inbox,
  Settings,
  ExternalLink,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Central de Operações", icon: LayoutDashboard },
    { href: "/admin/software", label: "Softwares & Planos", icon: Box },
    { href: "/admin/affiliates", label: "Programas de Afiliados", icon: Link2 },
    { href: "/admin/editorial", label: "Editorial & Artigos", icon: FileText },
    { href: "/admin/agents", label: "Central dos 7 Agentes", icon: Bot },
    { href: "/admin/financial", label: "Financeiro & CSVs", icon: DollarSign },
    { href: "/admin/seo", label: "SEO & Oportunidades", icon: Search },
    { href: "/admin/leads", label: "Leads de Sistemas", icon: Inbox },
    { href: "/admin/settings", label: "Orçamento (R$ 0) & Ajustes", icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between h-screen sticky top-0">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-slate-200 dark:border-slate-800">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">STACKWISE</div>
              <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">
                Admin Hub
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 font-semibold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-blue-600" : "text-slate-500")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Portal Link */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <Link
          href="/pt-br"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <span>Ver Portal Público</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
        <div className="mt-2 px-3 text-[11px] text-slate-400">
          Modo Autônomo Supervisionado
        </div>
      </div>
    </aside>
  );
}
