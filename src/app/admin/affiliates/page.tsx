import React from "react";
import Link from "next/link";
import { Plus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getAffiliateNetworks, getAffiliatePrograms } from "@/services/affiliate";

export const revalidate = 0; // Fresh dynamic data

export default async function AdminAffiliatesPage() {
  const [networks, programs] = await Promise.all([
    getAffiliateNetworks(),
    getAffiliatePrograms(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Gestão de Redes & Programas de Afiliados
          </h1>
          <p className="text-sm text-slate-500">
            Controle de contratos oficiais, janelas de cookies e links de redirecionamento monitorados.
          </p>
        </div>

        <Link href="/admin/affiliates/new">
          <Button className="gap-2 text-xs font-semibold">
            <Plus className="h-4 w-4" />
            <span>Adicionar Programa de Afiliado</span>
          </Button>
        </Link>
      </div>

      {/* Networks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {networks.map((net) => (
          <Card key={net.name} className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">{net.name}</span>
              <Badge variant="verified" className="text-[10px]">
                {net.is_active ? "Conectado" : "Inativo"}
              </Badge>
            </div>
            <div className="text-xs text-slate-500 line-clamp-1">{net.notes || "Rede Parceira"}</div>
            {net.portal_url && (
              <a
                href={net.portal_url}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                Painel da Rede <ExternalLink className="h-2.5 w-2.5" />
              </a>
            )}
          </Card>
        ))}
      </div>

      {/* Programs List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            Programas e Links Ativos no Banco de Dados ({programs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Programa / Software</th>
                  <th className="py-3 px-3">Rede</th>
                  <th className="py-3 px-3">Comissão Acordada</th>
                  <th className="py-3 px-3">Cookie</th>
                  <th className="py-3 px-3">Saque Mínimo</th>
                  <th className="py-3 px-3">Redirecionador /go/</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {programs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-500">
                      Nenhum programa cadastrado ainda. Clique em &quot;Adicionar Programa de Afiliado&quot;.
                    </td>
                  </tr>
                ) : (
                  programs.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{p.name}</div>
                        <div className="text-[11px] text-slate-500">
                          Produto: {p.product?.name || "Geral"}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-600 dark:text-slate-300">
                        {p.network?.name || "Direto"}
                      </td>
                      <td className="py-3 px-3 font-semibold text-emerald-600 dark:text-emerald-400">
                        {p.commission_rate}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                        {p.cookie_duration_days} dias
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                        {p.min_payout ? `$${p.min_payout}` : "N/A"}
                      </td>
                      <td className="py-3 px-3">
                        {p.link ? (
                          <Link
                            href={`/go/${p.link.internal_slug}`}
                            target="_blank"
                            className="font-mono text-blue-700 dark:text-blue-300 hover:underline"
                          >
                            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] dark:bg-slate-800">
                              /go/{p.link.internal_slug}
                            </code>
                          </Link>
                        ) : (
                          <span className="text-slate-400">Sem link ativo</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="verified" className="text-[10px]">
                          {p.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
