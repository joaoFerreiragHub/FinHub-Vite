// src/utils/complementares/consumerDefensiveComplementares.ts

export interface ConsumerDefensiveComplementares {
  // Múltiplos de Avaliação
  pe: number
  peAnoAnterior: number
  pb: number
  pbAnoAnterior: number
  ps: number
  psAnoAnterior: number

  // Rentabilidade
  roe: number
  roeAnoAnterior: number
  roic: number
  roicAnoAnterior: number

  // Margens
  grossMargin: number
  grossMarginAnoAnterior: number
  ebitdaMargin: number
  ebitdaMarginAnoAnterior: number
  margemLiquida: number
  margemLiquidaAnoAnterior: number
  margemOperacional: number
  margemOperacionalAnoAnterior: number

  // Crescimento
  receitaCagr3y: number
  receitaCagr3yAnoAnterior: number
  crescimentoReceita: number
  crescimentoReceitaAnoAnterior: number
  consistenciaReceita: number
  consistenciaReceitaAnoAnterior: number

  // Dividendos
  payoutRatio: number
  payoutRatioAnoAnterior: number
  dividendYield: number
  dividendYieldAnoAnterior: number
  dividendGrowth: number
  dividendGrowthAnoAnterior: number
  yearsOfDividends: number
  yearsOfDividendsAnoAnterior: number

  // Estrutura Financeira
  dividaEbitda: number
  dividaEbitdaAnoAnterior: number
  coberturaJuros: number
  coberturaJurosAnoAnterior: number
  liquidezCorrente: number
  liquidezCorrenteAnoAnterior: number
  debtEquity: number
  debtEquityAnoAnterior: number

  // Fluxo de Caixa
  freeCashFlow: number
  freeCashFlowAnoAnterior: number
  fcfYield: number
  fcfYieldAnoAnterior: number

  // Eficiência Operacional
  workingCapitalTurnover: number
  workingCapitalTurnoverAnoAnterior: number
  inventoryTurnover: number
  inventoryTurnoverAnoAnterior: number

  // Risco
  beta: number
  betaAnoAnterior: number

  // Valuation
  leveredDcf: number
  leveredDcfAnoAnterior: number
  precoAtual: number
  precoAtualAnoAnterior: number

  // Métricas Específicas do Setor
  marketShare: number
  marketShareAnoAnterior: number
  brandStrength: number
  brandStrengthAnoAnterior: number
  storeCount: number
  storeCountAnoAnterior: number
}

export interface RatingsConsumerDefensiveProps {
  // Múltiplos de Avaliação
  pe: string
  peAnoAnterior?: string
  pb: string
  pbAnoAnterior?: string
  ps: string
  psAnoAnterior?: string

  // Rentabilidade
  roe: string
  roeAnoAnterior?: string
  roic: string
  roicAnoAnterior?: string

  // Margens
  grossMargin: string
  grossMarginAnoAnterior?: string
  ebitdaMargin: string
  ebitdaMarginAnoAnterior?: string
  margemLiquida: string
  margemLiquidaAnoAnterior?: string
  margemOperacional: string
  margemOperacionalAnoAnterior?: string

  // Crescimento
  receitaCagr3y: string
  receitaCagr3yAnoAnterior?: string
  crescimentoReceita: string
  crescimentoReceitaAnoAnterior?: string
  consistenciaReceita: string
  consistenciaReceitaAnoAnterior?: string

  // Dividendos
  payoutRatio: string
  payoutRatioAnoAnterior?: string
  dividendYield: string
  dividendYieldAnoAnterior?: string
  dividendGrowth: string
  dividendGrowthAnoAnterior?: string
  yearsOfDividends: string
  yearsOfDividendsAnoAnterior?: string

  // Estrutura Financeira
  dividaEbitda: string
  dividaEbitdaAnoAnterior?: string
  coberturaJuros: string
  coberturaJurosAnoAnterior?: string
  liquidezCorrente: string
  liquidezCorrenteAnoAnterior?: string
  debtEquity: string
  debtEquityAnoAnterior?: string

  // Fluxo de Caixa
  freeCashFlow: string
  freeCashFlowAnoAnterior?: string
  fcfYield: string
  fcfYieldAnoAnterior?: string

  // Eficiência Operacional
  workingCapitalTurnover: string
  workingCapitalTurnoverAnoAnterior?: string
  inventoryTurnover: string
  inventoryTurnoverAnoAnterior?: string

  // Risco
  beta: string
  betaAnoAnterior?: string

  // Valuation
  leveredDcf: string
  leveredDcfAnoAnterior?: string
  precoAtual: string
  precoAtualAnoAnterior?: string

  // Métricas Específicas do Setor
  marketShare?: string
  marketShareAnoAnterior?: string
  brandStrength?: string
  brandStrengthAnoAnterior?: string
  storeCount?: string
  storeCountAnoAnterior?: string
}

