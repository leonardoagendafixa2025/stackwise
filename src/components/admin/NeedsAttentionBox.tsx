import React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/lib/../components/ui/Button";

export interface AttentionItem {
  id: string;
  title: string;
  description: string;
  severity: "urgent" | "warning" | "review";
  actionLabel: string;
  actionUrl: string;
  timeAgo: string;
}

interface NeedsAttentionBoxProps {
  items: AttentionItem[];
}

export function NeedsAttentionBox({ items }: NeedsAttentionBoxProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-6 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <h3 className="text-sm font-semibold">Tudo operando normalmente</h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
              Nenhuma ação humana é necessária neste momento. Os agentes autônomos e rotinas agendadas estão em conformidade.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-amber-300/80 bg-amber-50/50 p-6 dark:border-amber-700/60 dark:bg-amber-950/20">
      <div className="flex items-center justify-between pb-4 border-b border-amber-200 dark:border-amber-800/60">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-white shadow-xs">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-950 dark:text-amber-200">
              VOCÊ PRECISA DA SUA ATENÇÃO ({items.length})
            </h3>
            <p className="text-xs text-amber-800 dark:text-amber-400">
              Itens que dependem exclusivamente de decisão ou autorização do proprietário.
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-amber-200/60 dark:divide-amber-800/40">
        {items.map((item) => (
          <div key={item.id} className="py-4 first:pt-4 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {item.title}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <Clock className="h-3 w-3" />
                  {item.timeAgo}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {item.description}
              </p>
            </div>

            <Link href={item.actionUrl}>
              <Button size="sm" variant="outline" className="border-amber-400 bg-white hover:bg-amber-100/60 text-amber-950 font-semibold gap-1 shrink-0">
                <span>{item.actionLabel}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
