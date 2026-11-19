"use client";

import React, { useState, useEffect } from "react";
import {
  Bot,
  Play,
  RotateCw,
  CheckCircle2,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AgentDefinition, AgentTask } from "@/types/database";

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<AgentDefinition[]>([]);
  const [executingAgent, setExecutingAgent] = useState<string | null>(null);
  const [activeTaskResult, setActiveTaskResult] = useState<{
    agentName: string;
    output: Record<string, unknown>;
    tokensUsed: number;
    message?: string;
  } | null>(null);

  const [historyModalAgent, setHistoryModalAgent] = useState<string | null>(null);
  const [taskHistory, setTaskHistory] = useState<AgentTask[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = () => {
    fetch("/api/admin/agents/tasks")
      .then(() => {
        // Fetch definitions directly from API or supabase
        return fetch("/api/admin/agents/list");
      })
      .then((r) => r.json())
      .then((data) => {
        if (data.agents) setAgents(data.agents);
      })
      .catch((err) => console.error("Error loading agents:", err));
  };

  const handleRunAgent = async (agent: AgentDefinition) => {
    setExecutingAgent(agent.code);
    setActiveTaskResult(null);

    try {
      let payload: Record<string, unknown> = {};
      if (agent.code === "AGENT_3_EDITORIAL") {
        payload = { topic: "Comparativo de Softwares de CRM para 2026" };
      }

      const res = await fetch("/api/admin/agents/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentCode: agent.code,
          inputPayload: payload,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha ao executar tarefa");

      setActiveTaskResult({
        agentName: agent.name,
        output: data.output,
        tokensUsed: data.tokensUsed,
        message: data.message,
      });

      // Refresh agent token counters
      loadAgents();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      alert(`Erro na execução do agente: ${msg}`);
    } finally {
      setExecutingAgent(null);
    }
  };

  const handleOpenHistory = async (agentCode: string) => {
    setHistoryModalAgent(agentCode);
    setLoadingHistory(true);

    try {
      const res = await fetch(`/api/admin/agents/tasks?agentCode=${agentCode}`);
      const data = await res.json();
      setTaskHistory(data.tasks || []);
    } catch (err) {
      console.error("Error loading task history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
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
            Google Gemini API (Tier Gratuito Oficial - 15 RPM)
          </Badge>
        </div>
      </div>

      {/* Real-time Task Execution Output Banner */}
      {activeTaskResult && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-5 dark:border-blue-900 dark:bg-blue-950/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Resultado da Execução: {activeTaskResult.agentName}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-semibold text-blue-700 dark:text-blue-300">
                {activeTaskResult.tokensUsed} tokens consumidos
              </span>
              <button
                onClick={() => setActiveTaskResult(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300">
            {activeTaskResult.message}
          </p>

          <pre className="max-h-60 overflow-y-auto rounded-lg bg-slate-900 p-3 text-[11px] font-mono text-emerald-400">
            {JSON.stringify(activeTaskResult.output, null, 2)}
          </pre>
        </div>
      )}

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((ag) => {
          const usagePct = Math.round((ag.current_daily_tokens / ag.daily_token_cap) * 100);
          const isRunning = executingAgent === ag.code;

          return (
            <Card key={ag.code} className="flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                    <Bot className="h-4 w-4" />
                  </div>
                  <Badge variant={ag.is_active ? "verified" : "secondary"} className="text-[10px]">
                    {ag.is_active ? "Operacional" : "Pausado"}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {ag.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {ag.role_description}
                  </p>
                </div>

                {/* Token Consumption Gauge */}
                <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/40 space-y-1.5 text-xs">
                  <div className="flex justify-between text-[11px] font-medium text-slate-600 dark:text-slate-300">
                    <span>Cota Diária de Tokens:</span>
                    <span>
                      {ag.current_daily_tokens} / {ag.daily_token_cap} ({usagePct}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${usagePct > 80 ? "bg-amber-500" : "bg-blue-600"}`}
                      style={{ width: `${Math.min(100, usagePct)}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Trava de segurança: máx {ag.hourly_rate_limit} req/hora
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenHistory(ag.code)}
                  className="gap-1.5 text-xs"
                >
                  <RotateCw className="h-3 w-3" />
                  <span>Histórico</span>
                </Button>

                <Button
                  size="sm"
                  disabled={isRunning}
                  onClick={() => handleRunAgent(ag)}
                  className="gap-1.5 text-xs font-semibold"
                >
                  <Play className="h-3 w-3" />
                  <span>{isRunning ? "Executando..." : "Executar Tarefa"}</span>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Task History Modal */}
      {historyModalAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Histórico de Tarefas & Logs: {historyModalAgent}
              </h3>
              <button
                onClick={() => setHistoryModalAgent(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {loadingHistory ? (
                <div className="py-8 text-center text-slate-400">Carregando histórico do Supabase...</div>
              ) : taskHistory.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  Nenhuma execução registrada para este agente ainda. Clique em &quot;Executar Tarefa&quot;.
                </div>
              ) : (
                taskHistory.map((t) => (
                  <div key={t.id} className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={t.status === "completed" ? "verified" : t.status === "failed" ? "destructive" : "secondary"}
                        className="text-[10px]"
                      >
                        {t.status}
                      </Badge>
                      <span className="text-[11px] text-slate-400">
                        {t.started_at ? new Date(t.started_at).toLocaleString("pt-BR") : "—"}
                      </span>
                    </div>

                    {t.output_payload && (
                      <pre className="max-h-32 overflow-y-auto rounded bg-slate-50 dark:bg-slate-950 p-2 text-[10px] font-mono text-slate-700 dark:text-slate-300">
                        {JSON.stringify(t.output_payload, null, 2)}
                      </pre>
                    )}

                    {t.error_message && (
                      <div className="text-rose-600 text-[11px] font-medium">
                        Erro: {t.error_message}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button size="sm" variant="outline" onClick={() => setHistoryModalAgent(null)}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
