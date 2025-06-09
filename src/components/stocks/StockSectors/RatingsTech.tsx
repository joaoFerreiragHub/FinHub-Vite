import { avaliarIndicadorComContexto } from "../hooks/avaliarIndicadorComContexto"
import { IndicatorValuePro } from "../quickAnalysis/IndicatorValuePro"

interface RatingsTechProps {
  // Crescimento e Performance
  crescimentoReceita: string
  crescimentoReceitaAnoAnterior?: string // NOVO
  cagrEps: string
  cagrEpsAnoAnterior?: string
  eps: string
  epsAnoAnterior?: string // NOVO

  // Margens e Rentabilidade
  margemBruta: string
  margemBrutaAnoAnterior?: string // NOVO
  margemEbitda: string
  margemEbitdaAnoAnterior?: string // NOVO
  margemLiquida: string
  margemLiquidaAnoAnterior?: string
  margemOperacional: string
  margemOperacionalAnoAnterior?: string // NOVO

  // Retorno sobre Capital
  roic: string
  roicAnoAnterior?: string // NOVO
  roe: string
  roeAnoAnterior?: string // NOVO

  // Múltiplos de Avaliação
  pl: string
  plAnoAnterior?: string // NOVO
  ps: string
  psAnoAnterior?: string // NOVO
  peg: string
  pegAnoAnterior?: string // NOVO

  // Estrutura de Capital e Liquidez
  debtToEbitda: string
  debtToEbitdaAnoAnterior?: string
  liquidezCorrente: string
  liquidezCorrenteAnoAnterior?: string // NOVO
  cashRatio: string
  cashRatioAnoAnterior?: string // NOVO

  // Risco e Volatilidade
  beta: string
  betaAnoAnterior?: string // NOVO

  // Métricas Específicas de Tech
  investimentoPD: string
  investimentoPDAnoAnterior?: string // NOVO
  rAnddEfficiency: string
  rAnddEfficiencyAnoAnterior?: string // NOVO
  cashFlowOverCapex: string
  cashFlowOverCapexAnoAnterior?: string // NOVO
  fcf: string
  fcfAnoAnterior?: string // NOVO
  sgaOverRevenue: string
  sgaOverRevenueAnoAnterior?: string // NOVO
  payoutRatio: string
  payoutRatioAnoAnterior?: string // NOVO

  debtEquity?: string
  debtEquityAnoAnterior?: string // NOVO
}

