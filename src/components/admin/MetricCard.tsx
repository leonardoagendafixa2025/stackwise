import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  delta?: string;
  deltaType?: "positive" | "negative" | "neutral";
  icon?: LucideIcon;
  badge?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  delta,
  deltaType = "neutral",
  icon: Icon,
  badge,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60",
        className
      )}
    >
      <div className="flex items-center justify-between pb-2">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{title}</span>
        {Icon && (
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between pt-1">
        <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {value}
        </div>
        {badge && (
          <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {badge}
          </span>
        )}
      </div>

      {(subtitle || delta) && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          {delta && (
            <span
              className={cn(
                "font-medium",
                deltaType === "positive" && "text-emerald-600 dark:text-emerald-400",
                deltaType === "negative" && "text-rose-600 dark:text-rose-400",
                deltaType === "neutral" && "text-slate-500"
              )}
            >
              {delta}
            </span>
          )}
          {subtitle && <span className="text-slate-500 dark:text-slate-400">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
