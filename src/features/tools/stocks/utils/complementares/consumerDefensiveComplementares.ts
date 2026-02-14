// src/utils/complementares/consumerDefensiveComplementares.ts

export interface ConsumerDefensiveComplementares {
  // === RENTABILIDADE E RETORNO ===
  pe: number
  peAnoAnterior: number
  pb: number
  pbAnoAnterior: number
  ps: number
  psAnoAnterior: number
  roe: number
  roeAnoAnterior: number
  roic: number
  roicAnoAnterior: number

  // === MARGENS E EFICIÊNCIA ===
  grossMargin: number
  grossMarginAnoAnterior: number
  ebitdaMargin: number
  ebitdaMarginAnoAnterior: number
  margemLiquida: number
  margemLiquidaAnoAnterior: number
  margemOperacional: number
  margemOperacionalAnoAnterior: number

  // === CRESCIMENTO E ESTABILIDADE ===
  receitaCagr3y: number
  receitaCagr3yAnoAnterior: number
  crescimentoReceita: number
  crescimentoReceitaAnoAnterior: number
  consistenciaReceita: number
  consistenciaReceitaAnoAnterior: number

  // === ESTRUTURA DE CAPITAL ===
  dividaEbitda: number
  dividaEbitdaAnoAnterior: number
  coberturaJuros: number
  coberturaJurosAnoAnterior: number
  liquidezCorrente: number
  liquidezCorrenteAnoAnterior: number
  debtEquity: number
  debtEquityAnoAnterior: number

  // === FLUXO DE CAIXA ===
  freeCashFlow: number
  freeCashFlowAnoAnterior: number
  fcfYield: number
  fcfYieldAnoAnterior: number
  workingCapitalTurnover: number
  workingCapitalTurnoverAnoAnterior: number
  inventoryTurnover: number
  inventoryTurnoverAnoAnterior: number

  // === DIVIDENDOS (CRÍTICO PARA DEFENSIVOS) ===
  payoutRatio: number
  payoutRatioAnoAnterior: number
  dividendYield: number
  dividendYieldAnoAnterior: number
  dividendGrowth: number
  dividendGrowthAnoAnterior: number
  yearsOfDividends: number
  yearsOfDividendsAnoAnterior: number

  // === RISCO E VOLATILIDADE ===
  beta: number
  betaAnoAnterior: number

  // === AVALIAÇÃO ===
  leveredDcf: number
  leveredDcfAnoAnterior: number
  precoAtual: number
  precoAtualAnoAnterior: number

  // === MÉTRICAS ESPECÍFICAS DE CONSUMER DEFENSIVE ===
  marketShare: number
  marketShareAnoAnterior: number
  brandStrength: number
  brandStrengthAnoAnterior: number
  storeCount: number
  storeCountAnoAnterior: number
}

export interface RatingsConsumerDefensiveProps {
  // === RENTABILIDADE E RETORNO ===
  pe: string
  peAnoAnterior?: string
  pb: string
  pbAnoAnterior?: string
  ps: string
  psAnoAnterior?: string
  roe: string
  roeAnoAnterior?: string
  roic: string
  roicAnoAnterior?: string

  // === MARGENS E EFICIÊNCIA ===
  grossMargin: string
  grossMarginAnoAnterior?: string
  ebitdaMargin: string
  ebitdaMarginAnoAnterior?: string
  margemLiquida: string
  margemLiquidaAnoAnterior?: string
  margemOperacional: string
  margemOperacionalAnoAnterior?: string

  // === CRESCIMENTO E ESTABILIDADE ===
  receitaCagr3y: string
  receitaCagr3yAnoAnterior?: string
  crescimentoReceita: string
  crescimentoReceitaAnoAnterior?: string
  consistenciaReceita: string
  consistenciaReceitaAnoAnterior?: string

  // === ESTRUTURA DE CAPITAL ===
  dividaEbitda: string
  dividaEbitdaAnoAnterior?: string
  coberturaJuros: string
  coberturaJurosAnoAnterior?: string
  liquidezCorrente: string
  liquidezCorrenteAnoAnterior?: string
  debtEquity: string
  debtEquityAnoAnterior?: string

