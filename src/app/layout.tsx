import type { Metadata } from "next";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://stackwise.io"),
  title: {
    default: "STACKWISE — Discover. Compare. Choose Smarter.",
    template: "%s | STACKWISE",
  },
  description:
    "Plataforma independente de descoberta, comparação e recomendação de softwares empresariais e ferramentas SaaS. Preços verificados e análises técnicas.",
  keywords: [
    "SaaS",
    "software comparison",
    "melhores ferramentas",
    "CRM",
    "automação",
    "inteligência artificial",
    "Stackwise",
  ],
  authors: [{ name: "STACKWISE Editorial Board" }],
  creator: "STACKWISE",
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
