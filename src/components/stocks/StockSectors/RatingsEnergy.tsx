import { avaliarIndicadorComContexto } from "../hooks/avaliarIndicadorComContexto"
import { IndicatorValuePro } from "../quickAnalysis/IndicatorValuePro"

interface RatingsEnergyProps {
  // Rentabilidade e Retorno
  pe: string
  peAnoAnterior?: string
  pb: string
  pbAnoAnterior?: string
  roe: string
  roeAnoAnterior?: string
  roic: string
  roicAnoAnterior?: string

  // Margens e Eficiência
  margemEbitda: string
  margemEbitdaAnoAnterior?: string
  margemBruta: string
  margemBrutaAnoAnterior?: string
  margemLiquida: string
  margemLiquidaAnoAnterior?: string

  // Estrutura de Capital e Solvência
  dividaEbitda: string
  dividaEbitdaAnoAnterior?: string
  coberturaJuros: string
  coberturaJurosAnoAnterior?: string
  liquidezCorrente: string
  liquidezCorrenteAnoAnterior?: string
  debtEquity: string
  debtEquityAnoAnterior?: string

  // Fluxo de Caixa e Investimentos
  freeCashFlow: string
  freeCashFlowAnoAnterior?: string
  capexRevenue: string
  capexRevenueAnoAnterior?: string
  fcfYield: string
  fcfYieldAnoAnterior?: string

  // Dividendos e Retorno ao Acionista
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

  // Métricas Específicas de Energia
  reservasProvadas?: string
  reservasProvadasAnoAnterior?: string
  custoProducao?: string
  custoProducaoAnoAnterior?: string
  breakEvenPrice?: string
  breakEvenPriceAnoAnterior?: string
}

interface Categoria {
  label: string
  chave: string
  valor: string
  anterior?: string
  icon?: string
  description?: string
}

