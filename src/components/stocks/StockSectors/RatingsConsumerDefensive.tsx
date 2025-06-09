import { avaliarIndicadorComContexto } from "../hooks/avaliarIndicadorComContexto"
import { IndicatorValuePro } from "../quickAnalysis/IndicatorValuePro"

interface RatingsConsumerDefensiveProps {
  // Rentabilidade e Retorno
  pe: string
  peAnoAnterior?: string
  pb: string
  pbAnoAnterior?: string
  ps: string
  psAnoAnterior?: string
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

  // Crescimento e Estabilidade
  receitaCagr3y: string
  receitaCagr3yAnoAnterior?: string
  crescimentoReceita: string
  crescimentoReceitaAnoAnterior?: string
  consistenciaReceita: string
  consistenciaReceitaAnoAnterior?: string

  // Estrutura de Capital e Solvência
  dividaEbitda: string
  dividaEbitdaAnoAnterior?: string
  coberturaJuros: string
  coberturaJurosAnoAnterior?: string
  liquidezCorrente: string
  liquidezCorrenteAnoAnterior?: string
  debtEquity: string
  debtEquityAnoAnterior?: string

  // Fluxo de Caixa e Eficiência
  freeCashFlow: string
  freeCashFlowAnoAnterior?: string
  fcfYield: string
  fcfYieldAnoAnterior?: string
  workingCapitalTurnover: string
  workingCapitalTurnoverAnoAnterior?: string
  inventoryTurnover: string
  inventoryTurnoverAnoAnterior?: string

  // Dividendos e Retorno Defensivo
  payoutRatio: string
  payoutRatioAnoAnterior?: string
  dividendYield: string
  dividendYieldAnoAnterior?: string
  dividendGrowth: string
  dividendGrowthAnoAnterior?: string
  yearsOfDividends: string
  yearsOfDividendsAnoAnterior?: string

  // Volatilidade e Avaliação
  beta: string
  betaAnoAnterior?: string
  leveredDcf: string
  leveredDcfAnoAnterior?: string
  precoAtual: string
  precoAtualAnoAnterior?: string

  // Métricas Específicas de Consumer Defensive
  marketShare?: string
  marketShareAnoAnterior?: string
  brandStrength?: string
  brandStrengthAnoAnterior?: string
  storeCount?: string
  storeCountAnoAnterior?: string
}

interface Categoria {
  label: string
  chave: string
  valor: string
  anterior?: string
  icon?: string
  description?: string
}

