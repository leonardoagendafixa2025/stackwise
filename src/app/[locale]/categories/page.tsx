import React from "react";
import Link from "next/link";
import { type Locale, getDictionary } from "@/lib/i18n/dictionaries";
import {
  Brain,
  Users,
  Cpu,
  Mail,
  CheckSquare,
  BarChart3,
  Globe,
  MessageSquare,
  Briefcase,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface CategoriesPageProps {
  params: {
    locale: Locale;
  };
}

export default function CategoriesPage({ params }: CategoriesPageProps) {
  const { locale } = params;
  const dict = getDictionary(locale);

  const categories = [
    {
      slug: "inteligencia-artificial",
      title: locale === "pt-br" ? "Inteligência Artificial" : "Artificial Intelligence",
      description: locale === "pt-br" ? "Assistentes inteligentes, modelos LLM e automações cognitivas corporativas." : "AI assistants, LLMs and enterprise cognitive automation.",
      icon: Brain,
      count: 24,
    },
    {
      slug: "crm",
      title: "CRM & Vendas",
      description: locale === "pt-br" ? "Sistemas de gestão de relacionamento com o cliente e pipelines comerciais." : "Customer relationship management and sales pipelines.",
      icon: Users,
      count: 18,
    },
    {
      slug: "automacao",
      title: locale === "pt-br" ? "Automação No-Code" : "Workflow Automation",
      description: locale === "pt-br" ? "Integração de APIs, gatilhos de dados e orquestração de processos." : "API integrations, data triggers and process orchestration.",
      icon: Cpu,
      count: 15,
    },
    {
      slug: "marketing-digital",
      title: "Marketing Digital",
      description: locale === "pt-br" ? "Análise de tráfego, SEO técnico, métricas e aquisição multicanal." : "Traffic analytics, technical SEO and multi-channel acquisition.",
      icon: TrendingUp,
      count: 12,
    },
    {
      slug: "email-marketing",
      title: "E-mail Marketing",
      description: locale === "pt-br" ? "Newsletters, sequências automatizadas e gestão de entregabilidade." : "Newsletters, automated email sequences and deliverability.",
      icon: Mail,
      count: 14,
    },
    {
      slug: "produtividade",
      title: locale === "pt-br" ? "Produtividade & Wikis" : "Productivity & Workspaces",
      description: locale === "pt-br" ? "Gestão ágil de tarefas, bases de conhecimento e colaboração remota." : "Agile task tracking, knowledge wikis and remote collaboration.",
      icon: CheckSquare,
      count: 20,
    },
    {
      slug: "gestao-empresarial",
      title: locale === "pt-br" ? "Gestão Empresarial (ERP)" : "Business Management (ERP)",
      description: locale === "pt-br" ? "Controle financeiro, emissão fiscal, faturamento e gestão operacional." : "Financial control, invoicing and operational management.",
      icon: BarChart3,
      count: 11,
    },
    {
      slug: "criacao-de-sites",
      title: locale === "pt-br" ? "Criação de Sites & Landing Pages" : "Website & Funnel Builders",
      description: locale === "pt-br" ? "Construtores visuais de páginas, lojas online e CMS sem código." : "Visual page builders, online storefronts and no-code CMS.",
      icon: Globe,
      count: 16,
    },
    {
      slug: "atendimento-ao-cliente",
      title: locale === "pt-br" ? "Atendimento ao Cliente" : "Customer Support & Helpdesk",
      description: locale === "pt-br" ? "Helpdesk, ticketing, live chat e chatbots de suporte com inteligência artificial." : "Helpdesk, ticketing, live chat and AI customer bots.",
      icon: MessageSquare,
      count: 13,
    },
    {
      slug: "pequenas-empresas",
      title: locale === "pt-br" ? "Ferramentas para Pequenas Empresas" : "Small Business Essentials",
      description: locale === "pt-br" ? "Softwares acessíveis e enxutos para iniciar e acelerar pequenos negócios." : "Lean, accessible toolkits to launch and scale small ventures.",
      icon: Briefcase,
      count: 19,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {dict.nav.categories}
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-2xl">
          {locale === "pt-br"
            ? "Explore nosso diretório estruturado de ferramentas SaaS. Todos os softwares listados passam por verificação editorial de preços e recursos."
            : "Explore our verified directory of enterprise SaaS solutions. All products are audited for pricing validity and technical capabilities."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link key={cat.slug} href={`/${locale}/categories/${cat.slug}`}>
              <Card className="h-full hover:shadow-md hover:border-blue-400 dark:hover:border-blue-700 transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 group-hover:scale-105 transition-transform">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {cat.count} ferramentas
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <span>Acessar Categoria</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
