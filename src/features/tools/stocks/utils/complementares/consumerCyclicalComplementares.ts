// src/utils/complementares/consumerCyclicalComplementares.ts

export interface ConsumerCyclicalComplementares {
  // Rentabilidade e Retorno
  pe: number
  peAnoAnterior: number
  ps: number
  psAnoAnterior: number
  pb: number
  pbAnoAnterior: number
  roe: number
  roeAnoAnterior: number
  roic: number
  roicAnoAnterior: number

  // Margens e Eficiência
  grossMargin: number
  grossMarginAnoAnterior: number
  ebitdaMargin: number
  ebitdaMarginAnoAnterior: number
  margemLiquida: number
  margemLiquidaAnoAnterior: number
  margemOperacional: number
  margemOperacionalAnoAnterior: number

  // Crescimento e Performance
  receitaCagr3y: number
  receitaCagr3yAnoAnterior: number
  crescimentoReceita: number
  crescimentoReceitaAnoAnterior: number
  crescimentoEbitda: number
  crescimentoEbitdaAnoAnterior: number

  // Estrutura de Capital e Solvência
  endividamento: number
  endividamentoAnoAnterior: number
  coberturaJuros: number
  coberturaJurosAnoAnterior: number
  liquidezCorrente: number
  liquidezCorrenteAnoAnterior: number
  debtEquity: number
  debtEquityAnoAnterior: number

  // Eficiência Operacional
  rotatividadeEstoques: number
  rotatividadeEstoquesAnoAnterior: number
  workingCapitalTurnover: number
  workingCapitalTurnoverAnoAnterior: number
  assetTurnover: number
  assetTurnoverAnoAnterior: number
  receivablesTurnover: number
  receivablesTurnoverAnoAnterior: number

  // Fluxo de Caixa
  freeCashFlow: number
  freeCashFlowAnoAnterior: number
  fcfYield: number
  fcfYieldAnoAnterior: number
  capexRevenue: number
  capexRevenueAnoAnterior: number

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

  // Métricas Específicas de Consumer Cyclical
  seasonalityIndex: number
  seasonalityIndexAnoAnterior: number
  consumerConfidence: number
  consumerConfidenceAnoAnterior: number
  marketShare: number
  marketShareAnoAnterior: number
}

export interface RatingsConsumerCyclicalProps {
  // Rentabilidade e Retorno
  pe: string
  peAnoAnterior?: string
  ps: string
  psAnoAnterior?: string
  pb: string
  pbAnoAnterior?: string
  roe: string
  roeAnoAnterior?: string
  roic: string
  roicAnoAnterior?: string

  // Margens e Eficiência
  grossMargin: string
  grossMarginAnoAnterior?: string
  ebitdaMargin: string
  ebitdaMarginAnoAnterior?: string
  margemLiquida: string
  margemLiquidaAnoAnterior?: string
  margemOperacional: string
  margemOperacionalAnoAnterior?: string

  // Crescimento e Performance
  receitaCagr3y: string
  receitaCagr3yAnoAnterior?: string
  crescimentoReceita: string
  crescimentoReceitaAnoAnterior?: string
  crescimentoEbitda: string
  crescimentoEbitdaAnoAnterior?: string

  // Estrutura de Capital e Solvência
  endividamento: string
  endividamentoAnoAnterior?: string
  coberturaJuros: string
  coberturaJurosAnoAnterior?: string
  liquidezCorrente: string
  liquidezCorrenteAnoAnterior?: string
  debtEquity: string
  debtEquityAnoAnterior?: string

  // Eficiência Operacional
  rotatividadeEstoques: string
  rotatividadeEstoquesAnoAnterior?: string
  workingCapitalTurnover: string
  workingCapitalTurnoverAnoAnterior?: string
  assetTurnover: string
  assetTurnoverAnoAnterior?: string
  receivablesTurnover: string
  receivablesTurnoverAnoAnterior?: string

  // Fluxo de Caixa
  freeCashFlow: string
  freeCashFlowAnoAnterior?: string
  fcfYield: string
  fcfYieldAnoAnterior?: string
  capexRevenue: string
  capexRevenueAnoAnterior?: string

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

  // Métricas Específicas de Consumer Cyclical
  seasonalityIndex?: string
  seasonalityIndexAnoAnterior?: string
  consumerConfidence?: string
  consumerConfidenceAnoAnterior?: string
  marketShare?: string
  marketShareAnoAnterior?: string
}

