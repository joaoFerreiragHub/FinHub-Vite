import { avaliarIndicadorComContexto } from '../hooks/avaliarIndicadorComContexto'
import { IndicatorValuePro } from '../quickAnalysis/IndicatorValuePro'
import {
  buildFinancialComplementares,
  RatingsFinancialsProps,
} from '@/features/tools/stocks/utils/complementares/financialComplementares'

interface Categoria {
  label: string
  chave: string
  valor: string
  anterior?: string
  icon?: string
  description?: string
}

export function RatingsFinancials(props: RatingsFinancialsProps) {
  // ✅ UNIVERSAL: Detectar tipo de instituição financeira
  const detectFinancialType = () => {
    const hasBasileia = props.basileia && parseFloat(props.basileia) > 0
    const hasNIM = props.nim && parseFloat(props.nim) > 0 && props.nim !== 'N/A'
    const hasInadimplencia =
      props.inadimplencia && parseFloat(props.inadimplencia) > 0 && props.inadimplencia !== 'N/A'
    const roeNum = parseFloat(props.roe || '0')

    return {
      isBanco: hasBasileia || hasNIM || hasInadimplencia,
      isPaymentProcessor: !hasBasileia && !hasNIM && roeNum > 30,
      isFintech: true, // Todos podem usar métricas básicas
    }
  }

  const financialType = detectFinancialType()

  // ✅ UNIVERSAL: Métricas calculadas adaptáveis
  const calculateUniversalMetrics = () => {
    const roeNum = parseFloat(props.roe) || 0
    const eficienciaNum = parseFloat(props.eficiencia) || 0
    const basileiaNum = parseFloat(props.basileia) || 0
    const inadimplenciaNum = parseFloat(props.inadimplencia) || 0
    const coberturaNum = parseFloat(props.cobertura) || 0
    const liquidezNum = parseFloat(props.liquidez) || 0

    return {
      // Score de Rentabilidade Universal
      rentabilidadeScore:
        roeNum > 25 ? '95' : roeNum > 20 ? '90' : roeNum > 15 ? '80' : roeNum > 10 ? '65' : '45',

      // Score de Eficiência Adaptável
      eficienciaScore: financialType.isBanco
        ? eficienciaNum > 0 && eficienciaNum < 45
          ? '90'
          : eficienciaNum < 55
            ? '75'
            : eficienciaNum < 70
              ? '60'
              : '40'
        : eficienciaNum > 0 && eficienciaNum < 35
          ? '95'
          : eficienciaNum < 45
            ? '85'
            : eficienciaNum < 55
              ? '70'
              : '50',

      // Score de Solidez Universal
      solidezScore: financialType.isBanco
        ? basileiaNum > 14 && roeNum > 15
          ? '95'
          : basileiaNum > 11 && roeNum > 12
            ? '85'
            : basileiaNum > 8
              ? '70'
              : '50'
        : roeNum > 25 && liquidezNum > 1
          ? '95'
          : roeNum > 15 && liquidezNum > 0.8
            ? '85'
            : roeNum > 10
              ? '70'
              : '55',

      // Score de Qualidade de Ativos
      qualidadeAtivos: financialType.isBanco
        ? inadimplenciaNum > 0 && inadimplenciaNum < 2 && coberturaNum > 120
          ? '95'
          : inadimplenciaNum < 3.5 && coberturaNum > 100
            ? '80'
            : inadimplenciaNum < 5
              ? '65'
              : '45'
        : roeNum > 20 && liquidezNum > 1
          ? '90'
          : roeNum > 15
            ? '80'
            : '70',
    }
  }

  const calculatedMetrics = calculateUniversalMetrics()

  // ✅ Build complementares universal
  const baseComplementares = buildFinancialComplementares(props)
  const complementares = {
    ...baseComplementares,
    rentabilidadeScore: parseFloat(calculatedMetrics.rentabilidadeScore),
    eficienciaScore: parseFloat(calculatedMetrics.eficienciaScore),
    solidezScore: parseFloat(calculatedMetrics.solidezScore),
    qualidadeAtivos: parseFloat(calculatedMetrics.qualidadeAtivos),
  }

  const categorias: Record<string, Categoria[]> = {
    // 🏦 CATEGORIA UNIVERSAL - Rentabilidade (todos)
    'Rentabilidade e Performance': [
      {
        label: 'ROE',
        chave: 'roe',
        valor: props.roe,
        anterior: props.roeAnoAnterior,
        icon: '📈',
        description: 'Retorno sobre Patrimônio Líquido',
      },
      ...(props.roa && props.roa !== 'N/A'
        ? [
            {
              label: 'ROA',
              chave: 'roa',
              valor: props.roa,
              anterior: props.roaAnoAnterior,
              icon: '🎯',
              description: 'Retorno sobre Ativos',
            },
          ]
        : []),
      ...(props.nim && props.nim !== 'N/A' && parseFloat(props.nim) > 0
        ? [
            {
              label: financialType.isBanco ? 'NIM' : 'Margem Financeira',
              chave: 'nim',
              valor: props.nim,
              anterior: props.nimAnoAnterior,
              icon: '💰',
              description: financialType.isBanco
                ? 'Margem Financeira Líquida'
                : 'Margem Financeira (proxy)',
            },
          ]
        : []),
      ...(props.eficiencia && props.eficiencia !== 'N/A' && parseFloat(props.eficiencia) > 0
        ? [
            {
              label: 'Eficiência Operacional',
              chave: 'eficiencia',
              valor: props.eficiencia,
              anterior: props.eficienciaAnoAnterior,
              icon: '⚙️',
              description: 'Índice de Eficiência (quanto menor, melhor)',
            },
          ]
        : []),
      {
        label: 'Score de Rentabilidade',
        chave: 'rentabilidadeScore',
        valor: calculatedMetrics.rentabilidadeScore,
        icon: '🏆',
        description: 'Score geral de rentabilidade',
      },
    ],

    // 🛡️ CATEGORIA CONDICIONAL - Solidez (bancos e seguradoras)
    ...(financialType.isBanco
      ? {
          'Solidez e Capitalização': [
            ...(props.basileia && props.basileia !== 'N/A' && parseFloat(props.basileia) > 0
              ? [
                  {
                    label: 'Basileia',
                    chave: 'basileia',
                    valor: props.basileia,
                    anterior: props.basileiaAnoAnterior,
                    icon: '🏛️',
                    description: 'Índice de Basileia',
                  },
                ]
              : []),
            ...(props.tier1 && props.tier1 !== 'N/A' && parseFloat(props.tier1) > 0
              ? [
                  {
                    label: 'Tier 1',
                    chave: 'tier1',
                    valor: props.tier1,
                    anterior: props.tier1AnoAnterior,
                    icon: '🛡️',
                    description: 'Capital Principal',
                  },
                ]
              : []),
            {
              label: 'Score de Solidez',
              chave: 'solidezScore',
              valor: calculatedMetrics.solidezScore,
              icon: '🏛️',
              description: 'Score de solidez patrimonial',
            },
          ],
        }
      : {}),

    // ⚖️ CATEGORIA UNIVERSAL - Estrutura de Capital
    'Estrutura de Capital e Liquidez': [
      {
        label: 'Liquidez',
        chave: 'liquidez',
        valor: props.liquidez,
        anterior: props.liquidezAnoAnterior,
        icon: '💧',
        description: 'Liquidez Corrente',
      },
      ...(props.alavancagem && props.alavancagem !== 'N/A' && parseFloat(props.alavancagem) > 0
        ? [
            {
              label: 'Alavancagem',
              chave: 'alavancagem',
              valor: props.alavancagem,
              anterior: props.alavancagemAnoAnterior,
              icon: '⚖️',
              description: 'Índice de Alavancagem',
            },
          ]
        : []),
      {
        label: 'Beta',
        chave: 'beta',
        valor: props.beta,
        anterior: props.betaAnoAnterior,
        icon: '📉',
        description: 'Volatilidade vs. mercado',
      },
    ],

    // ⚠️ CATEGORIA CONDICIONAL - Risco (bancos principalmente)
    ...(financialType.isBanco
      ? {
          'Gestão de Risco': [
            ...(props.inadimplencia &&
            props.inadimplencia !== 'N/A' &&
            parseFloat(props.inadimplencia) > 0
              ? [
                  {
                    label: 'Inadimplência',
                    chave: 'inadimplencia',
                    valor: props.inadimplencia,
                    anterior: props.inadimplenciaAnoAnterior,
                    icon: '⚠️',
                    description: 'Taxa de Inadimplência',
                  },
                ]
              : []),
            ...(props.cobertura && props.cobertura !== 'N/A' && parseFloat(props.cobertura) > 0
              ? [
                  {
                    label: 'Cobertura',
                    chave: 'cobertura',
                    valor: props.cobertura,
                    anterior: props.coberturaAnoAnterior,
                    icon: '🛡️',
                    description: 'Cobertura de Provisões',
                  },
                ]
              : []),
            ...(props.custoCredito && props.custoCredito !== 'N/A'
              ? [
                  {
                    label: 'Custo do Crédito',
                    chave: 'custoCredito',
                    valor: props.custoCredito,
                    anterior: props.custoCreditoAnoAnterior,
                    icon: '💸',
                    description: 'Custo do Risco de Crédito',
                  },
                ]
              : []),
            {
              label: 'Qualidade de Ativos',
              chave: 'qualidadeAtivos',
              valor: calculatedMetrics.qualidadeAtivos,
              icon: '🏅',
              description: 'Score de qualidade da carteira',
            },
          ],
        }
      : {}),

    // 💲 CATEGORIA UNIVERSAL - Avaliação
    'Múltiplos e Avaliação': [
      {
        label: 'P/L',
        chave: 'pl',
        valor: props.pl,
        anterior: props.plAnoAnterior,
        icon: '💲',
        description: 'Preço sobre Lucro',
      },
      ...(props.pvpa && props.pvpa !== 'N/A' && parseFloat(props.pvpa) > 0
        ? [
            {
              label: financialType.isBanco ? 'P/VPA' : 'P/S (proxy)',
              chave: 'pvpa',
              valor: props.pvpa,
              anterior: props.pvpaAnoAnterior,
              icon: financialType.isBanco ? '🏦' : '📊',
              description: financialType.isBanco
                ? 'Preço sobre Valor Patrimonial'
                : 'Múltiplo de receita (proxy P/VPA)',
            },
          ]
        : []),
      ...(props.leveredDcf && props.leveredDcf !== 'N/A' && parseFloat(props.leveredDcf) > 0
        ? [
            {
              label: 'Valuation (DCF)',
              chave: 'leveredDcf',
              valor: props.leveredDcf,
              anterior: props.leveredDcfAnoAnterior,
              icon: '📊',
              description: 'Fluxo de Caixa Descontado',
            },
          ]
        : []),
    ],

    // 💰 CATEGORIA UNIVERSAL - Dividendos
    'Dividendos e Distribuição': [
      ...(props.dividendYield &&
      props.dividendYield !== 'N/A' &&
      parseFloat(props.dividendYield) > 0
        ? [
            {
              label: 'Dividend Yield',
              chave: 'dividendYield',
              valor: props.dividendYield,
              anterior: props.dividendYieldAnoAnterior,
              icon: '💰',
              description: 'Rendimento de Dividendos',
            },
          ]
        : []),
      {
        label: 'Payout Ratio',
        chave: 'payoutRatio',
        valor: props.payoutRatio,
        anterior: props.payoutRatioAnoAnterior,
        icon: '💸',
        description: '% dos lucros distribuídos',
      },
    ],

    // 🔄 CATEGORIA CONDICIONAL - Métricas Específicas
    ...(props.ldr || props.crescimentoCarteira || props.eficiencia
      ? {
          'Métricas Operacionais': [
            ...(props.ldr && props.ldr !== 'N/A' && parseFloat(props.ldr) > 0
              ? [
                  {
                    label: 'LDR',
                    chave: 'ldr',
                    valor: props.ldr,
                    anterior: props.ldrAnoAnterior,
                    icon: '🔄',
                    description: 'Loan-to-Deposit Ratio',
                  },
                ]
              : []),
            ...(props.crescimentoCarteira && props.crescimentoCarteira !== 'N/A'
              ? [
                  {
                    label: financialType.isBanco ? 'Crescimento Carteira' : 'Crescimento Receita',
                    chave: 'crescimentoCarteira',
                    valor: props.crescimentoCarteira,
                    anterior: props.crescimentoCarteiraAnoAnterior,
                    icon: '📈',
                    description: financialType.isBanco
                      ? 'Crescimento da carteira de crédito'
                      : 'Crescimento da receita (proxy)',
                  },
                ]
              : []),
            {
              label: 'Score de Eficiência',
              chave: 'eficienciaScore',
              valor: calculatedMetrics.eficienciaScore,
              icon: '⚙️',
              description: 'Score de eficiência operacional',
            },
          ],
        }
      : {}),
  }

  // ✅ FORMATAÇÃO UNIVERSAL
  const formatValue = (valor: string, chave: string) => {
    const num = parseFloat(valor)
    if (isNaN(num)) return valor

    // Percentuais
    if (
      [
        'roe',
        'roa',
        'eficiencia',
        'nim',
        'basileia',
        'tier1',
        'inadimplencia',
        'cobertura',
        'dividendYield',
        'payoutRatio',
        'ldr',
        'custoCredito',
        'crescimentoCarteira',
        'rentabilidadeScore',
        'eficienciaScore',
        'solidezScore',
        'qualidadeAtivos',
      ].includes(chave)
    ) {
      return `${num.toFixed(2)}%`
    }

    // Valores monetários
    if (['leveredDcf', 'precoAtual'].includes(chave)) {
      return `${num.toFixed(2)}`
    }

    // Ratios
    return num.toFixed(2)
  }

  return (
    <div className="mt-6 space-y-8">
      {Object.entries(categorias).map(([categoria, indicadores]) => {
        // Filtrar indicadores válidos
        const indicadoresValidos = indicadores.filter(({ label, valor, anterior }) => {
          const numeric = parseFloat(valor)
          if (isNaN(numeric) || numeric === 0) return false

          const prev = anterior ? parseFloat(anterior) : undefined

          const { apenasInformativo } = avaliarIndicadorComContexto(
            'Financial Services',
            label,
            numeric,
            {
              valorAnterior: prev,
              complementares,
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
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
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

                  const { score, explicacaoCustom } = avaliarIndicadorComContexto(
                    'Financial Services',
                    label,
                    numeric,
                    {
                      valorAnterior: prev,
                      complementares,
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
