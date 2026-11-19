import { DetailedProduct } from "@/services/catalog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://stackwise.io";

export function generateSoftwareApplicationSchema(product: DetailedProduct, locale: string = "pt-br") {
  const isPt = locale === "pt-br";
  const lowestPrice = product.prices?.[0];

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    operatingSystem: "Web-based, Cloud, SaaS",
    applicationCategory: product.category ? (isPt ? product.category.name_pt : product.category.name_en) : "BusinessApplication",
    description: isPt ? product.short_description_pt : product.short_description_en,
    url: `${SITE_URL}/${locale}/software/${product.slug}`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating_editorial,
      bestRating: 5.0,
      worstRating: 1.0,
      ratingCount: 1, // Editorial benchmark
    },
    offers: {
      "@type": "Offer",
      price: lowestPrice?.price || 0.0,
      priceCurrency: lowestPrice?.currency || "USD",
      availability: "https://schema.org/InStock",
      priceValidUntil: "2027-12-31",
    },
  };
}

export function generateArticleSchema(options: {
  title: string;
  description: string;
  slug: string;
  locale: string;
  publishedAt: string;
  updatedAt: string;
  authorName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: options.title,
    description: options.description,
    url: `${SITE_URL}/${options.locale}/blog/${options.slug}`,
    inLanguage: options.locale === "en" ? "en-US" : "pt-BR",
    datePublished: options.publishedAt,
    dateModified: options.updatedAt,
    author: {
      "@type": "Organization",
      name: options.authorName || "STACKWISE Editorial Board",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "STACKWISE",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/static/brand/logo.png`,
      },
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}
