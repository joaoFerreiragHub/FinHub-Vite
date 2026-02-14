// src/utils/complementares/communicationServicesComplementares.ts

export interface CommunicationServicesComplementares {
  // === CORE FINANCEIROS ===
  pe: number
  ps: number
  roe: number
  roic: number

  // === MARGENS ===
  grossMargin: number
  ebitdaMargin: number
  margemLiquida: number
  margemOperacional: number

  // === CRESCIMENTO ===
  crescimentoReceita: number
  receitaCagr3y: number
  crescimentoEbitda: number

  // === ESTRUTURA CAPITAL ===
  dividaEbitda: number
  coberturaJuros: number
  debtEquity: number
  liquidezCorrente: number

  // === CASH FLOW ===
  freeCashFlow: number
  fcfYield: number
  capexRevenue: number

  // === COMMUNICATION SERVICES ESPECÍFICOS ===
  userGrowth: number          // Crescimento base usuários
  arpu: number               // Receita por usuário
  churnRate: number          // Taxa de cancelamento
  contentInvestment: number  // % receita em conteúdo

  // === DIVIDENDOS ===
  dividendYield: number
  payoutRatio: number

  // === RISCO ===
  beta: number

  // === DADOS ANTERIORES (selecionados) ===
  peAnoAnterior: number
  roeAnoAnterior: number
  crescimentoReceitaAnoAnterior: number
  userGrowthAnoAnterior: number
  arpuAnoAnterior: number
  churnRateAnoAnterior: number
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
  props: RatingsCommunicationProps
): CommunicationServicesComplementares {
  const parseValue = (value: string | undefined): number => {
    if (!value || value === 'N/A' || value === 'undefined') return NaN

    // Remove % e $ se existir
    const cleanValue = value.replace('%', '').replace('$', '').replace(',', '').trim()
    const parsed = parseFloat(cleanValue)

    return isNaN(parsed) ? NaN : parsed
  }

  return {
    // Core Financeiros
    pe: parseValue(props.pe),
    ps: parseValue(props.ps),
    roe: parseValue(props.roe),
    roic: parseValue(props.roic),

    // Margens
    grossMargin: parseValue(props.grossMargin),
    ebitdaMargin: parseValue(props.ebitdaMargin),
    margemLiquida: parseValue(props.margemLiquida),
    margemOperacional: parseValue(props.margemOperacional),

    // Crescimento
    crescimentoReceita: parseValue(props.crescimentoReceita),
    receitaCagr3y: parseValue(props.receitaCagr3y),
    crescimentoEbitda: parseValue(props.crescimentoEbitda),

    // Estrutura Capital
    dividaEbitda: parseValue(props.dividaEbitda),
    coberturaJuros: parseValue(props.coberturaJuros),
    debtEquity: parseValue(props.debtEquity),
    liquidezCorrente: parseValue(props.liquidezCorrente),

    // Cash Flow
    freeCashFlow: parseValue(props.freeCashFlow),
    fcfYield: parseValue(props.fcfYield),
    capexRevenue: parseValue(props.capexRevenue),

    // Communication Services Específicos
    userGrowth: parseValue(props.userGrowth),
    arpu: parseValue(props.arpu),
    churnRate: parseValue(props.churnRate),
    contentInvestment: parseValue(props.contentInvestment),

    // Dividendos
    dividendYield: parseValue(props.dividendYield),
    payoutRatio: parseValue(props.payoutRatio),

    // Risco
    beta: parseValue(props.beta),

    // Dados Anteriores (apenas os críticos)
    peAnoAnterior: parseValue(props.peAnoAnterior),
    roeAnoAnterior: parseValue(props.roeAnoAnterior),
    crescimentoReceitaAnoAnterior: parseValue(props.crescimentoReceitaAnoAnterior),
    userGrowthAnoAnterior: parseValue(props.userGrowthAnoAnterior),
    arpuAnoAnterior: parseValue(props.arpuAnoAnterior),
    churnRateAnoAnterior: parseValue(props.churnRateAnoAnterior),
  }
}

/**
 * Valida se os indicadores complementares necessários estão disponíveis
 */
export function validateCommunicationServicesComplementares(
  complementares: CommunicationServicesComplementares,
  requiredFields: (keyof CommunicationServicesComplementares)[]
): boolean {
  return requiredFields.every(field => !isNaN(complementares[field]))
}

/**
 * Obtém um subset específico dos complementares para contexto de avaliação
 */
export function getCommunicationServicesComplementaresSubset(
  complementares: CommunicationServicesComplementares,
  fields: (keyof CommunicationServicesComplementares)[]
): Partial<CommunicationServicesComplementares> {
  const subset: Partial<CommunicationServicesComplementares> = {}

  fields.forEach(field => {
    if (!isNaN(complementares[field])) {
      subset[field] = complementares[field]
    }
  })

  return subset
}
