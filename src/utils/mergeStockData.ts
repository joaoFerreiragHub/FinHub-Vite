// src/utils/mergeStockData.ts
import { StockData } from '../types/stocks'

export function mergeStockData(stockData: StockData, quickData: any): StockData {
  return {
    ...stockData,

    // Campos principais
    ...(quickData.name && { name: quickData.name }),
    ...(quickData.symbol && { symbol: quickData.symbol }),
    ...(quickData.image && { image: quickData.image }),
    ...(quickData.industry && { industry: quickData.industry }),
    ...(quickData.sector && { sector: quickData.sector }),
    ...(quickData.price && { price: quickData.price }),
    ...(quickData.marketCap && { marketCap: quickData.marketCap.toString() }),
    ...(quickData.enterpriseValue && { enterpriseValue: quickData.enterpriseValue.toString() }),
    ...(quickData.companyName && { companyName: quickData.companyName }),

    // Scores e Valuation
    ...(quickData.valuationGrade && { valuationGrade: quickData.valuationGrade }),
    ...(quickData.qualityScore && { qualityScore: quickData.qualityScore }),
    ...(quickData.growthScore && { growthScore: quickData.growthScore }),
    ...(quickData.riskScore && { riskScore: quickData.riskScore }),

    // Valuation
    ...(quickData.eps && { eps: quickData.eps.toString() }),
    ...(quickData.pe && { pe: quickData.pe.toString() }),
    ...(quickData.pegRatio && { pegRatio: quickData.pegRatio.toString() }),
    ...(quickData.dcf && { dcf: quickData.dcf.toString() }),
    ...(quickData.leveredDCF && { leveredDCF: quickData.leveredDCF.toString() }),
    ...(quickData.freeCashFlow && { freeCashFlow: quickData.freeCashFlow.toString() }),

    // Rentabilidade
    ...(quickData.ebitda && { ebitda: quickData.ebitda.toString() }),
    ...(quickData.lucroLiquido && { lucroLiquido: quickData.lucroLiquido.toString() }),
    ...(quickData.margemEbitda && { margemEbitda: quickData.margemEbitda.toString() }),
    ...(quickData.margemBruta && { margemBruta: quickData.margemBruta.toString() }),
    ...(quickData.margemLiquida && { margemLiquida: quickData.margemLiquida.toString() }),
    ...(quickData.netProfitMargin && { netProfitMargin: quickData.netProfitMargin.toString() }),
    ...(quickData.roe && { roe: quickData.roe.toString() }),
    ...(quickData.roic && { roic: quickData.roic.toString() }),
    ...(quickData.cagrEps && { cagrEps: quickData.cagrEps.toString() }),
    ...(quickData.epsGrowth5Y && { epsGrowth5Y: quickData.epsGrowth5Y.toString() }),
    ...(quickData.ebitdaGrowth5Y && { ebitdaGrowth5Y: quickData.ebitdaGrowth5Y.toString() }),

    // Dividendos
    ...(quickData.dividendYield && { dividendYield: quickData.dividendYield.toString() }),
    ...(quickData.dividend_pershare && { dividend_pershare: quickData.dividend_pershare.toString() }),
    ...(quickData.payoutRatio && { payoutRatio: quickData.payoutRatio.toString() }),

    // Saúde financeira
    ...(quickData.debtToEquity && { debtToEquity: quickData.debtToEquity.toString() }),
    ...(quickData.currentRatio && { currentRatio: quickData.currentRatio.toString() }),
    ...(quickData.cash && { cash: quickData.cash.toString() }),
    ...(quickData.interestCoverage && { interestCoverage: quickData.interestCoverage.toString() }),

    // Dívida
    ...(quickData.netDebt && { netDebt: quickData.netDebt.toString() }),
    ...(quickData.totalDebt && { totalDebt: quickData.totalDebt.toString() }),
    ...(quickData.interestExpense && { interestExpense: quickData.interestExpense.toString() }),
    ...(quickData.cashRatio && { cashRatio: quickData.cashRatio.toString() }),
    ...(quickData.debtToEBITDA && { debtToEBITDA: quickData.debtToEBITDA.toString() }),
    ...(quickData.netDebtToEBITDA && { netDebtToEBITDA: quickData.netDebtToEBITDA.toString() }),

    // Riscos e custos
    ...(quickData.riskFreeRate && { riskFreeRate: quickData.riskFreeRate.toString() }),
    ...(quickData.marketRiskPremium && { marketRiskPremium: quickData.marketRiskPremium.toString() }),
    ...(quickData.beta && { beta: quickData.beta.toString() }),
    ...(quickData.costOfEquity && { costOfEquity: quickData.costOfEquity.toString() }),
    ...(quickData.costOfDebt && { costOfDebt: quickData.costOfDebt.toString() }),
    ...(quickData.effectiveTaxRate && { effectiveTaxRate: quickData.effectiveTaxRate.toString() }),
    ...(quickData.wacc && { wacc: quickData.wacc.toString() }),

    // Crescimento
    ...(quickData.receita && { receita: quickData.receita.toString() }),
    ...(quickData.receitaPorAcao && { receitaPorAcao: quickData.receitaPorAcao.toString() }),
    ...(quickData.receitaCagr3y && { receitaCagr3y: quickData.receitaCagr3y.toString() }),
    ...(quickData.receitaGrowth5y && { receitaGrowth5y: quickData.receitaGrowth5y.toString() }),
    ...(quickData.lucro && { lucro: quickData.lucro.toString() }),
    ...(quickData.lucroPorAcao && { lucroPorAcao: quickData.lucroPorAcao.toString() }),
    ...(quickData.lucroCagr3y && { lucroCagr3y: quickData.lucroCagr3y.toString() }),
    ...(quickData.lucroGrowth5y && { lucroGrowth5y: quickData.lucroGrowth5y.toString() }),

    // Institucional
    ...(quickData.ceo && { ceo: quickData.ceo }),
    ...(quickData.ipoDate && { ipoDate: quickData.ipoDate }),
    ...(quickData.fundacao && { fundacao: quickData.fundacao }),
    ...(quickData.employees && { employees: quickData.employees }),

    // Extras
    ...(quickData.description && { description: quickData.description }),
    ...(quickData.website && { website: quickData.website }),
    ...(quickData.address && { address: quickData.address }),
    ...(quickData.indicadores && { indicadores: quickData.indicadores }),
    ...(quickData.radarData && { radarData: quickData.radarData }),
    ...(quickData.radarPeers && { radarPeers: quickData.radarPeers }),
    ...(quickData.alerts && { alerts: quickData.alerts }),
    ...(quickData.peers && { peers: quickData.peers }),
    ...(quickData.peersQuotes && { peersQuotes: quickData.peersQuotes }),
  }
}
