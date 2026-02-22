import { CategoriasLayout } from './CategoriasLayout'
// ✅ COMPONENTE RATINGSHEALTHCARE OTIMIZADO
import {
  buildHealthcareComplementares,
  RatingsHealthcareProps,
} from '@/features/tools/stocks/utils/complementares/healthcareComplementares'

export function RatingsHealthcare(props: RatingsHealthcareProps) {
  // ✅ NOVO: Constrói complementares específicos para Healthcare
  const complementares = buildHealthcareComplementares(props)

  console.log('🩺 Healthcare Complementares:', complementares)

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
    'Core Farmacêutico': [
      {
        label: 'P&D / Receita',
        chave: 'investimentoPD',
        valor: props.investimentoPD,
        anterior: props.investimentoPDAnoAnterior,
        icon: '🔬',
        description: 'Investimento em pesquisa e desenvolvimento',
      },
      {
        label: 'Eficiência de P&D',
        chave: 'rAnddEfficiency',
        valor: props.rAnddEfficiency,
        anterior: props.rAnddEfficiencyAnoAnterior,
        icon: '🧪',
        description: 'ROI dos investimentos em inovação',
      },
      {
        label: 'Free Cash Flow',
        chave: 'fcf',
        valor: props.fcf,
        anterior: props.fcfAnoAnterior,
        icon: '💵',
        description: 'Fluxo de caixa livre para investimentos',
      },
      {
        label: 'Cash Flow / CapEx',
        chave: 'cashFlowOverCapex',
        valor: props.cashFlowOverCapex,
        anterior: props.cashFlowOverCapexAnoAnterior,
        icon: '🔄',
        description: 'Eficiência do capital investido',
      },
    ],

    'Crescimento e Performance': [
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
        description: 'Crescimento anual composto do EPS',
      },
      {
        label: 'EPS',
        chave: 'eps',
        valor: props.eps,
        anterior: props.epsAnoAnterior,
        icon: '🏆',
        description: 'Lucro por ação',
      },
    ],

    Rentabilidade: [
      {
        label: 'ROIC',
        chave: 'roic',
        valor: props.roic,
        anterior: props.roicAnoAnterior,
        icon: '🎯',
        description: 'Retorno sobre capital investido',
      },
      {
        label: 'ROE',
        chave: 'roe',
        valor: props.roe,
        anterior: props.roeAnoAnterior,
        icon: '📈',
        description: 'Retorno sobre patrimônio líquido',
      },
      {
        label: 'Margem Bruta',
        chave: 'margemBruta',
        valor: props.margemBruta,
        anterior: props.margemBrutaAnoAnterior,
        icon: '💰',
        description: 'Margem bruta (pricing power)',
      },
      {
        label: 'Margem EBITDA',
        chave: 'margemEbitda',
        valor: props.margemEbitda,
        anterior: props.margemEbitdaAnoAnterior,
        icon: '📊',
        description: 'Margem EBITDA operacional',
      },
      {
        label: 'Margem Líquida',
        chave: 'margemLiquida',
        valor: props.margemLiquida,
        anterior: props.margemLiquidaAnoAnterior,
        icon: '💎',
        description: 'Margem líquida final',
      },
      {
        label: 'Margem Operacional',
        chave: 'margemOperacional',
        valor: props.margemOperacional,
        anterior: props.margemOperacionalAnoAnterior,
        icon: '⚙️',
        description: 'Eficiência operacional',
      },
    ],

    'Múltiplos de Avaliação': [
      {
        label: 'P/L',
        chave: 'pl',
        valor: props.pl,
        anterior: props.plAnoAnterior,
        icon: '💲',
        description: 'Preço sobre lucro',
      },
      {
        label: 'P/S',
        chave: 'ps',
        valor: props.ps,
        anterior: props.psAnoAnterior,
        icon: '💰',
        description: 'Preço sobre vendas',
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

    'Estrutura Financeira': [
      {
        label: 'Dívida/EBITDA',
        chave: 'debtToEbitda',
        valor: props.debtToEbitda,
        anterior: props.debtToEbitdaAnoAnterior,
        icon: '⚠️',
        description: 'Endividamento vs geração operacional',
      },
      {
        label: 'Liquidez Corrente',
        chave: 'liquidezCorrente',
        valor: props.liquidezCorrente,
        anterior: props.liquidezCorrenteAnoAnterior,
        icon: '💧',
        description: 'Capacidade de pagamento curto prazo',
      },
      {
        label: 'Dívida / Patrimônio',
        chave: 'debtEquity',
        valor: props.debtEquity,
        anterior: props.debtEquityAnoAnterior,
        icon: '⚖️',
        description: 'Alavancagem financeira',
      },
    ],

    'Eficiência Operacional': [
      {
        label: 'SG&A / Receita',
        chave: 'sgaOverRevenue',
        valor: props.sgaOverRevenue,
        anterior: props.sgaOverRevenueAnoAnterior,
        icon: '🏢',
        description: 'Eficiência em vendas e administração',
      },
      {
        label: 'Payout Ratio',
        chave: 'payoutRatio',
        valor: props.payoutRatio,
        anterior: props.payoutRatioAnoAnterior,
        icon: '💸',
        description: '% dos lucros distribuídos aos acionistas',
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
      ].includes(chave)
    ) {
      return `${num.toFixed(2)}%`
    }

    // Valores monetários grandes (FCF)
    if (chave === 'fcf' && Math.abs(num) > 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }

    // Ratios com 2 casas decimais
    return num.toFixed(2)
  }

  return (
    <CategoriasLayout
      categorias={categorias}
      setor="Healthcare"
      formatValue={formatValue}
      complementares={complementares}
    />
  )
}
