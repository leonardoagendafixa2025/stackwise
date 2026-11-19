import { generateAIText } from "@/lib/ai/gemini";
import { createAdminClient } from "@/lib/supabase/admin";

export interface CommercialAgentOutput {
  lead_id: string;
  technical_scope: Record<string, unknown>;
  estimated_hours: number;
  complexity_level: "low" | "medium" | "high" | "enterprise";
  ai_recommendations: string[];
}

export async function runCommercialAgentForLead(leadId: string): Promise<{
  data: CommercialAgentOutput;
  tokensUsed: number;
}> {
  const supabase = createAdminClient();

  const { data: lead, error } = await supabase
    .from("project_leads")
    .select("*")
    .eq("id", leadId)
    .single();

  if (error || !lead) {
    throw new Error(`Lead ${leadId} não encontrado.`);
  }

  const prompt = `Atue como o AGENTE 7 — CONSULTOR COMERCIAL & ARQUITETO DE SOFTWARE da STACKWISE.
Analise a demanda de desenvolvimento de sistema personalizado recebida:
- Contato: ${lead.contact_name} (${lead.company_name || "Pessoa Física"})
- E-mail: ${lead.contact_email}
- Resumo do Projeto: "${lead.project_summary}"
- Orçamento Previsto: "${lead.budget_range || "Não informado"}"

Instruções:
1. Extraia o escopo técnico preliminar (stack recomendada, banco de dados, integrações).
2. Estime horas de desenvolvimento (apenas estimativa paramétrica).
3. Classifique a complexidade ("low", "medium", "high" ou "enterprise").
4. Elabore 3 recomendações arquiteturais para o proprietário decidir se aceita o projeto.
5. Retorne OBRIGATORIAMENTE em JSON:
   - "technical_scope": objeto com chaves "architecture", "frontend", "backend", "database"
   - "estimated_hours": number
   - "complexity_level": "low" | "medium" | "high" | "enterprise"
   - "ai_recommendations": lista de strings`;

  const aiResult = await generateAIText({
    prompt,
    jsonMode: true,
    temperature: 0.2,
  });

  let parsed: {
    technical_scope?: Record<string, unknown>;
    estimated_hours?: number;
    complexity_level?: "low" | "medium" | "high" | "enterprise";
    ai_recommendations?: string[];
  };
  try {
    parsed = JSON.parse(aiResult.text);
  } catch {
    parsed = {
      technical_scope: {
        architecture: "Next.js App Router + Supabase PostgreSQL",
        integrations: ["Autenticação", "PostgreSQL RLS", "Webhooks"],
      },
      estimated_hours: 60,
      complexity_level: "medium",
      ai_recommendations: [
        "Desenvolver MVP focado nas regras de negócio essenciais.",
        "Apresentar estimativa preliminar para validação do cliente antes de fechar contrato.",
      ],
    };
  }

  // Save into project_briefings
  await supabase.from("project_briefings").insert({
    lead_id: lead.id,
    technical_scope: parsed.technical_scope || {},
    estimated_hours: parsed.estimated_hours || 60,
    complexity_level: parsed.complexity_level || "medium",
    ai_recommendations: parsed.ai_recommendations || [],
  });

  // Update lead status
  await supabase
    .from("project_leads")
    .update({ status: "briefing_ready" })
    .eq("id", lead.id);

  // Notify owner
  await supabase.from("notifications").insert({
    type: "BRIEFING_READY",
    title: `Briefing Técnico Gerado: ${lead.contact_name}`,
    message: `O Agente Comercial elaborou a especificação preliminar (${parsed.complexity_level}) para o projeto "${lead.company_name || lead.contact_name}". Aguarda decisão do proprietário.`,
    severity: "info",
    requires_attention: true,
    action_url: "/admin/leads",
  });

  return {
    data: {
      lead_id: lead.id,
      technical_scope: parsed.technical_scope || {},
      estimated_hours: parsed.estimated_hours || 60,
      complexity_level: parsed.complexity_level || "medium",
      ai_recommendations: parsed.ai_recommendations || [],
    },
    tokensUsed: aiResult.tokensUsed,
  };
}
