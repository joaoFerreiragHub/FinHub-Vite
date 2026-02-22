import { CategoriasLayout } from './CategoriasLayout'
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
  // âœ… UNIVERSAL: Detectar tipo de instituiÃ§Ã£o financeira
  const detectFinancialType = () => {
    const hasBasileia = props.basileia && parseFloat(props.basileia) > 0
    const hasNIM = props.nim && parseFloat(props.nim) > 0 && props.nim !== 'N/A'
    const hasInadimplencia =
      props.inadimplencia && parseFloat(props.inadimplencia) > 0 && props.inadimplencia !== 'N/A'
    const roeNum = parseFloat(props.roe || '0')

    return {
      isBanco: hasBasileia || hasNIM || hasInadimplencia,
      isPaymentProcessor: !hasBasileia && !hasNIM && roeNum > 30,
      isFintech: true, // Todos podem usar mÃ©tricas bÃ¡sicas
    }
  }

  const financialType = detectFinancialType()

  // âœ… UNIVERSAL: MÃ©tricas calculadas adaptÃ¡veis
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

      // Score de EficiÃªncia AdaptÃ¡vel
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

  // âœ… Build complementares universal
  const baseComplementares = buildFinancialComplementares(props)
  const complementares = {
    ...baseComplementares,
    rentabilidadeScore: parseFloat(calculatedMetrics.rentabilidadeScore),
    eficienciaScore: parseFloat(calculatedMetrics.eficienciaScore),
    solidezScore: parseFloat(calculatedMetrics.solidezScore),
    qualidadeAtivos: parseFloat(calculatedMetrics.qualidadeAtivos),
  }

  const categorias: Record<string, Categoria[]> = {
    // ðŸ¦ CATEGORIA UNIVERSAL - Rentabilidade (todos)
    'Rentabilidade e Performance': [
      {
        label: 'ROE',
        chave: 'roe',
        valor: props.roe,
        anterior: props.roeAnoAnterior,
        icon: 'ðŸ“ˆ',
        description: 'Retorno sobre PatrimÃ´nio LÃ­quido',
      },
      ...(props.roa && props.roa !== 'N/A'
        ? [
            {
              label: 'ROA',
              chave: 'roa',
              valor: props.roa,
              anterior: props.roaAnoAnterior,
              icon: 'ðŸŽ¯',
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
              icon: 'ðŸ’°',
              description: financialType.isBanco
                ? 'Margem Financeira LÃ­quida'
                : 'Margem Financeira (proxy)',
            },
          ]
        : []),
      ...(props.eficiencia && props.eficiencia !== 'N/A' && parseFloat(props.eficiencia) > 0
        ? [
            {
              label: 'EficiÃªncia Operacional',
              chave: 'eficiencia',
              valor: props.eficiencia,
              anterior: props.eficienciaAnoAnterior,
              icon: 'âš™ï¸',
              description: 'Ãndice de EficiÃªncia (quanto menor, melhor)',
            },
          ]
        : []),
      {
        label: 'Score de Rentabilidade',
        chave: 'rentabilidadeScore',
        valor: calculatedMetrics.rentabilidadeScore,
        icon: 'ðŸ†',
        description: 'Score geral de rentabilidade',
      },
    ],

    // ðŸ›¡ï¸ CATEGORIA CONDICIONAL - Solidez (bancos e seguradoras)
    ...(financialType.isBanco
      ? {
          'Solidez e CapitalizaÃ§Ã£o': [
            ...(props.basileia && props.basileia !== 'N/A' && parseFloat(props.basileia) > 0
              ? [
                  {
                    label: 'Basileia',
                    chave: 'basileia',
                    valor: props.basileia,
                    anterior: props.basileiaAnoAnterior,
                    icon: 'ðŸ›ï¸',
                    description: 'Ãndice de Basileia',
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
                    icon: 'ðŸ›¡ï¸',
                    description: 'Capital Principal',
                  },
                ]
              : []),
            {
              label: 'Score de Solidez',
              chave: 'solidezScore',
              valor: calculatedMetrics.solidezScore,
              icon: 'ðŸ›ï¸',
              description: 'Score de solidez patrimonial',
            },
          ],
        }
      : {}),

    // âš–ï¸ CATEGORIA UNIVERSAL - Estrutura de Capital
    'Estrutura de Capital e Liquidez': [
      {
        label: 'Liquidez',
        chave: 'liquidez',
        valor: props.liquidez,
        anterior: props.liquidezAnoAnterior,
        icon: 'ðŸ’§',
        description: 'Liquidez Corrente',
      },
      ...(props.alavancagem && props.alavancagem !== 'N/A' && parseFloat(props.alavancagem) > 0
        ? [
            {
              label: 'Alavancagem',
              chave: 'alavancagem',
              valor: props.alavancagem,
              anterior: props.alavancagemAnoAnterior,
              icon: 'âš–ï¸',
              description: 'Ãndice de Alavancagem',
            },
          ]
        : []),
      {
        label: 'Beta',
        chave: 'beta',
        valor: props.beta,
        anterior: props.betaAnoAnterior,
        icon: 'ðŸ“‰',
        description: 'Volatilidade vs. mercado',
      },
    ],

    // Categoria condicional - risco (bancos principalmente)
    ...(financialType.isBanco
      ? {
          'GestÃ£o de Risco': [
            ...(props.inadimplencia &&
            props.inadimplencia !== 'N/A' &&
            parseFloat(props.inadimplencia) > 0
              ? [
                  {
                    label: 'InadimplÃªncia',
                    chave: 'inadimplencia',
                    valor: props.inadimplencia,
                    anterior: props.inadimplenciaAnoAnterior,
                    icon: 'âš ï¸',
                    description: 'Taxa de InadimplÃªncia',
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
                    icon: 'ðŸ›¡ï¸',
                    description: 'Cobertura de ProvisÃµes',
                  },
                ]
              : []),
            ...(props.custoCredito && props.custoCredito !== 'N/A'
              ? [
                  {
                    label: 'Custo do CrÃ©dito',
                    chave: 'custoCredito',
                    valor: props.custoCredito,
                    anterior: props.custoCreditoAnoAnterior,
                    icon: 'ðŸ’¸',
                    description: 'Custo do Risco de CrÃ©dito',
                  },
                ]
              : []),
            {
              label: 'Qualidade de Ativos',
              chave: 'qualidadeAtivos',
              valor: calculatedMetrics.qualidadeAtivos,
              icon: 'ðŸ…',
              description: 'Score de qualidade da carteira',
            },
          ],
        }
      : {}),

    // ðŸ’² CATEGORIA UNIVERSAL - AvaliaÃ§Ã£o
    'MÃºltiplos e AvaliaÃ§Ã£o': [
      {
        label: 'P/L',
        chave: 'pl',
        valor: props.pl,
        anterior: props.plAnoAnterior,
        icon: 'ðŸ’²',
        description: 'PreÃ§o sobre Lucro',
      },
      ...(props.pvpa && props.pvpa !== 'N/A' && parseFloat(props.pvpa) > 0
        ? [
            {
              label: financialType.isBanco ? 'P/VPA' : 'P/S (proxy)',
              chave: 'pvpa',
              valor: props.pvpa,
              anterior: props.pvpaAnoAnterior,
              icon: financialType.isBanco ? 'ðŸ¦' : 'ðŸ“Š',
              description: financialType.isBanco
                ? 'PreÃ§o sobre Valor Patrimonial'
                : 'MÃºltiplo de receita (proxy P/VPA)',
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
              icon: 'ðŸ“Š',
              description: 'Fluxo de Caixa Descontado',
            },
          ]
        : []),
    ],

    // ðŸ’° CATEGORIA UNIVERSAL - Dividendos
    'Dividendos e DistribuiÃ§Ã£o': [
      ...(props.dividendYield &&
      props.dividendYield !== 'N/A' &&
      parseFloat(props.dividendYield) > 0
        ? [
            {
              label: 'Dividend Yield',
              chave: 'dividendYield',
              valor: props.dividendYield,
              anterior: props.dividendYieldAnoAnterior,
              icon: 'ðŸ’°',
              description: 'Rendimento de Dividendos',
            },
          ]
        : []),
      {
        label: 'Payout Ratio',
        chave: 'payoutRatio',
        valor: props.payoutRatio,
        anterior: props.payoutRatioAnoAnterior,
        icon: 'ðŸ’¸',
        description: '% dos lucros distribuÃ­dos',
      },
    ],

    // ðŸ”„ CATEGORIA CONDICIONAL - MÃ©tricas EspecÃ­ficas
    ...(props.ldr || props.crescimentoCarteira || props.eficiencia
      ? {
          'MÃ©tricas Operacionais': [
            ...(props.ldr && props.ldr !== 'N/A' && parseFloat(props.ldr) > 0
              ? [
                  {
                    label: 'LDR',
                    chave: 'ldr',
                    valor: props.ldr,
                    anterior: props.ldrAnoAnterior,
                    icon: 'ðŸ”„',
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
                    icon: 'ðŸ“ˆ',
                    description: financialType.isBanco
                      ? 'Crescimento da carteira de crÃ©dito'
                      : 'Crescimento da receita (proxy)',
                  },
                ]
              : []),
            {
              label: 'Score de EficiÃªncia',
              chave: 'eficienciaScore',
              valor: calculatedMetrics.eficienciaScore,
              icon: 'âš™ï¸',
              description: 'Score de eficiÃªncia operacional',
            },
          ],
        }
      : {}),
  }

  // âœ… FORMATAÃ‡ÃƒO UNIVERSAL
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

    // Valores monetÃ¡rios
    if (['leveredDcf', 'precoAtual'].includes(chave)) {
      return `${num.toFixed(2)}`
    }

    // Ratios
    return num.toFixed(2)
  }

  return (
    <CategoriasLayout
      categorias={categorias}
      setor="Financial Services"
      formatValue={formatValue}
      complementares={complementares}
    />
  )
}
