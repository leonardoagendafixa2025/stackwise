import React from "react";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Inbox,
  Mail,
  Building2,
  DollarSign,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const supabase = createAdminClient();
  const { data: leads } = await supabase
    .from("project_leads")
    .select("*")
    .order("created_at", { ascending: false });

  const displayLeads = leads || [];

  const statusMap: Record<string, { label: string; badgeVariant: "verified" | "secondary" | "outline" | "destructive" }> = {
    new: { label: "Novo Lead", badgeVariant: "verified" },
    in_progress: { label: "Em Análise", badgeVariant: "secondary" },
    qualified: { label: "Qualificado", badgeVariant: "verified" },
    closed: { label: "Fechado", badgeVariant: "outline" },
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Leads de Sistemas & Consultoria
            </h1>
            <Badge variant="verified" className="text-xs">
              Canal Comercial Ativo
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Demandas corporativas submetidas através do formulário de Briefing com IA no portal público.
          </p>
        </div>

        <Link href="/pt-br/custom-systems" target="_blank">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
            <span>Ver Formulário Público</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total de Leads</span>
            <Inbox className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
            {displayLeads.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Demandas registradas</div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Pipeline Estimado</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2">
            {displayLeads.length > 0 ? (displayLeads[0].budget_range || "Sob Consulta") : "R$ 0,00"}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Orçamento das demandas</div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Agente Comercial IA</span>
            <Sparkles className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
            Ativo
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Pré-qualificação automática</div>
        </Card>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>Todas as Solicitações Recebidas</span>
            <span className="text-xs font-normal text-slate-400">{displayLeads.length} registro(s)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {displayLeads.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Nenhuma solicitação de orçamento recebida ainda.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayLeads.map((lead) => {
                const statusCfg = statusMap[lead.status] || { label: lead.status, badgeVariant: "secondary" };
                return (
                <div key={lead.id} className="p-5 hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 font-bold text-xs">
                        {lead.contact_name?.charAt(0) || "L"}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{lead.contact_name}</span>
                          <Badge variant={statusCfg.badgeVariant} className="text-[10px] py-0.5">
                            {statusCfg.label}
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                          {lead.company_name && (
                            <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                              <Building2 className="h-3 w-3 text-slate-400" />
                              {lead.company_name}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-slate-400" />
                            {lead.contact_email}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-xs text-slate-400 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                        {lead.budget_range || "Não informado"}
                      </span>
                      <span className="flex items-center gap-1 mt-1 text-[11px]">
                        <Clock className="h-3 w-3" />
                        {formatDate(lead.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-800/40 dark:text-slate-300 leading-relaxed border border-slate-200/50 dark:border-slate-800/50">
                    <span className="font-semibold text-slate-900 dark:text-white block mb-1">
                      Briefing do Desafio Técnico:
                    </span>
                    {lead.project_summary}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <a
                      href={`mailto:${lead.contact_email}?subject=Briefing STACKWISE - Projeto ${lead.company_name || ""}`}
                      className="inline-flex"
                    >
                      <Button size="sm" variant="outline" className="text-xs gap-1 h-8">
                        <Mail className="h-3 w-3" />
                        <span>Responder por E-mail</span>
                      </Button>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        </CardContent>
      </Card>
    </div>
  );
}