/**
 * Constrói objeto de complementares específico para o setor Consumer Cyclical
 * Inclui APENAS indicadores relevantes para empresas de bens de consumo cíclicos
 */
export function buildConsumerCyclicalComplementares(
  props: RatingsConsumerCyclicalProps,
): ConsumerCyclicalComplementares {
  const parseValue = (value: string | undefined): number => {
    if (!value || value === 'N/A' || value === 'undefined' || value === '0') return NaN

    // Remove % se existir
    const cleanValue = value.replace('%', '').trim()
    const parsed = parseFloat(cleanValue)

    return isNaN(parsed) ? NaN : parsed
  }

  return {
    // Rentabilidade e Retorno
    pe: parseValue(props.pe),
    peAnoAnterior: parseValue(props.peAnoAnterior),
    ps: parseValue(props.ps),
    psAnoAnterior: parseValue(props.psAnoAnterior),
    pb: parseValue(props.pb),
    pbAnoAnterior: parseValue(props.pbAnoAnterior),
    roe: parseValue(props.roe),
    roeAnoAnterior: parseValue(props.roeAnoAnterior),
    roic: parseValue(props.roic),
    roicAnoAnterior: parseValue(props.roicAnoAnterior),

    // Margens e Eficiência
    grossMargin: parseValue(props.grossMargin),
    grossMarginAnoAnterior: parseValue(props.grossMarginAnoAnterior),
    ebitdaMargin: parseValue(props.ebitdaMargin),
    ebitdaMarginAnoAnterior: parseValue(props.ebitdaMarginAnoAnterior),
    margemLiquida: parseValue(props.margemLiquida),
    margemLiquidaAnoAnterior: parseValue(props.margemLiquidaAnoAnterior),
    margemOperacional: parseValue(props.margemOperacional),
    margemOperacionalAnoAnterior: parseValue(props.margemOperacionalAnoAnterior),

    // Crescimento e Performance
    receitaCagr3y: parseValue(props.receitaCagr3y),
    receitaCagr3yAnoAnterior: parseValue(props.receitaCagr3yAnoAnterior),
    crescimentoReceita: parseValue(props.crescimentoReceita),
    crescimentoReceitaAnoAnterior: parseValue(props.crescimentoReceitaAnoAnterior),
    crescimentoEbitda: parseValue(props.crescimentoEbitda),
    crescimentoEbitdaAnoAnterior: parseValue(props.crescimentoEbitdaAnoAnterior),

    // Estrutura de Capital e Solvência
    endividamento: parseValue(props.endividamento),
    endividamentoAnoAnterior: parseValue(props.endividamentoAnoAnterior),
    coberturaJuros: parseValue(props.coberturaJuros),
    coberturaJurosAnoAnterior: parseValue(props.coberturaJurosAnoAnterior),
    liquidezCorrente: parseValue(props.liquidezCorrente),
    liquidezCorrenteAnoAnterior: parseValue(props.liquidezCorrenteAnoAnterior),
    debtEquity: parseValue(props.debtEquity),
    debtEquityAnoAnterior: parseValue(props.debtEquityAnoAnterior),

    // Eficiência Operacional
    rotatividadeEstoques: parseValue(props.rotatividadeEstoques),
    rotatividadeEstoquesAnoAnterior: parseValue(props.rotatividadeEstoquesAnoAnterior),
    workingCapitalTurnover: parseValue(props.workingCapitalTurnover),
    workingCapitalTurnoverAnoAnterior: parseValue(props.workingCapitalTurnoverAnoAnterior),
    assetTurnover: parseValue(props.assetTurnover),
    assetTurnoverAnoAnterior: parseValue(props.assetTurnoverAnoAnterior),
    receivablesTurnover: parseValue(props.receivablesTurnover),
    receivablesTurnoverAnoAnterior: parseValue(props.receivablesTurnoverAnoAnterior),

    // Fluxo de Caixa
    freeCashFlow: parseValue(props.freeCashFlow),
    freeCashFlowAnoAnterior: parseValue(props.freeCashFlowAnoAnterior),
    fcfYield: parseValue(props.fcfYield),
    fcfYieldAnoAnterior: parseValue(props.fcfYieldAnoAnterior),
    capexRevenue: parseValue(props.capexRevenue),
    capexRevenueAnoAnterior: parseValue(props.capexRevenueAnoAnterior),

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

    // Métricas Específicas de Consumer Cyclical
    seasonalityIndex: parseValue(props.seasonalityIndex),
    seasonalityIndexAnoAnterior: parseValue(props.seasonalityIndexAnoAnterior),
    consumerConfidence: parseValue(props.consumerConfidence),
    consumerConfidenceAnoAnterior: parseValue(props.consumerConfidenceAnoAnterior),
    marketShare: parseValue(props.marketShare),
    marketShareAnoAnterior: parseValue(props.marketShareAnoAnterior),
  }
}

