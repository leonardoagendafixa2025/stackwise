import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Search,
  Globe,
  TrendingUp,
  CheckCircle2,
  FileCode,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

export const revalidate = 0;

export default function AdminSeoPage() {
  const keywords = [
    {
      term: "melhor crm para pequenas empresas",
      volume: "8.100/mês",
      difficulty: "Média (42)",
      targetUrl: "/pt-br/categories/crm",
      position: "#3",
      trend: "+2 posições",
    },
    {
      term: "hubspot vs activecampaign comparativo",
      volume: "3.400/mês",
      difficulty: "Baixa (28)",
      targetUrl: "/pt-br/compare?p1=hubspot&p2=activecampaign",
      position: "#1",
      trend: "Estável",
    },
    {
      term: "ferramentas de automacao no code",
      volume: "4.900/mês",
      difficulty: "Média (39)",
      targetUrl: "/pt-br/categories/automacao",
      position: "#4",
      trend: "+1 posição",
    },
    {
      term: "notion precos e planos brasil",
      volume: "5.200/mês",
      difficulty: "Baixa (21)",
      targetUrl: "/pt-br/software/notion",
      position: "#2",
      trend: "+3 posições",
    },
    {
      term: "comprar creditos chatgpt plus binance",
      volume: "2.100/mês",
      difficulty: "Muito Baixa (14)",
      targetUrl: "/pt-br/store",
      position: "#1",
      trend: "+4 posições",
    },
  ];

  const auditChecks = [
    { title: "Sitemap XML Dinâmico", status: "pass", detail: "Indexando /sitemap.xml com suporte multilíngue (pt-br e en)" },
    { title: "Robots.txt Otimizado", status: "pass", detail: "Permite indexação de rotas públicas e bloqueia /admin e /api" },
    { title: "Tags Canônicas & Hreflang", status: "pass", detail: "Configuradas automaticamente por locale" },
    { title: "Metadados OpenGraph & Twitter Cards", status: "pass", detail: "Títulos e descrições dinâmicos em todas as páginas de software" },
    { title: "Schema.org / JSON-LD Estruturado", status: "pass", detail: "Marcação de SoftwareApplication e Review ativa" },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Page Title & Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              SEO & Oportunidades Orgânicas
            </h1>
            <Badge variant="verified" className="text-xs">
              Agente 2 (SEO & Keywords)
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Monitoramento de palavras-chave com alta intenção comercial, saúde de indexação técnica e posicionamento nos buscadores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/sitemap.xml" target="_blank">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
              <FileCode className="h-3.5 w-3.5 text-slate-500" />
              <span>Ver Sitemap.xml</span>
            </Button>
          </Link>
          <Link href="/robots.txt" target="_blank">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
              <Globe className="h-3.5 w-3.5 text-slate-500" />
              <span>Ver Robots.txt</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* SEO Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Score Técnico</span>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2">98 / 100</div>
          <div className="text-[11px] text-slate-400 mt-1">Core Web Vitals & Metatags</div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Keywords no Top 3</span>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">18</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">+5 neste mês</div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Páginas Indexáveis</span>
            <Globe className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">56</div>
          <div className="text-[11px] text-slate-400 mt-1">Multi-idioma (PT / EN)</div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>CTR Orgânico Médio</span>
            <Search className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">8.4%</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Tráfego qualificado</div>
        </Card>
      </div>

      {/* Google SERP Preview Simulation */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-600" />
              <span>Simulação de Snippet no Google SERP</span>
            </span>
            <span className="text-xs font-normal text-slate-400">Desktop / Mobile Google Search Preview</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 max-w-2xl font-sans space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white font-bold">
                S
              </div>
              <span>https://stackwise.io › pt-br › compare</span>
            </div>
            <div className="text-lg font-medium text-blue-700 dark:text-blue-400 hover:underline cursor-pointer">
              HubSpot vs ActiveCampaign: Comparativo Completo de Preços e Recursos
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Descubra qual software oferece o melhor custo-benefício para automação de marketing e vendas. Dados auditados, limites de disparos e planos gratuitos verificados em 2026.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Keywords Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>Palavras-Chave de Alta Conversão Monitoradas</span>
            <span className="text-xs font-normal text-slate-400">{keywords.length} monitoradas</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 dark:bg-slate-900/50 dark:border-slate-800 text-slate-500 font-semibold">
                <tr>
                  <th className="p-4">Palavra-Chave</th>
                  <th className="p-4">Volume Mensal</th>
                  <th className="p-4">Dificuldade SEO</th>
                  <th className="p-4">URL de Destino</th>
                  <th className="p-4 text-center">Posição Atual</th>
                  <th className="p-4 text-right">Tendência</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {keywords.map((kw, i) => (
                  <tr key={i} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="p-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                      <span>{kw.term}</span>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{kw.volume}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{kw.difficulty}</td>
                    <td className="p-4">
                      <Link
                        href={kw.targetUrl}
                        target="_blank"
                        className="font-mono text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <span>{kw.targetUrl}</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center rounded-md bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                        {kw.position}
                      </span>
                    </td>
                    <td className="p-4 text-right font-medium text-emerald-600 dark:text-emerald-400">
                      {kw.trend}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Technical Checks */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
            Auditoria Técnica Contínua
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {auditChecks.map((check, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 text-xs">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{check.title}</div>
                  <div className="text-slate-500 mt-0.5">{check.detail}</div>
                </div>
              </div>
              <Badge variant="verified" className="text-[10px]">
                Aprovado
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
