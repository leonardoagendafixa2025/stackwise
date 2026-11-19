import { generateAIText } from "@/lib/ai/gemini";

export interface EditorialAgentInput {
  topic: string;
  primaryProductName?: string;
  locale?: "pt-br" | "en";
}

export interface EditorialAgentOutput {
  title: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  content_markdown: string;
  requires_human_approval: boolean;
}

export async function runEditorialAgent(input: EditorialAgentInput): Promise<{
  data: EditorialAgentOutput;
  tokensUsed: number;
}> {
  const isPt = input.locale !== "en";
  const prompt = `Atue como o AGENTE 3 — EDITORIAL da STACKWISE.
Você é um redator técnico sênior responsável por rascunhos de comparações e análises de softwares SaaS.

Tema solicitado: "${input.topic}".
Produto em foco: "${input.primaryProductName || "Geral"}".
Idioma: ${isPt ? "Português Brasileiro (pt-br)" : "English (en)"}.

DIRETRIZES ÉTICAS OBRIGATÓRIAS:
1. Não invente testes realizados pessoalmente.
2. Não invente preços ou avaliações de terceiros.
3. Não copie integralmente textos de fabricantes.
4. Diferencie fatos confirmados de análises editoriais.
5. Retorne OBRIGATORIAMENTE em JSON:
   - "title": string (Título editorial claro)
   - "slug": string (Slug URL amigável)
   - "meta_title": string (Máx 60 caracteres)
   - "meta_description": string (Máx 155 caracteres)
   - "content_markdown": string (Texto estruturado com seções ##, listas - e análise técnica)
   - "requires_human_approval": true`;

  const aiResult = await generateAIText({
    prompt,
    jsonMode: true,
    temperature: 0.3,
  });

  try {
    const parsed = JSON.parse(aiResult.text);
    return {
      data: {
        ...parsed,
        requires_human_approval: true,
      },
      tokensUsed: aiResult.tokensUsed,
    };
  } catch {
    const slug = input.topic
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-");

    return {
      data: {
        title: input.topic,
        slug: slug || "analise-editorial",
        meta_title: `${input.topic} | STACKWISE`,
        meta_description: `Análise estruturada e imparcial sobre ${input.topic} produzida pela equipe STACKWISE.`,
        content_markdown: `## Visão Geral\n\nRascunho estruturado sobre ${input.topic}.\n\n## Pontos Críticos para Avaliação\n\n- Estrutura de preços e modelo de cobrança.\n- Facilidade de uso e curva de implementação.\n- Limitações documentadas oficialmente.\n\n## Conclusão Técnica\n\nAvalie os requisitos da sua equipe antes de assinar planos anuais.`,
        requires_human_approval: true,
      },
      tokensUsed: aiResult.tokensUsed,
    };
  }
}
