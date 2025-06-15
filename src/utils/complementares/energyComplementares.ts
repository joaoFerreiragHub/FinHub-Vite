// src/utils/complementares/energyComplementares.ts

export interface EnergyComplementares {
  // Rentabilidade e Retorno
  pe: number
  peAnoAnterior: number
  pb: number
  pbAnoAnterior: number
  roe: number
  roeAnoAnterior: number
  roic: number
  roicAnoAnterior: number

  // Margens e Eficiência
  margemEbitda: number
  margemEbitdaAnoAnterior: number
  margemBruta: number
  margemBrutaAnoAnterior: number
  margemLiquida: number
  margemLiquidaAnoAnterior: number

  // Estrutura de Capital e Solvência
  dividaEbitda: number
  dividaEbitdaAnoAnterior: number
  coberturaJuros: number
  coberturaJurosAnoAnterior: number
  liquidezCorrente: number
  liquidezCorrenteAnoAnterior: number
  debtEquity: number
  debtEquityAnoAnterior: number

  // Fluxo de Caixa e Investimentos
  freeCashFlow: number
  freeCashFlowAnoAnterior: number
  capexRevenue: number
  capexRevenueAnoAnterior: number
  fcfYield: number
  fcfYieldAnoAnterior: number

  // Dividendos e Retorno
  dividendYield: number
  dividendYieldAnoAnterior: number
  payoutRatio: number
  payoutRatioAnoAnterior: number

  // Volatilidade e Avaliação
  beta: number
  betaAnoAnterior: number
  leveredDcf: number
  leveredDcfAnoAnterior: number
  precoAtual: number
  precoAtualAnoAnterior: number

  // Métricas Específicas de Energia
  reservasProvadas: number
  reservasProvadasAnoAnterior: number
  custoProducao: number
  custoProducaoAnoAnterior: number
  breakEvenPrice: number
  breakEvenPriceAnoAnterior: number
}

export interface RatingsEnergyProps {
  // Rentabilidade e Retorno
  pe: string
  peAnoAnterior?: string
  pb: string
  pbAnoAnterior?: string
  roe: string
  roeAnoAnterior?: string
  roic: string
  roicAnoAnterior?: string

  // Margens e Eficiência
  margemEbitda: string
  margemEbitdaAnoAnterior?: string
  margemBruta: string
  margemBrutaAnoAnterior?: string
  margemLiquida: string
  margemLiquidaAnoAnterior?: string

  // Estrutura de Capital e Solvência
  dividaEbitda: string
  dividaEbitdaAnoAnterior?: string
  coberturaJuros: string
  coberturaJurosAnoAnterior?: string
  liquidezCorrente: string
  liquidezCorrenteAnoAnterior?: string
  debtEquity: string
  debtEquityAnoAnterior?: string

  // Fluxo de Caixa e Investimentos
  freeCashFlow: string
  freeCashFlowAnoAnterior?: string
  capexRevenue: string
  capexRevenueAnoAnterior?: string
  fcfYield: string
  fcfYieldAnoAnterior?: string

  // Dividendos e Retorno
  dividendYield: string
  dividendYieldAnoAnterior?: string
  payoutRatio: string
  payoutRatioAnoAnterior?: string

  // Volatilidade e Avaliação
  beta: string
  betaAnoAnterior?: string
  leveredDcf: string
  leveredDcfAnoAnterior?: string
  precoAtual: string
  precoAtualAnoAnterior?: string

  // Métricas Específicas de Energia
  reservasProvadas?: string
  reservasProvadasAnoAnterior?: string
  custoProducao?: string
  custoProducaoAnoAnterior?: string
  breakEvenPrice?: string
  breakEvenPriceAnoAnterior?: string
}

/**
 * Constrói objeto de complementares específico para o setor Energy
 * Inclui APENAS indicadores relevantes para empresas de energia
 */
