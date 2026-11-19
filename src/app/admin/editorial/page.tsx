import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getAllEditorialContentForAdmin } from "@/services/content";
import { formatDate } from "@/lib/utils";

export const revalidate = 0;

export default async function AdminEditorialPage() {
  const articles = await getAllEditorialContentForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Gestão Editorial & Artigos de IA
          </h1>
          <p className="text-sm text-slate-500">
            Revisão humana obrigatória de rascunhos produzidos pelo Agente 3 antes de publicação.
          </p>
        </div>

        <Link href="/admin/editorial/new">
          <Button className="gap-2 text-xs font-semibold">
            <Plus className="h-4 w-4" />
            <span>Criar Nova Pauta / Artigo</span>
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            Conteúdos e Traduções Cadastradas ({articles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Título / Slug</th>
                  <th className="py-3 px-3">Tipo</th>
                  <th className="py-3 px-3">Produto Alvo</th>
                  <th className="py-3 px-3">Traduções</th>
                  <th className="py-3 px-3">Última Atualização</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {articles.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-500">
                      Nenhum conteúdo cadastrado ainda. Clique em &quot;Criar Nova Pauta / Artigo&quot; acima.
                    </td>
                  </tr>
                ) : (
                  articles.map((art) => {
                    const primaryTr = art.translations?.[0];
                    return (
                      <tr key={art.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-slate-900 dark:text-slate-100">
                            {primaryTr?.title || art.slug}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400">
                            /blog/{art.slug}
                          </div>
                        </td>

                        <td className="py-3.5 px-3 font-medium capitalize text-slate-600 dark:text-slate-300">
                          {art.type.replace("_", " ")}
                        </td>

                        <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">
                          {art.primary_product?.name || "Geral"}
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="flex gap-1.5">
                            {art.translations?.map((tr) => (
                              <span
                                key={tr.id}
                                className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                                  tr.status === "published"
                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                    : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                }`}
                              >
                                {tr.locale} ({tr.status})
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="py-3.5 px-3 text-slate-500">
                          {formatDate(art.updated_at)}
                        </td>

                        <td className="py-3.5 px-3">
                          <Badge
                            variant={primaryTr?.status === "published" ? "verified" : "warning"}
                            className="text-[10px]"
                          >
                            {primaryTr?.status || "draft"}
                          </Badge>
                        </td>

                        <td className="py-3.5 px-3 text-right space-x-2">
                          <Link
                            href={`/pt-br/blog/${art.slug}`}
                            target="_blank"
                            className="text-blue-600 hover:underline font-medium"
                          >
                            Visualizar
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
