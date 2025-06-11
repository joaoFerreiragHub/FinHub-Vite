// src/utils/complementares/realEstateComplementares.ts

export interface RealEstateComplementares {
  // Rentabilidade e Dividendos
  dividendYield: number
  dividendYieldAnoAnterior: number
  dividendCagr5y: number
  dividendCagr5yAnoAnterior: number
  ffoPayoutRatio: number
  ffoPayoutRatioAnoAnterior: number

  // Múltiplos Específicos de REITs
  pVpa: number
  pVpaAnoAnterior: number
  pFfo: number
  pFfoAnoAnterior: number

  // Operacionais
  ocupacao: number
  ocupacaoAnoAnterior: number
  capRate: number
  capRateAnoAnterior: number
  noi: number
  noiAnoAnterior: number
  sameSoreNoi: number
  sameSoreNoiAnoAnterior: number

  // Fluxo de Caixa Específico
  ffo: number
  ffoAnoAnterior: number
  affo: number
  affoAnoAnterior: number

  // Estrutura Financeira
  coberturaJuros: number
  coberturaJurosAnoAnterior: number
  dividaEbitda: number
  dividaEbitdaAnoAnterior: number
  liquidezCorrente: number
  liquidezCorrenteAnoAnterior: number

  // Gestão de Capital
  navDiscount: number
  navDiscountAnoAnterior: number
  retentionRate: number
  retentionRateAnoAnterior: number
}

export interface RatingsREITsProps {
  // Rentabilidade e Dividendos
  dividendYield: string
  dividendYieldAnoAnterior?: string
  dividendCagr5y: string
  dividendCagr5yAnoAnterior?: string
  ffoPayoutRatio: string
  ffoPayoutRatioAnoAnterior?: string

  // Múltiplos Específicos de REITs
  pVpa: string
  pVpaAnoAnterior?: string
  pFfo: string
  pFfoAnoAnterior?: string

  // Operacionais
  ocupacao: string
  ocupacaoAnoAnterior?: string
  capRate: string
  capRateAnoAnterior?: string
  noi?: string
  noiAnoAnterior?: string
  sameSoreNoi?: string
  sameSoreNoiAnoAnterior?: string

  // Fluxo de Caixa Específico
  ffo: string
  ffoAnoAnterior?: string
  affo: string
  affoAnoAnterior?: string

  // Estrutura Financeira
  coberturaJuros: string
  coberturaJurosAnoAnterior?: string
  dividaEbitda: string
  dividaEbitdaAnoAnterior?: string
  liquidezCorrente: string
  liquidezCorrenteAnoAnterior?: string

  // Gestão de Capital
  navDiscount?: string
  navDiscountAnoAnterior?: string
  retentionRate?: string
  retentionRateAnoAnterior?: string
}

/**
 * Constrói objeto de complementares específico para o setor Real Estate/REITs
 * Inclui APENAS indicadores relevantes para fundos imobiliários e empresas do setor
 */
