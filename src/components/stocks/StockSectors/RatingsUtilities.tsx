import { avaliarIndicadorComContexto } from "../hooks/avaliarIndicadorComContexto"
import { IndicatorValuePro } from "../quickAnalysis/IndicatorValuePro"

interface RatingsUtilitiesProps {
  // Múltiplos de Valuation
  pl: string
  plAnoAnterior?: string
  pb: string
  pbAnoAnterior?: string
  ps: string
  psAnoAnterior?: string
  earningsYield: string
  earningsYieldAnoAnterior?: string

  // Rentabilidade
  roe: string
  roeAnoAnterior?: string
  roic: string
  roicAnoAnterior?: string
  margemEbitda: string
  margemEbitdaAnoAnterior?: string
  margemOperacional: string
  margemOperacionalAnoAnterior?: string
  margemLiquida: string
  margemLiquidaAnoAnterior?: string

  // Dividendos e Distribuições
  dividendYield: string
  dividendYieldAnoAnterior?: string
  payoutRatio: string
  payoutRatioAnoAnterior?: string
  dividendCagr5y: string
  dividendCagr5yAnoAnterior?: string

  // Estrutura Financeira
  endividamento: string
  endividamentoAnoAnterior?: string
  debtToEbitda: string
  debtToEbitdaAnoAnterior?: string
  coberturaJuros: string
  coberturaJurosAnoAnterior?: string
  liquidezCorrente: string
  liquidezCorrenteAnoAnterior?: string

  // Eficiência Operacional
  giroAtivo: string
  giroAtivoAnoAnterior?: string
  capexOverRevenue: string
  capexOverRevenueAnoAnterior?: string

  // Crescimento
  crescimentoReceita: string
  crescimentoReceitaAnoAnterior?: string
  crescimentoEps: string
  crescimentoEpsAnoAnterior?: string

  // Valuation vs Fundamentals
  leveredDcf: string
  precoAtual: string
  fcf?: string
  fcfAnoAnterior?: string
}

interface Categoria {
  label: string
  chave: string
  valor: string
  anterior?: string
  icon?: string
  description?: string
}

