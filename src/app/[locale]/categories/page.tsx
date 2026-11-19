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
import { getCategories } from "@/services/catalog";

interface CategoriesPageProps {
  params: {
    locale: Locale;
  };
}

export const revalidate = 60;

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const isPt = locale === "pt-br";

  const categories = await getCategories();

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    "inteligencia-artificial": Brain,
    "crm": Users,
    "automacao": Cpu,
    "marketing-digital": TrendingUp,
    "email-marketing": Mail,
    "produtividade": CheckSquare,
    "gestao-empresarial": BarChart3,
    "criacao-de-sites": Globe,
    "atendimento-ao-cliente": MessageSquare,
    "pequenas-empresas": Briefcase,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {dict.nav.categories}
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-2xl">
          {isPt
            ? "Explore nosso diretório estruturado de ferramentas SaaS. Todos os softwares listados passam por verificação editorial de preços e recursos."
            : "Explore our verified directory of enterprise SaaS solutions. All products are audited for pricing validity and technical capabilities."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const Icon = iconMap[cat.slug] || Cpu;
          return (
            <Link key={cat.slug} href={`/${locale}/categories/${cat.slug}`}>
              <Card className="h-full hover:shadow-md hover:border-blue-400 dark:hover:border-blue-700 transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 group-hover:scale-105 transition-transform">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Catálogo Ativo
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {isPt ? cat.name_pt : cat.name_en}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                      {isPt ? cat.description_pt : cat.description_en}
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
