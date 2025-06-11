// src/utils/complementares/utilitiesComplementares.ts

export interface UtilitiesComplementares {
  // Múltiplos de Valuation
  pl: number
  plAnoAnterior: number
  pb: number
  pbAnoAnterior: number
  ps: number
  psAnoAnterior: number
  earningsYield: number
  earningsYieldAnoAnterior: number

  // Rentabilidade
  roe: number
  roeAnoAnterior: number
  roic: number
  roicAnoAnterior: number
  margemEbitda: number
  margemEbitdaAnoAnterior: number
  margemOperacional: number
  margemOperacionalAnoAnterior: number
  margemLiquida: number
  margemLiquidaAnoAnterior: number

  // Dividendos e Distribuições
  dividendYield: number
  dividendYieldAnoAnterior: number
  payoutRatio: number
  payoutRatioAnoAnterior: number
  dividendCagr5y: number
  dividendCagr5yAnoAnterior: number

  // Estrutura Financeira
  endividamento: number
  endividamentoAnoAnterior: number
  debtToEbitda: number
  debtToEbitdaAnoAnterior: number
  coberturaJuros: number
  coberturaJurosAnoAnterior: number
  liquidezCorrente: number
  liquidezCorrenteAnoAnterior: number

  // Eficiência Operacional
  giroAtivo: number
  giroAtivoAnoAnterior: number
  capexOverRevenue: number
  capexOverRevenueAnoAnterior: number

  // Crescimento
  crescimentoReceita: number
  crescimentoReceitaAnoAnterior: number
  crescimentoEps: number
  crescimentoEpsAnoAnterior: number

  // Valuation vs Fundamentals
  leveredDcf: number
  precoAtual: number
  fcf: number
  fcfAnoAnterior: number
}

export interface RatingsUtilitiesProps {
  // Múltiplos de Valuation
  pl: string
  plAnoAnterior?: string
  pb: string
  pbAnoAnterior?: string
  ps: string
  psAnoAnterior?: string
  earningsYield: string
  earningsYieldAnoAnterior?: string

  // Rentabilidade
  roe: string
  roeAnoAnterior?: string
  roic: string
  roicAnoAnterior?: string
  margemEbitda: string
  margemEbitdaAnoAnterior?: string
  margemOperacional: string
  margemOperacionalAnoAnterior?: string
  margemLiquida: string
  margemLiquidaAnoAnterior?: string

  // Dividendos e Distribuições
  dividendYield: string
  dividendYieldAnoAnterior?: string
  payoutRatio: string
  payoutRatioAnoAnterior?: string
  dividendCagr5y: string
  dividendCagr5yAnoAnterior?: string

  // Estrutura Financeira
  endividamento: string
  endividamentoAnoAnterior?: string
  debtToEbitda: string
  debtToEbitdaAnoAnterior?: string
  coberturaJuros: string
  coberturaJurosAnoAnterior?: string
  liquidezCorrente: string
  liquidezCorrenteAnoAnterior?: string

  // Eficiência Operacional
  giroAtivo: string
  giroAtivoAnoAnterior?: string
  capexOverRevenue: string
  capexOverRevenueAnoAnterior?: string

  // Crescimento
  crescimentoReceita: string
  crescimentoReceitaAnoAnterior?: string
  crescimentoEps: string
  crescimentoEpsAnoAnterior?: string

  // Valuation vs Fundamentals
  leveredDcf: string
  precoAtual: string
  fcf?: string
  fcfAnoAnterior?: string
}

/**
 * Constrói objeto de complementares específico para o setor Utilities
 * Inclui APENAS indicadores relevantes para empresas de serviços públicos
 */
export function buildUtilitiesComplementares(
  props: RatingsUtilitiesProps,
): UtilitiesComplementares {
  const parseValue = (value: string | undefined): number => {
    if (!value || value === 'N/A' || value === 'undefined' || value === '0') return NaN

    // Remove % se existir
    const cleanValue = value.replace('%', '').trim()
    const parsed = parseFloat(cleanValue)

    return isNaN(parsed) ? NaN : parsed
  }

  return {
    // Múltiplos de Valuation
    pl: parseValue(props.pl),
    plAnoAnterior: parseValue(props.plAnoAnterior),
    pb: parseValue(props.pb),
    pbAnoAnterior: parseValue(props.pbAnoAnterior),
    ps: parseValue(props.ps),
    psAnoAnterior: parseValue(props.psAnoAnterior),
    earningsYield: parseValue(props.earningsYield),
    earningsYieldAnoAnterior: parseValue(props.earningsYieldAnoAnterior),

    // Rentabilidade
    roe: parseValue(props.roe),
    roeAnoAnterior: parseValue(props.roeAnoAnterior),
    roic: parseValue(props.roic),
    roicAnoAnterior: parseValue(props.roicAnoAnterior),
    margemEbitda: parseValue(props.margemEbitda),
    margemEbitdaAnoAnterior: parseValue(props.margemEbitdaAnoAnterior),
    margemOperacional: parseValue(props.margemOperacional),
    margemOperacionalAnoAnterior: parseValue(props.margemOperacionalAnoAnterior),
    margemLiquida: parseValue(props.margemLiquida),
    margemLiquidaAnoAnterior: parseValue(props.margemLiquidaAnoAnterior),

    // Dividendos e Distribuições
    dividendYield: parseValue(props.dividendYield),
    dividendYieldAnoAnterior: parseValue(props.dividendYieldAnoAnterior),
    payoutRatio: parseValue(props.payoutRatio),
    payoutRatioAnoAnterior: parseValue(props.payoutRatioAnoAnterior),
    dividendCagr5y: parseValue(props.dividendCagr5y),
    dividendCagr5yAnoAnterior: parseValue(props.dividendCagr5yAnoAnterior),

    // Estrutura Financeira
    endividamento: parseValue(props.endividamento),
    endividamentoAnoAnterior: parseValue(props.endividamentoAnoAnterior),
    debtToEbitda: parseValue(props.debtToEbitda),
    debtToEbitdaAnoAnterior: parseValue(props.debtToEbitdaAnoAnterior),
    coberturaJuros: parseValue(props.coberturaJuros),
    coberturaJurosAnoAnterior: parseValue(props.coberturaJurosAnoAnterior),
    liquidezCorrente: parseValue(props.liquidezCorrente),
    liquidezCorrenteAnoAnterior: parseValue(props.liquidezCorrenteAnoAnterior),

    // Eficiência Operacional
    giroAtivo: parseValue(props.giroAtivo),
    giroAtivoAnoAnterior: parseValue(props.giroAtivoAnoAnterior),
    capexOverRevenue: parseValue(props.capexOverRevenue),
    capexOverRevenueAnoAnterior: parseValue(props.capexOverRevenueAnoAnterior),

    // Crescimento
    crescimentoReceita: parseValue(props.crescimentoReceita),
    crescimentoReceitaAnoAnterior: parseValue(props.crescimentoReceitaAnoAnterior),
    crescimentoEps: parseValue(props.crescimentoEps),
    crescimentoEpsAnoAnterior: parseValue(props.crescimentoEpsAnoAnterior),

    // Valuation vs Fundamentals
    leveredDcf: parseValue(props.leveredDcf),
    precoAtual: parseValue(props.precoAtual),
    fcf: parseValue(props.fcf),
    fcfAnoAnterior: parseValue(props.fcfAnoAnterior),
  }
}