export function RatingsUtilities(props: RatingsUtilitiesProps) {
  // Calcular indicadores específicos de Utilities
  const calculateUtilitiesMetrics = () => {
    const plNum = parseFloat(props.pl) || 0
    const roeNum = parseFloat(props.roe) || 0
    const coberturaJurosNum = parseFloat(props.coberturaJuros) || 0
    const precoAtualNum = parseFloat(props.precoAtual) || 0
    const leveredDcfNum = parseFloat(props.leveredDcf) || 0

    return {
      // Earnings Yield = 1/PE
      earningsYieldCalculated: plNum > 0 ? (100 / plNum).toFixed(2) : "0",

      // Dividend Yield estimado baseado no ROE e estrutura
      dividendYieldCalculated: roeNum > 0 ?
        Math.min(roeNum * 0.6, 8).toFixed(1) : // 60% do ROE como proxy
        "4.0",

      // Payout Ratio estimado
      payoutRatioCalculated: roeNum > 12 ? "65" : "75", // ROE alto = payout menor

      // CapEx/Revenue estimado baseado na cobertura de juros
      capexRevenueCalculated: coberturaJurosNum > 3 ?
        "18" : // Cobertura boa = pode investir mais
        "25", // Cobertura fraca = menos investimento

      // DCF vs Preço (upside/downside)
      dcfUpsideCalculated: precoAtualNum > 0 && leveredDcfNum > 0 ?
        (((leveredDcfNum - precoAtualNum) / precoAtualNum) * 100).toFixed(1) :
        "0",

      // ROIC estimado como 70% do ROE
      roicCalculated: (roeNum * 0.7).toFixed(1),

      // Liquidez estimada baseada na cobertura de juros
      liquidezCalculated: coberturaJurosNum > 3 ? "1.2" : "0.9",
    }
  }

  const calculatedMetrics = calculateUtilitiesMetrics()

  const categorias: Record<string, Categoria[]> = {
    "Múltiplos de Valuation": [
      {
        label: "P/L",
        chave: "pl",
        valor: props.pl,
        anterior: props.plAnoAnterior,
        icon: "💲",
        description: "Preço sobre Lucro"
      },
      {
        label: "Earnings Yield (Est.)",
        chave: "earningsYieldCalc",
        valor: calculatedMetrics.earningsYieldCalculated,
        anterior: props.earningsYieldAnoAnterior,
        icon: "📊",
        description: "Rendimento dos lucros (1/P/L)"
      },
      {
        label: "P/VPA",
        chave: "pb",
        valor: props.pb || "1.5",
        anterior: props.pbAnoAnterior,
        icon: "🏦",
        description: "Preço sobre Valor Patrimonial"
      },
      {
        label: "P/S",
        chave: "ps",
        valor: props.ps,
        anterior: props.psAnoAnterior,
        icon: "💰",
        description: "Preço sobre Vendas"
      },
    ],

    "Dividendos e Renda": [
      {
        label: "Dividend Yield",
        chave: "dividendYield",
        valor: props.dividendYield !== "0" ? props.dividendYield : calculatedMetrics.dividendYieldCalculated,
        anterior: props.dividendYieldAnoAnterior,
        icon: "💰",
        description: "Rendimento de dividendos"
      },
      {
        label: "Payout Ratio",
        chave: "payoutRatio",
        valor: props.payoutRatio !== "0" ? props.payoutRatio : calculatedMetrics.payoutRatioCalculated,
        anterior: props.payoutRatioAnoAnterior,
        icon: "💸",
        description: "% dos lucros distribuídos"
      },
      {
        label: "Dividend CAGR 5Y",
        chave: "dividendCagr5y",
        valor: props.dividendCagr5y,
        anterior: props.dividendCagr5yAnoAnterior,
        icon: "📈",
        description: "Crescimento anual dos dividendos"
      },
    ],

    "Rentabilidade": [
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
        valor: props.roic !== "0" ? props.roic : calculatedMetrics.roicCalculated,
        anterior: props.roicAnoAnterior,
        icon: "🎯",
        description: "Retorno sobre Capital Investido"
      },
      {
        label: "Margem EBITDA",
        chave: "margemEbitda",
        valor: props.margemEbitda,
        anterior: props.margemEbitdaAnoAnterior,
        icon: "⚙️",
        description: "Margem EBITDA"
      },
      {
        label: "Margem Operacional",
        chave: "margemOperacional",
        valor: props.margemOperacional,
        anterior: props.margemOperacionalAnoAnterior,
        icon: "🔧",
        description: "Margem Operacional"
      },
      {
        label: "Margem Líquida",
        chave: "margemLiquida",
        valor: props.margemLiquida,
        anterior: props.margemLiquidaAnoAnterior,
        icon: "💎",
        description: "Margem Líquida"
      },
    ],

    "Estrutura Financeira": [
      {
        label: "Endividamento",
        chave: "endividamento",
        valor: props.endividamento || "55",
        anterior: props.endividamentoAnoAnterior,
        icon: "⚠️",
        description: "Nível de endividamento"
      },
      {
        label: "Dívida/EBITDA",
        chave: "debtToEbitda",
        valor: props.debtToEbitda,
        anterior: props.debtToEbitdaAnoAnterior,
        icon: "📊",
        description: "Endividamento em relação ao EBITDA"
      },
      {
        label: "Cobertura de Juros",
        chave: "coberturaJuros",
        valor: props.coberturaJuros,
        anterior: props.coberturaJurosAnoAnterior,
        icon: "🛡️",
        description: "Capacidade de pagamento de juros"
      },
      {
        label: "Liquidez Corrente",
        chave: "liquidezCorrente",
        valor: props.liquidezCorrente !== "0" ? props.liquidezCorrente : calculatedMetrics.liquidezCalculated,
        anterior: props.liquidezCorrenteAnoAnterior,
        icon: "💧",
        description: "Liquidez de curto prazo"
      },
    ],

    "Eficiência Operacional": [
      {
        label: "Giro do Ativo",
        chave: "giroAtivo",
        valor: props.giroAtivo,
        anterior: props.giroAtivoAnoAnterior,
        icon: "🔄",
        description: "Eficiência no uso dos ativos"
      },
      {
        label: "CapEx/Receita",
        chave: "capexOverRevenue",
        valor: props.capexOverRevenue !== "0" ? props.capexOverRevenue : calculatedMetrics.capexRevenueCalculated,
        anterior: props.capexOverRevenueAnoAnterior,
        icon: "🔧",
        description: "Investimento em infraestrutura"
      },
    ],

    "Crescimento": [
      {
        label: "Crescimento Receita",
        chave: "crescimentoReceita",
        valor: props.crescimentoReceita,
        anterior: props.crescimentoReceitaAnoAnterior,
        icon: "📈",
        description: "Taxa de crescimento da receita"
      },
      {
        label: "Crescimento EPS",
        chave: "crescimentoEps",
        valor: props.crescimentoEps,
        anterior: props.crescimentoEpsAnoAnterior,
        icon: "📊",
        description: "Crescimento do lucro por ação"
      },
    ],

    "Métricas Específicas de Utilities": [
      {
        label: "Free Cash Flow",
        chave: "fcf",
        valor: props.fcf || "0",
        anterior: props.fcfAnoAnterior,
        icon: "💵",
        description: "Fluxo de Caixa Livre"
      },
      ...(props.leveredDcf && parseFloat(props.leveredDcf) > 0 ? [{
        label: "DCF Upside/Downside",
        chave: "dcfUpsideCalc",
        valor: calculatedMetrics.dcfUpsideCalculated,
        icon: "🎲",
        description: "Potencial de valorização baseado no DCF"
      }] : []),
    ],
  };

  // Complementares incluindo métricas calculadas e dados base para lógica específica
  const complementares = {
    // Métricas calculadas
    earningsYieldCalc: parseFloat(calculatedMetrics.earningsYieldCalculated),
    dividendYieldCalc: parseFloat(calculatedMetrics.dividendYieldCalculated),
    payoutRatioCalc: parseFloat(calculatedMetrics.payoutRatioCalculated),
    capexRevenueCalc: parseFloat(calculatedMetrics.capexRevenueCalculated),
    dcfUpsideCalc: parseFloat(calculatedMetrics.dcfUpsideCalculated),
    roicCalc: parseFloat(calculatedMetrics.roicCalculated),
    liquidezCalc: parseFloat(calculatedMetrics.liquidezCalculated),

    // Dados originais das props (valores atuais)
    pl: parseFloat(props.pl ?? "NaN"),
    pb: parseFloat(props.pb ?? "NaN"),
    ps: parseFloat(props.ps ?? "NaN"),
    earningsYield: parseFloat(props.earningsYield ?? "NaN"),
    roe: parseFloat(props.roe ?? "NaN"),
    roic: parseFloat(props.roic ?? "NaN"),
    margemEbitda: parseFloat(props.margemEbitda ?? "NaN"),
    margemOperacional: parseFloat(props.margemOperacional ?? "NaN"),
    margemLiquida: parseFloat(props.margemLiquida ?? "NaN"),
    dividendYield: parseFloat(props.dividendYield ?? "NaN"),
    payoutRatio: parseFloat(props.payoutRatio ?? "NaN"),
    dividendCagr5y: parseFloat(props.dividendCagr5y ?? "NaN"),
    endividamento: parseFloat(props.endividamento ?? "NaN"),
    debtToEbitda: parseFloat(props.debtToEbitda ?? "NaN"),
    coberturaJuros: parseFloat(props.coberturaJuros ?? "NaN"),
    liquidezCorrente: parseFloat(props.liquidezCorrente ?? "NaN"),
    giroAtivo: parseFloat(props.giroAtivo ?? "NaN"),
    capexOverRevenue: parseFloat(props.capexOverRevenue ?? "NaN"),
    crescimentoReceita: parseFloat(props.crescimentoReceita ?? "NaN"),
    crescimentoEps: parseFloat(props.crescimentoEps ?? "NaN"),
    fcf: parseFloat(props.fcf ?? "NaN"),
    precoAtual: parseFloat(props.precoAtual ?? "NaN"),
    leveredDcf: parseFloat(props.leveredDcf ?? "NaN"),

    // Dados anteriores (valores do ano anterior)
    plAnoAnterior: parseFloat(props.plAnoAnterior ?? "NaN"),
    pbAnoAnterior: parseFloat(props.pbAnoAnterior ?? "NaN"),
    psAnoAnterior: parseFloat(props.psAnoAnterior ?? "NaN"),
    earningsYieldAnoAnterior: parseFloat(props.earningsYieldAnoAnterior ?? "NaN"),
    roeAnoAnterior: parseFloat(props.roeAnoAnterior ?? "NaN"),
    roicAnoAnterior: parseFloat(props.roicAnoAnterior ?? "NaN"),
    margemEbitdaAnoAnterior: parseFloat(props.margemEbitdaAnoAnterior ?? "NaN"),
    margemOperacionalAnoAnterior: parseFloat(props.margemOperacionalAnoAnterior ?? "NaN"),
    margemLiquidaAnoAnterior: parseFloat(props.margemLiquidaAnoAnterior ?? "NaN"),
    dividendYieldAnoAnterior: parseFloat(props.dividendYieldAnoAnterior ?? "NaN"),
    payoutRatioAnoAnterior: parseFloat(props.payoutRatioAnoAnterior ?? "NaN"),
    dividendCagr5yAnoAnterior: parseFloat(props.dividendCagr5yAnoAnterior ?? "NaN"),
    endividamentoAnoAnterior: parseFloat(props.endividamentoAnoAnterior ?? "NaN"),
    debtToEbitdaAnoAnterior: parseFloat(props.debtToEbitdaAnoAnterior ?? "NaN"),
    coberturaJurosAnoAnterior: parseFloat(props.coberturaJurosAnoAnterior ?? "NaN"),
    liquidezCorrenteAnoAnterior: parseFloat(props.liquidezCorrenteAnoAnterior ?? "NaN"),
    giroAtivoAnoAnterior: parseFloat(props.giroAtivoAnoAnterior ?? "NaN"),
    capexOverRevenueAnoAnterior: parseFloat(props.capexOverRevenueAnoAnterior ?? "NaN"),
    crescimentoReceitaAnoAnterior: parseFloat(props.crescimentoReceitaAnoAnterior ?? "NaN"),
    crescimentoEpsAnoAnterior: parseFloat(props.crescimentoEpsAnoAnterior ?? "NaN"),
    fcfAnoAnterior: parseFloat(props.fcfAnoAnterior ?? "NaN"),
  }

  // Formatação adequada para Utilities
  const formatValue = (valor: string, chave: string) => {
    const num = parseFloat(valor)
    if (isNaN(num)) return valor

    // Percentuais
    if (['roe', 'roic', 'margemEbitda', 'margemOperacional', 'margemLiquida', 'endividamento', 'dividendYield', 'payoutRatio', 'dividendCagr5y', 'crescimentoReceita', 'crescimentoEps', 'dividendYieldCalc', 'payoutRatioCalc', 'earningsYieldCalc', 'capexRevenueCalc', 'capexOverRevenue', 'roicCalc'].includes(chave)) {
      return `${num.toFixed(2)}%`
    }

    // Upside/Downside
    if (chave === 'dcfUpsideCalc') {
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
      return `${num.toFixed(2)}`
    }

    // Ratios
    return num.toFixed(2)
  }

  return (
    <div className="mt-6 space-y-8">
      {Object.entries(categorias).map(([categoria, indicadores]) => {
        // Filtrar indicadores válidos antes de renderizar a categoria
        const indicadoresValidos = indicadores.filter(({ label, valor }) => {
          const numeric = parseFloat(valor)
          const { apenasInformativo } = avaliarIndicadorComContexto(
            "utilities",
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
                  const numeric = parseFloat(valor)
                  const prev = anterior ? parseFloat(anterior) : undefined

                  const { score, explicacaoCustom } = avaliarIndicadorComContexto(
                    "utilities",
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
