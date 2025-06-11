// src/utils/complementares/communicationServicesComplementares.ts

export interface CommunicationServicesComplementares {
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

  // Métricas Específicas de Communication Services
  userGrowth: number
  userGrowthAnoAnterior: number
  arpu: number
  arpuAnoAnterior: number
  churnRate: number
  churnRateAnoAnterior: number
  contentInvestment: number
  contentInvestmentAnoAnterior: number
}

export interface RatingsCommunicationProps {
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

  // Métricas Específicas de Communication Services
  userGrowth?: string
  userGrowthAnoAnterior?: string
  arpu?: string
  arpuAnoAnterior?: string
  churnRate?: string
  churnRateAnoAnterior?: string
  contentInvestment?: string
  contentInvestmentAnoAnterior?: string
}

/**
 * Constrói objeto de complementares específico para o setor Communication Services
 * Inclui APENAS indicadores relevantes para empresas de comunicação e mídia
 */
export function buildCommunicationServicesComplementares(
  props: RatingsCommunicationProps,
): CommunicationServicesComplementares {
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

    // Métricas Específicas de Communication Services
    userGrowth: parseValue(props.userGrowth),
    userGrowthAnoAnterior: parseValue(props.userGrowthAnoAnterior),
    arpu: parseValue(props.arpu),
    arpuAnoAnterior: parseValue(props.arpuAnoAnterior),
    churnRate: parseValue(props.churnRate),
    churnRateAnoAnterior: parseValue(props.churnRateAnoAnterior),
    contentInvestment: parseValue(props.contentInvestment),
    contentInvestmentAnoAnterior: parseValue(props.contentInvestmentAnoAnterior),
  }
}

/**
 * Valida se os indicadores complementares necessários estão disponíveis
 */
export function validateCommunicationServicesComplementares(
  complementares: CommunicationServicesComplementares,
  requiredFields: (keyof CommunicationServicesComplementares)[],
): boolean {
  return requiredFields.every((field) => !isNaN(complementares[field]))
}

/**
 * Obtém um subset específico dos complementares para contexto de avaliação
 */
export function getCommunicationServicesComplementaresSubset(
  complementares: CommunicationServicesComplementares,
  fields: (keyof CommunicationServicesComplementares)[],
): Partial<CommunicationServicesComplementares> {
  const subset: Partial<CommunicationServicesComplementares> = {}

  fields.forEach((field) => {
    if (!isNaN(complementares[field])) {
      subset[field] = complementares[field]
    }
  })

  return subset
}

/**
 * Indicadores core obrigatórios para análise de Communication Services
 */
export const COMMUNICATION_SERVICES_CORE_INDICATORS: (keyof CommunicationServicesComplementares)[] =
  ['pe', 'ps', 'roe', 'grossMargin', 'crescimentoReceita', 'userGrowth', 'arpu']

/**
 * Indicadores de rentabilidade específicos para Communication Services
 */
export const COMMUNICATION_SERVICES_PROFITABILITY_INDICATORS: (keyof CommunicationServicesComplementares)[] =
  ['roe', 'roic', 'grossMargin', 'ebitdaMargin', 'margemLiquida', 'margemOperacional']

/**
 * Indicadores de crescimento para Communication Services
 */
export const COMMUNICATION_SERVICES_GROWTH_INDICATORS: (keyof CommunicationServicesComplementares)[] =
  ['receitaCagr3y', 'crescimentoReceita', 'crescimentoEbitda', 'userGrowth']

/**
 * Indicadores de estrutura financeira para Communication Services
 */
export const COMMUNICATION_SERVICES_FINANCIAL_INDICATORS: (keyof CommunicationServicesComplementares)[] =
  ['dividaEbitda', 'coberturaJuros', 'liquidezCorrente', 'debtEquity']

/**
 * Indicadores de fluxo de caixa para Communication Services
 */
export const COMMUNICATION_SERVICES_CASHFLOW_INDICATORS: (keyof CommunicationServicesComplementares)[] =
  ['freeCashFlow', 'fcfYield', 'capexRevenue']

/**
 * Indicadores específicos do setor de comunicação
 */
export const COMMUNICATION_SERVICES_SECTOR_INDICATORS: (keyof CommunicationServicesComplementares)[] =
  ['userGrowth', 'arpu', 'churnRate', 'contentInvestment']

/**
 * Indicadores de avaliação para Communication Services
 */
export const COMMUNICATION_SERVICES_VALUATION_INDICATORS: (keyof CommunicationServicesComplementares)[] =
  ['pe', 'ps', 'pb', 'leveredDcf']

/**
 * Indicadores de usuário e engajamento
 */
export const COMMUNICATION_SERVICES_USER_INDICATORS: (keyof CommunicationServicesComplementares)[] =
  ['userGrowth', 'arpu', 'churnRate']

/**
 * Indicadores de conteúdo e investimento
 */
export const COMMUNICATION_SERVICES_CONTENT_INDICATORS: (keyof CommunicationServicesComplementares)[] =
  ['contentInvestment', 'capexRevenue', 'freeCashFlow']

/**
 * Indicadores de tecnologia e infraestrutura
 */
export const COMMUNICATION_SERVICES_TECH_INDICATORS: (keyof CommunicationServicesComplementares)[] =
  ['capexRevenue', 'roic', 'freeCashFlow', 'userGrowth']

/**
 * Indicadores de subscription/recurring revenue
 */
export const COMMUNICATION_SERVICES_SUBSCRIPTION_INDICATORS: (keyof CommunicationServicesComplementares)[] =
  ['arpu', 'churnRate', 'userGrowth', 'receitaCagr3y']

/**
 * Indicadores de risco para Communication Services
 */
export const COMMUNICATION_SERVICES_RISK_INDICATORS: (keyof CommunicationServicesComplementares)[] =
  ['beta', 'churnRate', 'dividaEbitda', 'contentInvestment']
