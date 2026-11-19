"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Category, Product } from "@/types/database";

export default function NewEditorialArticlePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    slug: "",
    type: "guide",
    primary_product_id: "",
    target_category_id: "",
    locale: "pt-br",
    title: "",
    meta_title: "",
    meta_description: "",
    content_markdown: "",
    status: "published",
  });

  useEffect(() => {
    fetch("/api/admin/affiliates/options")
      .then((r) => r.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
      })
      .catch((err) => console.error("Error loading products:", err));

    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      })
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || slug,
      meta_title: prev.meta_title || `${title} | STACKWISE`,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/admin/editorial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro ao salvar artigo");

      setStatusMessage("Artigo editorial salvo com sucesso!");
      setTimeout(() => {
        router.push("/admin/editorial");
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
        <Link href="/admin/editorial">
          <Button size="sm" variant="outline" className="gap-1 text-xs">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Voltar para Artigos</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Criar Artigo Editorial / Pauta de SEO
          </h1>
          <p className="text-xs text-slate-500">
            Estruture o conteúdo, defina metadados dinâmicos e controle o status de publicação.
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
            1. Metadados Estruturais
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Título Principal do Artigo *
            </label>
            <Input
              required
              placeholder="ex: Como Escolher o Melhor CRM em 2026: Guia Completo"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Slug da URL (/blog/...) *
              </label>
              <Input
                required
                placeholder="como-escolher-melhor-crm"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Tipo de Conteúdo *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="guide">Guia Aprofundado</option>
                <option value="comparison">Comparativo Técnico</option>
                <option value="software_review">Análise Individual</option>
                <option value="alternatives">Página de Alternativas</option>
                <option value="listicle">Lista / Ranking</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Idioma da Tradução *
              </label>
              <select
                required
                value={formData.locale}
                onChange={(e) => setFormData({ ...formData, locale: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="pt-br">Português (pt-br)</option>
                <option value="en">Inglês (en)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Produto em Destaque
              </label>
              <select
                value={formData.primary_product_id}
                onChange={(e) => setFormData({ ...formData, primary_product_id: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="">Nenhum (Artigo Geral)</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Categoria Alvo
              </label>
              <select
                value={formData.target_category_id}
                onChange={(e) => setFormData({ ...formData, target_category_id: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="">Selecione...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name_pt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* SEO Metadados */}
        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            2. SEO Técnico & Snippets
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Meta Title (Para o Google - máx 60 caracteres) *
            </label>
            <Input
              required
              value={formData.meta_title}
              onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Meta Description (Para o Google - máx 155 caracteres) *
            </label>
            <textarea
              required
              rows={2}
              value={formData.meta_description}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </Card>

        {/* Corpo do Artigo Markdown */}
        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            3. Conteúdo em Markdown
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Texto Completo (Suporta subtítulos ##, listas - e links) *
            </label>
            <textarea
              required
              rows={12}
              placeholder="## Introdução&#10;&#10;Escreva o artigo estruturado aqui com dados factuais e análise técnica..."
              value={formData.content_markdown}
              onChange={(e) => setFormData({ ...formData, content_markdown: e.target.value })}
              className="w-full font-mono rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Status de Publicação:
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="draft">Rascunho (Draft)</option>
              <option value="in_review">Em Revisão (In Review)</option>
              <option value="published">Publicado Imediatamente</option>
            </select>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Link href="/admin/editorial">
            <Button variant="ghost" size="md">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={loading} size="md" className="gap-2 font-semibold">
            <Save className="h-4 w-4" />
            <span>{loading ? "Salvando..." : "Salvar Artigo"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
