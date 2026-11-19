import React from "react";
import Link from "next/link";
import { Plus, ExternalLink, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getProducts } from "@/services/catalog";
import { formatDate } from "@/lib/utils";

export const revalidate = 0; // Fresh dynamic data on every request

export default async function AdminSoftwarePage() {
  const products = await getProducts({ publishedOnly: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Gestão de Softwares & Planos
          </h1>
          <p className="text-sm text-slate-500">
            Catálogo auditado com fontes oficiais e links de parceiros monitorados em tempo real.
          </p>
        </div>

        <Link href="/admin/software/new">
          <Button className="gap-2 text-xs font-semibold">
            <Plus className="h-4 w-4" />
            <span>Cadastrar Novo Software</span>
          </Button>
        </Link>
      </div>

      {/* Catalog Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <CardTitle className="text-sm font-semibold">
            Softwares no Banco de Dados ({products.length})
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Software</th>
                  <th className="py-3 px-3">Categoria</th>
                  <th className="py-3 px-3">Preço Verificado</th>
                  <th className="py-3 px-3">Link Ativo</th>
                  <th className="py-3 px-3">Última Checagem</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-500">
                      Nenhum software cadastrado ainda. Clique em &quot;Cadastrar Novo Software&quot; acima.
                    </td>
                  </tr>
                ) : (
                  products.map((soft) => {
                    const lowestPrice = soft.prices?.[0];
                    const priceDisplay = lowestPrice
                      ? lowestPrice.price === 0
                        ? "Grátis / A partir de $" + (soft.prices?.[1]?.price || 0)
                        : `$${lowestPrice.price} / mês`
                      : "Sob Consulta";

                    return (
                      <tr key={soft.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-slate-900 dark:text-slate-100">
                            {soft.name}
                          </div>
                          <a
                            href={soft.official_website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                          >
                            {soft.official_website} <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        </td>

                        <td className="py-3.5 px-3 font-medium text-slate-600 dark:text-slate-300">
                          {soft.category?.name_pt || "Sem Categoria"}
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            {priceDisplay}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {soft.free_plan_available ? "Plano grátis vitalício" : "Apenas teste"}
                          </span>
                        </td>

                        <td className="py-3.5 px-3">
                          {soft.affiliate_link ? (
                            <Link
                              href={`/go/${soft.affiliate_link.internal_slug}`}
                              target="_blank"
                              className="font-mono text-blue-700 dark:text-blue-300 hover:underline"
                            >
                              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] dark:bg-slate-800">
                                /go/{soft.affiliate_link.internal_slug}
                              </code>
                            </Link>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Sem link ativo</span>
                          )}
                        </td>

                        <td className="py-3.5 px-3 text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            <span>{formatDate(soft.last_verified_at)}</span>
                          </div>
                          <div className="text-[10px] text-emerald-600 font-medium">
                            Auditado
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <Badge variant={soft.is_published ? "verified" : "secondary"} className="text-[10px]">
                            {soft.is_published ? "Publicado" : "Rascunho"}
                          </Badge>
                        </td>

                        <td className="py-3.5 px-3 text-right space-x-2">
                          <Link href={`/pt-br/software/${soft.slug}`} target="_blank" className="text-blue-600 hover:underline font-medium">
                            Ver Página
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
