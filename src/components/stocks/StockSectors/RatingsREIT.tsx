// src/components/ratings/RatingsREITs.tsx

import { buildRealEstateComplementares, RatingsREITsProps } from '@/features/tools/stocks/utils/complementares/realEstateComplementares'
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
        description: "Rendimento real de dividendos sobre o preço da ação"
      },
      {
        // ✅ ATUALIZADO: Label e descrição corretos
        label: "Dividend CAGR",
        chave: "dividendCagr5y",
        valor: props.dividendCagr5y,
        anterior: props.dividendCagr5yAnoAnterior,
        icon: "📈",
        description: "Taxa de crescimento real dos dividendos nos últimos anos"
      },
      {
        // ✅ ATUALIZADO: Descrição mais precisa
        label: "FFO Payout Ratio",
        chave: "ffoPayoutRatio",
        valor: props.ffoPayoutRatio,
        anterior: props.ffoPayoutRatioAnoAnterior,
        icon: "📊",
        description: "% do FFO distribuído como dividendos - métrica principal para REITs"
      },
    ],

    "Múltiplos Específicos REITs": [
      {
        label: "P/VPA",
        chave: "pVpa",
        valor: props.pVpa,
        anterior: props.pVpaAnoAnterior,
        icon: "💲",
        description: "Preço sobre Valor Patrimonial por Ação"
      },
      {
        // ✅ ATUALIZADO: Label e descrição para P/FFO real
        label: "P/FFO",
        chave: "pFfo",
        valor: props.pFfo,
        anterior: props.pFfoAnoAnterior,
        icon: "⚖️",
        description: "Múltiplo principal para REITs - Preço sobre FFO real (equivalente ao P/L)"
      },
    ],

    "Performance Operacional REITs": [
      {
        // ✅ ATUALIZADO: Descrição mais precisa
        label: "Margem EBITDA (proxy Ocupação)",
        chave: "ocupacao",
        valor: props.ocupacao,
        anterior: props.ocupacaoAnoAnterior,
        icon: "🏢",
        description: "Margem EBITDA como proxy para eficiência operacional (ocupação real não disponível)"
      },
      {
        label: "ROA (proxy Cap Rate)",
        chave: "capRate",
        valor: props.capRate,
        anterior: props.capRateAnoAnterior,
        icon: "🎯",
        description: "Retorno sobre Ativos como proxy para taxa de capitalização dos imóveis"
      },
      ...(props.noi && parseFloat(props.noi) !== 0 ? [{
        label: "Crescimento Receita (proxy NOI)",
        chave: "noi",
        valor: props.noi,
        anterior: props.noiAnoAnterior,
        icon: "📊",
        description: "Taxa de crescimento da receita como proxy para crescimento NOI"
      }] : []),
    ],

    "Fluxo de Caixa REITs": [
      {
        // ✅ ATUALIZADO: Label e descrição para FFO real
        label: "FFO (Funds From Operations)",
        chave: "ffo",
        valor: props.ffo,
        anterior: props.ffoAnoAnterior,
        icon: "💵",
        description: "Funds From Operations - métrica de cash flow principal para REITs"
      },
      {
        // ✅ ATUALIZADO: Label e descrição para AFFO real
        label: "AFFO (Adjusted FFO)",
        chave: "affo",
        valor: props.affo,
        anterior: props.affoAnoAnterior,
        icon: "💎",
        description: "Adjusted FFO - FFO menos CapEx normalizado, cash flow disponível real"
      },
      // ✅ NOVO: FFO per Share (se disponível)
      ...(props.ffoPerShare && parseFloat(props.ffoPerShare) !== 0 ? [{
        label: "FFO per Share",
        chave: "ffoPerShare",
        valor: props.ffoPerShare,
        anterior: props.ffoPerShareAnoAnterior,
        icon: "💸",
        description: "FFO por ação - base para cálculo de dividendos e avaliação"
      }] : []),
      // ✅ NOVO: AFFO per Share (se disponível)
      ...(props.affoPerShare && parseFloat(props.affoPerShare) !== 0 ? [{
        label: "AFFO per Share",
        chave: "affoPerShare",
        valor: props.affoPerShare,
        anterior: props.affoPerShareAnoAnterior,
        icon: "💎",
        description: "AFFO por ação - cash flow disponível real por ação"
      }] : []),
    ],

    "Estrutura Financeira": [
      {
        label: "Cobertura de Dividendos (FFO/Div)",
        chave: "coberturaJuros",
        valor: props.coberturaJuros,
        anterior: props.coberturaJurosAnoAnterior,
        icon: "🛡️",
        description: "Cobertura de dividendos baseada em FFO - capacidade de manter dividendos"
      },
      {
        label: "Dívida/EBITDA",
        chave: "dividaEbitda",
        valor: props.dividaEbitda,
        anterior: props.dividaEbitdaAnoAnterior,
        icon: "⚠️",
        description: "Alavancagem operacional - REITs tipicamente operam com mais dívida"
      },
      {
        label: "Liquidez Corrente",
        chave: "liquidezCorrente",
        valor: props.liquidezCorrente,
        anterior: props.liquidezCorrenteAnoAnterior,
        icon: "💧",
        description: "Capacidade de pagamento de obrigações de curto prazo"
      },
    ],

    // ✅ ATUALIZADO: Só mostra categoria se houver dados válidos
    ...(props.navDiscount || props.retentionRate ? {
      "Gestão de Capital": [
        ...(props.navDiscount && parseFloat(props.navDiscount) !== 0 ? [{
          label: "NAV Discount/Premium",
          chave: "navDiscount",
          valor: props.navDiscount,
          anterior: props.navDiscountAnoAnterior,
          icon: "🎲",
          description: "Desconto/Prémio ao Valor Patrimonial Líquido dos imóveis"
        }] : []),
        ...(props.retentionRate && parseFloat(props.retentionRate) !== 0 ? [{
          label: "Retention Rate",
          chave: "retentionRate",
          valor: props.retentionRate,
          anterior: props.retentionRateAnoAnterior,
          icon: "🔒",
          description: "Taxa de retenção de capital para reinvestimento e crescimento"
        }] : []),
      ]
    } : {}),
  }

  // ✅ MELHORADO: Função para formatar valores com mais precisão
  const formatValue = (valor: string, chave: string) => {
    // Tratar casos especiais primeiro
    if (!valor || valor === 'N/A' || valor === 'undefined') return 'N/A'

    // Limpar o valor primeiro (remover % se existir)
    const cleanValue = valor.replace('%', '').trim()
    const num = parseFloat(cleanValue)

    if (isNaN(num)) return valor

    // Valores em percentual - melhor precisão
    if (['dividendYield', 'dividendCagr5y', 'ffoPayoutRatio', 'ocupacao', 'capRate', 'noi'].includes(chave)) {
      return `${num.toFixed(2)}%`
    }

    // Cobertura de dividendos - formato especial
    if (chave === 'coberturaJuros') {
      return `${num.toFixed(2)}x`
    }

    // Valores monetários grandes (FFO, AFFO) - preservar formato original
    if (['ffo', 'affo'].includes(chave)) {
      // Se o valor original já contém formatação, preservar
      if (typeof valor === 'string' && (valor.includes('B') || valor.includes('M'))) {
        return valor
      }

      // Senão, formatar baseado no tamanho
      if (Math.abs(num) >= 1000000000) {
        return `${(num / 1000000000).toFixed(1)}B`
      }
      if (Math.abs(num) >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`
      }
      if (Math.abs(num) >= 1000) {
        return `${(num / 1000).toFixed(1)}K`
      }
      return num.toFixed(2)
    }

    // ✅ NOVO: FFO/AFFO per Share - formato monetário
    if (['ffoPerShare', 'affoPerShare'].includes(chave)) {
      return `$${num.toFixed(2)}`
    }

    // Ratios e outros valores
    if (['pVpa', 'pFfo', 'dividaEbitda', 'liquidezCorrente'].includes(chave)) {
      return num.toFixed(2)
    }

    // Default: 2 casas decimais
    return num.toFixed(2)
  }

  // ✅ MELHORADO: Validação mais robusta de indicadores
  const isValidIndicator = (valor: string): boolean => {
    if (!valor || valor === 'N/A' || valor === 'undefined' || valor === '0') return false

    const cleanValue = valor.replace('%', '').trim()
    const num = parseFloat(cleanValue)

    return !isNaN(num) && isFinite(num)
  }

  return (
    <div className="mt-6 space-y-8">
      {Object.entries(categorias).map(([categoria, indicadores]) => {
        // ✅ MELHORADO: Filtro mais inteligente de indicadores válidos
        const indicadoresValidos = indicadores.filter(({ label, valor, anterior }) => {
          // Primeiro verificar se o valor é válido
          if (!isValidIndicator(valor)) return false

          const numeric = parseFloat(valor.replace('%', ''))

          // ✅ NOVO: Usar complementares específicos de REITs
          const { apenasInformativo } = avaliarIndicadorComContexto(
            "Real Estate",
            label,
            numeric,
            {
              valorAnterior: anterior ? parseFloat(anterior.replace('%', '')) : undefined,
              complementares, // ✅ Agora só contém indicadores de REITs
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
                  const numeric = parseFloat(valor.replace('%', ''))
                  const prev = anterior ? parseFloat(anterior.replace('%', '')) : undefined

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

                  // ✅ MELHORADO: Lógica de melhoria/deterioração mais precisa
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
                              : `Benchmark específico para REITs: "${label}".`
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          {formatValue(valor, chave)}
                        </span>

                        {anterior && isValidIndicator(anterior) && (
                          <div className="flex items-center gap-1 text-xs">
                            <span className="text-gray-500">vs.</span>
                            <span className="text-gray-600">{formatValue(anterior, chave)}</span>
                            {hasImprovement && <span className="text-green-500 text-sm">↗</span>}
                            {hasDeterioration && <span className="text-red-500 text-sm">↘</span>}
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

      {/* ✅ ATUALIZADO: Aviso melhorado sobre métricas REITs */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-blue-600 text-lg">✅</span>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Métricas Específicas para REITs</p>
            <p className="text-xs text-blue-700">
              Esta análise inclui indicadores reais para REITs: <strong>FFO, AFFO, P/FFO, FFO Payout Ratio e FFO per Share</strong> são
              calculados automaticamente com dados da API. A cobertura de dividendos usa FFO real quando disponível.
              Algumas métricas como ocupação e NOI same-store ainda usam proxies baseados em dados financeiros.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
