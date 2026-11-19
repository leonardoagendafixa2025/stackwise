import React from "react";
import { Lock, ShieldAlert, CheckCircle } from "lucide-react";

interface BudgetGaugeProps {
  authorizedCap: number;
  currentConsumption: number;
}

export function BudgetGauge({ authorizedCap = 0, currentConsumption = 0 }: BudgetGaugeProps) {

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <Lock className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Controle de Custo Operacional
            </h4>
            <p className="text-[11px] text-slate-500">Regra de Segurança R$ 0,00 Ativa</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle className="h-3 w-3" />
          100% Gratuito
        </span>
      </div>

      <div className="mt-2 space-y-2">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-slate-600 dark:text-slate-400">Orçamento Autorizado:</span>
          <span className="font-bold text-slate-900 dark:text-white">R$ {authorizedCap.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs font-medium">
          <span className="text-slate-600 dark:text-slate-400">Consumo em Cobranças:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">R$ {currentConsumption.toFixed(2)}</span>
        </div>

        {/* Progress indicator */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full bg-blue-600 transition-all"
            style={{ width: authorizedCap === 0 ? "0%" : `${Math.min(100, (currentConsumption / authorizedCap) * 100)}%` }}
          />
        </div>
      </div>

      <div className="mt-3 rounded-lg bg-slate-50 p-2.5 text-[11px] text-slate-500 dark:bg-slate-800/40 dark:text-slate-400 flex items-start gap-2">
        <ShieldAlert className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
        <span>
          Travamento ativado: qualquer integração paga externa exige autorização expressa prévia do proprietário antes de ser habilitada.
        </span>
      </div>
    </div>
  );
}