  // === FLUXO DE CAIXA ===
  freeCashFlow: string
  freeCashFlowAnoAnterior?: string
  fcfYield: string
  fcfYieldAnoAnterior?: string
  workingCapitalTurnover: string
  workingCapitalTurnoverAnoAnterior?: string
  inventoryTurnover: string
  inventoryTurnoverAnoAnterior?: string

  // === DIVIDENDOS (CRÍTICO PARA DEFENSIVOS) ===
  payoutRatio: string
  payoutRatioAnoAnterior?: string
  dividendYield: string
  dividendYieldAnoAnterior?: string
  dividendGrowth: string
  dividendGrowthAnoAnterior?: string
  yearsOfDividends: string
  yearsOfDividendsAnoAnterior?: string

  // === RISCO E VOLATILIDADE ===
  beta: string
  betaAnoAnterior?: string

  // === AVALIAÇÃO ===
  leveredDcf: string
  leveredDcfAnoAnterior?: string
  precoAtual: string
  precoAtualAnoAnterior?: string

  // === MÉTRICAS ESPECÍFICAS DE CONSUMER DEFENSIVE ===
  marketShare?: string
  marketShareAnoAnterior?: string
  brandStrength?: string
  brandStrengthAnoAnterior?: string
  storeCount?: string
  storeCountAnoAnterior?: string
}

/**
 * Constrói objeto de complementares específico para o setor Consumer Defensive
 * Inclui APENAS indicadores relevantes para empresas defensivas de consumo
 */
