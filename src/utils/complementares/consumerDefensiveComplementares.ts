// src/utils/complementares/industrialsComplementares.ts

export interface IndustrialsComplementares {
  // Rentabilidade e Eficiência
  margemEbitda: number
  margemEbitdaAnoAnterior: number
  roic: number
  roicAnoAnterior: number
  roe: number
  roeAnoAnterior: number
  margemOperacional: number
  margemOperacionalAnoAnterior: number
  margemLiquida: number
  margemLiquidaAnoAnterior: number

  // Estrutura Financeira
  alavancagem: number
  alavancagemAnoAnterior: number
  coberturaJuros: number
  coberturaJurosAnoAnterior: number
  liquidezCorrente: number
  liquidezCorrenteAnoAnterior: number
  endividamento: number
  endividamentoAnoAnterior: number

  // Eficiência Operacional
  rotatividadeEstoques: number
  rotatividadeEstoquesAnoAnterior: number
  giroAtivo: number
  giroAtivoAnoAnterior: number
  cicloOperacional: number
  cicloOperacionalAnoAnterior: number
  capexOverRevenue: number
  capexOverRevenueAnoAnterior: number

  // Múltiplos de Valuation
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
  payoutRatio: number
  payoutRatioAnoAnterior: number
  beta: number
  betaAnoAnterior: number

  // Crescimento
  crescimentoReceita: number
  crescimentoReceitaAnoAnterior: number
  crescimentoEps: number
  crescimentoEpsAnoAnterior: number

  // Fluxo de Caixa
  fcf: number
  fcfAnoAnterior: number
}

export interface RatingsIndustrialsProps {
  // Rentabilidade e Eficiência (Props principais do JSX)
  margemEbitda: string
  margemEbitdaAnoAnterior?: string
  roic: string
  roicAnoAnterior?: string

  // Estrutura Financeira (Props principais do JSX)
  alavancagem: string
  alavancagemAnoAnterior?: string
  coberturaJuros: string
  coberturaJurosAnoAnterior?: string
  liquidezCorrente: string
  liquidezCorrenteAnoAnterior?: string

  // Eficiência Operacional (Props principais do JSX)
  rotatividadeEstoques: string
  rotatividadeEstoquesAnoAnterior?: string
  giroAtivo: string
  giroAtivoAnoAnterior?: string

  // Múltiplos de Valuation (Props principais do JSX)
  pe: string
  peAnoAnterior?: string
  pb: string
  pbAnoAnterior?: string
  ps: string
  psAnoAnterior?: string
  peg: string
  pegAnoAnterior?: string

  // Dividendos e Risco (Props principais do JSX)
  dividendYield: string
  dividendYieldAnoAnterior?: string
  beta: string
  betaAnoAnterior?: string

  // Props opcionais para métricas adicionais
  roe?: string
  roeAnoAnterior?: string
  margemOperacional?: string
  margemOperacionalAnoAnterior?: string
  margemLiquida?: string
  margemLiquidaAnoAnterior?: string
  endividamento?: string
  endividamentoAnoAnterior?: string
  cicloOperacional?: string
  cicloOperacionalAnoAnterior?: string
  payoutRatio?: string
  payoutRatioAnoAnterior?: string
  crescimentoReceita?: string
  crescimentoReceitaAnoAnterior?: string
  crescimentoEps?: string
  crescimentoEpsAnoAnterior?: string
  fcf?: string
  fcfAnoAnterior?: string
  capexOverRevenue?: string
  capexOverRevenueAnoAnterior?: string
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
    // Rentabilidade e Eficiência
    margemEbitda: parseValue(props.margemEbitda),
    margemEbitdaAnoAnterior: parseValue(props.margemEbitdaAnoAnterior),
    roic: parseValue(props.roic),
    roicAnoAnterior: parseValue(props.roicAnoAnterior),
    roe: parseValue(props.roe),
    roeAnoAnterior: parseValue(props.roeAnoAnterior),
    margemOperacional: parseValue(props.margemOperacional),
    margemOperacionalAnoAnterior: parseValue(props.margemOperacionalAnoAnterior),
    margemLiquida: parseValue(props.margemLiquida),
    margemLiquidaAnoAnterior: parseValue(props.margemLiquidaAnoAnterior),

