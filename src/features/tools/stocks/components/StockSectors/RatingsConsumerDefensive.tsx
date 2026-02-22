import { CategoriasLayout } from './CategoriasLayout'
// src/components/ratings/RatingsConsumerDefensive.tsx

import {
  buildConsumerDefensiveComplementares,
  RatingsConsumerDefensiveProps,
} from '@/features/tools/stocks/utils/complementares/consumerDefensiveComplementares'
import {
  calculateEstabilidade,
  calculateQualidadeDefensiva,
  calculateSustentabilidadeDividendos,
} from '@/features/tools/stocks/utils/consumerCalc'

export function RatingsConsumerDefensive(props: RatingsConsumerDefensiveProps) {
  // ✅ NOVO: Constrói complementares específicos para Consumer Defensive
  const complementares = buildConsumerDefensiveComplementares(props)

  console.log('🛡️ Consumer Defensive Complementares:', complementares)

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
        label: 'P/VPA',
        chave: 'pb',
        valor: props.pb,
        anterior: props.pbAnoAnterior,
        icon: '📚',
        description: 'Preço sobre Valor Patrimonial',
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

    'Crescimento e Estabilidade': [
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
        label: 'Consistência Receita',
        chave: 'consistenciaReceita',
        valor: props.consistenciaReceita,
        anterior: props.consistenciaReceitaAnoAnterior,
        icon: '🎯',
        description: 'Consistência do Crescimento',
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

    'Fluxo de Caixa e Eficiência': [
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
        label: 'Working Capital Turnover',
        chave: 'workingCapitalTurnover',
        valor: props.workingCapitalTurnover,
        anterior: props.workingCapitalTurnoverAnoAnterior,
        icon: '🔄',
        description: 'Eficiência do Capital de Giro',
      },
      {
        label: 'Inventory Turnover',
        chave: 'inventoryTurnover',
        valor: props.inventoryTurnover,
        anterior: props.inventoryTurnoverAnoAnterior,
        icon: '📦',
        description: 'Giro de Inventário',
      },
    ],

    'Dividendos e Retorno Defensivo': [
      {
        label: 'Payout Ratio',
        chave: 'payoutRatio',
        valor: props.payoutRatio,
        anterior: props.payoutRatioAnoAnterior,
        icon: '📤',
        description: '% dos lucros distribuídos',
      },
      {
        label: 'Dividend Yield',
        chave: 'dividendYield',
        valor: props.dividendYield,
        anterior: props.dividendYieldAnoAnterior,
        icon: '💎',
        description: 'Rendimento de Dividendos',
      },
      {
        label: 'Crescimento Dividendos',
        chave: 'dividendGrowth',
        valor: props.dividendGrowth,
        anterior: props.dividendGrowthAnoAnterior,
        icon: '📈',
        description: 'Crescimento dos Dividendos',
      },
      {
        label: 'Anos de Dividendos',
        chave: 'yearsOfDividends',
        valor: props.yearsOfDividends,
        anterior: props.yearsOfDividendsAnoAnterior,
        icon: '🏆',
        description: 'Anos Consecutivos Pagando',
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

    'Métricas Específicas de Consumer Defensive': [
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
      ...(props.brandStrength
        ? [
            {
              label: 'Brand Strength',
              chave: 'brandStrength',
              valor: props.brandStrength,
              anterior: props.brandStrengthAnoAnterior,
              icon: '🏷️',
              description: 'Força da Marca',
            },
          ]
        : []),
      ...(props.storeCount
        ? [
            {
              label: 'Store Count',
              chave: 'storeCount',
              valor: props.storeCount,
              anterior: props.storeCountAnoAnterior,
              icon: '🏪',
              description: 'Número de Lojas',
            },
          ]
        : []),
      // ✅ NOVO: Métricas calculadas melhoradas
      {
        label: 'Estabilidade',
        chave: 'estabilidade',
        valor: calculateEstabilidade(complementares).toString(),
        icon: '🛡️',
        description: 'Score de estabilidade defensiva',
      },
      {
        label: 'Qualidade Defensiva',
        chave: 'qualidadeDefensiva',
        valor: calculateQualidadeDefensiva(complementares).toString(),
        icon: '🏆',
        description: 'Score de qualidade defensiva',
      },
      {
        label: 'Sustentabilidade Dividendos',
        chave: 'sustentabilidadeDividendos',
        valor: calculateSustentabilidadeDividendos(complementares).toString(),
        icon: '💎',
        description: 'Score de sustentabilidade dos dividendos',
      },
    ],
  }

  // Função para formatar valores adequadamente para consumer defensive
  const formatValue = (valor: string, chave: string) => {
    // Limpar o valor primeiro (remover % se existir)
    const cleanValue = valor.replace('%', '').trim()
    const num = parseFloat(cleanValue)

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
        'consistenciaReceita',
        'payoutRatio',
        'dividendYield',
        'dividendGrowth',
        'fcfYield',
        'marketShare',
        'estabilidade',
        'qualidadeDefensiva',
        'sustentabilidadeDividendos',
      ].includes(chave)
    ) {
      return `${num.toFixed(2)}%`
    }

    // Valores monetários (DCF, FCF)
    if (['leveredDcf', 'precoAtual', 'freeCashFlow'].includes(chave)) {
      if (Math.abs(num) > 1000000000) {
        return `${(num / 1000000000).toFixed(1)}B`
      }
      if (Math.abs(num) > 1000000) {
        return `${(num / 1000000).toFixed(1)}M`
      }
      return `${num.toFixed(2)}`
    }

    // Contadores (lojas, anos)
    if (['storeCount', 'yearsOfDividends'].includes(chave)) {
      return `${num.toFixed(0)}`
    }

    // Ratios de giro e turnover
    if (['workingCapitalTurnover', 'inventoryTurnover'].includes(chave)) {
      return `${num.toFixed(2)}x`
    }

    // Scores (força da marca, etc)
    if (['brandStrength'].includes(chave)) {
      return `${num.toFixed(1)}/10`
    }

    // Ratios gerais
    return num.toFixed(2)
  }

  return (
    <CategoriasLayout
      categorias={categorias}
      setor="Consumer Defensive"
      formatValue={formatValue}
      complementares={complementares}
    />
  )
}