export function RatingsEnergy(props: RatingsEnergyProps) {
  // Calcular métricas específicas de energia
  const calculateEnergyMetrics = () => {
    const roicNum = parseFloat(props.roic) || 0
    const margemEbitdaNum = parseFloat(props.margemEbitda) || 0
    const dividaEbitdaNum = parseFloat(props.dividaEbitda) || 0
    const freeCashFlowNum = parseFloat(props.freeCashFlow) || 0
    const coberturaJurosNum = parseFloat(props.coberturaJuros) || 0

    return {
      // Score de Eficiência Operacional
      eficienciaOperacional: margemEbitdaNum > 30 && roicNum > 12 ? "90" :
                            margemEbitdaNum > 20 && roicNum > 8 ? "75" : "50",

      // Score de Solidez Financeira
      solidezFinanceira: dividaEbitdaNum < 2 && coberturaJurosNum > 5 ? "95" :
                        dividaEbitdaNum < 3 && coberturaJurosNum > 3 ? "80" : "60",

      // Score de Geração de Caixa
      geracaoCaixa: freeCashFlowNum > 0 && margemEbitdaNum > 25 ? "85" :
                   freeCashFlowNum > 0 ? "70" : "45",
    }
  }

  const calculatedMetrics = calculateEnergyMetrics()

  const categorias: Record<string, Categoria[]> = {
    "Rentabilidade e Retorno": [
      {
        label: "P/E",
        chave: "pe",
        valor: props.pe,
        anterior: props.peAnoAnterior,
        icon: "💲",
        description: "Preço sobre Lucro"
      },
      {
        label: "P/B",
        chave: "pb",
        valor: props.pb,
        anterior: props.pbAnoAnterior,
        icon: "📚",
        description: "Preço sobre Valor Contábil"
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
        label: "Margem EBITDA",
        chave: "margemEbitda",
        valor: props.margemEbitda,
        anterior: props.margemEbitdaAnoAnterior,
        icon: "📊",
        description: "Margem EBITDA"
      },
      {
        label: "Margem Bruta",
        chave: "margemBruta",
        valor: props.margemBruta,
        anterior: props.margemBrutaAnoAnterior,
        icon: "💰",
        description: "Margem Bruta"
      },
      {
        label: "Margem Líquida",
        chave: "margemLiquida",
        valor: props.margemLiquida,
        anterior: props.margemLiquidaAnoAnterior,
        icon: "🎯",
        description: "Margem Líquida"
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

    "Fluxo de Caixa e Investimentos": [
      {
        label: "Free Cash Flow",
        chave: "freeCashFlow",
        valor: props.freeCashFlow,
        anterior: props.freeCashFlowAnoAnterior,
        icon: "💸",
        description: "Fluxo de Caixa Livre"
      },
      {
        label: "CapEx/Receita",
        chave: "capexRevenue",
        valor: props.capexRevenue,
        anterior: props.capexRevenueAnoAnterior,
        icon: "🏗️",
        description: "Intensidade de Investimentos"
      },
      {
        label: "FCF Yield",
        chave: "fcfYield",
        valor: props.fcfYield,
        anterior: props.fcfYieldAnoAnterior,
        icon: "💰",
        description: "Rendimento do Fluxo de Caixa"
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
    ],

    "Métricas Específicas de Energia": [
      ...(props.reservasProvadas ? [{
        label: "Reservas Provadas",
        chave: "reservasProvadas",
        valor: props.reservasProvadas,
        anterior: props.reservasProvadasAnoAnterior,
        icon: "🛢️",
        description: "Reservas comprovadas"
      }] : []),
      ...(props.custoProducao ? [{
        label: "Custo de Produção",
        chave: "custoProducao",
        valor: props.custoProducao,
        anterior: props.custoProducaoAnoAnterior,
        icon: "⚙️",
        description: "Custo por barril/unidade"
      }] : []),
      ...(props.breakEvenPrice ? [{
        label: "Break-even Price",
        chave: "breakEvenPrice",
        valor: props.breakEvenPrice,
        anterior: props.breakEvenPriceAnoAnterior,
        icon: "⚖️",
        description: "Preço de equilíbrio"
      }] : []),
      {
        label: "Eficiência Operacional",
        chave: "eficienciaOperacional",
        valor: calculatedMetrics.eficienciaOperacional,
        icon: "⚙️",
        description: "Score de eficiência operacional"
      },
      {
        label: "Solidez Financeira",
        chave: "solidezFinanceira",
        valor: calculatedMetrics.solidezFinanceira,
        icon: "🏛️",
        description: "Score de solidez financeira"
      },
      {
        label: "Geração de Caixa",
        chave: "geracaoCaixa",
        valor: calculatedMetrics.geracaoCaixa,
        icon: "💰",
        description: "Score de geração de caixa"
      },
    ],
  };

  // Complementares incluindo métricas calculadas e dados base
  const complementares = {
    // Métricas calculadas
    eficienciaOperacional: parseFloat(calculatedMetrics.eficienciaOperacional || "0"),
    solidezFinanceira: parseFloat(calculatedMetrics.solidezFinanceira || "0"),
    geracaoCaixa: parseFloat(calculatedMetrics.geracaoCaixa || "0"),

    // Dados originais (valores atuais)
    pe: parseFloat(props.pe ?? "NaN"),
    pb: parseFloat(props.pb ?? "NaN"),
    roe: parseFloat(props.roe ?? "NaN"),
    roic: parseFloat(props.roic ?? "NaN"),
    margemEbitda: parseFloat(props.margemEbitda ?? "NaN"),
    margemBruta: parseFloat(props.margemBruta ?? "NaN"),
    margemLiquida: parseFloat(props.margemLiquida ?? "NaN"),
    dividaEbitda: parseFloat(props.dividaEbitda ?? "NaN"),
    coberturaJuros: parseFloat(props.coberturaJuros ?? "NaN"),
    liquidezCorrente: parseFloat(props.liquidezCorrente ?? "NaN"),
    debtEquity: parseFloat(props.debtEquity ?? "NaN"),
    freeCashFlow: parseFloat(props.freeCashFlow ?? "NaN"),
    capexRevenue: parseFloat(props.capexRevenue ?? "NaN"),
    fcfYield: parseFloat(props.fcfYield ?? "NaN"),
    dividendYield: parseFloat(props.dividendYield ?? "NaN"),
    payoutRatio: parseFloat(props.payoutRatio ?? "NaN"),
    beta: parseFloat(props.beta ?? "NaN"),
    leveredDcf: parseFloat(props.leveredDcf ?? "NaN"),
    precoAtual: parseFloat(props.precoAtual ?? "NaN"),
    reservasProvadas: parseFloat(props.reservasProvadas ?? "NaN"),
    custoProducao: parseFloat(props.custoProducao ?? "NaN"),
    breakEvenPrice: parseFloat(props.breakEvenPrice ?? "NaN"),

    // Dados anteriores
    peAnoAnterior: parseFloat(props.peAnoAnterior ?? "NaN"),
    pbAnoAnterior: parseFloat(props.pbAnoAnterior ?? "NaN"),
    roeAnoAnterior: parseFloat(props.roeAnoAnterior ?? "NaN"),
    roicAnoAnterior: parseFloat(props.roicAnoAnterior ?? "NaN"),
    margemEbitdaAnoAnterior: parseFloat(props.margemEbitdaAnoAnterior ?? "NaN"),
    margemBrutaAnoAnterior: parseFloat(props.margemBrutaAnoAnterior ?? "NaN"),
    margemLiquidaAnoAnterior: parseFloat(props.margemLiquidaAnoAnterior ?? "NaN"),
    dividaEbitdaAnoAnterior: parseFloat(props.dividaEbitdaAnoAnterior ?? "NaN"),
    coberturaJurosAnoAnterior: parseFloat(props.coberturaJurosAnoAnterior ?? "NaN"),
    liquidezCorrenteAnoAnterior: parseFloat(props.liquidezCorrenteAnoAnterior ?? "NaN"),
    debtEquityAnoAnterior: parseFloat(props.debtEquityAnoAnterior ?? "NaN"),
    freeCashFlowAnoAnterior: parseFloat(props.freeCashFlowAnoAnterior ?? "NaN"),
    capexRevenueAnoAnterior: parseFloat(props.capexRevenueAnoAnterior ?? "NaN"),
    fcfYieldAnoAnterior: parseFloat(props.fcfYieldAnoAnterior ?? "NaN"),
    dividendYieldAnoAnterior: parseFloat(props.dividendYieldAnoAnterior ?? "NaN"),
    payoutRatioAnoAnterior: parseFloat(props.payoutRatioAnoAnterior ?? "NaN"),
    betaAnoAnterior: parseFloat(props.betaAnoAnterior ?? "NaN"),
    leveredDcfAnoAnterior: parseFloat(props.leveredDcfAnoAnterior ?? "NaN"),
    precoAtualAnoAnterior: parseFloat(props.precoAtualAnoAnterior ?? "NaN"),
    reservasProvadasAnoAnterior: parseFloat(props.reservasProvadasAnoAnterior ?? "NaN"),
    custoProducaoAnoAnterior: parseFloat(props.custoProducaoAnoAnterior ?? "NaN"),
    breakEvenPriceAnoAnterior: parseFloat(props.breakEvenPriceAnoAnterior ?? "NaN"),
  }

  // Formatação adequada para energia
  const formatValue = (valor: string, chave: string) => {
    const num = parseFloat(valor)
    if (isNaN(num)) return valor

    // Percentuais
    if (['roe', 'roic', 'margemEbitda', 'margemBruta', 'margemLiquida', 'dividendYield', 'payoutRatio', 'fcfYield', 'capexRevenue', 'eficienciaOperacional', 'solidezFinanceira', 'geracaoCaixa'].includes(chave)) {
      return `${num.toFixed(2)}%`
    }

    // Valores monetários (DCF, FCF)
    if (['leveredDcf', 'precoAtual', 'freeCashFlow'].includes(chave)) {
      return `${num.toFixed(2)}`
    }

    // Preços específicos (barril, etc)
    if (['custoProducao', 'breakEvenPrice'].includes(chave)) {
      return `$${num.toFixed(2)}`
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
            "Energy",
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
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
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
                    "Energy",
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
