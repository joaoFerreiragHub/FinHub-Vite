// src/utils/complementares/financialComplementares.ts

export interface FinancialComplementares {
  // Rentabilidade e Eficiência
  roe: number
  roeAnoAnterior: number
  roa: number
  roaAnoAnterior: number
  eficiencia: number
  eficienciaAnoAnterior: number
  nim: number
  nimAnoAnterior: number

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

  // Múltiplos de Avaliação
  pl: number
  plAnoAnterior: number
  pvpa: number
  pvpaAnoAnterior: number

  // Dividendos e Retorno
  dividendYield: number
  dividendYieldAnoAnterior: number
  payoutRatio: number
  payoutRatioAnoAnterior: number

  // Métricas Específicas de Bancos
  ldr: number
  ldrAnoAnterior: number
  beta: number
  betaAnoAnterior: number
  leveredDcf: number
  leveredDcfAnoAnterior: number
  precoAtual: number
  precoAtualAnoAnterior: number

  // Métricas Adicionais
  custoCredito: number
  custoCreditoAnoAnterior: number
  crescimentoCarteira: number
  crescimentoCarteiraAnoAnterior: number
}

export interface RatingsFinancialsProps {
  // Rentabilidade e Eficiência
  roe: string
  roeAnoAnterior?: string
  eficiencia: string
  eficienciaAnoAnterior?: string
  nim: string
  nimAnoAnterior?: string

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

  // Múltiplos de Avaliação
  pl: string
  plAnoAnterior?: string
  pvpa: string
  pvpaAnoAnterior?: string

  // Dividendos e Retorno
  dividendYield: string
  dividendYieldAnoAnterior?: string
  payoutRatio: string
  payoutRatioAnoAnterior?: string

  // Métricas Específicas de Bancos
  ldr: string
  ldrAnoAnterior?: string
  beta: string
  betaAnoAnterior?: string
  leveredDcf: string
  leveredDcfAnoAnterior?: string
  precoAtual: string
  precoAtualAnoAnterior?: string

  // Métricas Adicionais Opcionais
  roa?: string
  roaAnoAnterior?: string
  custoCredito?: string
  custoCreditoAnoAnterior?: string
  crescimentoCarteira?: string
  crescimentoCarteiraAnoAnterior?: string
}

/**
 * Constrói objeto de complementares específico para o setor Financial Services
 * Inclui APENAS indicadores relevantes para instituições financeiras
 */
export function buildFinancialComplementares(
  props: RatingsFinancialsProps,
): FinancialComplementares {
  const parseValue = (value: string | undefined): number => {
    if (!value || value === 'N/A' || value === 'undefined' || value === '0') return NaN

    // Remove % se existir
    const cleanValue = value.replace('%', '').trim()
    const parsed = parseFloat(cleanValue)

    return isNaN(parsed) ? NaN : parsed
  }

  return {
    // Rentabilidade e Eficiência
    roe: parseValue(props.roe),
    roeAnoAnterior: parseValue(props.roeAnoAnterior),
    roa: parseValue(props.roa),
    roaAnoAnterior: parseValue(props.roaAnoAnterior),
    eficiencia: parseValue(props.eficiencia),
    eficienciaAnoAnterior: parseValue(props.eficienciaAnoAnterior),
    nim: parseValue(props.nim),
    nimAnoAnterior: parseValue(props.nimAnoAnterior),

    // Solidez e Capitalização
    basileia: parseValue(props.basileia),
    basileiaAnoAnterior: parseValue(props.basileiaAnoAnterior),
    tier1: parseValue(props.tier1),
    tier1AnoAnterior: parseValue(props.tier1AnoAnterior),

    // Estrutura de Capital e Risco
    alavancagem: parseValue(props.alavancagem),
    alavancagemAnoAnterior: parseValue(props.alavancagemAnoAnterior),
    liquidez: parseValue(props.liquidez),
    liquidezAnoAnterior: parseValue(props.liquidezAnoAnterior),
    inadimplencia: parseValue(props.inadimplencia),
    inadimplenciaAnoAnterior: parseValue(props.inadimplenciaAnoAnterior),
    cobertura: parseValue(props.cobertura),
    coberturaAnoAnterior: parseValue(props.coberturaAnoAnterior),

    // Múltiplos de Avaliação
    pl: parseValue(props.pl),
    plAnoAnterior: parseValue(props.plAnoAnterior),
    pvpa: parseValue(props.pvpa),
    pvpaAnoAnterior: parseValue(props.pvpaAnoAnterior),

    // Dividendos e Retorno
    dividendYield: parseValue(props.dividendYield),
    dividendYieldAnoAnterior: parseValue(props.dividendYieldAnoAnterior),
    payoutRatio: parseValue(props.payoutRatio),
    payoutRatioAnoAnterior: parseValue(props.payoutRatioAnoAnterior),

    // Métricas Específicas de Bancos
    ldr: parseValue(props.ldr),
    ldrAnoAnterior: parseValue(props.ldrAnoAnterior),
    beta: parseValue(props.beta),
    betaAnoAnterior: parseValue(props.betaAnoAnterior),
    leveredDcf: parseValue(props.leveredDcf),
    leveredDcfAnoAnterior: parseValue(props.leveredDcfAnoAnterior),
    precoAtual: parseValue(props.precoAtual),
    precoAtualAnoAnterior: parseValue(props.precoAtualAnoAnterior),

    // Métricas Adicionais
    custoCredito: parseValue(props.custoCredito),
    custoCreditoAnoAnterior: parseValue(props.custoCreditoAnoAnterior),
    crescimentoCarteira: parseValue(props.crescimentoCarteira),
    crescimentoCarteiraAnoAnterior: parseValue(props.crescimentoCarteiraAnoAnterior),
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
 * Indicadores core obrigatórios para análise de instituições financeiras
 */
export const FINANCIAL_CORE_INDICATORS: (keyof FinancialComplementares)[] = [
  'roe',
  'eficiencia',
  'nim',
  'basileia',
  'inadimplencia',
  'pl',
  'pvpa',
]

/**
 * Indicadores de risco específicos para bancos
 */
export const FINANCIAL_RISK_INDICATORS: (keyof FinancialComplementares)[] = [
  'inadimplencia',
  'cobertura',
  'basileia',
  'tier1',
  'alavancagem',
  'custoCredito',
]

/**
 * Indicadores de rentabilidade para instituições financeiras
 */
export const FINANCIAL_PROFITABILITY_INDICATORS: (keyof FinancialComplementares)[] = [
  'roe',
  'roa',
  'nim',
  'eficiencia',
]
