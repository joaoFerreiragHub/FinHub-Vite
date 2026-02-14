// src/utils/complementares/realEstateComplementares.ts

// ✅ ATUALIZADA: Interface mais realista - campos opcionais quando apropriado
export interface RealEstateComplementares {
  // === CORE INDICATORS (sempre esperados) ===
  // Rentabilidade e Dividendos
  dividendYield: number
  dividendYieldAnoAnterior?: number
  dividendCagr5y: number
  dividendCagr5yAnoAnterior?: number
  ffoPayoutRatio: number
  ffoPayoutRatioAnoAnterior?: number

  // Múltiplos Específicos de REITs
  pVpa: number
  pVpaAnoAnterior?: number
  pFfo: number
  pFfoAnoAnterior?: number

  // Operacionais
  ocupacao: number              // Margem EBITDA/Operacional como proxy
  ocupacaoAnoAnterior?: number
  capRate: number               // ROA como proxy
  capRateAnoAnterior?: number
  noi?: number                  // Crescimento receita como proxy (opcional)
  noiAnoAnterior?: number

  // Fluxo de Caixa Específico
  ffo: number                   // Free Cash Flow como proxy (ou FFO real da API)
  ffoAnoAnterior?: number
  affo: number                  // Free Cash Flow como proxy (ou AFFO real da API)
  affoAnoAnterior?: number

  // Estrutura Financeira
  coberturaJuros: number        // Calculado como proxy
  coberturaJurosAnoAnterior?: number
  dividaEbitda: number
  dividaEbitdaAnoAnterior?: number
  liquidezCorrente: number
  liquidezCorrenteAnoAnterior?: number

  // === OPTIONAL INDICATORS (frequentemente N/A) ===
  sameSoreNoi?: number          // ✅ OPCIONAL: Raro em dados públicos
  sameSoreNoiAnoAnterior?: number
  navDiscount?: number          // ✅ OPCIONAL: Raro em dados públicos
  navDiscountAnoAnterior?: number
  retentionRate?: number        // ✅ OPCIONAL: Raro em dados públicos
  retentionRateAnoAnterior?: number

  // === 🆕 NOVOS DA API (quando disponíveis) ===
  ffoPerShare?: number          // ✅ NOVO: FFO per Share real
  ffoPerShareAnoAnterior?: number
  affoPerShare?: number         // ✅ NOVO: AFFO per Share real
  affoPerShareAnoAnterior?: number
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

  // 🆕 NOVOS: FFO/AFFO per Share (quando disponíveis da API)
  ffoPerShare?: string
  ffoPerShareAnoAnterior?: string
  affoPerShare?: string
  affoPerShareAnoAnterior?: string
}

/**
 * ✅ CORRIGIDO: Parser que lida corretamente com valores monetários
 */
const parseValue = (value: string | undefined): number => {
  if (!value || value === 'N/A' || value === 'undefined' || value === '0') return NaN

  if (typeof value === 'string') {
    const cleanValue = value.trim()

    // ✅ CORRIGIDO: Valores monetários mantêm unidades consistentes
    if (cleanValue.includes('B')) {
      const numValue = parseFloat(cleanValue.replace('B', ''))
      return isNaN(numValue) ? NaN : numValue * 1000 // Converter para milhões para consistência
    }

    if (cleanValue.includes('M')) {
      const numValue = parseFloat(cleanValue.replace('M', ''))
      return isNaN(numValue) ? NaN : numValue // Manter em milhões
    }

    if (cleanValue.includes('K')) {
      const numValue = parseFloat(cleanValue.replace('K', ''))
      return isNaN(numValue) ? NaN : numValue / 1000 // Converter para milhões
    }

    // Valores percentuais
    if (cleanValue.includes('%')) {
      const numValue = parseFloat(cleanValue.replace('%', ''))
      return isNaN(numValue) ? NaN : numValue
    }

    // Valores com 'x' (coverage ratios)
    if (cleanValue.includes('x')) {
      const numValue = parseFloat(cleanValue.replace('x', ''))
      return isNaN(numValue) ? NaN : numValue
    }
  }

  // Fallback: tentar parse direto
  const parsed = parseFloat(value)
  return isNaN(parsed) ? NaN : parsed
}

/**
 * ✅ ATUALIZADO: Helper para parse seguro com fallback para NaN
 */
const parseValueSafe = (value: string | undefined): number => {
  const result = parseValue(value)
  return isNaN(result) ? NaN : result
}

/**
 * Constrói objeto de complementares específico para o setor Real Estate/REITs
 * ✅ ATUALIZADO: Inclui novos campos da API e tratamento mais robusto
 */
