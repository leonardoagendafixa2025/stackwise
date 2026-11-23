import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "verified" | "warning" | "destructive" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-slate-900 text-white shadow-2xs dark:bg-slate-100 dark:text-slate-900",
    secondary: "bg-slate-100 text-slate-800 border border-slate-200/80 dark:bg-slate-800/80 dark:text-slate-200 dark:border-slate-700",
    verified: "bg-emerald-50 text-emerald-800 border border-emerald-200/90 shadow-2xs dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
    warning: "bg-amber-50 text-amber-800 border border-amber-200/90 shadow-2xs dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
    destructive: "bg-rose-50 text-rose-800 border border-rose-200/90 shadow-2xs dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800",
    outline: "text-slate-700 border border-slate-300/80 bg-white/70 dark:text-slate-300 dark:border-slate-700 dark:bg-slate-900",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-tight transition-all",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
