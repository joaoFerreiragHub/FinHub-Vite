// src/components/ratings/RatingsEnergy.tsx

import { buildEnergyComplementares, RatingsEnergyProps } from '@/features/tools/stocks/utils/complementares/energyComplementares'
import { calculateCashGeneration, calculateEnergyEfficiency, calculateFinancialSolidity } from '@/features/tools/stocks/utils/energyCalculations'
import { avaliarIndicadorComContexto } from "../hooks/avaliarIndicadorComContexto"
import { IndicatorValuePro } from "../quickAnalysis/IndicatorValuePro"


export function RatingsEnergy(props: RatingsEnergyProps) {
  // ✅ NOVO: Constrói complementares específicos para Energy
  const complementares = buildEnergyComplementares(props)

  console.log('⚡ Energy Complementares:', complementares)

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

    "Estrutura Financeira": [
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

    "Dividendos e Risco": [
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
      {
        label: "Beta",
        chave: "beta",
        valor: props.beta,
        anterior: props.betaAnoAnterior,
        icon: "📉",
        description: "Volatilidade vs. mercado"
      },
    ],

    "Avaliação e Métricas Específicas": [
      {
        label: "Valuation (DCF)",
        chave: "leveredDcf",
        valor: props.leveredDcf,
        anterior: props.leveredDcfAnoAnterior,
        icon: "📊",
        description: "Fluxo de Caixa Descontado"
      },
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
      // ✅ NOVO: Métricas calculadas melhoradas - apenas se temos dados suficientes
      ...(() => {
        try {
          const efficiencyScore = calculateEnergyEfficiency(complementares)
          const solidityScore = calculateFinancialSolidity(complementares)
          const cashScore = calculateCashGeneration(complementares)

          const metrics = []

          // Só adiciona se não são valores padrão/erro
          if (!isNaN(efficiencyScore) && efficiencyScore !== 50) {
            metrics.push({
              label: "Eficiência Operacional",
              chave: "eficienciaOperacional",
              valor: efficiencyScore.toFixed(1),
              icon: "⚙️",
              description: "Score de eficiência operacional (0-100)"
            })
          }

          if (!isNaN(solidityScore) && solidityScore !== 50) {
            metrics.push({
              label: "Solidez Financeira",
              chave: "solidezFinanceira",
              valor: solidityScore.toFixed(1),
              icon: "🏛️",
              description: "Score de solidez financeira (0-100)"
            })
          }

          if (!isNaN(cashScore) && cashScore !== 50) {
            metrics.push({
              label: "Geração de Caixa",
              chave: "geracaoCaixa",
              valor: cashScore.toFixed(1),
              icon: "💰",
              description: "Score de geração de caixa (0-100)"
            })
          }

          return metrics
        } catch (error) {
          console.warn('Erro ao calcular métricas de energia:', error)
          return []
        }
      })()
    ],
  };

  // Função para formatar valores adequadamente para energia
  const formatValue = (valor: string, chave: string) => {
    // Limpar o valor primeiro (remover % se existir)
    const cleanValue = valor.replace('%', '').trim()
    const num = parseFloat(cleanValue)

    if (isNaN(num)) return valor

    // Percentuais
    if (['roe', 'roic', 'margemEbitda', 'margemBruta', 'margemLiquida', 'dividendYield', 'payoutRatio', 'fcfYield', 'capexRevenue'].includes(chave)) {
      return `${num.toFixed(2)}%`
    }

    // Scores (0-100)
    if (['eficienciaOperacional', 'solidezFinanceira', 'geracaoCaixa'].includes(chave)) {
      return `${num.toFixed(1)}`
    }

    // Valores monetários (DCF, FCF) - formatação igual ao Technology
    if (['leveredDcf', 'precoAtual', 'freeCashFlow'].includes(chave)) {
      if (Math.abs(num) >= 1000000000) {
        return `${(num / 1000000000).toFixed(1)}B`
      }
      if (Math.abs(num) >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`
      }
      return `${num.toFixed(2)}`
    }

    // Preços específicos (barril, etc)
    if (['custoProducao', 'breakEvenPrice'].includes(chave)) {
      return `$${num.toFixed(2)}`
    }

    // Múltiplos de valuation
    if (['pe', 'pb'].includes(chave)) {
      return num.toFixed(2)
    }

    // Ratios gerais
    if (['dividaEbitda', 'coberturaJuros', 'liquidezCorrente', 'debtEquity'].includes(chave)) {
      return `${num.toFixed(2)}x`
    }

    // Beta (com duas casas decimais)
    if (chave === 'beta') {
      return num.toFixed(2)
    }

    // Reservas (com formatação adequada)
    if (chave === 'reservasProvadas') {
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M bbl`
      }
      if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K bbl`
      }
      return `${num.toFixed(0)} bbl`
    }

    // Default
    return num.toFixed(2)
  }

  return (
    <div className="mt-6 space-y-8">
      {Object.entries(categorias).map(([categoria, indicadores]) => {
        // Filtrar indicadores válidos antes de renderizar a categoria
        const indicadoresValidos = indicadores.filter(({ label, valor, chave }) => {
          const numeric = parseFloat(valor.replace('%', ''))

          // Para métricas calculadas, validar se realmente têm dados
          if (['eficienciaOperacional', 'solidezFinanceira', 'geracaoCaixa'].includes(chave)) {
            // Se é uma métrica calculada e tem valor padrão (50) ou inválido, filtrar
            if (isNaN(numeric) || numeric === 50 || numeric <= 0) {
              return false
            }
          }

          // ✅ IGUAL AO TECHNOLOGY: Usar complementares específicos de Energy
          try {
            const { apenasInformativo } = avaliarIndicadorComContexto(
              "Energy",
              label,
              numeric,
              {
                valorAnterior: undefined,
                complementares, // ✅ Agora só contém indicadores de Energy
              }
            )
            return !apenasInformativo
          } catch (error) {
            console.warn(`Erro ao avaliar indicador ${label}:`, error)
            return false
          }
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
                  const numeric = parseFloat(valor.replace('%', ''))
                  const prev = anterior ? parseFloat(anterior.replace('%', '')) : undefined

                  // ✅ NOVO: Usar complementares específicos de Energy
                  const { score, explicacaoCustom } = avaliarIndicadorComContexto(
                    "Energy",
                    label,
                    numeric,
                    {
                      valorAnterior: prev,
                      complementares, // ✅ Agora só contém indicadores de Energy
                    }
                  )

                  // ✅ IGUAL AO TECHNOLOGY: Lógica simples de melhoria/deterioração
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