export function buildConsumerDefensiveComplementares(
  props: RatingsConsumerDefensiveProps,
): ConsumerDefensiveComplementares {
  const parseValue = (value: string | undefined): number => {
    if (!value || value === 'N/A' || value === 'undefined' || value === '0') return NaN

    // Remove % se existir
    const cleanValue = value.replace('%', '').trim()
    const parsed = parseFloat(cleanValue)

    return isNaN(parsed) ? NaN : parsed
  }

  return {
    // === RENTABILIDADE E RETORNO ===
    pe: parseValue(props.pe),
    peAnoAnterior: parseValue(props.peAnoAnterior),
    pb: parseValue(props.pb),
    pbAnoAnterior: parseValue(props.pbAnoAnterior),
    ps: parseValue(props.ps),
    psAnoAnterior: parseValue(props.psAnoAnterior),
    roe: parseValue(props.roe),
    roeAnoAnterior: parseValue(props.roeAnoAnterior),
    roic: parseValue(props.roic),
    roicAnoAnterior: parseValue(props.roicAnoAnterior),

    // === MARGENS E EFICIÊNCIA ===
    grossMargin: parseValue(props.grossMargin),
    grossMarginAnoAnterior: parseValue(props.grossMarginAnoAnterior),
    ebitdaMargin: parseValue(props.ebitdaMargin),
    ebitdaMarginAnoAnterior: parseValue(props.ebitdaMarginAnoAnterior),
    margemLiquida: parseValue(props.margemLiquida),
    margemLiquidaAnoAnterior: parseValue(props.margemLiquidaAnoAnterior),
    margemOperacional: parseValue(props.margemOperacional),
    margemOperacionalAnoAnterior: parseValue(props.margemOperacionalAnoAnterior),

    // === CRESCIMENTO E ESTABILIDADE ===
    receitaCagr3y: parseValue(props.receitaCagr3y),
    receitaCagr3yAnoAnterior: parseValue(props.receitaCagr3yAnoAnterior),
    crescimentoReceita: parseValue(props.crescimentoReceita),
    crescimentoReceitaAnoAnterior: parseValue(props.crescimentoReceitaAnoAnterior),
    consistenciaReceita: parseValue(props.consistenciaReceita),
    consistenciaReceitaAnoAnterior: parseValue(props.consistenciaReceitaAnoAnterior),

    // === ESTRUTURA DE CAPITAL ===
    dividaEbitda: parseValue(props.dividaEbitda),
    dividaEbitdaAnoAnterior: parseValue(props.dividaEbitdaAnoAnterior),
    coberturaJuros: parseValue(props.coberturaJuros),
    coberturaJurosAnoAnterior: parseValue(props.coberturaJurosAnoAnterior),
    liquidezCorrente: parseValue(props.liquidezCorrente),
    liquidezCorrenteAnoAnterior: parseValue(props.liquidezCorrenteAnoAnterior),
    debtEquity: parseValue(props.debtEquity),
    debtEquityAnoAnterior: parseValue(props.debtEquityAnoAnterior),

    // === FLUXO DE CAIXA ===
    freeCashFlow: parseValue(props.freeCashFlow),
    freeCashFlowAnoAnterior: parseValue(props.freeCashFlowAnoAnterior),
    fcfYield: parseValue(props.fcfYield),
    fcfYieldAnoAnterior: parseValue(props.fcfYieldAnoAnterior),
    workingCapitalTurnover: parseValue(props.workingCapitalTurnover),
    workingCapitalTurnoverAnoAnterior: parseValue(props.workingCapitalTurnoverAnoAnterior),
    inventoryTurnover: parseValue(props.inventoryTurnover),
    inventoryTurnoverAnoAnterior: parseValue(props.inventoryTurnoverAnoAnterior),

    // === DIVIDENDOS (CRÍTICO PARA DEFENSIVOS) ===
    payoutRatio: parseValue(props.payoutRatio),
    payoutRatioAnoAnterior: parseValue(props.payoutRatioAnoAnterior),
    dividendYield: parseValue(props.dividendYield),
    dividendYieldAnoAnterior: parseValue(props.dividendYieldAnoAnterior),
    dividendGrowth: parseValue(props.dividendGrowth),
    dividendGrowthAnoAnterior: parseValue(props.dividendGrowthAnoAnterior),
    yearsOfDividends: parseValue(props.yearsOfDividends),
    yearsOfDividendsAnoAnterior: parseValue(props.yearsOfDividendsAnoAnterior),

    // === RISCO E VOLATILIDADE ===
    beta: parseValue(props.beta),
    betaAnoAnterior: parseValue(props.betaAnoAnterior),

    // === AVALIAÇÃO ===
    leveredDcf: parseValue(props.leveredDcf),
    leveredDcfAnoAnterior: parseValue(props.leveredDcfAnoAnterior),
    precoAtual: parseValue(props.precoAtual),
    precoAtualAnoAnterior: parseValue(props.precoAtualAnoAnterior),

    // === MÉTRICAS ESPECÍFICAS DE CONSUMER DEFENSIVE ===
    marketShare: parseValue(props.marketShare),
    marketShareAnoAnterior: parseValue(props.marketShareAnoAnterior),
    brandStrength: parseValue(props.brandStrength),
    brandStrengthAnoAnterior: parseValue(props.brandStrengthAnoAnterior),
    storeCount: parseValue(props.storeCount),
    storeCountAnoAnterior: parseValue(props.storeCountAnoAnterior),
  }
}

/**
 * Valida se os indicadores complementares necessários estão disponíveis
 */
export function validateConsumerDefensiveComplementares(
  complementares: ConsumerDefensiveComplementares,
  requiredFields: (keyof ConsumerDefensiveComplementares)[],
): boolean {
  return requiredFields.every((field) => !isNaN(complementares[field]))
}

/**
 * Obtém um subset específico dos complementares para contexto de avaliação
 */
export function getConsumerDefensiveComplementaresSubset(
  complementares: ConsumerDefensiveComplementares,
  fields: (keyof ConsumerDefensiveComplementares)[],
): Partial<ConsumerDefensiveComplementares> {
  const subset: Partial<ConsumerDefensiveComplementares> = {}

  fields.forEach((field) => {
    if (!isNaN(complementares[field])) {
      subset[field] = complementares[field]
    }
  })

  return subset
}

