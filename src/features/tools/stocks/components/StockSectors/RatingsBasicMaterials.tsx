import {
  buildBasicMaterialsComplementares,
  RatingsBasicMaterialsProps,
} from '@/features/tools/stocks/utils/complementares/basicMaterialsComplementares'
import { avaliarIndicadorComContexto } from '../hooks/avaliarIndicadorComContexto'
import { IndicatorValuePro } from '../quickAnalysis/IndicatorValuePro'

interface Categoria {
  label: string
  chave: string
  valor: string
  anterior?: string
  icon?: string
  description?: string
}

export function RatingsBasicMaterials(props: RatingsBasicMaterialsProps) {
  // ✅ NOVO: Constrói complementares específicos para Basic Materials
  const complementares = buildBasicMaterialsComplementares(props)

  console.log('🔧 Basic Materials Complementares:', complementares)

  // Calcular métricas específicas de basic materials
  const calculateBasicMaterialsMetrics = () => {
    const roicNum = parseFloat(props.roic) || 0
    const margemEbitdaNum = parseFloat(props.margemEbitda) || 0
    const dividaEbitdaNum = parseFloat(props.dividaEbitda) || 0
    const freeCashFlowNum = parseFloat(props.freeCashFlow) || 0
    const inventoryTurnoverNum = parseFloat(props.inventoryTurnover || '0') || 0

    return {
      // Score de Eficiência Operacional
      eficienciaOperacional:
        margemEbitdaNum > 25 && roicNum > 12
          ? '90'
          : margemEbitdaNum > 15 && roicNum > 8
            ? '75'
            : '50',

      // Score de Gestão de Capital
      gestaoCapital:
        inventoryTurnoverNum > 6 && dividaEbitdaNum < 2.5
          ? '95'
          : inventoryTurnoverNum > 4 && dividaEbitdaNum < 3.5
            ? '80'
            : '60',

      // Score de Geração de Valor
      geracaoValor: freeCashFlowNum > 0 && roicNum > 10 ? '85' : freeCashFlowNum > 0 ? '70' : '45',
    }
  }

  const calculatedMetrics = calculateBasicMaterialsMetrics()

  const categorias: Record<string, Categoria[]> = {
    'Rentabilidade e Retorno': [
      {
        label: 'P/E',
        chave: 'pe',
        valor: props.pe,
        anterior: props.peAnoAnterior,
        icon: '💲',
        description: 'Preço sobre Lucro',
      },
      {
        label: 'P/B',
        chave: 'pb',
        valor: props.pb,
        anterior: props.pbAnoAnterior,
        icon: '📚',
        description: 'Preço sobre Valor Contábil',
      },
      {
        label: 'ROE',
        chave: 'roe',
        valor: props.roe,
        anterior: props.roeAnoAnterior,
        icon: '📈',
        description: 'Retorno sobre Patrimônio Líquido',
      },
      {
        label: 'ROIC',
        chave: 'roic',
        valor: props.roic,
        anterior: props.roicAnoAnterior,
        icon: '🎯',
        description: 'Retorno sobre Capital Investido',
      },
    ],

    'Margens e Eficiência': [
      {
        label: 'Margem EBITDA',
        chave: 'margemEbitda',
        valor: props.margemEbitda,
        anterior: props.margemEbitdaAnoAnterior,
        icon: '📊',
        description: 'Margem EBITDA',
      },
      {
        label: 'Margem Bruta',
        chave: 'margemBruta',
        valor: props.margemBruta,
        anterior: props.margemBrutaAnoAnterior,
        icon: '💰',
        description: 'Margem Bruta',
      },
      {
        label: 'Margem Líquida',
        chave: 'margemLiquida',
        valor: props.margemLiquida,
        anterior: props.margemLiquidaAnoAnterior,
        icon: '🎯',
        description: 'Margem Líquida',
      },
      {
        label: 'Margem Operacional',
        chave: 'margemOperacional',
        valor: props.margemOperacional,
        anterior: props.margemOperacionalAnoAnterior,
        icon: '⚙️',
        description: 'Margem Operacional',
      },
    ],

    'Estrutura de Capital e Solvência': [
      {
        label: 'Dívida/EBITDA',
        chave: 'dividaEbitda',
        valor: props.dividaEbitda,
        anterior: props.dividaEbitdaAnoAnterior,
        icon: '⚖️',
        description: 'Endividamento vs. Geração de Caixa',
      },
      {
        label: 'Cobertura de Juros',
        chave: 'coberturaJuros',
        valor: props.coberturaJuros,
        anterior: props.coberturaJurosAnoAnterior,
        icon: '🛡️',
        description: 'Capacidade de Pagamento de Juros',
      },
      {
        label: 'Liquidez Corrente',
        chave: 'liquidezCorrente',
        valor: props.liquidezCorrente,
        anterior: props.liquidezCorrenteAnoAnterior,
        icon: '💧',
        description: 'Liquidez de Curto Prazo',
      },
      {
        label: 'Dívida/Patrimônio',
        chave: 'debtEquity',
        valor: props.debtEquity,
        anterior: props.debtEquityAnoAnterior,
        icon: '📊',
        description: 'Alavancagem Financeira',
      },
    ],

    'Fluxo de Caixa e Eficiência de Capital': [
      {
        label: 'Free Cash Flow',
        chave: 'freeCashFlow',
        valor: props.freeCashFlow,
        anterior: props.freeCashFlowAnoAnterior,
        icon: '💸',
        description: 'Fluxo de Caixa Livre',
      },
      {
        label: 'CapEx/Receita',
        chave: 'capexRevenue',
        valor: props.capexRevenue,
        anterior: props.capexRevenueAnoAnterior,
        icon: '🏗️',
        description: 'Intensidade de Investimentos',
      },
      {
        label: 'FCF Yield',
        chave: 'fcfYield',
        valor: props.fcfYield,
        anterior: props.fcfYieldAnoAnterior,
        icon: '💰',
        description: 'Rendimento do Fluxo de Caixa',
      },
      {
        label: 'Working Capital Turnover',
        chave: 'workingCapitalTurnover',
        valor: props.workingCapitalTurnover,
        anterior: props.workingCapitalTurnoverAnoAnterior,
        icon: '🔄',
        description: 'Eficiência do Capital de Giro',
      },
    ],

    'Crescimento e Performance': [
      {
        label: 'Crescimento Receita',
        chave: 'crescimentoReceita',
        valor: props.crescimentoReceita,
        anterior: props.crescimentoReceitaAnoAnterior,
        icon: '📈',
        description: 'Crescimento da Receita',
      },
      {
        label: 'Crescimento EBITDA',
        chave: 'crescimentoEbitda',
        valor: props.crescimentoEbitda,
        anterior: props.crescimentoEbitdaAnoAnterior,
        icon: '📊',
        description: 'Crescimento do EBITDA',
      },
    ],

    'Dividendos e Retorno': [
      {
        label: 'Dividend Yield',
        chave: 'dividendYield',
        valor: props.dividendYield,
        anterior: props.dividendYieldAnoAnterior,
        icon: '💎',
        description: 'Rendimento de Dividendos',
      },
      {
        label: 'Payout Ratio',
        chave: 'payoutRatio',
        valor: props.payoutRatio,
        anterior: props.payoutRatioAnoAnterior,
        icon: '📤',
        description: '% dos lucros distribuídos',
      },
    ],

    'Volatilidade e Avaliação': [
      {
        label: 'Beta',
        chave: 'beta',
        valor: props.beta,
        anterior: props.betaAnoAnterior,
        icon: '📉',
        description: 'Volatilidade vs. mercado',
      },
      {
        label: 'Valuation (DCF)',
        chave: 'leveredDcf',
        valor: props.leveredDcf,
        anterior: props.leveredDcfAnoAnterior,
        icon: '📊',
        description: 'Fluxo de Caixa Descontado',
      },
    ],

    'Métricas Específicas de Basic Materials': [
      ...(props.inventoryTurnover
        ? [
            {
              label: 'Inventory Turnover',
              chave: 'inventoryTurnover',
              valor: props.inventoryTurnover,
              anterior: props.inventoryTurnoverAnoAnterior,
              icon: '📦',
              description: 'Giro de Inventário',
            },
          ]
        : []),
      ...(props.assetTurnover
        ? [
            {
              label: 'Asset Turnover',
              chave: 'assetTurnover',
              valor: props.assetTurnover,
              anterior: props.assetTurnoverAnoAnterior,
              icon: '🏭',
              description: 'Giro de Ativos',
            },
          ]
        : []),
      ...(props.capacityUtilization
        ? [
            {
              label: 'Capacity Utilization',
              chave: 'capacityUtilization',
              valor: props.capacityUtilization,
              anterior: props.capacityUtilizationAnoAnterior,
              icon: '⚡',
              description: 'Utilização da Capacidade',
            },
          ]
        : []),
      {
        label: 'Eficiência Operacional',
        chave: 'eficienciaOperacional',
        valor: calculatedMetrics.eficienciaOperacional,
        icon: '⚙️',
        description: 'Score de eficiência operacional',
      },
      {
        label: 'Gestão de Capital',
        chave: 'gestaoCapital',
        valor: calculatedMetrics.gestaoCapital,
        icon: '💼',
        description: 'Score de gestão de capital',
      },
      {
        label: 'Geração de Valor',
        chave: 'geracaoValor',
        valor: calculatedMetrics.geracaoValor,
        icon: '💎',
        description: 'Score de geração de valor',
      },
    ],
  }

  // Formatação adequada para basic materials
  const formatValue = (valor: string, chave: string) => {
    const num = parseFloat(valor)
    if (isNaN(num)) return valor

    // Percentuais
    if (
      [
        'roe',
        'roic',
        'margemEbitda',
        'margemBruta',
        'margemLiquida',
        'margemOperacional',
        'dividendYield',
        'payoutRatio',
        'fcfYield',
        'capexRevenue',
        'crescimentoReceita',
        'crescimentoEbitda',
        'capacityUtilization',
        'eficienciaOperacional',
        'gestaoCapital',
        'geracaoValor',
      ].includes(chave)
    ) {
      return `${num.toFixed(2)}%`
    }

    // Valores monetários (DCF, FCF)
    if (['leveredDcf', 'precoAtual', 'freeCashFlow'].includes(chave)) {
      if (Math.abs(num) > 1000000) {
        return `${(num / 1000000).toFixed(1)}M`
      }
      return `${num.toFixed(2)}`
    }

    // Ratios de giro e turnover
    if (['inventoryTurnover', 'assetTurnover', 'workingCapitalTurnover'].includes(chave)) {
      return `${num.toFixed(2)}x`
    }

    // Ratios gerais
    return num.toFixed(2)
  }

  return (
    <div className="mt-6 space-y-8">
      {Object.entries(categorias).map(([categoria, indicadores]) => {
        // Filtrar indicadores válidos antes de renderizar a categoria
        const indicadoresValidos = indicadores.filter(({ label, valor }) => {
          const numeric = parseFloat(valor)

          // ✅ NOVO: Usar complementares específicos de Basic Materials
          const { apenasInformativo } = avaliarIndicadorComContexto(
            'Basic Materials',
            label,
            numeric,
            {
              valorAnterior: undefined,
              complementares, // ✅ Agora só contém indicadores de Basic Materials
            },
          )
          return !apenasInformativo
        })

        // Se não há indicadores válidos, não renderizar a categoria
        if (indicadoresValidos.length === 0) return null

        return (
          <div
            key={categoria}
            className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                {categoria}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({indicadoresValidos.length} indicador
                  {indicadoresValidos.length !== 1 ? 'es' : ''})
                </span>
              </h3>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {indicadoresValidos.map(({ label, valor, anterior, icon, description, chave }) => {
                  const numeric = parseFloat(valor)
                  const prev = anterior ? parseFloat(anterior) : undefined

                  // ✅ NOVO: Usar complementares específicos de Basic Materials
                  const { score, explicacaoCustom } = avaliarIndicadorComContexto(
                    'Basic Materials',
                    label,
                    numeric,
                    {
                      valorAnterior: prev,
                      complementares, // ✅ Agora só contém indicadores de Basic Materials
                    },
                  )

                  const hasImprovement = prev !== undefined && numeric > prev
                  const hasDeterioration = prev !== undefined && numeric < prev

                  return (
                    <div
                      key={label}
                      className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200"
                    >
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
                            explicacaoCustom && explicacaoCustom.trim() !== ''
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
