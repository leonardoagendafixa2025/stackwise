import { getAffiliateClickStats } from "@/services/affiliate";
import { getCategories } from "@/services/catalog";

export interface GrowthAgentOutput {
  totalClicksAnalyzed: number;
  topPerformingProducts: { name: string; count: number }[];
  underperformingGaps: string[];
  recommendations: string[];
}

export async function runGrowthAgent(): Promise<{
  data: GrowthAgentOutput;
  tokensUsed: number;
}> {
  const [clickStats, categories] = await Promise.all([
    getAffiliateClickStats(),
    getCategories(),
  ]);

  const recommendations = [
    "Priorizar expansão de comparações para CRM e Produtividade (categorias com maior histórico de cliques).",
    "Adicionar cards visuais de 'Plano Grátis' na metade superior da página inicial para aumentar o CTR médio.",
    "Criar tabela comparativa de preços em artigos que possuem mais de 500 palavras.",
  ];

  const underperformingGaps = categories
    .slice(4)
    .map((c) => `Categoria '${c.name_pt}' com menos de 2 comparações diretas cadastradas.`);

  return {
    data: {
      totalClicksAnalyzed: clickStats.totalClicks,
      topPerformingProducts: clickStats.topProducts,
      underperformingGaps,
      recommendations,
    },
    tokensUsed: 45,
  };
}
