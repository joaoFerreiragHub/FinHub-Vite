// src/utils/industrialsCalculations.ts

import { IndustrialsComplementares } from "./complementares/industrialsComplementares"

/**
 * Calcula score de eficiência operacional baseado em rotatividade e giro
 */
export function calculateEfficiencyScore(complementares: IndustrialsComplementares): number {
  const rotatividadeEstoques = complementares.rotatividadeEstoques
  const giroAtivo = complementares.giroAtivo
  const margemEbitda = complementares.margemEbitda

  let score = 50 // Base
  let factors = 0

  // Rotatividade de estoques alta = mais eficiente
  if (!isNaN(rotatividadeEstoques)) {
    if (rotatividadeEstoques > 10) score += 25
    else if (rotatividadeEstoques > 6) score += 20
    else if (rotatividadeEstoques > 4) score += 10
    else if (rotatividadeEstoques > 2) score += 5
    else score -= 10
    factors++
  }

  // Giro do ativo eficiente
  if (!isNaN(giroAtivo)) {
    if (giroAtivo > 1.5) score += 20
    else if (giroAtivo > 1.2) score += 15
    else if (giroAtivo > 0.8) score += 10
    else if (giroAtivo > 0.5) score += 5
    else score -= 5
    factors++
  }

  // Margem EBITDA como indicador de eficiência
  if (!isNaN(margemEbitda)) {
    if (margemEbitda > 25) score += 15
    else if (margemEbitda > 20) score += 10
    else if (margemEbitda > 15) score += 5
    else if (margemEbitda < 10) score -= 10
    factors++
  }

  return Math.min(Math.max(factors > 0 ? score : 50, 0), 100)
}

/**
 * Calcula qualidade dos ativos baseado em ROIC e eficiência
 */
export function calculateCapitalQuality(complementares: IndustrialsComplementares): number {
  const roic = complementares.roic
  const giroAtivo = complementares.giroAtivo
  const margemEbitda = complementares.margemEbitda
  const alavancagem = complementares.alavancagem

  let score = 50 // Base
  let factors = 0

  // ROIC alto = ativos de qualidade
  if (!isNaN(roic)) {
    if (roic > 20) score += 25
    else if (roic > 15) score += 20
    else if (roic > 10) score += 15
    else if (roic > 5) score += 5
    else score -= 15
    factors++
  }

  // Giro do ativo complementa ROIC
  if (!isNaN(giroAtivo)) {
    if (giroAtivo > 1.2) score += 15
    else if (giroAtivo > 0.8) score += 10
    else if (giroAtivo > 0.5) score += 5
    factors++
  }

  // Margem EBITDA indica qualidade operacional
  if (!isNaN(margemEbitda)) {
    if (margemEbitda > 20) score += 10
    else if (margemEbitda > 15) score += 8
    else if (margemEbitda > 10) score += 5
    factors++
  }

  // Alavancagem baixa preserva qualidade
  if (!isNaN(alavancagem)) {
    if (alavancagem < 1.5) score += 10
    else if (alavancagem < 2.5) score += 5
    else if (alavancagem > 4) score -= 10
    factors++
  }

  return Math.min(Math.max(factors > 0 ? score : 50, 0), 100)
}

/**
 * Calcula ciclo operacional estimado em dias
 */
export function calculateOperationalCycle(complementares: IndustrialsComplementares): number {
  const rotatividadeEstoques = complementares.rotatividadeEstoques

  // Se temos rotatividade de estoques, calcular ciclo
  if (!isNaN(rotatividadeEstoques) && rotatividadeEstoques > 0) {
    const diasEstoque = 365 / rotatividadeEstoques
    // Estimar dias de recebimento (típico para industriais: 45-60 dias)
    const diasRecebimento = 50
    // Estimar dias de pagamento (típico: 30-45 dias)
    const diasPagamento = 35

    return Math.round(diasEstoque + diasRecebimento - diasPagamento)
  }

  // Se não temos dados, estimar baseado na eficiência geral
  const giroAtivo = complementares.giroAtivo
  const margemEbitda = complementares.margemEbitda

  let cicloEstimado = 75 // Base para industriais

  if (!isNaN(giroAtivo)) {
    if (giroAtivo > 1.5) cicloEstimado -= 20
    else if (giroAtivo > 1.0) cicloEstimado -= 10
    else if (giroAtivo < 0.5) cicloEstimado += 20
  }

  if (!isNaN(margemEbitda)) {
    if (margemEbitda > 20) cicloEstimado -= 10
    else if (margemEbitda < 10) cicloEstimado += 15
  }

  return Math.max(cicloEstimado, 15) // Mínimo 15 dias
}

/**
 * Calcula score de alavancagem operacional
 */
export function calculateOperationalLeverage(complementares: IndustrialsComplementares): number {
  const margemEbitda = complementares.margemEbitda
  const alavancagem = complementares.alavancagem
  const coberturaJuros = complementares.coberturaJuros

  let score = 50 // Base
  let factors = 0

  // Margem EBITDA alta permite maior alavancagem
  if (!isNaN(margemEbitda)) {
    if (margemEbitda > 25) score += 20
    else if (margemEbitda > 20) score += 15
    else if (margemEbitda > 15) score += 10
    else if (margemEbitda < 10) score -= 15
    factors++
  }

  // Alavancagem moderada é ideal
  if (!isNaN(alavancagem)) {
    if (alavancagem < 1.5) score += 10
    else if (alavancagem < 2.5) score += 15
    else if (alavancagem < 3.5) score += 5
    else score -= 15
    factors++
  }

  // Cobertura de juros robusta é crítica
  if (!isNaN(coberturaJuros)) {
    if (coberturaJuros > 8) score += 15
    else if (coberturaJuros > 5) score += 10
    else if (coberturaJuros > 3) score += 5
    else if (coberturaJuros < 2) score -= 20
    factors++
  }

  return Math.min(Math.max(factors > 0 ? score : 50, 0), 100)
}

/**
 * Interface para scores consolidados de Industrials
 */
export interface IndustrialsScores {
  efficiencyScore: number
  capitalQuality: number
  operationalCycle: number
  operationalLeverage: number
}

/**
 * Calcula todos os scores de Industrials de uma vez
 */
export function calculateAllIndustrialsScores(
  complementares: IndustrialsComplementares
): IndustrialsScores {
  return {
    efficiencyScore: calculateEfficiencyScore(complementares),
    capitalQuality: calculateCapitalQuality(complementares),
    operationalCycle: calculateOperationalCycle(complementares),
    operationalLeverage: calculateOperationalLeverage(complementares),
  }
}

/**
 * Calcula score geral consolidado de Industrials
 * Peso: Qualidade Capital (40%) + Eficiência (30%) + Alavancagem Operacional (30%)
 */
export function calculateOverallIndustrialsScore(
  complementares: IndustrialsComplementares
): number {
  const scores = calculateAllIndustrialsScores(complementares)

  // Pesos específicos para Industrials
  const pesoQualidade = 0.4      // Qualidade dos ativos é crítica
  const pesoEficiencia = 0.3     // Eficiência operacional importante
  const pesoAlavancagem = 0.3    // Alavancagem operacional relevante

  return Math.round(
    scores.capitalQuality * pesoQualidade +
    scores.efficiencyScore * pesoEficiencia +
    scores.operationalLeverage * pesoAlavancagem
  )
}
