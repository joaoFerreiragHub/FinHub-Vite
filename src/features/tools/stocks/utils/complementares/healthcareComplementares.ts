// src/utils/complementares/healthcareComplementares.ts

export interface HealthcareComplementares {
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
  cagrEps: number
  eps: number

  // === ESTRUTURA CAPITAL ===
  debtToEbitda: number
  debtEquity: number
  liquidezCorrente: number

  // === CASH FLOW ===
  freeCashFlow: number
  cashFlowOverCapex: number

  // === HEALTHCARE ESPECÍFICOS ===
  investimentoPD: number         // % receita investida em P&D
  rAnddEfficiency: number       // Eficiência do P&D (ROI em inovação)
  clinicalTrials: number        // Número de trials em pipeline
  patentProtection: number      // Anos de proteção patente média
  regulatoryApprovals: number   // Aprovações anuais de medicamentos

  // === DISTRIBUIÇÃO ===
  payoutRatio: number

  // === RISCO ===
  beta: number

  // === DADOS ANTERIORES (críticos) ===
  roeAnoAnterior: number
  crescimentoReceitaAnoAnterior: number
  investimentoPDAnoAnterior: number
  rAnddEfficiencyAnoAnterior: number
  epsAnoAnterior: number
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

  // ✅ NOVOS: Healthcare Específicos (opcionais - podem não estar disponíveis)
  clinicalTrials?: string
  patentProtection?: string
  regulatoryApprovals?: string
}

/**
 * Constrói objeto de complementares específico para o setor Healthcare
 * Inclui APENAS indicadores relevantes para empresas farmacêuticas/biotecnologia
 */
export function buildHealthcareComplementares(props: RatingsHealthcareProps): HealthcareComplementares {
  const parseValue = (value: string | undefined): number => {
    if (!value || value === 'N/A' || value === 'undefined') return NaN

    // Remove % e símbolos monetários
    const cleanValue = value.replace('%', '').replace('$', '').replace(',', '').trim()
    const parsed = parseFloat(cleanValue)

    return isNaN(parsed) ? NaN : parsed
  }

  return {
    // Core Financeiros
    pe: parseValue(props.pl),
    ps: parseValue(props.ps),
    roe: parseValue(props.roe),
    roic: parseValue(props.roic),

    // Margens (renomeadas para consistência)
    grossMargin: parseValue(props.margemBruta),
    ebitdaMargin: parseValue(props.margemEbitda),
    margemLiquida: parseValue(props.margemLiquida),
    margemOperacional: parseValue(props.margemOperacional),

    // Crescimento
    crescimentoReceita: parseValue(props.crescimentoReceita),
    cagrEps: parseValue(props.cagrEps),
    eps: parseValue(props.eps),

    // Estrutura Capital
    debtToEbitda: parseValue(props.debtToEbitda),
    debtEquity: parseValue(props.debtEquity),
    liquidezCorrente: parseValue(props.liquidezCorrente),

    // Cash Flow
    freeCashFlow: parseValue(props.fcf),
    cashFlowOverCapex: parseValue(props.cashFlowOverCapex),

    // Healthcare Específicos
    investimentoPD: parseValue(props.investimentoPD),
    rAnddEfficiency: parseValue(props.rAnddEfficiency),

    // ✅ NOVOS: Específicos Healthcare (podem ser NaN se não disponíveis)
    clinicalTrials: parseValue(props.clinicalTrials),
    patentProtection: parseValue(props.patentProtection),
    regulatoryApprovals: parseValue(props.regulatoryApprovals),

    // Distribuição
    payoutRatio: parseValue(props.payoutRatio),

    // Risco
    beta: parseValue(props.beta),

    // Dados Anteriores (apenas os críticos)
    roeAnoAnterior: parseValue(props.roeAnoAnterior),
    crescimentoReceitaAnoAnterior: parseValue(props.crescimentoReceitaAnoAnterior),
    investimentoPDAnoAnterior: parseValue(props.investimentoPDAnoAnterior),
    rAnddEfficiencyAnoAnterior: parseValue(props.rAnddEfficiencyAnoAnterior),
    epsAnoAnterior: parseValue(props.epsAnoAnterior),
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
