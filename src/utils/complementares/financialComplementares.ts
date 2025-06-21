// 📁 src/utils/complementares/financialComplementares.ts

export interface FinancialComplementares {
  // Rentabilidade e Eficiência
  roe: number
  roeAnoAnterior: number
  eficiencia: number
  eficienciaAnoAnterior: number
  nim: number
  nimAnoAnterior: number
  roa: number
  roaAnoAnterior: number

  // Solidez e Capitalização
  basileia: number
  basileiaAnoAnterior: number
  tier1: number
  tier1AnoAnterior: number

  // Estrutura de Capital e Risco
  alavancagem: number
  alavancagemAnoAnterior: number
  liquidez: number
  liquidezAnoAnterior: number
  inadimplencia: number
  inadimplenciaAnoAnterior: number
  cobertura: number
  coberturaAnoAnterior: number
  custoCredito: number
  custoCreditoAnoAnterior: number

  // Múltiplos de Avaliação
  pl: number
  plAnoAnterior: number
  pvpa: number
  pvpaAnoAnterior: number
  leveredDcf: number
  leveredDcfAnoAnterior: number

  // Dividendos e Retorno
  dividendYield: number
  dividendYieldAnoAnterior: number
  payoutRatio: number
  payoutRatioAnoAnterior: number

  // Métricas Específicas de Bancos
  ldr: number
  ldrAnoAnterior: number
  crescimentoCarteira: number
  crescimentoCarteiraAnoAnterior: number

  // Métricas Gerais
  beta: number
  betaAnoAnterior: number
  precoAtual: number
  precoAtualAnoAnterior: number

  // 🆕 NOVOS: Scores Calculados Universais
  rentabilidadeScore: number
  eficienciaScore: number
  solidezScore: number
  qualidadeAtivos: number
}

export interface RatingsFinancialsProps {
  // Rentabilidade e Eficiência
  roe: string
  roeAnoAnterior?: string
  eficiencia: string
  eficienciaAnoAnterior?: string
  nim: string
  nimAnoAnterior?: string
  roa?: string
  roaAnoAnterior?: string

  // Solidez e Capitalização
  basileia: string
  basileiaAnoAnterior?: string
  tier1: string
  tier1AnoAnterior?: string

  // Estrutura de Capital e Risco
  alavancagem: string
  alavancagemAnoAnterior?: string
  liquidez: string
  liquidezAnoAnterior?: string
  inadimplencia: string
  inadimplenciaAnoAnterior?: string
  cobertura: string
  coberturaAnoAnterior?: string
  custoCredito?: string
  custoCreditoAnoAnterior?: string

  // Múltiplos de Avaliação
  pl: string
  plAnoAnterior?: string
  pvpa: string
  pvpaAnoAnterior?: string
  leveredDcf: string
  leveredDcfAnoAnterior?: string

  // Dividendos e Retorno
  dividendYield: string
  dividendYieldAnoAnterior?: string
  payoutRatio: string
  payoutRatioAnoAnterior?: string

  // Métricas Específicas de Bancos
  ldr: string
  ldrAnoAnterior?: string
  crescimentoCarteira?: string
  crescimentoCarteiraAnoAnterior?: string

  // Métricas Gerais
  beta: string
  betaAnoAnterior?: string
  precoAtual: string
  precoAtualAnoAnterior?: string
}

/**
 * Constrói objeto de complementares específico para o setor Financial Services
 * UNIVERSAL: Funciona para bancos, fintechs, payment processors, seguradoras
 */
