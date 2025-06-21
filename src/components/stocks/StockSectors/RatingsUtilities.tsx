import { buildUtilitiesComplementares, RatingsUtilitiesProps } from "../../../utils/complementares/utilitiesComplementares"
import { avaliarIndicadorComContexto } from "../hooks/avaliarIndicadorComContexto"
import { IndicatorValuePro } from "../quickAnalysis/IndicatorValuePro"

interface Categoria {
  label: string
  chave: string
  valor: string
  anterior?: string
  icon?: string
  description?: string
}

// ✅ ADICIONADO: Validações inline (sem ficheiro separado)
interface ValidationResult {
  isValid: boolean
  warning?: string
  severity?: 'low' | 'medium' | 'high' | 'critical'
}

function validateUtilitiesIndicator(chave: string, valor: number): ValidationResult {
  switch (chave) {
    case 'dividendYield':
      if (valor > 12) return {
        isValid: false,
        warning: 'Yield > 12% pode indicar risco extremo',
        severity: 'critical'
      }
      if (valor > 9) return {
        isValid: true,
        warning: 'Yield > 9% é alto - verificar sustentabilidade',
        severity: 'medium'
      }
      break

    case 'payoutRatio':
      if (valor > 150) return {
        isValid: false,
        warning: 'Payout > 150% é insustentável',
        severity: 'critical'
      }
      if (valor > 100) return {
        isValid: true,
        warning: 'Payout > 100% indica distribuição acima dos lucros',
        severity: 'high'
      }
      break

    case 'coberturaJuros':
      if (valor < 0.5) return {
        isValid: false,
        warning: 'Cobertura < 0.5x indica risco de default',
        severity: 'critical'
      }
      if (valor < 1.5) return {
        isValid: true,
        warning: 'Cobertura < 1.5x indica stress financeiro',
        severity: 'high'
      }
      break

    case 'debtToEbitda':
      if (valor > 10) return {
        isValid: false,
        warning: 'Dívida/EBITDA > 10x indica stress extremo',
        severity: 'critical'
      }
      if (valor > 7) return {
        isValid: true,
        warning: 'Dívida/EBITDA > 7x é alto para utilities',
        severity: 'high'
      }
      break

    case 'roe':
      if (valor > 40) return {
        isValid: false,
        warning: 'ROE > 40% pode indicar evento não recorrente',
        severity: 'critical'
      }
      if (valor < 0) return {
        isValid: true,
        warning: 'ROE negativo indica prejuízo',
        severity: 'high'
      }
      break

    case 'capexOverRevenue':
      if (valor > 50) return {
        isValid: false,
        warning: 'CapEx > 50% pode ser insustentável',
        severity: 'critical'
      }
      if (valor > 35) return {
        isValid: true,
        warning: 'CapEx > 35% é muito alto',
        severity: 'medium'
      }
      break

    case 'endividamento':
      if (valor > 90) return {
        isValid: false,
        warning: 'Endividamento > 90% é extremo',
        severity: 'critical'
      }
      break

    case 'pl':
      if (valor > 100) return {
        isValid: false,
        warning: 'P/L > 100x pode indicar erro nos dados',
        severity: 'critical'
      }
      if (valor < 0) return {
        isValid: false,
        warning: 'P/L negativo indica prejuízo',
        severity: 'high'
      }
      break
  }

  return { isValid: true }
}

