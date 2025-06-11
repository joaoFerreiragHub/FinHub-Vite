// src/utils/complementares/healthcareComplementares.ts

export interface HealthcareComplementares {
  // Múltiplos de Avaliação
  peg: number
  pegAnoAnterior: number

  // Crescimento
  crescimentoReceita: number
  crescimentoReceitaAnoAnterior: number
  eps: number
  epsAnoAnterior: number
  cagrEps: number
  cagrEpsAnoAnterior: number

  // Estrutura de Capital
  debtEquity: number
  debtEquityAnoAnterior: number

  // Cash Flow e Eficiência
  freeCashFlow: number
  freeCashFlowAnoAnterior: number
  cashFlowOverCapex: number
  cashFlowOverCapexAnoAnterior: number

  // Específicos de Healthcare
  rAnddEfficiency: number
  rAnddEfficiencyAnoAnterior: number
  sgaOverRevenue: number
  sgaOverRevenueAnoAnterior: number
  investimentoPD: number
  investimentoPDAnoAnterior: number

  // Retornos e Margens
  roic: number
  roicAnoAnterior: number
  roe: number
  roeAnoAnterior: number
  margemOperacional: number
  margemOperacionalAnoAnterior: number
  margemBruta: number
  margemBrutaAnoAnterior: number
  margemLiquida: number
  margemLiquidaAnoAnterior: number
  margemEbitda: number
  margemEbitdaAnoAnterior: number

  // Risco e Liquidez
  beta: number
  betaAnoAnterior: number
  liquidezCorrente: number
  liquidezCorrenteAnoAnterior: number

  // Distribuição
  payoutRatio: number
  payoutRatioAnoAnterior: number

  // Múltiplos
  pl: number
  plAnoAnterior: number
  ps: number
  psAnoAnterior: number

  // Endividamento
  debtToEbitda: number
  debtToEbitdaAnoAnterior: number
}

export interface RatingsHealthcareProps {
  // Múltiplos de Avaliação
  pl: string
  plAnoAnterior?: string
  ps: string
  psAnoAnterior?: string
  peg: string
  pegAnoAnterior?: string

  // Margens
  margemBruta: string
  margemBrutaAnoAnterior?: string
  margemEbitda: string
  margemEbitdaAnoAnterior?: string
  margemLiquida: string
  margemLiquidaAnoAnterior?: string
  margemOperacional: string
  margemOperacionalAnoAnterior?: string

  // Retornos
  roic: string
  roicAnoAnterior?: string
  roe: string
  roeAnoAnterior?: string

  // Estrutura de Capital
  debtToEbitda: string
  debtToEbitdaAnoAnterior?: string
  liquidezCorrente: string
  liquidezCorrenteAnoAnterior?: string
  debtEquity: string
  debtEquityAnoAnterior?: string

  // Crescimento
  cagrEps: string
  cagrEpsAnoAnterior?: string
  eps: string
  epsAnoAnterior?: string
  crescimentoReceita: string
  crescimentoReceitaAnoAnterior?: string

  // Risco
  beta: string
  betaAnoAnterior?: string

  // Cash Flow
  fcf: string
  fcfAnoAnterior?: string

  // Específicos de Healthcare
  investimentoPD: string
  investimentoPDAnoAnterior?: string
  rAnddEfficiency: string
  rAnddEfficiencyAnoAnterior?: string
  cashFlowOverCapex: string
  cashFlowOverCapexAnoAnterior?: string
  sgaOverRevenue: string
  sgaOverRevenueAnoAnterior?: string
  payoutRatio: string
  payoutRatioAnoAnterior?: string
}

/**
 * Constrói objeto de complementares específico para o setor Healthcare
 * Inclui APENAS indicadores relevantes para empresas farmacêuticas/healthcare
 */
export function buildHealthcareComplementares(props: RatingsHealthcareProps): HealthcareComplementares {
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
    cagrEps: parseValue(props.cagrEps),
    cagrEpsAnoAnterior: parseValue(props.cagrEpsAnoAnterior),

    // Estrutura de Capital
    debtEquity: parseValue(props.debtEquity),
    debtEquityAnoAnterior: parseValue(props.debtEquityAnoAnterior),

    // Cash Flow e Eficiência
    freeCashFlow: parseValue(props.fcf),
    freeCashFlowAnoAnterior: parseValue(props.fcfAnoAnterior),
    cashFlowOverCapex: parseValue(props.cashFlowOverCapex),
    cashFlowOverCapexAnoAnterior: parseValue(props.cashFlowOverCapexAnoAnterior),

    // Específicos de Healthcare
    rAnddEfficiency: parseValue(props.rAnddEfficiency),
    rAnddEfficiencyAnoAnterior: parseValue(props.rAnddEfficiencyAnoAnterior),
    sgaOverRevenue: parseValue(props.sgaOverRevenue),
    sgaOverRevenueAnoAnterior: parseValue(props.sgaOverRevenueAnoAnterior),
    investimentoPD: parseValue(props.investimentoPD),
    investimentoPDAnoAnterior: parseValue(props.investimentoPDAnoAnterior),

    // Retornos e Margens
    roic: parseValue(props.roic),
    roicAnoAnterior: parseValue(props.roicAnoAnterior),
    roe: parseValue(props.roe),
    roeAnoAnterior: parseValue(props.roeAnoAnterior),
    margemOperacional: parseValue(props.margemOperacional),
    margemOperacionalAnoAnterior: parseValue(props.margemOperacionalAnoAnterior),
    margemBruta: parseValue(props.margemBruta),
    margemBrutaAnoAnterior: parseValue(props.margemBrutaAnoAnterior),
    margemLiquida: parseValue(props.margemLiquida),
    margemLiquidaAnoAnterior: parseValue(props.margemLiquidaAnoAnterior),
    margemEbitda: parseValue(props.margemEbitda),
    margemEbitdaAnoAnterior: parseValue(props.margemEbitdaAnoAnterior),

    // Risco e Liquidez
    beta: parseValue(props.beta),
    betaAnoAnterior: parseValue(props.betaAnoAnterior),
    liquidezCorrente: parseValue(props.liquidezCorrente),
    liquidezCorrenteAnoAnterior: parseValue(props.liquidezCorrenteAnoAnterior),

    // Distribuição
    payoutRatio: parseValue(props.payoutRatio),
    payoutRatioAnoAnterior: parseValue(props.payoutRatioAnoAnterior),

    // Múltiplos
    pl: parseValue(props.pl),
    plAnoAnterior: parseValue(props.plAnoAnterior),
    ps: parseValue(props.ps),
    psAnoAnterior: parseValue(props.psAnoAnterior),

    // Endividamento
    debtToEbitda: parseValue(props.debtToEbitda),
    debtToEbitdaAnoAnterior: parseValue(props.debtToEbitdaAnoAnterior),
  }
}

/**
 * Valida se os indicadores complementares necessários estão disponíveis
 */
export function validateHealthcareComplementares(
  complementares: HealthcareComplementares,
  requiredFields: (keyof HealthcareComplementares)[]
): boolean {
  return requiredFields.every(field => !isNaN(complementares[field]))
}

/**
 * Obtém um subset específico dos complementares para contexto de avaliação
 */
export function getHealthcareComplementaresSubset(
  complementares: HealthcareComplementares,
  fields: (keyof HealthcareComplementares)[]
): Partial<HealthcareComplementares> {
  const subset: Partial<HealthcareComplementares> = {}

  fields.forEach(field => {
    if (!isNaN(complementares[field])) {
      subset[field] = complementares[field]
    }
  })

  return subset
}
