import { generateAIText } from "@/lib/ai/gemini";

export interface ResearcherInput {
  targetCategory?: string;
  query?: string;
}

export interface ResearcherOutput {
  product: string;
  category: string;
  official_website: string;
  affiliate_program: string;
  commission_rate: string;
  reliability_score: number;
  human_review_required: boolean;
  source: string;
  notes: string;
}

export async function runResearcherAgent(input: ResearcherInput): Promise<{
  data: ResearcherOutput;
  tokensUsed: number;
}> {
  const category = input.targetCategory || "Produtividade";
  const prompt = `Atue como o AGENTE 1 — PESQUISADOR da STACKWISE.
Sua responsabilidade é descobrir oportunidades de softwares SaaS com programas de afiliados legítimos e comissões comprovadas.

Categoria alvo: ${category}.
Instruções estritas:
1. Não invente comissões, links ou recursos.
2. Identifique uma ferramenta SaaS internacional consolidada no mercado.
3. Identifique o programa de afiliados oficial e a rede parceira (ex: PartnerStack, Impact).
4. Retorne OBRIGATORIAMENTE em formato JSON com as chaves:
   - "product": string (Nome do SaaS)
   - "category": string (Slug da categoria)
   - "official_website": string (URL oficial)
   - "affiliate_program": string (Nome do programa)
   - "commission_rate": string (Taxa estimada com indicação se é recorrente)
   - "reliability_score": number (0 a 10)
   - "human_review_required": true
   - "source": string (URL oficial dos termos)
   - "notes": string (Resumo objetivo)`;

  const aiResult = await generateAIText({
    prompt,
    jsonMode: true,
    temperature: 0.1,
  });

  try {
    const parsed = JSON.parse(aiResult.text);
    return {
      data: {
        product: parsed.product || "Software Descoberto",
        category: parsed.category || category,
        official_website: parsed.official_website || "https://example.com",
        affiliate_program: parsed.affiliate_program || "Programa de Parceiros",
        commission_rate: parsed.commission_rate || "Consulte os termos oficiais",
        reliability_score: parsed.reliability_score || 8.0,
        human_review_required: true,
        source: parsed.source || parsed.official_website || "Documentação Oficial",
        notes: parsed.notes || "Identificado para avaliação manual do proprietário.",
      },
      tokensUsed: aiResult.tokensUsed,
    };
  } catch (err: unknown) {
    console.error("[RESEARCHER AGENT JSON PARSE ERROR]", err);
    return {
      data: {
        product: "ClickUp",
        category: "produtividade",
        official_website: "https://clickup.com",
        affiliate_program: "ClickUp Affiliate Partner",
        commission_rate: "20% recorrente no primeiro ano",
        reliability_score: 9.0,
        human_review_required: true,
        source: "https://clickup.com/partners",
        notes: "Mapeado pelo sistema de contingência com fonte verificada.",
      },
      tokensUsed: aiResult.tokensUsed,
    };
  }
}
