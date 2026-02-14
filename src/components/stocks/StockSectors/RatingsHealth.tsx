// ✅ COMPONENTE RATINGSHEALTHCARE OTIMIZADO
import { buildHealthcareComplementares, RatingsHealthcareProps } from '@/features/tools/stocks/utils/complementares/healthcareComplementares'
import { avaliarIndicadorComContexto } from "../hooks/avaliarIndicadorComContexto"
import { IndicatorValuePro } from "../quickAnalysis/IndicatorValuePro"

export function RatingsHealthcare(props: RatingsHealthcareProps) {
  // ✅ NOVO: Constrói complementares específicos para Healthcare
  const complementares = buildHealthcareComplementares(props)

  console.log('🩺 Healthcare Complementares:', complementares)

  const categorias: Record<string, {
    label: string
    chave: string
    valor: string
    anterior?: string
    icon?: string
    description?: string
  }[]> = {

    "Core Farmacêutico": [
      {
        label: "P&D / Receita",
        chave: "investimentoPD",
        valor: props.investimentoPD,
        anterior: props.investimentoPDAnoAnterior,
        icon: "🔬",
        description: "Investimento em pesquisa e desenvolvimento"
      },
      {
        label: "Eficiência de P&D",
        chave: "rAnddEfficiency",
        valor: props.rAnddEfficiency,
        anterior: props.rAnddEfficiencyAnoAnterior,
        icon: "🧪",
        description: "ROI dos investimentos em inovação"
      },
      {
        label: "Free Cash Flow",
        chave: "fcf",
        valor: props.fcf,
        anterior: props.fcfAnoAnterior,
        icon: "💵",
        description: "Fluxo de caixa livre para investimentos"
      },
      {
        label: "Cash Flow / CapEx",
        chave: "cashFlowOverCapex",
        valor: props.cashFlowOverCapex,
        anterior: props.cashFlowOverCapexAnoAnterior,
        icon: "🔄",
        description: "Eficiência do capital investido"
      },
    ],

    "Crescimento e Performance": [
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
        description: "Crescimento anual composto do EPS"
      },
      {
        label: "EPS",
        chave: "eps",
        valor: props.eps,
        anterior: props.epsAnoAnterior,
        icon: "🏆",
        description: "Lucro por ação"
      },
    ],

    "Rentabilidade": [
      {
        label: "ROIC",
        chave: "roic",
        valor: props.roic,
        anterior: props.roicAnoAnterior,
        icon: "🎯",
        description: "Retorno sobre capital investido"
      },
      {
        label: "ROE",
        chave: "roe",
        valor: props.roe,
        anterior: props.roeAnoAnterior,
        icon: "📈",
        description: "Retorno sobre patrimônio líquido"
      },
      {
        label: "Margem Bruta",
        chave: "margemBruta",
        valor: props.margemBruta,
        anterior: props.margemBrutaAnoAnterior,
        icon: "💰",
        description: "Margem bruta (pricing power)"
      },
      {
        label: "Margem EBITDA",
        chave: "margemEbitda",
        valor: props.margemEbitda,
        anterior: props.margemEbitdaAnoAnterior,
        icon: "📊",
        description: "Margem EBITDA operacional"
      },
      {
        label: "Margem Líquida",
        chave: "margemLiquida",
        valor: props.margemLiquida,
        anterior: props.margemLiquidaAnoAnterior,
        icon: "💎",
        description: "Margem líquida final"
      },
      {
        label: "Margem Operacional",
        chave: "margemOperacional",
        valor: props.margemOperacional,
        anterior: props.margemOperacionalAnoAnterior,
        icon: "⚙️",
        description: "Eficiência operacional"
      },
    ],

    "Múltiplos de Avaliação": [
      {
        label: "P/L",
        chave: "pl",
        valor: props.pl,
        anterior: props.plAnoAnterior,
        icon: "💲",
        description: "Preço sobre lucro"
      },
      {
        label: "P/S",
        chave: "ps",
        valor: props.ps,
        anterior: props.psAnoAnterior,
        icon: "💰",
        description: "Preço sobre vendas"
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

    "Estrutura Financeira": [
      {
        label: "Dívida/EBITDA",
        chave: "debtToEbitda",
        valor: props.debtToEbitda,
        anterior: props.debtToEbitdaAnoAnterior,
        icon: "⚠️",
        description: "Endividamento vs geração operacional"
      },
      {
        label: "Liquidez Corrente",
        chave: "liquidezCorrente",
        valor: props.liquidezCorrente,
        anterior: props.liquidezCorrenteAnoAnterior,
        icon: "💧",
        description: "Capacidade de pagamento curto prazo"
      },
      {
        label: "Dívida / Patrimônio",
        chave: "debtEquity",
        valor: props.debtEquity,
        anterior: props.debtEquityAnoAnterior,
        icon: "⚖️",
        description: "Alavancagem financeira"
      },
    ],

    "Eficiência Operacional": [
      {
        label: "SG&A / Receita",
        chave: "sgaOverRevenue",
        valor: props.sgaOverRevenue,
        anterior: props.sgaOverRevenueAnoAnterior,
        icon: "🏢",
        description: "Eficiência em vendas e administração"
      },
      {
        label: "Payout Ratio",
        chave: "payoutRatio",
        valor: props.payoutRatio,
        anterior: props.payoutRatioAnoAnterior,
        icon: "💸",
        description: "% dos lucros distribuídos aos acionistas"
      },
    ],

    "Risco e Volatilidade": [
      {
        label: "Beta",
        chave: "beta",
        valor: props.beta,
        anterior: props.betaAnoAnterior,
        icon: "📉",
        description: "Volatilidade vs. mercado"
      },
    ],
  }

  // Função para formatar valores
  const formatValue = (valor: string, chave: string) => {
    const cleanValue = valor.replace('%', '').replace('$', '').replace(',', '').trim()
    const num = parseFloat(cleanValue)

    if (isNaN(num)) return valor

    // Valores em percentual
    if (['margemBruta', 'margemEbitda', 'margemLiquida', 'margemOperacional', 'roic', 'roe',
         'cagrEps', 'crescimentoReceita', 'investimentoPD', 'sgaOverRevenue', 'payoutRatio',
         'rAnddEfficiency'].includes(chave)) {
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

          // ✅ NOVO: Usar complementares específicos de Healthcare
          const { apenasInformativo } = avaliarIndicadorComContexto(
            "Healthcare",
            label,
            numeric,
            {
              valorAnterior: undefined,
              complementares, // ✅ Agora só contém indicadores de Healthcare
            }
          )
          return !apenasInformativo
        })

        // Se não há indicadores válidos, não renderizar a categoria
        if (indicadoresValidos.length === 0) return null

        return (
          <div key={categoria} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
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

                  // ✅ NOVO: Usar complementares específicos de Healthcare
                  const { score, explicacaoCustom } = avaliarIndicadorComContexto(
                    "Healthcare",
                    label,
                    numeric,
                    {
                      valorAnterior: prev,
                      complementares, // ✅ Agora só contém indicadores de Healthcare
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
