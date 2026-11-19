import React from "react";
import {
  Users,
  MousePointerClick,
  DollarSign,
  TrendingUp,
  Bot,
  CheckCircle2,
} from "lucide-react";
import { MetricCard } from "@/components/admin/MetricCard";
import { NeedsAttentionBox, type AttentionItem } from "@/components/admin/NeedsAttentionBox";
import { BudgetGauge } from "@/components/admin/BudgetGauge";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Link from "next/link";

export default function AdminDashboardPage() {
  // Itens que requerem atenção estrita do proprietário (conforme Seção 12)
  const attentionItems: AttentionItem[] = [
    {
      id: "att-1",
      title: "Rascunho de Comparação Gerado: HubSpot vs ActiveCampaign",
      description: "O Agente Editorial produziu um rascunho com 1.450 palavras. Requer revisão humana e checagem de fontes antes de publicação.",
      severity: "review",
      actionLabel: "Revisar Conteúdo",
      actionUrl: "/admin/editorial",
      timeAgo: "há 2 horas",
    },
    {
      id: "att-2",
      title: "Novo Programa de Afiliados Descoberto: Notion Partner Program",
      description: "O Agente Pesquisador identificou comissão recorrente de 50% no primeiro ano via PartnerStack. Aguarda aprovação para submissão.",
      severity: "warning",
      actionLabel: "Ver Programa",
      actionUrl: "/admin/affiliates",
      timeAgo: "há 5 horas",
    },
    {
      id: "att-3",
      title: "Lead Qualificado: Sistema de CRM para Distribuidora",
      description: "Solicitação recebida via formulário de sistemas sob medida. O Agente Comercial elaborou um briefing técnico preliminar.",
      severity: "urgent",
      actionLabel: "Analisar Briefing",
      actionUrl: "/admin/leads",
      timeAgo: "há 1 dia",
    },
  ];

  const agentStatuses = [
    { code: "AGENT_1_RESEARCHER", name: "1. Pesquisador", status: "Em Espera", task: "Varredura periódica de novos SaaS", runsToday: 3 },
    { code: "AGENT_2_SEO", name: "2. SEO & Keywords", status: "Concluído", task: "Mapeamento de intenção comercial", runsToday: 2 },
    { code: "AGENT_3_EDITORIAL", name: "3. Editorial", status: "Aguardando Aprovação", task: "Rascunho de comparativo gerado", runsToday: 1 },
    { code: "AGENT_4_AUDITOR", name: "4. Auditor Técnico", status: "Concluído", task: "Checagem de integridade de links (100% OK)", runsToday: 4 },
    { code: "AGENT_5_GROWTH", name: "5. Growth & CTR", status: "Em Espera", task: "Análise de CTR agregada por bloco", runsToday: 1 },
    { code: "AGENT_6_FINANCIAL", name: "6. Financeiro", status: "Em Espera", task: "Pronto para processamento de CSV", runsToday: 0 },
    { code: "AGENT_7_COMMERCIAL", name: "7. Comercial", status: "Ativo", task: "Briefing de demanda sintetizado", runsToday: 1 },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Page Title & Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Central de Operações STACKWISE
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visão consolidada para supervisão em poucos minutos por semana.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="verified" className="text-xs px-3 py-1 font-semibold gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Saúde da Plataforma: Excelente
          </Badge>
        </div>
      </div>

      {/* Critical Section: "VOCÊ PRECISA DA SUA ATENÇÃO" */}
      <NeedsAttentionBox items={attentionItems} />

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Visitantes Orgânicos (Semana)"
          value="1.240"
          subtitle="Tráfego direto e indexado"
          delta="+18.4%"
          deltaType="positive"
          icon={Users}
        />
        <MetricCard
          title="Cliques em Afiliados (/go/*)"
          value="182"
          subtitle="Taxa de clique (CTR): 14.6%"
          delta="+5.2%"
          deltaType="positive"
          icon={MousePointerClick}
        />
        <MetricCard
          title="Comissões Aprovadas"
          value="R$ 380,00"
          subtitle="Pendentes de pagamento: R$ 120,00"
          badge="Auditado"
          icon={DollarSign}
        />
        <MetricCard
          title="Faturamento Acumulado"
          value="R$ 1.420,00"
          subtitle="Meta aspiracional: R$ 1.000.000"
          delta="Fase 1 / Validação"
          deltaType="neutral"
          icon={TrendingUp}
        />
      </div>

      {/* Middle Row: Budget Gauge & Autonomous Agent Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost Control Gauge */}
        <div className="space-y-6">
          <BudgetGauge authorizedCap={0.0} currentConsumption={0.0} />

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Metas Financeiras</span>
                <span className="text-xs font-normal text-slate-500">Próximo Marco</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between font-medium">
                <span className="text-slate-600">Primeira Comissão:</span>
                <span className="text-emerald-600 font-bold">Conquistada (R$ 48,00)</span>
              </div>
              <div className="flex items-center justify-between font-medium">
                <span className="text-slate-600">Marco R$ 1.000:</span>
                <span className="text-emerald-600 font-bold">Atingido (R$ 1.420,00)</span>
              </div>
              <div className="flex items-center justify-between font-medium">
                <span className="text-slate-600">Próximo Marco (R$ 10.000):</span>
                <span className="text-blue-600 font-bold">14,2% concluído</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-1">
                <div className="h-full bg-blue-600" style={{ width: "14.2%" }} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 7 AI Agents Status */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  Status dos 7 Agentes Autônomos de IA
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Operando em modo supervisionado com limite de consumo seguro.
                </p>
              </div>
              <Link href="/admin/agents" className="text-xs font-semibold text-blue-600 hover:underline">
                Gerenciar Agentes
              </Link>
            </CardHeader>

            <CardContent>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {agentStatuses.map((agent) => (
                  <div key={agent.code} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {agent.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {agent.task}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-400">
                        {agent.runsToday} execuções hoje
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          agent.status === "Aguardando Aprovação"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                            : agent.status === "Ativo"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {agent.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
