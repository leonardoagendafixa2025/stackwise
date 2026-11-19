import React from "react";
import {
  Bot,
  Play,
  RotateCw,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function AdminAgentsPage() {
  const agents = [
    {
      code: "AGENT_1_RESEARCHER",
      name: "Agente 1 — Pesquisador",
      role: "Descoberta de SaaS, checagem de programas de afiliados e fontes oficiais.",
      hourlyLimit: 12,
      dailyTokensUsed: 8450,
      dailyTokenCap: 40000,
      status: "Idle",
      lastRun: "há 45 min",
      lastResult: "3 novos concorrentes mapeados em CRM",
    },
    {
      code: "AGENT_2_SEO",
      name: "Agente 2 — SEO & Oportunidades",
      role: "Identificação de palavras-chave comerciais e sugestões de comparativos X vs Y.",
      hourlyLimit: 15,
      dailyTokensUsed: 6200,
      dailyTokenCap: 30000,
      status: "Idle",
      lastRun: "há 2 horas",
      lastResult: "5 pautas de comparação priorizadas",
    },
    {
      code: "AGENT_3_EDITORIAL",
      name: "Agente 3 — Editorial & Comparações",
      role: "Elaboração de rascunhos sem alucinações, com checagem obrigatória de dados.",
      hourlyLimit: 10,
      dailyTokensUsed: 14200,
      dailyTokenCap: 50000,
      status: "Needs Review",
      lastRun: "há 2 horas",
      lastResult: "Rascunho: HubSpot vs ActiveCampaign gerado",
    },
    {
      code: "AGENT_4_AUDITOR",
      name: "Agente 4 — Auditor Técnico & Links",
      role: "Verificação HTTP dos links afiliados e monitoramento de alterações de preços.",
      hourlyLimit: 20,
      dailyTokensUsed: 2100,
      dailyTokenCap: 20000,
      status: "Success",
      lastRun: "há 30 min",
      lastResult: "Todos os 3 links ativos testados com HTTP 200/307",
    },
    {
      code: "AGENT_5_GROWTH",
      name: "Agente 5 — Growth & Conversão",
      role: "Análise de CTR agregado e recomendações de posicionamento de cards de comparação.",
      hourlyLimit: 10,
      dailyTokensUsed: 3100,
      dailyTokenCap: 25000,
      status: "Idle",
      lastRun: "há 6 horas",
      lastResult: "CTR médio em 14.6% mantido",
    },
    {
      code: "AGENT_6_FINANCIAL",
      name: "Agente 6 — Financeiro & Conciliação",
      role: "Importação e conciliação de CSVs de redes de afiliados, separando pendentes e pagos.",
      hourlyLimit: 10,
      dailyTokensUsed: 1200,
      dailyTokenCap: 20000,
      status: "Idle",
      lastRun: "ontem",
      lastResult: "Sem CSVs novos aguardando processamento",
    },
    {
      code: "AGENT_7_COMMERCIAL",
      name: "Agente 7 — Consultor de Sistemas",
      role: "Atendimento no formulário de soluções sob medida e geração de briefing preliminar.",
      hourlyLimit: 30,
      dailyTokensUsed: 5400,
      dailyTokenCap: 35000,
      status: "Active",
      lastRun: "há 1 dia",
      lastResult: "Briefing #001 gerado com sucesso",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Central de Inteligência Artificial & Agentes Autônomos
          </h1>
          <p className="text-sm text-slate-500">
            Cada agente possui responsabilidades restritas, limites de taxa e trava de segurança de custos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="verified" className="text-xs px-3 py-1 font-semibold">
            Google Gemini API (Tier Gratuito Oficial)
          </Badge>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((ag) => {
          const usagePct = Math.round((ag.dailyTokensUsed / ag.dailyTokenCap) * 100);
          return (
            <Card key={ag.code} className="flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                    <Bot className="h-4 w-4" />
                  </div>
                  <Badge
                    variant={
                      ag.status === "Needs Review"
                        ? "warning"
                        : ag.status === "Success"
                        ? "verified"
                        : "secondary"
                    }
                    className="text-[10px]"
                  >
                    {ag.status}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {ag.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {ag.role}
                  </p>
                </div>

                {/* Token Consumption Gauge */}
                <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/40 space-y-1.5 text-xs">
                  <div className="flex justify-between text-[11px] font-medium text-slate-600 dark:text-slate-300">
                    <span>Consumo Hoje:</span>
                    <span>{ag.dailyTokensUsed} / {ag.dailyTokenCap} tokens ({usagePct}%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${usagePct > 80 ? "bg-amber-500" : "bg-blue-600"}`}
                      style={{ width: `${usagePct}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Limite: máx {ag.hourlyLimit} requisições/hora
                  </div>
                </div>

                <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="h-3 w-3" />
                    <span>Última execução: {ag.lastRun}</span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-700 dark:text-slate-200 truncate">
                    {ag.lastResult}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                  <RotateCw className="h-3 w-3" />
                  <span>Histórico</span>
                </Button>
                <Button size="sm" className="gap-1.5 text-xs font-semibold">
                  <Play className="h-3 w-3" />
                  <span>Executar Tarefa</span>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
