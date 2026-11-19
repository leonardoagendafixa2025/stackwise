import React from "react";
import { Plus, ExternalLink, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function AdminSoftwarePage() {
  const softwares = [
    {
      id: "soft-1",
      name: "HubSpot CRM",
      slug: "hubspot",
      category: "CRM & Vendas",
      officialWebsite: "https://hubspot.com",
      freePlan: true,
      editorialRating: 4.8,
      verifiedPrice: "Grátis / A partir de $20/mês",
      lastVerifiedAt: "18/11/2026",
      verifiedBy: "Auditor STACKWISE",
      isPublished: true,
      affiliateStatus: "Ativo (/go/hubspot)",
    },
    {
      id: "soft-2",
      name: "Notion",
      slug: "notion",
      category: "Produtividade",
      officialWebsite: "https://notion.so",
      freePlan: true,
      editorialRating: 4.9,
      verifiedPrice: "Grátis / $10/mês",
      lastVerifiedAt: "17/11/2026",
      verifiedBy: "Auditor STACKWISE",
      isPublished: true,
      affiliateStatus: "Ativo (/go/notion)",
    },
    {
      id: "soft-3",
      name: "ActiveCampaign",
      slug: "activecampaign",
      category: "E-mail Marketing",
      officialWebsite: "https://activecampaign.com",
      freePlan: false,
      editorialRating: 4.7,
      verifiedPrice: "A partir de $19/mês",
      lastVerifiedAt: "16/11/2026",
      verifiedBy: "Auditor STACKWISE",
      isPublished: true,
      affiliateStatus: "Ativo (/go/activecampaign)",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Gestão de Softwares & Planos
          </h1>
          <p className="text-sm text-slate-500">
            Catálogo auditado com fontes oficiais e links de parceiros monitorados.
          </p>
        </div>

        <Button className="gap-2 text-xs font-semibold">
          <Plus className="h-4 w-4" />
          <span>Cadastrar Novo Software</span>
        </Button>
      </div>

      {/* Catalog Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <CardTitle className="text-sm font-semibold">
            Softwares Cadastrados ({softwares.length})
          </CardTitle>
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Filtrar por nome ou categoria..."
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-800 dark:bg-slate-900"
            />
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Software</th>
                  <th className="py-3 px-3">Categoria</th>
                  <th className="py-3 px-3">Preço Verificado</th>
                  <th className="py-3 px-3">Link Afiliado</th>
                  <th className="py-3 px-3">Última Checagem</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {softwares.map((soft) => (
                  <tr key={soft.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {soft.name}
                      </div>
                      <a
                        href={soft.officialWebsite}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                      >
                        {soft.officialWebsite} <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </td>

                    <td className="py-3.5 px-3 font-medium text-slate-600 dark:text-slate-300">
                      {soft.category}
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {soft.verifiedPrice}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {soft.freePlan ? "Plano grátis vitalício" : "Sem plano grátis"}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-mono text-blue-700 dark:bg-slate-800 dark:text-blue-300">
                        {soft.affiliateStatus}
                      </code>
                    </td>

                    <td className="py-3.5 px-3 text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        <span>{soft.lastVerifiedAt}</span>
                      </div>
                      <div className="text-[10px] text-emerald-600 font-medium">
                        {soft.verifiedBy}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <Badge variant="verified" className="text-[10px]">
                        Publicado
                      </Badge>
                    </td>

                    <td className="py-3.5 px-3 text-right space-x-2">
                      <button className="text-blue-600 hover:underline font-medium">
                        Editar
                      </button>
                      <button className="text-slate-400 hover:text-slate-600 font-medium">
                        Auditar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
