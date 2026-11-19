"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { type Locale } from "@/lib/i18n/dictionaries";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { DigitalProductRecord } from "@/services/digitalStore/catalog";
import {
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ArrowLeft,
  Sparkles,
  Key,
} from "lucide-react";

interface CheckoutPageProps {
  params: {
    locale: Locale;
  };
}

function CheckoutContent({ params }: CheckoutPageProps) {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const isPt = params.locale !== "en";

  const [selectedProduct, setSelectedProduct] = useState<DigitalProductRecord | null>(null);
  const [loading, setLoading] = useState(true);

  // Form step: 1 = Details, 2 = Payment Instructions, 3 = Completed Delivery
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [generatingOrder, setGeneratingOrder] = useState(false);

  // Order Details
  const [orderCode, setOrderCode] = useState("");
  const [binancePayId] = useState("1257797463");
  const [binanceTxId, setBinanceTxId] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyFeedback, setVerifyFeedback] = useState<string | null>(null);

  // Delivered Digital Item
  const [deliveredItem, setDeliveredItem] = useState<string | null>(null);
  const [copiedPayId, setCopiedPayId] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    fetch("/api/store/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          if (productId) {
            const found = data.products.find((p: DigitalProductRecord) => p.id === productId);
            if (found) setSelectedProduct(found);
          } else if (data.products.length > 0) {
            setSelectedProduct(data.products[0]);
          }
        }
      })
      .catch((err) => console.error("Error loading products:", err))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setGeneratingOrder(true);
    try {
      const res = await fetch("/api/store/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct.id,
          customerEmail,
          customerName,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha ao criar pedido");

      setOrderCode(data.order.order_code);
      setStep(2);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      alert(msg);
    } finally {
      setGeneratingOrder(false);
    }
  };

  const handleVerifyPayment = async () => {
    if (!binanceTxId.trim()) {
      alert(isPt ? "Por favor, insira o ID da transação da Binance." : "Please enter your Binance transaction ID.");
      return;
    }

    setVerifying(true);
    setVerifyFeedback(null);

    try {
      const res = await fetch("/api/store/orders/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderCode,
          binanceTxId: binanceTxId.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Falha ao verificar");

      if (data.success && data.fulfillment?.deliveredContent) {
        setDeliveredItem(data.fulfillment.deliveredContent);
        setStep(3);
      } else {
        setVerifyFeedback(
          data.message ||
            (isPt
              ? "Transação recebida! O produto está sendo preparado pelo fornecedor."
              : "Payment received! Order is being processed by the supplier.")
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setVerifyFeedback(`Aviso: ${msg}`);
    } finally {
      setVerifying(false);
    }
  };

  const handleCopy = (text: string, type: "payId" | "code" | "key") => {
    navigator.clipboard.writeText(text);
    if (type === "payId") {
      setCopiedPayId(true);
      setTimeout(() => setCopiedPayId(false), 2000);
    } else if (type === "code") {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else if (type === "key") {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar locale={params.locale} />
        <div className="flex-1 flex items-center justify-center p-8 text-slate-500">
          Carregando checkout...
        </div>
        <Footer locale={params.locale} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar locale={params.locale} />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <Link
            href={`/${params.locale}/store`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{isPt ? "Voltar para o catálogo" : "Back to catalog"}</span>
          </Link>

          {/* Step 1: Customer Details */}
          {step === 1 && (
            <Card className="p-8 space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {isPt ? "Finalizar Pedido" : "Checkout Order"}
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  {isPt
                    ? "Informe seus dados para identificação e recebimento do cupom/chave de acesso."
                    : "Enter your contact details to receive your access license."}
                </p>
              </div>

              {/* Selected Product Summary */}
              {selectedProduct && (
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60 flex items-center justify-between">
                  <div>
                    <Badge variant="outline" className="text-[10px] mb-1">
                      {selectedProduct.category}
                    </Badge>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      {selectedProduct.name}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                      ${selectedProduct.sale_price.toFixed(2)} USDT
                    </div>
                    <div className="text-[10px] text-slate-400">
                      ~ R$ {(selectedProduct.sale_price * 5.85).toFixed(2)}
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleCreateOrder} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {isPt ? "Seu Nome Completo" : "Your Name"}
                  </label>
                  <Input
                    required
                    placeholder="Ex: Leonardo Silva"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {isPt ? "Seu E-mail (Onde você receberá a confirmação)" : "Your Email"}
                  </label>
                  <Input
                    required
                    type="email"
                    placeholder="exemplo@email.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={generatingOrder}
                    className="w-full gap-2 font-semibold text-sm"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>{generatingOrder ? "Gerando Pedido..." : "Prosseguir para Pagamento Binance Pay"}</span>
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Step 2: Binance Pay Transfer Instructions */}
          {step === 2 && (
            <Card className="p-8 space-y-6">
              <div className="text-center space-y-1">
                <Badge variant="verified" className="text-xs px-3 py-1 font-semibold">
                  {isPt ? "Pedido Registrado — Aguardando Transferência" : "Order Created — Awaiting Transfer"}
                </Badge>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white pt-2">
                  {isPt ? "Instruções de Pagamento via Binance Pay" : "Payment via Binance Pay"}
                </h2>
                <p className="text-xs text-slate-500">
                  {isPt
                    ? "Transfira exatamente o valor em USDT pelo App da Binance com o código do pedido."
                    : "Transfer the exact USDT amount in your Binance App with your order code."}
                </p>
              </div>

              {/* Payment Box */}
              <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/60 p-6 dark:border-amber-900/60 dark:bg-amber-950/20 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200 dark:border-amber-900 pb-4">
                  <div>
                    <span className="text-[11px] uppercase font-bold text-amber-900 dark:text-amber-300">
                      Valor a Transferir:
                    </span>
                    <div className="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-400">
                      ${selectedProduct?.sale_price.toFixed(2)} USDT
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] uppercase font-bold text-amber-900 dark:text-amber-300">
                      Código Único do Pedido:
                    </span>
                    <div className="flex items-center gap-2 justify-end">
                      <span className="font-mono text-lg font-black text-blue-700 dark:text-blue-300">
                        {orderCode}
                      </span>
                      <button
                        onClick={() => handleCopy(orderCode, "code")}
                        className="text-slate-500 hover:text-slate-800"
                        title="Copiar código"
                      >
                        {copiedCode ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recipient Binance Pay ID */}
                <div className="rounded-xl bg-white dark:bg-slate-900 p-4 border border-amber-200 dark:border-amber-900/60 space-y-2">
                  <div className="text-xs text-slate-500 font-semibold">
                    1. Envie para o Binance Pay ID do Vendedor:
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xl font-extrabold text-slate-900 dark:text-white">
                      {binancePayId}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(binancePayId, "payId")}
                      className="gap-1.5 text-xs font-semibold"
                    >
                      {copiedPayId ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedPayId ? "Copiado!" : "Copiar Binance ID"}</span>
                    </Button>
                  </div>
                </div>

                {/* Critical Note Instruction */}
                <div className="rounded-xl bg-blue-50 dark:bg-blue-950/40 p-4 border border-blue-200 dark:border-blue-900 text-xs text-blue-950 dark:text-blue-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    2. Campo Observação / Nota no App da Binance:
                  </div>
                  <div>
                    Ao confirmar a transferência no App da Binance, coloque no campo <strong>Observação / Nota / Remark</strong> exatamente o código: <strong className="font-mono text-blue-700 dark:text-blue-300">{orderCode}</strong>.
                  </div>
                </div>
              </div>

              {/* Verification Form */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {isPt
                    ? "3. Cole o ID da Transação da Binance (do comprovante):"
                    : "3. Paste your Binance Transaction ID / TxID:"}
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: 2984719284719284..."
                    value={binanceTxId}
                    onChange={(e) => setBinanceTxId(e.target.value)}
                    className="font-mono text-xs"
                  />
                  <Button
                    onClick={handleVerifyPayment}
                    disabled={verifying || !binanceTxId.trim()}
                    className="shrink-0 gap-1.5 font-semibold text-xs"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{verifying ? "Verificando..." : "Liberar Produto"}</span>
                  </Button>
                </div>

                {verifyFeedback && (
                  <div className="rounded-lg p-3 text-xs bg-amber-50 text-amber-900 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-200">
                    {verifyFeedback}
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Step 3: Product Delivered Instantly */}
          {step === 3 && (
            <Card className="p-8 text-center space-y-6 border-emerald-300 bg-emerald-50/40 dark:border-emerald-800 dark:bg-emerald-950/20">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
                <Check className="h-6 w-6 stroke-[3]" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  {isPt ? "Pagamento Confirmado & Produto Entregue!" : "Payment Confirmed & Product Delivered!"}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  {isPt
                    ? "Seu pedido foi processado automaticamente e a sua chave/cupom está liberada abaixo:"
                    : "Your order was processed automatically. Your digital license is below:"}
                </p>
              </div>

              {/* Delivered Digital Credentials Box */}
              <div className="rounded-2xl border-2 border-emerald-300 bg-white p-5 dark:border-emerald-700 dark:bg-slate-900 space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    <Key className="h-4 w-4" />
                    <span>{isPt ? "Chave de Acesso / Cupom de Ativação:" : "Activation License / Coupon:"}</span>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(deliveredItem || "", "key")}
                    className="gap-1.5 text-xs font-semibold"
                  >
                    {copiedKey ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedKey ? "Chave Copiada!" : "Copiar Chave"}</span>
                  </Button>
                </div>

                <pre className="max-h-48 overflow-y-auto rounded-lg bg-slate-950 p-4 font-mono text-xs font-bold text-emerald-400 whitespace-pre-wrap break-all">
                  {deliveredItem}
                </pre>
              </div>

              <div className="flex justify-center gap-4 pt-2">
                <Link href={`/${params.locale}/store`}>
                  <Button variant="outline" size="sm" className="text-xs font-semibold">
                    {isPt ? "Voltar à Loja" : "Return to Store"}
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </main>

      <Footer locale={params.locale} />
    </div>
  );
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center p-8 text-slate-500">
          Carregando checkout...
        </div>
      }
    >
      <CheckoutContent params={params} />
    </React.Suspense>
  );
}
