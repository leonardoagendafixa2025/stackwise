"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  MessageCircle,
  Trash2,
  RotateCw,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface LeadItem {
  id: string;
  contact_name: string;
  contact_email: string;
  company_name: string | null;
  project_summary: string;
  budget_range: string | null;
  status: "new" | "in_progress" | "qualified" | "closed";
  created_at: string;
}

function extractWhatsApp(lead: { project_summary?: string; company_name?: string | null }) {
  const match = lead.project_summary?.match(/\[WhatsApp:\s*([^\]]+)\]/) 
    || lead.company_name?.match(/WhatsApp:\s*([^\s•]+)/);
  return match ? match[1].trim() : null;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/leads");
      const data = await res.json();
      if (res.ok) {
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error("Erro ao carregar leads:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLead = async (id: string, contactName: string) => {
    if (!window.confirm(`Tem certeza que deseja REMOVER o orçamento de "${contactName}"? Esta ação é definitiva.`)) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/leads?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Falha ao remover lead");
      }

      setLeads((prev) => prev.filter((lead) => lead.id !== id));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao remover lead";
      alert(msg);
    } finally {
      setDeletingId(null);
    }
  };

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

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadLeads}
            disabled={loading}
            className="gap-1.5 text-xs font-semibold"
          >
            <RotateCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Atualizar</span>
          </Button>

          <Link href="/pt-br/custom-systems" target="_blank">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
              <span>Ver Formulário Público</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total de Leads</span>
            <Inbox className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
            {leads.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Demandas registradas</div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Pipeline Estimado</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2">
            {leads.length > 0 ? (leads[0].budget_range || "Sob Consulta") : "R$ 0,00"}
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
            <span className="text-xs font-normal text-slate-400">{leads.length} registro(s)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
              <RotateCw className="h-5 w-5 animate-spin text-blue-600" />
              <span>Carregando solicitações de orçamento...</span>
            </div>
          ) : leads.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              Nenhuma solicitação de orçamento registrada no momento.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {leads.map((lead) => {
                const statusCfg = statusMap[lead.status] || { label: lead.status, badgeVariant: "secondary" };
                const rawWhatsApp = extractWhatsApp(lead);
                const cleanPhone = rawWhatsApp ? rawWhatsApp.replace(/\D/g, "") : null;
                const fullPhone = cleanPhone ? (cleanPhone.startsWith("55") ? cleanPhone : "55" + cleanPhone) : null;
                const cleanSummary = lead.project_summary?.replace(/\[WhatsApp:\s*[^\]]+\]\s*/g, "").trim() || lead.project_summary;
                const cleanCompany = lead.company_name?.replace(/•?\s*WhatsApp:\s*[^\s•]+/g, "").trim() || lead.company_name;

                const whatsappMsg = encodeURIComponent(
                  `Olá ${lead.contact_name}! Aqui é da equipe técnica da STACKWISE. Recebemos seu briefing de projeto sobre "${cleanSummary.slice(0, 80)}..." e gostaríamos de alinhar os detalhes e orçamento com você!`
                );

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
                          <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3 mt-0.5">
                            {cleanCompany && (
                              <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                                <Building2 className="h-3 w-3 text-slate-400" />
                                {cleanCompany}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-slate-400" />
                              {lead.contact_email}
                            </span>
                            {rawWhatsApp && (
                              <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded text-[11px]">
                                <MessageCircle className="h-3 w-3 text-emerald-500" />
                                {rawWhatsApp}
                              </span>
                            )}
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
                      {cleanSummary}
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-2.5 pt-1">
                      {fullPhone ? (
                        <a
                          href={`https://wa.me/${fullPhone}?text=${whatsappMsg}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex"
                        >
                          <Button size="sm" className="text-xs gap-1.5 h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs">
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span>Chamar no WhatsApp ({rawWhatsApp})</span>
                          </Button>
                        </a>
                      ) : (
                        <a
                          href={`https://web.whatsapp.com/send?text=${encodeURIComponent(`Olá ${lead.contact_name}! Aqui é da STACKWISE sobre o briefing que você enviou!`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex"
                        >
                          <Button size="sm" variant="outline" className="text-xs gap-1.5 h-8 text-emerald-700 border-emerald-300 hover:bg-emerald-50 dark:text-emerald-400">
                            <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                            <span>WhatsApp Web</span>
                          </Button>
                        </a>
                      )}

                      <a
                        href={`mailto:${lead.contact_email}?subject=Briefing STACKWISE - Projeto ${cleanCompany || ""}`}
                        className="inline-flex"
                      >
                        <Button size="sm" variant="outline" className="text-xs gap-1 h-8 text-slate-600">
                          <Mail className="h-3 w-3" />
                          <span>E-mail</span>
                        </Button>
                      </a>

                      <Button
                        size="sm"
                        variant="outline"
                        disabled={deletingId === lead.id}
                        onClick={() => handleDeleteLead(lead.id, lead.contact_name)}
                        className="text-xs gap-1 h-8 text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>{deletingId === lead.id ? "Removendo..." : "Remover"}</span>
                      </Button>
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
