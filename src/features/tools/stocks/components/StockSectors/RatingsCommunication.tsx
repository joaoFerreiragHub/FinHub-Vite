import { CategoriasLayout } from './CategoriasLayout'
// âœ… COMPONENTE RATINGSCOMMUNICATION OTIMIZADO
import {
  buildCommunicationServicesComplementares,
  RatingsCommunicationProps,
} from '@/features/tools/stocks/utils/complementares/communicationServicesComplementares'

export function RatingsCommunication(props: RatingsCommunicationProps) {
  // âœ… NOVO: ConstrÃ³i complementares especÃ­ficos para Communication Services
  const complementares = buildCommunicationServicesComplementares(props)

  console.log('ðŸ”§ Communication Services Complementares:', complementares)

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
    'Core do NegÃ³cio': [
      {
        label: 'Crescimento de UsuÃ¡rios',
        chave: 'userGrowth',
        valor: props.userGrowth || '—',
        anterior: props.userGrowthAnoAnterior,
        icon: 'ðŸ‘¥',
        description: 'Taxa de crescimento da base de usuÃ¡rios',
      },
      {
        label: 'ARPU',
        chave: 'arpu',
        valor: props.arpu || '—',
        anterior: props.arpuAnoAnterior,
        icon: 'ðŸ’°',
        description: 'Receita mÃ©dia por usuÃ¡rio',
      },
      {
        label: 'Churn Rate',
        chave: 'churnRate',
        valor: props.churnRate || '—',
        anterior: props.churnRateAnoAnterior,
        icon: 'ðŸ”„',
        description: 'Taxa de cancelamento',
      },
      {
        label: 'Content Investment',
        chave: 'contentInvestment',
        valor: props.contentInvestment || '—',
        anterior: props.contentInvestmentAnoAnterior,
        icon: 'ðŸŽ¬',
        description: '% da receita investida em conteÃºdo',
      },
    ],

    'Crescimento e Performance': [
      {
        label: 'Crescimento Receita',
        chave: 'crescimentoReceita',
        valor: props.crescimentoReceita,
        anterior: props.crescimentoReceitaAnoAnterior,
        icon: 'ðŸ“ˆ',
        description: 'Crescimento anual da receita',
      },
      {
        label: 'CAGR Receita (3Y)',
        chave: 'receitaCagr3y',
        valor: props.receitaCagr3y,
        anterior: props.receitaCagr3yAnoAnterior,
        icon: 'ðŸ“Š',
        description: 'Taxa de crescimento composta (3 anos)',
      },
      {
        label: 'Crescimento EBITDA',
        chave: 'crescimentoEbitda',
        valor: props.crescimentoEbitda,
        anterior: props.crescimentoEbitdaAnoAnterior,
        icon: 'ðŸš€',
        description: 'Crescimento do EBITDA',
      },
    ],

    Rentabilidade: [
      {
        label: 'ROE',
        chave: 'roe',
        valor: props.roe,
        anterior: props.roeAnoAnterior,
        icon: 'ðŸ“ˆ',
        description: 'Retorno sobre patrimÃ´nio lÃ­quido',
      },
      {
        label: 'ROIC',
        chave: 'roic',
        valor: props.roic,
        anterior: props.roicAnoAnterior,
        icon: 'ðŸŽ¯',
        description: 'Retorno sobre capital investido',
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
        label: 'Margem Bruta',
        chave: 'grossMargin',
        valor: props.grossMargin,
        anterior: props.grossMarginAnoAnterior,
        icon: 'ðŸ’°',
        description: 'Margem bruta',
      },
      {
        label: 'Margem LÃ­quida',
        chave: 'margemLiquida',
        valor: props.margemLiquida,
        anterior: props.margemLiquidaAnoAnterior,
        icon: 'ðŸŽ¯',
        description: 'Margem lÃ­quida',
      },
      {
        label: 'Margem Operacional',
        chave: 'margemOperacional',
        valor: props.margemOperacional,
        anterior: props.margemOperacionalAnoAnterior,
        icon: 'âš™ï¸',
        description: 'Margem operacional',
      },
    ],

    'MÃºltiplos de AvaliaÃ§Ã£o': [
      {
        label: 'P/L',
        chave: 'pe',
        valor: props.pe,
        anterior: props.peAnoAnterior,
        icon: 'ðŸ’²',
        description: 'PreÃ§o sobre lucro',
      },
      {
        label: 'P/S',
        chave: 'ps',
        valor: props.ps,
        anterior: props.psAnoAnterior,
        icon: 'ðŸ“Š',
        description: 'PreÃ§o sobre vendas',
      },
      {
        label: 'P/VPA',
        chave: 'pb',
        valor: props.pb,
        anterior: props.pbAnoAnterior,
        icon: 'ðŸ“š',
        description: 'PreÃ§o sobre valor patrimonial',
      },
    ],

    'Fluxo de Caixa': [
      {
        label: 'Free Cash Flow',
        chave: 'freeCashFlow',
        valor: props.freeCashFlow,
        anterior: props.freeCashFlowAnoAnterior,
        icon: 'ðŸ’¸',
        description: 'Fluxo de caixa livre',
      },
      {
        label: 'FCF Yield',
        chave: 'fcfYield',
        valor: props.fcfYield,
        anterior: props.fcfYieldAnoAnterior,
        icon: 'ðŸ’°',
        description: 'Rendimento do fluxo de caixa',
      },
      {
        label: 'CapEx/Receita',
        chave: 'capexRevenue',
        valor: props.capexRevenue,
        anterior: props.capexRevenueAnoAnterior,
        icon: 'ðŸ—ï¸',
        description: 'Intensidade de investimentos',
      },
    ],

    'Estrutura Financeira': [
      {
        label: 'DÃ­vida/EBITDA',
        chave: 'dividaEbitda',
        valor: props.dividaEbitda,
        anterior: props.dividaEbitdaAnoAnterior,
        icon: 'âš–ï¸',
        description: 'Endividamento',
      },
      {
        label: 'Cobertura de Juros',
        chave: 'coberturaJuros',
        valor: props.coberturaJuros,
        anterior: props.coberturaJurosAnoAnterior,
        icon: 'ðŸ›¡ï¸',
        description: 'Capacidade de pagamento de juros',
      },
      {
        label: 'Liquidez Corrente',
        chave: 'liquidezCorrente',
        valor: props.liquidezCorrente,
        anterior: props.liquidezCorrenteAnoAnterior,
        icon: 'ðŸ’§',
        description: 'Liquidez de curto prazo',
      },
      {
        label: 'DÃ­vida/PatrimÃ´nio',
        chave: 'debtEquity',
        valor: props.debtEquity,
        anterior: props.debtEquityAnoAnterior,
        icon: 'ðŸ“Š',
        description: 'Alavancagem financeira',
      },
    ],

    'Dividendos e Retorno': [
      {
        label: 'Dividend Yield',
        chave: 'dividendYield',
        valor: props.dividendYield,
        anterior: props.dividendYieldAnoAnterior,
        icon: 'ðŸ’Ž',
        description: 'Rendimento de dividendos',
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

    'Risco e Volatilidade': [
      {
        label: 'Beta',
        chave: 'beta',
        valor: props.beta,
        anterior: props.betaAnoAnterior,
        icon: 'ðŸ“‰',
        description: 'Volatilidade vs. mercado',
      },
    ],
  }

  // FunÃ§Ã£o para formatar valores
  const formatValue = (valor: string, chave: string) => {
    const cleanValue = valor.replace('%', '').replace('$', '').replace(',', '').trim()
    const num = parseFloat(cleanValue)

    if (isNaN(num)) return valor

    // Valores em percentual
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
        'userGrowth',
        'churnRate',
        'contentInvestment',
      ].includes(chave)
    ) {
      return `${num.toFixed(2)}%`
    }

    // Valores monetÃ¡rios grandes (FCF, ARPU)
    if (chave === 'freeCashFlow' && Math.abs(num) > 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }

    if (chave === 'arpu') {
      return `$${num.toFixed(2)}`
    }

    // Ratios com 2 casas decimais
    return num.toFixed(2)
  }

  return (
    <CategoriasLayout
      categorias={categorias}
      setor="Communication Services"
      formatValue={formatValue}
      complementares={complementares}
    />
  )
}