export function buildFinancialComplementares(
  props: RatingsFinancialsProps,
): FinancialComplementares {
  const parseValue = (value: string | undefined): number => {
    if (!value || value === 'N/A' || value === 'undefined' || value.trim() === '') {
      return NaN
    }

    // ✅ IMPORTANTE: Zero é um valor válido
    if (value === '0' || value === '0.0' || value === '0.00') {
      return 0
    }

    // Remove % e outros caracteres especiais
    const cleanValue = value.replace(/[%$,]/g, '').trim()

    // Trata valores inválidos
    if (cleanValue === '-' || cleanValue === '--' || cleanValue === '') {
      return NaN
    }

    const parsed = parseFloat(cleanValue)
    return isNaN(parsed) ? NaN : parsed
  }

  // 🔧 Parse de todos os valores
  const roe = parseValue(props.roe)
  const eficiencia = parseValue(props.eficiencia)
  const basileia = parseValue(props.basileia)
  const inadimplencia = parseValue(props.inadimplencia)
  const cobertura = parseValue(props.cobertura)
  const liquidez = parseValue(props.liquidez)

  // 🆕 CALCULAR SCORES UNIVERSAIS
  const rentabilidadeScore = roe > 25 ? 95 :
                            roe > 20 ? 90 :
                            roe > 15 ? 80 :
                            roe > 10 ? 65 : 45

  const eficienciaScore = eficiencia > 0 && eficiencia < 40 ? 95 :
                         eficiencia < 50 ? 85 :
                         eficiencia < 60 ? 70 : 50

  const solidezScore = basileia > 14 ? 95 :
                      basileia > 11 ? 85 :
                      basileia > 8 ? 70 :
                      (roe > 20 && liquidez > 1 ? 85 : 60)

  const qualidadeAtivos = inadimplencia > 0 && inadimplencia < 2 && cobertura > 120 ? 95 :
                         inadimplencia < 3.5 && cobertura > 100 ? 80 :
                         inadimplencia < 5 ? 65 :
                         (roe > 15 ? 75 : 60)

  return {
    // Rentabilidade e Eficiência
    roe,
    roeAnoAnterior: parseValue(props.roeAnoAnterior),
    eficiencia,
    eficienciaAnoAnterior: parseValue(props.eficienciaAnoAnterior),
    nim: parseValue(props.nim),
    nimAnoAnterior: parseValue(props.nimAnoAnterior),
    roa: parseValue(props.roa),
    roaAnoAnterior: parseValue(props.roaAnoAnterior),

    // Solidez e Capitalização
    basileia,
    basileiaAnoAnterior: parseValue(props.basileiaAnoAnterior),
    tier1: parseValue(props.tier1),
    tier1AnoAnterior: parseValue(props.tier1AnoAnterior),

    // Estrutura de Capital e Risco
    alavancagem: parseValue(props.alavancagem),
    alavancagemAnoAnterior: parseValue(props.alavancagemAnoAnterior),
    liquidez,
    liquidezAnoAnterior: parseValue(props.liquidezAnoAnterior),
    inadimplencia,
    inadimplenciaAnoAnterior: parseValue(props.inadimplenciaAnoAnterior),
    cobertura,
    coberturaAnoAnterior: parseValue(props.coberturaAnoAnterior),
    custoCredito: parseValue(props.custoCredito),
    custoCreditoAnoAnterior: parseValue(props.custoCreditoAnoAnterior),

    // Múltiplos de Avaliação
    pl: parseValue(props.pl),
    plAnoAnterior: parseValue(props.plAnoAnterior),
    pvpa: parseValue(props.pvpa),
    pvpaAnoAnterior: parseValue(props.pvpaAnoAnterior),
    leveredDcf: parseValue(props.leveredDcf),
    leveredDcfAnoAnterior: parseValue(props.leveredDcfAnoAnterior),

    // Dividendos e Retorno
    dividendYield: parseValue(props.dividendYield),
    dividendYieldAnoAnterior: parseValue(props.dividendYieldAnoAnterior),
    payoutRatio: parseValue(props.payoutRatio),
    payoutRatioAnoAnterior: parseValue(props.payoutRatioAnoAnterior),

    // Métricas Específicas de Bancos
    ldr: parseValue(props.ldr),
    ldrAnoAnterior: parseValue(props.ldrAnoAnterior),
    crescimentoCarteira: parseValue(props.crescimentoCarteira),
    crescimentoCarteiraAnoAnterior: parseValue(props.crescimentoCarteiraAnoAnterior),

    // Métricas Gerais
    beta: parseValue(props.beta),
    betaAnoAnterior: parseValue(props.betaAnoAnterior),
    precoAtual: parseValue(props.precoAtual),
    precoAtualAnoAnterior: parseValue(props.precoAtualAnoAnterior),

    // 🆕 SCORES CALCULADOS
    rentabilidadeScore,
    eficienciaScore,
    solidezScore,
    qualidadeAtivos,
  }
}

