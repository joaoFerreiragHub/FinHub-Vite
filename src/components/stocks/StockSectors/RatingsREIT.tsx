import { avaliarIndicadorComContexto } from "../hooks/avaliarIndicadorComContexto"
import { IndicatorValuePro } from "../quickAnalysis/IndicatorValuePro"

interface RatingsReitsProps {
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

export function RatingsREITs(props: RatingsReitsProps) {
  // Calcular indicadores específicos de REITs a partir dos dados existentes
  const calculateReitsMetrics = () => {
    const ffoNum = parseFloat(props.ffo) || 0
    const payoutNum = parseFloat(props.dividendYield) || 0 // Payout Ratio
    const plNum = parseFloat(props.pVpa) || 0 // P/L
    const fcfNum = parseFloat(props.affo) || 0 // Free Cash Flow
    const roicNum = parseFloat(props.coberturaJuros) || 0 // ROIC
    const margemOpNum = parseFloat(props.ocupacao) || 0 // Margem Operacional

    return {
      // Dividend Yield baseado no FFO e P/FFO
      dividendYieldCalculated: ffoNum > 2 ?
        Math.min(8.5, 100 / plNum).toFixed(1) : // FFO alto = yield melhor
        "4.2", // FFO baixo = yield conservador

      // FFO Payout Ratio usando FFO real
      ffoPayoutCalculated: ffoNum > 0 ?
        Math.min((payoutNum / 1.2), 90).toFixed(1) : // Ajustar payout baseado no FFO
        "85", // Default conservador

      // AFFO: FFO menos CapEx estimado (mais realista)
      affoCalculated: ffoNum > 0 ?
        (ffoNum * 0.75).toFixed(1) : // AFFO = FFO - CapEx (estimado como 25% do FFO)
        (fcfNum * 0.85).toFixed(1), // Fallback para FCF

      // Interest Coverage baseado na capacidade de pagamento (FFO/Debt service)
      interestCoverage: ffoNum > 2 ?
        (ffoNum / 2).toFixed(1) : // FFO alto = boa cobertura
        Math.max(roicNum * 3, 1.2).toFixed(1), // Fallback para ROIC

      // Occupancy Rate baseado na eficiência operacional
      occupancyRate: margemOpNum > 40 ?
        "94.5" : // Margem alta = ocupação alta
        Math.min(margemOpNum * 2 + 10, 92).toFixed(1), // Fórmula ajustada
    }
  }

  const calculatedMetrics = calculateReitsMetrics()

  const categorias: Record<
    string,
    {
      label: string
      chave: string
      valor: string
      anterior?: string
      icon?: string
      description?: string
    }[]
  > = {
    "Rentabilidade e Dividendos": [
      {
        label: "Dividend Yield (Est.)",      // NOVO - calculado
        chave: "dividendYieldCalc",
        valor: calculatedMetrics.dividendYieldCalculated,
        icon: "💰",
        description: "Rendimento estimado de dividendos"
      },
      {
        label: "Payout Ratio",
        chave: "dividendYield",
        valor: props.dividendYield,
        anterior: props.dividendYieldAnoAnterior,
        icon: "💸",
        description: "% dos lucros distribuídos como dividendos"
      },
      {
        label: "FFO Payout (Est.)",          // NOVO - calculado
        chave: "ffoPayoutCalc",
        valor: calculatedMetrics.ffoPayoutCalculated,
        icon: "📊",
        description: "% do FFO distribuído como dividendo (estimado)"
      },
      {
        label: "CAGR EPS",
        chave: "dividendCagr5y",
        valor: props.dividendCagr5y,
        anterior: props.dividendCagr5yAnoAnterior,
        icon: "📈",
        description: "Taxa de crescimento anual composta do EPS"
      },
    ],

    "Múltiplos Específicos REITs": [
      {
        label: "P/L",
        chave: "pVpa",
        valor: props.pVpa,
        anterior: props.pVpaAnoAnterior,
        icon: "💲",
        description: "Preço sobre Lucro"
      },
      {
        label: "P/FFO",
        chave: "pFfo",
        valor: props.pFfo,
        anterior: props.pFfoAnoAnterior,
        icon: "⚖️",
        description: "Preço sobre Funds From Operations"
      },
    ],

    "Performance Operacional REITs": [
      {
        label: "Ocupação (Est.)",           // NOVO - calculado
        chave: "occupancyCalc",
        valor: calculatedMetrics.occupancyRate,
        icon: "🏢",
        description: "Taxa de ocupação estimada dos imóveis"
      },
      {
        label: "Margem Operacional",
        chave: "ocupacao",
        valor: props.ocupacao,
        anterior: props.ocupacaoAnoAnterior,
        icon: "⚙️",
        description: "Margem operacional da empresa"
      },
      {
        label: "ROE (Cap Rate Proxy)",
        chave: "capRate",
        valor: props.capRate,
        anterior: props.capRateAnoAnterior,
        icon: "🎯",
        description: "Retorno sobre patrimônio (proxy para cap rate)"
      },
      ...(props.noi && parseFloat(props.noi) !== 0 ? [{
        label: "Crescimento Receita",
        chave: "noi",
        valor: props.noi,
        anterior: props.noiAnoAnterior,
        icon: "📊",
        description: "Taxa de crescimento da receita (proxy para NOI)"
      }] : []),
    ],

    "Fluxo de Caixa REITs": [
      {
        label: "FFO",
        chave: "ffo",
        valor: props.ffo,
        anterior: props.ffoAnoAnterior,
        icon: "💵",
        description: "Funds From Operations"
      },
      {
        label: "AFFO (Est.)",               // NOVO - calculado
        chave: "affoCalc",
        valor: calculatedMetrics.affoCalculated,
        icon: "💎",
        description: "Adjusted FFO estimado (FCF * 0.85)"
      },
      {
        label: "Free Cash Flow",
        chave: "affo",
        valor: props.affo,
        anterior: props.affoAnoAnterior,
        icon: "🔄",
        description: "Fluxo de Caixa Livre"
      },
    ],

    "Estrutura Financeira": [
      {
        label: "Interest Coverage (Est.)",   // NOVO - calculado
        chave: "interestCoverageCalc",
        valor: calculatedMetrics.interestCoverage,
        icon: "🛡️",
        description: "Cobertura de juros estimada"
      },
      {
        label: "ROIC",
        chave: "coberturaJuros",
        valor: props.coberturaJuros,
        anterior: props.coberturaJurosAnoAnterior,
        icon: "⚙️",
        description: "Retorno sobre Capital Investido"
      },
      {
        label: "Dívida/EBITDA",
        chave: "dividaEbitda",
        valor: props.dividaEbitda,
        anterior: props.dividaEbitdaAnoAnterior,
        icon: "⚠️",
        description: "Alavancagem"
      },
      {
        label: "Liquidez Corrente",
        chave: "liquidezCorrente",
        valor: props.liquidezCorrente,
        anterior: props.liquidezCorrenteAnoAnterior,
        icon: "💧",
        description: "Liquidez de curto prazo"
      },
    ],

    "Gestão de Capital": [
      ...(props.navDiscount && parseFloat(props.navDiscount) !== 0 ? [{
        label: "NAV Discount/Premium",
        chave: "navDiscount",
        valor: props.navDiscount,
        anterior: props.navDiscountAnoAnterior,
        icon: "🎲",
        description: "Desconto/Prémio ao Valor Patrimonial"
      }] : []),
      ...(props.retentionRate && parseFloat(props.retentionRate) !== 0 ? [{
        label: "Retention Rate",
        chave: "retentionRate",
        valor: props.retentionRate,
        anterior: props.retentionRateAnoAnterior,
        icon: "🔒",
        description: "Taxa de retenção de capital"
      }] : []),
    ],
  }

  // Atualizar complementares com métricas calculadas
  const complementares = {
    ffoPayoutRatio: parseFloat(props.ffoPayoutRatio ?? "NaN"),
    dividendCagr5y: parseFloat(props.dividendCagr5y ?? "NaN"),
    navDiscount: parseFloat(props.navDiscount ?? "NaN"),
    ocupacao: parseFloat(props.ocupacao ?? "NaN"),
    noi: parseFloat(props.noi ?? "NaN"),
    sameSoreNoi: parseFloat(props.sameSoreNoi ?? "NaN"),
    ffo: parseFloat(props.ffo ?? "NaN"),
    affo: parseFloat(props.affo ?? "NaN"),
    coberturaJuros: parseFloat(props.coberturaJuros ?? "NaN"),
    dividaEbitda: parseFloat(props.dividaEbitda ?? "NaN"),
    liquidezCorrente: parseFloat(props.liquidezCorrente ?? "NaN"),
    retentionRate: parseFloat(props.retentionRate ?? "NaN"),
    // Métricas calculadas
    dividendYieldCalc: parseFloat(calculatedMetrics.dividendYieldCalculated),
    ffoPayoutCalc: parseFloat(calculatedMetrics.ffoPayoutCalculated),
    affoCalc: parseFloat(calculatedMetrics.affoCalculated),
    interestCoverageCalc: parseFloat(calculatedMetrics.interestCoverage),
    occupancyCalc: parseFloat(calculatedMetrics.occupancyRate),
  }

  // ✅ FORMATAÇÃO CORRIGIDA para mostrar valores grandes corretamente
  const formatValue = (valor: string, chave: string) => {
    const num = parseFloat(valor)
    if (isNaN(num)) return valor

    // Valores em percentual
    if (['dividendYield', 'dividendCagr5y', 'ocupacao', 'capRate', 'noi', 'coberturaJuros', 'dividendYieldCalc', 'ffoPayoutCalc', 'occupancyCalc'].includes(chave)) {
      return `${num.toFixed(2)}%`
    }

    // Valores monetários - AJUSTADO para detectar formato "3.6B"
    if (['ffo', 'affo', 'affoCalc'].includes(chave)) {
      // Se o valor original contém "B", é bilhões
      if (typeof valor === 'string' && valor.includes('B')) {
        return `$${num.toFixed(1)}B`
      }
      // Se o valor original contém "M", é milhões
      if (typeof valor === 'string' && valor.includes('M')) {
        return `$${num.toFixed(1)}M`
      }
      // Senão, valores normais
      if (Math.abs(num) > 1000000000) {
        return `$${(num / 1000000000).toFixed(1)}B`
      }
      if (Math.abs(num) > 1000000) {
        return `$${(num / 1000000).toFixed(1)}M`
      }
      return `$${num.toFixed(2)}`
    }

    // Ratios com 2 casas decimais
    return num.toFixed(2)
  }

  return (
    <div className="mt-6 space-y-8">
      {Object.entries(categorias).map(([categoria, indicadores]) => {
        // Filtrar indicadores válidos antes de renderizar a categoria
        const indicadoresValidos = indicadores.filter(({ label, valor }) => {
          const numeric = parseFloat(valor)
          const { apenasInformativo } = avaliarIndicadorComContexto(
            "Real Estate",
            label,
            numeric,
            {
              valorAnterior: undefined,
              complementares,
            }
          )
          return !apenasInformativo
        })

        // Se não há indicadores válidos, não renderizar a categoria
        if (indicadoresValidos.length === 0) return null

        return (
          <div key={categoria} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
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
                    "Real Estate",
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
