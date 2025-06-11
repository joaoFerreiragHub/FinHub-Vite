// src/utils/complementares/basicMaterialsComplementares.ts

export interface BasicMaterialsComplementares {
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
  margemOperacional: number
  margemOperacionalAnoAnterior: number

  // Estrutura de Capital e Solvência
  dividaEbitda: number
  dividaEbitdaAnoAnterior: number
  coberturaJuros: number
  coberturaJurosAnoAnterior: number
  liquidezCorrente: number
  liquidezCorrenteAnoAnterior: number
  debtEquity: number
  debtEquityAnoAnterior: number

  // Fluxo de Caixa e Eficiência de Capital
  freeCashFlow: number
  freeCashFlowAnoAnterior: number
  capexRevenue: number
  capexRevenueAnoAnterior: number
  fcfYield: number
  fcfYieldAnoAnterior: number
  workingCapitalTurnover: number
  workingCapitalTurnoverAnoAnterior: number

  // Crescimento e Performance
  crescimentoReceita: number
  crescimentoReceitaAnoAnterior: number
  crescimentoEbitda: number
  crescimentoEbitdaAnoAnterior: number

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

  // Métricas Específicas de Basic Materials
  inventoryTurnover: number
  inventoryTurnoverAnoAnterior: number
  assetTurnover: number
  assetTurnoverAnoAnterior: number
  capacityUtilization: number
  capacityUtilizationAnoAnterior: number
}

export interface RatingsBasicMaterialsProps {
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
  margemOperacional: string
  margemOperacionalAnoAnterior?: string

  // Estrutura de Capital e Solvência
  dividaEbitda: string
  dividaEbitdaAnoAnterior?: string
  coberturaJuros: string
  coberturaJurosAnoAnterior?: string
  liquidezCorrente: string
  liquidezCorrenteAnoAnterior?: string
  debtEquity: string
  debtEquityAnoAnterior?: string

  // Fluxo de Caixa e Eficiência de Capital
  freeCashFlow: string
  freeCashFlowAnoAnterior?: string
  capexRevenue: string
  capexRevenueAnoAnterior?: string
  fcfYield: string
  fcfYieldAnoAnterior?: string
  workingCapitalTurnover: string
  workingCapitalTurnoverAnoAnterior?: string

  // Crescimento e Performance
  crescimentoReceita: string
  crescimentoReceitaAnoAnterior?: string
  crescimentoEbitda: string
  crescimentoEbitdaAnoAnterior?: string

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

  // Métricas Específicas de Basic Materials
  inventoryTurnover?: string
  inventoryTurnoverAnoAnterior?: string
  assetTurnover?: string
  assetTurnoverAnoAnterior?: string
  capacityUtilization?: string
  capacityUtilizationAnoAnterior?: string
}

/**
 * Constrói objeto de complementares específico para o setor Basic Materials
 * Inclui APENAS indicadores relevantes para empresas de materiais básicos
 */
export function buildBasicMaterialsComplementares(
  props: RatingsBasicMaterialsProps,
): BasicMaterialsComplementares {
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
    margemOperacional: parseValue(props.margemOperacional),
    margemOperacionalAnoAnterior: parseValue(props.margemOperacionalAnoAnterior),

    // Estrutura de Capital e Solvência
    dividaEbitda: parseValue(props.dividaEbitda),
    dividaEbitdaAnoAnterior: parseValue(props.dividaEbitdaAnoAnterior),
    coberturaJuros: parseValue(props.coberturaJuros),
    coberturaJurosAnoAnterior: parseValue(props.coberturaJurosAnoAnterior),
    liquidezCorrente: parseValue(props.liquidezCorrente),
    liquidezCorrenteAnoAnterior: parseValue(props.liquidezCorrenteAnoAnterior),
    debtEquity: parseValue(props.debtEquity),
    debtEquityAnoAnterior: parseValue(props.debtEquityAnoAnterior),

    // Fluxo de Caixa e Eficiência de Capital
    freeCashFlow: parseValue(props.freeCashFlow),
    freeCashFlowAnoAnterior: parseValue(props.freeCashFlowAnoAnterior),
    capexRevenue: parseValue(props.capexRevenue),
    capexRevenueAnoAnterior: parseValue(props.capexRevenueAnoAnterior),
    fcfYield: parseValue(props.fcfYield),
    fcfYieldAnoAnterior: parseValue(props.fcfYieldAnoAnterior),
    workingCapitalTurnover: parseValue(props.workingCapitalTurnover),
    workingCapitalTurnoverAnoAnterior: parseValue(props.workingCapitalTurnoverAnoAnterior),

    // Crescimento e Performance
    crescimentoReceita: parseValue(props.crescimentoReceita),
    crescimentoReceitaAnoAnterior: parseValue(props.crescimentoReceitaAnoAnterior),
    crescimentoEbitda: parseValue(props.crescimentoEbitda),
    crescimentoEbitdaAnoAnterior: parseValue(props.crescimentoEbitdaAnoAnterior),

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

    // Métricas Específicas de Basic Materials
    inventoryTurnover: parseValue(props.inventoryTurnover),
    inventoryTurnoverAnoAnterior: parseValue(props.inventoryTurnoverAnoAnterior),
    assetTurnover: parseValue(props.assetTurnover),
    assetTurnoverAnoAnterior: parseValue(props.assetTurnoverAnoAnterior),
    capacityUtilization: parseValue(props.capacityUtilization),
    capacityUtilizationAnoAnterior: parseValue(props.capacityUtilizationAnoAnterior),
  }
}

