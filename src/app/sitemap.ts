import { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/services/catalog";
import { getPublishedArticles } from "@/services/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://stackwisesigital.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products, articlesPt, articlesEn] = await Promise.all([
    getCategories(),
    getProducts(),
    getPublishedArticles("pt-br"),
    getPublishedArticles("en"),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  // Static institutional and hub routes
  const staticPaths = [
    "",
    "/categories",
    "/compare",
    "/custom-systems",
    "/blog",
    "/about",
    "/affiliate-disclosure",
    "/privacy",
    "/terms",
  ];

  for (const path of staticPaths) {
    entries.push({
      url: `${SITE_URL}/pt-br${path}`,
      lastModified: new Date(),
      changeFrequency: path === "" ? "daily" : "weekly",
      priority: path === "" ? 1.0 : 0.8,
      alternates: {
        languages: {
          "pt-BR": `${SITE_URL}/pt-br${path}`,
          "en-US": `${SITE_URL}/en${path}`,
        },
      },
    });

    entries.push({
      url: `${SITE_URL}/en${path}`,
      lastModified: new Date(),
      changeFrequency: path === "" ? "daily" : "weekly",
      priority: path === "" ? 0.9 : 0.7,
      alternates: {
        languages: {
          "pt-BR": `${SITE_URL}/pt-br${path}`,
          "en-US": `${SITE_URL}/en${path}`,
        },
      },
    });
  }

  // Categories
  for (const cat of categories) {
    entries.push({
      url: `${SITE_URL}/pt-br/categories/${cat.slug}`,
      lastModified: new Date(cat.created_at || Date.now()),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          "pt-BR": `${SITE_URL}/pt-br/categories/${cat.slug}`,
          "en-US": `${SITE_URL}/en/categories/${cat.slug}`,
        },
      },
    });

    entries.push({
      url: `${SITE_URL}/en/categories/${cat.slug}`,
      lastModified: new Date(cat.created_at || Date.now()),
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: {
        languages: {
          "pt-BR": `${SITE_URL}/pt-br/categories/${cat.slug}`,
          "en-US": `${SITE_URL}/en/categories/${cat.slug}`,
        },
      },
    });
  }

  // Products
  for (const prod of products) {
    entries.push({
      url: `${SITE_URL}/pt-br/software/${prod.slug}`,
      lastModified: new Date(prod.last_verified_at || Date.now()),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          "pt-BR": `${SITE_URL}/pt-br/software/${prod.slug}`,
          "en-US": `${SITE_URL}/en/software/${prod.slug}`,
        },
      },
    });

    entries.push({
      url: `${SITE_URL}/en/software/${prod.slug}`,
      lastModified: new Date(prod.last_verified_at || Date.now()),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          "pt-BR": `${SITE_URL}/pt-br/software/${prod.slug}`,
          "en-US": `${SITE_URL}/en/software/${prod.slug}`,
        },
      },
    });
  }

  // Published Editorial Articles
  for (const art of articlesPt) {
    entries.push({
      url: `${SITE_URL}/pt-br/blog/${art.slug}`,
      lastModified: new Date(art.updated_at || Date.now()),
      changeFrequency: "weekly",
      priority: 0.85,
      alternates: {
        languages: {
          "pt-BR": `${SITE_URL}/pt-br/blog/${art.slug}`,
          "en-US": `${SITE_URL}/en/blog/${art.slug}`,
        },
      },
    });
  }

  for (const art of articlesEn) {
    entries.push({
      url: `${SITE_URL}/en/blog/${art.slug}`,
      lastModified: new Date(art.updated_at || Date.now()),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          "pt-BR": `${SITE_URL}/pt-br/blog/${art.slug}`,
          "en-US": `${SITE_URL}/en/blog/${art.slug}`,
        },
      },
    });
  }

  return entries;
}
