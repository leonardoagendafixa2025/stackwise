"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { AffiliateNetwork, Product } from "@/types/database";

export default function NewAffiliateProgramPage() {
  const router = useRouter();
  const [networks, setNetworks] = useState<AffiliateNetwork[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    network_id: "",
    product_id: "",
    official_terms_url: "",
    commission_rate: "30% recorrente",
    commission_type: "percentage",
    is_recurring: true,
    cookie_duration_days: "90",
    payout_method: "PayPal / Transferência",
    min_payout: "50",
    internal_slug: "",
    destination_url: "",
  });

  useEffect(() => {
    // Load networks and products for dropdowns
    fetch("/api/admin/affiliates/options")
      .then((r) => r.json())
      .then((data) => {
        if (data.networks) setNetworks(data.networks);
        if (data.products) setProducts(data.products);
      })
      .catch((err) => console.error("Error loading options:", err));
  }, []);

  const handleProductSelect = (productId: string) => {
    const selected = products.find((p) => p.id === productId);
    setFormData((prev) => ({
      ...prev,
      product_id: productId,
      name: selected ? `Programa de Afiliados Oficial ${selected.name}` : prev.name,
      internal_slug: selected ? selected.slug : prev.internal_slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/admin/affiliates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro ao salvar programa");

      setStatusMessage("Programa e link de afiliado criados com sucesso!");
      setTimeout(() => {
        router.push("/admin/affiliates");
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setStatusMessage(`Erro: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <Link href="/admin/affiliates">
          <Button size="sm" variant="outline" className="gap-1 text-xs">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Voltar para Programas</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Adicionar Programa de Afiliados & Link /go/
          </h1>
          <p className="text-xs text-slate-500">
            Cadastre as condições contratuais oficiais e configure o slug de redirecionamento interno.
          </p>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl border border-blue-200 bg-blue-50 text-blue-900 text-xs font-semibold">
          {statusMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            1. Vinculação & Rede de Afiliados
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Software Vinculado *
              </label>
              <select
                required
                value={formData.product_id}
                onChange={(e) => handleProductSelect(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="">Selecione o software...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Rede de Afiliados *
              </label>
              <select
                required
                value={formData.network_id}
                onChange={(e) => setFormData({ ...formData, network_id: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="">Selecione a rede parceira...</option>
                {networks.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Nome do Programa Oficial *
            </label>
            <Input
              required
              placeholder="ex: HubSpot Affiliate Program"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              URL Oficial dos Termos do Programa *
            </label>
            <Input
              required
              type="url"
              placeholder="https://hubspot.com/partners/affiliates"
              value={formData.official_terms_url}
              onChange={(e) => setFormData({ ...formData, official_terms_url: e.target.value })}
            />
          </div>
        </Card>

        {/* Condições Comerciais */}
        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            2. Condições Comerciais & Atribuição
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Comissão Acordada *
              </label>
              <Input
                required
                placeholder="ex: 30% recorrente no 1º ano"
                value={formData.commission_rate}
                onChange={(e) => setFormData({ ...formData, commission_rate: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Duração do Cookie (Dias) *
              </label>
              <Input
                required
                type="number"
                placeholder="90"
                value={formData.cookie_duration_days}
                onChange={(e) => setFormData({ ...formData, cookie_duration_days: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Saque Mínimo ($)
              </label>
              <Input
                type="number"
                placeholder="50"
                value={formData.min_payout}
                onChange={(e) => setFormData({ ...formData, min_payout: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="recurring"
              checked={formData.is_recurring}
              onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="recurring" className="text-xs font-medium text-slate-800 dark:text-slate-200">
              Comissão Recorrente (Gera receita mensal sobre a assinatura do cliente)
            </label>
          </div>
        </Card>

        {/* Link de Rastreamento /go/ */}
        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            3. Link Interno de Redirecionamento
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Slug Interno (/go/...) *
              </label>
              <div className="flex items-center rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900">
                <span>/go/</span>
                <input
                  required
                  placeholder="nome-do-software"
                  value={formData.internal_slug}
                  onChange={(e) => setFormData({ ...formData, internal_slug: e.target.value })}
                  className="w-full bg-transparent pl-1 font-semibold text-slate-900 focus:outline-none dark:text-slate-100"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                URL de Afiliado de Destino *
              </label>
              <Input
                required
                type="url"
                placeholder="https://hubspot.sjv.io/c/your-tag"
                value={formData.destination_url}
                onChange={(e) => setFormData({ ...formData, destination_url: e.target.value })}
              />
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Link href="/admin/affiliates">
            <Button variant="ghost" size="md">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={loading} size="md" className="gap-2 font-semibold">
            <Save className="h-4 w-4" />
            <span>{loading ? "Salvando..." : "Salvar Programa e Ativar Link"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