/**
 * Valida se os indicadores complementares necessários estão disponíveis
 */
export function validateBasicMaterialsComplementares(
  complementares: BasicMaterialsComplementares,
  requiredFields: (keyof BasicMaterialsComplementares)[],
): boolean {
  return requiredFields.every((field) => !isNaN(complementares[field]))
}

/**
 * Obtém um subset específico dos complementares para contexto de avaliação
 */
export function getBasicMaterialsComplementaresSubset(
  complementares: BasicMaterialsComplementares,
  fields: (keyof BasicMaterialsComplementares)[],
): Partial<BasicMaterialsComplementares> {
  const subset: Partial<BasicMaterialsComplementares> = {}

  fields.forEach((field) => {
    if (!isNaN(complementares[field])) {
      subset[field] = complementares[field]
    }
  })

  return subset
}

/**
 * Indicadores core obrigatórios para análise de Basic Materials
 */
export const BASIC_MATERIALS_CORE_INDICATORS: (keyof BasicMaterialsComplementares)[] = [
  'pe',
  'roe',
  'margemEbitda',
  'dividaEbitda',
  'freeCashFlow',
  'beta',
  'capacityUtilization',
]

/**
 * Indicadores de rentabilidade específicos para Basic Materials
 */
export const BASIC_MATERIALS_PROFITABILITY_INDICATORS: (keyof BasicMaterialsComplementares)[] = [
  'roe',
  'roic',
  'margemEbitda',
  'margemBruta',
  'margemLiquida',
  'margemOperacional',
]

/**
 * Indicadores de eficiência operacional para Basic Materials
 */
export const BASIC_MATERIALS_EFFICIENCY_INDICATORS: (keyof BasicMaterialsComplementares)[] = [
  'inventoryTurnover',
  'assetTurnover',
  'workingCapitalTurnover',
  'capacityUtilization',
]

/**
 * Indicadores de estrutura financeira para Basic Materials
 */
export const BASIC_MATERIALS_FINANCIAL_INDICATORS: (keyof BasicMaterialsComplementares)[] = [
  'dividaEbitda',
  'coberturaJuros',
  'liquidezCorrente',
  'debtEquity',
]

/**
 * Indicadores de fluxo de caixa para Basic Materials
 */
export const BASIC_MATERIALS_CASHFLOW_INDICATORS: (keyof BasicMaterialsComplementares)[] = [
  'freeCashFlow',
  'capexRevenue',
  'fcfYield',
]

/**
 * Indicadores de crescimento para Basic Materials
 */
export const BASIC_MATERIALS_GROWTH_INDICATORS: (keyof BasicMaterialsComplementares)[] = [
  'crescimentoReceita',
  'crescimentoEbitda',
]

/**
 * Indicadores específicos do setor de materiais básicos
 */
export const BASIC_MATERIALS_SECTOR_INDICATORS: (keyof BasicMaterialsComplementares)[] = [
  'inventoryTurnover',
  'assetTurnover',
  'capacityUtilization',
]

/**
 * Indicadores de risco para Basic Materials (setor cíclico)
 */
export const BASIC_MATERIALS_RISK_INDICATORS: (keyof BasicMaterialsComplementares)[] = [
  'beta',
  'dividaEbitda',
  'coberturaJuros',
  'liquidezCorrente',
]

/**
 * Indicadores de investimento de capital para Basic Materials
 */
export const BASIC_MATERIALS_CAPEX_INDICATORS: (keyof BasicMaterialsComplementares)[] = [
  'capexRevenue',
  'freeCashFlow',
  'roic',
  'assetTurnover',
]

/**
 * Indicadores cíclicos específicos para Basic Materials
 */
export const BASIC_MATERIALS_CYCLICAL_INDICATORS: (keyof BasicMaterialsComplementares)[] = [
  'margemEbitda',
  'capacityUtilization',
  'inventoryTurnover',
  'beta',
  'crescimentoReceita',
]

/**
 * Indicadores de commodities para Basic Materials
 */
export const BASIC_MATERIALS_COMMODITY_INDICATORS: (keyof BasicMaterialsComplementares)[] = [
  'margemBruta',
  'margemEbitda',
  'beta',
  'capacityUtilization',
]