/**
 * Constrói objeto de complementares específico para o setor Consumer Defensive
 * Inclui APENAS indicadores relevantes para empresas de bens de consumo defensivos
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
    // Múltiplos de Avaliação
    pe: parseValue(props.pe),
    peAnoAnterior: parseValue(props.peAnoAnterior),
    pb: parseValue(props.pb),
    pbAnoAnterior: parseValue(props.pbAnoAnterior),
    ps: parseValue(props.ps),
    psAnoAnterior: parseValue(props.psAnoAnterior),

    // Rentabilidade
    roe: parseValue(props.roe),
    roeAnoAnterior: parseValue(props.roeAnoAnterior),
    roic: parseValue(props.roic),
    roicAnoAnterior: parseValue(props.roicAnoAnterior),

    // Margens
    grossMargin: parseValue(props.grossMargin),
    grossMarginAnoAnterior: parseValue(props.grossMarginAnoAnterior),
    ebitdaMargin: parseValue(props.ebitdaMargin),
    ebitdaMarginAnoAnterior: parseValue(props.ebitdaMarginAnoAnterior),
    margemLiquida: parseValue(props.margemLiquida),
    margemLiquidaAnoAnterior: parseValue(props.margemLiquidaAnoAnterior),
    margemOperacional: parseValue(props.margemOperacional),
    margemOperacionalAnoAnterior: parseValue(props.margemOperacionalAnoAnterior),

    // Crescimento
    receitaCagr3y: parseValue(props.receitaCagr3y),
    receitaCagr3yAnoAnterior: parseValue(props.receitaCagr3yAnoAnterior),
    crescimentoReceita: parseValue(props.crescimentoReceita),
    crescimentoReceitaAnoAnterior: parseValue(props.crescimentoReceitaAnoAnterior),
    consistenciaReceita: parseValue(props.consistenciaReceita),
    consistenciaReceitaAnoAnterior: parseValue(props.consistenciaReceitaAnoAnterior),

    // Dividendos
    payoutRatio: parseValue(props.payoutRatio),
    payoutRatioAnoAnterior: parseValue(props.payoutRatioAnoAnterior),
    dividendYield: parseValue(props.dividendYield),
    dividendYieldAnoAnterior: parseValue(props.dividendYieldAnoAnterior),
    dividendGrowth: parseValue(props.dividendGrowth),
    dividendGrowthAnoAnterior: parseValue(props.dividendGrowthAnoAnterior),
    yearsOfDividends: parseValue(props.yearsOfDividends),
    yearsOfDividendsAnoAnterior: parseValue(props.yearsOfDividendsAnoAnterior),

    // Estrutura Financeira
    dividaEbitda: parseValue(props.dividaEbitda),
    dividaEbitdaAnoAnterior: parseValue(props.dividaEbitdaAnoAnterior),
    coberturaJuros: parseValue(props.coberturaJuros),
    coberturaJurosAnoAnterior: parseValue(props.coberturaJurosAnoAnterior),
    liquidezCorrente: parseValue(props.liquidezCorrente),
    liquidezCorrenteAnoAnterior: parseValue(props.liquidezCorrenteAnoAnterior),
    debtEquity: parseValue(props.debtEquity),
    debtEquityAnoAnterior: parseValue(props.debtEquityAnoAnterior),

    // Fluxo de Caixa
    freeCashFlow: parseValue(props.freeCashFlow),
    freeCashFlowAnoAnterior: parseValue(props.freeCashFlowAnoAnterior),
    fcfYield: parseValue(props.fcfYield),
    fcfYieldAnoAnterior: parseValue(props.fcfYieldAnoAnterior),

    // Eficiência Operacional
    workingCapitalTurnover: parseValue(props.workingCapitalTurnover),
    workingCapitalTurnoverAnoAnterior: parseValue(props.workingCapitalTurnoverAnoAnterior),
    inventoryTurnover: parseValue(props.inventoryTurnover),
    inventoryTurnoverAnoAnterior: parseValue(props.inventoryTurnoverAnoAnterior),

    // Risco
    beta: parseValue(props.beta),
    betaAnoAnterior: parseValue(props.betaAnoAnterior),

    // Valuation
    leveredDcf: parseValue(props.leveredDcf),
    leveredDcfAnoAnterior: parseValue(props.leveredDcfAnoAnterior),
    precoAtual: parseValue(props.precoAtual),
    precoAtualAnoAnterior: parseValue(props.precoAtualAnoAnterior),

    // Métricas Específicas do Setor
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
  'ebitdaMargin',
  'dividendYield',
  'consistenciaReceita',
  'liquidezCorrente',
]

/**
 * Indicadores de qualidade específicos para Consumer Defensive
 */
export const CONSUMER_DEFENSIVE_QUALITY_INDICATORS: (keyof ConsumerDefensiveComplementares)[] = [
  'consistenciaReceita',
  'margemLiquida',
  'roic',
  'coberturaJuros',
  'yearsOfDividends',
]

/**
 * Indicadores de dividendos para Consumer Defensive
 */
export const CONSUMER_DEFENSIVE_DIVIDEND_INDICATORS: (keyof ConsumerDefensiveComplementares)[] = [
  'dividendYield',
  'payoutRatio',
  'dividendGrowth',
  'yearsOfDividends',
]

/**
 * Indicadores de eficiência operacional
 */
export const CONSUMER_DEFENSIVE_EFFICIENCY_INDICATORS: (keyof ConsumerDefensiveComplementares)[] = [
  'workingCapitalTurnover',
  'inventoryTurnover',
  'grossMargin',
  'margemOperacional',
]

/**
 * Indicadores de estabilidade financeira
 */
export const CONSUMER_DEFENSIVE_STABILITY_INDICATORS: (keyof ConsumerDefensiveComplementares)[] = [
  'dividaEbitda',
  'coberturaJuros',
  'liquidezCorrente',
  'beta',
  'consistenciaReceita',
]

/**
 * Indicadores específicos de marca e mercado
 */
export const CONSUMER_DEFENSIVE_BRAND_INDICATORS: (keyof ConsumerDefensiveComplementares)[] = [
  'marketShare',
  'brandStrength',
  'storeCount',
]
