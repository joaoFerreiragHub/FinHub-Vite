// src/utils/complementares/utilitiesComplementares.ts

export interface UtilitiesComplementares {
  // === MÚLTIPLOS DE VALUATION ===
  pl: number
  plAnoAnterior: number
  pb: number
  pbAnoAnterior: number
  ps: number
  psAnoAnterior: number
  earningsYield: number
  earningsYieldAnoAnterior: number

  // === RENTABILIDADE ===
  roe: number
  roeAnoAnterior: number
  roic: number
  roicAnoAnterior: number
  regulatoryROE: number // ✅ NOVO - Específico de Utilities
  regulatoryROEAnoAnterior: number
  margemEbitda: number
  margemEbitdaAnoAnterior: number
  margemOperacional: number
  margemOperacionalAnoAnterior: number
  margemLiquida: number
  margemLiquidaAnoAnterior: number

  // === DIVIDENDOS E DISTRIBUIÇÕES (CORE para Utilities) ===
  dividendYield: number
  dividendYieldAnoAnterior: number
  payoutRatio: number
  payoutRatioAnoAnterior: number
  dividendCagr5y: number
  dividendCagr5yAnoAnterior: number
  dividendConsistency: number // ✅ NOVO - Histórico de pagamentos
  dividendConsistencyAnoAnterior: number

  // === ESTRUTURA FINANCEIRA (Capital-intensive) ===
  endividamento: number
  endividamentoAnoAnterior: number
  debtToEbitda: number
  debtToEbitdaAnoAnterior: number
  coberturaJuros: number // ✅ CRÍTICO para Utilities
  coberturaJurosAnoAnterior: number
  liquidezCorrente: number
  liquidezCorrenteAnoAnterior: number

  // === EFICIÊNCIA OPERACIONAL ===
  giroAtivo: number
  giroAtivoAnoAnterior: number
  capexOverRevenue: number // ✅ MUITO IMPORTANTE para infraestrutura
  capexOverRevenueAnoAnterior: number
  assetAge: number // ✅ NOVO - Idade dos ativos
  assetAgeAnoAnterior: number

  // === CRESCIMENTO (Moderado para Utilities) ===
  crescimentoReceita: number
  crescimentoReceitaAnoAnterior: number
  crescimentoEps: number
  crescimentoEpsAnoAnterior: number
  rateBaseGrowth: number // ✅ NOVO - Crescimento da base tarifária
  rateBaseGrowthAnoAnterior: number

  // === VALUATION VS FUNDAMENTALS ===
  leveredDcf: number
  leveredDcfAnoAnterior: number
  precoAtual: number
  precoAtualAnoAnterior: number
  fcf: number
  fcfAnoAnterior: number

  // === MÉTRICAS ESPECÍFICAS DE UTILITIES ===
  capacityFactor: number // ✅ NOVO - Para empresas de geração
  capacityFactorAnoAnterior: number
  renewablePercentage: number // ✅ NOVO - % Energias renováveis (ESG)
  renewablePercentageAnoAnterior: number
}

export interface RatingsUtilitiesProps {
  // === MÚLTIPLOS DE VALUATION ===
  pl: string
  plAnoAnterior?: string
  pb: string
  pbAnoAnterior?: string
  ps: string
  psAnoAnterior?: string
  earningsYield: string
  earningsYieldAnoAnterior?: string

  // === RENTABILIDADE ===
  roe: string
  roeAnoAnterior?: string
  roic: string
  roicAnoAnterior?: string
  regulatoryROE?: string // ✅ NOVO
  regulatoryROEAnoAnterior?: string
  margemEbitda: string
  margemEbitdaAnoAnterior?: string
  margemOperacional: string
  margemOperacionalAnoAnterior?: string
  margemLiquida: string
  margemLiquidaAnoAnterior?: string

  // === DIVIDENDOS E DISTRIBUIÇÕES ===
  dividendYield: string
  dividendYieldAnoAnterior?: string
  payoutRatio: string
  payoutRatioAnoAnterior?: string
  dividendCagr5y: string
  dividendCagr5yAnoAnterior?: string
  dividendConsistency?: string // ✅ NOVO
  dividendConsistencyAnoAnterior?: string

  // === ESTRUTURA FINANCEIRA ===
  endividamento: string
  endividamentoAnoAnterior?: string
  debtToEbitda: string
  debtToEbitdaAnoAnterior?: string
  coberturaJuros: string
  coberturaJurosAnoAnterior?: string
  liquidezCorrente: string
  liquidezCorrenteAnoAnterior?: string

  // === EFICIÊNCIA OPERACIONAL ===
  giroAtivo: string
  giroAtivoAnoAnterior?: string
  capexOverRevenue: string
  capexOverRevenueAnoAnterior?: string
  assetAge?: string // ✅ NOVO
  assetAgeAnoAnterior?: string

  // === CRESCIMENTO ===
  crescimentoReceita: string
  crescimentoReceitaAnoAnterior?: string
  crescimentoEps: string
  crescimentoEpsAnoAnterior?: string
  rateBaseGrowth?: string // ✅ NOVO
  rateBaseGrowthAnoAnterior?: string

