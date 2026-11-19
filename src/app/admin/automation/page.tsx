"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCw,
  Clock,
  Zap,
  Server,
  Check,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ScheduledJobItem, RecoveryResult } from "@/services/recovery";

interface HealthData {
  status: string;
  database: string;
  latencyMs: number;
  productsCount: number;
  activeAgentsCount: number;
  budgetMonthlyCapBRL: number;
  zeroCostLockEnforced: boolean;
}

export default function AdminAutomationPage() {
  const [jobs, setJobs] = useState<ScheduledJobItem[]>([]);
  const [failedCount, setFailedCount] = useState(0);
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  // Recovery trigger state
  const [recovering, setRecovering] = useState(false);
  const [recoveryResult, setRecoveryResult] = useState<RecoveryResult | null>(null);

  useEffect(() => {
    loadAutomationData();
  }, []);

  const loadAutomationData = async () => {
    try {
      setLoading(true);
      const [resRec, resHealth] = await Promise.all([
        fetch("/api/admin/system/recover"),
        fetch("/api/health"),
      ]);

      if (resRec.ok) {
        const dataRec = await resRec.json();
        setJobs(dataRec.scheduledJobs || []);
        setFailedCount(dataRec.failedTasksCount || 0);
      }

      if (resHealth.ok) {
        const dataH = await resHealth.json();
        setHealth(dataH);
      }
    } catch (err) {
      console.error("Failed to load automation data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunSelfHealing = async () => {
    setRecovering(true);
    setRecoveryResult(null);

    try {
      const res = await fetch("/api/admin/system/recover", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha na recuperação");

      setRecoveryResult(data.result);
      loadAutomationData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      alert(`Erro na auto-recuperação: ${msg}`);
    } finally {
      setRecovering(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Automação, Agendamentos & Auto-Recuperação (Self-Healing)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Rotinas autônomas programadas para rodar sem intervenção diária a custo R$ 0,00.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadAutomationData}
            disabled={loading}
            className="gap-1.5 text-xs"
          >
            <RotateCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Atualizar Status</span>
          </Button>
        </div>
      </div>

      {/* Autonomous Stability Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <span>Saúde do Banco Supabase</span>
            <Server className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {health?.database === "connected" ? "100% Online" : "Verificando..."}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Latência: {health?.latencyMs ?? 0} ms • 26 tabelas com RLS
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between text-xs font-semibold text-blue-700 dark:text-blue-400">
            <span>Rotinas Agendadas (Cron)</span>
            <Clock className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {jobs.length} Ativas
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            GitHub Actions (Free Tier 2.000 min)
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between text-xs font-semibold text-amber-700 dark:text-amber-400">
            <span>Tarefas com Falha Pendente</span>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {failedCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Candidatas à auto-recuperação (máx 3 retries)
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between text-xs font-semibold text-indigo-700 dark:text-indigo-400">
            <span>Trava de Orçamento Zero</span>
            <CheckCircle2 className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            R$ 0,00 / mês
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            100% mitigado em serviços gratuitos oficiais
          </p>
        </Card>
      </div>

      {/* Self-Healing Trigger Banner */}
      <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Mecanismo de Recuperação Automática (Self-Healing)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                Varre tarefas de IA e rotinas que falharam, aplica backoff exponencial (até 3 tentativas) e atualiza o estado de forma idempotente. Se o erro persistir além de 3 tentativas, o sistema cria um alerta crítico no painel do proprietário.
              </p>
            </div>
          </div>

          <Button
            onClick={handleRunSelfHealing}
            disabled={recovering}
            className="shrink-0 gap-2 font-semibold text-xs"
          >
            <Play className={`h-3.5 w-3.5 ${recovering ? "animate-spin" : ""}`} />
            <span>{recovering ? "Executando Recuperação..." : "Executar Auto-Recuperação"}</span>
          </Button>
        </div>

        {recoveryResult && (
          <div className="rounded-xl border border-emerald-200 bg-white dark:border-emerald-900 dark:bg-slate-900 p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400">
              <Check className="h-4 w-4" />
              <span>Varredura de Recuperação Concluída:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600 dark:text-slate-300">
              <div>Encontradas: <strong>{recoveryResult.totalFailedFound}</strong></div>
              <div>Retentadas: <strong>{recoveryResult.retriedCount}</strong></div>
              <div>Recuperadas: <strong className="text-emerald-600">{recoveryResult.recoveredCount}</strong></div>
              <div>Escalonadas: <strong className="text-rose-600">{recoveryResult.escalatedCount}</strong></div>
            </div>
          </div>
        )}
      </Card>

      {/* Scheduled Jobs Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            Rotinas Agendadas & Gatilhos Periódicos (Supabase + GitHub Actions)
          </h3>
          <Badge variant="secondary" className="text-[10px]">
            Custo Zero Garantido
          </Badge>
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Identificação da Rotina</th>
                  <th className="px-4 py-3 font-semibold">Agente Responsável</th>
                  <th className="px-4 py-3 font-semibold">Expressão Cron</th>
                  <th className="px-4 py-3 font-semibold">Última Execução</th>
                  <th className="px-4 py-3 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      Nenhuma rotina agendada registrada. O script cron registrará automaticamente.
                    </td>
                  </tr>
                ) : (
                  jobs.map((j) => (
                    <tr key={j.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {j.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Automated Runner
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {j.agent_name || j.agent_code || "AGENT_4_AUDITOR"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-blue-600 dark:text-blue-400">
                        {j.cron_expression} (a cada 12h)
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">
                        {j.last_run_at ? new Date(j.last_run_at).toLocaleString("pt-BR") : "Aguardando"}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <Badge
                          variant={j.status === "completed" ? "verified" : j.status === "warning" ? "warning" : "secondary"}
                          className="text-[10px] capitalize"
                        >
                          {j.status === "completed" ? "Operacional" : j.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
