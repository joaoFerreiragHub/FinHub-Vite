import { avaliarIndicadorComContexto } from "../hooks/avaliarIndicadorComContexto"
import { IndicatorValuePro } from "../quickAnalysis/IndicatorValuePro"

interface RatingsHealthcareProps {
  investimentoPD: string
  margemBruta: string
  margemEbitda: string
  margemLiquida: string
  roic: string
  roicAnoAnterior?: string
  roe: string
  pl: string
  ps: string
  debtToEbitda: string
  liquidezCorrente: string
  cagrEps: string
  eps: string
  beta: string
  fcf?: string

  // Camada 2
  peg?: string
  crescimentoReceita?: string
  debtEquity?: string
  cagrEpsAnoAnterior?: string
  margemLiquidaAnoAnterior?: string
  debtToEbitdaAnoAnterior?: string
  rAnddEfficiency?: string
  cashFlowOverCapex?: string
  receitasRecorrentesPercent?: string
  sgaOverRevenue?: string
  margemOperacional?: string
  payoutRatio?: string
}

export function RatingsHealthcare(props: RatingsHealthcareProps) {
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
    "Eficiência Operacional": [
      {
        label: "P&D / Receita",
        chave: "investimentoPD",
        valor: props.investimentoPD,
        icon: "🔬",
        description: "Investimento em Pesquisa e Desenvolvimento"
      },
      {
        label: "Margem EBITDA",
        chave: "margemEbitda",
        valor: props.margemEbitda,
        icon: "📊"
      },
      {
        label: "Margem Bruta",
        chave: "margemBruta",
        valor: props.margemBruta,
        icon: "💰"
      },
      {
        label: "SG&A / Receita",
        chave: "sgaOverRevenue",
        valor: props.sgaOverRevenue ?? "0",
        icon: "🏢",
        description: "Vendas, Gerais e Administrativas"
      },
      {
        label: "Cash Flow / CapEx",
        chave: "cashFlowOverCapex",
        valor: props.cashFlowOverCapex ?? "0",
        icon: "🔄"
      },
    ],
    "Rentabilidade": [
      {
        label: "ROIC",
        chave: "roic",
        valor: props.roic,
        anterior: props.roicAnoAnterior,
        icon: "🎯",
        description: "Retorno sobre Capital Investido"
      },
      {
        label: "ROE",
        chave: "roe",
        valor: props.roe,
        icon: "📈",
        description: "Retorno sobre Patrimônio Líquido"
      },
      {
        label: "Margem Líquida",
        chave: "margemLiquida",
        valor: props.margemLiquida,
        anterior: props.margemLiquidaAnoAnterior,
        icon: "💎"
      },
      {
        label: "Margem Operacional",
        chave: "margemOperacional",
        valor: props.margemOperacional ?? "0",
        icon: "⚙️"
      },
      {
        label: "Payout Ratio",
        chave: "payoutRatio",
        valor: props.payoutRatio ?? "0",
        icon: "💸",
        description: "Percentual de lucros distribuídos"
      },
    ],
    "Crescimento": [
      {
        label: "CAGR EPS",
        chave: "cagrEps",
        valor: props.cagrEps,
        anterior: props.cagrEpsAnoAnterior,
        icon: "📊",
        description: "Taxa de Crescimento Anual Composta"
      },
      {
        label: "Crescimento Receita",
        chave: "crescimentoReceita",
        valor: props.crescimentoReceita ?? "0",
        icon: "📈"
      },
      {
        label: "EPS",
        chave: "eps",
        valor: props.eps,
        icon: "🏆",
        description: "Lucro por Ação"
      },
      {
        label: "Eficiência de P&D",
        chave: "rAnddEfficiency",
        valor: props.rAnddEfficiency ?? "0",
        icon: "🧪"
      },
    ],
    "Valuation": [
      {
        label: "P/L",
        chave: "pl",
        valor: props.pl,
        icon: "💲",
        description: "Preço sobre Lucro"
      },
      {
        label: "P/S",
        chave: "ps",
        valor: props.ps,
        icon: "💰",
        description: "Preço sobre Vendas"
      },
      {
        label: "PEG Ratio",
        chave: "peg",
        valor: props.peg ?? "0",
        icon: "⚖️",
        description: "P/L ajustado pelo crescimento"
      },
    ],
    "Estabilidade e Risco": [
      {
        label: "Beta",
        chave: "beta",
        valor: props.beta,
        icon: "📉",
        description: "Volatilidade em relação ao mercado"
      },
      {
        label: "Liquidez Corrente",
        chave: "liquidezCorrente",
        valor: props.liquidezCorrente,
        icon: "💧"
      },
      {
        label: "Dívida/EBITDA",
        chave: "debtToEbitda",
        valor: props.debtToEbitda,
        anterior: props.debtToEbitdaAnoAnterior,
        icon: "⚠️"
      },
      {
        label: "Debt/Equity",
        chave: "debtEquity",
        valor: props.debtEquity ?? "0",
        icon: "⚖️",
        description: "Dívida sobre Patrimônio"
      },
    ],
    "Fluxo de Caixa": [
      {
        label: "Free Cash Flow",
        chave: "fcf",
        valor: props.fcf ?? "0",
        icon: "💵",
        description: "Fluxo de Caixa Livre"
      },
    ],
  }

  const complementares = {
    peg: parseFloat(props.peg ?? "NaN"),
    crescimentoReceita: parseFloat(props.crescimentoReceita ?? "NaN"),
    debtEquity: parseFloat(props.debtEquity ?? "NaN"),
    freeCashFlow: parseFloat(props.fcf ?? "NaN"),
    rAnddEfficiency: parseFloat(props.rAnddEfficiency ?? "NaN"),
    cashFlowOverCapex: parseFloat(props.cashFlowOverCapex ?? "NaN"),
    receitasRecorrentesPercent: parseFloat(props.receitasRecorrentesPercent ?? "NaN"),
    sgaOverRevenue: parseFloat(props.sgaOverRevenue ?? "NaN"),
    margemOperacional: parseFloat(props.margemOperacional ?? "NaN"),
    payoutRatio: parseFloat(props.payoutRatio ?? "NaN"),
  }

  // Função para formatar valores
  const formatValue = (valor: string, chave: string) => {
    const num = parseFloat(valor)
    if (isNaN(num)) return valor

    // Valores em percentual
    if (['margemBruta', 'margemEbitda', 'margemLiquida', 'margemOperacional', 'roic', 'roe', 'cagrEps', 'crescimentoReceita', 'investimentoPD', 'sgaOverRevenue', 'receitasRecorrentesPercent'].includes(chave)) {
      return `${num.toFixed(2)}%`
    }

    // Valores monetários grandes (FCF)
    if (chave === 'fcf' && Math.abs(num) > 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
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
            "Healthcare",
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
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
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
                {indicadoresValidos.map(({ label, valor, anterior, icon, description }) => {
                  const numeric = parseFloat(valor)
                  const prev = anterior ? parseFloat(anterior) : undefined

                  const { score, explicacaoCustom } = avaliarIndicadorComContexto(
                    "Healthcare",
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
                          {formatValue(valor, label.toLowerCase().replace(/[^a-z]/g, ''))}
                        </span>

                        {anterior && (
                          <div className="flex items-center gap-1 text-xs">
                            <span className="text-gray-500">vs.</span>
                            <span className="text-gray-600">{formatValue(anterior, label.toLowerCase().replace(/[^a-z]/g, ''))}</span>
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
