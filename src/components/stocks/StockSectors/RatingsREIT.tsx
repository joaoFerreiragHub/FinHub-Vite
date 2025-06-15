// src/components/ratings/RatingsREITs.tsx

import { buildRealEstateComplementares, RatingsREITsProps } from "../../../utils/complementares/realEstateComplementares"
import { avaliarIndicadorComContexto } from "../hooks/avaliarIndicadorComContexto"
import { IndicatorValuePro } from "../quickAnalysis/IndicatorValuePro"

export function RatingsREITs(props: RatingsREITsProps) {
  // ✅ NOVO: Constrói complementares específicos para REITs
  const complementares = buildRealEstateComplementares(props)

  console.log('🏢 REITs Complementares:', complementares)

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
        label: "Dividend Yield",
        chave: "dividendYield",
        valor: props.dividendYield,
        anterior: props.dividendYieldAnoAnterior,
        icon: "💰",
        description: "% dos lucros distribuídos como dividendos"
      },
      {
        label: "CAGR EPS",
        chave: "dividendCagr5y",
        valor: props.dividendCagr5y,
        anterior: props.dividendCagr5yAnoAnterior,
        icon: "📈",
        description: "Taxa de crescimento anual composta do EPS"
      },
      {
        label: "FFO Payout Ratio",
        chave: "ffoPayoutRatio",
        valor: props.ffoPayoutRatio,
        anterior: props.ffoPayoutRatioAnoAnterior,
        icon: "📊",
        description: "% do FFO distribuído como dividendo"
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
        label: "Taxa de Ocupação",
        chave: "ocupacao",
        valor: props.ocupacao,
        anterior: props.ocupacaoAnoAnterior,
        icon: "🏢",
        description: "Margem operacional da empresa (proxy ocupação)"
      },
      {
        label: "Cap Rate",
        chave: "capRate",
        valor: props.capRate,
        anterior: props.capRateAnoAnterior,
        icon: "🎯",
        description: "Retorno sobre patrimônio (proxy para cap rate)"
      },
      ...(props.noi && parseFloat(props.noi) !== 0 ? [{
        label: "NOI Growth",
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
        label: "AFFO",
        chave: "affo",
        valor: props.affo,
        anterior: props.affoAnoAnterior,
        icon: "💎",
        description: "Fluxo de Caixa Livre (proxy para AFFO)"
      },
    ],

    "Estrutura Financeira": [
      {
        label: "Cobertura de Juros",
        chave: "coberturaJuros",
        valor: props.coberturaJuros,
        anterior: props.coberturaJurosAnoAnterior,
        icon: "🛡️",
        description: "Retorno sobre Capital Investido (proxy cobertura)"
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

  // Função para formatar valores
  const formatValue = (valor: string, chave: string) => {
    // Limpar o valor primeiro (remover % se existir)
    const cleanValue = valor.replace('%', '').trim()
    const num = parseFloat(cleanValue)

    if (isNaN(num)) return valor

    // Valores em percentual
    if (['dividendYield', 'dividendCagr5y', 'ffoPayoutRatio', 'ocupacao', 'capRate', 'noi', 'coberturaJuros'].includes(chave)) {
      return `${num.toFixed(2)}%`
    }

    // Valores monetários grandes (FFO, AFFO)
    if (['ffo', 'affo'].includes(chave)) {
      // Se o valor original contém "B", é bilhões
      if (typeof valor === 'string' && valor.includes('B')) {
        return `${num.toFixed(1)}B`
      }
      // Se o valor original contém "M", é milhões
      if (typeof valor === 'string' && valor.includes('M')) {
        return `${num.toFixed(1)}M`
      }
      // Senão, valores normais
      if (Math.abs(num) > 1000000000) {
        return `${(num / 1000000000).toFixed(1)}B`
      }
      if (Math.abs(num) > 1000000) {
        return `${(num / 1000000).toFixed(1)}M`
      }
      return num.toFixed(2)
    }

    // Ratios com 2 casas decimais
    return num.toFixed(2)
  }

  return (
    <div className="mt-6 space-y-8">
      {Object.entries(categorias).map(([categoria, indicadores]) => {
        // Filtrar indicadores válidos antes de renderizar a categoria
        const indicadoresValidos = indicadores.filter(({ label, valor, anterior }) => {
          const numeric = parseFloat(valor)

          // ✅ NOVO: Usar complementares específicos de REITs
          const { apenasInformativo } = avaliarIndicadorComContexto(
            "Real Estate",
            label,
            numeric,
            {
              valorAnterior: anterior ? parseFloat(anterior) : undefined,
              complementares, // ✅ Agora só contém indicadores de REITs
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

                  // ✅ NOVO: Usar complementares específicos de REITs
                  const { score, explicacaoCustom } = avaliarIndicadorComContexto(
                    "Real Estate",
                    label,
                    numeric,
                    {
                      valorAnterior: prev,
                      complementares, // ✅ Agora só contém indicadores de REITs
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
