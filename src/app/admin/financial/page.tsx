"use client";

import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  UploadCloud,
  Plus,
  RefreshCw,
  Info,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import {
  FinancialSummary,
  DetailedConversion,
  OperationalCostItem,
} from "@/services/financial";

export default function AdminFinancialPage() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [conversions, setConversions] = useState<DetailedConversion[]>([]);
  const [costs, setCosts] = useState<OperationalCostItem[]>([]);
  const [loading, setLoading] = useState(true);

  // CSV Import State
  const [csvInput, setCsvInput] = useState("");
  const [importing, setImporting] = useState(false);
  const [importFeedback, setImportFeedback] = useState<{
    success: boolean;
    message: string;
    stats?: Record<string, unknown>;
  } | null>(null);

  // Operational Cost Form Modal
  const [showCostModal, setShowCostModal] = useState(false);
  const [costForm, setCostForm] = useState({
    service_name: "",
    plan_tier: "Free Tier",
    cost_brl: 0,
    is_authorized: false,
    notes: "",
  });

  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/financial/summary");
      const data = await res.json();
      if (res.ok) {
        setSummary(data.summary);
        setConversions(data.conversions || []);
        setCosts(data.costs || []);
      }
    } catch (err) {
      console.error("Failed to load financial data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessCSV = async () => {
    if (!csvInput.trim()) {
      alert("Por favor, cole o conteúdo do arquivo CSV para processar.");
      return;
    }

    setImporting(true);
    setImportFeedback(null);

    try {
      const res = await fetch("/api/admin/financial/import-csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvContent: csvInput }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha ao importar CSV");

      setImportFeedback({
        success: true,
        message: `Relatório reconciliado com sucesso! ${data.result.processedRowsCount} conversão(ões) inserida(s).`,
        stats: data.result,
      });

      setCsvInput("");
      loadFinancialData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setImportFeedback({
        success: false,
        message: `Falha na importação: ${msg}`,
      });
    } finally {
      setImporting(false);
    }
  };

  const handleLoadSampleCSV = () => {
    const sample = `conversionId,linkSlug,saleAmount,commissionAmount,status,conversionDate
INV-2026-901,hubspot,500.00,100.00,pending,2026-11-18T10:00:00Z
INV-2026-902,activecampaign,149.00,44.70,approved,2026-11-15T14:30:00Z
INV-2026-903,notion,120.00,60.00,paid,2026-11-01T09:15:00Z
INV-2026-904,make,89.00,17.80,paid,2026-11-05T16:20:00Z`;
    setCsvInput(sample);
  };

  const handleCreateCost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/financial/costs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(costForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha ao cadastrar custo");

      setShowCostModal(false);
      setCostForm({
        service_name: "",
        plan_tier: "Free Tier",
        cost_brl: 0,
        is_authorized: false,
        notes: "",
      });
      loadFinancialData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      alert(msg);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Gestão Financeira, Comissões & Conciliação
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Contabilidade estrita: clique não é venda e comissão pendente não é dinheiro em caixa.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadFinancialData}
            disabled={loading}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Atualizar</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setShowCostModal(true)}
            className="gap-1.5 text-xs font-semibold"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Registrar Custo</span>
          </Button>
        </div>
      </div>

      {/* Accounting Compliance Alert */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200 flex items-start gap-3">
        <Info className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
        <div>
          <span className="font-bold">Regra Contábil STACKWISE:</span> Os valores são segregados rigorosamente entre <strong>Receita Realizada</strong> (comissões já pagas pelas redes parceiras), <strong>Aprovadas</strong> (em prazo contratual de liquidação) e <strong>Pendentes</strong> (em janela de estorno ou carência). Custos operacionais possuem trava ativa de R$ 0,00.
        </div>
      </div>

      {/* Primary Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Paid / Realized Gross Revenue */}
        <Card className="border-emerald-200 bg-emerald-50/40 dark:border-emerald-900 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <span>Receita Realizada (Paga)</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {formatCurrency(summary?.grossRevenue || 0)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Dinheiro efetivamente recebido
          </p>
        </Card>

        {/* Approved Commissions */}
        <Card>
          <div className="flex items-center justify-between text-xs font-semibold text-blue-700 dark:text-blue-400">
            <span>Comissões Aprovadas</span>
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {formatCurrency(summary?.approvedCommissions || 0)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Aprovadas pela rede, aguardando repasse
          </p>
        </Card>

        {/* Pending Commissions */}
        <Card>
          <div className="flex items-center justify-between text-xs font-semibold text-amber-700 dark:text-amber-400">
            <span>Comissões Pendentes</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {formatCurrency(summary?.pendingCommissions || 0)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Em período de carência (30 a 90 dias)
          </p>
        </Card>

        {/* Net Operating Result */}
        <Card>
          <div className="flex items-center justify-between text-xs font-semibold text-indigo-700 dark:text-indigo-400">
            <span>Lucro Líquido Estimado</span>
            <TrendingUp className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {formatCurrency(summary?.netProfit || 0)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Receita paga menos despesas (R$ 0)
          </p>
        </Card>
      </div>

      {/* Aspiracional Goal: R$ 1.000.000 Gauge */}
      <Card className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Meta Aspiracional: R$ 1.000.000 de Faturamento Acumulado
              </h3>
              <Badge variant="outline" className="text-[10px]">
                Horizonte: Dezembro / 2027
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Progresso calculado exclusivamente sobre receita bruta realizada e auditada.
            </p>
          </div>

          <div className="text-right">
            <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
              {summary?.targetProgressPercentage || 0}%
            </span>
            <span className="text-xs text-slate-400 ml-1">
              ({formatCurrency(summary?.grossRevenue || 0)} / {formatCurrency(summary?.targetGross || 1000000)})
            </span>
          </div>
        </div>

        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0.5, summary?.targetProgressPercentage || 0))}%` }}
          />
        </div>
      </Card>

      {/* CSV Import & Reconciliation Section (Agent 6 Engine) */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Importação & Conciliação de Relatórios de Afiliados (Agente 6)
              </h3>
              <p className="text-xs text-slate-500">
                Importe relatórios exportados da Impact, PartnerStack, ShareASale ou CJ Affiliate.
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleLoadSampleCSV}
            className="text-xs"
          >
            Carregar Modelo Demonstrativo
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Conteúdo CSV (Formato: conversionId, linkSlug, saleAmount, commissionAmount, status, date)
          </label>
          <textarea
            value={csvInput}
            onChange={(e) => setCsvInput(e.target.value)}
            rows={5}
            placeholder={`conversionId,linkSlug,saleAmount,commissionAmount,status,conversionDate\nINV-001,hubspot,100.00,20.00,pending,2026-11-19T00:00:00Z`}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 dark:bg-slate-900 dark:border-slate-700 p-3 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {importFeedback && (
          <div
            className={`rounded-lg p-3 text-xs flex items-center justify-between ${
              importFeedback.success
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {importFeedback.success ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              )}
              <span>{importFeedback.message}</span>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={handleProcessCSV}
            disabled={importing || !csvInput.trim()}
            className="gap-2 text-xs font-semibold"
          >
            <UploadCloud className="h-3.5 w-3.5" />
            <span>{importing ? "Reconciliando..." : "Processar e Reconciliar"}</span>
          </Button>
        </div>
      </Card>

      {/* Grid: Conversions Table & Operational Costs Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Conversions Table (2 Columns) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Histórico de Conversões Reconciliadas ({conversions.length})
            </h3>
            <Badge variant="secondary" className="text-[10px]">
              Ordenadas por data
            </Badge>
          </div>

          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Data</th>
                    <th className="px-4 py-3 font-semibold">Produto / Slug</th>
                    <th className="px-4 py-3 font-semibold text-right">Venda</th>
                    <th className="px-4 py-3 font-semibold text-right">Comissão</th>
                    <th className="px-4 py-3 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {conversions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        Nenhuma conversão registrada ainda. Importe um relatório CSV acima para testar.
                      </td>
                    </tr>
                  ) : (
                    conversions.map((conv) => (
                      <tr key={conv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                          {new Date(conv.conversion_date).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {conv.product_name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            /{conv.link_slug}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-300">
                          {formatCurrency(conv.amount)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                          {formatCurrency(conv.commission_amount)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge
                            variant={
                              conv.status === "paid"
                                ? "verified"
                                : conv.status === "approved"
                                ? "default"
                                : conv.status === "pending"
                                ? "warning"
                                : "destructive"
                            }
                            className="text-[10px] capitalize"
                          >
                            {conv.status === "paid"
                              ? "Paga"
                              : conv.status === "approved"
                              ? "Aprovada"
                              : conv.status === "pending"
                              ? "Pendente"
                              : "Estornada"}
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

        {/* Operational Costs Side Table (1 Column) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Custos Operacionais (Trava R$ 0)
            </h3>
            <Badge variant="verified" className="text-[10px]">
              100% Custo Zero
            </Badge>
          </div>

          <Card className="p-0 overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {costs.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  Nenhum custo cadastrado. Todos os serviços rodam em planos gratuitos oficiais.
                </div>
              ) : (
                costs.map((cost) => (
                  <div key={cost.id} className="p-3 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {cost.service_name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {cost.plan_tier} {cost.notes ? `• ${cost.notes}` : ""}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-emerald-600">
                        {formatCurrency(cost.cost_brl)}
                      </div>
                      <Badge variant="secondary" className="text-[9px] mt-0.5">
                        {cost.cost_brl === 0 ? "Gratuito Oficial" : "Autorizado"}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Cost Creation Modal */}
      {showCostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Registrar Serviço / Custo Operacional
            </h3>
            <p className="text-xs text-slate-500">
              Aviso: Todo custo acima de R$ 0,00 viola a regra de investimento zero até aprovação expressa do proprietário.
            </p>

            <form onSubmit={handleCreateCost} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Nome do Serviço
                </label>
                <Input
                  required
                  placeholder="Ex: Vercel, Supabase, Cloudflare"
                  value={costForm.service_name}
                  onChange={(e) => setCostForm({ ...costForm, service_name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Plano / Tier
                </label>
                <Input
                  placeholder="Ex: Hobby / Free Tier"
                  value={costForm.plan_tier}
                  onChange={(e) => setCostForm({ ...costForm, plan_tier: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Custo Mensal (BRL)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={costForm.cost_brl}
                  onChange={(e) => setCostForm({ ...costForm, cost_brl: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Observações
                </label>
                <Input
                  placeholder="Ex: Cota gratuita oficial com 15 RPM"
                  value={costForm.notes}
                  onChange={(e) => setCostForm({ ...costForm, notes: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="authorizedCheck"
                  checked={costForm.is_authorized}
                  onChange={(e) => setCostForm({ ...costForm, is_authorized: e.target.checked })}
                  className="rounded border-slate-300"
                />
                <label htmlFor="authorizedCheck" className="text-xs text-slate-600 dark:text-slate-300">
                  Autorizado pelo proprietário CLT
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowCostModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit" size="sm" className="font-semibold">
                  Salvar Registro
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