    // Estrutura Financeira
    alavancagem: parseValue(props.alavancagem),
    alavancagemAnoAnterior: parseValue(props.alavancagemAnoAnterior),
    coberturaJuros: parseValue(props.coberturaJuros),
    coberturaJurosAnoAnterior: parseValue(props.coberturaJurosAnoAnterior),
    liquidezCorrente: parseValue(props.liquidezCorrente),
    liquidezCorrenteAnoAnterior: parseValue(props.liquidezCorrenteAnoAnterior),
    endividamento: parseValue(props.endividamento),
    endividamentoAnoAnterior: parseValue(props.endividamentoAnoAnterior),

    // Eficiência Operacional
    rotatividadeEstoques: parseValue(props.rotatividadeEstoques),
    rotatividadeEstoquesAnoAnterior: parseValue(props.rotatividadeEstoquesAnoAnterior),
    giroAtivo: parseValue(props.giroAtivo),
    giroAtivoAnoAnterior: parseValue(props.giroAtivoAnoAnterior),
    cicloOperacional: parseValue(props.cicloOperacional),
    cicloOperacionalAnoAnterior: parseValue(props.cicloOperacionalAnoAnterior),
    capexOverRevenue: parseValue(props.capexOverRevenue),
    capexOverRevenueAnoAnterior: parseValue(props.capexOverRevenueAnoAnterior),

    // Múltiplos de Valuation
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
    payoutRatio: parseValue(props.payoutRatio),
    payoutRatioAnoAnterior: parseValue(props.payoutRatioAnoAnterior),
    beta: parseValue(props.beta),
    betaAnoAnterior: parseValue(props.betaAnoAnterior),

    // Crescimento
    crescimentoReceita: parseValue(props.crescimentoReceita),
    crescimentoReceitaAnoAnterior: parseValue(props.crescimentoReceitaAnoAnterior),
    crescimentoEps: parseValue(props.crescimentoEps),
    crescimentoEpsAnoAnterior: parseValue(props.crescimentoEpsAnoAnterior),

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
 * Indicadores core obrigatórios para análise de Industrials
 */
export const INDUSTRIALS_CORE_INDICATORS: (keyof IndustrialsComplementares)[] = [
  'margemEbitda',
  'roic',
  'alavancagem',
  'coberturaJuros',
  'liquidezCorrente',
  'rotatividadeEstoques',
]

/**
 * Indicadores de eficiência específicos para Industrials
 */
export const INDUSTRIALS_EFFICIENCY_INDICATORS: (keyof IndustrialsComplementares)[] = [
  'rotatividadeEstoques',
  'giroAtivo',
  'cicloOperacional',
  'margemEbitda',
  'roic',
]

/**
 * Indicadores de estrutura de capital para Industrials
 */
export const INDUSTRIALS_CAPITAL_INDICATORS: (keyof IndustrialsComplementares)[] = [
  'alavancagem',
  'coberturaJuros',
  'endividamento',
  'liquidezCorrente',
]

/**
 * Indicadores de investimento e crescimento
 */
export const INDUSTRIALS_GROWTH_INDICATORS: (keyof IndustrialsComplementares)[] = [
  'capexOverRevenue',
  'crescimentoReceita',
  'crescimentoEps',
  'fcf',
]

/**
 * Indicadores de ciclo e gestão operacional
 */
export const INDUSTRIALS_OPERATIONAL_INDICATORS: (keyof IndustrialsComplementares)[] = [
  'cicloOperacional',
  'rotatividadeEstoques',
  'giroAtivo',
  'margemOperacional',
]
