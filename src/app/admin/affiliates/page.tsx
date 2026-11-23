"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  ExternalLink,
  Edit2,
  Trash2,
  RotateCw,
  Check,
  Copy,
  Link2,
  CheckCircle2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

interface AffiliateNetwork {
  id: string;
  name: string;
  portal_url: string | null;
  notes: string | null;
  is_active: boolean;
}

interface CategoryItem {
  id: string;
  name_pt: string;
  slug: string;
}

interface AffiliateProgramItem {
  id: string;
  name: string;
  commission_rate: string;
  cookie_duration_days: number;
  min_payout: number | null;
  payout_method: string | null;
  status: string;
  network?: AffiliateNetwork;
  product?: {
    id: string;
    name: string;
    slug: string;
  };
  link?: {
    id: string;
    internal_slug: string;
    destination_url: string;
  } | null;
}

export default function AdminAffiliatesPage() {
  const [programs, setPrograms] = useState<AffiliateProgramItem[]>([]);
  const [networks, setNetworks] = useState<AffiliateNetwork[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State for New Link
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Edit Modal State
  const [editingProgram, setEditingProgram] = useState<AffiliateProgramItem | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [editCommission, setEditCommission] = useState("");
  const [updating, setUpdating] = useState(false);

  // Form State for New Link
  const [newForm, setNewForm] = useState({
    name: "",
    destination_url: "",
    network_id: "",
    category_id: "",
    commission_rate: "50%",
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/affiliates");
      const data = await res.json();
      if (res.ok) {
        setPrograms(data.programs || []);
        setNetworks(data.networks || []);
        setCategories(data.categories || []);
        setNewForm((prev) => ({
          ...prev,
          network_id: prev.network_id || (data.networks?.[0]?.id ?? ""),
          category_id: prev.category_id || (data.categories?.[0]?.id ?? ""),
        }));
      }
    } catch (err) {
      console.error("Erro ao carregar programas de afiliados:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.name.trim() || !newForm.destination_url.trim()) {
      alert("Por favor, preencha o Nome da Ferramenta e o seu Link de Afiliado.");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/admin/affiliates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha ao cadastrar link");

      alert(`Link de afiliado para "${newForm.name}" cadastrado com sucesso!`);
      setShowModal(false);
      setNewForm({
        name: "",
        destination_url: "",
        network_id: networks[0]?.id || "",
        category_id: categories[0]?.id || "",
        commission_rate: "50%",
      });
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleOpenEdit = (program: AffiliateProgramItem) => {
    setEditingProgram(program);
    setEditUrl(program.link?.destination_url || "");
    setEditCommission(program.commission_rate || "");
  };

  const handleSaveEdit = async () => {
    if (!editingProgram) return;
    try {
      setUpdating(true);
      const res = await fetch("/api/admin/affiliates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          program_id: editingProgram.id,
          link_id: editingProgram.link?.id,
          destination_url: editUrl,
          commission_rate: editCommission,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha ao atualizar link");

      setEditingProgram(null);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      alert(msg);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteProgram = async (programId: string, name: string) => {
    if (!window.confirm(`Tem certeza que deseja REMOVER o programa e link de "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/affiliates?id=${programId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Falha ao remover");
      }

      setPrograms((prev) => prev.filter((p) => p.id !== programId));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao remover";
      alert(msg);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Gestão de Links & Programas de Afiliados
            </h1>
            <Badge variant="verified" className="text-xs">
              100% Pessoa Física (CPF)
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cadastre os seus links de afiliado (Kiwify, Hotmart, Hostinger, etc.). O sistema cria o redirecionador /go/ e rastreia seus cliques automaticamente.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="gap-1.5 text-xs font-semibold"
          >
            <RotateCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Atualizar</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setShowModal(true)}
            className="gap-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>+ Cadastrar Novo Link de Afiliado</span>
          </Button>
        </div>
      </div>

      {/* Networks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {networks.map((net) => (
          <Card key={net.name} className={`p-4 space-y-2 ${net.is_active ? "border-emerald-200/80 bg-emerald-50/20 dark:border-emerald-900/40" : "opacity-60 bg-slate-50 dark:bg-slate-900/20"}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">{net.name}</span>
              <Badge variant={net.is_active ? "verified" : "secondary"} className="text-[10px]">
                {net.is_active ? "Ativa (CPF)" : "Desativada"}
              </Badge>
            </div>
            <div className="text-[11px] text-slate-500 line-clamp-2">{net.notes || "Rede Parceira"}</div>
            {net.portal_url && (
              <a
                href={net.portal_url}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1 pt-1"
              >
                Abrir Plataforma <ExternalLink className="h-2.5 w-2.5" />
              </a>
            )}
          </Card>
        ))}
      </div>

      {/* Programs List */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-sm font-bold flex items-center justify-between">
            <span>Seus Softwares e Links de Afiliado ({programs.length})</span>
            <span className="text-xs font-normal text-slate-400">Rastreamento Atômico /go/*</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
              <RotateCw className="h-5 w-5 animate-spin text-blue-600" />
              <span>Carregando programas de afiliados...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800 font-semibold uppercase tracking-wider bg-slate-50 dark:bg-slate-900/50">
                  <tr>
                    <th className="py-3 px-4">Software / Produto</th>
                    <th className="py-3 px-3">Rede</th>
                    <th className="py-3 px-3">Comissão</th>
                    <th className="py-3 px-3">Redirecionador /go/</th>
                    <th className="py-3 px-4">Seu Link de Afiliado (Destino)</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {programs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Nenhum link cadastrado ainda. Clique no botão acima para adicionar seu primeiro link!
                      </td>
                    </tr>
                  ) : (
                    programs.map((p) => {
                      const isCustomAffiliate = p.link?.destination_url && !p.link.destination_url.includes("placeholder") && (p.link.destination_url.includes("kiwify") || p.link.destination_url.includes("hotmart") || p.link.destination_url.includes("afid") || p.link.destination_url.includes("ref="));

                      return (
                        <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                              <span>{p.name.replace(/^Programa\s+Oficial\s+|^Programa\s+|^Parceria\s+Oficial\s+/i, "")}</span>
                              {isCustomAffiliate && (
                                <Badge variant="verified" className="text-[9px] py-0 px-1.5">
                                  Seu Link Ativo
                                </Badge>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Produto: {p.product?.name || "Geral"}
                            </div>
                          </td>
                          <td className="py-3.5 px-3 font-medium text-slate-600 dark:text-slate-300">
                            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px]">
                              {p.network?.name?.replace(/\s*\(.*\)/, "") || "Direto"}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-semibold text-emerald-600 dark:text-emerald-400">
                            {p.commission_rate}
                          </td>
                          <td className="py-3.5 px-3">
                            {p.link ? (
                              <Link
                                href={`/go/${p.link.internal_slug}`}
                                target="_blank"
                                className="font-mono text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                              >
                                <code className="rounded bg-blue-50 text-blue-700 px-1.5 py-0.5 text-[11px] dark:bg-blue-950/60 dark:text-blue-300">
                                  /go/{p.link.internal_slug}
                                </code>
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            ) : (
                              <span className="text-slate-400">Sem link ativo</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 max-w-xs">
                            {p.link?.destination_url ? (
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[11px] text-slate-500 truncate block max-w-[200px]" title={p.link.destination_url}>
                                  {p.link.destination_url}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(p.link!.destination_url, p.id)}
                                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                  title="Copiar URL de destino"
                                >
                                  {copiedId === p.id ? (
                                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                  )}
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[11px]">Não configurado</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenEdit(p)}
                                className="text-xs gap-1 h-7 px-2 text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-900/60 dark:text-blue-400"
                                title="Editar link de afiliado"
                              >
                                <Edit2 className="h-3 w-3" />
                                <span>Editar</span>
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteProgram(p.id, p.name)}
                                className="text-xs h-7 px-2 text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-400"
                                title="Remover programa"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal: Cadastrar Novo Link */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                  <Link2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Cadastrar Link de Afiliado
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Insira o produto da Kiwify, Hotmart ou outra rede para ativar o /go/
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLink} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Nome da Ferramenta / Produto *
                </label>
                <Input
                  required
                  placeholder="Ex: LIA Automação, Typebot, Hostinger"
                  value={newForm.name}
                  onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <span>Seu Link de Afiliado (URL de Destino) *</span>
                </label>
                <Input
                  required
                  type="url"
                  placeholder="Ex: https://kiwify.app/... ou https://go.hotmart.com/..."
                  value={newForm.destination_url}
                  onChange={(e) => setNewForm({ ...newForm, destination_url: e.target.value })}
                  className="mt-1 border-emerald-300 focus:ring-emerald-500 dark:border-emerald-700 font-mono text-xs"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  É para este link que o visitante será redirecionado quando clicar no seu site.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Plataforma / Rede
                  </label>
                  <select
                    value={newForm.network_id}
                    onChange={(e) => setNewForm({ ...newForm, network_id: e.target.value })}
                    className="w-full mt-1 rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {networks.map((net) => (
                      <option key={net.id} value={net.id}>
                        {net.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Categoria no Site
                  </label>
                  <select
                    value={newForm.category_id}
                    onChange={(e) => setNewForm({ ...newForm, category_id: e.target.value })}
                    className="w-full mt-1 rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name_pt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Comissão Estimada
                </label>
                <Input
                  placeholder="Ex: 50% por venda, 30% recorrente"
                  value={newForm.commission_rate}
                  onChange={(e) => setNewForm({ ...newForm, commission_rate: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{saving ? "Salvando..." : "Salvar e Ativar Link"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Editar Link Existente */}
      {editingProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Editar Link de {editingProgram.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingProgram(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  Seu Link de Afiliado (URL de Destino) *
                </label>
                <Input
                  required
                  type="url"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  placeholder="https://..."
                  className="mt-1 font-mono text-xs border-emerald-300"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Comissão Cadastrada
                </label>
                <Input
                  value={editCommission}
                  onChange={(e) => setEditCommission(e.target.value)}
                  placeholder="Ex: 50%"
                  className="mt-1"
                />
              </div>

              {editingProgram.link && (
                <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                  Redirecionador interno ativo: <code className="font-bold text-blue-600">/go/{editingProgram.link.internal_slug}</code>
                </div>
              )}
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditingProgram(null)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={updating}
                onClick={handleSaveEdit}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                {updating ? "Salvando..." : "Atualizar Link"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
