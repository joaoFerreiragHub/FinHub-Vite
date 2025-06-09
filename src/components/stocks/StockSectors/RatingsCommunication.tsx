import { avaliarIndicadorComContexto } from "../hooks/avaliarIndicadorComContexto"
import { IndicatorValuePro } from "../quickAnalysis/IndicatorValuePro"

interface RatingsCommunicationProps {
  // Rentabilidade e Retorno
  pe: string
  peAnoAnterior?: string
  ps: string
  psAnoAnterior?: string
  pb: string
  pbAnoAnterior?: string
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

  // Crescimento e Performance
  receitaCagr3y: string
  receitaCagr3yAnoAnterior?: string
  crescimentoReceita: string
  crescimentoReceitaAnoAnterior?: string
  crescimentoEbitda: string
  crescimentoEbitdaAnoAnterior?: string

  // Estrutura de Capital e Solvência
  dividaEbitda: string
  dividaEbitdaAnoAnterior?: string
  coberturaJuros: string
  coberturaJurosAnoAnterior?: string
  liquidezCorrente: string
  liquidezCorrenteAnoAnterior?: string
  debtEquity: string
  debtEquityAnoAnterior?: string

  // Fluxo de Caixa e Eficiência de Capital
  freeCashFlow: string
  freeCashFlowAnoAnterior?: string
  fcfYield: string
  fcfYieldAnoAnterior?: string
  capexRevenue: string
  capexRevenueAnoAnterior?: string

  // Dividendos e Retorno
  dividendYield: string
  dividendYieldAnoAnterior?: string
  payoutRatio: string
  payoutRatioAnoAnterior?: string

  // Volatilidade e Avaliação
  beta: string
  betaAnoAnterior?: string
  leveredDcf: string
  leveredDcfAnoAnterior?: string
  precoAtual: string
  precoAtualAnoAnterior?: string

  // Métricas Específicas de Communication Services
  userGrowth?: string
  userGrowthAnoAnterior?: string
  arpu?: string
  arpuAnoAnterior?: string
  churnRate?: string
  churnRateAnoAnterior?: string
  contentInvestment?: string
  contentInvestmentAnoAnterior?: string
}

interface Categoria {
  label: string
  chave: string
  valor: string
  anterior?: string
  icon?: string
  description?: string
}

