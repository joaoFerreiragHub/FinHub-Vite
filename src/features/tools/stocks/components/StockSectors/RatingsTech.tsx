// src/components/ratings/RatingsTech.tsx

import {
  buildTechnologyComplementares,
  RatingsTechProps,
} from '@/features/tools/stocks/utils/complementares/technologyComplementares'
import { CategoriasLayout } from './CategoriasLayout'

export function RatingsTech(props: RatingsTechProps) {
  // âœ… NOVO: ConstrÃ³i complementares especÃ­ficos para Technology
  const complementares = buildTechnologyComplementares(props)

  console.log('ðŸ”§ Technology Complementares:', complementares)

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
        icon: 'ðŸ“ˆ',
        description: 'Taxa de crescimento da receita',
      },
      {
        label: 'CAGR EPS',
        chave: 'cagrEps',
        valor: props.cagrEps,
        anterior: props.cagrEpsAnoAnterior,
        icon: 'ðŸ“Š',
        description: 'Taxa de Crescimento Anual Composta do EPS',
      },
      {
        label: 'EPS',
        chave: 'eps',
        valor: props.eps,
        anterior: props.epsAnoAnterior,
        icon: 'ðŸ†',
        description: 'Lucro por AÃ§Ã£o',
      },
    ],
    Rentabilidade: [
      {
        label: 'Margem Bruta',
        chave: 'margemBruta',
        valor: props.margemBruta,
        anterior: props.margemBrutaAnoAnterior,
        icon: 'ðŸ’°',
      },
      {
        label: 'Margem EBITDA',
        chave: 'margemEbitda',
        valor: props.margemEbitda,
        anterior: props.margemEbitdaAnoAnterior,
        icon: 'ðŸ“Š',
      },
      {
        label: 'Margem LÃ­quida',
        chave: 'margemLiquida',
        valor: props.margemLiquida,
        anterior: props.margemLiquidaAnoAnterior,
        icon: 'ðŸ’Ž',
      },
      {
        label: 'Margem Operacional',
        chave: 'margemOperacional',
        valor: props.margemOperacional,
        anterior: props.margemOperacionalAnoAnterior,
        icon: 'âš™ï¸',
      },
    ],
    'Retorno sobre Capital': [
      {
        label: 'ROIC',
        chave: 'roic',
        valor: props.roic,
        anterior: props.roicAnoAnterior,
        icon: 'ðŸŽ¯',
        description: 'Retorno sobre Capital Investido',
      },
      {
        label: 'ROE',
        chave: 'roe',
        valor: props.roe,
        anterior: props.roeAnoAnterior,
        icon: 'ðŸ“ˆ',
        description: 'Retorno sobre PatrimÃ´nio LÃ­quido',
      },
    ],
    'MÃºltiplos de AvaliaÃ§Ã£o': [
      {
        label: 'P/L',
        chave: 'pl',
        valor: props.pl,
        anterior: props.plAnoAnterior,
        icon: 'ðŸ’²',
        description: 'PreÃ§o sobre Lucro',
      },
      {
        label: 'P/S',
        chave: 'ps',
        valor: props.ps,
        anterior: props.psAnoAnterior,
        icon: 'ðŸ’°',
        description: 'PreÃ§o sobre Vendas',
      },
      {
        label: 'PEG',
        chave: 'peg',
        valor: props.peg,
        anterior: props.pegAnoAnterior,
        icon: 'âš–ï¸',
        description: 'P/L ajustado pelo crescimento',
      },
    ],
    'Estrutura de Capital e Liquidez': [
      {
        label: 'DÃ­vida/EBITDA',
        chave: 'debtToEbitda',
        valor: props.debtToEbitda,
        anterior: props.debtToEbitdaAnoAnterior,
        icon: 'âš ï¸',
        description: 'Endividamento em relaÃ§Ã£o ao EBITDA',
      },
      {
        label: 'Liquidez Corrente',
        chave: 'liquidezCorrente',
        valor: props.liquidezCorrente,
        anterior: props.liquidezCorrenteAnoAnterior,
        icon: 'ðŸ’§',
        description: 'Capacidade de pagamento a curto prazo',
      },
      {
        label: 'Cash Ratio',
        chave: 'cashRatio',
        valor: props.cashRatio,
        anterior: props.cashRatioAnoAnterior,
        icon: 'ðŸ’µ',
        description: 'Ratio de liquidez imediata (agora calculado!)',
      },

      // ðŸ†• NOVO: Adicionar se quiserem mostrar as receitas recorrentes
      {
        label: 'Receitas Recorrentes',
        chave: 'receitasRecorrentes',
        valor: props.receitasRecorrentes || '—',
        anterior: undefined,
        icon: 'ðŸ”„',
        description: 'Percentual de receitas recorrentes',
      },
      {
        label: 'DÃ­vida / Capitais PrÃ³prios',
        chave: 'debtEquity',
        valor: props.debtEquity ?? '—',
        anterior: props.debtEquityAnoAnterior,
        icon: 'âš–ï¸',
        description: 'DÃ­vida sobre PatrimÃ´nio',
      },
    ],
    'Risco e Volatilidade': [
      {
        label: 'Beta',
        chave: 'beta',
        valor: props.beta,
        anterior: props.betaAnoAnterior,
        icon: 'ðŸ“‰',
        description: 'Volatilidade em relaÃ§Ã£o ao mercado',
      },
    ],
    'MÃ©tricas EspecÃ­ficas de Tech': [
      {
        label: 'P&D / Receita',
        chave: 'investimentoPD',
        valor: props.investimentoPD,
        anterior: props.investimentoPDAnoAnterior,
        icon: 'ðŸ”¬',
        description: 'Investimento em Pesquisa e Desenvolvimento',
      },
      {
        label: 'EficiÃªncia de P&D',
        chave: 'rAnddEfficiency',
        valor: props.rAnddEfficiency,
        anterior: props.rAnddEfficiencyAnoAnterior,
        icon: 'ðŸ§ª',
        description: 'EficiÃªncia dos investimentos em P&D',
      },
      {
        label: 'Cash Flow / CapEx',
        chave: 'cashFlowOverCapex',
        valor: props.cashFlowOverCapex,
        anterior: props.cashFlowOverCapexAnoAnterior,
        icon: 'ðŸ”„',
      },
      {
        label: 'Free Cash Flow',
        chave: 'fcf',
        valor: props.fcf,
        anterior: props.fcfAnoAnterior,
        icon: 'ðŸ’µ',
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
        icon: 'ðŸ’¸',
        description: 'Percentual de lucros distribuÃ­dos',
      },
    ],
  }

  // FunÃ§Ã£o para formatar valores
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

    // Valores monetÃ¡rios grandes (FCF)
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
