import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { type Locale } from "@/lib/i18n/dictionaries";
import {
  Calendar,
  Clock,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getArticleBySlug } from "@/services/content";
import { formatDate } from "@/lib/utils";
import { generateArticleSchema, generateBreadcrumbSchema } from "@/lib/seo/schema";

interface ArticlePageProps {
  params: {
    locale: Locale;
    slug: string;
  };
}

export const revalidate = 60;

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { locale, slug } = params;
  const isPt = locale === "pt-br";

  const article = await getArticleBySlug(slug, locale);

  if (!article || !article.translation) {
    notFound();
  }

  const tr = article.translation;

  // Generate Schema.org JSON-LD
  const articleSchema = generateArticleSchema({
    title: tr.title,
    description: tr.meta_description,
    slug,
    locale,
    publishedAt: tr.published_at || article.created_at,
    updatedAt: tr.updated_at || article.updated_at,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `/${locale}` },
    { name: isPt ? "Blog & Guias" : "Blog & Guides", url: `/${locale}/blog` },
    { name: tr.title, url: `/${locale}/blog/${slug}` },
  ]);

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      {/* Schema.org Injections */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href={`/${locale}`} className="hover:underline">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/${locale}/blog`} className="hover:underline">Blog</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-xs">
          {tr.title}
        </span>
      </nav>

      {/* Article Header */}
      <header className="space-y-4 border-b border-slate-200 pb-8 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Badge variant="verified" className="text-xs">
            <ShieldCheck className="h-3.5 w-3.5 mr-1" />
            {isPt ? "Auditoria Técnica Editorial" : "Technical Editorial Audit"}
          </Badge>
          {article.category && (
            <Badge variant="secondary" className="text-xs">
              {isPt ? article.category.name_pt : article.category.name_en}
            </Badge>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.2]">
          {tr.title}
        </h1>

        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {tr.meta_description}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{isPt ? `Publicado em ${formatDate(tr.published_at || article.created_at)}` : `Published on ${formatDate(tr.published_at || article.created_at, "en")}`}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{isPt ? "Tempo de leitura: 6 min" : "6 min read"}</span>
          </div>
          <span>•</span>
          <div className="text-slate-600 dark:text-slate-400 font-medium">
            Por: Conselho Editorial STACKWISE
          </div>
        </div>
      </header>

      {/* Primary Tool Callout (if product related) */}
      {article.primary_product && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-5 dark:border-blue-900 dark:bg-blue-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-900 dark:text-blue-300">
              {isPt ? "Software em Destaque neste Artigo" : "Featured SaaS Tool"}
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              {article.primary_product.name}
            </div>
          </div>

          <Link
            href={`/go/${article.primary_product.slug}`}
            target="_blank"
            rel="sponsored nofollow noopener"
          >
            <Button size="sm" className="gap-1.5 font-semibold text-xs shrink-0">
              <span>{isPt ? "Acessar Fornecedor Oficial" : "Visit Official Provider"}</span>
              <ExternalLink className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      )}

      {/* Article Markdown Body */}
      <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
        {tr.content_markdown.split("\n\n").map((paragraph, idx) => {
          if (paragraph.startsWith("## ")) {
            return (
              <h2 key={idx} className="text-2xl font-bold text-slate-900 dark:text-white pt-6 pb-2">
                {paragraph.replace("## ", "")}
              </h2>
            );
          }
          if (paragraph.startsWith("### ")) {
            return (
              <h3 key={idx} className="text-lg font-bold text-slate-900 dark:text-white pt-4 pb-1">
                {paragraph.replace("### ", "")}
              </h3>
            );
          }
          if (paragraph.startsWith("- ")) {
            const items = paragraph.split("\n").map((item) => item.replace("- ", ""));
            return (
              <ul key={idx} className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                {items.map((it, itemIdx) => (
                  <li key={itemIdx}>{it}</li>
                ))}
              </ul>
            );
          }
          return <p key={idx}>{paragraph}</p>;
        })}
      </div>

      {/* Editorial Disclaimer Footer */}
      <footer className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/60 text-xs text-slate-500 space-y-1.5 mt-12">
        <div className="font-semibold text-slate-800 dark:text-slate-200">
          {isPt ? "Compromisso de Veracidade e Isenção Editorial" : "Factual Verification Commitment"}
        </div>
        <p>
          {isPt
            ? "Este conteúdo foi revisado tecnicamente com base em fontes documentadas e planos vigentes. Não recebemos incentivos financeiros para distorcer avaliações técnicas."
            : "This technical benchmark has been audited against documented provider specifications. We do not accept sponsored placements to distort technical scores."}
        </p>
      </footer>
    </article>
  );
}
