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
  // Calcular métricas específicas de consumer cyclical
  const calculateConsumerCyclicalMetrics = () => {
    const roeNum = parseFloat(props.roe) || 0
    const grossMarginNum = parseFloat(props.grossMargin) || 0
    const rotatividadeEstoquesNum = parseFloat(props.rotatividadeEstoques) || 0
    const betaNum = parseFloat(props.beta) || 0
    const receitaCagr3yNum = parseFloat(props.receitaCagr3y) || 0
    const endividamentoNum = parseFloat(props.endividamento) || 0

    return {
      // Score de Sensibilidade Cíclica
      sensibilidadeCiclica:
        betaNum > 1.2 && receitaCagr3yNum > 8
          ? '90'
          : betaNum > 1 && receitaCagr3yNum > 5
            ? '75'
            : '50',

      // Score de Eficiência Operacional
      eficienciaOperacional:
        rotatividadeEstoquesNum > 6 && grossMarginNum > 30
          ? '85'
          : rotatividadeEstoquesNum > 3 && grossMarginNum > 25
            ? '70'
            : '45',

      // Score de Resiliência Financeira
      resilienciaFinanceira:
        endividamentoNum < 2 && roeNum > 15
          ? '95'
          : endividamentoNum < 3 && roeNum > 12
            ? '80'
            : '60',
    }
  }

  const calculatedMetrics = calculateConsumerCyclicalMetrics()

  // ✅ NOVO: Usar build function (como Technology e Energy)
  const baseComplementares = buildConsumerCyclicalComplementares(props)

  // ✅ NOVO: Combinar com métricas calculadas
  const complementares = {
    ...baseComplementares,
    // Adicionar métricas calculadas
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
        icon: '💲',
        description: 'Preço sobre Lucro',
      },
      {
        label: 'P/S',
        chave: 'ps',
        valor: props.ps,
        anterior: props.psAnoAnterior,
        icon: '📊',
        description: 'Preço sobre Vendas',
      },
      {
        label: 'P/VPA',
        chave: 'pb',
        valor: props.pb,
        anterior: props.pbAnoAnterior,
        icon: '📚',
        description: 'Preço sobre Valor Patrimonial',
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
        label: 'Margem Bruta',
        chave: 'grossMargin',
        valor: props.grossMargin,
        anterior: props.grossMarginAnoAnterior,
        icon: '💰',
        description: 'Margem Bruta',
      },
      {
        label: 'Margem EBITDA',
        chave: 'ebitdaMargin',
        valor: props.ebitdaMargin,
        anterior: props.ebitdaMarginAnoAnterior,
        icon: '📊',
        description: 'Margem EBITDA',
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

    'Crescimento e Performance': [
      {
        label: 'Crescimento da Receita',
        chave: 'receitaCagr3y',
        valor: props.receitaCagr3y,
        anterior: props.receitaCagr3yAnoAnterior,
        icon: '📈',
        description: 'CAGR de 3 anos da Receita',
      },
      {
        label: 'Crescimento Receita',
        chave: 'crescimentoReceita',
        valor: props.crescimentoReceita,
        anterior: props.crescimentoReceitaAnoAnterior,
        icon: '📊',
        description: 'Crescimento Anual da Receita',
      },
      {
        label: 'Crescimento EBITDA',
        chave: 'crescimentoEbitda',
        valor: props.crescimentoEbitda,
        anterior: props.crescimentoEbitdaAnoAnterior,
        icon: '📈',
        description: 'Crescimento do EBITDA',
      },
    ],

    'Estrutura de Capital e Solvência': [
      {
        label: 'Endividamento',
        chave: 'endividamento',
        valor: props.endividamento,
        anterior: props.endividamentoAnoAnterior,
        icon: '⚖️',
        description: 'Dívida/EBITDA',
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

    'Eficiência Operacional': [
      {
        label: 'Rotatividade de Estoques',
        chave: 'rotatividadeEstoques',
        valor: props.rotatividadeEstoques,
        anterior: props.rotatividadeEstoquesAnoAnterior,
        icon: '📦',
        description: 'Giro de Inventário',
      },
      {
        label: 'Working Capital Turnover',
        chave: 'workingCapitalTurnover',
        valor: props.workingCapitalTurnover,
        anterior: props.workingCapitalTurnoverAnoAnterior,
        icon: '🔄',
        description: 'Eficiência do Capital de Giro',
      },
      {
        label: 'Asset Turnover',
        chave: 'assetTurnover',
        valor: props.assetTurnover,
        anterior: props.assetTurnoverAnoAnterior,
        icon: '🏭',
        description: 'Giro de Ativos',
      },
      {
        label: 'Receivables Turnover',
        chave: 'receivablesTurnover',
        valor: props.receivablesTurnover,
        anterior: props.receivablesTurnoverAnoAnterior,
        icon: '💳',
        description: 'Giro de Recebíveis',
      },
    ],

    'Fluxo de Caixa': [
      {
        label: 'Free Cash Flow',
        chave: 'freeCashFlow',
        valor: props.freeCashFlow,
        anterior: props.freeCashFlowAnoAnterior,
        icon: '💸',
        description: 'Fluxo de Caixa Livre',
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
        label: 'CapEx/Receita',
        chave: 'capexRevenue',
        valor: props.capexRevenue,
        anterior: props.capexRevenueAnoAnterior,
        icon: '🏗️',
        description: 'Intensidade de Investimentos',
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

    'Métricas Específicas de Consumer Cyclical': [
      ...(props.seasonalityIndex
        ? [
            {
              label: 'Sazonalidade',
              chave: 'seasonalityIndex',
              valor: props.seasonalityIndex,
              anterior: props.seasonalityIndexAnoAnterior,
              icon: '🌊',
              description: 'Índice de Sazonalidade',
            },
          ]
        : []),
      ...(props.consumerConfidence
        ? [
            {
              label: 'Confiança do Consumidor',
              chave: 'consumerConfidence',
              valor: props.consumerConfidence,
              anterior: props.consumerConfidenceAnoAnterior,
              icon: '😊',
              description: 'Correlação com Confiança do Consumidor',
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
              icon: '🎯',
              description: 'Participação de Mercado',
            },
          ]
        : []),
      {
        label: 'Sensibilidade Cíclica',
        chave: 'sensibilidadeCiclica',
        valor: calculatedMetrics.sensibilidadeCiclica,
        icon: '🔄',
        description: 'Score de sensibilidade a ciclos econômicos',
      },
      {
        label: 'Eficiência Operacional',
        chave: 'eficienciaOperacional',
        valor: calculatedMetrics.eficienciaOperacional,
        icon: '⚙️',
        description: 'Score de eficiência operacional',
      },
      {
        label: 'Resiliência Financeira',
        chave: 'resilienciaFinanceira',
        valor: calculatedMetrics.resilienciaFinanceira,
        icon: '🛡️',
        description: 'Score de resiliência em downturns',
      },
    ],
  }

  // Formatação adequada para consumer cyclical
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

    // Valores monetários (DCF, FCF)
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

    // Índices especiais
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
