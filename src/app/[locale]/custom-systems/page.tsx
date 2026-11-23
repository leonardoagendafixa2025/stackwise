"use client";

import React, { useState } from "react";
import { Sparkles, CheckCircle2, Send } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

interface CustomSystemsPageProps {
  params: {
    locale: "pt-br" | "en";
  };
}

export default function CustomSystemsPage({ params }: CustomSystemsPageProps) {
  const { locale } = params;
  const isPt = locale === "pt-br";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    company: "",
    summary: "",
    budget: "R$ 5.000 a R$ 15.000",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send lead to backend API
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || (isPt ? "Por favor, preencha todos os campos obrigatórios, incluindo WhatsApp com DDD." : "Please fill in all required fields including WhatsApp."));
        return;
      }

      setSubmitted(true);
    } catch {
      alert(isPt ? "Erro de conexão ao enviar o formulário. Tente novamente." : "Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge variant="verified" className="px-3 py-1 text-xs">
          <Sparkles className="h-3.5 w-3.5 text-blue-600 mr-1.5" />
          {isPt ? "Agente Comercial STACKWISE" : "STACKWISE Commercial Agent"}
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {isPt
            ? "Criação de Sistemas & Plataformas Sob Medida"
            : "Custom Software Architecture & Tailored Systems"}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {isPt
            ? "Descreva seu projeto ou problema operacional. Nossa inteligência artificial analisa o escopo técnico, estrutura um briefing e encaminha diretamente para avaliação do proprietário e arquiteto de software."
            : "Describe your custom software requirements. Our AI assistant analyzes technical workflows, drafts a structured briefing, and sends it directly to our senior software architects."}
        </p>
      </div>

      {submitted ? (
        <Card className="p-8 text-center border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-800">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white mb-4">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isPt ? "Briefing Encaminhado com Sucesso!" : "Briefing Successfully Submitted!"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
            {isPt
              ? "O Agente Comercial da STACKWISE registrou sua solicitação e já está organizando a árvore de funcionalidades preliminar. Entraremos em contato caso o escopo seja aprovado para execução."
              : "Our Commercial Agent has mapped your initial technical requirements. We will review the specifications and reach out if there is strong project alignment."}
          </p>
        </Card>
      ) : (
        <Card className="p-6 sm:p-10 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  {isPt ? "Seu Nome Completo *" : "Full Name *"}
                </label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={isPt ? "ex: Carlos Eduardo" : "e.g. John Doe"}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>{isPt ? "WhatsApp / Celular com DDD *" : "WhatsApp / Phone *"}</span>
                </label>
                <Input
                  required
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder={isPt ? "(11) 99999-9999" : "+1 (555) 000-0000"}
                  className="border-emerald-300 focus:ring-emerald-500 dark:border-emerald-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  {isPt ? "E-mail Profissional *" : "Business Email *"}
                </label>
                <Input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={isPt ? "seuemail@empresa.com" : "you@company.com"}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  {isPt ? "Nome da Empresa ou Projeto" : "Company or Project Name"}
                </label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder={isPt ? "ex: Logística Rápida Ltda" : "e.g. Acme Corp"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                {isPt ? "Qual desafio o sistema deve resolver? *" : "Project Requirements & Objectives *"}
              </label>
              <textarea
                required
                rows={5}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder={
                  isPt
                    ? "Explique resumidamente: qual é o processo atual, quais integrações são necessárias, e qual é o objetivo do sistema..."
                    : "Briefly explain: current workflow bottleneck, key integrations needed, and main business objective..."
                }
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                {isPt ? "Faixa de Investimento Planejada" : "Planned Budget"}
              </label>
              <select
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="R$ 3.000 a R$ 10.000">R$ 3.000 a R$ 10.000 (MVP / Automação Específica)</option>
                <option value="R$ 10.000 a R$ 30.000">R$ 10.000 a R$ 30.000 (Sistema Completo / Plataforma)</option>
                <option value="Acima de R$ 30.000">Acima de R$ 30.000 (Enterprise / Alta Complexidade)</option>
              </select>
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={loading} size="lg" className="w-full font-semibold gap-2">
                <Send className="h-4 w-4" />
                <span>{loading ? "Processando Briefing..." : isPt ? "Enviar para o Agente Comercial" : "Submit to Commercial Agent"}</span>
              </Button>
            </div>

            <div className="text-center text-[11px] text-slate-400">
              {isPt
                ? "Nenhuma proposta comercial é fechada automaticamente. Todo briefing é avaliado manualmente pelo proprietário antes de qualquer compromisso."
                : "No binding contracts or deadlines are set automatically. Every project scope is evaluated directly by our leadership team."}
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
