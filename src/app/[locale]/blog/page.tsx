import React from "react";
import Link from "next/link";
import { type Locale, getDictionary } from "@/lib/i18n/dictionaries";
import { Calendar, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getPublishedArticles } from "@/services/content";
import { formatDate } from "@/lib/utils";

interface BlogPageProps {
  params: {
    locale: Locale;
  };
}

export const revalidate = 60;

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const isPt = locale === "pt-br";

  const articles = await getPublishedArticles(locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      <div>
        <Badge variant="verified" className="mb-3">
          <ShieldCheck className="h-3.5 w-3.5 mr-1" />
          {isPt ? "Conteúdo Editorial Verificado" : "Audited Editorial Intelligence"}
        </Badge>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {dict.nav.editorial}
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-2xl">
          {isPt
            ? "Análises aprofundadas, benchmarks técnicos, comparativos reais e tutoriais estruturados por especialistas em software e arquitetura de sistemas."
            : "In-depth technical benchmarks, side-by-side SaaS evaluations, and structured guides drafted by senior software architects."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.length === 0 ? (
          <div className="col-span-full">
            <Card className="p-8 text-center text-slate-500 text-sm">
              {isPt
                ? "Nenhum artigo publicado neste idioma no momento. Nossos editores e agentes estão finalizando novos comparativos."
                : "No articles published in this language yet. Our editorial board is finalizing new benchmarks."}
            </Card>
          </div>
        ) : (
          articles.map((art) => {
            const tr = art.translation;
            if (!tr) return null;

            return (
              <Link key={art.slug} href={`/${locale}/blog/${art.slug}`}>
                <Card className="h-full flex flex-col justify-between hover:border-blue-400 dark:hover:border-blue-700 transition-all group">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[10px]">
                        {art.category ? (isPt ? art.category.name_pt : art.category.name_en) : "Guia Técnico"}
                      </span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>6 min leitura</span>
                      </div>
                    </div>

                    <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2">
                      {tr.title}
                    </h2>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {tr.meta_description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-slate-400">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(tr.published_at || art.created_at)}</span>
                    </div>

                    <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:underline">
                      Ler Artigo <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