/**
 * Valida se os indicadores complementares necessários estão disponíveis
 */
export function validateUtilitiesComplementares(
  complementares: UtilitiesComplementares,
  requiredFields: (keyof UtilitiesComplementares)[],
): boolean {
  return requiredFields.every((field) => !isNaN(complementares[field]))
}

/**
 * Obtém um subset específico dos complementares para contexto de avaliação
 */
export function getUtilitiesComplementaresSubset(
  complementares: UtilitiesComplementares,
  fields: (keyof UtilitiesComplementares)[],
): Partial<UtilitiesComplementares> {
  const subset: Partial<UtilitiesComplementares> = {}

  fields.forEach((field) => {
    if (!isNaN(complementares[field])) {
      subset[field] = complementares[field]
    }
  })

  return subset
}

/**
 * Indicadores core obrigatórios para análise de Utilities
 */
export const UTILITIES_CORE_INDICATORS: (keyof UtilitiesComplementares)[] = [
  'pl',
  'pb',
  'roe',
  'dividendYield',
  'payoutRatio',
  'debtToEbitda',
  'coberturaJuros',
]

/**
 * Indicadores de rentabilidade específicos para Utilities
 */
export const UTILITIES_PROFITABILITY_INDICATORS: (keyof UtilitiesComplementares)[] = [
  'roe',
  'roic',
  'margemEbitda',
  'margemOperacional',
  'margemLiquida',
  'earningsYield',
]

/**
 * Indicadores de dividendos para Utilities (setor focado em renda)
 */
export const UTILITIES_DIVIDEND_INDICATORS: (keyof UtilitiesComplementares)[] = [
  'dividendYield',
  'payoutRatio',
  'dividendCagr5y',
]

/**
 * Indicadores de estrutura financeira para Utilities
 */
export const UTILITIES_FINANCIAL_INDICATORS: (keyof UtilitiesComplementares)[] = [
  'endividamento',
  'debtToEbitda',
  'coberturaJuros',
  'liquidezCorrente',
]

/**
 * Indicadores de eficiência para Utilities
 */
export const UTILITIES_EFFICIENCY_INDICATORS: (keyof UtilitiesComplementares)[] = [
  'giroAtivo',
  'margemOperacional',
  'capexOverRevenue',
]

/**
 * Indicadores de crescimento para Utilities
 */
export const UTILITIES_GROWTH_INDICATORS: (keyof UtilitiesComplementares)[] = [
  'crescimentoReceita',
  'crescimentoEps',
  'dividendCagr5y',
]

/**
 * Indicadores de avaliação para Utilities
 */
export const UTILITIES_VALUATION_INDICATORS: (keyof UtilitiesComplementares)[] = [
  'pl',
  'pb',
  'ps',
  'earningsYield',
  'leveredDcf',
]

/**
 * Indicadores de fluxo de caixa para Utilities
 */
export const UTILITIES_CASHFLOW_INDICATORS: (keyof UtilitiesComplementares)[] = [
  'fcf',
  'capexOverRevenue',
  'dividendYield',
]

/**
 * Indicadores de estabilidade para Utilities (setor defensivo)
 */
export const UTILITIES_STABILITY_INDICATORS: (keyof UtilitiesComplementares)[] = [
  'dividendYield',
  'payoutRatio',
  'coberturaJuros',
  'debtToEbitda',
  'margemEbitda',
]

/**
 * Indicadores regulatórios para Utilities
 */
export const UTILITIES_REGULATORY_INDICATORS: (keyof UtilitiesComplementares)[] = [
  'roe',
  'roic',
  'capexOverRevenue',
  'debtToEbitda',
]

/**
 * Indicadores de capital intensivo para Utilities
 */
export const UTILITIES_CAPITAL_INTENSIVE_INDICATORS: (keyof UtilitiesComplementares)[] = [
  'capexOverRevenue',
  'giroAtivo',
  'roic',
  'debtToEbitda',
  'fcf',
]