/**
 * Indicadores core obrigatórios para análise de Consumer Defensive
 */
export const CONSUMER_DEFENSIVE_CORE_INDICATORS: (keyof ConsumerDefensiveComplementares)[] = [
  'pe',
  'roe',
  'grossMargin',
  'dividendYield',
  'payoutRatio',
  'freeCashFlow',
  'beta',
]

/**
 * Indicadores de rentabilidade para Consumer Defensive
 */
export const CONSUMER_DEFENSIVE_PROFITABILITY_INDICATORS: (keyof ConsumerDefensiveComplementares)[] = [
  'roe',
  'roic',
  'grossMargin',
  'ebitdaMargin',
  'margemLiquida',
  'margemOperacional',
]

/**
 * Indicadores de crescimento e estabilidade para Consumer Defensive
 */
export const CONSUMER_DEFENSIVE_GROWTH_STABILITY_INDICATORS: (keyof ConsumerDefensiveComplementares)[] = [
  'receitaCagr3y',
  'crescimentoReceita',
  'consistenciaReceita',
]

/**
 * Indicadores de estrutura financeira para Consumer Defensive
 */
export const CONSUMER_DEFENSIVE_FINANCIAL_INDICATORS: (keyof ConsumerDefensiveComplementares)[] = [
  'dividaEbitda',
  'coberturaJuros',
  'liquidezCorrente',
  'debtEquity',
]

/**
 * Indicadores de fluxo de caixa para Consumer Defensive
 */
export const CONSUMER_DEFENSIVE_CASHFLOW_INDICATORS: (keyof ConsumerDefensiveComplementares)[] = [
  'freeCashFlow',
  'fcfYield',
  'workingCapitalTurnover',
  'inventoryTurnover',
]

/**
 * Indicadores de dividendos (críticos para defensivos)
 */
export const CONSUMER_DEFENSIVE_DIVIDEND_INDICATORS: (keyof ConsumerDefensiveComplementares)[] = [
  'payoutRatio',
  'dividendYield',
  'dividendGrowth',
  'yearsOfDividends',
]

/**
 * Indicadores de risco para Consumer Defensive
 */
export const CONSUMER_DEFENSIVE_RISK_INDICATORS: (keyof ConsumerDefensiveComplementares)[] = [
  'beta',
  'dividaEbitda',
  'coberturaJuros',
  'liquidezCorrente',
]

/**
 * Indicadores específicos do setor defensivo
 */
export const CONSUMER_DEFENSIVE_SECTOR_INDICATORS: (keyof ConsumerDefensiveComplementares)[] = [
  'marketShare',
  'brandStrength',
  'storeCount',
]

/**
 * Indicadores de qualidade defensiva
 */
export const CONSUMER_DEFENSIVE_QUALITY_INDICATORS: (keyof ConsumerDefensiveComplementares)[] = [
  'consistenciaReceita',
  'brandStrength',
  'marketShare',
  'yearsOfDividends',
]

/**
 * Indicadores de sustentabilidade de dividendos
 */
export const CONSUMER_DEFENSIVE_DIVIDEND_SUSTAINABILITY_INDICATORS: (keyof ConsumerDefensiveComplementares)[] = [
  'payoutRatio',
  'freeCashFlow',
  'dividendGrowth',
  'coberturaJuros',
]

/**
 * Indicadores de estabilidade operacional
 */
export const CONSUMER_DEFENSIVE_OPERATIONAL_STABILITY_INDICATORS: (keyof ConsumerDefensiveComplementares)[] = [
  'consistenciaReceita',
  'grossMargin',
  'inventoryTurnover',
  'workingCapitalTurnover',
]

/**
 * Indicadores de posição competitiva
 */
export const CONSUMER_DEFENSIVE_COMPETITIVE_INDICATORS: (keyof ConsumerDefensiveComplementares)[] = [
  'marketShare',
  'brandStrength',
  'grossMargin',
  'roic',
]