  // === VALUATION VS FUNDAMENTALS ===
  leveredDcf: string
  leveredDcfAnoAnterior?: string
  precoAtual: string
  precoAtualAnoAnterior?: string
  fcf: string
  fcfAnoAnterior?: string

  // === MÉTRICAS ESPECÍFICAS DE UTILITIES ===
  capacityFactor?: string // ✅ NOVO
  capacityFactorAnoAnterior?: string
  renewablePercentage?: string // ✅ NOVO
  renewablePercentageAnoAnterior?: string
}

/**
 * ✅ CORRIGIDO: Constrói objeto de complementares específico para Utilities
 * Focado nos indicadores mais relevantes para empresas de serviços públicos
 */
export function buildUtilitiesComplementares(
  props: RatingsUtilitiesProps,
): UtilitiesComplementares {
  const parseValue = (value: string | undefined): number => {
    if (!value || value === 'N/A' || value === 'undefined' || value.trim() === '') return NaN

    // Remove % se existir
    const cleanValue = value.replace('%', '').trim()
    const parsed = parseFloat(cleanValue)

    return isNaN(parsed) ? NaN : parsed
  }

  return {
    // === MÚLTIPLOS DE VALUATION ===
    pl: parseValue(props.pl),
    plAnoAnterior: parseValue(props.plAnoAnterior),
    pb: parseValue(props.pb),
    pbAnoAnterior: parseValue(props.pbAnoAnterior),
    ps: parseValue(props.ps),
    psAnoAnterior: parseValue(props.psAnoAnterior),
    earningsYield: parseValue(props.earningsYield),
    earningsYieldAnoAnterior: parseValue(props.earningsYieldAnoAnterior),

    // === RENTABILIDADE ===
    roe: parseValue(props.roe),
    roeAnoAnterior: parseValue(props.roeAnoAnterior),
    roic: parseValue(props.roic),
    roicAnoAnterior: parseValue(props.roicAnoAnterior),
    regulatoryROE: parseValue(props.regulatoryROE), // ✅ NOVO
    regulatoryROEAnoAnterior: parseValue(props.regulatoryROEAnoAnterior),
    margemEbitda: parseValue(props.margemEbitda),
    margemEbitdaAnoAnterior: parseValue(props.margemEbitdaAnoAnterior),
    margemOperacional: parseValue(props.margemOperacional),
    margemOperacionalAnoAnterior: parseValue(props.margemOperacionalAnoAnterior),
    margemLiquida: parseValue(props.margemLiquida),
    margemLiquidaAnoAnterior: parseValue(props.margemLiquidaAnoAnterior),

    // === DIVIDENDOS E DISTRIBUIÇÕES ===
    dividendYield: parseValue(props.dividendYield),
    dividendYieldAnoAnterior: parseValue(props.dividendYieldAnoAnterior),
    payoutRatio: parseValue(props.payoutRatio),
    payoutRatioAnoAnterior: parseValue(props.payoutRatioAnoAnterior),
    dividendCagr5y: parseValue(props.dividendCagr5y),
    dividendCagr5yAnoAnterior: parseValue(props.dividendCagr5yAnoAnterior),
    dividendConsistency: parseValue(props.dividendConsistency), // ✅ NOVO
    dividendConsistencyAnoAnterior: parseValue(props.dividendConsistencyAnoAnterior),

    // === ESTRUTURA FINANCEIRA ===
    endividamento: parseValue(props.endividamento),
    endividamentoAnoAnterior: parseValue(props.endividamentoAnoAnterior),
    debtToEbitda: parseValue(props.debtToEbitda),
    debtToEbitdaAnoAnterior: parseValue(props.debtToEbitdaAnoAnterior),
    coberturaJuros: parseValue(props.coberturaJuros),
    coberturaJurosAnoAnterior: parseValue(props.coberturaJurosAnoAnterior),
    liquidezCorrente: parseValue(props.liquidezCorrente),
    liquidezCorrenteAnoAnterior: parseValue(props.liquidezCorrenteAnoAnterior),

    // === EFICIÊNCIA OPERACIONAL ===
    giroAtivo: parseValue(props.giroAtivo),
    giroAtivoAnoAnterior: parseValue(props.giroAtivoAnoAnterior),
    capexOverRevenue: parseValue(props.capexOverRevenue),
    capexOverRevenueAnoAnterior: parseValue(props.capexOverRevenueAnoAnterior),
    assetAge: parseValue(props.assetAge), // ✅ NOVO
    assetAgeAnoAnterior: parseValue(props.assetAgeAnoAnterior),

    // === CRESCIMENTO ===
    crescimentoReceita: parseValue(props.crescimentoReceita),
    crescimentoReceitaAnoAnterior: parseValue(props.crescimentoReceitaAnoAnterior),
    crescimentoEps: parseValue(props.crescimentoEps),
    crescimentoEpsAnoAnterior: parseValue(props.crescimentoEpsAnoAnterior),
    rateBaseGrowth: parseValue(props.rateBaseGrowth), // ✅ NOVO
    rateBaseGrowthAnoAnterior: parseValue(props.rateBaseGrowthAnoAnterior),

    // === VALUATION VS FUNDAMENTALS ===
    leveredDcf: parseValue(props.leveredDcf),
    leveredDcfAnoAnterior: parseValue(props.leveredDcfAnoAnterior),
    precoAtual: parseValue(props.precoAtual),
    precoAtualAnoAnterior: parseValue(props.precoAtualAnoAnterior),
    fcf: parseValue(props.fcf),
    fcfAnoAnterior: parseValue(props.fcfAnoAnterior),

    // === MÉTRICAS ESPECÍFICAS DE UTILITIES ===
    capacityFactor: parseValue(props.capacityFactor), // ✅ NOVO
    capacityFactorAnoAnterior: parseValue(props.capacityFactorAnoAnterior),
    renewablePercentage: parseValue(props.renewablePercentage), // ✅ NOVO
    renewablePercentageAnoAnterior: parseValue(props.renewablePercentageAnoAnterior),
  }
}