export function RatingsConsumerDefensive(props: RatingsConsumerDefensiveProps) {
  // Calcular métricas específicas de consumer defensive
  const calculateConsumerDefensiveMetrics = () => {
    const roeNum = parseFloat(props.roe) || 0
    const grossMarginNum = parseFloat(props.grossMargin) || 0
    const dividendYieldNum = parseFloat(props.dividendYield) || 0
    const betaNum = parseFloat(props.beta) || 0
    const payoutRatioNum = parseFloat(props.payoutRatio) || 0
    const receitaCagr3yNum = parseFloat(props.receitaCagr3y) || 0

    return {
      // Score de Estabilidade
      estabilidade: betaNum < 0.8 && dividendYieldNum > 3 && payoutRatioNum < 70 ? "95" :
                   betaNum < 1 && dividendYieldNum > 2 ? "80" : "60",

      // Score de Qualidade Defensiva
      qualidadeDefensiva: grossMarginNum > 35 && roeNum > 15 && receitaCagr3yNum > 5 ? "90" :
                         grossMarginNum > 25 && roeNum > 12 ? "75" : "50",

      // Score de Sustentabilidade de Dividendos
      sustentabilidadeDividendos: payoutRatioNum < 60 && dividendYieldNum > 3 ? "85" :
                                 payoutRatioNum < 75 && dividendYieldNum > 2 ? "70" : "45",
    }
  }

  const calculatedMetrics = calculateConsumerDefensiveMetrics()

  const categorias: Record<string, Categoria[]> = {
    "Rentabilidade e Retorno": [
      {
        label: "P/L",
        chave: "pe",
        valor: props.pe,
        anterior: props.peAnoAnterior,
        icon: "💲",
        description: "Preço sobre Lucro"
      },
      {
        label: "P/VPA",
        chave: "pb",
        valor: props.pb,
        anterior: props.pbAnoAnterior,
        icon: "📚",
        description: "Preço sobre Valor Patrimonial"
      },
      {
        label: "P/S",
        chave: "ps",
        valor: props.ps,
        anterior: props.psAnoAnterior,
        icon: "📊",
        description: "Preço sobre Vendas"
      },
      {
        label: "ROE",
        chave: "roe",
        valor: props.roe,
        anterior: props.roeAnoAnterior,
        icon: "📈",
        description: "Retorno sobre Patrimônio Líquido"
      },
      {
        label: "ROIC",
        chave: "roic",
        valor: props.roic,
        anterior: props.roicAnoAnterior,
        icon: "🎯",
        description: "Retorno sobre Capital Investido"
      },
    ],

    "Margens e Eficiência": [
      {
        label: "Margem Bruta",
        chave: "grossMargin",
        valor: props.grossMargin,
        anterior: props.grossMarginAnoAnterior,
        icon: "💰",
        description: "Margem Bruta"
      },
      {
        label: "Margem EBITDA",
        chave: "ebitdaMargin",
        valor: props.ebitdaMargin,
        anterior: props.ebitdaMarginAnoAnterior,
        icon: "📊",
        description: "Margem EBITDA"
      },
      {
        label: "Margem Líquida",
        chave: "margemLiquida",
        valor: props.margemLiquida,
        anterior: props.margemLiquidaAnoAnterior,
        icon: "🎯",
        description: "Margem Líquida"
      },
      {
        label: "Margem Operacional",
        chave: "margemOperacional",
        valor: props.margemOperacional,
        anterior: props.margemOperacionalAnoAnterior,
        icon: "⚙️",
        description: "Margem Operacional"
      },
    ],

    "Crescimento e Estabilidade": [
      {
        label: "Crescimento da Receita",  // ✅ CORRIGIDO: Era "CAGR Receita 3Y"
        chave: "receitaCagr3y",
        valor: props.receitaCagr3y,
        anterior: props.receitaCagr3yAnoAnterior,
        icon: "📈",
        description: "CAGR de 3 anos da Receita"
      },
      {
        label: "Crescimento Receita",
        chave: "crescimentoReceita",
        valor: props.crescimentoReceita,
        anterior: props.crescimentoReceitaAnoAnterior,
        icon: "📊",
        description: "Crescimento Anual da Receita"
      },
      {
        label: "Consistência Receita",
        chave: "consistenciaReceita",
        valor: props.consistenciaReceita,
        anterior: props.consistenciaReceitaAnoAnterior,
        icon: "🎯",
        description: "Consistência do Crescimento"
      },
    ],

    "Estrutura de Capital e Solvência": [
      {
        label: "Dívida/EBITDA",
        chave: "dividaEbitda",
        valor: props.dividaEbitda,
        anterior: props.dividaEbitdaAnoAnterior,
        icon: "⚖️",
        description: "Endividamento vs. Geração de Caixa"
      },
      {
        label: "Cobertura de Juros",
        chave: "coberturaJuros",
        valor: props.coberturaJuros,
        anterior: props.coberturaJurosAnoAnterior,
        icon: "🛡️",
        description: "Capacidade de Pagamento de Juros"
      },
      {
        label: "Liquidez Corrente",
        chave: "liquidezCorrente",
        valor: props.liquidezCorrente,
        anterior: props.liquidezCorrenteAnoAnterior,
        icon: "💧",
        description: "Liquidez de Curto Prazo"
      },
      {
        label: "Dívida/Patrimônio",
        chave: "debtEquity",
        valor: props.debtEquity,
        anterior: props.debtEquityAnoAnterior,
        icon: "📊",
        description: "Alavancagem Financeira"
      },
    ],

    "Fluxo de Caixa e Eficiência": [
      {
        label: "Free Cash Flow",
        chave: "freeCashFlow",
        valor: props.freeCashFlow,
        anterior: props.freeCashFlowAnoAnterior,
        icon: "💸",
        description: "Fluxo de Caixa Livre"
      },
      {
        label: "FCF Yield",
        chave: "fcfYield",
        valor: props.fcfYield,
        anterior: props.fcfYieldAnoAnterior,
        icon: "💰",
        description: "Rendimento do Fluxo de Caixa"
      },
      {
        label: "Working Capital Turnover",
        chave: "workingCapitalTurnover",
        valor: props.workingCapitalTurnover,
        anterior: props.workingCapitalTurnoverAnoAnterior,
        icon: "🔄",
        description: "Eficiência do Capital de Giro"
      },
      {
        label: "Inventory Turnover",
        chave: "inventoryTurnover",
        valor: props.inventoryTurnover,
        anterior: props.inventoryTurnoverAnoAnterior,
        icon: "📦",
        description: "Giro de Inventário"
      },
    ],

    "Dividendos e Retorno Defensivo": [
      {
        label: "Payout Ratio",
        chave: "payoutRatio",
        valor: props.payoutRatio,
        anterior: props.payoutRatioAnoAnterior,
        icon: "📤",
        description: "% dos lucros distribuídos"
      },
      {
        label: "Dividend Yield",
        chave: "dividendYield",
        valor: props.dividendYield,
        anterior: props.dividendYieldAnoAnterior,
        icon: "💎",
        description: "Rendimento de Dividendos"
      },
      {
        label: "Crescimento Dividendos",
        chave: "dividendGrowth",
        valor: props.dividendGrowth,
        anterior: props.dividendGrowthAnoAnterior,
        icon: "📈",
        description: "Crescimento dos Dividendos"
      },
      {
        label: "Anos de Dividendos",
        chave: "yearsOfDividends",
        valor: props.yearsOfDividends,
        anterior: props.yearsOfDividendsAnoAnterior,
        icon: "🏆",
        description: "Anos Consecutivos Pagando"
      },
    ],

    "Volatilidade e Avaliação": [
      {
        label: "Beta",
        chave: "beta",
        valor: props.beta,
        anterior: props.betaAnoAnterior,
        icon: "📉",
        description: "Volatilidade vs. mercado"
      },
      {
        label: "Valuation (DCF)",
        chave: "leveredDcf",
        valor: props.leveredDcf,
        anterior: props.leveredDcfAnoAnterior,
        icon: "📊",
        description: "Fluxo de Caixa Descontado"
      },
    ],

    "Métricas Específicas de Consumer Defensive": [
      ...(props.marketShare ? [{
        label: "Market Share",
        chave: "marketShare",
        valor: props.marketShare,
        anterior: props.marketShareAnoAnterior,
        icon: "🎯",
        description: "Participação de Mercado"
      }] : []),
      ...(props.brandStrength ? [{
        label: "Brand Strength",
        chave: "brandStrength",
        valor: props.brandStrength,
        anterior: props.brandStrengthAnoAnterior,
        icon: "🏷️",
        description: "Força da Marca"
      }] : []),
      ...(props.storeCount ? [{
        label: "Store Count",
        chave: "storeCount",
        valor: props.storeCount,
        anterior: props.storeCountAnoAnterior,
        icon: "🏪",
        description: "Número de Lojas"
      }] : []),
      {
        label: "Estabilidade",
        chave: "estabilidade",
        valor: calculatedMetrics.estabilidade,
        icon: "🛡️",
        description: "Score de estabilidade defensiva"
      },
      {
        label: "Qualidade Defensiva",
        chave: "qualidadeDefensiva",
        valor: calculatedMetrics.qualidadeDefensiva,
        icon: "🏆",
        description: "Score de qualidade defensiva"
      },
      {
        label: "Sustentabilidade Dividendos",
        chave: "sustentabilidadeDividendos",
        valor: calculatedMetrics.sustentabilidadeDividendos,
        icon: "💎",
        description: "Score de sustentabilidade dos dividendos"
      },
    ],
  };

  // Complementares incluindo métricas calculadas e dados base
  const complementares = {
    // Métricas calculadas
    estabilidade: parseFloat(calculatedMetrics.estabilidade || "0"),
    qualidadeDefensiva: parseFloat(calculatedMetrics.qualidadeDefensiva || "0"),
    sustentabilidadeDividendos: parseFloat(calculatedMetrics.sustentabilidadeDividendos || "0"),

    // Dados originais (valores atuais)
    pe: parseFloat(props.pe ?? "NaN"),
    pb: parseFloat(props.pb ?? "NaN"),
    ps: parseFloat(props.ps ?? "NaN"),
    roe: parseFloat(props.roe ?? "NaN"),
    roic: parseFloat(props.roic ?? "NaN"),
    grossMargin: parseFloat(props.grossMargin ?? "NaN"),
    ebitdaMargin: parseFloat(props.ebitdaMargin ?? "NaN"),
    margemLiquida: parseFloat(props.margemLiquida ?? "NaN"),
    margemOperacional: parseFloat(props.margemOperacional ?? "NaN"),
    receitaCagr3y: parseFloat(props.receitaCagr3y ?? "NaN"),
    crescimentoReceita: parseFloat(props.crescimentoReceita ?? "NaN"),
    consistenciaReceita: parseFloat(props.consistenciaReceita ?? "NaN"),
    dividaEbitda: parseFloat(props.dividaEbitda ?? "NaN"),
    coberturaJuros: parseFloat(props.coberturaJuros ?? "NaN"),
    liquidezCorrente: parseFloat(props.liquidezCorrente ?? "NaN"),
    debtEquity: parseFloat(props.debtEquity ?? "NaN"),
    freeCashFlow: parseFloat(props.freeCashFlow ?? "NaN"),
    fcfYield: parseFloat(props.fcfYield ?? "NaN"),
    workingCapitalTurnover: parseFloat(props.workingCapitalTurnover ?? "NaN"),
    inventoryTurnover: parseFloat(props.inventoryTurnover ?? "NaN"),
    payoutRatio: parseFloat(props.payoutRatio ?? "NaN"),
    dividendYield: parseFloat(props.dividendYield ?? "NaN"),
    dividendGrowth: parseFloat(props.dividendGrowth ?? "NaN"),
    yearsOfDividends: parseFloat(props.yearsOfDividends ?? "NaN"),
    beta: parseFloat(props.beta ?? "NaN"),
    leveredDcf: parseFloat(props.leveredDcf ?? "NaN"),
    precoAtual: parseFloat(props.precoAtual ?? "NaN"),
    marketShare: parseFloat(props.marketShare ?? "NaN"),
    brandStrength: parseFloat(props.brandStrength ?? "NaN"),
    storeCount: parseFloat(props.storeCount ?? "NaN"),

    // Dados anteriores (todos os campos com AnoAnterior)
    peAnoAnterior: parseFloat(props.peAnoAnterior ?? "NaN"),
    pbAnoAnterior: parseFloat(props.pbAnoAnterior ?? "NaN"),
    psAnoAnterior: parseFloat(props.psAnoAnterior ?? "NaN"),
    roeAnoAnterior: parseFloat(props.roeAnoAnterior ?? "NaN"),
    roicAnoAnterior: parseFloat(props.roicAnoAnterior ?? "NaN"),
    grossMarginAnoAnterior: parseFloat(props.grossMarginAnoAnterior ?? "NaN"),
    ebitdaMarginAnoAnterior: parseFloat(props.ebitdaMarginAnoAnterior ?? "NaN"),
    margemLiquidaAnoAnterior: parseFloat(props.margemLiquidaAnoAnterior ?? "NaN"),
    margemOperacionalAnoAnterior: parseFloat(props.margemOperacionalAnoAnterior ?? "NaN"),
    receitaCagr3yAnoAnterior: parseFloat(props.receitaCagr3yAnoAnterior ?? "NaN"),
    crescimentoReceitaAnoAnterior: parseFloat(props.crescimentoReceitaAnoAnterior ?? "NaN"),
    consistenciaReceitaAnoAnterior: parseFloat(props.consistenciaReceitaAnoAnterior ?? "NaN"),
    dividaEbitdaAnoAnterior: parseFloat(props.dividaEbitdaAnoAnterior ?? "NaN"),
    coberturaJurosAnoAnterior: parseFloat(props.coberturaJurosAnoAnterior ?? "NaN"),
    liquidezCorrenteAnoAnterior: parseFloat(props.liquidezCorrenteAnoAnterior ?? "NaN"),
    debtEquityAnoAnterior: parseFloat(props.debtEquityAnoAnterior ?? "NaN"),
    freeCashFlowAnoAnterior: parseFloat(props.freeCashFlowAnoAnterior ?? "NaN"),
    fcfYieldAnoAnterior: parseFloat(props.fcfYieldAnoAnterior ?? "NaN"),
    workingCapitalTurnoverAnoAnterior: parseFloat(props.workingCapitalTurnoverAnoAnterior ?? "NaN"),
    inventoryTurnoverAnoAnterior: parseFloat(props.inventoryTurnoverAnoAnterior ?? "NaN"),
    payoutRatioAnoAnterior: parseFloat(props.payoutRatioAnoAnterior ?? "NaN"),
    dividendYieldAnoAnterior: parseFloat(props.dividendYieldAnoAnterior ?? "NaN"),
    dividendGrowthAnoAnterior: parseFloat(props.dividendGrowthAnoAnterior ?? "NaN"),
    yearsOfDividendsAnoAnterior: parseFloat(props.yearsOfDividendsAnoAnterior ?? "NaN"),
    betaAnoAnterior: parseFloat(props.betaAnoAnterior ?? "NaN"),
    leveredDcfAnoAnterior: parseFloat(props.leveredDcfAnoAnterior ?? "NaN"),
    precoAtualAnoAnterior: parseFloat(props.precoAtualAnoAnterior ?? "NaN"),
    marketShareAnoAnterior: parseFloat(props.marketShareAnoAnterior ?? "NaN"),
    brandStrengthAnoAnterior: parseFloat(props.brandStrengthAnoAnterior ?? "NaN"),
    storeCountAnoAnterior: parseFloat(props.storeCountAnoAnterior ?? "NaN"),
  }

  // Formatação adequada para consumer defensive
  const formatValue = (valor: string, chave: string) => {
    const num = parseFloat(valor)
    if (isNaN(num)) return valor

    // Percentuais
    if (['roe', 'roic', 'grossMargin', 'ebitdaMargin', 'margemLiquida', 'margemOperacional', 'receitaCagr3y', 'crescimentoReceita', 'consistenciaReceita', 'payoutRatio', 'dividendYield', 'dividendGrowth', 'fcfYield', 'marketShare', 'estabilidade', 'qualidadeDefensiva', 'sustentabilidadeDividendos'].includes(chave)) {
      return `${num.toFixed(2)}%`
    }

    // Valores monetários (DCF, FCF)
    if (['leveredDcf', 'precoAtual', 'freeCashFlow'].includes(chave)) {
      return `${num.toFixed(2)}`
    }

    // Contadores (lojas, anos)
    if (['storeCount', 'yearsOfDividends'].includes(chave)) {
      return `${num.toFixed(0)}`
    }

    // Ratios de giro e turnover
    if (['workingCapitalTurnover', 'inventoryTurnover'].includes(chave)) {
      return `${num.toFixed(2)}x`
    }

    // Scores (força da marca, etc)
    if (['brandStrength'].includes(chave)) {
      return `${num.toFixed(1)}/10`
    }

    // Ratios gerais
    return num.toFixed(2)
  }

  return (
    <div className="mt-6 space-y-8">
      {Object.entries(categorias).map(([categoria, indicadores]) => {
        // Filtrar indicadores válidos
        const indicadoresValidos = indicadores.filter(({ label, valor, anterior }) => {
          const numeric = parseFloat(valor)
          if (isNaN(numeric)) return false

          const prev = anterior ? parseFloat(anterior) : undefined

          const { apenasInformativo } = avaliarIndicadorComContexto(
            "Consumer Defensive",
            label,
            numeric,
            {
              valorAnterior: prev,
              complementares,
            }
          )
          return !apenasInformativo
        })

        // Se não há indicadores válidos, não renderizar a categoria
        if (indicadoresValidos.length === 0) return null

        return (
          <div key={categoria} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                {categoria}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({indicadoresValidos.length} indicador{indicadoresValidos.length !== 1 ? 'es' : ''})
                </span>
              </h3>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {indicadoresValidos.map(({ label, valor, anterior, icon, description, chave }) => {
                  const numeric = parseFloat(valor)
                  const prev = anterior ? parseFloat(anterior) : undefined

                  const { score, explicacaoCustom } = avaliarIndicadorComContexto(
                    "Consumer Defensive",
                    label,
                    numeric,
                    {
                      valorAnterior: prev,
                      complementares,
                    }
                  )

                  const hasImprovement = prev !== undefined && numeric > prev
                  const hasDeterioration = prev !== undefined && numeric < prev

                  return (
                    <div key={label} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
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
                        <IndicatorValuePro
                          score={score}
                          tooltip={
                            explicacaoCustom && explicacaoCustom.trim() !== ""
                              ? explicacaoCustom
                              : `Benchmark definido para o indicador "${label}".`
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          {formatValue(valor, chave)}
                        </span>

                        {anterior && (
                          <div className="flex items-center gap-1 text-xs">
                            <span className="text-gray-500">vs.</span>
                            <span className="text-gray-600">{formatValue(anterior, chave)}</span>
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
