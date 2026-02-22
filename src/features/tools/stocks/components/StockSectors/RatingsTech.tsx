// src/components/ratings/RatingsTech.tsx

import {
  buildTechnologyComplementares,
  RatingsTechProps,
} from '@/features/tools/stocks/utils/complementares/technologyComplementares'
import { CategoriasLayout } from './CategoriasLayout'

export function RatingsTech(props: RatingsTechProps) {
  // ✅ NOVO: Constrói complementares específicos para Technology
  const complementares = buildTechnologyComplementares(props)

  console.log('🔧 Technology Complementares:', complementares)

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
    Crescimento: [
      {
        label: 'Crescimento Receita',
        chave: 'crescimentoReceita',
        valor: props.crescimentoReceita,
        anterior: props.crescimentoReceitaAnoAnterior,
        icon: '📈',
        description: 'Taxa de crescimento da receita',
      },
      {
        label: 'CAGR EPS',
        chave: 'cagrEps',
        valor: props.cagrEps,
        anterior: props.cagrEpsAnoAnterior,
        icon: '📊',
        description: 'Taxa de Crescimento Anual Composta do EPS',
      },
      {
        label: 'EPS',
        chave: 'eps',
        valor: props.eps,
        anterior: props.epsAnoAnterior,
        icon: '🏆',
        description: 'Lucro por Ação',
      },
    ],
    Rentabilidade: [
      {
        label: 'Margem Bruta',
        chave: 'margemBruta',
        valor: props.margemBruta,
        anterior: props.margemBrutaAnoAnterior,
        icon: '💰',
      },
      {
        label: 'Margem EBITDA',
        chave: 'margemEbitda',
        valor: props.margemEbitda,
        anterior: props.margemEbitdaAnoAnterior,
        icon: '📊',
      },
      {
        label: 'Margem Líquida',
        chave: 'margemLiquida',
        valor: props.margemLiquida,
        anterior: props.margemLiquidaAnoAnterior,
        icon: '💎',
      },
      {
        label: 'Margem Operacional',
        chave: 'margemOperacional',
        valor: props.margemOperacional,
        anterior: props.margemOperacionalAnoAnterior,
        icon: '⚙️',
      },
    ],
    'Retorno sobre Capital': [
      {
        label: 'ROIC',
        chave: 'roic',
        valor: props.roic,
        anterior: props.roicAnoAnterior,
        icon: '🎯',
        description: 'Retorno sobre Capital Investido',
      },
      {
        label: 'ROE',
        chave: 'roe',
        valor: props.roe,
        anterior: props.roeAnoAnterior,
        icon: '📈',
        description: 'Retorno sobre Patrimônio Líquido',
      },
    ],
    'Múltiplos de Avaliação': [
      {
        label: 'P/L',
        chave: 'pl',
        valor: props.pl,
        anterior: props.plAnoAnterior,
        icon: '💲',
        description: 'Preço sobre Lucro',
      },
      {
        label: 'P/S',
        chave: 'ps',
        valor: props.ps,
        anterior: props.psAnoAnterior,
        icon: '💰',
        description: 'Preço sobre Vendas',
      },
      {
        label: 'PEG',
        chave: 'peg',
        valor: props.peg,
        anterior: props.pegAnoAnterior,
        icon: '⚖️',
        description: 'P/L ajustado pelo crescimento',
      },
    ],
    'Estrutura de Capital e Liquidez': [
      {
        label: 'Dívida/EBITDA',
        chave: 'debtToEbitda',
        valor: props.debtToEbitda,
        anterior: props.debtToEbitdaAnoAnterior,
        icon: '⚠️',
        description: 'Endividamento em relação ao EBITDA',
      },
      {
        label: 'Liquidez Corrente',
        chave: 'liquidezCorrente',
        valor: props.liquidezCorrente,
        anterior: props.liquidezCorrenteAnoAnterior,
        icon: '💧',
        description: 'Capacidade de pagamento a curto prazo',
      },
      {
        label: 'Cash Ratio',
        chave: 'cashRatio',
        valor: props.cashRatio,
        anterior: props.cashRatioAnoAnterior,
        icon: '💵',
        description: 'Ratio de liquidez imediata (agora calculado!)',
      },

      // 🆕 NOVO: Adicionar se quiserem mostrar as receitas recorrentes
      {
        label: 'Receitas Recorrentes',
        chave: 'receitasRecorrentes',
        valor: props.receitasRecorrentes || '—',
        anterior: undefined,
        icon: '🔄',
        description: 'Percentual de receitas recorrentes',
      },
      {
        label: 'Dívida / Capitais Próprios',
        chave: 'debtEquity',
        valor: props.debtEquity ?? '—',
        anterior: props.debtEquityAnoAnterior,
        icon: '⚖️',
        description: 'Dívida sobre Patrimônio',
      },
    ],
    'Risco e Volatilidade': [
      {
        label: 'Beta',
        chave: 'beta',
        valor: props.beta,
        anterior: props.betaAnoAnterior,
        icon: '📉',
        description: 'Volatilidade em relação ao mercado',
      },
    ],
    'Métricas Específicas de Tech': [
      {
        label: 'P&D / Receita',
        chave: 'investimentoPD',
        valor: props.investimentoPD,
        anterior: props.investimentoPDAnoAnterior,
        icon: '🔬',
        description: 'Investimento em Pesquisa e Desenvolvimento',
      },
      {
        label: 'Eficiência de P&D',
        chave: 'rAnddEfficiency',
        valor: props.rAnddEfficiency,
        anterior: props.rAnddEfficiencyAnoAnterior,
        icon: '🧪',
        description: 'Eficiência dos investimentos em P&D',
      },
      {
        label: 'Cash Flow / CapEx',
        chave: 'cashFlowOverCapex',
        valor: props.cashFlowOverCapex,
        anterior: props.cashFlowOverCapexAnoAnterior,
        icon: '🔄',
      },
      {
        label: 'Free Cash Flow',
        chave: 'fcf',
        valor: props.fcf,
        anterior: props.fcfAnoAnterior,
        icon: '💵',
        description: 'Fluxo de Caixa Livre',
      },
      {
        label: 'SG&A / Receita',
        chave: 'sgaOverRevenue',
        valor: props.sgaOverRevenue,
        anterior: props.sgaOverRevenueAnoAnterior,
        icon: 'ðŸ¢',
      },
      {
        label: 'Payout Ratio',
        chave: 'payoutRatio',
        valor: props.payoutRatio,
        anterior: props.payoutRatioAnoAnterior,
        icon: '💸',
        description: 'Percentual de lucros distribuídos',
      },
    ],
  }

  // Função para formatar valores
  const formatValue = (valor: string, chave: string) => {
    const cleanValue = valor.replace('%', '').trim()
    const num = parseFloat(cleanValue)

    if (isNaN(num)) return valor

    // Valores em percentual - ADICIONAR 'receitasRecorrentes' se for usar
    if (
      [
        'margemBruta',
        'margemEbitda',
        'margemLiquida',
        'margemOperacional',
        'roic',
        'roe',
        'cagrEps',
        'crescimentoReceita',
        'investimentoPD',
        'sgaOverRevenue',
        'payoutRatio',
        'rAnddEfficiency',
        'receitasRecorrentes',
      ].includes(chave)
    ) {
      return `${num.toFixed(2)}%`
    }

    // Valores monetários grandes (FCF)
    if (chave === 'fcf' && Math.abs(num) > 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }

    // Cash Ratio e outros ratios com 2 casas decimais
    return num.toFixed(2)
  }

  return (
    <CategoriasLayout
      categorias={categorias}
      setor="Technology"
      formatValue={formatValue}
      complementares={complementares}
    />
  )
}