export function RatingsCommunication(props: RatingsCommunicationProps) {
  // Calcular métricas específicas de communication services
  const calculateCommunicationMetrics = () => {
    const userGrowthNum = parseFloat(props.userGrowth || "0") || 0
    const churnRateNum = parseFloat(props.churnRate || "0") || 0
    const ebitdaMarginNum = parseFloat(props.ebitdaMargin || "0") || 0
    const receitaCagr3yNum = parseFloat(props.receitaCagr3y || "0") || 0
    const roicNum = parseFloat(props.roic || "0") || 0

    return {
      // Score de Crescimento
      scoreGrowth: userGrowthNum > 15 && receitaCagr3yNum > 12 ? "90" :
                   userGrowthNum > 8 && receitaCagr3yNum > 6 ? "75" : "50",

      // Score de Rentabilidade
      scoreProfitability: ebitdaMarginNum > 25 && roicNum > 15 ? "85" :
                         ebitdaMarginNum > 18 && roicNum > 10 ? "70" : "45",

      // Score de Qualidade
      scoreQuality: churnRateNum < 5 && ebitdaMarginNum > 20 ? "95" :
                   churnRateNum < 10 && ebitdaMarginNum > 15 ? "80" : "60",
    }
  }

  const calculatedMetrics = calculateCommunicationMetrics()

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
        label: "P/S",
        chave: "ps",
        valor: props.ps,
        anterior: props.psAnoAnterior,
        icon: "📊",
        description: "Preço sobre Vendas"
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

    "Crescimento e Performance": [
      {
        label: "Crescimento da Receita (3Y)",
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
        label: "Crescimento EBITDA",
        chave: "crescimentoEbitda",
        valor: props.crescimentoEbitda,
        anterior: props.crescimentoEbitdaAnoAnterior,
        icon: "📈",
        description: "Crescimento do EBITDA"
      },
    ],

    "Estrutura de Capital e Solvência": [
      {
        label: "Dívida/EBITDA",
        chave: "dividaEbitda",
        valor: props.dividaEbitda,
        anterior: props.dividaEbitdaAnoAnterior,
        icon: "⚖️",
        description: "Endividamento"
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

    "Fluxo de Caixa": [
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
        label: "CapEx/Receita",
        chave: "capexRevenue",
        valor: props.capexRevenue,
        anterior: props.capexRevenueAnoAnterior,
        icon: "🏗️",
        description: "Intensidade de Investimentos"
      },
    ],

    "Dividendos e Retorno": [
      {
        label: "Dividend Yield",
        chave: "dividendYield",
        valor: props.dividendYield,
        anterior: props.dividendYieldAnoAnterior,
        icon: "💎",
        description: "Rendimento de Dividendos"
      },
      {
        label: "Payout Ratio",
        chave: "payoutRatio",
        valor: props.payoutRatio,
        anterior: props.payoutRatioAnoAnterior,
        icon: "📤",
        description: "% dos lucros distribuídos"
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
      {
        label: "Preço Atual",
        chave: "precoAtual",
        valor: props.precoAtual,
        anterior: props.precoAtualAnoAnterior,
        icon: "💲",
        description: "Preço Atual da Ação"
      },
    ],

    "Métricas Específicas de Communication Services": [
      ...(props.userGrowth ? [{
        label: "Crescimento de Usuários",
        chave: "userGrowth",
        valor: props.userGrowth,
        anterior: props.userGrowthAnoAnterior,
        icon: "👥",
        description: "Taxa de Crescimento da Base de Usuários"
      }] : []),
      ...(props.arpu ? [{
        label: "ARPU",
        chave: "arpu",
        valor: props.arpu,
        anterior: props.arpuAnoAnterior,
        icon: "💰",
        description: "Receita Média por Usuário"
      }] : []),
      ...(props.churnRate ? [{
        label: "Churn Rate",
        chave: "churnRate",
        valor: props.churnRate,
        anterior: props.churnRateAnoAnterior,
        icon: "🔄",
        description: "Taxa de Cancelamento de Clientes"
      }] : []),
      ...(props.contentInvestment ? [{
        label: "Investimento em Conteúdo",
        chave: "contentInvestment",
        valor: props.contentInvestment,
        anterior: props.contentInvestmentAnoAnterior,
        icon: "🎬",
        description: "% da Receita Investida em Conteúdo"
      }] : []),
      {
        label: "Score de Crescimento",
        chave: "scoreGrowth",
        valor: calculatedMetrics.scoreGrowth,
        icon: "🚀",
        description: "Score de performance de crescimento"
      },
      {
        label: "Score de Rentabilidade",
        chave: "scoreProfitability",
        valor: calculatedMetrics.scoreProfitability,
        icon: "💎",
        description: "Score de rentabilidade e margens"
      },
      {
        label: "Score de Qualidade",
        chave: "scoreQuality",
        valor: calculatedMetrics.scoreQuality,
        icon: "⭐",
        description: "Score de qualidade operacional"
      },
    ],
  };

  // Complementares incluindo métricas calculadas e dados base
  const complementares = {
    // Métricas calculadas
    scoreGrowth: parseFloat(calculatedMetrics.scoreGrowth || "0"),
    scoreProfitability: parseFloat(calculatedMetrics.scoreProfitability || "0"),
    scoreQuality: parseFloat(calculatedMetrics.scoreQuality || "0"),

    // Dados originais (valores atuais)
    pe: parseFloat(props.pe ?? "NaN"),
    ps: parseFloat(props.ps ?? "NaN"),
    pb: parseFloat(props.pb ?? "NaN"),
    roe: parseFloat(props.roe ?? "NaN"),
    roic: parseFloat(props.roic ?? "NaN"),
    grossMargin: parseFloat(props.grossMargin ?? "NaN"),
    ebitdaMargin: parseFloat(props.ebitdaMargin ?? "NaN"),
    margemLiquida: parseFloat(props.margemLiquida ?? "NaN"),
    margemOperacional: parseFloat(props.margemOperacional ?? "NaN"),
    receitaCagr3y: parseFloat(props.receitaCagr3y ?? "NaN"),
    crescimentoReceita: parseFloat(props.crescimentoReceita ?? "NaN"),
    crescimentoEbitda: parseFloat(props.crescimentoEbitda ?? "NaN"),
    dividaEbitda: parseFloat(props.dividaEbitda ?? "NaN"),
    coberturaJuros: parseFloat(props.coberturaJuros ?? "NaN"),
    liquidezCorrente: parseFloat(props.liquidezCorrente ?? "NaN"),
    debtEquity: parseFloat(props.debtEquity ?? "NaN"),
    freeCashFlow: parseFloat(props.freeCashFlow ?? "NaN"),
    fcfYield: parseFloat(props.fcfYield ?? "NaN"),
    capexRevenue: parseFloat(props.capexRevenue ?? "NaN"),
    dividendYield: parseFloat(props.dividendYield ?? "NaN"),
    payoutRatio: parseFloat(props.payoutRatio ?? "NaN"),
    beta: parseFloat(props.beta ?? "NaN"),
    leveredDcf: parseFloat(props.leveredDcf ?? "NaN"),
    precoAtual: parseFloat(props.precoAtual ?? "NaN"),
    userGrowth: parseFloat(props.userGrowth ?? "NaN"),
    arpu: parseFloat(props.arpu ?? "NaN"),
    churnRate: parseFloat(props.churnRate ?? "NaN"),
    contentInvestment: parseFloat(props.contentInvestment ?? "NaN"),

    // Dados anteriores
    peAnoAnterior: parseFloat(props.peAnoAnterior ?? "NaN"),
    psAnoAnterior: parseFloat(props.psAnoAnterior ?? "NaN"),
    pbAnoAnterior: parseFloat(props.pbAnoAnterior ?? "NaN"),
    roeAnoAnterior: parseFloat(props.roeAnoAnterior ?? "NaN"),
    roicAnoAnterior: parseFloat(props.roicAnoAnterior ?? "NaN"),
    grossMarginAnoAnterior: parseFloat(props.grossMarginAnoAnterior ?? "NaN"),
    ebitdaMarginAnoAnterior: parseFloat(props.ebitdaMarginAnoAnterior ?? "NaN"),
    margemLiquidaAnoAnterior: parseFloat(props.margemLiquidaAnoAnterior ?? "NaN"),
    margemOperacionalAnoAnterior: parseFloat(props.margemOperacionalAnoAnterior ?? "NaN"),
    receitaCagr3yAnoAnterior: parseFloat(props.receitaCagr3yAnoAnterior ?? "NaN"),
    crescimentoReceitaAnoAnterior: parseFloat(props.crescimentoReceitaAnoAnterior ?? "NaN"),
    crescimentoEbitdaAnoAnterior: parseFloat(props.crescimentoEbitdaAnoAnterior ?? "NaN"),
    dividaEbitdaAnoAnterior: parseFloat(props.dividaEbitdaAnoAnterior ?? "NaN"),
    coberturaJurosAnoAnterior: parseFloat(props.coberturaJurosAnoAnterior ?? "NaN"),
    liquidezCorrenteAnoAnterior: parseFloat(props.liquidezCorrenteAnoAnterior ?? "NaN"),
    debtEquityAnoAnterior: parseFloat(props.debtEquityAnoAnterior ?? "NaN"),
    freeCashFlowAnoAnterior: parseFloat(props.freeCashFlowAnoAnterior ?? "NaN"),
    fcfYieldAnoAnterior: parseFloat(props.fcfYieldAnoAnterior ?? "NaN"),
    capexRevenueAnoAnterior: parseFloat(props.capexRevenueAnoAnterior ?? "NaN"),
    dividendYieldAnoAnterior: parseFloat(props.dividendYieldAnoAnterior ?? "NaN"),
    payoutRatioAnoAnterior: parseFloat(props.payoutRatioAnoAnterior ?? "NaN"),
    betaAnoAnterior: parseFloat(props.betaAnoAnterior ?? "NaN"),
    leveredDcfAnoAnterior: parseFloat(props.leveredDcfAnoAnterior ?? "NaN"),
    precoAtualAnoAnterior: parseFloat(props.precoAtualAnoAnterior ?? "NaN"),
    userGrowthAnoAnterior: parseFloat(props.userGrowthAnoAnterior ?? "NaN"),
    arpuAnoAnterior: parseFloat(props.arpuAnoAnterior ?? "NaN"),
    churnRateAnoAnterior: parseFloat(props.churnRateAnoAnterior ?? "NaN"),
    contentInvestmentAnoAnterior: parseFloat(props.contentInvestmentAnoAnterior ?? "NaN"),
  }

  // Formatação adequada para communication services
  const formatValue = (valor: string, chave: string) => {
    const num = parseFloat(valor)
    if (isNaN(num)) return valor

    // Percentuais
    if (['roe', 'roic', 'grossMargin', 'ebitdaMargin', 'margemLiquida', 'margemOperacional', 'receitaCagr3y', 'crescimentoReceita', 'crescimentoEbitda', 'dividendYield', 'payoutRatio', 'fcfYield', 'capexRevenue', 'userGrowth', 'churnRate', 'contentInvestment', 'scoreGrowth', 'scoreProfitability', 'scoreQuality'].includes(chave)) {
      return `${num.toFixed(2)}%`
    }

    // Valores monetários (DCF, FCF, ARPU, Preço)
    if (['leveredDcf', 'precoAtual', 'freeCashFlow', 'arpu'].includes(chave)) {
      if (chave === 'freeCashFlow' && Math.abs(num) > 1000000) {
        return `${(num / 1000000).toFixed(1)}M`
      }
      return `${num.toFixed(2)}`
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
            "Communication Services",
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
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
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
                    "Communication Services",
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