export function buildEnergyComplementares(
  props: RatingsEnergyProps,
): EnergyComplementares {
  const parseValue = (value: string | undefined): number => {
    if (!value || value === 'N/A' || value === 'undefined' || value.trim() === '') {
      return NaN
    }

    // ✅ IMPORTANTE: Não filtrar valores '0' válidos aqui
    if (value === '0' || value === '0.0' || value === '0.00') {
      return 0 // Zero é um valor válido
    }

    // Remove % e outros caracteres especiais
    const cleanValue = value.replace(/[%$,]/g, '').trim()

    // Trata valores negativos adequadamente
    if (cleanValue === '-' || cleanValue === '--' || cleanValue === '') {
      return NaN
    }

    const parsed = parseFloat(cleanValue)
    return isNaN(parsed) ? NaN : parsed
  }

  return {
    // Rentabilidade e Retorno
    pe: parseValue(props.pe),
    peAnoAnterior: parseValue(props.peAnoAnterior),
    pb: parseValue(props.pb),
    pbAnoAnterior: parseValue(props.pbAnoAnterior),
    roe: parseValue(props.roe),
    roeAnoAnterior: parseValue(props.roeAnoAnterior),
    roic: parseValue(props.roic),
    roicAnoAnterior: parseValue(props.roicAnoAnterior),

    // Margens e Eficiência
    margemEbitda: parseValue(props.margemEbitda),
    margemEbitdaAnoAnterior: parseValue(props.margemEbitdaAnoAnterior),
    margemBruta: parseValue(props.margemBruta),
    margemBrutaAnoAnterior: parseValue(props.margemBrutaAnoAnterior),
    margemLiquida: parseValue(props.margemLiquida),
    margemLiquidaAnoAnterior: parseValue(props.margemLiquidaAnoAnterior),

    // Estrutura de Capital e Solvência
    dividaEbitda: parseValue(props.dividaEbitda),
    dividaEbitdaAnoAnterior: parseValue(props.dividaEbitdaAnoAnterior),
    coberturaJuros: parseValue(props.coberturaJuros),
    coberturaJurosAnoAnterior: parseValue(props.coberturaJurosAnoAnterior),
    liquidezCorrente: parseValue(props.liquidezCorrente),
    liquidezCorrenteAnoAnterior: parseValue(props.liquidezCorrenteAnoAnterior),
    debtEquity: parseValue(props.debtEquity),
    debtEquityAnoAnterior: parseValue(props.debtEquityAnoAnterior),

    // Fluxo de Caixa e Investimentos
    freeCashFlow: parseValue(props.freeCashFlow),
    freeCashFlowAnoAnterior: parseValue(props.freeCashFlowAnoAnterior),
    capexRevenue: parseValue(props.capexRevenue),
    capexRevenueAnoAnterior: parseValue(props.capexRevenueAnoAnterior),
    fcfYield: parseValue(props.fcfYield),
    fcfYieldAnoAnterior: parseValue(props.fcfYieldAnoAnterior),

    // Dividendos e Retorno
    dividendYield: parseValue(props.dividendYield),
    dividendYieldAnoAnterior: parseValue(props.dividendYieldAnoAnterior),
    payoutRatio: parseValue(props.payoutRatio),
    payoutRatioAnoAnterior: parseValue(props.payoutRatioAnoAnterior),

    // Volatilidade e Avaliação
    beta: parseValue(props.beta),
    betaAnoAnterior: parseValue(props.betaAnoAnterior),
    leveredDcf: parseValue(props.leveredDcf),
    leveredDcfAnoAnterior: parseValue(props.leveredDcfAnoAnterior),
    precoAtual: parseValue(props.precoAtual),
    precoAtualAnoAnterior: parseValue(props.precoAtualAnoAnterior),

    // Métricas Específicas de Energia
    reservasProvadas: parseValue(props.reservasProvadas),
    reservasProvadasAnoAnterior: parseValue(props.reservasProvadasAnoAnterior),
    custoProducao: parseValue(props.custoProducao),
    custoProducaoAnoAnterior: parseValue(props.custoProducaoAnoAnterior),
    breakEvenPrice: parseValue(props.breakEvenPrice),
    breakEvenPriceAnoAnterior: parseValue(props.breakEvenPriceAnoAnterior),
  }
}

/**
 * Valida se os indicadores complementares necessários estão disponíveis
 */
export function validateEnergyComplementares(
  complementares: EnergyComplementares,
  requiredFields: (keyof EnergyComplementares)[],
): boolean {
  return requiredFields.every((field) => !isNaN(complementares[field]))
}

/**
 * Obtém um subset específico dos complementares para contexto de avaliação
 */
export function getEnergyComplementaresSubset(
  complementares: EnergyComplementares,
  fields: (keyof EnergyComplementares)[],
): Partial<EnergyComplementares> {
  const subset: Partial<EnergyComplementares> = {}

  fields.forEach((field) => {
    if (!isNaN(complementares[field])) {
      subset[field] = complementares[field]
    }
  })

  return subset
}

/**
 * Verifica se um indicador tem dados suficientes para análise
 */
export function hasValidData(complementares: EnergyComplementares, field: keyof EnergyComplementares): boolean {
  return !isNaN(complementares[field]) && complementares[field] !== null && complementares[field] !== undefined
}

/**
 * Obtém um valor seguro (retorna 0 se inválido)
 */
export function getSafeValue(complementares: EnergyComplementares, field: keyof EnergyComplementares): number {
  const value = complementares[field]
  return isNaN(value) ? 0 : value
}

/**
 * Indicadores core obrigatórios para análise de empresas de energia
 */
export const ENERGY_CORE_INDICATORS: (keyof EnergyComplementares)[] = [
  'margemEbitda',
  'roic',
  'dividaEbitda',
  'liquidezCorrente',
  'freeCashFlow',
  'pe',
  'dividendYield',
]

/**
 * Indicadores de rentabilidade específicos para energia
 */
export const ENERGY_PROFITABILITY_INDICATORS: (keyof EnergyComplementares)[] = [
  'margemEbitda',
  'roic',
  'roe',
  'margemLiquida',
  'margemBruta',
]

/**
 * Indicadores de eficiência operacional para energia
 */
export const ENERGY_EFFICIENCY_INDICATORS: (keyof EnergyComplementares)[] = [
  'custoProducao',
  'breakEvenPrice',
  'margemEbitda',
  'capexRevenue',
]

/**
 * Indicadores de estrutura financeira para energia
 */
export const ENERGY_FINANCIAL_INDICATORS: (keyof EnergyComplementares)[] = [
  'dividaEbitda',
  'coberturaJuros',
  'liquidezCorrente',
  'freeCashFlow',
  'debtEquity',
]

/**
 * Indicadores de avaliação para energia
 */
export const ENERGY_VALUATION_INDICATORS: (keyof EnergyComplementares)[] = [
  'pe',
  'pb',
  'fcfYield',
  'leveredDcf',
]

/**
 * Indicadores de risco para energia
 */
export const ENERGY_RISK_INDICATORS: (keyof EnergyComplementares)[] = [
  'beta',
  'dividaEbitda',
  'coberturaJuros',
  'liquidezCorrente',
]

/**
 * Indicadores específicos do setor energia
 */
export const ENERGY_SECTOR_SPECIFIC_INDICATORS: (keyof EnergyComplementares)[] = [
  'reservasProvadas',
  'custoProducao',
  'breakEvenPrice',
  'capexRevenue',
  'fcfYield',
]