export function RatingsTech(props: RatingsTechProps) {
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
        label: "CAGR EPS",
        chave: "cagrEps",
        valor: props.cagrEps,
        anterior: props.cagrEpsAnoAnterior,
        icon: "📊",
        description: "Taxa de Crescimento Anual Composta do EPS"
      },
      {
        label: "EPS",
        chave: "eps",
        valor: props.eps,
        anterior: props.epsAnoAnterior,
        icon: "🏆",
        description: "Lucro por Ação"
      },
    ],
    "Rentabilidade": [
      {
        label: "Margem Bruta",
        chave: "margemBruta",
        valor: props.margemBruta,
        anterior: props.margemBrutaAnoAnterior,
        icon: "💰"
      },
      {
        label: "Margem EBITDA",
        chave: "margemEbitda",
        valor: props.margemEbitda,
        anterior: props.margemEbitdaAnoAnterior,
        icon: "📊"
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
        valor: props.margemOperacional,
        anterior: props.margemOperacionalAnoAnterior,
        icon: "⚙️"
      },
    ],
    "Retorno sobre Capital": [
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
        anterior: props.roeAnoAnterior,
        icon: "📈",
        description: "Retorno sobre Patrimônio Líquido"
      },
    ],
    "Múltiplos de Avaliação": [
      {
        label: "P/L",
        chave: "pl",
        valor: props.pl,
        anterior: props.plAnoAnterior,
        icon: "💲",
        description: "Preço sobre Lucro"
      },
      {
        label: "P/S",
        chave: "ps",
        valor: props.ps,
        anterior: props.psAnoAnterior,
        icon: "💰",
        description: "Preço sobre Vendas"
      },
      {
        label: "PEG",
        chave: "peg",
        valor: props.peg,
        anterior: props.pegAnoAnterior,
        icon: "⚖️",
        description: "P/L ajustado pelo crescimento"
      },
    ],
    "Estrutura de Capital e Liquidez": [
      {
        label: "Dívida/EBITDA",
        chave: "debtToEbitda",
        valor: props.debtToEbitda,
        anterior: props.debtToEbitdaAnoAnterior,
        icon: "⚠️",
        description: "Endividamento em relação ao EBITDA"
      },
      {
        label: "Liquidez Corrente",
        chave: "liquidezCorrente",
        valor: props.liquidezCorrente,
        anterior: props.liquidezCorrenteAnoAnterior, // ADICIONADO
        icon: "💧",
        description: "Capacidade de pagamento a curto prazo"
      },
      {
        label: "Cash Ratio",
        chave: "cashRatio",
        valor: props.cashRatio,
        anterior: props.cashRatioAnoAnterior, // ADICIONADO
        icon: "💵",
        description: "Ratio de liquidez imediata"
      },
      {
        label: "Dívida / Capitais Próprios",
        chave: "debtEquity",
        valor: props.debtEquity ?? "0",
        anterior: props.debtEquityAnoAnterior, // ADICIONADO
        icon: "⚖️",
        description: "Dívida sobre Patrimônio"
      },
    ],
    "Risco e Volatilidade": [
      {
        label: "Beta",
        chave: "beta",
        valor: props.beta,
        anterior: props.betaAnoAnterior, // ADICIONADO
        icon: "📉",
        description: "Volatilidade em relação ao mercado"
      },
    ],
    "Métricas Específicas de Tech": [
      {
        label: "P&D / Receita",
        chave: "investimentoPD",
        valor: props.investimentoPD,
        anterior: props.investimentoPDAnoAnterior,
        icon: "🔬",
        description: "Investimento em Pesquisa e Desenvolvimento"
      },
      {
        label: "Eficiência de P&D",
        chave: "rAnddEfficiency",
        valor: props.rAnddEfficiency,
        anterior: props.rAnddEfficiencyAnoAnterior,
        icon: "🧪",
        description: "Eficiência dos investimentos em P&D"
      },
      {
        label: "Cash Flow / CapEx",
        chave: "cashFlowOverCapex",
        valor: props.cashFlowOverCapex,
        anterior: props.cashFlowOverCapexAnoAnterior,
        icon: "🔄"
      },
      {
        label: "Free Cash Flow",
        chave: "fcf",
        valor: props.fcf,
        anterior: props.fcfAnoAnterior,
        icon: "💵",
        description: "Fluxo de Caixa Livre"
      },
      {
        label: "SG&A / Receita",
        chave: "sgaOverRevenue",
        valor: props.sgaOverRevenue,
        anterior: props.sgaOverRevenueAnoAnterior,
        icon: "🏢"
      },
      {
        label: "Payout Ratio",
        chave: "payoutRatio",
        valor: props.payoutRatio,
        anterior: props.payoutRatioAnoAnterior, // ADICIONADO
        icon: "💸",
        description: "Percentual de lucros distribuídos"
      },
    ],
  }

  const complementares = {
    peg: parseFloat(props.peg ?? "NaN"),
    pegAnoAnterior: parseFloat(props.pegAnoAnterior ?? "NaN"), // NOVO
    crescimentoReceita: parseFloat(props.crescimentoReceita ?? "NaN"),
    crescimentoReceitaAnoAnterior: parseFloat(props.crescimentoReceitaAnoAnterior ?? "NaN"), // NOVO
    debtEquity: parseFloat(props.debtEquity ?? "NaN"),
    debtEquityAnoAnterior: parseFloat(props.debtEquityAnoAnterior ?? "NaN"), // NOVO
    freeCashFlow: parseFloat(props.fcf ?? "NaN"),
    freeCashFlowAnoAnterior: parseFloat(props.fcfAnoAnterior ?? "NaN"), // NOVO
    rAnddEfficiency: parseFloat(props.rAnddEfficiency ?? "NaN"),
    rAnddEfficiencyAnoAnterior: parseFloat(props.rAnddEfficiencyAnoAnterior ?? "NaN"), // NOVO
    cashFlowOverCapex: parseFloat(props.cashFlowOverCapex ?? "NaN"),
    sgaOverRevenue: parseFloat(props.sgaOverRevenue ?? "NaN"),
    margemOperacional: parseFloat(props.margemOperacional ?? "NaN"),
    payoutRatio: parseFloat(props.payoutRatio ?? "NaN"),
    eps: parseFloat(props.eps ?? "NaN"),
    epsAnoAnterior: parseFloat(props.epsAnoAnterior ?? "NaN"), // NOVO
    cashRatio: parseFloat(props.cashRatio ?? "NaN"),
    investimentoPD: parseFloat(props.investimentoPD ?? "NaN"),
    beta: parseFloat(props.beta ?? "NaN"),
    roic: parseFloat(props.roic ?? "NaN"),
    roe: parseFloat(props.roe ?? "NaN"),
  }

  // Função para formatar valores
  const formatValue = (valor: string, chave: string) => {
    const num = parseFloat(valor)
    if (isNaN(num)) return valor

    // Valores em percentual - USAR AS MESMAS CHAVES DO HEALTHCARE
    if (['margemBruta', 'margemEbitda', 'margemLiquida', 'margemOperacional', 'roic', 'roe', 'cagrEps', 'crescimentoReceita', 'investimentoPD', 'sgaOverRevenue', 'payoutRatio', 'rAnddEfficiency'].includes(chave)) {
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
            "Technology",
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
                {indicadoresValidos.map(({ label, valor, anterior, icon, description, chave }) => {
                  const numeric = parseFloat(valor)
                  const prev = anterior ? parseFloat(anterior) : undefined

                  const { score, explicacaoCustom } = avaliarIndicadorComContexto(
                    "Technology",
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
                          {formatValue(valor, chave)} {/* CORRIGIDO: usar chave diretamente */}
                        </span>

                        {anterior && (
                          <div className="flex items-center gap-1 text-xs">
                            <span className="text-gray-500">vs.</span>
                            <span className="text-gray-600">{formatValue(anterior, chave)}</span> {/* CORRIGIDO: usar chave */}
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
