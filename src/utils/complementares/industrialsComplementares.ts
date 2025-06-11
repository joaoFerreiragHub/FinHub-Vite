// src/utils/complementares/industrialsComplementares.ts

export interface IndustrialsComplementares {
  // Rentabilidade e Margens
  margemEbitda: number
  margemEbitdaAnoAnterior: number
  roic: number
  roicAnoAnterior: number
  roe: number
  roeAnoAnterior: number
  margemLiquida: number
  margemLiquidaAnoAnterior: number

  // Estrutura Financeira
  alavancagem: number
  alavancagemAnoAnterior: number
  coberturaJuros: number
  coberturaJurosAnoAnterior: number
  liquidezCorrente: number
  liquidezCorrenteAnoAnterior: number

  // Eficiência Operacional
  rotatividadeEstoques: number
  rotatividadeEstoquesAnoAnterior: number
  giroAtivo: number
  giroAtivoAnoAnterior: number

  // Múltiplos de Avaliação
  pe: number
  peAnoAnterior: number
  pb: number
  pbAnoAnterior: number
  ps: number
  psAnoAnterior: number
  peg: number
  pegAnoAnterior: number

  // Dividendos e Risco
  dividendYield: number
  dividendYieldAnoAnterior: number
  beta: number
  betaAnoAnterior: number

  // Fluxo de Caixa
  fcf: number
  fcfAnoAnterior: number
}

export interface RatingsIndustrialsProps {
  // Rentabilidade e Margens
  margemEbitda: string
  margemEbitdaAnoAnterior?: string
  roic: string
  roicAnoAnterior?: string
  roe?: string
  roeAnoAnterior?: string
  margemLiquida?: string
  margemLiquidaAnoAnterior?: string

  // Estrutura Financeira
  alavancagem: string
  alavancagemAnoAnterior?: string
  coberturaJuros: string
  coberturaJurosAnoAnterior?: string
  liquidezCorrente: string
  liquidezCorrenteAnoAnterior?: string

  // Eficiência Operacional
  rotatividadeEstoques: string
  rotatividadeEstoquesAnoAnterior?: string
  giroAtivo: string
  giroAtivoAnoAnterior?: string

  // Múltiplos de Avaliação
  pe: string
  peAnoAnterior?: string
  pb: string
  pbAnoAnterior?: string
  ps: string
  psAnoAnterior?: string
  peg: string
  pegAnoAnterior?: string

  // Dividendos e Risco
  dividendYield: string
  dividendYieldAnoAnterior?: string
  beta: string
  betaAnoAnterior?: string

  // Fluxo de Caixa
  fcf?: string
  fcfAnoAnterior?: string
}

/**
 * Constrói objeto de complementares específico para o setor Industrials
 * Inclui APENAS indicadores relevantes para empresas industriais
 */
