"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Category } from "@/types/database";

export default function NewSoftwarePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category_id: "",
    official_website: "",
    short_description_pt: "",
    short_description_en: "",
    free_plan_available: false,
    free_trial_days: "",
    rating_editorial: "4.8",
    source_name: "Página Oficial de Preços",
    source_url: "",
    plan_name: "Starter",
    plan_price: "20.00",
    plan_currency: "USD",
  });

  useEffect(() => {
    // Fetch active categories from API
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      })
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData((prev) => ({ ...prev, name, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/admin/software", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro ao salvar software");

      setStatusMessage("Software cadastrado com sucesso!");
      setTimeout(() => {
        router.push("/admin/software");
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
        <Link href="/admin/software">
          <Button size="sm" variant="outline" className="gap-1 text-xs">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Voltar para Lista</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Cadastrar Novo Software SaaS
          </h1>
          <p className="text-xs text-slate-500">
            Todas as ferramentas exigem categoria válida, fontes verificadas e dados estruturados.
          </p>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl border border-blue-200 bg-blue-50 text-blue-900 text-xs font-semibold">
          {statusMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identificação Geral */}
        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            1. Identificação Básica
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Nome do Software *
              </label>
              <Input
                required
                placeholder="ex: Linear App"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Slug da URL (Identificador Único) *
              </label>
              <Input
                required
                placeholder="linear-app"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Categoria Principal *
              </label>
              <select
                required
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="">Selecione uma categoria...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name_pt}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Site Oficial do Fornecedor *
              </label>
              <Input
                required
                type="url"
                placeholder="https://linear.app"
                value={formData.official_website}
                onChange={(e) => setFormData({ ...formData, official_website: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Descrição Curta (Português) *
            </label>
            <textarea
              required
              rows={2}
              placeholder="Síntese da proposta de valor em 1 a 2 frases..."
              value={formData.short_description_pt}
              onChange={(e) => setFormData({ ...formData, short_description_pt: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Descrição Curta (Inglês) *
            </label>
            <textarea
              required
              rows={2}
              placeholder="Short value proposition in English..."
              value={formData.short_description_en}
              onChange={(e) => setFormData({ ...formData, short_description_en: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </Card>

        {/* Planos e Auditoria de Preço */}
        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            2. Modelo de Cobrança & Verificação de Fontes
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="free_plan"
                checked={formData.free_plan_available}
                onChange={(e) => setFormData({ ...formData, free_plan_available: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="free_plan" className="text-xs font-medium text-slate-800 dark:text-slate-200">
                Possui Plano Gratuito Vitalício
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Dias de Teste Gratuito
              </label>
              <Input
                type="number"
                placeholder="ex: 14"
                value={formData.free_trial_days}
                onChange={(e) => setFormData({ ...formData, free_trial_days: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Nota Editorial (1.0 a 5.0)
              </label>
              <Input
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                value={formData.rating_editorial}
                onChange={(e) => setFormData({ ...formData, rating_editorial: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Fonte Oficial dos Preços *
              </label>
              <Input
                required
                type="url"
                placeholder="https://linear.app/pricing"
                value={formData.source_url}
                onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Preço Base Inicial ($) *
              </label>
              <Input
                required
                placeholder="ex: 12.00"
                value={formData.plan_price}
                onChange={(e) => setFormData({ ...formData, plan_price: e.target.value })}
              />
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Link href="/admin/software">
            <Button variant="ghost" size="md">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={loading} size="md" className="gap-2 font-semibold">
            <Save className="h-4 w-4" />
            <span>{loading ? "Salvando..." : "Salvar e Publicar Software"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
