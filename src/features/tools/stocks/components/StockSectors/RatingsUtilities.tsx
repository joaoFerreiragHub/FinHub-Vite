import { CategoriasLayout } from './CategoriasLayout'
import {
  buildUtilitiesComplementares,
  RatingsUtilitiesProps,
} from '@/features/tools/stocks/utils/complementares/utilitiesComplementares'

interface Categoria {
  label: string
  chave: string
  valor: string
  anterior?: string
  icon?: string
  description?: string
}

// ✅ ADICIONADO: Validações inline (sem ficheiro separado)
interface ValidationResult {
  isValid: boolean
  warning?: string
  severity?: 'low' | 'medium' | 'high' | 'critical'
}

function calculateDCFUpside(dcf: string, precoAtual: string): string {
  const dcfNum = parseFloat(dcf)
  const precoNum = parseFloat(precoAtual)
  if (isNaN(dcfNum) || isNaN(precoNum) || precoNum === 0) return 'N/A'
  return ((dcfNum / precoNum - 1) * 100).toFixed(2)
}

function validateUtilitiesIndicator(chave: string, valor: number): ValidationResult {
  switch (chave) {
    case 'dividendYield':
      if (valor > 12)
        return {
          isValid: false,
          warning: 'Yield > 12% pode indicar risco extremo',
          severity: 'critical',
        }
      if (valor > 9)
        return {
          isValid: true,
          warning: 'Yield > 9% é alto - verificar sustentabilidade',
          severity: 'medium',
        }
      break

    case 'payoutRatio':
      if (valor > 150)
        return {
          isValid: false,
          warning: 'Payout > 150% é insustentável',
          severity: 'critical',
        }
      if (valor > 100)
        return {
          isValid: true,
          warning: 'Payout > 100% indica distribuição acima dos lucros',
          severity: 'high',
        }
      break

    case 'coberturaJuros':
      if (valor < 0.5)
        return {
          isValid: false,
          warning: 'Cobertura < 0.5x indica risco de default',
          severity: 'critical',
        }
      if (valor < 1.5)
        return {
          isValid: true,
          warning: 'Cobertura < 1.5x indica stress financeiro',
          severity: 'high',
        }
      break

    case 'debtToEbitda':
      if (valor > 10)
        return {
          isValid: false,
          warning: 'Dívida/EBITDA > 10x indica stress extremo',
          severity: 'critical',
        }
      if (valor > 7)
        return {
          isValid: true,
          warning: 'Dívida/EBITDA > 7x é alto para utilities',
          severity: 'high',
        }
      break

    case 'roe':
      if (valor > 40)
        return {
          isValid: false,
          warning: 'ROE > 40% pode indicar evento não recorrente',
          severity: 'critical',
        }
      if (valor < 0)
        return {
          isValid: true,
          warning: 'ROE negativo indica prejuízo',
          severity: 'high',
        }
      break

    case 'capexOverRevenue':
      if (valor > 50)
        return {
          isValid: false,
          warning: 'CapEx > 50% pode ser insustentável',
          severity: 'critical',
        }
      if (valor > 35)
        return {
          isValid: true,
          warning: 'CapEx > 35% é muito alto',
          severity: 'medium',
        }
      break

    case 'endividamento':
      if (valor > 90)
        return {
          isValid: false,
          warning: 'Endividamento > 90% é extremo',
          severity: 'critical',
        }
      break

    case 'pl':
      if (valor > 100)
        return {
          isValid: false,
          warning: 'P/L > 100x pode indicar erro nos dados',
          severity: 'critical',
        }
      if (valor < 0)
        return {
          isValid: false,
          warning: 'P/L negativo indica prejuízo',
          severity: 'high',
        }
      break
  }

  return { isValid: true }
}