export function buildRealEstateComplementares(props: RatingsREITsProps): RealEstateComplementares {
  const result: RealEstateComplementares = {
    // === CORE INDICATORS (sempre tentar extrair) ===
    // Rentabilidade e Dividendos
    dividendYield: parseValueSafe(props.dividendYield),
    dividendYieldAnoAnterior: parseValueSafe(props.dividendYieldAnoAnterior),
    dividendCagr5y: parseValueSafe(props.dividendCagr5y),
    dividendCagr5yAnoAnterior: parseValueSafe(props.dividendCagr5yAnoAnterior),
    ffoPayoutRatio: parseValueSafe(props.ffoPayoutRatio),
    ffoPayoutRatioAnoAnterior: parseValueSafe(props.ffoPayoutRatioAnoAnterior),

    // Múltiplos Específicos de REITs
    pVpa: parseValueSafe(props.pVpa),
    pVpaAnoAnterior: parseValueSafe(props.pVpaAnoAnterior),
    pFfo: parseValueSafe(props.pFfo),
    pFfoAnoAnterior: parseValueSafe(props.pFfoAnoAnterior),

    // Operacionais
    ocupacao: parseValueSafe(props.ocupacao),
    ocupacaoAnoAnterior: parseValueSafe(props.ocupacaoAnoAnterior),
    capRate: parseValueSafe(props.capRate),
    capRateAnoAnterior: parseValueSafe(props.capRateAnoAnterior),
    noi: parseValueSafe(props.noi),
    noiAnoAnterior: parseValueSafe(props.noiAnoAnterior),

    // Fluxo de Caixa Específico
    ffo: parseValueSafe(props.ffo),
    ffoAnoAnterior: parseValueSafe(props.ffoAnoAnterior),
    affo: parseValueSafe(props.affo),
    affoAnoAnterior: parseValueSafe(props.affoAnoAnterior),

    // Estrutura Financeira
    coberturaJuros: parseValueSafe(props.coberturaJuros),
    coberturaJurosAnoAnterior: parseValueSafe(props.coberturaJurosAnoAnterior),
    dividaEbitda: parseValueSafe(props.dividaEbitda),
    dividaEbitdaAnoAnterior: parseValueSafe(props.dividaEbitdaAnoAnterior),
    liquidezCorrente: parseValueSafe(props.liquidezCorrente),
    liquidezCorrenteAnoAnterior: parseValueSafe(props.liquidezCorrenteAnoAnterior),

    // === OPTIONAL INDICATORS (só incluir se disponíveis) ===
    ...(props.sameSoreNoi && parseValueSafe(props.sameSoreNoi) && {
      sameSoreNoi: parseValueSafe(props.sameSoreNoi),
      sameSoreNoiAnoAnterior: parseValueSafe(props.sameSoreNoiAnoAnterior),
    }),

    ...(props.navDiscount && parseValueSafe(props.navDiscount) && {
      navDiscount: parseValueSafe(props.navDiscount),
      navDiscountAnoAnterior: parseValueSafe(props.navDiscountAnoAnterior),
    }),

    ...(props.retentionRate && parseValueSafe(props.retentionRate) && {
      retentionRate: parseValueSafe(props.retentionRate),
      retentionRateAnoAnterior: parseValueSafe(props.retentionRateAnoAnterior),
    }),

    // === 🆕 NOVOS DA API ===
    ...(props.ffoPerShare && !isNaN(parseValueSafe(props.ffoPerShare)) && {
      ffoPerShare: parseValueSafe(props.ffoPerShare),
      ffoPerShareAnoAnterior: parseValueSafe(props.ffoPerShareAnoAnterior),
    }),

    ...(props.affoPerShare && parseValueSafe(props.affoPerShare) && {
      affoPerShare: parseValueSafe(props.affoPerShare),
      affoPerShareAnoAnterior: parseValueSafe(props.affoPerShareAnoAnterior),
    }),
  }

  // ✅ MELHORADO: Debug logging mais informativo
  const quality = getRealEstateDataQuality(result)
  console.log('🏢 REITs Complementares construídos:', {
    qualityScore: quality.score.toFixed(1) + '%',
    available: quality.availableCount,
    total: quality.totalCount,
    missingCritical: quality.missingCritical,
    // Log alguns valores chave
    samples: {
      dividendYield: result.dividendYield,
      ffo: result.ffo,
      pVpa: result.pVpa,
      pFfo: result.pFfo,
    }
  })

  return result
}

/**
 * ✅ ATUALIZADO: Indicadores core REALISTAS baseados na disponibilidade real
 */
export const REALESTATE_CORE_INDICATORS: (keyof RealEstateComplementares)[] = [
  'dividendYield',      // ✅ Sempre disponível
  'pVpa',              // ✅ Sempre disponível
  'ffo',               // ✅ Sempre disponível (FCF ou FFO real)
  'ocupacao',          // ✅ Sempre disponível (Margem EBITDA)
  'capRate',           // ✅ Sempre disponível (ROA)
  'dividaEbitda',      // ✅ Sempre disponível
  'ffoPayoutRatio',    // ✅ Disponível (Payout real ou FFO Payout)
  'pFfo',              // ✅ Disponível (P/S ou P/FFO real)
]