/**
 * Valida se os indicadores complementares necessários estão disponíveis
 */
export function validateFinancialComplementares(
  complementares: FinancialComplementares,
  requiredFields: (keyof FinancialComplementares)[],
): boolean {
  return requiredFields.every((field) => !isNaN(complementares[field]))
}

/**
 * Obtém um subset específico dos complementares para contexto de avaliação
 */
export function getFinancialComplementaresSubset(
  complementares: FinancialComplementares,
  fields: (keyof FinancialComplementares)[],
): Partial<FinancialComplementares> {
  const subset: Partial<FinancialComplementares> = {}

  fields.forEach((field) => {
    if (!isNaN(complementares[field])) {
      subset[field] = complementares[field]
    }
  })

  return subset
}

/**
 * 🆕 UNIVERSAL: Indicadores core para TODOS os Financial Services
 */
export const FINANCIAL_UNIVERSAL_INDICATORS: (keyof FinancialComplementares)[] = [
  'roe',
  'liquidez',
  'pl',
  'beta',
  'payoutRatio',
  'rentabilidadeScore'
]

/**
 * Indicadores específicos apenas para BANCOS TRADICIONAIS
 */
export const FINANCIAL_BANKING_INDICATORS: (keyof FinancialComplementares)[] = [
  'basileia',
  'tier1',
  'inadimplencia',
  'cobertura',
  'ldr',
  'nim'
]

/**
 * Indicadores para PAYMENT PROCESSORS (Visa, Mastercard)
 */
export const FINANCIAL_PAYMENT_INDICATORS: (keyof FinancialComplementares)[] = [
  'roe',
  'eficiencia',
  'liquidez',
  'pl',
  'pvpa',
  'payoutRatio',
  'crescimentoCarteira'
]

/**
 * Indicadores para FINTECHS
 */
export const FINANCIAL_FINTECH_INDICATORS: (keyof FinancialComplementares)[] = [
  'roe',
  'roa',
  'eficiencia',
  'liquidez',
  'pl',
  'beta',
  'crescimentoCarteira'
]

/**
 * Indicadores de rentabilidade (universal)
 */
export const FINANCIAL_PROFITABILITY_INDICATORS: (keyof FinancialComplementares)[] = [
  'roe',
  'roa',
  'nim',
  'eficiencia',
  'rentabilidadeScore'
]

/**
 * Indicadores de solidez e capitalização
 */
export const FINANCIAL_CAPITAL_INDICATORS: (keyof FinancialComplementares)[] = [
  'basileia',
  'tier1',
  'alavancagem',
  'solidezScore'
]

/**
 * Indicadores de risco de crédito
 */
export const FINANCIAL_CREDIT_RISK_INDICATORS: (keyof FinancialComplementares)[] = [
  'inadimplencia',
  'cobertura',
  'custoCredito',
  'qualidadeAtivos'
]

/**
 * Indicadores de liquidez e funding
 */
export const FINANCIAL_LIQUIDITY_INDICATORS: (keyof FinancialComplementares)[] = [
  'liquidez',
  'ldr'
]

/**
 * Indicadores de avaliação (universal)
 */
export const FINANCIAL_VALUATION_INDICATORS: (keyof FinancialComplementares)[] = [
  'pl',
  'pvpa',
  'leveredDcf',
  'dividendYield'
]
