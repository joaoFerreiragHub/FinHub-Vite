import { CategoriasLayout } from './CategoriasLayout'
// ✅ COMPONENTE RATINGSCOMMUNICATION OTIMIZADO
import {
  buildCommunicationServicesComplementares,
  RatingsCommunicationProps,
} from '@/features/tools/stocks/utils/complementares/communicationServicesComplementares'

export function RatingsCommunication(props: RatingsCommunicationProps) {
  // ✅ NOVO: Constrói complementares específicos para Communication Services
  const complementares = buildCommunicationServicesComplementares(props)

  console.log('🔧 Communication Services Complementares:', complementares)

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
    'Core do Negócio': [
      {
        label: 'Crescimento de Usuários',
        chave: 'userGrowth',
        valor: props.userGrowth || '—',
        anterior: props.userGrowthAnoAnterior,
        icon: '👥',
        description: 'Taxa de crescimento da base de usuários',
      },
      {
        label: 'ARPU',
        chave: 'arpu',
        valor: props.arpu || '—',
        anterior: props.arpuAnoAnterior,
        icon: '💰',
        description: 'Receita média por usuário',
      },
      {
        label: 'Churn Rate',
        chave: 'churnRate',
        valor: props.churnRate || '—',
        anterior: props.churnRateAnoAnterior,
        icon: '🔄',
        description: 'Taxa de cancelamento',
      },
      {
        label: 'Content Investment',
        chave: 'contentInvestment',
        valor: props.contentInvestment || '—',
        anterior: props.contentInvestmentAnoAnterior,
        icon: '🎬',
        description: '% da receita investida em conteúdo',
      },
    ],

    'Crescimento e Performance': [
      {
        label: 'Crescimento Receita',
        chave: 'crescimentoReceita',
        valor: props.crescimentoReceita,
        anterior: props.crescimentoReceitaAnoAnterior,
        icon: '📈',
        description: 'Crescimento anual da receita',
      },
      {
        label: 'CAGR Receita (3Y)',
        chave: 'receitaCagr3y',
        valor: props.receitaCagr3y,
        anterior: props.receitaCagr3yAnoAnterior,
        icon: '📊',
        description: 'Taxa de crescimento composta (3 anos)',
      },
      {
        label: 'Crescimento EBITDA',
        chave: 'crescimentoEbitda',
        valor: props.crescimentoEbitda,
        anterior: props.crescimentoEbitdaAnoAnterior,
        icon: '🚀',
        description: 'Crescimento do EBITDA',
      },
    ],

    Rentabilidade: [
      {
        label: 'ROE',
        chave: 'roe',
        valor: props.roe,
        anterior: props.roeAnoAnterior,
        icon: '📈',
        description: 'Retorno sobre patrimônio líquido',
      },
      {
        label: 'ROIC',
        chave: 'roic',
        valor: props.roic,
        anterior: props.roicAnoAnterior,
        icon: '🎯',
        description: 'Retorno sobre capital investido',
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
        label: 'Margem Bruta',
        chave: 'grossMargin',
        valor: props.grossMargin,
        anterior: props.grossMarginAnoAnterior,
        icon: '💰',
        description: 'Margem bruta',
      },
      {
        label: 'Margem Líquida',
        chave: 'margemLiquida',
        valor: props.margemLiquida,
        anterior: props.margemLiquidaAnoAnterior,
        icon: '🎯',
        description: 'Margem líquida',
      },
      {
        label: 'Margem Operacional',
        chave: 'margemOperacional',
        valor: props.margemOperacional,
        anterior: props.margemOperacionalAnoAnterior,
        icon: '⚙️',
        description: 'Margem operacional',
      },
    ],

    'Múltiplos de Avaliação': [
      {
        label: 'P/L',
        chave: 'pe',
        valor: props.pe,
        anterior: props.peAnoAnterior,
        icon: '💲',
        description: 'Preço sobre lucro',
      },
      {
        label: 'P/S',
        chave: 'ps',
        valor: props.ps,
        anterior: props.psAnoAnterior,
        icon: '📊',
        description: 'Preço sobre vendas',
      },
      {
        label: 'P/VPA',
        chave: 'pb',
        valor: props.pb,
        anterior: props.pbAnoAnterior,
        icon: '📚',
        description: 'Preço sobre valor patrimonial',
      },
    ],

    'Fluxo de Caixa': [
      {
        label: 'Free Cash Flow',
        chave: 'freeCashFlow',
        valor: props.freeCashFlow,
        anterior: props.freeCashFlowAnoAnterior,
        icon: '💸',
        description: 'Fluxo de caixa livre',
      },
      {
        label: 'FCF Yield',
        chave: 'fcfYield',
        valor: props.fcfYield,
        anterior: props.fcfYieldAnoAnterior,
        icon: '💰',
        description: 'Rendimento do fluxo de caixa',
      },
      {
        label: 'CapEx/Receita',
        chave: 'capexRevenue',
        valor: props.capexRevenue,
        anterior: props.capexRevenueAnoAnterior,
        icon: '🏗️',
        description: 'Intensidade de investimentos',
      },
    ],

    'Estrutura Financeira': [
      {
        label: 'Dívida/EBITDA',
        chave: 'dividaEbitda',
        valor: props.dividaEbitda,
        anterior: props.dividaEbitdaAnoAnterior,
        icon: '⚖️',
        description: 'Endividamento',
      },
      {
        label: 'Cobertura de Juros',
        chave: 'coberturaJuros',
        valor: props.coberturaJuros,
        anterior: props.coberturaJurosAnoAnterior,
        icon: '🛡️',
        description: 'Capacidade de pagamento de juros',
      },
      {
        label: 'Liquidez Corrente',
        chave: 'liquidezCorrente',
        valor: props.liquidezCorrente,
        anterior: props.liquidezCorrenteAnoAnterior,
        icon: '💧',
        description: 'Liquidez de curto prazo',
      },
      {
        label: 'Dívida/Patrimônio',
        chave: 'debtEquity',
        valor: props.debtEquity,
        anterior: props.debtEquityAnoAnterior,
        icon: '📊',
        description: 'Alavancagem financeira',
      },
    ],

    'Dividendos e Retorno': [
      {
        label: 'Dividend Yield',
        chave: 'dividendYield',
        valor: props.dividendYield,
        anterior: props.dividendYieldAnoAnterior,
        icon: '💎',
        description: 'Rendimento de dividendos',
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

    'Risco e Volatilidade': [
      {
        label: 'Beta',
        chave: 'beta',
        valor: props.beta,
        anterior: props.betaAnoAnterior,
        icon: '📉',
        description: 'Volatilidade vs. mercado',
      },
    ],
  }

  // Função para formatar valores
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

    // Valores monetários grandes (FCF, ARPU)
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