/**
 * ✅ ATUALIZADO: Indicadores importantes mas nem sempre disponíveis
 */
export const REALESTATE_IMPORTANT_INDICATORS: (keyof RealEstateComplementares)[] = [
  'dividendCagr5y',    // ✅ Geralmente disponível
  'affo',              // ✅ Geralmente disponível
  'coberturaJuros',    // ✅ Calculado
  'liquidezCorrente',  // ✅ Geralmente disponível
  'noi',               // ⚠️ Depende do crescimento de receita
]

/**
 * ✅ NOVO: Indicadores específicos da API (quando REITs são detectados)
 */
export const REALESTATE_API_SPECIFIC_INDICATORS: (keyof RealEstateComplementares)[] = [
  'ffoPerShare',       // ✅ NOVO: Calculado pela API para REITs
  'affoPerShare',      // ✅ NOVO: Calculado pela API para REITs
]

/**
 * ✅ ATUALIZADO: Indicadores opcionais/raros
 */
export const REALESTATE_OPTIONAL_INDICATORS: (keyof RealEstateComplementares)[] = [
  'sameSoreNoi',       // ❌ Raramente disponível
  'navDiscount',       // ❌ Raro em dados públicos
  'retentionRate',     // ❌ Raro em dados públicos
]

/**
 * ✅ MELHORADO: Função para verificar dados mínimos mais realista
 */
export function hasMinimumRealEstateData(complementares: RealEstateComplementares): boolean {
  const minimumRequired: (keyof RealEstateComplementares)[] = [
    'dividendYield', 'pVpa', 'ffo', 'dividaEbitda'
  ]

  const available = minimumRequired.filter(field => {
    const value = complementares[field]
    return value !== undefined && !isNaN(value) && isFinite(value)
  })

  console.log(`🏢 Dados mínimos REITs: ${available.length}/${minimumRequired.length}`, {
    available: available,
    missing: minimumRequired.filter(f => !available.includes(f))
  })

  return available.length >= 3 // Pelo menos 3 dos 4 core indicators
}

/**
 * ✅ MELHORADO: Score de qualidade mais preciso
 */
export function getRealEstateDataQuality(complementares: RealEstateComplementares): {
  score: number
  availableCount: number
  totalCount: number
  missingCritical: string[]
  hasMinimum: boolean
} {
  const allFields = Object.keys(complementares) as (keyof RealEstateComplementares)[]
  const availableCount = allFields.filter(field => {
    const value = complementares[field]
    return value !== undefined && !isNaN(value) && isFinite(value)
  }).length

  const criticalFields = REALESTATE_CORE_INDICATORS
  const missingCritical = criticalFields.filter(field => {
    const value = complementares[field]
    return value === undefined || isNaN(value) || !isFinite(value)
  }).map(field => String(field))

  const score = (availableCount / allFields.length) * 100
  const hasMinimum = hasMinimumRealEstateData(complementares)

  return {
    score,
    availableCount,
    totalCount: allFields.length,
    missingCritical,
    hasMinimum
  }
}

/**
 * ✅ NOVO: Função para verificar se temos indicadores específicos da API
 */
export function hasApiSpecificIndicators(complementares: RealEstateComplementares): boolean {
  return REALESTATE_API_SPECIFIC_INDICATORS.some(field => {
    const value = complementares[field]
    return value !== undefined && !isNaN(value) && isFinite(value)
  })
}

/**
 * ✅ MELHORADO: Validação mais flexível
 */
export function validateRealEstateComplementares(
  complementares: RealEstateComplementares,
  requiredFields: (keyof RealEstateComplementares)[],
): boolean {
  const availableRequired = requiredFields.filter(field => {
    const value = complementares[field]
    return value !== undefined && !isNaN(value) && isFinite(value)
  })

  const isValid = availableRequired.length >= Math.max(1, requiredFields.length * 0.75) // 75% dos campos requeridos

  if (!isValid) {
    console.warn('🚨 REITs: Poucos campos obrigatórios disponíveis:',
      requiredFields.filter(field => {
        const value = complementares[field]
        return value === undefined || isNaN(value) || !isFinite(value)
      })
    )
  }

  return isValid
}

/**
 * ✅ MANTIDO: Subset funcional
 */
export function getRealEstateComplementaresSubset(
  complementares: RealEstateComplementares,
  fields: (keyof RealEstateComplementares)[],
): Partial<RealEstateComplementares> {
  const subset: Partial<RealEstateComplementares> = {}

  fields.forEach((field) => {
    const value = complementares[field]
    if (value !== undefined && !isNaN(value) && isFinite(value)) {
      subset[field] = value
    }
  })

  return subset
}