export function RatingsUtilities(props: RatingsUtilitiesProps) {
  // ✅ CORRIGIDO: Constrói complementares específicos para Utilities
  const complementares = buildUtilitiesComplementares(props)

  console.log('🔧 Utilities Complementares:', complementares)

  // ✅ ADICIONADO: Validação geral no início
  const globalValidationIssues: ValidationResult[] = []
  Object.keys(complementares).forEach(chave => {
    const valor = complementares[chave as keyof typeof complementares]
    if (!isNaN(valor as number)) {
      const validation = validateUtilitiesIndicator(chave, valor as number)
      if (!validation.isValid || (validation.warning && validation.severity === 'critical')) {
        globalValidationIssues.push({...validation, warning: `${chave}: ${validation.warning}`})
      }
    }
  })

  const categorias: Record<string, Categoria[]> = {
    "Múltiplos de Valuation": [
      {
        label: "P/L",
        chave: "pl",
        valor: props.pl,
        anterior: props.plAnoAnterior,
        icon: "💲",
        description: "Preço sobre Lucro - Utilities tipicamente 12-20x"
      },
      {
        label: "Earnings Yield",
        chave: "earningsYield",
        valor: props.earningsYield,
        anterior: props.earningsYieldAnoAnterior,
        icon: "📊",
        description: "Rendimento dos lucros (1/P/L) - Meta: >5%"
      },
      {
        label: "P/VPA",
        chave: "pb",
        valor: props.pb,
        anterior: props.pbAnoAnterior,
        icon: "🏦",
        description: "Preço sobre Valor Patrimonial - Utilities: 1.0-1.8x"
      },
      {
        label: "P/S",
        chave: "ps",
        valor: props.ps,
        anterior: props.psAnoAnterior,
        icon: "💰",
        description: "Preço sobre Vendas - Estável para Utilities"
      },
    ],

    "Dividendos e Renda": [
      {
        label: "Dividend Yield",
        chave: "dividendYield",
        valor: props.dividendYield,
        anterior: props.dividendYieldAnoAnterior,
        icon: "💰",
        description: "Rendimento de dividendos - Core para Utilities (Meta: 3-7%)"
      },
      {
        label: "Payout Ratio",
        chave: "payoutRatio",
        valor: props.payoutRatio,
        anterior: props.payoutRatioAnoAnterior,
        icon: "💸",
        description: "% dos lucros distribuídos - Utilities: 60-85%"
      },
      {
        label: "Crescimento Dividendo 5Y",
        chave: "dividendCagr5y",
        valor: props.dividendCagr5y,
        anterior: props.dividendCagr5yAnoAnterior,
        icon: "📈",
        description: "Crescimento anual dos dividendos - Estabilidade importante"
      },
      {
        label: "Consistência Dividendos",
        chave: "dividendConsistency",
        valor: props.dividendConsistency || 'N/A',
        anterior: props.dividendConsistencyAnoAnterior,
        icon: "🎯",
        description: "Histórico de pagamentos consistentes"
      },
    ],

    "Rentabilidade": [
      {
        label: "ROE",
        chave: "roe",
        valor: props.roe,
        anterior: props.roeAnoAnterior,
        icon: "📈",
        description: "Retorno sobre Patrimônio - Utilities: 8-15%"
      },
      {
        label: "ROIC",
        chave: "roic",
        valor: props.roic,
        anterior: props.roicAnoAnterior,
        icon: "🎯",
        description: "Retorno sobre Capital Investido - Eficiência em infraestrutura"
      },
      {
        label: "ROE Regulatório",
        chave: "regulatoryROE",
        valor: props.regulatoryROE || 'N/A',
        anterior: props.regulatoryROEAnoAnterior,
        icon: "⚖️",
        description: "ROE permitido pelo regulador - Específico de Utilities"
      },
      {
        label: "Margem EBITDA",
        chave: "margemEbitda",
        valor: props.margemEbitda,
        anterior: props.margemEbitdaAnoAnterior,
        icon: "⚙️",
        description: "Margem EBITDA - Utilities: 25-40%"
      },
      {
        label: "Margem Operacional",
        chave: "margemOperacional",
        valor: props.margemOperacional,
        anterior: props.margemOperacionalAnoAnterior,
        icon: "🔧",
        description: "Margem Operacional - Estabilidade operacional"
      },
      {
        label: "Margem Líquida",
        chave: "margemLiquida",
        valor: props.margemLiquida,
        anterior: props.margemLiquidaAnoAnterior,
        icon: "💎",
        description: "Margem Líquida - Resultado final"
      },
    ],

    "Estrutura Financeira": [
      {
        label: "Endividamento",
        chave: "endividamento",
        valor: props.endividamento,
        anterior: props.endividamentoAnoAnterior,
        icon: "⚠️",
        description: "Endividamento - Utilities: 45-65% (normal para o setor)"
      },
      {
        label: "Dívida/EBITDA",
        chave: "debtToEbitda",
        valor: props.debtToEbitda,
        anterior: props.debtToEbitdaAnoAnterior,
        icon: "📊",
        description: "Múltiplo de endividamento - Meta: <5.5x"
      },
      {
        label: "Cobertura de Juros",
        chave: "coberturaJuros",
        valor: props.coberturaJuros,
        anterior: props.coberturaJurosAnoAnterior,
        icon: "🛡️",
        description: "Capacidade de pagamento de juros - CRÍTICO (Meta: >2.5x)"
      },
      {
        label: "Liquidez Corrente",
        chave: "liquidezCorrente",
        valor: props.liquidezCorrente,
        anterior: props.liquidezCorrenteAnoAnterior,
        icon: "💧",
        description: "Liquidez de curto prazo - Menos crítico para Utilities"
      },
    ],

    "Eficiência e Investimentos": [
      {
        label: "Giro do Ativo",
        chave: "giroAtivo",
        valor: props.giroAtivo,
        anterior: props.giroAtivoAnoAnterior,
        icon: "🔄",
        description: "Eficiência no uso dos ativos - Utilities: 0.3-0.5x"
      },
      {
        label: "CapEx/Receita",
        chave: "capexOverRevenue",
        valor: props.capexOverRevenue,
        anterior: props.capexOverRevenueAnoAnterior,
        icon: "🔧",
        description: "Investimento em infraestrutura - Utilities: 15-25%"
      },
      {
        label: "Idade Média dos Ativos",
        chave: "assetAge",
        valor: props.assetAge || 'N/A',
        anterior: props.assetAgeAnoAnterior,
        icon: "⏰",
        description: "Idade da infraestrutura - Impacta necessidade de CapEx"
      },
    ],

    "Crescimento": [
      {
        label: "Crescimento Receita",
        chave: "crescimentoReceita",
        valor: props.crescimentoReceita,
        anterior: props.crescimentoReceitaAnoAnterior,
        icon: "📈",
        description: "Taxa de crescimento da receita - Utilities: 2-6%"
      },
      {
        label: "Crescimento EPS",
        chave: "crescimentoEps",
        valor: props.crescimentoEps,
        anterior: props.crescimentoEpsAnoAnterior,
        icon: "📊",
        description: "Crescimento do lucro por ação"
      },
      {
        label: "Crescimento Rate Base",
        chave: "rateBaseGrowth",
        valor: props.rateBaseGrowth || 'N/A',
        anterior: props.rateBaseGrowthAnoAnterior,
        icon: "🏗️",
        description: "Crescimento da base tarifária - Específico de Utilities"
      },
    ],

    "Métricas Específicas de Utilities": [
      {
        label: "Free Cash Flow",
        chave: "fcf",
        valor: props.fcf,
        anterior: props.fcfAnoAnterior,
        icon: "💵",
        description: "Fluxo de Caixa Livre após CapEx"
      },
      {
        label: "Fator de Capacidade",
        chave: "capacityFactor",
        valor: props.capacityFactor || 'N/A',
        anterior: props.capacityFactorAnoAnterior,
        icon: "⚡",
        description: "Eficiência de geração - Para empresas de energia"
      },
      {
        label: "% Energias Renováveis",
        chave: "renewablePercentage",
        valor: props.renewablePercentage || 'N/A',
        anterior: props.renewablePercentageAnoAnterior,
        icon: "🌱",
        description: "Sustentabilidade - Importante para ESG"
      },
      ...(props.leveredDcf && props.leveredDcf !== 'N/A' && parseFloat(props.leveredDcf) > 0 ? [{
        label: "DCF vs Preço",
        chave: "dcfUpside",
        valor: calculateDCFUpside(props.leveredDcf, props.precoAtual),
        icon: "🎲",
        description: "Potencial de valorização baseado no DCF"
      }] : []),
    ],
  };

  // ✅ MELHORADO: Formatação robusta como Technology
  const formatValue = (valor: string, chave: string) => {
    if (!valor || valor === 'N/A' || valor.trim() === '') return 'N/A'

    const cleanValue = valor.replace('%', '').trim()
    const num = parseFloat(cleanValue)
    if (isNaN(num)) return valor

    // Percentuais
    if (['roe', 'roic', 'regulatoryROE', 'margemEbitda', 'margemOperacional', 'margemLiquida',
         'endividamento', 'dividendYield', 'payoutRatio', 'dividendCagr5y', 'crescimentoReceita',
         'crescimentoEps', 'rateBaseGrowth', 'earningsYield', 'capexOverRevenue', 'renewablePercentage'].includes(chave)) {
      return `${num.toFixed(2)}%`
    }

    // Upside/Downside DCF
    if (chave === 'dcfUpside') {
      return num > 0 ? `+${num.toFixed(1)}%` : `${num.toFixed(1)}%`
    }

    // Valores monetários (FCF)
    if (['fcf'].includes(chave)) {
      if (Math.abs(num) > 1000000000) {
        return `${(num / 1000000000).toFixed(1)}B`
      }
      if (Math.abs(num) > 1000000) {
        return `${(num / 1000000).toFixed(1)}M`
      }
      return `${num.toFixed(0)}`
    }

    // Anos (Asset Age)
    if (chave === 'assetAge') {
      return `${num.toFixed(1)} anos`
    }

    // Fatores (Capacity Factor)
    if (chave === 'capacityFactor') {
      return `${num.toFixed(1)}%`
    }

    // Ratios e múltiplos
    return num.toFixed(2)
  }

  // ✅ NOVO: Filtro inteligente de relevância
  const isIndicadorRelevante = (label: string, valor: string): boolean => {
    // Sempre mostrar indicadores core de Utilities
    const coreIndicators = [
      'Dividend Yield', 'Payout Ratio', 'ROE', 'ROIC', 'Cobertura de Juros',
      'Dívida/EBITDA', 'Margem EBITDA', 'CapEx/Receita'
    ]

    if (coreIndicators.includes(label)) return true

    // Para outros, verificar se tem valor válido
    if (!valor || valor === 'N/A' || valor.trim() === '') return false

    const numeric = parseFloat(valor.replace('%', ''))
    if (isNaN(numeric)) return false

    // Aplicar filtro normal de relevância
    const { apenasInformativo } = avaliarIndicadorComContexto(
      "utilities",
      label,
      numeric,
      { complementares }
    )

    return !apenasInformativo
  }

  return (
    <div className="mt-6 space-y-8">
      {/* ✅ NOVO: Avisos críticos no topo */}
      {globalValidationIssues.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-red-800 font-medium mb-2 flex items-center gap-2">
            🚨 Problemas Críticos Detectados
          </h4>
          <ul className="text-red-700 text-sm space-y-1">
            {globalValidationIssues.map((issue, index) => (
              <li key={index}>• {issue.warning}</li>
            ))}
          </ul>
        </div>
      )}

      {Object.entries(categorias).map(([categoria, indicadores]) => {
        // ✅ MELHORADO: Filtro de relevância inteligente
        const indicadoresValidos = indicadores.filter(({ label, valor }) =>
          isIndicadorRelevante(label, valor)
        )

        // Se não há indicadores válidos, não renderizar a categoria
        if (indicadoresValidos.length === 0) return null

        return (
          <div key={categoria} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                {categoria}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({indicadoresValidos.length} indicador{indicadoresValidos.length !== 1 ? 'es' : ''})
                </span>
              </h3>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {indicadoresValidos.map(({ label, valor, anterior, icon, description, chave }) => {
                  const valorFormatado = formatValue(valor, chave)
                  const anteriorFormatado = anterior ? formatValue(anterior, chave) : undefined

                  // ✅ ADICIONADO: Validação individual do indicador
                  let validationWarning = ''
                  let validationSeverity: 'low' | 'medium' | 'high' | 'critical' = 'low'

                  if (valorFormatado !== 'N/A') {
                    const numeric = parseFloat(valor.replace('%', ''))
                    if (!isNaN(numeric)) {
                      const validation = validateUtilitiesIndicator(chave, numeric)
                      if (validation.warning) {
                        validationWarning = validation.warning
                        validationSeverity = validation.severity || 'low'
                      }
                    }
                  }

                  // Só avaliar se temos valor numérico válido
                  let score: 'good' | 'medium' | 'bad' = 'medium'
                  let explicacaoCustom = ''

                  if (valorFormatado !== 'N/A') {
                    const numeric = parseFloat(valor.replace('%', ''))
                    const prev = anterior ? parseFloat(anterior.replace('%', '')) : undefined

                    const avaliacao = avaliarIndicadorComContexto(
                      "utilities",
                      label,
                      numeric,
                      {
                        valorAnterior: prev,
                        complementares,
                      }
                    )

                    score = avaliacao.score
                    explicacaoCustom = avaliacao.explicacaoCustom || ''
                  }

                  const numericAtual = valorFormatado !== 'N/A' ? parseFloat(valor.replace('%', '')) : null
                  const numericAnterior = anteriorFormatado && anteriorFormatado !== 'N/A' ? parseFloat(anterior!.replace('%', '')) : null

                  const hasImprovement = numericAtual !== null && numericAnterior !== null && numericAtual > numericAnterior
                  const hasDeterioration = numericAtual !== null && numericAnterior !== null && numericAtual < numericAnterior

                  // ✅ NOVO: Classes CSS baseadas na severidade
                  const getSeverityClasses = () => {
                    if (!validationWarning) return ''
                    switch (validationSeverity) {
                      case 'critical': return 'border-l-4 border-red-500 bg-red-50'
                      case 'high': return 'border-l-4 border-orange-400 bg-orange-50'
                      case 'medium': return 'border-l-4 border-yellow-400 bg-yellow-50'
                      default: return 'border-l-4 border-blue-400 bg-blue-50'
                    }
                  }

                  return (
                    <div key={label} className={`bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200 ${getSeverityClasses()}`}>

                      {/* ✅ NOVO: Mostrar aviso de validação */}
                      {validationWarning && (
                        <div className={`mb-2 text-xs rounded p-2 ${
                          validationSeverity === 'critical' ? 'text-red-700 bg-red-100' :
                          validationSeverity === 'high' ? 'text-orange-700 bg-orange-100' :
                          validationSeverity === 'medium' ? 'text-yellow-700 bg-yellow-100' :
                          'text-blue-700 bg-blue-100'
                        }`}>
                          {validationSeverity === 'critical' ? '🚨' :
                           validationSeverity === 'high' ? '⚠️' :
                           validationSeverity === 'medium' ? '⚠️' : 'ℹ️'} {validationWarning}
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {icon && <span className="text-lg">{icon}</span>}
                          <div>
                            <h4 className="font-medium text-gray-800 text-sm">{label}</h4>
                            {description && (
                              <p className="text-xs text-gray-500 mt-1">{description}</p>
                            )}
                          </div>
                        </div>
                        {valorFormatado !== 'N/A' && (
                          <IndicatorValuePro
                            score={score}
                            tooltip={
                              explicacaoCustom && explicacaoCustom.trim() !== ""
                                ? explicacaoCustom
                                : `Benchmark específico para ${label} no setor Utilities.`
                            }
                          />
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className={`text-lg font-bold ${valorFormatado === 'N/A' ? 'text-gray-400' : 'text-gray-900'}`}>
                          {valorFormatado}
                        </span>

                        {anteriorFormatado && anteriorFormatado !== 'N/A' && (
                          <div className="flex items-center gap-1 text-xs">
                            <span className="text-gray-500">vs.</span>
                            <span className="text-gray-600">{anteriorFormatado}</span>
                            {hasImprovement && <span className="text-green-500">↗</span>}
                            {hasDeterioration && <span className="text-red-500">↘</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ✅ HELPER: Cálculo DCF vs Preço
function calculateDCFUpside(leveredDcf: string, precoAtual: string): string {
  const dcf = parseFloat(leveredDcf)
  const preco = parseFloat(precoAtual)

  if (isNaN(dcf) || isNaN(preco) || preco === 0) return 'N/A'

  const upside = ((dcf - preco) / preco) * 100
  return upside.toFixed(1)
}
