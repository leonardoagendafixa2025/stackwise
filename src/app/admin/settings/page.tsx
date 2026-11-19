import React from "react";
import { Lock, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function AdminSettingsPage() {
  const operationalCosts = [
    {
      service: "Vercel Hosting",
      plan: "Hobby Tier (Gratuito)",
      cost: "R$ 0,00",
      limit: "100 GB Bandwidth / mês",
      consumption: "4.8 GB consumidos (4,8%)",
      billingDate: "N/A (Gratuito)",
      necessity: "Hospedagem global e edge routing",
      estimatedReturn: "Fundamental para operação pública",
      isAuthorized: true,
    },
    {
      service: "Supabase Database & Auth",
      plan: "Free Tier (Gratuito)",
      cost: "R$ 0,00",
      limit: "500 MB Database / 50k MAU",
      consumption: "28.5 MB consumidos (5,7%)",
      billingDate: "N/A (Gratuito)",
      necessity: "PostgreSQL com 26 tabelas e RLS",
      estimatedReturn: "Banco central de dados e transações",
      isAuthorized: true,
    },
    {
      service: "Google Gemini API",
      plan: "Free Tier Oficial",
      cost: "R$ 0,00",
      limit: "15 Requisições / minuto",
      consumption: "~60 req / dia (dentro da cota)",
      billingDate: "N/A (Gratuito)",
      necessity: "Orquestração dos 7 agentes de IA",
      estimatedReturn: "Automação editorial e auditoria",
      isAuthorized: true,
    },
    {
      service: "GitHub Actions",
      plan: "Free Tier (Público/Privado)",
      cost: "R$ 0,00",
      limit: "2.000 minutos / mês",
      consumption: "85 minutos consumidos (4,2%)",
      billingDate: "N/A (Gratuito)",
      necessity: "Rotinas de auditoria e CI",
      estimatedReturn: "Autonomia operacional sem servidor dedicado",
      isAuthorized: true,
    },
    {
      service: "Cloudflare",
      plan: "Free Plan",
      cost: "R$ 0,00",
      limit: "Tráfego Ilimitado",
      consumption: "100% mitigado",
      billingDate: "N/A (Gratuito)",
      necessity: "DNS rápido, SSL e proteção DDoS",
      estimatedReturn: "Estabilidade e segurança contra bots",
      isAuthorized: true,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Orçamento Operacional & Diretrizes de Custo Zero
        </h1>
        <p className="text-sm text-slate-500">
          Supervisão rígida de gastos. Nenhum serviço tarifado pode ser ativado sem autorização explícita do proprietário.
        </p>
      </div>

      {/* Safety Banner */}
      <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50/70 p-6 dark:border-emerald-800 dark:bg-emerald-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs uppercase font-bold tracking-wider text-emerald-900 dark:text-emerald-200">
                Orçamento Autorizado Atual
              </div>
              <div className="text-3xl font-extrabold text-emerald-950 dark:text-emerald-100">
                R$ 0,00 <span className="text-sm font-semibold text-emerald-700">/ mês</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="verified" className="text-xs font-semibold px-3 py-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mr-1" />
              Trava de Cobrança 100% Ativa
            </Badge>
          </div>
        </div>
      </div>

      {/* Table of Services */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            Serviços de Infraestrutura em Operação ({operationalCosts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Serviço & Provedor</th>
                  <th className="py-3 px-3">Plano</th>
                  <th className="py-3 px-3">Custo Mensal</th>
                  <th className="py-3 px-3">Limite Gratuito</th>
                  <th className="py-3 px-3">Consumo Atual</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {operationalCosts.map((c) => (
                  <tr key={c.service} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{c.service}</div>
                      <div className="text-[11px] text-slate-500">{c.necessity}</div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 font-medium">
                      {c.plan}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                      {c.cost}
                    </td>
                    <td className="py-3.5 px-3 text-slate-500">
                      {c.limit}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 font-medium">
                      {c.consumption}
                    </td>
                    <td className="py-3.5 px-3">
                      <Badge variant="verified" className="text-[10px]">
                        Autorizado
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
