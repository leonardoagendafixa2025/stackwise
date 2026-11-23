import React from "react";
import HomePage from "./[locale]/page";
import { defaultLocale } from "@/lib/i18n/dictionaries";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { AffiliateDisclosureBanner } from "@/components/public/AffiliateDisclosureBanner";

export default function RootPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AffiliateDisclosureBanner locale={defaultLocale} />
      <Navbar locale={defaultLocale} />
      <main className="flex-1">
        <HomePage params={{ locale: defaultLocale }} />
      </main>
      <Footer locale={defaultLocale} />
    </div>
  );
}
