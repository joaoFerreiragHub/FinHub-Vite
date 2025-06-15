// src/utils/consumerDefensiveCalculations.ts

import { ConsumerDefensiveComplementares } from "./complementares/consumerDefensiveComplementares"

/**
 * Calcula score de estabilidade baseado em múltiplos fatores
 */
export function calculateEstabilidade(complementares: ConsumerDefensiveComplementares): number {
  const beta = complementares.beta
  const dividendYield = complementares.dividendYield
  const payoutRatio = complementares.payoutRatio
  const consistencia = complementares.consistenciaReceita
  const cobertura = complementares.coberturaJuros

  let score = 50 // Base
  let factors = 0

  // Beta baixo = mais estável
  if (!isNaN(beta)) {
    if (beta < 0.6) score += 20
    else if (beta < 0.8) score += 15
    else if (beta < 1.0) score += 10
    else if (beta < 1.2) score += 5
    else score -= 10
    factors++
  }

  // Dividend yield atrativo mas sustentável
  if (!isNaN(dividendYield)) {
    if (dividendYield > 3 && dividendYield < 8) score += 15
    else if (dividendYield > 2 && dividendYield < 10) score += 10
    else if (dividendYield > 1) score += 5
    factors++
  }

  // Payout conservador
  if (!isNaN(payoutRatio)) {
    if (payoutRatio < 50) score += 15
    else if (payoutRatio < 65) score += 10
    else if (payoutRatio < 80) score += 5
    else score -= 10
    factors++
  }

  // Consistência de receita
  if (!isNaN(consistencia)) {
    if (consistencia > 90) score += 20
    else if (consistencia > 85) score += 15
    else if (consistencia > 75) score += 10
    else if (consistencia > 65) score += 5
    factors++
  }

  // Cobertura de juros
  if (!isNaN(cobertura)) {
    if (cobertura > 8) score += 10
    else if (cobertura > 5) score += 8
    else if (cobertura > 3) score += 5
    else score -= 5
    factors++
  }

  return Math.min(Math.max(factors > 0 ? score : 50, 0), 100)
}

/**
 * Calcula qualidade defensiva baseado em rentabilidade e margens
 */
export function calculateQualidadeDefensiva(complementares: ConsumerDefensiveComplementares): number {
  const grossMargin = complementares.grossMargin
  const roe = complementares.roe
  const roic = complementares.roic
  const crescimento = complementares.receitaCagr3y
  const marketShare = complementares.marketShare

  let score = 50 // Base
  let factors = 0

  // Margem bruta forte
  if (!isNaN(grossMargin)) {
    if (grossMargin > 45) score += 20
    else if (grossMargin > 35) score += 15
    else if (grossMargin > 25) score += 10
    else if (grossMargin > 20) score += 5
    else score -= 10
    factors++
  }

  // ROE sólido
  if (!isNaN(roe)) {
    if (roe > 20) score += 20
    else if (roe > 15) score += 15
    else if (roe > 12) score += 10
    else if (roe > 8) score += 5
    else score -= 5
    factors++
  }

  // ROIC demonstra vantagem competitiva
  if (!isNaN(roic)) {
    if (roic > 15) score += 15
    else if (roic > 12) score += 12
    else if (roic > 8) score += 8
    else if (roic > 5) score += 5
    factors++
  }

  // Crescimento moderado mas consistente
  if (!isNaN(crescimento)) {
    if (crescimento > 8 && crescimento < 20) score += 15
    else if (crescimento > 5) score += 10
    else if (crescimento > 3) score += 8
    else if (crescimento > 0) score += 5
    factors++
  }

  // Market share significativo
  if (!isNaN(marketShare)) {
    if (marketShare > 25) score += 10
    else if (marketShare > 15) score += 8
    else if (marketShare > 10) score += 5
    else if (marketShare > 5) score += 3
    factors++
  }

  return Math.min(Math.max(factors > 0 ? score : 50, 0), 100)
}

/**
 * Calcula sustentabilidade de dividendos
 */
export function calculateSustentabilidadeDividendos(complementares: ConsumerDefensiveComplementares): number {
  const payoutRatio = complementares.payoutRatio
  const dividendYield = complementares.dividendYield
  const freeCashFlow = complementares.freeCashFlow
  const cobertura = complementares.coberturaJuros
  const yearsOfDividends = complementares.yearsOfDividends

  let score = 50 // Base
  let factors = 0

  // Payout ratio sustentável
  if (!isNaN(payoutRatio)) {
    if (payoutRatio < 40) score += 20
    else if (payoutRatio < 55) score += 15
    else if (payoutRatio < 70) score += 10
    else if (payoutRatio < 85) score += 5
    else score -= 15
    factors++
  }

  // Yield atrativo mas não excessivo
  if (!isNaN(dividendYield)) {
    if (dividendYield > 2.5 && dividendYield < 6) score += 15
    else if (dividendYield > 1.5 && dividendYield < 8) score += 10
    else if (dividendYield > 1) score += 5
    else if (dividendYield > 8) score -= 10 // Muito alto pode ser insustentável
    factors++
  }

  // Free cash flow robusto
  if (!isNaN(freeCashFlow)) {
    if (freeCashFlow > 1000000000) score += 15 // >1B
    else if (freeCashFlow > 500000000) score += 12 // >500M
    else if (freeCashFlow > 100000000) score += 8 // >100M
    else if (freeCashFlow > 0) score += 5
    else score -= 20 // FCF negativo é crítico
    factors++
  }

  // Cobertura de juros
  if (!isNaN(cobertura)) {
    if (cobertura > 10) score += 10
    else if (cobertura > 6) score += 8
    else if (cobertura > 3) score += 5
    else score -= 10
    factors++
  }

  // Histórico de dividendos
  if (!isNaN(yearsOfDividends)) {
    if (yearsOfDividends > 25) score += 15
    else if (yearsOfDividends > 15) score += 12
    else if (yearsOfDividends > 10) score += 8
    else if (yearsOfDividends > 5) score += 5
    factors++
  }

  return Math.min(Math.max(factors > 0 ? score : 50, 0), 100)
}

/**
 * Interface para scores consolidados de Consumer Defensive
 */
export interface ConsumerDefensiveScores {
  estabilidade: number
  qualidadeDefensiva: number
  sustentabilidadeDividendos: number
}

/**
 * Calcula todos os scores de Consumer Defensive de uma vez
 */
export function calculateAllConsumerDefensiveScores(
  complementares: ConsumerDefensiveComplementares
): ConsumerDefensiveScores {
  return {
    estabilidade: calculateEstabilidade(complementares),
    qualidadeDefensiva: calculateQualidadeDefensiva(complementares),
    sustentabilidadeDividendos: calculateSustentabilidadeDividendos(complementares),
  }
}

/**
 * Calcula score geral consolidado de Consumer Defensive
 * Peso: Sustentabilidade Dividendos (40%) + Qualidade Defensiva (35%) + Estabilidade (25%)
 */
export function calculateOverallConsumerDefensiveScore(
  complementares: ConsumerDefensiveComplementares
): number {
  const scores = calculateAllConsumerDefensiveScores(complementares)

  // Pesos específicos para Consumer Defensive
  const pesoSustentabilidade = 0.4  // Dividendos são críticos
  const pesoQualidade = 0.35        // Qualidade defensiva importante
  const pesoEstabilidade = 0.25     // Estabilidade também relevante

  return Math.round(
    scores.sustentabilidadeDividendos * pesoSustentabilidade +
    scores.qualidadeDefensiva * pesoQualidade +
    scores.estabilidade * pesoEstabilidade
  )
}
