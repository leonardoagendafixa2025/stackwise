import React from "react";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/dictionaries";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { AffiliateDisclosureBanner } from "@/components/public/AffiliateDisclosureBanner";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AffiliateDisclosureBanner locale={typedLocale} />
      <Navbar locale={typedLocale} />
      <main className="flex-1">{children}</main>
      <Footer locale={typedLocale} />
    </div>
  );
}
