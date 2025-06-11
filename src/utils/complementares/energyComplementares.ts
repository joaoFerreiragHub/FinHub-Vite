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
export function buildEnergyComplementares(props: RatingsEnergyProps): EnergyComplementares {
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
 * Indicadores core obrigatórios para análise de empresas de energia
 */
export const ENERGY_CORE_INDICATORS: (keyof EnergyComplementares)[] = [
  'pe',
  'roe',
  'margemEbitda',
  'dividaEbitda',
  'freeCashFlow',
  'beta',
  'custoProducao',
]

/**
 * Indicadores de rentabilidade específicos para energia
 */
export const ENERGY_PROFITABILITY_INDICATORS: (keyof EnergyComplementares)[] = [
  'roe',
  'roic',
  'margemEbitda',
  'margemBruta',
  'margemLiquida',
]

/**
 * Indicadores de estrutura financeira para energia
 */
export const ENERGY_FINANCIAL_INDICATORS: (keyof EnergyComplementares)[] = [
  'dividaEbitda',
  'coberturaJuros',
  'liquidezCorrente',
  'debtEquity',
]

/**
 * Indicadores de fluxo de caixa para energia
 */
export const ENERGY_CASHFLOW_INDICATORS: (keyof EnergyComplementares)[] = [
  'freeCashFlow',
  'capexRevenue',
  'fcfYield',
]

/**
 * Indicadores de dividendos para energia
 */
export const ENERGY_DIVIDEND_INDICATORS: (keyof EnergyComplementares)[] = [
  'dividendYield',
  'payoutRatio',
]

/**
 * Indicadores específicos do setor de energia
 */
export const ENERGY_SECTOR_SPECIFIC_INDICATORS: (keyof EnergyComplementares)[] = [
  'reservasProvadas',
  'custoProducao',
  'breakEvenPrice',
]

/**
 * Indicadores de risco para energia (setor altamente cíclico)
 */
export const ENERGY_RISK_INDICATORS: (keyof EnergyComplementares)[] = [
  'beta',
  'dividaEbitda',
  'coberturaJuros',
  'liquidezCorrente',
  'breakEvenPrice',
]

/**
 * Indicadores de investimento de capital para energia
 */
export const ENERGY_CAPEX_INDICATORS: (keyof EnergyComplementares)[] = [
  'capexRevenue',
  'freeCashFlow',
  'roic',
]

/**
 * Indicadores de commodities e preços para energia
 */
export const ENERGY_COMMODITY_INDICATORS: (keyof EnergyComplementares)[] = [
  'custoProducao',
  'breakEvenPrice',
  'margemBruta',
  'beta',
]
