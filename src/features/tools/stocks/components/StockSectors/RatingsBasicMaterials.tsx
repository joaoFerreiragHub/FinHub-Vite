import { CategoriasLayout } from './CategoriasLayout'
import {
  buildBasicMaterialsComplementares,
  RatingsBasicMaterialsProps,
} from '@/features/tools/stocks/utils/complementares/basicMaterialsComplementares'

interface Categoria {
  label: string
  chave: string
  valor: string
  anterior?: string
  icon?: string
  description?: string
}

export function RatingsBasicMaterials(props: RatingsBasicMaterialsProps) {
  // âœ… NOVO: ConstrÃ³i complementares especÃ­ficos para Basic Materials
  const complementares = buildBasicMaterialsComplementares(props)

  console.log('ðŸ”§ Basic Materials Complementares:', complementares)

  // Calcular mÃ©tricas especÃ­ficas de basic materials
  const calculateBasicMaterialsMetrics = () => {
    const roicNum = parseFloat(props.roic) || 0
    const margemEbitdaNum = parseFloat(props.margemEbitda) || 0
    const dividaEbitdaNum = parseFloat(props.dividaEbitda) || 0
    const freeCashFlowNum = parseFloat(props.freeCashFlow) || 0
    const inventoryTurnoverNum = parseFloat(props.inventoryTurnover || '0') || 0

    return {
      // Score de EficiÃªncia Operacional
      eficienciaOperacional:
        margemEbitdaNum > 25 && roicNum > 12
          ? '90'
          : margemEbitdaNum > 15 && roicNum > 8
            ? '75'
            : '50',

      // Score de GestÃ£o de Capital
      gestaoCapital:
        inventoryTurnoverNum > 6 && dividaEbitdaNum < 2.5
          ? '95'
          : inventoryTurnoverNum > 4 && dividaEbitdaNum < 3.5
            ? '80'
            : '60',

      // Score de GeraÃ§Ã£o de Valor
      geracaoValor: freeCashFlowNum > 0 && roicNum > 10 ? '85' : freeCashFlowNum > 0 ? '70' : '45',
    }
  }

  const calculatedMetrics = calculateBasicMaterialsMetrics()

  const categorias: Record<string, Categoria[]> = {
    'Rentabilidade e Retorno': [
      {
        label: 'P/E',
        chave: 'pe',
        valor: props.pe,
        anterior: props.peAnoAnterior,
        icon: 'ðŸ’²',
        description: 'PreÃ§o sobre Lucro',
      },
      {
        label: 'P/B',
        chave: 'pb',
        valor: props.pb,
        anterior: props.pbAnoAnterior,
        icon: 'ðŸ“š',
        description: 'PreÃ§o sobre Valor ContÃ¡bil',
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
        label: 'Margem EBITDA',
        chave: 'margemEbitda',
        valor: props.margemEbitda,
        anterior: props.margemEbitdaAnoAnterior,
        icon: 'ðŸ“Š',
        description: 'Margem EBITDA',
      },
      {
        label: 'Margem Bruta',
        chave: 'margemBruta',
        valor: props.margemBruta,
        anterior: props.margemBrutaAnoAnterior,
        icon: 'ðŸ’°',
        description: 'Margem Bruta',
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

    'Estrutura de Capital e SolvÃªncia': [
      {
        label: 'DÃ­vida/EBITDA',
        chave: 'dividaEbitda',
        valor: props.dividaEbitda,
        anterior: props.dividaEbitdaAnoAnterior,
        icon: 'âš–ï¸',
        description: 'Endividamento vs. GeraÃ§Ã£o de Caixa',
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

    'Fluxo de Caixa e EficiÃªncia de Capital': [
      {
        label: 'Free Cash Flow',
        chave: 'freeCashFlow',
        valor: props.freeCashFlow,
        anterior: props.freeCashFlowAnoAnterior,
        icon: 'ðŸ’¸',
        description: 'Fluxo de Caixa Livre',
      },
      {
        label: 'CapEx/Receita',
        chave: 'capexRevenue',
        valor: props.capexRevenue,
        anterior: props.capexRevenueAnoAnterior,
        icon: 'ðŸ—ï¸',
        description: 'Intensidade de Investimentos',
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
        label: 'Working Capital Turnover',
        chave: 'workingCapitalTurnover',
        valor: props.workingCapitalTurnover,
        anterior: props.workingCapitalTurnoverAnoAnterior,
        icon: 'ðŸ”„',
        description: 'EficiÃªncia do Capital de Giro',
      },
    ],

    'Crescimento e Performance': [
      {
        label: 'Crescimento Receita',
        chave: 'crescimentoReceita',
        valor: props.crescimentoReceita,
        anterior: props.crescimentoReceitaAnoAnterior,
        icon: 'ðŸ“ˆ',
        description: 'Crescimento da Receita',
      },
      {
        label: 'Crescimento EBITDA',
        chave: 'crescimentoEbitda',
        valor: props.crescimentoEbitda,
        anterior: props.crescimentoEbitdaAnoAnterior,
        icon: 'ðŸ“Š',
        description: 'Crescimento do EBITDA',
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

    'MÃ©tricas EspecÃ­ficas de Basic Materials': [
      ...(props.inventoryTurnover
        ? [
            {
              label: 'Inventory Turnover',
              chave: 'inventoryTurnover',
              valor: props.inventoryTurnover,
              anterior: props.inventoryTurnoverAnoAnterior,
              icon: 'ðŸ“¦',
              description: 'Giro de InventÃ¡rio',
            },
          ]
        : []),
      ...(props.assetTurnover
        ? [
            {
              label: 'Asset Turnover',
              chave: 'assetTurnover',
              valor: props.assetTurnover,
              anterior: props.assetTurnoverAnoAnterior,
              icon: 'ðŸ­',
              description: 'Giro de Ativos',
            },
          ]
        : []),
      ...(props.capacityUtilization
        ? [
            {
              label: 'Capacity Utilization',
              chave: 'capacityUtilization',
              valor: props.capacityUtilization,
              anterior: props.capacityUtilizationAnoAnterior,
              icon: 'âš¡',
              description: 'UtilizaÃ§Ã£o da Capacidade',
            },
          ]
        : []),
      {
        label: 'EficiÃªncia Operacional',
        chave: 'eficienciaOperacional',
        valor: calculatedMetrics.eficienciaOperacional,
        icon: 'âš™ï¸',
        description: 'Score de eficiÃªncia operacional',
      },
      {
        label: 'GestÃ£o de Capital',
        chave: 'gestaoCapital',
        valor: calculatedMetrics.gestaoCapital,
        icon: 'ðŸ’¼',
        description: 'Score de gestÃ£o de capital',
      },
      {
        label: 'GeraÃ§Ã£o de Valor',
        chave: 'geracaoValor',
        valor: calculatedMetrics.geracaoValor,
        icon: 'ðŸ’Ž',
        description: 'Score de geraÃ§Ã£o de valor',
      },
    ],
  }

  // FormataÃ§Ã£o adequada para basic materials
  const formatValue = (valor: string, chave: string) => {
    const num = parseFloat(valor)
    if (isNaN(num)) return valor

    // Percentuais
    if (
      [
        'roe',
        'roic',
        'margemEbitda',
        'margemBruta',
        'margemLiquida',
        'margemOperacional',
        'dividendYield',
        'payoutRatio',
        'fcfYield',
        'capexRevenue',
        'crescimentoReceita',
        'crescimentoEbitda',
        'capacityUtilization',
        'eficienciaOperacional',
        'gestaoCapital',
        'geracaoValor',
      ].includes(chave)
    ) {
      return `${num.toFixed(2)}%`
    }

    // Valores monetÃ¡rios (DCF, FCF)
    if (['leveredDcf', 'precoAtual', 'freeCashFlow'].includes(chave)) {
      if (Math.abs(num) > 1000000) {
        return `${(num / 1000000).toFixed(1)}M`
      }
      return `${num.toFixed(2)}`
    }

    // Ratios de giro e turnover
    if (['inventoryTurnover', 'assetTurnover', 'workingCapitalTurnover'].includes(chave)) {
      return `${num.toFixed(2)}x`
    }

    // Ratios gerais
    return num.toFixed(2)
  }

  return (
    <CategoriasLayout
      categorias={categorias}
      setor="Basic Materials"
      formatValue={formatValue}
      complementares={complementares}
    />
  )
}