/**
 * Valida se os indicadores complementares necessários estão disponíveis
 */
export function validateConsumerCyclicalComplementares(
  complementares: ConsumerCyclicalComplementares,
  requiredFields: (keyof ConsumerCyclicalComplementares)[],
): boolean {
  return requiredFields.every((field) => !isNaN(complementares[field]))
}

/**
 * Obtém um subset específico dos complementares para contexto de avaliação
 */
export function getConsumerCyclicalComplementaresSubset(
  complementares: ConsumerCyclicalComplementares,
  fields: (keyof ConsumerCyclicalComplementares)[],
): Partial<ConsumerCyclicalComplementares> {
  const subset: Partial<ConsumerCyclicalComplementares> = {}

  fields.forEach((field) => {
    if (!isNaN(complementares[field])) {
      subset[field] = complementares[field]
    }
  })

  return subset
}

/**
 * Indicadores core obrigatórios para análise de Consumer Cyclical
 */
export const CONSUMER_CYCLICAL_CORE_INDICATORS: (keyof ConsumerCyclicalComplementares)[] = [
  'pe',
  'roe',
  'grossMargin',
  'ebitdaMargin',
  'rotatividadeEstoques',
  'beta',
  'crescimentoReceita',
]

/**
 * Indicadores de rentabilidade específicos para Consumer Cyclical
 */
export const CONSUMER_CYCLICAL_PROFITABILITY_INDICATORS: (keyof ConsumerCyclicalComplementares)[] =
  ['roe', 'roic', 'grossMargin', 'ebitdaMargin', 'margemLiquida', 'margemOperacional']

/**
 * Indicadores de crescimento para Consumer Cyclical
 */
export const CONSUMER_CYCLICAL_GROWTH_INDICATORS: (keyof ConsumerCyclicalComplementares)[] = [
  'receitaCagr3y',
  'crescimentoReceita',
  'crescimentoEbitda',
]

/**
 * Indicadores de eficiência operacional para Consumer Cyclical
 */
export const CONSUMER_CYCLICAL_EFFICIENCY_INDICATORS: (keyof ConsumerCyclicalComplementares)[] = [
  'rotatividadeEstoques',
  'workingCapitalTurnover',
  'assetTurnover',
  'receivablesTurnover',
]

/**
 * Indicadores de estrutura financeira para Consumer Cyclical
 */
export const CONSUMER_CYCLICAL_FINANCIAL_INDICATORS: (keyof ConsumerCyclicalComplementares)[] = [
  'endividamento',
  'coberturaJuros',
  'liquidezCorrente',
  'debtEquity',
]

/**
 * Indicadores de fluxo de caixa para Consumer Cyclical
 */
export const CONSUMER_CYCLICAL_CASHFLOW_INDICATORS: (keyof ConsumerCyclicalComplementares)[] = [
  'freeCashFlow',
  'fcfYield',
  'capexRevenue',
]

/**
 * Indicadores específicos do setor cíclico
 */
export const CONSUMER_CYCLICAL_SECTOR_INDICATORS: (keyof ConsumerCyclicalComplementares)[] = [
  'seasonalityIndex',
  'consumerConfidence',
  'marketShare',
]

/**
 * Indicadores de risco para Consumer Cyclical (setor cíclico)
 */
export const CONSUMER_CYCLICAL_RISK_INDICATORS: (keyof ConsumerCyclicalComplementares)[] = [
  'beta',
  'endividamento',
  'liquidezCorrente',
  'seasonalityIndex',
  'consumerConfidence',
]

/**
 * Indicadores de avaliação para Consumer Cyclical
 */
export const CONSUMER_CYCLICAL_VALUATION_INDICATORS: (keyof ConsumerCyclicalComplementares)[] = [
  'pe',
  'ps',
  'pb',
  'leveredDcf',
]

/**
 * Indicadores de ciclo econômico para Consumer Cyclical
 */
export const CONSUMER_CYCLICAL_ECONOMIC_CYCLE_INDICATORS: (keyof ConsumerCyclicalComplementares)[] =
  ['beta', 'seasonalityIndex', 'consumerConfidence', 'crescimentoReceita', 'rotatividadeEstoques']