/**
 * ✅ NOVO: Validação específica para Utilities com ranges setoriais
 */
export function validateUtilitiesRanges(valor: number, chave: string): boolean {
  const ranges: Record<string, [number, number]> = {
    // Rentabilidade típica de Utilities
    'roe': [5, 25],              // ROE: 5-25%
    'roic': [3, 20],             // ROIC: 3-20%
    'regulatoryROE': [8, 15],    // ROE Regulatório: 8-15%

    // Dividendos (core do setor)
    'dividendYield': [2, 12],    // Yield: 2-12%
    'payoutRatio': [40, 95],     // Payout: 40-95%
    'dividendCagr5y': [-2, 8],   // Crescimento: -2% a 8%

    // Estrutura financeira
    'endividamento': [30, 80],   // Endividamento: 30-80%
    'debtToEbitda': [1, 8],      // Dívida/EBITDA: 1-8x
    'coberturaJuros': [1, 15],   // Cobertura: 1-15x

    // Operacional
    'giroAtivo': [0.2, 0.8],     // Giro: 0.2-0.8x
    'capexOverRevenue': [5, 40], // CapEx: 5-40%
    'assetAge': [5, 50],         // Idade: 5-50 anos

    // Crescimento
    'crescimentoReceita': [-5, 15], // Crescimento: -5% a 15%
    'rateBaseGrowth': [0, 10],      // Rate Base: 0-10%

    // Específicas
    'capacityFactor': [20, 95],     // Fator: 20-95%
    'renewablePercentage': [0, 100], // Renováveis: 0-100%
  }

  const [min, max] = ranges[chave] || [-Infinity, Infinity]
  return valor >= min && valor <= max
}

/**
 * ✅ INDICADORES CORE obrigatórios para análise de Utilities
 */
export const UTILITIES_CORE_INDICATORS: (keyof UtilitiesComplementares)[] = [
  'dividendYield',    // #1 - Core do setor
  'payoutRatio',      // #2 - Sustentabilidade
  'coberturaJuros',   // #3 - Segurança financeira
  'roe',              // #4 - Rentabilidade
  'debtToEbitda',     // #5 - Endividamento
  'margemEbitda',     // #6 - Rentabilidade operacional
  'capexOverRevenue', // #7 - Investimento em infraestrutura
  'pl',               // #8 - Valuation
]

/**
 * ✅ INDICADORES de DIVIDENDOS (críticos para Utilities)
 */
export const UTILITIES_DIVIDEND_INDICATORS: (keyof UtilitiesComplementares)[] = [
  'dividendYield',
  'payoutRatio',
  'dividendCagr5y',
  'dividendConsistency',
]

/**
 * ✅ INDICADORES de SEGURANÇA FINANCEIRA
 */
export const UTILITIES_FINANCIAL_SAFETY_INDICATORS: (keyof UtilitiesComplementares)[] = [
  'coberturaJuros',
  'debtToEbitda',
  'endividamento',
  'liquidezCorrente',
]

/**
 * ✅ INDICADORES REGULATÓRIOS específicos
 */
export const UTILITIES_REGULATORY_INDICATORS: (keyof UtilitiesComplementares)[] = [
  'regulatoryROE',
  'roe',
  'roic',
  'rateBaseGrowth',
]

/**
 * ✅ INDICADORES de SUSTENTABILIDADE/ESG
 */
export const UTILITIES_ESG_INDICATORS: (keyof UtilitiesComplementares)[] = [
  'renewablePercentage',
  'capacityFactor',
  'assetAge',
]

/**
 * ✅ INDICADORES de EFICIÊNCIA OPERACIONAL
 */
export const UTILITIES_OPERATIONAL_INDICATORS: (keyof UtilitiesComplementares)[] = [
  'giroAtivo',
  'margemEbitda',
  'margemOperacional',
  'capexOverRevenue',
  'capacityFactor',
]

/**
 * ✅ INDICADORES de CRESCIMENTO (moderado para Utilities)
 */
export const UTILITIES_GROWTH_INDICATORS: (keyof UtilitiesComplementares)[] = [
  'crescimentoReceita',
  'crescimentoEps',
  'rateBaseGrowth',
  'dividendCagr5y',
]
