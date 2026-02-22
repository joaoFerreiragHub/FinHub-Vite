import { CategoriasLayout } from './CategoriasLayout'
// src/components/ratings/RatingsREITs.tsx

import {
  buildRealEstateComplementares,
  RatingsREITsProps,
} from '@/features/tools/stocks/utils/complementares/realEstateComplementares'

export function RatingsREITs(props: RatingsREITsProps) {
  // ✅ NOVO: Constrói complementares específicos para REITs
  const complementares = buildRealEstateComplementares(props)

  console.log('🏢 REITs Complementares:', complementares)

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
    'Rentabilidade e Dividendos': [
      {
        label: 'Dividend Yield',
        chave: 'dividendYield',
        valor: props.dividendYield,
        anterior: props.dividendYieldAnoAnterior,
        icon: '💰',
        description: 'Rendimento real de dividendos sobre o preço da ação',
      },
      {
        // ✅ ATUALIZADO: Label e descrição corretos
        label: 'Dividend CAGR',
        chave: 'dividendCagr5y',
        valor: props.dividendCagr5y,
        anterior: props.dividendCagr5yAnoAnterior,
        icon: '📈',
        description: 'Taxa de crescimento real dos dividendos nos últimos anos',
      },
      {
        // ✅ ATUALIZADO: Descrição mais precisa
        label: 'FFO Payout Ratio',
        chave: 'ffoPayoutRatio',
        valor: props.ffoPayoutRatio,
        anterior: props.ffoPayoutRatioAnoAnterior,
        icon: '📊',
        description: '% do FFO distribuído como dividendos - métrica principal para REITs',
      },
    ],

    'Múltiplos Específicos REITs': [
      {
        label: 'P/VPA',
        chave: 'pVpa',
        valor: props.pVpa,
        anterior: props.pVpaAnoAnterior,
        icon: '💲',
        description: 'Preço sobre Valor Patrimonial por Ação',
      },
      {
        // ✅ ATUALIZADO: Label e descrição para P/FFO real
        label: 'P/FFO',
        chave: 'pFfo',
        valor: props.pFfo,
        anterior: props.pFfoAnoAnterior,
        icon: '⚖️',
        description: 'Múltiplo principal para REITs - Preço sobre FFO real (equivalente ao P/L)',
      },
    ],

    'Performance Operacional REITs': [
      {
        // ✅ ATUALIZADO: Descrição mais precisa
        label: 'Margem EBITDA (proxy Ocupação)',
        chave: 'ocupacao',
        valor: props.ocupacao,
        anterior: props.ocupacaoAnoAnterior,
        icon: '🏢',
        description:
          'Margem EBITDA como proxy para eficiência operacional (ocupação real não disponível)',
      },
      {
        label: 'ROA (proxy Cap Rate)',
        chave: 'capRate',
        valor: props.capRate,
        anterior: props.capRateAnoAnterior,
        icon: '🎯',
        description: 'Retorno sobre Ativos como proxy para taxa de capitalização dos imóveis',
      },
      ...(props.noi && parseFloat(props.noi) !== 0
        ? [
            {
              label: 'Crescimento Receita (proxy NOI)',
              chave: 'noi',
              valor: props.noi,
              anterior: props.noiAnoAnterior,
              icon: '📊',
              description: 'Taxa de crescimento da receita como proxy para crescimento NOI',
            },
          ]
        : []),
    ],

    'Fluxo de Caixa REITs': [
      {
        // ✅ ATUALIZADO: Label e descrição para FFO real
        label: 'FFO (Funds From Operations)',
        chave: 'ffo',
        valor: props.ffo,
        anterior: props.ffoAnoAnterior,
        icon: '💵',
        description: 'Funds From Operations - métrica de cash flow principal para REITs',
      },
      {
        // ✅ ATUALIZADO: Label e descrição para AFFO real
        label: 'AFFO (Adjusted FFO)',
        chave: 'affo',
        valor: props.affo,
        anterior: props.affoAnoAnterior,
        icon: '💎',
        description: 'Adjusted FFO - FFO menos CapEx normalizado, cash flow disponível real',
      },
      // ✅ NOVO: FFO per Share (se disponível)
      ...(props.ffoPerShare && parseFloat(props.ffoPerShare) !== 0
        ? [
            {
              label: 'FFO per Share',
              chave: 'ffoPerShare',
              valor: props.ffoPerShare,
              anterior: props.ffoPerShareAnoAnterior,
              icon: '💸',
              description: 'FFO por ação - base para cálculo de dividendos e avaliação',
            },
          ]
        : []),
      // ✅ NOVO: AFFO per Share (se disponível)
      ...(props.affoPerShare && parseFloat(props.affoPerShare) !== 0
        ? [
            {
              label: 'AFFO per Share',
              chave: 'affoPerShare',
              valor: props.affoPerShare,
              anterior: props.affoPerShareAnoAnterior,
              icon: '💎',
              description: 'AFFO por ação - cash flow disponível real por ação',
            },
          ]
        : []),
    ],

    'Estrutura Financeira': [
      {
        label: 'Cobertura de Dividendos (FFO/Div)',
        chave: 'coberturaJuros',
        valor: props.coberturaJuros,
        anterior: props.coberturaJurosAnoAnterior,
        icon: '🛡️',
        description: 'Cobertura de dividendos baseada em FFO - capacidade de manter dividendos',
      },
      {
        label: 'Dívida/EBITDA',
        chave: 'dividaEbitda',
        valor: props.dividaEbitda,
        anterior: props.dividaEbitdaAnoAnterior,
        icon: '⚠️',
        description: 'Alavancagem operacional - REITs tipicamente operam com mais dívida',
      },
      {
        label: 'Liquidez Corrente',
        chave: 'liquidezCorrente',
        valor: props.liquidezCorrente,
        anterior: props.liquidezCorrenteAnoAnterior,
        icon: '💧',
        description: 'Capacidade de pagamento de obrigações de curto prazo',
      },
    ],

    // ✅ ATUALIZADO: Só mostra categoria se houver dados válidos
    ...(props.navDiscount || props.retentionRate
      ? {
          'Gestão de Capital': [
            ...(props.navDiscount && parseFloat(props.navDiscount) !== 0
              ? [
                  {
                    label: 'NAV Discount/Premium',
                    chave: 'navDiscount',
                    valor: props.navDiscount,
                    anterior: props.navDiscountAnoAnterior,
                    icon: '🎲',
                    description: 'Desconto/Prémio ao Valor Patrimonial Líquido dos imóveis',
                  },
                ]
              : []),
            ...(props.retentionRate && parseFloat(props.retentionRate) !== 0
              ? [
                  {
                    label: 'Retention Rate',
                    chave: 'retentionRate',
                    valor: props.retentionRate,
                    anterior: props.retentionRateAnoAnterior,
                    icon: '🔒',
                    description: 'Taxa de retenção de capital para reinvestimento e crescimento',
                  },
                ]
              : []),
          ],
        }
      : {}),
  }

  // ✅ MELHORADO: Função para formatar valores com mais precisão
  const formatValue = (valor: string, chave: string) => {
    // Tratar casos especiais primeiro
    if (!valor || valor === 'N/A' || valor === 'undefined') return 'N/A'

    // Limpar o valor primeiro (remover % se existir)
    const cleanValue = valor.replace('%', '').trim()
    const num = parseFloat(cleanValue)

    if (isNaN(num)) return valor

    // Valores em percentual - melhor precisão
    if (
      ['dividendYield', 'dividendCagr5y', 'ffoPayoutRatio', 'ocupacao', 'capRate', 'noi'].includes(
        chave,
      )
    ) {
      return `${num.toFixed(2)}%`
    }

    // Cobertura de dividendos - formato especial
    if (chave === 'coberturaJuros') {
      return `${num.toFixed(2)}x`
    }

    // Valores monetários grandes (FFO, AFFO) - preservar formato original
    if (['ffo', 'affo'].includes(chave)) {
      // Se o valor original já contém formatação, preservar
      if (typeof valor === 'string' && (valor.includes('B') || valor.includes('M'))) {
        return valor
      }

      // Senão, formatar baseado no tamanho
      if (Math.abs(num) >= 1000000000) {
        return `${(num / 1000000000).toFixed(1)}B`
      }
      if (Math.abs(num) >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`
      }
      if (Math.abs(num) >= 1000) {
        return `${(num / 1000).toFixed(1)}K`
      }
      return num.toFixed(2)
    }

    // ✅ NOVO: FFO/AFFO per Share - formato monetário
    if (['ffoPerShare', 'affoPerShare'].includes(chave)) {
      return `$${num.toFixed(2)}`
    }

    // Ratios e outros valores
    if (['pVpa', 'pFfo', 'dividaEbitda', 'liquidezCorrente'].includes(chave)) {
      return num.toFixed(2)
    }

    // Default: 2 casas decimais
    return num.toFixed(2)
  }

  return (
    <CategoriasLayout
      categorias={categorias}
      setor="Real Estate"
      formatValue={formatValue}
      complementares={complementares}
    />
  )
}
