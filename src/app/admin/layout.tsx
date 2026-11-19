import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { User } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Sistemas Autônomos Ativos
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Proprietário (CLT Supervisor)
              </div>
              <div className="text-[10px] text-slate-500">Acesso: OWNER</div>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200 font-bold text-xs">
              <User className="h-4 w-4" />
            </div>
          </div>
        </header>

        {/* Admin Page Content */}
        <main className="p-6 sm:p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
