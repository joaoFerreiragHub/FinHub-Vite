import { StockData } from '@/features/tools/stocks/types/stocks'

export function mapCompanyDataToScoresSummary(data: StockData) {
  return {
    qualidadeScore: data.qualityScore ?? 0, // já vem 0–10 do backend (Piotroski)
    crescimentoScore: data.growthScore ?? 0,
    valuationGrade: data.valuationGrade ?? 'C',
    riscoScore: Math.round(data.riskScore ?? 0), // Altman, simplificado no backend para 0–10
  }
}
