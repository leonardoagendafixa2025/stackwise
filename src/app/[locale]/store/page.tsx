import React from "react";
import Link from "next/link";
import { type Locale } from "@/lib/i18n/dictionaries";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getStoreProducts } from "@/services/digitalStore/catalog";
import {
  ShoppingBag,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface StorePageProps {
  params: {
    locale: Locale;
  };
}

export const dynamic = "force-dynamic";

export default async function StorePage({ params }: StorePageProps) {
  const isPt = params.locale !== "en";
  const products = await getStoreProducts(true);

  return (
    <div className="space-y-12 pb-24">
      {/* Hero Section */}
      <div className="border-b border-slate-200/80 bg-gradient-to-b from-emerald-50/50 via-white to-slate-50/50 py-16 dark:border-slate-800 dark:from-slate-950 dark:via-slate-900/40 dark:to-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50/90 px-4 py-1 text-xs font-bold text-emerald-800 shadow-2xs dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <Zap className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
            <span>
              {isPt
                ? "Entrega Instantânea Automatizada via Binance Pay"
                : "Instant Automated Delivery via Binance Pay"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            {isPt ? "Loja Oficial de Licenças de IA & Ferramentas Digitais" : "Digital AI Licenses & Creator Tools Store"}
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {isPt
              ? "Adquira cupons oficiais, contas de criador e licenças de software com ativação automatizada e pagamento direto em USDT via Binance Pay."
              : "Buy official coupons, creator accounts, and software licenses with automated fulfillment and direct USDT payment via Binance Pay."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              {isPt ? "Fornecedores Oficiais Auditados" : "Verified API Suppliers"}
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              {isPt ? "Binance Pay ID Oficial: 1257797463" : "Binance Pay ID: 1257797463"}
            </span>
          </div>
        </div>
      </div>

      {/* Product Catalog Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {products.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <ShoppingBag className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
              {isPt ? "Catálogo em Sincronização" : "Catalog Syncing"}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {isPt
                ? "Os produtos dos 3 fornecedores estão sendo sincronizados no painel administrativo."
                : "Supplier products are being synchronized in the admin hub."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => {
              const approxBrl = (p.sale_price * 5.85).toFixed(2);

              return (
                <Card key={p.id} className="flex flex-col justify-between p-7 rounded-3xl hover:shadow-xl hover:border-emerald-400 dark:hover:border-emerald-500 transition-all border-slate-200/90 bg-white dark:bg-slate-900">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px] font-bold">
                        {p.category}
                      </Badge>
                      <Badge variant="verified" className="text-[10px] font-mono">
                        {p.supplier_code === "ventebot"
                          ? "VenteBot"
                          : p.supplier_code === "prime_digital"
                          ? "Prime Digital"
                          : "AIVault Hub"}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        {p.name}
                      </h3>
                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed whitespace-pre-line font-normal">
                        {p.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-5 border-t border-slate-100 dark:border-slate-800 space-y-3.5">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                          {isPt ? "Preço de Venda:" : "Price:"}
                        </div>
                        <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                          ${p.sale_price.toFixed(2)}{" "}
                          <span className="text-xs font-bold text-emerald-600">USDT</span>
                        </div>
                      </div>

                      <div className="text-right text-[11px] text-slate-400 font-mono font-medium">
                        ~ R$ {approxBrl}
                      </div>
                    </div>

                    <Link
                      href={`/${params.locale}/store/checkout?productId=${p.id}`}
                      className="block w-full"
                    >
                      <Button className="w-full gap-2 font-bold text-xs shadow-md bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl">
                        <Sparkles className="h-4 w-4" />
                        <span>{isPt ? "Comprar via Binance Pay" : "Buy with Binance Pay"}</span>
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
