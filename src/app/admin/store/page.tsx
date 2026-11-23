"use client";

import React, { useState, useEffect } from "react";
import {
  RotateCw,
  Server,
  Copy,
  Check,
  Percent,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import {
  DigitalProductRecord,
  DigitalOrderRecord,
} from "@/services/digitalStore/catalog";
import { SupplierBalanceInfo } from "@/services/digitalStore/suppliers";

export default function AdminStorePage() {
  const [products, setProducts] = useState<DigitalProductRecord[]>([]);
  const [balances, setBalances] = useState<SupplierBalanceInfo[]>([]);
  const [orders, setOrders] = useState<DigitalOrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync state
  const [syncing, setSyncing] = useState(false);
  const [globalMargin, setGlobalMargin] = useState(40);
  const [copiedId, setCopiedId] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<"products" | "suppliers" | "orders">("products");

  useEffect(() => {
    loadStoreAdminData();
  }, []);

  const loadStoreAdminData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/store");
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products || []);
        setBalances(data.balances || []);
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Failed to load store data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncSuppliers = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/admin/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ defaultMargin: globalMargin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha ao sincronizar");

      alert(data.message || "Produtos sincronizados!");
      loadStoreAdminData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      alert(msg);
    } finally {
      setSyncing(false);
    }
  };

  const handleApplyBulkMargin = async () => {
    setSyncing(true);
    // Instant optimistic UI update
    setProducts((prev) =>
      prev.map((p) => {
        const newSale = Number((p.cost_price * (1 + globalMargin / 100)).toFixed(2));
        return {
          ...p,
          profit_margin_pct: globalMargin,
          sale_price: newSale,
        };
      })
    );

    try {
      const res = await fetch("/api/admin/store", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bulkMargin: globalMargin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha ao aplicar margem");

      loadStoreAdminData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      alert(msg);
      loadStoreAdminData();
    } finally {
      setSyncing(false);
    }
  };

  const handleUpdateMargin = async (productId: string, newSalePrice: number, newMargin: number) => {
    try {
      const res = await fetch("/api/admin/store", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: productId,
          sale_price: newSalePrice,
          profit_margin_pct: newMargin,
        }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId
              ? { ...p, sale_price: newSalePrice, profit_margin_pct: newMargin }
              : p
          )
        );
      }
    } catch (err) {
      console.error("Error updating price:", err);
    }
  };

  const handleToggleProduct = async (productId: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/store", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: productId,
          is_active: !currentStatus,
        }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, is_active: !currentStatus } : p))
        );
      }
    } catch (err) {
      console.error("Error toggling product:", err);
    }
  };

  const handleCopyBinanceId = () => {
    navigator.clipboard.writeText("1257797463");
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Loja de Produtos Digitais & Revenda Automática
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestão dos 3 fornecedores (Telegram Bots), margens de lucro e pagamentos Binance Pay ID.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadStoreAdminData}
            disabled={loading}
            className="gap-1.5 text-xs"
          >
            <RotateCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Atualizar</span>
          </Button>

          <Button
            size="sm"
            onClick={handleSyncSuppliers}
            disabled={syncing}
            className="gap-1.5 text-xs font-semibold"
          >
            <RotateCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
            <span>{syncing ? "Sincronizando..." : "Sincronizar Fornecedores"}</span>
          </Button>
        </div>
      </div>

      {/* Binance Pay ID Banner */}
      <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-4 text-xs text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-slate-950 font-bold">
            BIN
          </div>
          <div>
            <div className="font-bold text-sm">Seu Binance Pay ID Configurado para Recebimento:</div>
            <div className="font-mono text-base font-extrabold text-amber-700 dark:text-amber-300">
              1257797463
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopyBinanceId}
            className="gap-1.5 text-xs bg-white dark:bg-slate-900 font-semibold"
          >
            {copiedId ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedId ? "ID Copiado!" : "Copiar Binance ID"}</span>
          </Button>
        </div>
      </div>

      {/* Global Margin Quick Control */}
      <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <Percent className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              Margem de Lucro Padrão sobre o Custo
            </div>
            <div className="text-xs text-slate-500">
              Aplicada automaticamente em novos produtos sincronizados dos bots.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Input
              type="number"
              min="0"
              max="500"
              value={globalMargin}
              onChange={(e) => setGlobalMargin(Number(e.target.value) || 0)}
              className="w-20 text-center font-bold text-sm"
            />
            <span className="text-xs font-bold text-slate-500">%</span>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleApplyBulkMargin}
            disabled={syncing}
            className="text-xs font-semibold"
          >
            {syncing ? "Aplicando..." : "Aplicar em Massa"}
          </Button>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab("products")}
          className={`pb-3 transition-colors ${
            activeTab === "products"
              ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Produtos & Margens ({products.length})
        </button>

        <button
          onClick={() => setActiveTab("suppliers")}
          className={`pb-3 transition-colors ${
            activeTab === "suppliers"
              ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Saldos dos 3 Fornecedores ({balances.length})
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 transition-colors ${
            activeTab === "orders"
              ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Pedidos & Entregas ({orders.length})
        </button>
      </div>

      {/* Tab 1: Products & Margins */}
      {activeTab === "products" && (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Produto Digital</th>
                  <th className="px-4 py-3 font-semibold">Fornecedor</th>
                  <th className="px-4 py-3 font-semibold text-right">Preço de Custo</th>
                  <th className="px-4 py-3 font-semibold text-center">Margem (%)</th>
                  <th className="px-4 py-3 font-semibold text-right">Preço Venda (USDT)</th>
                  <th className="px-4 py-3 font-semibold text-center">Status na Loja</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Nenhum produto cadastrado. Clique em &quot;Sincronizar Fornecedores&quot; acima para carregar o catálogo dos 3 bots!
                    </td>
                  </tr>
                ) : (
                  products.map((p) => {
                    const profitAmount = p.sale_price - p.cost_price;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {p.name}
                          </div>
                          <div className="text-[10px] text-slate-400 line-clamp-1 max-w-xs">
                            {p.description}
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {p.supplier_code.replace("_", " ")}
                          </Badge>
                        </td>

                        <td className="px-4 py-3.5 text-right font-mono text-slate-500">
                          ${p.cost_price.toFixed(2)}
                        </td>

                        <td className="px-4 py-3.5 text-center">
                          <div className="inline-flex items-center gap-1">
                            <input
                              key={`${p.id}_${p.profit_margin_pct}`}
                              type="number"
                              min="0"
                              max="300"
                              defaultValue={p.profit_margin_pct}
                              onBlur={(e) => {
                                const newMargin = Number(e.target.value) || 0;
                                const newPrice = Number((p.cost_price * (1 + newMargin / 100)).toFixed(2));
                                handleUpdateMargin(p.id, newPrice, newMargin);
                              }}
                              className="w-14 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-1 text-center font-bold text-xs"
                            />
                            <span className="text-[10px] text-slate-400">%</span>
                          </div>
                        </td>

                        <td className="px-4 py-3.5 text-right">
                          <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                            ${p.sale_price.toFixed(2)} USDT
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Lucro: +${profitAmount.toFixed(2)}
                          </div>
                        </td>

                        <td className="px-4 py-3.5 text-center">
                          <button
                            onClick={() => handleToggleProduct(p.id, p.is_active)}
                            className="cursor-pointer"
                          >
                            <Badge
                              variant={p.is_active ? "verified" : "secondary"}
                              className="text-[10px]"
                            >
                              {p.is_active ? "Ativo na Loja" : "Pausado"}
                            </Badge>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 2: Supplier Balances */}
      {activeTab === "suppliers" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {balances.map((b) => (
            <Card key={b.supplierCode} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 font-bold">
                  <Server className="h-4 w-4" />
                </div>
                <Badge variant={b.status === "connected" ? "verified" : "destructive"} className="text-[10px]">
                  {b.status === "connected" ? "Conectado" : "Erro"}
                </Badge>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {b.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {b.username ? `Usuário: ${b.username}` : `Código: ${b.supplierCode}`}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3 space-y-1">
                <div className="text-[11px] text-slate-500">Saldo Disponível para Pedidos:</div>
                <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                  ${b.balance.toFixed(2)} <span className="text-xs font-normal text-slate-400">{b.currency}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                * Para recarregar saldo, acesse o bot respectivo no Telegram e utilize o comando de depósito.
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 3: Digital Orders */}
      {activeTab === "orders" && (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Código / Data</th>
                  <th className="px-4 py-3 font-semibold">Produto</th>
                  <th className="px-4 py-3 font-semibold">Cliente</th>
                  <th className="px-4 py-3 font-semibold text-right">Valor</th>
                  <th className="px-4 py-3 font-semibold">Binance TxID</th>
                  <th className="px-4 py-3 font-semibold text-center">Status</th>
                  <th className="px-4 py-3 font-semibold">Item Entregue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Nenhum pedido de produto digital registrado ainda.
                    </td>
                  </tr>
                ) : (
                  orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3.5">
                        <div className="font-mono font-bold text-slate-900 dark:text-white">
                          {ord.order_code}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(ord.created_at).toLocaleString("pt-BR")}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 font-medium">
                        {ord.product_name}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {ord.customer_name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {ord.customer_email}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-right font-mono font-bold text-emerald-600">
                        ${ord.amount_usdt.toFixed(2)} USDT
                      </td>

                      <td className="px-4 py-3.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                        {ord.binance_tx_id || "Aguardando comprovante"}
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        <Badge
                          variant={
                            ord.status === "completed"
                              ? "verified"
                              : ord.status === "verifying"
                              ? "default"
                              : ord.status === "manual_review"
                              ? "warning"
                              : "secondary"
                          }
                          className="text-[10px]"
                        >
                          {ord.status === "completed"
                            ? "Entregue"
                            : ord.status === "manual_review"
                            ? "Revisão Manual"
                            : ord.status === "verifying"
                            ? "Verificando"
                            : "Pendente"}
                        </Badge>
                      </td>

                      <td className="px-4 py-3.5 font-mono text-[10px] text-slate-500 max-w-xs truncate">
                        {ord.delivered_item || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
