// src/components/ratings/RatingsIndustrials.tsx

import { buildIndustrialsComplementares, RatingsIndustrialsProps } from "../../../utils/complementares/industrialsComplementares"
import { avaliarIndicadorComContexto } from "../hooks/avaliarIndicadorComContexto"
import { IndicatorValuePro } from "../quickAnalysis/IndicatorValuePro"
import {
  calculateEfficiencyScore,
  calculateCapitalQuality,
  calculateOperationalCycle,
  calculateOperationalLeverage,
} from "../../../utils/industrialsCalculations"

export function RatingsIndustrials(props: RatingsIndustrialsProps) {
  // ✅ NOVO: Constrói complementares específicos para Industrials
  const complementares = buildIndustrialsComplementares(props)

  console.log('🏭 Industrials Complementares:', complementares)

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
    "Rentabilidade e Eficiência": [
      {
        label: "Margem EBITDA",
        chave: "margemEbitda",
        valor: props.margemEbitda,
        anterior: props.margemEbitdaAnoAnterior,
        icon: "⚙️",
        description: "Margem EBITDA operacional"
      },
      {
        label: "ROIC",
        chave: "roic",
        valor: props.roic,
        anterior: props.roicAnoAnterior,
        icon: "🎯",
        description: "Retorno sobre Capital Investido"
      },
      ...(props.roe ? [{
        label: "ROE",
        chave: "roe",
        valor: props.roe,
        anterior: props.roeAnoAnterior,
        icon: "📈",
        description: "Retorno sobre Patrimônio Líquido"
      }] : []),
      ...(props.margemLiquida ? [{
        label: "Margem Líquida",
        chave: "margemLiquida",
        valor: props.margemLiquida,
        anterior: props.margemLiquidaAnoAnterior,
        icon: "💎",
        description: "Margem líquida"
      }] : []),
    ],

    "Estrutura Financeira": [
      {
        label: "Alavancagem Financeira",
        chave: "alavancagem",
        valor: props.alavancagem,
        anterior: props.alavancagemAnoAnterior,
        icon: "⚖️",
        description: "Nível de alavancagem financeira"
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
        valor: props.liquidezCorrente,
        anterior: props.liquidezCorrenteAnoAnterior,
        icon: "💧",
        description: "Liquidez de curto prazo"
      },
    ],

    "Eficiência Operacional": [
      {
        label: "Rotatividade de Estoques",
        chave: "rotatividadeEstoques",
        valor: props.rotatividadeEstoques,
        anterior: props.rotatividadeEstoquesAnoAnterior,
        icon: "📦",
        description: "Eficiência na gestão de estoques"
      },
      {
        label: "Giro do Ativo",
        chave: "giroAtivo",
        valor: props.giroAtivo,
        anterior: props.giroAtivoAnoAnterior,
        icon: "🔄",
        description: "Eficiência no uso dos ativos"
      },
    ],

    "Múltiplos de Valuation": [
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
      {
        label: "PEG",
        chave: "peg",
        valor: props.peg,
        anterior: props.pegAnoAnterior,
        icon: "📊",
        description: "P/L ajustado pelo crescimento"
      },
    ],

    "Dividendos e Risco": [
      {
        label: "Dividend Yield",
        chave: "dividendYield",
        valor: props.dividendYield,
        anterior: props.dividendYieldAnoAnterior,
        icon: "💰",
        description: "Rendimento de dividendos"
      },
      {
        label: "Beta",
        chave: "beta",
        valor: props.beta,
        anterior: props.betaAnoAnterior,
        icon: "📉",
        description: "Volatilidade em relação ao mercado"
      },
    ],

    "Fluxo de Caixa e Métricas Específicas": [
      ...(props.fcf ? [{
        label: "Free Cash Flow",
        chave: "fcf",
        valor: props.fcf,
        anterior: props.fcfAnoAnterior,
        icon: "💵",
        description: "Fluxo de Caixa Livre"
      }] : []),
      // ✅ NOVO: Métricas calculadas melhoradas - apenas se temos dados suficientes
      ...(() => {
        try {
          const efficiencyScore = calculateEfficiencyScore(complementares)
          const capitalQuality = calculateCapitalQuality(complementares)
          const operationalCycle = calculateOperationalCycle(complementares)
          const operationalLeverage = calculateOperationalLeverage(complementares)

          const metrics = []

          // Só adiciona se não são valores padrão/erro
          if (!isNaN(efficiencyScore) && efficiencyScore !== 50) {
            metrics.push({
              label: "Eficiência Operacional",
              chave: "eficienciaOperacional",
              valor: efficiencyScore.toFixed(1),
              icon: "💼",
              description: "Score de eficiência operacional (0-100)"
            })
          }

          if (!isNaN(capitalQuality) && capitalQuality !== 50) {
            metrics.push({
              label: "Qualidade dos Ativos",
              chave: "qualidadeAtivos",
              valor: capitalQuality.toFixed(1),
              icon: "🏭",
              description: "Qualidade e produtividade dos ativos (0-100)"
            })
          }

          if (!isNaN(operationalCycle) && operationalCycle > 0) {
            metrics.push({
              label: "Ciclo Operacional",
              chave: "cicloOperacional",
              valor: operationalCycle.toFixed(0),
              icon: "🔄",
              description: "Ciclo operacional estimado em dias"
            })
          }

          if (!isNaN(operationalLeverage) && operationalLeverage !== 50) {
            metrics.push({
              label: "Alavancagem Operacional",
              chave: "alavancagemOperacional",
              valor: operationalLeverage.toFixed(1),
              icon: "⚖️",
              description: "Score de alavancagem operacional (0-100)"
            })
          }

          return metrics
        } catch (error) {
          console.warn('Erro ao calcular métricas industriais:', error)
          return []
        }
      })()
    ],
  };

  // Função para formatar valores adequadamente para industrials
  const formatValue = (valor: string, chave: string) => {
    // Limpar o valor primeiro (remover % se existir)
    const cleanValue = valor.replace('%', '').trim()
    const num = parseFloat(cleanValue)

    if (isNaN(num)) return valor

    // Percentuais
    if (['margemEbitda', 'roic', 'roe', 'margemLiquida', 'dividendYield'].includes(chave)) {
      return `${num.toFixed(2)}%`
    }

    // Scores (0-100)
    if (['eficienciaOperacional', 'qualidadeAtivos', 'alavancagemOperacional'].includes(chave)) {
      return `${num.toFixed(1)}`
    }

    // Dias (ciclos)
    if (['cicloOperacional'].includes(chave)) {
      return `${num.toFixed(0)} dias`
    }

    // Valores monetários (FCF) - formatação igual ao Technology
    if (['fcf'].includes(chave)) {
      if (Math.abs(num) >= 1000000000) {
        return `${(num / 1000000000).toFixed(1)}B`
      }
      if (Math.abs(num) >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`
      }
      return `${num.toFixed(2)}`
    }

    // Múltiplos e ratios
    if (['rotatividadeEstoques', 'giroAtivo', 'alavancagem', 'coberturaJuros', 'liquidezCorrente'].includes(chave)) {
      return `${num.toFixed(2)}x`
    }

    // Múltiplos de valuation
    if (['pe', 'pb', 'ps', 'peg'].includes(chave)) {
      return num.toFixed(2)
    }

    // Beta (com duas casas decimais)
    if (chave === 'beta') {
      return num.toFixed(2)
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
          if (['eficienciaOperacional', 'qualidadeAtivos', 'cicloOperacional', 'alavancagemOperacional'].includes(chave)) {
            // Se é uma métrica calculada e tem valor padrão (50) ou inválido, filtrar
            if (isNaN(numeric) || numeric === 50 || numeric <= 0) {
              return false
            }
          }

          // ✅ IGUAL AO TECHNOLOGY: Usar complementares específicos de Industrials
          try {
            const { apenasInformativo } = avaliarIndicadorComContexto(
              "industrials",
              label,
              numeric,
              {
                valorAnterior: undefined,
                complementares, // ✅ Agora só contém indicadores de Industrials
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

                  // ✅ NOVO: Usar complementares específicos de Industrials
                  const { score, explicacaoCustom } = avaliarIndicadorComContexto(
                    "industrials",
                    label,
                    numeric,
                    {
                      valorAnterior: prev,
                      complementares, // ✅ Agora só contém indicadores de Industrials
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