export function RatingsUtilities(props: RatingsUtilitiesProps) {
  // ✅ CORRIGIDO: Constrói complementares específicos para Utilities
  const complementares = buildUtilitiesComplementares(props)

  console.log('🔧 Utilities Complementares:', complementares)

  // ✅ ADICIONADO: Validação geral no início
  const globalValidationIssues: ValidationResult[] = []
  Object.keys(complementares).forEach((chave) => {
    const valor = complementares[chave as keyof typeof complementares]
    if (!isNaN(valor as number)) {
      const validation = validateUtilitiesIndicator(chave, valor as number)
      if (!validation.isValid || (validation.warning && validation.severity === 'critical')) {
        globalValidationIssues.push({ ...validation, warning: `${chave}: ${validation.warning}` })
      }
    }
  })

  const categorias: Record<string, Categoria[]> = {
    'Múltiplos de Valuation': [
      {
        label: 'P/L',
        chave: 'pl',
        valor: props.pl,
        anterior: props.plAnoAnterior,
        icon: '💲',
        description: 'Preço sobre Lucro - Utilities tipicamente 12-20x',
      },
      {
        label: 'Earnings Yield',
        chave: 'earningsYield',
        valor: props.earningsYield,
        anterior: props.earningsYieldAnoAnterior,
        icon: '📊',
        description: 'Rendimento dos lucros (1/P/L) - Meta: >5%',
      },
      {
        label: 'P/VPA',
        chave: 'pb',
        valor: props.pb,
        anterior: props.pbAnoAnterior,
        icon: '🏦',
        description: 'Preço sobre Valor Patrimonial - Utilities: 1.0-1.8x',
      },
      {
        label: 'P/S',
        chave: 'ps',
        valor: props.ps,
        anterior: props.psAnoAnterior,
        icon: '💰',
        description: 'Preço sobre Vendas - Estável para Utilities',
      },
    ],

    'Dividendos e Renda': [
      {
        label: 'Dividend Yield',
        chave: 'dividendYield',
        valor: props.dividendYield,
        anterior: props.dividendYieldAnoAnterior,
        icon: '💰',
        description: 'Rendimento de dividendos - Core para Utilities (Meta: 3-7%)',
      },
      {
        label: 'Payout Ratio',
        chave: 'payoutRatio',
        valor: props.payoutRatio,
        anterior: props.payoutRatioAnoAnterior,
        icon: '💸',
        description: '% dos lucros distribuídos - Utilities: 60-85%',
      },
      {
        label: 'Crescimento Dividendo 5Y',
        chave: 'dividendCagr5y',
        valor: props.dividendCagr5y,
        anterior: props.dividendCagr5yAnoAnterior,
        icon: '📈',
        description: 'Crescimento anual dos dividendos - Estabilidade importante',
      },
      {
        label: 'Consistência Dividendos',
        chave: 'dividendConsistency',
        valor: props.dividendConsistency || 'N/A',
        anterior: props.dividendConsistencyAnoAnterior,
        icon: '🎯',
        description: 'Histórico de pagamentos consistentes',
      },
    ],

    Rentabilidade: [
      {
        label: 'ROE',
        chave: 'roe',
        valor: props.roe,
        anterior: props.roeAnoAnterior,
        icon: '📈',
        description: 'Retorno sobre Patrimônio - Utilities: 8-15%',
      },
      {
        label: 'ROIC',
        chave: 'roic',
        valor: props.roic,
        anterior: props.roicAnoAnterior,
        icon: '🎯',
        description: 'Retorno sobre Capital Investido - Eficiência em infraestrutura',
      },
      {
        label: 'ROE Regulatório',
        chave: 'regulatoryROE',
        valor: props.regulatoryROE || 'N/A',
        anterior: props.regulatoryROEAnoAnterior,
        icon: '⚖️',
        description: 'ROE permitido pelo regulador - Específico de Utilities',
      },
      {
        label: 'Margem EBITDA',
        chave: 'margemEbitda',
        valor: props.margemEbitda,
        anterior: props.margemEbitdaAnoAnterior,
        icon: '⚙️',
        description: 'Margem EBITDA - Utilities: 25-40%',
      },
      {
        label: 'Margem Operacional',
        chave: 'margemOperacional',
        valor: props.margemOperacional,
        anterior: props.margemOperacionalAnoAnterior,
        icon: '🔧',
        description: 'Margem Operacional - Estabilidade operacional',
      },
      {
        label: 'Margem Líquida',
        chave: 'margemLiquida',
        valor: props.margemLiquida,
        anterior: props.margemLiquidaAnoAnterior,
        icon: '💎',
        description: 'Margem Líquida - Resultado final',
      },
    ],

    'Estrutura Financeira': [
      {
        label: 'Endividamento',
        chave: 'endividamento',
        valor: props.endividamento,
        anterior: props.endividamentoAnoAnterior,
        icon: '⚠️',
        description: 'Endividamento - Utilities: 45-65% (normal para o setor)',
      },
      {
        label: 'Dívida/EBITDA',
        chave: 'debtToEbitda',
        valor: props.debtToEbitda,
        anterior: props.debtToEbitdaAnoAnterior,
        icon: '📊',
        description: 'Múltiplo de endividamento - Meta: <5.5x',
      },
      {
        label: 'Cobertura de Juros',
        chave: 'coberturaJuros',
        valor: props.coberturaJuros,
        anterior: props.coberturaJurosAnoAnterior,
        icon: '🛡️',
        description: 'Capacidade de pagamento de juros - CRÍTICO (Meta: >2.5x)',
      },
      {
        label: 'Liquidez Corrente',
        chave: 'liquidezCorrente',
        valor: props.liquidezCorrente,
        anterior: props.liquidezCorrenteAnoAnterior,
        icon: '💧',
        description: 'Liquidez de curto prazo - Menos crítico para Utilities',
      },
    ],

    'Eficiência e Investimentos': [
      {
        label: 'Giro do Ativo',
        chave: 'giroAtivo',
        valor: props.giroAtivo,
        anterior: props.giroAtivoAnoAnterior,
        icon: '🔄',
        description: 'Eficiência no uso dos ativos - Utilities: 0.3-0.5x',
      },
      {
        label: 'CapEx/Receita',
        chave: 'capexOverRevenue',
        valor: props.capexOverRevenue,
        anterior: props.capexOverRevenueAnoAnterior,
        icon: '🔧',
        description: 'Investimento em infraestrutura - Utilities: 15-25%',
      },
      {
        label: 'Idade Média dos Ativos',
        chave: 'assetAge',
        valor: props.assetAge || 'N/A',
        anterior: props.assetAgeAnoAnterior,
        icon: '⏰',
        description: 'Idade da infraestrutura - Impacta necessidade de CapEx',
      },
    ],

    Crescimento: [
      {
        label: 'Crescimento Receita',
        chave: 'crescimentoReceita',
        valor: props.crescimentoReceita,
        anterior: props.crescimentoReceitaAnoAnterior,
        icon: '📈',
        description: 'Taxa de crescimento da receita - Utilities: 2-6%',
      },
      {
        label: 'Crescimento EPS',
        chave: 'crescimentoEps',
        valor: props.crescimentoEps,
        anterior: props.crescimentoEpsAnoAnterior,
        icon: '📊',
        description: 'Crescimento do lucro por ação',
      },
      {
        label: 'Crescimento Rate Base',
        chave: 'rateBaseGrowth',
        valor: props.rateBaseGrowth || 'N/A',
        anterior: props.rateBaseGrowthAnoAnterior,
        icon: '🏗️',
        description: 'Crescimento da base tarifária - Específico de Utilities',
      },
    ],

    'Métricas Específicas de Utilities': [
      {
        label: 'Free Cash Flow',
        chave: 'fcf',
        valor: props.fcf,
        anterior: props.fcfAnoAnterior,
        icon: '💵',
        description: 'Fluxo de Caixa Livre após CapEx',
      },
      {
        label: 'Fator de Capacidade',
        chave: 'capacityFactor',
        valor: props.capacityFactor || 'N/A',
        anterior: props.capacityFactorAnoAnterior,
        icon: '⚡',
        description: 'Eficiência de geração - Para empresas de energia',
      },
      {
        label: '% Energias Renováveis',
        chave: 'renewablePercentage',
        valor: props.renewablePercentage || 'N/A',
        anterior: props.renewablePercentageAnoAnterior,
        icon: '🌱',
        description: 'Sustentabilidade - Importante para ESG',
      },
      ...(props.leveredDcf && props.leveredDcf !== 'N/A' && parseFloat(props.leveredDcf) > 0
        ? [
            {
              label: 'DCF vs Preço',
              chave: 'dcfUpside',
              valor: calculateDCFUpside(props.leveredDcf, props.precoAtual),
              icon: '🎲',
              description: 'Potencial de valorização baseado no DCF',
            },
          ]
        : []),
    ],
  }

  // ✅ MELHORADO: Formatação robusta como Technology
  const formatValue = (valor: string, chave: string) => {
    if (!valor || valor === 'N/A' || valor.trim() === '') return 'N/A'

    const cleanValue = valor.replace('%', '').trim()
    const num = parseFloat(cleanValue)
    if (isNaN(num)) return valor

    // Percentuais
    if (
      [
        'roe',
        'roic',
        'regulatoryROE',
        'margemEbitda',
        'margemOperacional',
        'margemLiquida',
        'endividamento',
        'dividendYield',
        'payoutRatio',
        'dividendCagr5y',
        'crescimentoReceita',
        'crescimentoEps',
        'rateBaseGrowth',
        'earningsYield',
        'capexOverRevenue',
        'renewablePercentage',
      ].includes(chave)
    ) {
      return `${num.toFixed(2)}%`
    }

    // Upside/Downside DCF
    if (chave === 'dcfUpside') {
      return num > 0 ? `+${num.toFixed(1)}%` : `${num.toFixed(1)}%`
    }

    // Valores monetários (FCF)
    if (['fcf'].includes(chave)) {
      if (Math.abs(num) > 1000000000) {
        return `${(num / 1000000000).toFixed(1)}B`
      }
      if (Math.abs(num) > 1000000) {
        return `${(num / 1000000).toFixed(1)}M`
      }
      return `${num.toFixed(0)}`
    }

    // Anos (Asset Age)
    if (chave === 'assetAge') {
      return `${num.toFixed(1)} anos`
    }

    // Fatores (Capacity Factor)
    if (chave === 'capacityFactor') {
      return `${num.toFixed(1)}%`
    }

    // Ratios e múltiplos
    return num.toFixed(2)
  }

  return (
    <CategoriasLayout
      categorias={categorias}
      setor="utilities"
      formatValue={formatValue}
      complementares={complementares}
    />
  )
}