export function buildIndustrialsComplementares(
  props: RatingsIndustrialsProps,
): IndustrialsComplementares {
  const parseValue = (value: string | undefined): number => {
    if (!value || value === 'N/A' || value === 'undefined' || value === '0') return NaN

    // Remove % se existir
    const cleanValue = value.replace('%', '').trim()
    const parsed = parseFloat(cleanValue)

    return isNaN(parsed) ? NaN : parsed
  }

  return {
    // Rentabilidade e Margens
    margemEbitda: parseValue(props.margemEbitda),
    margemEbitdaAnoAnterior: parseValue(props.margemEbitdaAnoAnterior),
    roic: parseValue(props.roic),
    roicAnoAnterior: parseValue(props.roicAnoAnterior),
    roe: parseValue(props.roe),
    roeAnoAnterior: parseValue(props.roeAnoAnterior),
    margemLiquida: parseValue(props.margemLiquida),
    margemLiquidaAnoAnterior: parseValue(props.margemLiquidaAnoAnterior),

    // Estrutura Financeira
    alavancagem: parseValue(props.alavancagem),
    alavancagemAnoAnterior: parseValue(props.alavancagemAnoAnterior),
    coberturaJuros: parseValue(props.coberturaJuros),
    coberturaJurosAnoAnterior: parseValue(props.coberturaJurosAnoAnterior),
    liquidezCorrente: parseValue(props.liquidezCorrente),
    liquidezCorrenteAnoAnterior: parseValue(props.liquidezCorrenteAnoAnterior),

    // Eficiência Operacional
    rotatividadeEstoques: parseValue(props.rotatividadeEstoques),
    rotatividadeEstoquesAnoAnterior: parseValue(props.rotatividadeEstoquesAnoAnterior),
    giroAtivo: parseValue(props.giroAtivo),
    giroAtivoAnoAnterior: parseValue(props.giroAtivoAnoAnterior),

    // Múltiplos de Avaliação
    pe: parseValue(props.pe),
    peAnoAnterior: parseValue(props.peAnoAnterior),
    pb: parseValue(props.pb),
    pbAnoAnterior: parseValue(props.pbAnoAnterior),
    ps: parseValue(props.ps),
    psAnoAnterior: parseValue(props.psAnoAnterior),
    peg: parseValue(props.peg),
    pegAnoAnterior: parseValue(props.pegAnoAnterior),

    // Dividendos e Risco
    dividendYield: parseValue(props.dividendYield),
    dividendYieldAnoAnterior: parseValue(props.dividendYieldAnoAnterior),
    beta: parseValue(props.beta),
    betaAnoAnterior: parseValue(props.betaAnoAnterior),

    // Fluxo de Caixa
    fcf: parseValue(props.fcf),
    fcfAnoAnterior: parseValue(props.fcfAnoAnterior),
  }
}

/**
 * Valida se os indicadores complementares necessários estão disponíveis
 */
export function validateIndustrialsComplementares(
  complementares: IndustrialsComplementares,
  requiredFields: (keyof IndustrialsComplementares)[],
): boolean {
  return requiredFields.every((field) => !isNaN(complementares[field]))
}

/**
 * Obtém um subset específico dos complementares para contexto de avaliação
 */
export function getIndustrialsComplementaresSubset(
  complementares: IndustrialsComplementares,
  fields: (keyof IndustrialsComplementares)[],
): Partial<IndustrialsComplementares> {
  const subset: Partial<IndustrialsComplementares> = {}

  fields.forEach((field) => {
    if (!isNaN(complementares[field])) {
      subset[field] = complementares[field]
    }
  })

  return subset
}

/**
 * Indicadores core obrigatórios para análise de empresas industriais
 */
export const INDUSTRIALS_CORE_INDICATORS: (keyof IndustrialsComplementares)[] = [
  'margemEbitda',
  'roic',
  'alavancagem',
  'liquidezCorrente',
  'rotatividadeEstoques',
  'pe',
  'giroAtivo',
]

/**
 * Indicadores de rentabilidade específicos para industriais
 */
export const INDUSTRIALS_PROFITABILITY_INDICATORS: (keyof IndustrialsComplementares)[] = [
  'margemEbitda',
  'roic',
  'roe',
  'margemLiquida',
]

/**
 * Indicadores de eficiência operacional para industriais
 */
export const INDUSTRIALS_EFFICIENCY_INDICATORS: (keyof IndustrialsComplementares)[] = [
  'rotatividadeEstoques',
  'giroAtivo',
  'margemEbitda',
]

/**
 * Indicadores de estrutura financeira para industriais
 */
export const INDUSTRIALS_FINANCIAL_INDICATORS: (keyof IndustrialsComplementares)[] = [
  'alavancagem',
  'coberturaJuros',
  'liquidezCorrente',
  'fcf',
]

/**
 * Indicadores de avaliação para industriais
 */
export const INDUSTRIALS_VALUATION_INDICATORS: (keyof IndustrialsComplementares)[] = [
  'pe',
  'pb',
  'ps',
  'peg',
]

/**
 * Indicadores de risco para industriais
 */
export const INDUSTRIALS_RISK_INDICATORS: (keyof IndustrialsComplementares)[] = [
  'beta',
  'alavancagem',
  'coberturaJuros',
  'liquidezCorrente',
]

/**
 * Indicadores ciclicos específicos para industriais
 */
export const INDUSTRIALS_CYCLICAL_INDICATORS: (keyof IndustrialsComplementares)[] = [
  'margemEbitda',
  'rotatividadeEstoques',
  'giroAtivo',
  'beta',
  'roic',
]
