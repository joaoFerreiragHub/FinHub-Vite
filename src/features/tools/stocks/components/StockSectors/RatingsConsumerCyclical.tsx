import { CategoriasLayout } from './CategoriasLayout'
import {
  buildConsumerCyclicalComplementares,
  RatingsConsumerCyclicalProps,
} from '@/features/tools/stocks/utils/complementares/consumerCyclicalComplementares'

interface Categoria {
  label: string
  chave: string
  valor: string
  anterior?: string
  icon?: string
  description?: string
}

export function RatingsConsumerCyclical(props: RatingsConsumerCyclicalProps) {
  // Calcular mÃ©tricas especÃ­ficas de consumer cyclical
  const calculateConsumerCyclicalMetrics = () => {
    const roeNum = parseFloat(props.roe) || 0
    const grossMarginNum = parseFloat(props.grossMargin) || 0
    const rotatividadeEstoquesNum = parseFloat(props.rotatividadeEstoques) || 0
    const betaNum = parseFloat(props.beta) || 0
    const receitaCagr3yNum = parseFloat(props.receitaCagr3y) || 0
    const endividamentoNum = parseFloat(props.endividamento) || 0

    return {
      // Score de Sensibilidade CÃ­clica
      sensibilidadeCiclica:
        betaNum > 1.2 && receitaCagr3yNum > 8
          ? '90'
          : betaNum > 1 && receitaCagr3yNum > 5
            ? '75'
            : '50',

      // Score de EficiÃªncia Operacional
      eficienciaOperacional:
        rotatividadeEstoquesNum > 6 && grossMarginNum > 30
          ? '85'
          : rotatividadeEstoquesNum > 3 && grossMarginNum > 25
            ? '70'
            : '45',

      // Score de ResiliÃªncia Financeira
      resilienciaFinanceira:
        endividamentoNum < 2 && roeNum > 15
          ? '95'
          : endividamentoNum < 3 && roeNum > 12
            ? '80'
            : '60',
    }
  }

  const calculatedMetrics = calculateConsumerCyclicalMetrics()

  // âœ… NOVO: Usar build function (como Technology e Energy)
  const baseComplementares = buildConsumerCyclicalComplementares(props)

  // âœ… NOVO: Combinar com mÃ©tricas calculadas
  const complementares = {
    ...baseComplementares,
    // Adicionar mÃ©tricas calculadas
    sensibilidadeCiclica: parseFloat(calculatedMetrics.sensibilidadeCiclica || '0'),
    eficienciaOperacional: parseFloat(calculatedMetrics.eficienciaOperacional || '0'),
    resilienciaFinanceira: parseFloat(calculatedMetrics.resilienciaFinanceira || '0'),
  }

  const categorias: Record<string, Categoria[]> = {
    'Rentabilidade e Retorno': [
      {
        label: 'P/L',
        chave: 'pe',
        valor: props.pe,
        anterior: props.peAnoAnterior,
        icon: 'ðŸ’²',
        description: 'PreÃ§o sobre Lucro',
      },
      {
        label: 'P/S',
        chave: 'ps',
        valor: props.ps,
        anterior: props.psAnoAnterior,
        icon: 'ðŸ“Š',
        description: 'PreÃ§o sobre Vendas',
      },
      {
        label: 'P/VPA',
        chave: 'pb',
        valor: props.pb,
        anterior: props.pbAnoAnterior,
        icon: 'ðŸ“š',
        description: 'PreÃ§o sobre Valor Patrimonial',
      },
      {
        label: 'ROE',
        chave: 'roe',
        valor: props.roe,
        anterior: props.roeAnoAnterior,
        icon: 'ðŸ“ˆ',
        description: 'Retorno sobre PatrimÃ´nio LÃ­quido',
      },
      {
        label: 'ROIC',
        chave: 'roic',
        valor: props.roic,
        anterior: props.roicAnoAnterior,
        icon: 'ðŸŽ¯',
        description: 'Retorno sobre Capital Investido',
      },
    ],

    'Margens e EficiÃªncia': [
      {
        label: 'Margem Bruta',
        chave: 'grossMargin',
        valor: props.grossMargin,
        anterior: props.grossMarginAnoAnterior,
        icon: 'ðŸ’°',
        description: 'Margem Bruta',
      },
      {
        label: 'Margem EBITDA',
        chave: 'ebitdaMargin',
        valor: props.ebitdaMargin,
        anterior: props.ebitdaMarginAnoAnterior,
        icon: 'ðŸ“Š',
        description: 'Margem EBITDA',
      },
      {
        label: 'Margem LÃ­quida',
        chave: 'margemLiquida',
        valor: props.margemLiquida,
        anterior: props.margemLiquidaAnoAnterior,
        icon: 'ðŸŽ¯',
        description: 'Margem LÃ­quida',
      },
      {
        label: 'Margem Operacional',
        chave: 'margemOperacional',
        valor: props.margemOperacional,
        anterior: props.margemOperacionalAnoAnterior,
        icon: 'âš™ï¸',
        description: 'Margem Operacional',
      },
    ],

    'Crescimento e Performance': [
      {
        label: 'Crescimento da Receita',
        chave: 'receitaCagr3y',
        valor: props.receitaCagr3y,
        anterior: props.receitaCagr3yAnoAnterior,
        icon: 'ðŸ“ˆ',
        description: 'CAGR de 3 anos da Receita',
      },
      {
        label: 'Crescimento Receita',
        chave: 'crescimentoReceita',
        valor: props.crescimentoReceita,
        anterior: props.crescimentoReceitaAnoAnterior,
        icon: 'ðŸ“Š',
        description: 'Crescimento Anual da Receita',
      },
      {
        label: 'Crescimento EBITDA',
        chave: 'crescimentoEbitda',
        valor: props.crescimentoEbitda,
        anterior: props.crescimentoEbitdaAnoAnterior,
        icon: 'ðŸ“ˆ',
        description: 'Crescimento do EBITDA',
      },
    ],

    'Estrutura de Capital e SolvÃªncia': [
      {
        label: 'Endividamento',
        chave: 'endividamento',
        valor: props.endividamento,
        anterior: props.endividamentoAnoAnterior,
        icon: 'âš–ï¸',
        description: 'DÃ­vida/EBITDA',
      },
      {
        label: 'Cobertura de Juros',
        chave: 'coberturaJuros',
        valor: props.coberturaJuros,
        anterior: props.coberturaJurosAnoAnterior,
        icon: 'ðŸ›¡ï¸',
        description: 'Capacidade de Pagamento de Juros',
      },
      {
        label: 'Liquidez Corrente',
        chave: 'liquidezCorrente',
        valor: props.liquidezCorrente,
        anterior: props.liquidezCorrenteAnoAnterior,
        icon: 'ðŸ’§',
        description: 'Liquidez de Curto Prazo',
      },
      {
        label: 'DÃ­vida/PatrimÃ´nio',
        chave: 'debtEquity',
        valor: props.debtEquity,
        anterior: props.debtEquityAnoAnterior,
        icon: 'ðŸ“Š',
        description: 'Alavancagem Financeira',
      },
    ],

    'EficiÃªncia Operacional': [
      {
        label: 'Rotatividade de Estoques',
        chave: 'rotatividadeEstoques',
        valor: props.rotatividadeEstoques,
        anterior: props.rotatividadeEstoquesAnoAnterior,
        icon: 'ðŸ“¦',
        description: 'Giro de InventÃ¡rio',
      },
      {
        label: 'Working Capital Turnover',
        chave: 'workingCapitalTurnover',
        valor: props.workingCapitalTurnover,
        anterior: props.workingCapitalTurnoverAnoAnterior,
        icon: 'ðŸ”„',
        description: 'EficiÃªncia do Capital de Giro',
      },
      {
        label: 'Asset Turnover',
        chave: 'assetTurnover',
        valor: props.assetTurnover,
        anterior: props.assetTurnoverAnoAnterior,
        icon: 'ðŸ­',
        description: 'Giro de Ativos',
      },
      {
        label: 'Receivables Turnover',
        chave: 'receivablesTurnover',
        valor: props.receivablesTurnover,
        anterior: props.receivablesTurnoverAnoAnterior,
        icon: 'ðŸ’³',
        description: 'Giro de RecebÃ­veis',
      },
    ],

    'Fluxo de Caixa': [
      {
        label: 'Free Cash Flow',
        chave: 'freeCashFlow',
        valor: props.freeCashFlow,
        anterior: props.freeCashFlowAnoAnterior,
        icon: 'ðŸ’¸',
        description: 'Fluxo de Caixa Livre',
      },
      {
        label: 'FCF Yield',
        chave: 'fcfYield',
        valor: props.fcfYield,
        anterior: props.fcfYieldAnoAnterior,
        icon: 'ðŸ’°',
        description: 'Rendimento do Fluxo de Caixa',
      },
      {
        label: 'CapEx/Receita',
        chave: 'capexRevenue',
        valor: props.capexRevenue,
        anterior: props.capexRevenueAnoAnterior,
        icon: 'ðŸ—ï¸',
        description: 'Intensidade de Investimentos',
      },
    ],

    'Dividendos e Retorno': [
      {
        label: 'Dividend Yield',
        chave: 'dividendYield',
        valor: props.dividendYield,
        anterior: props.dividendYieldAnoAnterior,
        icon: 'ðŸ’Ž',
        description: 'Rendimento de Dividendos',
      },
      {
        label: 'Payout Ratio',
        chave: 'payoutRatio',
        valor: props.payoutRatio,
        anterior: props.payoutRatioAnoAnterior,
        icon: 'ðŸ“¤',
        description: '% dos lucros distribuÃ­dos',
      },
    ],

    'Volatilidade e AvaliaÃ§Ã£o': [
      {
        label: 'Beta',
        chave: 'beta',
        valor: props.beta,
        anterior: props.betaAnoAnterior,
        icon: 'ðŸ“‰',
        description: 'Volatilidade vs. mercado',
      },
      {
        label: 'Valuation (DCF)',
        chave: 'leveredDcf',
        valor: props.leveredDcf,
        anterior: props.leveredDcfAnoAnterior,
        icon: 'ðŸ“Š',
        description: 'Fluxo de Caixa Descontado',
      },
    ],

    'MÃ©tricas EspecÃ­ficas de Consumer Cyclical': [
      ...(props.seasonalityIndex
        ? [
            {
              label: 'Sazonalidade',
              chave: 'seasonalityIndex',
              valor: props.seasonalityIndex,
              anterior: props.seasonalityIndexAnoAnterior,
              icon: 'ðŸŒŠ',
              description: 'Ãndice de Sazonalidade',
            },
          ]
        : []),
      ...(props.consumerConfidence
        ? [
            {
              label: 'ConfianÃ§a do Consumidor',
              chave: 'consumerConfidence',
              valor: props.consumerConfidence,
              anterior: props.consumerConfidenceAnoAnterior,
              icon: 'ðŸ˜Š',
              description: 'CorrelaÃ§Ã£o com ConfianÃ§a do Consumidor',
            },
          ]
        : []),
      ...(props.marketShare
        ? [
            {
              label: 'Market Share',
              chave: 'marketShare',
              valor: props.marketShare,
              anterior: props.marketShareAnoAnterior,
              icon: 'ðŸŽ¯',
              description: 'ParticipaÃ§Ã£o de Mercado',
            },
          ]
        : []),
      {
        label: 'Sensibilidade CÃ­clica',
        chave: 'sensibilidadeCiclica',
        valor: calculatedMetrics.sensibilidadeCiclica,
        icon: 'ðŸ”„',
        description: 'Score de sensibilidade a ciclos econÃ´micos',
      },
      {
        label: 'EficiÃªncia Operacional',
        chave: 'eficienciaOperacional',
        valor: calculatedMetrics.eficienciaOperacional,
        icon: 'âš™ï¸',
        description: 'Score de eficiÃªncia operacional',
      },
      {
        label: 'ResiliÃªncia Financeira',
        chave: 'resilienciaFinanceira',
        valor: calculatedMetrics.resilienciaFinanceira,
        icon: 'ðŸ›¡ï¸',
        description: 'Score de resiliÃªncia em downturns',
      },
    ],
  }

  // FormataÃ§Ã£o adequada para consumer cyclical
  const formatValue = (valor: string, chave: string) => {
    const num = parseFloat(valor)
    if (isNaN(num)) return valor

    // Percentuais
    if (
      [
        'roe',
        'roic',
        'grossMargin',
        'ebitdaMargin',
        'margemLiquida',
        'margemOperacional',
        'receitaCagr3y',
        'crescimentoReceita',
        'crescimentoEbitda',
        'dividendYield',
        'payoutRatio',
        'fcfYield',
        'capexRevenue',
        'marketShare',
        'sensibilidadeCiclica',
        'eficienciaOperacional',
        'resilienciaFinanceira',
      ].includes(chave)
    ) {
      return `${num.toFixed(2)}%`
    }

    // Valores monetÃ¡rios (DCF, FCF)
    if (['leveredDcf', 'precoAtual', 'freeCashFlow'].includes(chave)) {
      return `${num.toFixed(2)}`
    }

    // Ratios de giro e turnover
    if (
      [
        'rotatividadeEstoques',
        'workingCapitalTurnover',
        'assetTurnover',
        'receivablesTurnover',
      ].includes(chave)
    ) {
      return `${num.toFixed(2)}x`
    }

    // Ãndices especiais
    if (['seasonalityIndex', 'consumerConfidence'].includes(chave)) {
      return `${num.toFixed(1)}`
    }

    // Ratios gerais
    return num.toFixed(2)
  }

  return (
    <CategoriasLayout
      categorias={categorias}
      setor="Consumer Cyclical"
      formatValue={formatValue}
      complementares={complementares}
    />
  )
}