export function buildRealEstateComplementares(props: RatingsREITsProps): RealEstateComplementares {
  const parseValue = (value: string | undefined): number => {
    if (!value || value === 'N/A' || value === 'undefined' || value === '0') return NaN

    // Remove % se existir
    const cleanValue = value.replace('%', '').trim()
    const parsed = parseFloat(cleanValue)

    return isNaN(parsed) ? NaN : parsed
  }

  return {
    // Rentabilidade e Dividendos
    dividendYield: parseValue(props.dividendYield),
    dividendYieldAnoAnterior: parseValue(props.dividendYieldAnoAnterior),
    dividendCagr5y: parseValue(props.dividendCagr5y),
    dividendCagr5yAnoAnterior: parseValue(props.dividendCagr5yAnoAnterior),
    ffoPayoutRatio: parseValue(props.ffoPayoutRatio),
    ffoPayoutRatioAnoAnterior: parseValue(props.ffoPayoutRatioAnoAnterior),

    // Múltiplos Específicos de REITs
    pVpa: parseValue(props.pVpa),
    pVpaAnoAnterior: parseValue(props.pVpaAnoAnterior),
    pFfo: parseValue(props.pFfo),
    pFfoAnoAnterior: parseValue(props.pFfoAnoAnterior),

    // Operacionais
    ocupacao: parseValue(props.ocupacao),
    ocupacaoAnoAnterior: parseValue(props.ocupacaoAnoAnterior),
    capRate: parseValue(props.capRate),
    capRateAnoAnterior: parseValue(props.capRateAnoAnterior),
    noi: parseValue(props.noi),
    noiAnoAnterior: parseValue(props.noiAnoAnterior),
    sameSoreNoi: parseValue(props.sameSoreNoi),
    sameSoreNoiAnoAnterior: parseValue(props.sameSoreNoiAnoAnterior),

    // Fluxo de Caixa Específico
    ffo: parseValue(props.ffo),
    ffoAnoAnterior: parseValue(props.ffoAnoAnterior),
    affo: parseValue(props.affo),
    affoAnoAnterior: parseValue(props.affoAnoAnterior),

    // Estrutura Financeira
    coberturaJuros: parseValue(props.coberturaJuros),
    coberturaJurosAnoAnterior: parseValue(props.coberturaJurosAnoAnterior),
    dividaEbitda: parseValue(props.dividaEbitda),
    dividaEbitdaAnoAnterior: parseValue(props.dividaEbitdaAnoAnterior),
    liquidezCorrente: parseValue(props.liquidezCorrente),
    liquidezCorrenteAnoAnterior: parseValue(props.liquidezCorrenteAnoAnterior),

    // Gestão de Capital
    navDiscount: parseValue(props.navDiscount),
    navDiscountAnoAnterior: parseValue(props.navDiscountAnoAnterior),
    retentionRate: parseValue(props.retentionRate),
    retentionRateAnoAnterior: parseValue(props.retentionRateAnoAnterior),
  }
}

/**
 * Valida se os indicadores complementares necessários estão disponíveis
 */
export function validateRealEstateComplementares(
  complementares: RealEstateComplementares,
  requiredFields: (keyof RealEstateComplementares)[],
): boolean {
  return requiredFields.every((field) => !isNaN(complementares[field]))
}

/**
 * Obtém um subset específico dos complementares para contexto de avaliação
 */
export function getRealEstateComplementaresSubset(
  complementares: RealEstateComplementares,
  fields: (keyof RealEstateComplementares)[],
): Partial<RealEstateComplementares> {
  const subset: Partial<RealEstateComplementares> = {}

  fields.forEach((field) => {
    if (!isNaN(complementares[field])) {
      subset[field] = complementares[field]
    }
  })

  return subset
}

/**
 * Indicadores core obrigatórios para análise de REITs
 */
export const REALESTATE_CORE_INDICATORS: (keyof RealEstateComplementares)[] = [
  'dividendYield',
  'ffo',
  'pFfo',
  'ocupacao',
  'capRate',
  'dividaEbitda',
]

/**
 * Indicadores de dividendos específicos para REITs
 */
export const REALESTATE_DIVIDEND_INDICATORS: (keyof RealEstateComplementares)[] = [
  'dividendYield',
  'dividendCagr5y',
  'ffoPayoutRatio',
]

/**
 * Indicadores operacionais para REITs
 */
export const REALESTATE_OPERATIONAL_INDICATORS: (keyof RealEstateComplementares)[] = [
  'ocupacao',
  'capRate',
  'noi',
  'sameSoreNoi',
]

/**
 * Indicadores de fluxo de caixa específicos para REITs
 */
export const REALESTATE_CASHFLOW_INDICATORS: (keyof RealEstateComplementares)[] = ['ffo', 'affo']

/**
 * Indicadores de estrutura financeira para REITs
 */
export const REALESTATE_FINANCIAL_INDICATORS: (keyof RealEstateComplementares)[] = [
  'coberturaJuros',
  'dividaEbitda',
  'liquidezCorrente',
]
