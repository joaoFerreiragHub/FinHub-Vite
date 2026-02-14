// src/utils/energyCalculations.ts

import { EnergyComplementares } from "./complementares/energyComplementares"

/**
 * Calcula score de eficiência operacional baseado em margens e custos
 */
export function calculateEnergyEfficiency(complementares: EnergyComplementares): number {
  const margemEbitda = complementares.margemEbitda
  const roic = complementares.roic
  const custoProducao = complementares.custoProducao
  const breakEvenPrice = complementares.breakEvenPrice

  let score = 50 // Base
  let factors = 0

  // Margem EBITDA alta indica eficiência operacional
  if (!isNaN(margemEbitda)) {
    if (margemEbitda > 30) score += 25
    else if (margemEbitda > 25) score += 20
    else if (margemEbitda > 20) score += 15
    else if (margemEbitda > 15) score += 10
    else if (margemEbitda < 10) score -= 15
    factors++
  }

  // ROIC alto indica uso eficiente do capital
  if (!isNaN(roic)) {
    if (roic > 15) score += 20
    else if (roic > 12) score += 15
    else if (roic > 8) score += 10
    else if (roic > 5) score += 5
    else score -= 10
    factors++
  }

  // Custo de produção baixo é competitivo
  if (!isNaN(custoProducao)) {
    if (custoProducao < 30) score += 15
    else if (custoProducao < 40) score += 10
    else if (custoProducao < 50) score += 5
    else if (custoProducao > 70) score -= 15
    factors++
  }

  // Break-even baixo oferece flexibilidade
  if (!isNaN(breakEvenPrice)) {
    if (breakEvenPrice < 40) score += 15
    else if (breakEvenPrice < 50) score += 10
    else if (breakEvenPrice < 60) score += 5
    else if (breakEvenPrice > 80) score -= 15
    factors++
  }

  return Math.min(Math.max(factors > 0 ? score : 50, 0), 100)
}

/**
 * Calcula solidez financeira baseado em endividamento e cobertura
 */
export function calculateFinancialSolidity(complementares: EnergyComplementares): number {
  const dividaEbitda = complementares.dividaEbitda
  const coberturaJuros = complementares.coberturaJuros
  const liquidezCorrente = complementares.liquidezCorrente
  const debtEquity = complementares.debtEquity

  let score = 50 // Base
  let factors = 0

  // Endividamento baixo é mais seguro
  if (!isNaN(dividaEbitda)) {
    if (dividaEbitda < 1.5) score += 25
    else if (dividaEbitda < 2) score += 20
    else if (dividaEbitda < 2.5) score += 10
    else if (dividaEbitda < 3) score += 5
    else if (dividaEbitda > 4) score -= 20
    factors++
  }

  // Cobertura de juros alta oferece segurança
  if (!isNaN(coberturaJuros)) {
    if (coberturaJuros > 8) score += 20
    else if (coberturaJuros > 5) score += 15
    else if (coberturaJuros > 3) score += 10
    else if (coberturaJuros > 2) score += 5
    else score -= 15
    factors++
  }

  // Liquidez adequada é importante
  if (!isNaN(liquidezCorrente)) {
    if (liquidezCorrente > 1.8) score += 15
    else if (liquidezCorrente > 1.5) score += 10
    else if (liquidezCorrente > 1.2) score += 5
    else score -= 10
    factors++
  }

  // Debt/Equity moderado
  if (!isNaN(debtEquity)) {
    if (debtEquity < 0.4) score += 10
    else if (debtEquity < 0.8) score += 5
    else if (debtEquity > 1.5) score -= 10
    factors++
  }

  return Math.min(Math.max(factors > 0 ? score : 50, 0), 100)
}

/**
 * Calcula geração de caixa baseado em FCF e CapEx
 */
export function calculateCashGeneration(complementares: EnergyComplementares): number {
  const freeCashFlow = complementares.freeCashFlow
  const margemEbitda = complementares.margemEbitda
  const capexRevenue = complementares.capexRevenue
  const fcfYield = complementares.fcfYield

  let score = 50 // Base
  let factors = 0

  // FCF positivo é essencial
  if (!isNaN(freeCashFlow)) {
    if (freeCashFlow > 0) {
      if (freeCashFlow > 1000000000) score += 25 // >1B
      else if (freeCashFlow > 500000000) score += 20 // >500M
      else if (freeCashFlow > 100000000) score += 15 // >100M
      else score += 10
    } else {
      score -= 20
    }
    factors++
  }

  // Margem EBITDA alta facilita geração de caixa
  if (!isNaN(margemEbitda)) {
    if (margemEbitda > 30) score += 15
    else if (margemEbitda > 25) score += 10
    else if (margemEbitda > 20) score += 5
    else if (margemEbitda < 15) score -= 10
    factors++
  }

  // CapEx moderado deixa mais caixa livre
  if (!isNaN(capexRevenue)) {
    if (capexRevenue < 10) score += 15
    else if (capexRevenue < 15) score += 10
    else if (capexRevenue < 20) score += 5
    else if (capexRevenue > 30) score -= 15
    factors++
  }

  // FCF Yield alto é atrativo
  if (!isNaN(fcfYield)) {
    if (fcfYield > 10) score += 15
    else if (fcfYield > 8) score += 10
    else if (fcfYield > 6) score += 5
    else if (fcfYield < 3) score -= 10
    factors++
  }

  return Math.min(Math.max(factors > 0 ? score : 50, 0), 100)
}

/**
 * Interface para scores consolidados de Energy
 */
export interface EnergyScores {
  efficiencyScore: number
  solidityScore: number
  cashScore: number
}

/**
 * Calcula todos os scores de Energy de uma vez
 */
export function calculateAllEnergyScores(
  complementares: EnergyComplementares
): EnergyScores {
  return {
    efficiencyScore: calculateEnergyEfficiency(complementares),
    solidityScore: calculateFinancialSolidity(complementares),
    cashScore: calculateCashGeneration(complementares),
  }
}

/**
 * Calcula score geral consolidado de Energy
 * Peso: Geração Caixa (40%) + Solidez Financeira (35%) + Eficiência (25%)
 */
export function calculateOverallEnergyScore(
  complementares: EnergyComplementares
): number {
  const scores = calculateAllEnergyScores(complementares)

  // Pesos específicos para Energy (setor cíclico de commodities)
  const pesoCaixa = 0.4         // Geração de caixa é crítica
  const pesoSolidez = 0.35      // Solidez financeira importante para volatilidade
  const pesoEficiencia = 0.25   // Eficiência operacional relevante

  return Math.round(
    scores.cashScore * pesoCaixa +
    scores.solidityScore * pesoSolidez +
    scores.efficiencyScore * pesoEficiencia
  )
}
