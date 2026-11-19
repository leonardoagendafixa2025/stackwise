import { generateAIText } from "@/lib/ai/gemini";
import { getProducts } from "@/services/catalog";

export interface SEOAgentInput {
  targetCategory?: string;
}

export interface SEOAgentOutput {
  primary_intent: string;
  target_keywords: {
    keyword: string;
    intent: "commercial" | "informational" | "transactional";
    estimated_difficulty: string;
    target_action: string;
  }[];
  content_recommendations: string[];
}

export async function runSEOAgent(input?: SEOAgentInput): Promise<{
  data: SEOAgentOutput;
  tokensUsed: number;
}> {
  const targetCategory = input?.targetCategory || "Geral";
  const products = await getProducts({ limit: 4 });
  const productNames = products.map((p) => p.name).join(", ");

  const prompt = `Atue como o AGENTE 2 — SEO da STACKWISE.
Analise as ferramentas ativas no catálogo (${productNames}) na categoria ${targetCategory} e identifique oportunidades de palavras-chave comerciais de alto valor para marketing de afiliados.

Regras estritas:
1. Priorize intenção comercial real (comparações X vs Y, alternativas e termos de decisão).
2. Não invente números de volume de busca falsos. Trate estimativas como hipótese.
3. Retorne OBRIGATORIAMENTE em JSON:
   - "primary_intent": "commercial"
   - "target_keywords": lista de objetos com "keyword", "intent", "estimated_difficulty" e "target_action"
   - "content_recommendations": lista de pautas estratégicas prioritárias`;

  const aiResult = await generateAIText({
    prompt,
    jsonMode: true,
    temperature: 0.2,
  });

  try {
    const parsed = JSON.parse(aiResult.text);
    return {
      data: parsed,
      tokensUsed: aiResult.tokensUsed,
    };
  } catch {
    return {
      data: {
        primary_intent: "commercial",
        target_keywords: [
          {
            keyword: "hubspot vs activecampaign comparativo",
            intent: "commercial",
            estimated_difficulty: "médio",
            target_action: "Criar artigo aprofundado com tabela de preços",
          },
          {
            keyword: "melhor software de automação no-code",
            intent: "commercial",
            estimated_difficulty: "médio-baixo",
            target_action: "Comparar Make com Zapier",
          },
        ],
        content_recommendations: [
          "Criar guia de comparação entre HubSpot e concorrentes de CRM.",
          "Estruturar páginas dedicadas de alternativas para ferramentas com planos caros.",
        ],
      },
      tokensUsed: aiResult.tokensUsed,
    };
  }
}
