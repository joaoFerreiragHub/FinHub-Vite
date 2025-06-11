// src/utils/complementares/technologyComplementares.ts

export interface TechnologyComplementares {
  // Múltiplos de Avaliação
  peg: number
  pegAnoAnterior: number

  // Crescimento
  crescimentoReceita: number
  crescimentoReceitaAnoAnterior: number
  eps: number
  epsAnoAnterior: number

  // Estrutura de Capital
  debtEquity: number
  debtEquityAnoAnterior: number

  // Cash Flow e Eficiência
  freeCashFlow: number
  freeCashFlowAnoAnterior: number
  cashFlowOverCapex: number

  // Específicos de Technology
  rAnddEfficiency: number
  rAnddEfficiencyAnoAnterior: number
  sgaOverRevenue: number
  investimentoPD: number

  // Retornos e Margens
  roic: number
  roe: number
  margemOperacional: number

  // Risco e Liquidez
  beta: number
  cashRatio: number
  liquidezCorrente: number

  // Distribuição
  payoutRatio: number
}

export interface RatingsTechProps {
  // Crescimento e Performance
  crescimentoReceita: string
  crescimentoReceitaAnoAnterior?: string
  cagrEps: string
  cagrEpsAnoAnterior?: string
  eps: string
  epsAnoAnterior?: string

  // Margens e Rentabilidade
  margemBruta: string
  margemBrutaAnoAnterior?: string
  margemEbitda: string
  margemEbitdaAnoAnterior?: string
  margemLiquida: string
  margemLiquidaAnoAnterior?: string
  margemOperacional: string
  margemOperacionalAnoAnterior?: string

  // Retorno sobre Capital
  roic: string
  roicAnoAnterior?: string
  roe: string
  roeAnoAnterior?: string

  // Múltiplos de Avaliação
  pl: string
  plAnoAnterior?: string
  ps: string
  psAnoAnterior?: string
  peg: string
  pegAnoAnterior?: string

  // Estrutura de Capital e Liquidez
  debtToEbitda: string
  debtToEbitdaAnoAnterior?: string
  liquidezCorrente: string
  liquidezCorrenteAnoAnterior?: string
  cashRatio: string
  cashRatioAnoAnterior?: string

  // Risco e Volatilidade
  beta: string
  betaAnoAnterior?: string

  // Métricas Específicas de Tech
  investimentoPD: string
  investimentoPDAnoAnterior?: string
  rAnddEfficiency: string
  rAnddEfficiencyAnoAnterior?: string
  cashFlowOverCapex: string
  cashFlowOverCapexAnoAnterior?: string
  fcf: string
  fcfAnoAnterior?: string
  sgaOverRevenue: string
  sgaOverRevenueAnoAnterior?: string
  payoutRatio: string
  payoutRatioAnoAnterior?: string

  debtEquity?: string
  debtEquityAnoAnterior?: string
}

/**
 * Constrói objeto de complementares específico para o setor Technology
 * Inclui APENAS indicadores relevantes para empresas de tecnologia
 */
export function buildTechnologyComplementares(props: RatingsTechProps): TechnologyComplementares {
  const parseValue = (value: string | undefined): number => {
    if (!value || value === 'N/A' || value === 'undefined') return NaN

    // Remove % se existir
    const cleanValue = value.replace('%', '').trim()
    const parsed = parseFloat(cleanValue)

    return isNaN(parsed) ? NaN : parsed
  }

  return {
    // Múltiplos de Avaliação
    peg: parseValue(props.peg),
    pegAnoAnterior: parseValue(props.pegAnoAnterior),

    // Crescimento
    crescimentoReceita: parseValue(props.crescimentoReceita),
    crescimentoReceitaAnoAnterior: parseValue(props.crescimentoReceitaAnoAnterior),
    eps: parseValue(props.eps),
    epsAnoAnterior: parseValue(props.epsAnoAnterior),

    // Estrutura de Capital
    debtEquity: parseValue(props.debtEquity),
    debtEquityAnoAnterior: parseValue(props.debtEquityAnoAnterior),

    // Cash Flow e Eficiência
    freeCashFlow: parseValue(props.fcf),
    freeCashFlowAnoAnterior: parseValue(props.fcfAnoAnterior),
    cashFlowOverCapex: parseValue(props.cashFlowOverCapex),

    // Específicos de Technology
    rAnddEfficiency: parseValue(props.rAnddEfficiency),
    rAnddEfficiencyAnoAnterior: parseValue(props.rAnddEfficiencyAnoAnterior),
    sgaOverRevenue: parseValue(props.sgaOverRevenue),
    investimentoPD: parseValue(props.investimentoPD),

    // Retornos e Margens
    roic: parseValue(props.roic),
    roe: parseValue(props.roe),
    margemOperacional: parseValue(props.margemOperacional),

    // Risco e Liquidez
    beta: parseValue(props.beta),
    cashRatio: parseValue(props.cashRatio),
    liquidezCorrente: parseValue(props.liquidezCorrente),

    // Distribuição
    payoutRatio: parseValue(props.payoutRatio),
  }
}

/**
 * Valida se os indicadores complementares necessários estão disponíveis
 */
export function validateTechnologyComplementares(
  complementares: TechnologyComplementares,
  requiredFields: (keyof TechnologyComplementares)[]
): boolean {
  return requiredFields.every(field => !isNaN(complementares[field]))
}

/**
 * Obtém um subset específico dos complementares para contexto de avaliação
 */
export function getTechnologyComplementaresSubset(
  complementares: TechnologyComplementares,
  fields: (keyof TechnologyComplementares)[]
): Partial<TechnologyComplementares> {
  const subset: Partial<TechnologyComplementares> = {}

  fields.forEach(field => {
    if (!isNaN(complementares[field])) {
      subset[field] = complementares[field]
    }
  })

  return subset
}
