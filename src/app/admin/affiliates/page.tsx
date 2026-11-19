import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function AdminAffiliatesPage() {
  const networks = [
    { name: "PartnerStack", url: "https://partnerstack.com", status: "Conectado", programsCount: 6, focus: "SaaS Recorrente" },
    { name: "Impact", url: "https://impact.com", status: "Conectado", programsCount: 4, focus: "Enterprise & Vendas" },
    { name: "ShareASale", url: "https://shareasale.com", status: "Conectado", programsCount: 3, focus: "Utilidades & No-Code" },
    { name: "CJ Affiliate", url: "https://cj.com", status: "Conectado", programsCount: 2, focus: "Grandes Provedores" },
  ];

  const programs = [
    {
      name: "HubSpot Affiliate Program",
      network: "Impact",
      product: "HubSpot CRM",
      commissionRate: "30% recorrente (até 1 ano)",
      cookieDays: 90,
      payoutMethod: "Transferência Bancária / PayPal",
      minPayout: "USD 100",
      status: "Aprovado",
      destinationUrl: "https://hubspot.sjv.io/c/sample-tag",
      internalSlug: "hubspot",
    },
    {
      name: "Notion Community & Partner",
      network: "PartnerStack",
      product: "Notion",
      commissionRate: "50% nos primeiros 12 meses",
      cookieDays: 90,
      payoutMethod: "Stripe / PayPal",
      minPayout: "USD 50",
      status: "Aprovado",
      destinationUrl: "https://affiliate.notion.so/sample-ref",
      internalSlug: "notion",
    },
    {
      name: "ActiveCampaign Partner Program",
      network: "PartnerStack",
      product: "ActiveCampaign",
      commissionRate: "20% a 30% recorrente vitalício",
      cookieDays: 90,
      payoutMethod: "PayPal",
      minPayout: "USD 100",
      status: "Aprovado",
      destinationUrl: "https://activecampaign.com/?_r=sample-code",
      internalSlug: "activecampaign",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Gestão de Redes & Programas de Afiliados
          </h1>
          <p className="text-sm text-slate-500">
            Controle de contratos oficiais, janelas de atribuição de cookies e taxas de comissão.
          </p>
        </div>

        <Button className="gap-2 text-xs font-semibold">
          <Plus className="h-4 w-4" />
          <span>Adicionar Programa de Afiliado</span>
        </Button>
      </div>

      {/* Networks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {networks.map((net) => (
          <Card key={net.name} className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">{net.name}</span>
              <Badge variant="verified" className="text-[10px]">{net.status}</Badge>
            </div>
            <div className="text-xs text-slate-500">{net.focus}</div>
            <div className="text-[11px] font-semibold text-blue-600">{net.programsCount} programas vinculados</div>
          </Card>
        ))}
      </div>

      {/* Programs List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            Programas e Links Ativos ({programs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Programa / Rede</th>
                  <th className="py-3 px-3">Comissão Acordada</th>
                  <th className="py-3 px-3">Cookie</th>
                  <th className="py-3 px-3">Saque Mínimo</th>
                  <th className="py-3 px-3">Redirecionamento /go/</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {programs.map((p) => (
                  <tr key={p.name} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{p.name}</div>
                      <div className="text-[11px] text-slate-500">Rede: {p.network}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-emerald-600 dark:text-emerald-400">
                      {p.commissionRate}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {p.cookieDays} dias
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {p.minPayout}
                    </td>
                    <td className="py-3 px-3">
                      <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-blue-700 dark:bg-slate-800 dark:text-blue-300 text-[11px]">
                        /go/{p.internalSlug}
                      </code>
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="verified" className="text-[10px]">
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button className="text-blue-600 hover:underline font-medium">Detalhes</button>
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
