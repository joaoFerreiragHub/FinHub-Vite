export interface IndicadorMeta {
  label: string
  chave: string // <– sem union aqui
  ajustarComDelta?: boolean
  setorSensível?: boolean
  complementar?: string[]
  peso?: number
  apenasInformativo?: boolean
  explicacaoAuto?: boolean
  explicacaoCustom?: string | ((ctx: IndicadorExplicacaoContexto) => string)
}

export interface IndicadorExplicacaoContexto {
  valor: string | number
  valorAnterior?: string | number
  score: 'good' | 'medium' | 'bad'
  meta: IndicadorMeta
}

// src/sections/indicadoresMeta/indicadoresMetaTech.ts
export const indicadoresMetaTech: IndicadorMeta[] = [
  {
    label: 'P&D / Receita',
    chave: 'investimentoPD',
    peso: 1.5,
    setorSensível: true,
    ajustarComDelta: true,
    // ✅ CORRIGIDO: Só indicadores de Technology
    complementar: ['cagrEps', 'rAnddEfficiency', 'eps'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 2) return `Aumento significativo em P&D (+${delta.toFixed(1)}pp) pode indicar investimento em inovação.`
        if (delta < -2) return `Redução em P&D (${delta.toFixed(1)}pp) pode comprometer competitividade futura.`
      }
      if (!isNaN(atual)) {
        if (atual > 15) return 'P&D muito alto pode indicar sector intensivo em pesquisa ou startup.'
        if (atual < 3) return 'P&D baixo pode ser adequado para empresas maduras com produtos estabelecidos.'
      }
      return ''
    }
  },
  {
    label: 'Eficiência de P&D',
    chave: 'rAnddEfficiency',
    peso: 0.8,
    ajustarComDelta: true,
    // ✅ CORRIGIDO: Só indicadores de Technology
    complementar: ['cagrEps', 'investimentoPD', 'eps'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 2) return 'Eficiência de P&D excelente - cada euro investido gera bom retorno em crescimento.'
        if (v < 0.5) return 'Baixa eficiência de P&D pode indicar má gestão dos investimentos em inovação.'
      }
      return ''
    }
  },
  {
    label: 'CAGR EPS',
    chave: 'cagrEps',
    ajustarComDelta: true,
    peso: 1.3,
    // ✅ CORRIGIDO: Só indicadores de Technology
    complementar: ['investimentoPD', 'eps', 'peg'],
  },
  {
    label: 'EPS',
    chave: 'eps',
    peso: 1,
    ajustarComDelta: true,
    // ✅ CORRIGIDO: Só indicadores de Technology
    complementar: ['pl', 'cagrEps', 'payoutRatio'],
  },
  {
    label: 'ROE',
    chave: 'roe',
    peso: 1,
    ajustarComDelta: true,
    // ✅ CORRIGIDO: Só indicadores de Technology
    complementar: ['debtEquity', 'margemOperacional', 'roic'],
  },
  {
    label: 'ROIC',
    chave: 'roic',
    peso: 1.2,
    ajustarComDelta: true,
    // ✅ CORRIGIDO: Só indicadores de Technology
    complementar: ['margemOperacional', 'freeCashFlow', 'roe'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = Math.abs(atual - anterior)
        if (delta > 30) {
          return `ROIC mudou ${delta.toFixed(1)}pp face ao ano anterior. Pode indicar evento pontual.`
        }
      }
      if (!isNaN(atual)) {
        if (atual > 50) return 'ROIC elevado (>50%) pode refletir eventos não recorrentes. Verifica consistência.'
        if (atual > 30) return 'ROIC muito elevado para Tech. Confirma se é sustentável.'
        if (atual < 5) return 'ROIC baixo pode indicar ineficiência na alocação de capital.'
      }
      return ''
    }
  },
  {
    label: 'Margem Operacional',
    chave: 'margemOperacional',
    peso: 1,
    ajustarComDelta: true,
    // ✅ CORRIGIDO: Só indicadores de Technology
    complementar: ['margemEbitda', 'roe', 'sgaOverRevenue'],
  },
  {
    label: 'Margem EBITDA',
    chave: 'margemEbitda',
    peso: 1,
    ajustarComDelta: true,
    // ✅ CORRIGIDO: Só indicadores de Technology
    complementar: ['freeCashFlow', 'sgaOverRevenue', 'margemOperacional'],
  },
  {
    label: 'Margem Líquida',
    chave: 'margemLiquida',
    peso: 1,
    ajustarComDelta: true,
    // ✅ CORRIGIDO: Só indicadores de Technology
    complementar: ['roe', 'roic', 'margemOperacional'],
  },
  {
    label: 'P/L',
    chave: 'pl',
    peso: 1,
    // ✅ CORRIGIDO: Só indicadores de Technology
    complementar: ['peg', 'eps', 'cagrEps'],
  },
  {
    label: 'PEG',
    chave: 'peg',
    peso: 0.8,
    // ✅ CORRIGIDO: Só indicadores de Technology
    complementar: ['pl', 'cagrEps', 'eps'],
  },
  {
    label: 'P/S',
    chave: 'ps',
    peso: 1,
    // ✅ CORRIGIDO: Só indicadores de Technology
    complementar: ['crescimentoReceita', 'margemBruta'],
  },
  {
    label: 'Margem Bruta',
    chave: 'margemBruta',
    peso: 1,
    ajustarComDelta: true,
    // ✅ CORRIGIDO: Só indicadores de Technology
    complementar: ['ps', 'crescimentoReceita', 'margemOperacional'],
  },
  {
    label: 'Crescimento Receita',
    chave: 'crescimentoReceita',
    peso: 0.8,
    ajustarComDelta: true,
    // ✅ CORRIGIDO: Só indicadores de Technology
    complementar: ['ps', 'investimentoPD', 'cagrEps'],
  },
  {
    label: 'Dívida/EBITDA',
    chave: 'debtToEbitda',
    peso: 0.8,
    ajustarComDelta: true,
    // ✅ CORRIGIDO: Só indicadores de Technology
    complementar: ['freeCashFlow', 'liquidezCorrente', 'debtEquity'],
  },
  {
    label: 'Free Cash Flow',
    chave: 'fcf',
    peso: 1,
    ajustarComDelta: true,
    // ✅ CORRIGIDO: Só indicadores de Technology
    complementar: ['debtToEbitda', 'roic', 'cashFlowOverCapex'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 50000000) return `FCF melhorou significativamente (+${(delta/1000000).toFixed(0)}M). Boa geração de caixa.`
        if (delta < -50000000) return `FCF deteriorou (${(delta/1000000).toFixed(0)}M). Pode indicar investimentos pesados.`
      }
      if (!isNaN(atual)) {
        if (atual > 0) return 'FCF positivo indica geração saudável de caixa após investimentos operacionais.'
        if (atual < 0) return 'FCF negativo pode indicar fase de investimento ou dificuldades operacionais.'
      }
      return ''
    }
  },
  {
    label: 'Cash Flow / CapEx',
    chave: 'cashFlowOverCapex',
    peso: 0.9,
    ajustarComDelta: true,
    // ✅ CORRIGIDO: Só indicadores de Technology
    complementar: ['freeCashFlow', 'crescimentoReceita'],
  },
  {
    label: 'SG&A / Receita',
    chave: 'sgaOverRevenue',
    peso: 0.6,
    ajustarComDelta: true,
    // ✅ CORRIGIDO: Só indicadores de Technology
    complementar: ['margemEbitda', 'margemOperacional'],
  },
  {
    label: 'Payout Ratio',
    chave: 'payoutRatio',
    peso: 0.8,
    // ✅ CORRIGIDO: Só indicadores de Technology
    complementar: ['eps', 'freeCashFlow'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 80) return 'Payout alto pode limitar reinvestimento em crescimento.'
        if (v < 20) return 'Payout baixo permite maior reinvestimento em inovação e crescimento.'
      }
      return ''
    }
  },
  {
    label: 'Beta',
    chave: 'beta',
    peso: 0.5,
    setorSensível: true,
    // ✅ CORRIGIDO: Só indicadores de Technology
    complementar: ['roe', 'liquidezCorrente'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 1.5) return 'Beta alto indica maior volatilidade que o mercado - típico em growth stocks.'
        if (v < 0.8) return 'Beta baixo sugere menor volatilidade - pode indicar empresa mais madura.'
      }
      return ''
    }
  },
  {
    label: 'Dívida / Capitais Próprios',
    chave: 'debtEquity',
    peso: 0.7,
    ajustarComDelta: true,
    // ✅ CORRIGIDO: Só indicadores de Technology
    complementar: ['roe', 'liquidezCorrente', 'debtToEbitda'],
  },
  {
    label: 'Liquidez Corrente',
    chave: 'liquidezCorrente',
    setorSensível: true,
    peso: 0.7,
    // ✅ CORRIGIDO: Só indicadores de Technology
    complementar: ['debtEquity', 'freeCashFlow', 'cashRatio'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 3) return 'Liquidez muito alta pode indicar excesso de cash não produtivo.'
        if (v < 1) return 'Liquidez baixa pode indicar pressão de caixa a curto prazo.'
      }
      return ''
    }
  },
  {
    label: 'Cash Ratio',
    chave: 'cashRatio',
    apenasInformativo: true,
    // ✅ CORRIGIDO: Só indicadores de Technology (mas sempre N/A)
    complementar: ['liquidezCorrente'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 0.5) return 'Cash ratio alto proporciona flexibilidade para oportunidades e crises.'
        if (v < 0.1) return 'Cash ratio baixo pode limitar capacidade de resposta a oportunidades.'
      }
      return ''
    }
  },
]

export const indicadoresMetaHealthcare: IndicadorMeta[] = [
  {
    label: 'P&D / Receita',
    chave: 'investimentoPD',
    peso: 1.5,
    setorSensível: true,
    complementar: ['cagrEps', 'crescimentoReceita'], // mais P&D deve gerar crescimento
  },
  {
    label: 'Margem Bruta',
    chave: 'margemBruta',
    peso: 1,
    complementar: ['ps', 'crescimentoReceita'],
  },
  {
    label: 'Margem EBITDA',
    chave: 'margemEbitda',
    peso: 1,
    complementar: ['fcf', 'margemBruta'],
  },
  {
    label: 'Margem Líquida',
    chave: 'margemLiquida',
    peso: 1,
    ajustarComDelta: true,
    complementar: ['roe', 'roic'],
  },
  {
    label: 'ROIC',
    chave: 'roic',
    peso: 1.2,
    complementar: ['margemLiquida', 'fcf'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      const delta = Math.abs(atual - anterior)
      if (!isNaN(delta) && delta > 30) {
        return `ROIC subiu ${delta.toFixed(1)} p.p. face ao ano anterior. Pode indicar evento pontual.`
      }
      if (!isNaN(atual)) {
        if (atual > 50) return 'ROIC elevado (>50%) pode refletir eventos não recorrentes. Verifica consistência.'
        if (atual > 30) return 'ROIC muito elevado pode refletir ganhos pontuais. Confirma se é consistente.'
      }
      return ''
    }
  },
  {
    label: 'ROE',
    chave: 'roe',
    peso: 1,
    complementar: ['debtEquity', 'pl'], // PL baixo pode inflacionar o ROE
  },
  {
    label: 'P/L',
    chave: 'pl',
    peso: 1,
    complementar: ['peg', 'eps'],
  },
  {
    label: 'P/S',
    chave: 'ps',
    peso: 1,
    complementar: ['margemBruta', 'crescimentoReceita'],
  },
  {
    label: 'Dívida/EBITDA',
    chave: 'debtToEbitda',
    peso: 0.8,
    ajustarComDelta: true,
    complementar: ['fcf', 'liquidezCorrente'],
  },
  {
    label: 'Liquidez Corrente',
    chave: 'liquidezCorrente',
    peso: 0.7,
    setorSensível: true,
    complementar: ['debtEquity', 'fcf'],
    explicacaoCustom: ({ valor }) =>
      `Este valor pode parecer baixo (${valor}), mas empresas de saúde com receitas previsíveis podem operar com menos liquidez.`,
  },
  {
    label: 'Free Cash Flow',
    chave: 'fcf',
    peso: 1,
    complementar: ['debtToEbitda', 'roic'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 0) return 'FCF positivo indica geração saudável de caixa após investimentos operacionais.'
        if (v < 0) return 'FCF negativo pode indicar investimentos pesados ou dificuldades em gerar caixa.'
      }
      return ''
    }
  },
  {
    label: 'CAGR EPS',
    chave: 'cagrEps',
    peso: 1.3,
    ajustarComDelta: true,
    complementar: ['investimentoPD', 'eps'],
  },
  {
    label: 'EPS',
    chave: 'eps',
    peso: 1,
    complementar: ['pl', 'cagrEps'],
  },
  {
    label: 'Beta',
    chave: 'beta',
    peso: 0.5,
    setorSensível: true,
    complementar: ['roe', 'liquidezCorrente'],
  },
  {
    label: 'PEG',
    chave: 'peg',
    peso: 0.8,
    complementar: ['pl', 'cagrEps'],
  },
  {
    label: 'Crescimento Receita',
    chave: 'crescimentoReceita',
    peso: 0.8,
    complementar: ['ps', 'investimentoPD'],
  },
  {
    label: 'Dívida / Capitais Próprios',
    chave: 'debtEquity',
    peso: 0.7,
    complementar: ['roe', 'liquidezCorrente'],
  },{
    label: 'Eficiência de P&D',
    chave: 'rAnddEfficiency',
    peso: 0.8,
    complementar: ['cagrEps', 'investimentoPD'], // mais eficiente, mais retorno por P&D
  },
  {
    label: 'Cash Flow / CapEx',
    chave: 'cashFlowOverCapex',
    peso: 0.9,
    complementar: ['fcf', 'crescimentoReceita'], // sustentabilidade do investimento
  },
  {
    label: 'Receitas Recorrentes (%)',
    chave: 'receitasRecorrentesPercent',
    peso: 0.7,
    complementar: ['liquidezCorrente', 'beta'], // estabilidade e menor risco
  },
  {
    label: 'SG&A / Receita',
    chave: 'sgaOverRevenue',
    peso: 0.6,
    complementar: ['margemEbitda', 'margemOperacional'], // eficiência de custos
  },
  {
    label: 'Margem Operacional',
    chave: 'margemOperacional',
    peso: 1,
    complementar: ['margemEbitda', 'roe'], // operacional vs resultados finais
  },
  {
    label: 'Payout Ratio',
    chave: 'payoutRatio',
    peso: 0.8,
    complementar: ['eps', 'fcf'], // sustentabilidade dos dividendos
  },
]

export const indicadoresMetaReits: IndicadorMeta[] = [
  // === RENTABILIDADE E DIVIDENDOS ===
  {
    label: 'Dividend Yield',
    chave: 'dividendYield',
    peso: 1.5, // Muito importante para REITs
    setorSensível: true,
    ajustarComDelta: true,
    complementar: ['ffoPayoutRatio', 'dividendCagr5y'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 1) return `Yield aumentou ${delta.toFixed(1)}pp. Verifique se é sustentável.`
        if (delta < -1) return `Yield diminuiu ${Math.abs(delta).toFixed(1)}pp. Pode indicar corte ou apreciação do preço.`
      }
      if (!isNaN(atual)) {
        if (atual > 12) return 'Yield muito alto pode indicar stress financeiro ou corte iminente.'
        if (atual < 4) return 'Yield baixo pode indicar REIT de crescimento ou sobrevaloração.'
      }
      return ''
    }
  },
  {
    label: 'Crescimento Dividendo 5Y',
    chave: 'dividendCagr5y',
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['ffoPayoutRatio', 'ffo'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 8) return 'Crescimento consistente de dividendos indica REIT de qualidade.'
        if (v < 0) return 'Crescimento negativo pode indicar dificuldades operacionais ou de mercado.'
      }
      return ''
    }
  },
  {
    label: 'FFO Payout Ratio',
    chave: 'ffoPayoutRatio',
    peso: 1.3,
    ajustarComDelta: true,
    complementar: ['ffo', 'affo'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 95) return 'Payout muito alto limita crescimento e pode comprometer sustentabilidade.'
        if (v < 50) return 'Payout baixo permite reinvestimento e crescimento, mas pode desapontar investidores de renda.'
      }
      return ''
    }
  },

  // === MÚLTIPLOS ESPECÍFICOS ===
  {
    label: 'P/VPA',
    chave: 'pVpa',
    peso: 1,
    complementar: ['navDiscount', 'ocupacao'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 0.8) return 'P/VPA baixo pode indicar oportunidade ou problemas fundamentais.'
        if (v > 1.5) return 'P/VPA alto pode indicar sobrevalorização ou expectativas de crescimento.'
      }
      return ''
    }
  },
  {
    label: 'P/FFO',
    chave: 'pFfo',
    peso: 1,
    complementar: ['ffo', 'affo'],
  },

  // === OPERACIONAIS ===
  {
    label: 'Taxa de Ocupação',
    chave: 'ocupacao',
    peso: 1.4, // Crucial para REITs
    setorSensível: true,
    ajustarComDelta: true,
    complementar: ['noi', 'sameSoreNoi'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 2) return `Ocupação melhorou ${delta.toFixed(1)}pp. Indica demanda forte.`
        if (delta < -2) return `Ocupação caiu ${Math.abs(delta).toFixed(1)}pp. Pode indicar problemas de mercado.`
      }
      if (!isNaN(atual)) {
        if (atual > 98) return 'Ocupação excelente indica imóveis em localizações prime.'
        if (atual < 85) return 'Ocupação baixa pode indicar problemas de localização ou gestão.'
      }
      return ''
    }
  },
  {
    label: 'Cap Rate',
    chave: 'capRate',
    peso: 1,
    complementar: ['ocupacao', 'noi'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 8) return 'Cap Rate alto pode indicar maior risco ou oportunidade de valor.'
        if (v < 4) return 'Cap Rate baixo típico de imóveis prime mas pode limitar retornos.'
      }
      return ''
    }
  },
  {
    label: 'NOI Growth',
    chave: 'noi',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['ocupacao', 'sameSoreNoi'],
  },
  {
    label: 'Same-Store NOI',
    chave: 'sameSoreNoi',
    peso: 1,
    ajustarComDelta: true,
    complementar: ['noi', 'ocupacao'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 5) return 'Crescimento orgânico forte nos imóveis existentes.'
        if (v < 0) return 'Declínio orgânico pode indicar mercado fraco ou problemas operacionais.'
      }
      return ''
    }
  },

  // === FLUXO DE CAIXA ESPECÍFICO ===
  {
    label: 'FFO',
    chave: 'ffo',
    peso: 1.3,
    ajustarComDelta: true,
    complementar: ['affo', 'ffoPayoutRatio'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = ((atual - anterior) / anterior) * 100
        if (delta > 10) return `FFO cresceu ${delta.toFixed(1)}%. Indica melhoria operacional.`
        if (delta < -10) return `FFO caiu ${Math.abs(delta).toFixed(1)}%. Pode comprometer dividendos.`
      }
      return 'FFO é o indicador chave de geração de caixa para REITs.'
    }
  },
  {
    label: 'AFFO',
    chave: 'affo',
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['ffo', 'capex'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 0) return 'AFFO positivo indica capacidade real de distribuição após CapEx.'
        if (v <= 0) return 'AFFO negativo ou zero indica pressão na capacidade de distribuição.'
      }
      return ''
    }
  },

  // === ESTRUTURA FINANCEIRA ===
  {
    label: 'Cobertura de Juros',
    chave: 'coberturaJuros',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['dividaEbitda', 'ffo'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 3) return 'Cobertura confortável proporciona segurança financeira.'
        if (v < 1.2) return 'Cobertura baixa aumenta risco de stress financeiro.'
      }
      return ''
    }
  },
  {
    label: 'Dívida/EBITDA',
    chave: 'dividaEbitda',
    peso: 1,
    ajustarComDelta: true,
    complementar: ['coberturaJuros', 'liquidezCorrente'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 15) return 'Alavancagem muito alta para um REIT, aumenta risco significativamente.'
        if (v < 5) return 'Alavancagem conservadora pode limitar retornos mas reduz risco.'
      }
      return 'REITs tipicamente operam com mais dívida que empresas tradicionais.'
    }
  },
  {
    label: 'Liquidez Corrente',
    chave: 'liquidezCorrente',
    peso: 0.7, // Menos importante para REITs
    complementar: ['dividaEbitda', 'ffo'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 2) return 'Liquidez alta para um REIT pode indicar ineficiência de capital.'
        if (v < 0.5) return 'Liquidez muito baixa pode indicar problemas de fluxo de caixa.'
      }
      return 'REITs precisam de menos liquidez que empresas tradicionais devido aos fluxos previsíveis.'
    }
  },

  // === GESTÃO DE CAPITAL ===
  {
    label: 'NAV Discount/Premium',
    chave: 'navDiscount',
    peso: 0.8,
    complementar: ['pVpa', 'ocupacao'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < -0.2) return 'Trading com desconto significativo ao NAV pode indicar oportunidade.'
        if (v > 0.2) return 'Trading com prémio ao NAV pode indicar sobrevalorização.'
      }
      return ''
    }
  },
  {
    label: 'Retention Rate',
    chave: 'retentionRate',
    peso: 0.9,
    complementar: ['ffoPayoutRatio', 'dividendCagr5y'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 0.3) return 'Boa retenção de capital permite crescimento interno e externo.'
        if (v < 0.1) return 'Baixa retenção pode limitar capacidade de crescimento.'
      }
      return ''
    }
  },
]

export const indicadoresMetaUtilities: IndicadorMeta[] = [
  // === MÚLTIPLOS DE VALUATION ===
  {
    label: 'P/L',
    chave: 'pl',
    peso: 1,
    complementar: ['earningsYield', 'dividendYield'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 12) return 'P/L baixo para utility pode indicar oportunidade ou problemas regulatórios.'
        if (v > 25) return 'P/L alto pode indicar expectations de crescimento ou mercado sobreaquecido.'
      }
      return ''
    }
  },
  {
    label: 'P/VPA',
    chave: 'pb',
    peso: 0.8,
    complementar: ['roe', 'roic'],
  },
  {
    label: 'P/S',
    chave: 'ps',
    peso: 0.7,
    complementar: ['margemLiquida', 'crescimentoReceita'],
  },
  {
    label: 'Earnings Yield',
    chave: 'earningsYield',
    peso: 0.9,
    complementar: ['pl', 'dividendYield'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 8) return 'Earnings yield alto sugere utility subvalorizada ou riscos elevados.'
        if (v < 4) return 'Earnings yield baixo pode indicar sobrevalorização.'
      }
      return ''
    }
  },

  // === RENTABILIDADE ===
  {
    label: 'ROE',
    chave: 'roe',
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['endividamento', 'pb'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 15) return 'ROE alto para utility indica gestão eficiente do capital.'
        if (v < 8) return 'ROE baixo pode refletir ambiente regulatório restritivo.'
      }
      return ''
    }
  },
  {
    label: 'ROIC',
    chave: 'roic',
    peso: 1.3,
    ajustarComDelta: true,
    complementar: ['capexOverRevenue', 'giroAtivo'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 10) return 'ROIC sólido indica eficiência na alocação de capital em infraestrutura.'
        if (v < 5) return 'ROIC baixo pode indicar regulamentação restritiva ou investimentos ineficientes.'
      }
      return ''
    }
  },
  {
    label: 'Margem EBITDA',
    chave: 'margemEbitda',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['margemOperacional', 'endividamento'],
  },
  {
    label: 'Margem Operacional',
    chave: 'margemOperacional',
    peso: 1,
    ajustarComDelta: true,
    complementar: ['margemEbitda', 'capexOverRevenue'],
  },
  {
    label: 'Margem Líquida',
    chave: 'margemLiquida',
    peso: 1,
    ajustarComDelta: true,
    complementar: ['ps', 'roe'],
  },

  // === DIVIDENDOS E DISTRIBUIÇÕES ===
  {
    label: 'Dividend Yield',
    chave: 'dividendYield',
    peso: 1.4, // Muito importante para utilities
    setorSensível: true,
    ajustarComDelta: true,
    complementar: ['payoutRatio', 'coberturaJuros'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 0.5) return `Yield aumentou ${delta.toFixed(1)}pp. Pode indicar stress ou queda no preço.`
        if (delta < -0.5) return `Yield diminuiu ${Math.abs(delta).toFixed(1)}pp. Pode indicar valorização ou corte.`
      }
      if (!isNaN(atual)) {
        if (atual > 7) return 'Yield muito alto pode indicar risco de corte ou problemas financeiros.'
        if (atual < 2.5) return 'Yield baixo pode indicar crescimento ou sobrevalorização.'
      }
      return ''
    }
  },
  {
    label: 'Payout Ratio',
    chave: 'payoutRatio',
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['dividendYield', 'fcf'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 90) return 'Payout muito alto pode comprometer sustentabilidade e crescimento.'
        if (v < 50) return 'Payout conservador proporciona margem de segurança e capacidade de crescimento.'
      }
      return ''
    }
  },
  {
    label: 'Crescimento Dividendo 5Y',
    chave: 'dividendCagr5y',
    peso: 1,
    ajustarComDelta: true,
    complementar: ['payoutRatio', 'crescimentoEps'],
  },

  // === ESTRUTURA FINANCEIRA ===
  {
    label: 'Endividamento',
    chave: 'endividamento',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['coberturaJuros', 'roe'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 70) return 'Endividamento alto típico de utilities, mas aumenta risco financeiro.'
        if (v < 40) return 'Endividamento conservador pode limitar crescimento mas reduz risco.'
      }
      return 'Utilities tipicamente operam com alto endividamento devido aos investimentos em infraestrutura.'
    }
  },
  {
    label: 'Dívida/EBITDA',
    chave: 'debtToEbitda',
    peso: 1,
    ajustarComDelta: true,
    complementar: ['coberturaJuros', 'margemEbitda'],
  },
  {
    label: 'Cobertura de Juros',
    chave: 'coberturaJuros',
    peso: 1.3, // Crucial para utilities
    ajustarComDelta: true,
    complementar: ['endividamento', 'margemEbitda'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 4) return 'Cobertura forte proporciona segurança financeira sólida.'
        if (v < 2) return 'Cobertura baixa aumenta risco de stress financeiro.'
      }
      return ''
    }
  },
  {
    label: 'Liquidez Corrente',
    chave: 'liquidezCorrente',
    peso: 0.7, // Menos crítico para utilities
    complementar: ['endividamento', 'fcf'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 1.5) return 'Liquidez alta para utility pode indicar gestão conservadora de caixa.'
        if (v < 0.8) return 'Liquidez baixa pode indicar gestão agressiva ou problemas de fluxo.'
      }
      return 'Utilities precisam de menos liquidez devido aos fluxos de caixa previsíveis.'
    }
  },

  // === EFICIÊNCIA OPERACIONAL ===
  {
    label: 'Giro do Ativo',
    chave: 'giroAtivo',
    peso: 0.9,
    complementar: ['roic', 'capexOverRevenue'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 0.5) return 'Giro alto indica uso eficiente dos ativos de infraestrutura.'
        if (v < 0.3) return 'Giro baixo pode indicar sobrecapacidade ou ativos subutilizados.'
      }
      return ''
    }
  },
  {
    label: 'CapEx / Receita',
    chave: 'capexOverRevenue',
    peso: 1,
    complementar: ['roic', 'crescimentoReceita'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 30) return 'CapEx muito alto pode pressionar fluxo de caixa e dividendos.'
        if (v < 10) return 'CapEx baixo pode indicar falta de investimento em infraestrutura.'
      }
      return ''
    }
  },

  // === CRESCIMENTO ===
  {
    label: 'Crescimento Receita',
    chave: 'crescimentoReceita',
    peso: 0.8,
    ajustarComDelta: true,
    complementar: ['ps', 'capexOverRevenue'],
  },
  {
    label: 'Crescimento EPS',
    chave: 'crescimentoEps',
    peso: 0.9,
    ajustarComDelta: true,
    complementar: ['roe', 'dividendCagr5y'],
  },

  // === VALUATION VS FUNDAMENTALS ===
  {
    label: 'Levered DCF',
    chave: 'leveredDcf',
    peso: 0.8,
    complementar: ['pl', 'fcf'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 1.2) return 'DCF sugere valor intrínseco significativamente acima do preço atual.'
        if (v < 0.9) return 'DCF sugere possível sobrevalorização da utility.'
      }
      return ''
    }
  },
]

export const indicadoresMetaIndustrials: IndicadorMeta[] = [
  // === RENTABILIDADE E EFICIÊNCIA ===
  {
    label: 'Margem EBITDA',
    chave: 'margemEbitda',
    peso: 1.3,
    ajustarComDelta: true,
    complementar: ['margemOperacional', 'alavancagem'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 20) return 'Margem EBITDA forte indica eficiência operacional excelente.'
        if (v < 10) return 'Margem EBITDA baixa pode indicar pressão competitiva ou ineficiências.'
      }
      return ''
    }
  },
  {
    label: 'ROIC',
    chave: 'roic',
    peso: 1.4, // Muito importante para industrials
    ajustarComDelta: true,
    complementar: ['giroAtivo', 'alavancagem'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 15) return 'ROIC excelente indica alocação de capital muito eficiente.'
        if (v < 8) return 'ROIC baixo sugere dificuldades na geração de retorno sobre o capital.'
      }
      return ''
    }
  },
  {
    label: 'ROE',
    chave: 'roe',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['pb', 'alavancagem'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 18) return 'ROE alto pode indicar uso eficaz de alavancagem financeira.'
        if (v < 10) return 'ROE baixo pode refletir ciclo industrial ou gestão ineficiente.'
      }
      return ''
    }
  },
  {
    label: 'Margem Operacional',
    chave: 'margemOperacional',
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['margemEbitda', 'rotatividadeEstoques'],
  },
  {
    label: 'Margem Líquida',
    chave: 'margemLiquida',
    peso: 1,
    ajustarComDelta: true,
    complementar: ['ps', 'roe'],
  },

  // === ESTRUTURA FINANCEIRA ===
  {
    label: 'Alavancagem Financeira',
    chave: 'alavancagem',
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['coberturaJuros', 'roic'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 4) return 'Alavancagem alta aumenta risco financeiro, especialmente em ciclos econômicos.'
        if (v < 1.5) return 'Alavancagem conservadora pode limitar crescimento mas reduz risco.'
      }
      return ''
    }
  },
  {
    label: 'Cobertura de Juros',
    chave: 'coberturaJuros',
    peso: 1.3,
    ajustarComDelta: true,
    complementar: ['alavancagem', 'margemEbitda'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 5) return 'Cobertura forte proporciona segurança financeira sólida.'
        if (v < 2.5) return 'Cobertura baixa aumenta risco de stress financeiro em ciclos difíceis.'
      }
      return ''
    }
  },
  {
    label: 'Liquidez Corrente',
    chave: 'liquidezCorrente',
    peso: 1,
    ajustarComDelta: true,
    complementar: ['rotatividadeEstoques', 'cicloOperacional'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 2.5) return 'Liquidez alta pode indicar gestão conservadora ou capital mal alocado.'
        if (v < 1.2) return 'Liquidez baixa pode indicar dificuldades de capital de giro.'
      }
      return ''
    }
  },
  {
    label: 'Endividamento',
    chave: 'endividamento',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['coberturaJuros', 'roic'],
  },

  // === EFICIÊNCIA OPERACIONAL ===
  {
    label: 'Rotatividade de Estoques',
    chave: 'rotatividadeEstoques',
    peso: 1.2, // Importante para industrials
    ajustarComDelta: true,
    complementar: ['cicloOperacional', 'margemEbitda'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 8) return 'Rotatividade alta indica gestão eficiente de estoques e demanda forte.'
        if (v < 4) return 'Rotatividade baixa pode indicar estoques obsoletos ou demanda fraca.'
      }
      return ''
    }
  },
  {
    label: 'Giro do Ativo',
    chave: 'giroAtivo',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['roic', 'capexOverRevenue'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 1.5) return 'Giro alto indica uso muito eficiente dos ativos produtivos.'
        if (v < 0.8) return 'Giro baixo pode indicar sobrecapacidade ou ativos subutilizados.'
      }
      return ''
    }
  },
  {
    label: 'Ciclo Operacional',
    chave: 'cicloOperacional',
    peso: 1,
    ajustarComDelta: true,
    complementar: ['rotatividadeEstoques', 'liquidezCorrente'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 90) return 'Ciclo longo pode pressionar fluxo de caixa e capital de giro.'
        if (v < 45) return 'Ciclo curto indica eficiência operacional excelente.'
      }
      return ''
    }
  },
  {
    label: 'CapEx/Receita',
    chave: 'capexOverRevenue',
    peso: 1,
    complementar: ['roic', 'crescimentoReceita'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 8) return 'CapEx alto pode indicar fase de expansão ou modernização.'
        if (v < 3) return 'CapEx baixo pode indicar falta de investimento em capacidade produtiva.'
      }
      return ''
    }
  },

  // === MÚLTIPLOS DE VALUATION ===
  {
    label: 'P/L',
    chave: 'pe',
    peso: 1,
    complementar: ['peg', 'dividendYield'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 10) return 'P/L baixo pode indicar oportunidade ou expectativas pessimistas.'
        if (v > 25) return 'P/L alto pode indicar sobrevalorização ou crescimento esperado.'
      }
      return ''
    }
  },
  {
    label: 'P/VPA',
    chave: 'pb',
    peso: 0.9,
    complementar: ['roe', 'roic'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 1) return 'P/VPA abaixo de 1 pode indicar oportunidade ou problemas estruturais.'
        if (v > 4) return 'P/VPA alto pode indicar sobrevalorização para empresa industrial.'
      }
      return ''
    }
  },
  {
    label: 'P/S',
    chave: 'ps',
    peso: 0.8,
    complementar: ['margemLiquida', 'crescimentoReceita'],
  },
  {
    label: 'PEG',
    chave: 'peg',
    peso: 1.1,
    complementar: ['pe', 'crescimentoEps'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 0.8) return 'PEG baixo sugere oportunidade de valorização considerando o crescimento.'
        if (v > 2) return 'PEG alto pode indicar sobrevalorização vs. crescimento esperado.'
      }
      return ''
    }
  },

  // === DIVIDENDOS E RISCO ===
  {
    label: 'Dividend Yield',
    chave: 'dividendYield',
    peso: 0.9,
    ajustarComDelta: true,
    complementar: ['payoutRatio', 'coberturaJuros'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 5) return 'Yield alto pode indicar stress financeiro ou ciclo industrial baixo.'
        if (v < 1.5) return 'Yield baixo pode indicar foco em crescimento ou sobrevalorização.'
      }
      return ''
    }
  },
  {
    label: 'Payout Ratio',
    chave: 'payoutRatio',
    peso: 0.8,
    ajustarComDelta: true,
    complementar: ['dividendYield', 'fcf'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 80) return 'Payout alto pode comprometer flexibilidade em ciclos difíceis.'
        if (v < 30) return 'Payout baixo proporciona margem de segurança e capacidade de investimento.'
      }
      return ''
    }
  },
  {
    label: 'Beta',
    chave: 'beta',
    peso: 0.7,
    complementar: ['alavancagem', 'roic'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 1.8) return 'Beta alto indica alta volatilidade e sensibilidade ao ciclo econômico.'
        if (v < 0.6) return 'Beta baixo indica estabilidade relativa ao mercado.'
      }
      return ''
    }
  },

  // === CRESCIMENTO ===
  {
    label: 'Crescimento Receita',
    chave: 'crescimentoReceita',
    peso: 1,
    ajustarComDelta: true,
    complementar: ['ps', 'capexOverRevenue'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 10) return 'Crescimento forte pode indicar expansão de mercado ou market share.'
        if (v < 0) return 'Contração pode refletir ciclo industrial ou perda de competitividade.'
      }
      return ''
    }
  },
  {
    label: 'Crescimento EPS',
    chave: 'crescimentoEps',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['roe', 'peg'],
  },

  // === MÉTRICAS ESPECÍFICAS ===
  {
    label: 'Free Cash Flow',
    chave: 'fcf',
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['capexOverRevenue', 'dividendYield'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 0) return 'FCF positivo indica geração de caixa após investimentos necessários.'
        if (v < 0) return 'FCF negativo pode indicar fase de investimento intenso ou problemas operacionais.'
      }
      return ''
    }
  },
  {
    label: 'Eficiência Capital de Giro',
    chave: 'eficienciaCapitalGiro',
    peso: 1,
    complementar: ['rotatividadeEstoques', 'liquidezCorrente'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 80) return 'Gestão muito eficiente do capital de giro.'
        if (v < 60) return 'Oportunidades de melhoria na gestão do capital de giro.'
      }
      return ''
    }
  },
  {
    label: 'Qualidade dos Ativos',
    chave: 'qualidadeAtivos',
    peso: 1.1,
    complementar: ['roic', 'giroAtivo'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 85) return 'Ativos de alta qualidade com excelente produtividade.'
        if (v < 65) return 'Qualidade dos ativos pode estar comprometida.'
      }
      return ''
    }
  },
  {
    label: 'Ciclo Conversão Caixa',
    chave: 'cicloConversaoCaixa',
    peso: 1,
    complementar: ['rotatividadeEstoques', 'liquidezCorrente'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 45) return 'Ciclo de conversão excelente, liberando caixa rapidamente.'
        if (v > 90) return 'Ciclo longo pode pressionar necessidades de capital de giro.'
      }
      return ''
    }
  },
]
export const indicadoresMetaFinancials: IndicadorMeta[] = [
  // === RENTABILIDADE E EFICIÊNCIA ===
  {
    label: 'ROE',
    chave: 'roe',
    peso: 1.4, // Muito importante para bancos
    ajustarComDelta: true,
    complementar: ['alavancagem', 'pvpa'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 18) return 'ROE excelente indica gestão muito eficaz do patrimônio e alavancagem otimizada.'
        if (v < 10) return 'ROE baixo pode indicar ineficiências operacionais ou ambiente regulatório restritivo.'
      }
      return ''
    }
  },
  {
    label: 'Eficiência',
    chave: 'eficiencia',
    peso: 1.3,
    ajustarComDelta: true,
    complementar: ['roe', 'nim'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 45) return 'Eficiência excelente indica controle rigoroso de custos operacionais.'
        if (v > 65) return 'Eficiência baixa sugere estrutura de custos elevada ou baixa produtividade.'
      }
      return ''
    }
  },
  {
    label: 'NIM',
    chave: 'nim',
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['ldr', 'custoCredito'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 4.5) return 'Margem financeira forte indica pricing power e mix de produtos favorável.'
        if (v < 3) return 'Margem baixa pode indicar pressão competitiva ou ambiente de juros desfavorável.'
      }
      return ''
    }
  },
  {
    label: 'ROA',
    chave: 'roa',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['roe', 'alavancagem'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 1.5) return 'ROA alto indica gestão muito eficiente dos ativos do banco.'
        if (v < 0.8) return 'ROA baixo sugere baixa produtividade dos ativos ou problemas operacionais.'
      }
      return ''
    }
  },

  // === SOLIDEZ E CAPITALIZAÇÃO ===
  {
    label: 'Basileia',
    chave: 'basileia',
    peso: 1.3,
    ajustarComDelta: true,
    complementar: ['tier1', 'alavancagem'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 14) return 'Índice forte proporciona margem robusta acima do mínimo regulatório.'
        if (v < 11.5) return 'Próximo ao mínimo regulatório, limitando flexibilidade para crescimento.'
      }
      return ''
    }
  },
  {
    label: 'Tier 1',
    chave: 'tier1',
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['basileia', 'crescimentoCarteira'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 12) return 'Capital principal robusto oferece excelente capacidade de absorção de perdas.'
        if (v < 9.5) return 'Capital principal próximo ao mínimo pode restringir crescimento.'
      }
      return ''
    }
  },

  // === ESTRUTURA DE CAPITAL E RISCO ===
  {
    label: 'Alavancagem',
    chave: 'alavancagem',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['roe', 'basileia'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 12) return 'Alavancagem alta amplifica retornos mas aumenta risco sistêmico.'
        if (v < 8) return 'Alavancagem conservadora pode limitar ROE mas oferece maior segurança.'
      }
      return ''
    }
  },
  {
    label: 'Liquidez',
    chave: 'liquidez',
    peso: 1,
    ajustarComDelta: true,
    complementar: ['ldr', 'beta'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 1.8) return 'Liquidez alta oferece segurança mas pode indicar ativos ociosos.'
        if (v < 1.2) return 'Liquidez baixa pode indicar gestão agressiva ou problemas de funding.'
      }
      return ''
    }
  },
  {
    label: 'Inadimplência',
    chave: 'inadimplencia',
    peso: 1.4, // Crítico para bancos
    ajustarComDelta: true,
    complementar: ['cobertura', 'custoCredito'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 2) return 'Taxa baixa indica excelente qualidade da carteira e políticas de crédito rigorosas.'
        if (v > 4) return 'Taxa elevada sugere deterioração da qualidade de crédito ou ciclo econômico adverso.'
      }
      return ''
    }
  },
  {
    label: 'Cobertura',
    chave: 'cobertura',
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['inadimplencia', 'qualidadeCredito'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 150) return 'Cobertura robusta oferece proteção excelente contra perdas de crédito.'
        if (v < 100) return 'Cobertura insuficiente pode expor o banco a perdas em cenários adversos.'
      }
      return ''
    }
  },
  {
    label: 'Custo do Crédito',
    chave: 'custoCredito',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['inadimplencia', 'nim'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 1.5) return 'Custo baixo indica políticas de crédito conservadoras e boa seleção de clientes.'
        if (v > 3) return 'Custo elevado pode pressionar margens e indicar problemas na carteira.'
      }
      return ''
    }
  },

  // === MÚLTIPLOS DE AVALIAÇÃO ===
  {
    label: 'P/L',
    chave: 'pl',
    peso: 0.9,
    complementar: ['roe', 'dividendYield'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 8) return 'P/L baixo pode indicar oportunidade ou expectativas de deterioração.'
        if (v > 18) return 'P/L alto pode indicar sobrevalorização para o setor bancário.'
      }
      return ''
    }
  },
  {
    label: 'P/VPA',
    chave: 'pvpa',
    peso: 1.1, // Importante para bancos
    complementar: ['roe', 'basileia'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 1) return 'P/VPA baixo pode indicar oportunidade ou problemas fundamentais.'
        if (v > 2.5) return 'P/VPA alto pode indicar sobrevalorização vs. valor contábil.'
      }
      return ''
    }
  },
  {
    label: 'Valuation (DCF)',
    chave: 'leveredDcf',
    peso: 1,
    complementar: ['roe', 'crescimentoCarteira'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 0) return 'DCF positivo indica valor intrínseco calculado para avaliação.'
        return 'Valor de DCF disponível para comparação com preço de mercado.'
      }
      return ''
    }
  },

  // === DIVIDENDOS E RETORNO ===
  {
    label: 'Dividend Yield',
    chave: 'dividendYield',
    peso: 0.9,
    ajustarComDelta: true,
    complementar: ['payoutRatio', 'roe'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 6) return 'Yield alto pode indicar stress ou distribuição insustentável.'
        if (v < 2) return 'Yield baixo pode indicar foco em crescimento ou retenção de capital.'
      }
      return ''
    }
  },
  {
    label: 'Payout Ratio',
    chave: 'payoutRatio',
    peso: 0.8,
    ajustarComDelta: true,
    complementar: ['dividendYield', 'basileia'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 70) return 'Payout alto pode comprometer capacidade de reforçar capital.'
        if (v < 30) return 'Payout baixo oferece flexibilidade para crescimento e fortalecimento patrimonial.'
      }
      return ''
    }
  },

  // === MÉTRICAS ESPECÍFICAS BANCÁRIAS ===
  {
    label: 'LDR',
    chave: 'ldr',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['nim', 'liquidez'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 95) return 'LDR muito alto pode indicar pressão de liquidez ou funding.'
        if (v < 70) return 'LDR baixo pode indicar recursos ociosos ou oportunidades perdidas.'
      }
      return ''
    }
  },
  {
    label: 'Beta',
    chave: 'beta',
    peso: 0.7,
    complementar: ['alavancagem', 'basileia'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 1.8) return 'Beta alto indica maior sensibilidade a ciclos econômicos e stress financeiro.'
        if (v < 0.8) return 'Beta baixo sugere maior estabilidade vs. mercado.'
      }
      return ''
    }
  },
  {
    label: 'Crescimento Carteira',
    chave: 'crescimentoCarteira',
    peso: 1,
    ajustarComDelta: true,
    complementar: ['basileia', 'custoCredito'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 20) return 'Crescimento acelerado pode pressionar capital e qualidade de crédito.'
        if (v < 5) return 'Crescimento baixo pode indicar ambiente competitivo ou políticas restritivas.'
      }
      return ''
    }
  },

  // === MÉTRICAS CALCULADAS ===
  {
    label: 'Qualidade de Crédito',
    chave: 'qualidadeCredito',
    peso: 1.2,
    complementar: ['inadimplencia', 'cobertura'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 85) return 'Score excelente indica carteira de alta qualidade com risco controlado.'
        if (v < 60) return 'Score baixo sugere necessidade de aprimoramento nas políticas de crédito.'
      }
      return ''
    }
  },
  {
    label: 'Solidez Patrimonial',
    chave: 'solidezPatrimonial',
    peso: 1.1,
    complementar: ['roe', 'basileia'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 90) return 'Excelente combinação de rentabilidade e capitalização robusta.'
        if (v < 65) return 'Solidez limitada pode restringir flexibilidade em cenários adversos.'
      }
      return ''
    }
  },
  {
    label: 'Eficiência Ajustada',
    chave: 'eficienciaAjustada',
    peso: 1,
    complementar: ['eficiencia', 'roe'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 80) return 'Gestão operacional muito eficiente com controle rigoroso de custos.'
        if (v < 55) return 'Oportunidades significativas de melhoria na eficiência operacional.'
      }
      return ''
    }
  },
]
export const indicadoresMetaEnergy: IndicadorMeta[] = [
  // === RENTABILIDADE E RETORNO ===
  {
    label: 'P/L',
    chave: 'pe',
    peso: 0.9,
    complementar: ['roe', 'dividendYield'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 8) return 'P/L baixo pode indicar oportunidade ou expectativas de queda nos preços de commodities.'
        if (v > 18) return 'P/L alto pode indicar sobrevalorização em setor cíclico como energia.'
      }
      return ''
    }
  },
  {
    label: 'P/VPA',
    chave: 'pb',
    peso: 0.8,
    complementar: ['roe', 'roic'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 1) return 'P/VPA baixo pode indicar assets undervalued ou deterioração de reservas.'
        if (v > 2) return 'P/VPA alto pode indicar sobrevalorização vs. ativos tangíveis.'
      }
      return ''
    }
  },
  {
    label: 'ROE',
    chave: 'roe',
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['roic', 'dividaEbitda'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 5) return `ROE melhorou ${delta.toFixed(1)}pp - pode refletir ambiente de preços favorável.`
        if (delta < -5) return `ROE deteriorou ${delta.toFixed(1)}pp - pode indicar pressão de commodities.`
      }
      if (!isNaN(atual)) {
        if (atual > 15) return 'ROE forte indica gestão eficaz em ambiente de commodities voláteis.'
        if (atual < 8) return 'ROE baixo pode refletir ambiente de preços desfavorável ou ineficiências.'
      }
      return ''
    }
  },
  {
    label: 'ROIC',
    chave: 'roic',
    peso: 1.3, // Muito importante para capital intensivo
    ajustarComDelta: true,
    complementar: ['capexRevenue', 'freeCashFlow'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 3) return `ROIC melhorou ${delta.toFixed(1)}pp - indica eficiência crescente na alocação de capital.`
        if (delta < -3) return `ROIC deteriorou ${delta.toFixed(1)}pp - pode indicar pressão nos retornos.`
      }
      if (!isNaN(atual)) {
        if (atual > 12) return 'ROIC excelente demonstra alocação eficiente de capital em setor intensivo.'
        if (atual < 8) return 'ROIC baixo indica retornos insuficientes vs. custo de capital.'
      }
      return ''
    }
  },

  // === MARGENS E EFICIÊNCIA ===
  {
    label: 'Margem EBITDA',
    chave: 'margemEbitda',
    peso: 1.4, // Crítico para energia
    ajustarComDelta: true,
    complementar: ['custoProducao', 'roic'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 5) return `Margem EBITDA melhorou ${delta.toFixed(1)}pp - indica controle de custos ou preços favoráveis.`
        if (delta < -5) return `Margem EBITDA deteriorou ${delta.toFixed(1)}pp - pressão de custos ou preços.`
      }
      if (!isNaN(atual)) {
        if (atual > 30) return 'Margem EBITDA forte indica controle de custos e pricing power.'
        if (atual < 20) return 'Margem baixa pode indicar pressão de custos ou preços desfavoráveis.'
      }
      return ''
    }
  },
  {
    label: 'Margem Bruta',
    chave: 'margemBruta',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['margemEbitda', 'custoProducao'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 40) return 'Margem bruta sólida indica estrutura de custos competitiva.'
        if (v < 25) return 'Margem apertada pode limitar flexibilidade em downturns.'
      }
      return ''
    }
  },
  {
    label: 'Margem Líquida',
    chave: 'margemLiquida',
    peso: 1,
    ajustarComDelta: true,
    complementar: ['margemEbitda', 'dividaEbitda'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 15) return 'Margem líquida forte demonstra conversão eficiente de receita em lucro.'
        if (v < 5) return 'Margem baixa pode indicar alta carga tributária ou custos financeiros.'
      }
      return ''
    }
  },

  // === ESTRUTURA DE CAPITAL E SOLVÊNCIA ===
  {
    label: 'Endividamento',
    chave: 'dividaEbitda',
    peso: 1.3, // Crítico para setor cíclico
    ajustarComDelta: true,
    complementar: ['coberturaJuros', 'freeCashFlow'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta < -0.5) return `Endividamento reduziu ${Math.abs(delta).toFixed(1)}x - fortalecimento da estrutura financeira.`
        if (delta > 0.5) return `Endividamento aumentou ${delta.toFixed(1)}x - pode indicar novos investimentos ou stress.`
      }
      if (!isNaN(atual)) {
        if (atual < 2) return 'Alavancagem conservadora oferece flexibilidade em ciclos baixos.'
        if (atual > 3) return 'Endividamento elevado pode ser arriscado em setor volátil.'
      }
      return ''
    }
  },
  {
    label: 'Cobertura de Juros',
    chave: 'coberturaJuros',
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['dividaEbitda', 'margemEbitda'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 1) return `Cobertura melhorou ${delta.toFixed(1)}x - maior segurança financeira.`
        if (delta < -1) return `Cobertura deteriorou ${Math.abs(delta).toFixed(1)}x - pode indicar pressão de EBITDA.`
      }
      if (!isNaN(atual)) {
        if (atual > 5) return 'Cobertura robusta oferece segurança mesmo em cenários adversos.'
        if (atual < 3) return 'Cobertura baixa pode indicar stress financeiro em downturns.'
      }
      return ''
    }
  },
  {
    label: 'Liquidez Corrente',
    chave: 'liquidezCorrente',
    peso: 1,
    ajustarComDelta: true,
    complementar: ['freeCashFlow', 'dividaEbitda'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 1.5) return 'Liquidez adequada para operações e investimentos de curto prazo.'
        if (v < 1.2) return 'Liquidez apertada pode limitar flexibilidade operacional.'
      }
      return ''
    }
  },
  {
    label: 'Dívida/Patrimônio',
    chave: 'debtEquity',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['roe', 'dividaEbitda'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 0.5) return 'Estrutura conservadora minimiza riscos financeiros.'
        if (v > 1.2) return 'Alavancagem alta pode amplificar volatilidade do setor.'
      }
      return ''
    }
  },

  // === FLUXO DE CAIXA E INVESTIMENTOS ===
  {
    label: 'Fluxo de Caixa Livre',
    chave: 'freeCashFlow',
    peso: 1.4, // Crítico para energia
    ajustarComDelta: true,
    complementar: ['capexRevenue', 'dividendYield'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 100000000) return `FCF melhorou significativamente (+${(delta/1000000).toFixed(0)}M). Excelente geração de caixa.`
        if (delta < -100000000) return `FCF deteriorou (${(delta/1000000).toFixed(0)}M). Pode indicar CapEx elevado ou pressão operacional.`
      }
      if (!isNaN(atual)) {
        if (atual > 0) return 'FCF positivo essencial para sustentar dividendos e reduzir dívida.'
        if (atual < 0) return 'FCF negativo indica necessidade de financiamento externo.'
      }
      return ''
    }
  },
  {
    label: 'CapEx/Receita',
    chave: 'capexRevenue',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['freeCashFlow', 'roic'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 5) return `CapEx aumentou ${delta.toFixed(1)}pp - pode indicar ciclo de investimentos.`
        if (delta < -5) return `CapEx reduziu ${Math.abs(delta).toFixed(1)}pp - pode liberar mais FCF.`
      }
      if (!isNaN(atual)) {
        if (atual < 15) return 'CapEx moderado permite maior geração de caixa livre.'
        if (atual > 25) return 'Investimentos altos podem pressionar fluxo de caixa no curto prazo.'
      }
      return ''
    }
  },
  {
    label: 'FCF Yield',
    chave: 'fcfYield',
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['freeCashFlow', 'dividendYield'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 8) return 'FCF Yield alto oferece retorno atrativo vs. valorização.'
        if (v < 4) return 'Yield baixo pode indicar sobrevalorização ou baixa geração de caixa.'
      }
      return ''
    }
  },

  // === DIVIDENDOS E RETORNO ===
  {
    label: 'Dividend Yield',
    chave: 'dividendYield',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['payoutRatio', 'freeCashFlow'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 1) return `Dividend Yield aumentou ${delta.toFixed(1)}pp - pode indicar aumento de dividendos ou queda de preço.`
        if (delta < -1) return `Dividend Yield reduziu ${Math.abs(delta).toFixed(1)}pp - pode indicar corte ou valorização.`
      }
      if (!isNaN(atual)) {
        if (atual > 6) return 'Yield alto atrativo mas deve ser sustentável pelo FCF.'
        if (atual < 3) return 'Yield baixo pode indicar foco em crescimento ou pressão no caixa.'
      }
      return ''
    }
  },
  {
    label: 'Payout Ratio',
    chave: 'payoutRatio',
    peso: 1,
    ajustarComDelta: true,
    complementar: ['dividendYield', 'freeCashFlow'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 60) return 'Payout conservador oferece sustentabilidade em ciclos baixos.'
        if (v > 80) return 'Payout alto pode ser insustentável em downturn de commodities.'
      }
      return ''
    }
  },

  // === VOLATILIDADE E AVALIAÇÃO ===
  {
    label: 'Beta',
    chave: 'beta',
    peso: 0.7,
    setorSensível: true,
    complementar: ['dividaEbitda', 'freeCashFlow'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 1.5) return 'Beta alto reflete volatilidade típica do setor de energia.'
        if (v < 0.8) return 'Beta baixo pode indicar operações mais estáveis ou defensivas.'
      }
      return ''
    }
  },
  {
    label: 'Levered DCF',
    chave: 'leveredDcf',
    peso: 1,
    complementar: ['freeCashFlow', 'roic'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 0) return 'DCF positivo indica valor intrínseco calculado para avaliação.'
        return 'Valor de DCF disponível para comparação com preço de mercado.'
      }
      return ''
    }
  },

  // === MÉTRICAS ESPECÍFICAS DE ENERGIA ===
  {
    label: 'Reservas Provadas',
    chave: 'reservasProvadas',
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['custoProducao', 'capexRevenue'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = ((atual - anterior) / anterior) * 100
        if (delta > 10) return `Reservas aumentaram ${delta.toFixed(1)}% - expansão da base de recursos.`
        if (delta < -10) return `Reservas reduziram ${Math.abs(delta).toFixed(1)}% - pode indicar depleção ou reclassificação.`
      }
      if (!isNaN(atual)) {
        if (atual > 0) return 'Reservas provadas garantem sustentabilidade operacional de longo prazo.'
        return 'Acompanhamento das reservas essencial para avaliação de energia.'
      }
      return ''
    }
  },
  {
    label: 'Custo de Produção',
    chave: 'custoProducao',
    peso: 1.3, // Crítico para competitividade
    ajustarComDelta: true,
    complementar: ['margemEbitda', 'breakEvenPrice'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta < -5) return `Custo reduziu $${Math.abs(delta).toFixed(2)}/barril - melhoria na eficiência operacional.`
        if (delta > 5) return `Custo aumentou $${delta.toFixed(2)}/barril - pode pressionar margens.`
      }
      if (!isNaN(atual)) {
        if (atual < 40) return 'Custo baixo oferece vantagem competitiva e margens robustas.'
        if (atual > 70) return 'Custo alto pode pressionar rentabilidade em cenários de preços baixos.'
      }
      return ''
    }
  },
  {
    label: 'Break-even Price',
    chave: 'breakEvenPrice',
    peso: 1.4, // Crítico para viabilidade
    ajustarComDelta: true,
    complementar: ['custoProducao', 'margemEbitda'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta < -5) return `Break-even melhorou $${Math.abs(delta).toFixed(2)}/barril - maior competitividade.`
        if (delta > 5) return `Break-even deteriorou $${delta.toFixed(2)}/barril - pode indicar pressão de custos.`
      }
      if (!isNaN(atual)) {
        if (atual < 50) return 'Break-even baixo oferece segurança em diversos cenários de preços.'
        if (atual > 80) return 'Break-even alto indica vulnerabilidade a quedas de commodities.'
      }
      return ''
    }
  },

  // === MÉTRICAS CALCULADAS ===
  {
    label: 'Eficiência Operacional',
    chave: 'eficienciaOperacional',
    peso: 1.2,
    complementar: ['margemEbitda', 'roic'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 85) return 'Excelente eficiência operacional com controle de custos rigoroso.'
        if (v < 60) return 'Oportunidades significativas de melhoria na eficiência operacional.'
      }
      return ''
    }
  },
  {
    label: 'Solidez Financeira',
    chave: 'solidezFinanceira',
    peso: 1.3,
    complementar: ['dividaEbitda', 'coberturaJuros'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 90) return 'Estrutura financeira muito sólida para navegar volatilidade do setor.'
        if (v < 65) return 'Solidez limitada pode ser arriscada em ciclos baixos de commodities.'
      }
      return ''
    }
  },
  {
    label: 'Geração de Caixa',
    chave: 'geracaoCaixa',
    peso: 1.4, // Crítico para sustentabilidade
    complementar: ['freeCashFlow', 'dividendYield'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 80) return 'Excelente geração de caixa sustenta dividendos e redução de dívida.'
        if (v < 55) return 'Geração fraca pode comprometer dividendos e flexibilidade financeira.'
      }
      return ''
    }
  },
]
export const indicadoresMetaBasicMaterials: IndicadorMeta[] = [
  // === RENTABILIDADE E RETORNO ===
  {
    label: 'P/E',
    chave: 'pe',
    peso: 0.9,
    complementar: ['roe', 'dividendYield'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 8) return 'P/E baixo pode indicar oportunidade ou expectativas de queda nos preços de commodities.'
        if (v > 25) return 'P/E alto pode indicar sobrevalorização para setor cíclico de materiais básicos.'
      }
      return ''
    }
  },
  {
    label: 'P/B',
    chave: 'pb',
    peso: 1,
    complementar: ['roe', 'roic'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 1.5) return 'P/B baixo pode indicar assets undervalued ou deterioração de ativos.'
        if (v > 3) return 'P/B alto pode indicar sobrevalorização vs. ativos tangíveis.'
      }
      return ''
    }
  },
  {
    label: 'ROE',
    chave: 'roe',
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['roic', 'dividaEbitda'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 5) return `ROE melhorou ${delta.toFixed(1)}pp - pode refletir ciclo favorável de preços.`
        if (delta < -5) return `ROE deteriorou ${delta.toFixed(1)}pp - pressão de commodities ou custos.`
      }
      if (!isNaN(atual)) {
        if (atual > 15) return 'ROE forte indica gestão eficaz em setor cíclico de materiais.'
        if (atual < 8) return 'ROE baixo pode refletir ciclo desfavorável ou ineficiências operacionais.'
      }
      return ''
    }
  },
  {
    label: 'ROIC',
    chave: 'roic',
    peso: 1.3, // Crítico para setor capital-intensivo
    ajustarComDelta: true,
    complementar: ['capexRevenue', 'assetTurnover'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 3) return `ROIC melhorou ${delta.toFixed(1)}pp - eficiência crescente na alocação de capital.`
        if (delta < -3) return `ROIC deteriorou ${delta.toFixed(1)}pp - pressão nos retornos do capital.`
      }
      if (!isNaN(atual)) {
        if (atual > 12) return 'ROIC excelente demonstra uso eficiente de capital em setor intensivo.'
        if (atual < 8) return 'ROIC baixo indica retornos insuficientes vs. custo de capital.'
      }
      return ''
    }
  },

  // === MARGENS E EFICIÊNCIA ===
  {
    label: 'Margem EBITDA',
    chave: 'margemEbitda',
    peso: 1.4, // Crítico para basic materials
    ajustarComDelta: true,
    complementar: ['margemOperacional', 'roic'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 5) return `Margem EBITDA melhorou ${delta.toFixed(1)}pp - controle de custos ou preços favoráveis.`
        if (delta < -5) return `Margem EBITDA deteriorou ${delta.toFixed(1)}pp - pressão de custos ou preços.`
      }
      if (!isNaN(atual)) {
        if (atual > 25) return 'Margem EBITDA forte indica operações eficientes e pricing power.'
        if (atual < 15) return 'Margem baixa pode indicar pressão competitiva ou custos elevados.'
      }
      return ''
    }
  },
  {
    label: 'Margem Bruta',
    chave: 'margemBruta',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['margemEbitda', 'crescimentoReceita'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 35) return 'Margem bruta sólida indica controle de custos diretos eficaz.'
        if (v < 20) return 'Margem apertada pode limitar flexibilidade em downturns.'
      }
      return ''
    }
  },
  {
    label: 'Margem Líquida',
    chave: 'margemLiquida',
    peso: 1,
    ajustarComDelta: true,
    complementar: ['margemEbitda', 'dividaEbitda'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 12) return 'Margem líquida forte demonstra conversão eficiente em lucro final.'
        if (v < 5) return 'Margem baixa pode indicar alta carga tributária ou custos financeiros.'
      }
      return ''
    }
  },
  {
    label: 'Margem Operacional',
    chave: 'margemOperacional',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['margemEbitda', 'roic'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 18) return 'Margem operacional forte indica controle eficaz de custos operacionais.'
        if (v < 8) return 'Margem operacional baixa pode indicar ineficiências ou pressão competitiva.'
      }
      return ''
    }
  },

  // === ESTRUTURA DE CAPITAL E SOLVÊNCIA ===
  {
    label: 'Dívida/EBITDA',
    chave: 'dividaEbitda',
    peso: 1.3, // Crítico para setor cíclico
    ajustarComDelta: true,
    complementar: ['coberturaJuros', 'freeCashFlow'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta < -0.5) return `Endividamento reduziu ${Math.abs(delta).toFixed(1)}x - fortalecimento financeiro.`
        if (delta > 0.5) return `Endividamento aumentou ${delta.toFixed(1)}x - pode indicar investimentos ou stress.`
      }
      if (!isNaN(atual)) {
        if (atual < 2.5) return 'Alavancagem conservadora oferece flexibilidade em ciclos baixos.'
        if (atual > 4) return 'Endividamento elevado pode ser arriscado em setor volátil.'
      }
      return ''
    }
  },
  {
    label: 'Cobertura de Juros',
    chave: 'coberturaJuros',
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['dividaEbitda', 'margemEbitda'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 4) return 'Cobertura robusta oferece segurança financeira em volatilidade.'
        if (v < 2.5) return 'Cobertura baixa pode indicar stress em cenários adversos.'
      }
      return ''
    }
  },
  {
    label: 'Liquidez Corrente',
    chave: 'liquidezCorrente',
    peso: 1,
    ajustarComDelta: true,
    complementar: ['workingCapitalTurnover', 'inventoryTurnover'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 1.5) return 'Liquidez adequada para operações e gestão de inventário.'
        if (v < 1.2) return 'Liquidez apertada pode limitar flexibilidade operacional.'
      }
      return ''
    }
  },
  {
    label: 'Dívida/Patrimônio',
    chave: 'debtEquity',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['roe', 'dividaEbitda'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 0.6) return 'Estrutura conservadora minimiza riscos financeiros.'
        if (v > 1.5) return 'Alavancagem alta pode amplificar volatilidade do setor.'
      }
      return ''
    }
  },

  // === FLUXO DE CAIXA E EFICIÊNCIA DE CAPITAL ===
  {
    label: 'Free Cash Flow',
    chave: 'freeCashFlow',
    peso: 1.3, // Importante para setor capital-intensivo
    ajustarComDelta: true,
    complementar: ['capexRevenue', 'dividendYield'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 50000000) return `FCF melhorou significativamente (+${(delta/1000000).toFixed(0)}M). Forte geração de caixa.`
        if (delta < -50000000) return `FCF deteriorou (${(delta/1000000).toFixed(0)}M). Pode indicar CapEx elevado.`
      }
      if (!isNaN(atual)) {
        if (atual > 0) return 'FCF positivo essencial para sustentar dividendos e crescimento.'
        if (atual < 0) return 'FCF negativo pode indicar ciclo de investimentos pesados.'
      }
      return ''
    }
  },
  {
    label: 'CapEx/Receita',
    chave: 'capexRevenue',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['freeCashFlow', 'roic'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 12) return 'CapEx moderado permite maior geração de FCF.'
        if (v > 20) return 'Investimentos altos podem pressionar caixa no curto prazo.'
      }
      return ''
    }
  },
  {
    label: 'FCF Yield',
    chave: 'fcfYield',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['freeCashFlow', 'dividendYield'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 7) return 'FCF Yield atrativo oferece bom retorno vs. valorização.'
        if (v < 3) return 'Yield baixo pode indicar sobrevalorização ou baixa geração.'
      }
      return ''
    }
  },
  {
    label: 'Working Capital Turnover',
    chave: 'workingCapitalTurnover',
    peso: 1,
    ajustarComDelta: true,
    complementar: ['inventoryTurnover', 'liquidezCorrente'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 8) return 'Excelente eficiência na gestão do capital de giro.'
        if (v < 4) return 'Gestão de capital de giro pode ser otimizada.'
      }
      return ''
    }
  },

  // === CRESCIMENTO E PERFORMANCE ===
  {
    label: 'Crescimento Receita',
    chave: 'crescimentoReceita',
    peso: 1,
    ajustarComDelta: true,
    complementar: ['crescimentoEbitda', 'margemBruta'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 15) return 'Crescimento forte pode indicar expansão de mercado ou preços favoráveis.'
        if (v < 0) return 'Crescimento negativo pode refletir ciclo baixo de commodities.'
      }
      return ''
    }
  },
  {
    label: 'Crescimento EBITDA',
    chave: 'crescimentoEbitda',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['crescimentoReceita', 'margemEbitda'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 20) return 'Crescimento EBITDA forte indica alavancagem operacional positiva.'
        if (v < -10) return 'Contração do EBITDA pode indicar pressão de custos ou preços.'
      }
      return ''
    }
  },

  // === DIVIDENDOS E RETORNO ===
  {
    label: 'Dividend Yield',
    chave: 'dividendYield',
    peso: 1,
    ajustarComDelta: true,
    complementar: ['payoutRatio', 'freeCashFlow'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 5) return 'Yield alto atrativo mas deve ser sustentável pelos fundamentais.'
        if (v < 2) return 'Yield baixo pode indicar foco em reinvestimento ou pressão no caixa.'
      }
      return ''
    }
  },
  {
    label: 'Payout Ratio',
    chave: 'payoutRatio',
    peso: 0.9,
    ajustarComDelta: true,
    complementar: ['dividendYield', 'freeCashFlow'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 50) return 'Payout conservador oferece sustentabilidade em ciclos baixos.'
        if (v > 75) return 'Payout alto pode ser arriscado em setor cíclico.'
      }
      return ''
    }
  },

  // === VOLATILIDADE E AVALIAÇÃO ===
  {
    label: 'Beta',
    chave: 'beta',
    peso: 0.7,
    setorSensível: true,
    complementar: ['dividaEbitda', 'freeCashFlow'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 1.4) return 'Beta alto reflete volatilidade típica de materiais básicos.'
        if (v < 0.9) return 'Beta baixo pode indicar operações mais defensivas.'
      }
      return ''
    }
  },
  {
    label: 'Valuation (DCF)',
    chave: 'leveredDcf',
    peso: 1,
    complementar: ['freeCashFlow', 'roic'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 0) return 'DCF positivo indica valor intrínseco calculado para avaliação.'
        return 'Valor de DCF disponível para comparação com preço de mercado.'
      }
      return ''
    }
  },

  // === MÉTRICAS ESPECÍFICAS DE BASIC MATERIALS ===
  {
    label: 'Inventory Turnover',
    chave: 'inventoryTurnover',
    peso: 1.2, // Importante para gestão de inventário
    ajustarComDelta: true,
    complementar: ['workingCapitalTurnover', 'liquidezCorrente'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 1) return `Giro de inventário melhorou ${delta.toFixed(1)}x - gestão mais eficiente.`
        if (delta < -1) return `Giro deteriorou ${Math.abs(delta).toFixed(1)}x - pode indicar excesso de estoque.`
      }
      if (!isNaN(atual)) {
        if (atual > 8) return 'Giro alto indica gestão eficiente de inventário e demanda forte.'
        if (atual < 4) return 'Giro baixo pode indicar excesso de estoque ou demanda fraca.'
      }
      return ''
    }
  },
  {
    label: 'Asset Turnover',
    chave: 'assetTurnover',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['roic', 'capexRevenue'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 1.2) return 'Giro de ativos forte indica uso eficiente da base de ativos.'
        if (v < 0.8) return 'Giro baixo pode indicar ativos subutilizados ou overcapacity.'
      }
      return ''
    }
  },
  {
    label: 'Capacity Utilization',
    chave: 'capacityUtilization',
    peso: 1.2, // Crítico para basic materials
    ajustarComDelta: true,
    complementar: ['margemEbitda', 'crescimentoReceita'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 5) return `Utilização aumentou ${delta.toFixed(1)}pp - demanda crescente ou otimização.`
        if (delta < -5) return `Utilização reduziu ${Math.abs(delta).toFixed(1)}pp - pode indicar demanda fraca.`
      }
      if (!isNaN(atual)) {
        if (atual > 85) return 'Alta utilização indica demanda forte e operações otimizadas.'
        if (atual < 70) return 'Baixa utilização pode indicar overcapacity ou demanda fraca.'
      }
      return ''
    }
  },

  // === MÉTRICAS CALCULADAS ===
  {
    label: 'Eficiência Operacional',
    chave: 'eficienciaOperacional',
    peso: 1.2,
    complementar: ['margemEbitda', 'roic'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 85) return 'Excelente eficiência operacional com controle de custos rigoroso.'
        if (v < 60) return 'Oportunidades significativas de melhoria na eficiência operacional.'
      }
      return ''
    }
  },
  {
    label: 'Gestão de Capital',
    chave: 'gestaoCapital',
    peso: 1.3,
    complementar: ['inventoryTurnover', 'dividaEbitda'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 90) return 'Excelente gestão de capital com giro eficiente e estrutura sólida.'
        if (v < 65) return 'Gestão de capital pode ser otimizada para melhor eficiência.'
      }
      return ''
    }
  },
  {
    label: 'Geração de Valor',
    chave: 'geracaoValor',
    peso: 1.3,
    complementar: ['freeCashFlow', 'roic'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 80) return 'Excelente geração de valor com FCF positivo e retornos sólidos.'
        if (v < 55) return 'Geração de valor limitada pode comprometer sustentabilidade.'
      }
      return ''
    }
  },
]
export const indicadoresMetaConsumerDefensive: IndicadorMeta[] = [
  // === RENTABILIDADE E RETORNO ===
  {
    label: 'P/L',
    chave: 'pe',
    peso: 0.9,
    complementar: ['roe', 'dividendYield'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 15) return 'P/L baixo pode indicar oportunidade em ação defensiva de qualidade.'
        if (v > 22) return 'P/L alto pode indicar sobrevalorização para setor defensivo.'
      }
      return ''
    }
  },
  {
    label: 'P/VPA',
    chave: 'pb',
    peso: 0.8,
    complementar: ['roe', 'roic'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 2) return 'P/VPA baixo pode indicar empresa defensiva undervalued.'
        if (v > 3) return 'P/VPA alto pode indicar premium por estabilidade defensiva.'
      }
      return ''
    }
  },
  {
    label: 'P/S',
    chave: 'ps',
    peso: 0.8,
    complementar: ['grossMargin', 'receitaCagr3y'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 2) return 'P/S baixo atrativo para empresa com margens estáveis.'
        if (v > 4) return 'P/S alto pode indicar expectativas elevadas de crescimento.'
      }
      return ''
    }
  },
  {
    label: 'ROE',
    chave: 'roe',
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['roic', 'debtEquity'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 3) return `ROE melhorou ${delta.toFixed(1)}pp - fortalecimento da rentabilidade defensiva.`
        if (delta < -3) return `ROE deteriorou ${delta.toFixed(1)}pp - pode indicar pressão competitiva.`
      }
      if (!isNaN(atual)) {
        if (atual > 15) return 'ROE forte indica gestão eficaz em setor defensivo estável.'
        if (atual < 12) return 'ROE baixo pode indicar ineficiências ou margens pressionadas.'
      }
      return ''
    }
  },
  {
    label: 'ROIC',
    chave: 'roic',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['roe', 'grossMargin'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 12) return 'ROIC excelente demonstra vantagens competitivas sustentáveis.'
        if (v < 8) return 'ROIC baixo pode indicar commoditização ou ineficiências.'
      }
      return ''
    }
  },

  // === MARGENS E EFICIÊNCIA ===
  {
    label: 'Margem Bruta',
    chave: 'grossMargin',
    peso: 1.3, // Crítico para defensivos
    ajustarComDelta: true,
    complementar: ['ebitdaMargin', 'ps'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 2) return `Margem bruta melhorou ${delta.toFixed(1)}pp - pode indicar pricing power.`
        if (delta < -2) return `Margem bruta deteriorou ${delta.toFixed(1)}pp - pressão competitiva ou custos.`
      }
      if (!isNaN(atual)) {
        if (atual > 35) return 'Margem bruta forte indica pricing power e diferenciação.'
        if (atual < 25) return 'Margem baixa pode indicar setor commoditizado ou pressão de custos.'
      }
      return ''
    }
  },
  {
    label: 'Margem EBITDA',
    chave: 'ebitdaMargin',
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['grossMargin', 'roic'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 2) return `Margem EBITDA melhorou ${delta.toFixed(1)}pp - operações mais eficientes.`
        if (delta < -2) return `Margem EBITDA deteriorou ${delta.toFixed(1)}pp - pressão operacional.`
      }
      if (!isNaN(atual)) {
        if (atual > 18) return 'Margem EBITDA forte indica operações eficientes e estáveis.'
        if (atual < 12) return 'Margem baixa pode limitar capacidade de investimento e dividendos.'
      }
      return ''
    }
  },
  {
    label: 'Margem Líquida',
    chave: 'margemLiquida',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['ebitdaMargin', 'dividendYield'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 12) return 'Margem líquida sólida sustenta dividendos e crescimento.'
        if (v < 6) return 'Margem baixa pode pressionar sustentabilidade dos dividendos.'
      }
      return ''
    }
  },
  {
    label: 'Margem Operacional',
    chave: 'margemOperacional',
    peso: 1,
    ajustarComDelta: true,
    complementar: ['ebitdaMargin', 'grossMargin'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 15) return 'Margem operacional forte indica controle de custos eficaz.'
        if (v < 8) return 'Margem operacional baixa pode indicar ineficiências.'
      }
      return ''
    }
  },

  // === CRESCIMENTO E ESTABILIDADE ===
  {
    label: 'Crescimento da Receita',
    chave: 'receitaCagr3y',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['grossMargin', 'ps'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 3) return `Crescimento acelerou ${delta.toFixed(1)}pp - pode indicar expansão ou ganho de mercado.`
        if (delta < -3) return `Crescimento desacelerou ${Math.abs(delta).toFixed(1)}pp - pressão competitiva ou maturidade.`
      }
      if (!isNaN(atual)) {
        if (atual > 8) return 'CAGR forte indica crescimento consistente em setor defensivo.'
        if (atual < 3) return 'Crescimento baixo pode indicar maturidade ou pressão competitiva.'
      }
      return ''
    }
  },
  {
    label: 'Crescimento Receita',
    chave: 'crescimentoReceita',
    peso: 0.9,
    ajustarComDelta: true,
    complementar: ['receitaCagr3y', 'grossMargin'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 10) return 'Crescimento forte pode indicar expansão ou ganho de market share.'
        if (v < 2) return 'Crescimento baixo típico de setor maduro e defensivo.'
      }
      return ''
    }
  },
  {
    label: 'Consistência Receita',
    chave: 'consistenciaReceita',
    peso: 1.2, // Importante para defensivos
    ajustarComDelta: true,
    complementar: ['receitaCagr3y', 'beta'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 85) return 'Alta consistência demonstra estabilidade típica de defensivos.'
        if (v < 70) return 'Baixa consistência pode indicar volatilidade inesperada.'
      }
      return ''
    }
  },

  // === ESTRUTURA DE CAPITAL E SOLVÊNCIA ===
  {
    label: 'Dívida/EBITDA',
    chave: 'dividaEbitda',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['coberturaJuros', 'freeCashFlow'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 2) return 'Alavancagem conservadora típica de empresa defensiva.'
        if (v > 3.5) return 'Endividamento elevado pode ser arriscado para defensivo.'
      }
      return ''
    }
  },
  {
    label: 'Cobertura de Juros',
    chave: 'coberturaJuros',
    peso: 1,
    ajustarComDelta: true,
    complementar: ['dividaEbitda', 'ebitdaMargin'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 6) return 'Cobertura robusta oferece segurança financeira.'
        if (v < 3) return 'Cobertura baixa pode pressionar flexibilidade financeira.'
      }
      return ''
    }
  },
  {
    label: 'Liquidez Corrente',
    chave: 'liquidezCorrente',
    peso: 0.9,
    ajustarComDelta: true,
    complementar: ['workingCapitalTurnover', 'inventoryTurnover'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 1.5) return 'Liquidez adequada para operações estáveis.'
        if (v < 1.2) return 'Liquidez apertada pode limitar flexibilidade operacional.'
      }
      return ''
    }
  },
  {
    label: 'Dívida/Patrimônio',
    chave: 'debtEquity',
    peso: 1,
    ajustarComDelta: true,
    complementar: ['roe', 'dividaEbitda'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 0.5) return 'Estrutura conservadora minimiza riscos financeiros.'
        if (v > 1) return 'Alavancagem moderada pode amplificar retornos.'
      }
      return ''
    }
  },

  // === FLUXO DE CAIXA E EFICIÊNCIA ===
  {
    label: 'Free Cash Flow',
    chave: 'freeCashFlow',
    peso: 1.3, // Crítico para dividendos
    ajustarComDelta: true,
    complementar: ['dividendYield', 'payoutRatio'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 20000000) return `FCF melhorou significativamente (+${(delta/1000000).toFixed(0)}M). Sustenta dividendos.`
        if (delta < -20000000) return `FCF deteriorou (${(delta/1000000).toFixed(0)}M). Pode pressionar dividendos.`
      }
      if (!isNaN(atual)) {
        if (atual > 0) return 'FCF positivo essencial para sustentar dividendos defensivos.'
        if (atual < 0) return 'FCF negativo pode comprometer política de dividendos.'
      }
      return ''
    }
  },
  {
    label: 'FCF Yield',
    chave: 'fcfYield',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['freeCashFlow', 'dividendYield'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 6) return 'FCF Yield atrativo oferece retorno defensivo sólido.'
        if (v < 3) return 'Yield baixo pode indicar sobrevalorização defensiva.'
      }
      return ''
    }
  },
  {
    label: 'Working Capital Turnover',
    chave: 'workingCapitalTurnover',
    peso: 0.9,
    ajustarComDelta: true,
    complementar: ['inventoryTurnover', 'liquidezCorrente'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 6) return 'Boa eficiência na gestão do capital de giro.'
        if (v < 3) return 'Gestão de capital de giro pode ser otimizada.'
      }
      return ''
    }
  },
  {
    label: 'Inventory Turnover',
    chave: 'inventoryTurnover',
    peso: 1,
    ajustarComDelta: true,
    complementar: ['workingCapitalTurnover', 'grossMargin'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 10) return 'Giro alto indica gestão eficiente e demanda consistente.'
        if (v < 6) return 'Giro baixo pode indicar excesso de estoque ou demanda fraca.'
      }
      return ''
    }
  },

  // === DIVIDENDOS E RETORNO DEFENSIVO ===
  {
    label: 'Payout Ratio',
    chave: 'payoutRatio',
    peso: 1.2, // Crítico para defensivos
    ajustarComDelta: true,
    complementar: ['dividendYield', 'freeCashFlow'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 10) return `Payout aumentou ${delta.toFixed(1)}pp - pode pressionar sustentabilidade.`
        if (delta < -10) return `Payout reduziu ${Math.abs(delta).toFixed(1)}pp - maior conservadorismo.`
      }
      if (!isNaN(atual)) {
        if (atual < 60) return 'Payout conservador oferece sustentabilidade e crescimento.'
        if (atual > 75) return 'Payout alto pode ser arriscado se lucros caírem.'
      }
      return ''
    }
  },
  {
    label: 'Dividend Yield',
    chave: 'dividendYield',
    peso: 1.3, // Muito importante para defensivos
    ajustarComDelta: true,
    complementar: ['payoutRatio', 'roe'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 1) return `Dividend Yield aumentou ${delta.toFixed(1)}pp - pode indicar aumento de dividendos ou queda de preço.`
        if (delta < -1) return `Dividend Yield reduziu ${Math.abs(delta).toFixed(1)}pp - pode indicar corte ou valorização.`
      }
      if (!isNaN(atual)) {
        if (atual > 4) return 'Yield atrativo para investidores em busca de renda defensiva.'
        if (atual < 2) return 'Yield baixo pode indicar foco em crescimento vs. renda.'
      }
      return ''
    }
  },
  {
    label: 'Crescimento Dividendos',
    chave: 'dividendGrowth',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['dividendYield', 'payoutRatio'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 5) return 'Crescimento forte dos dividendos indica saúde financeira.'
        if (v < 0) return 'Corte de dividendos pode indicar stress financeiro.'
      }
      return ''
    }
  },
  {
    label: 'Anos de Dividendos',
    chave: 'yearsOfDividends',
    peso: 1,
    complementar: ['dividendYield', 'payoutRatio'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 20) return 'Histórico longo demonstra compromisso com dividendos.'
        if (v < 5) return 'Histórico recente pode indicar política em construção.'
      }
      return ''
    }
  },

  // === VOLATILIDADE E AVALIAÇÃO ===
  {
    label: 'Beta',
    chave: 'beta',
    peso: 1.1, // Importante para defensivos
    setorSensível: true,
    complementar: ['consistenciaReceita', 'dividendYield'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta < -0.2) return `Beta reduziu ${Math.abs(delta).toFixed(2)} - menor volatilidade, mais defensivo.`
        if (delta > 0.2) return `Beta aumentou ${delta.toFixed(2)} - maior volatilidade, menos defensivo.`
      }
      if (!isNaN(atual)) {
        if (atual < 0.8) return 'Beta baixo confirma natureza defensiva e baixa volatilidade.'
        if (atual > 1.2) return 'Beta alto pode indicar exposição cíclica inesperada para setor defensivo.'
      }
      return ''
    }
  },
  {
    label: 'Valuation (DCF)',
    chave: 'leveredDcf',
    peso: 1,
    complementar: ['freeCashFlow', 'dividendYield'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 0) return 'DCF positivo indica valor intrínseco calculado para avaliação.'
        return 'Valor de DCF disponível para comparação com preço de mercado.'
      }
      return ''
    }
  },

  // === MÉTRICAS ESPECÍFICAS DE CONSUMER DEFENSIVE ===
  {
    label: 'Market Share',
    chave: 'marketShare',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['brandStrength', 'crescimentoReceita'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 20) return 'Market share significativo oferece poder de negociação.'
        if (v < 5) return 'Market share baixo pode indicar nicho ou vulnerabilidade.'
      }
      return ''
    }
  },
  {
    label: 'Brand Strength',
    chave: 'brandStrength',
    peso: 1,
    ajustarComDelta: true,
    complementar: ['marketShare', 'grossMargin'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 8) return 'Marca forte oferece diferenciação e pricing power.'
        if (v < 6) return 'Marca fraca pode limitar capacidade de diferenciação.'
      }
      return ''
    }
  },
  {
    label: 'Store Count',
    chave: 'storeCount',
    peso: 0.8,
    ajustarComDelta: true,
    complementar: ['crescimentoReceita', 'marketShare'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = ((atual - anterior) / anterior) * 100
        if (delta > 5) return `Expansão de ${delta.toFixed(1)}% na rede indica crescimento.`
        if (delta < -5) return `Redução de ${Math.abs(delta).toFixed(1)}% pode indicar otimização ou dificuldades.`
      }
      if (!isNaN(atual)) {
        if (atual > 0) return 'Rede de lojas oferece presença física e conveniência.'
        return 'Contagem de lojas disponível para análise de expansão.'
      }
      return ''
    }
  },

  // === MÉTRICAS CALCULADAS ===
  {
    label: 'Estabilidade',
    chave: 'estabilidade',
    peso: 1.3,
    complementar: ['beta', 'consistenciaReceita'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 90) return 'Excelente estabilidade com baixa volatilidade e dividendos seguros.'
        if (v < 70) return 'Estabilidade limitada pode não atender perfil defensivo.'
      }
      return ''
    }
  },
  {
    label: 'Qualidade Defensiva',
    chave: 'qualidadeDefensiva',
    peso: 1.4,
    complementar: ['grossMargin', 'roe'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 85) return 'Excelente qualidade defensiva com margens fortes e crescimento.'
        if (v < 60) return 'Qualidade defensiva limitada pode não oferecer proteção adequada.'
      }
      return ''
    }
  },
  {
    label: 'Sustentabilidade Dividendos',
    chave: 'sustentabilidadeDividendos',
    peso: 1.4, // Crítico para defensivos
    complementar: ['payoutRatio', 'freeCashFlow'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 80) return 'Excelente sustentabilidade de dividendos com payout conservador.'
        if (v < 60) return 'Sustentabilidade questionável pode comprometer dividendos futuros.'
      }
      return ''
    }
  },
]
export const indicadoresMetaConsumerCyclical: IndicadorMeta[] = [
  // === RENTABILIDADE E RETORNO ===
  {
    label: 'P/L',
    chave: 'pe',
    peso: 1.0,
    complementar: ['roe', 'crescimentoReceita'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta < -3) return `P/L reduziu ${Math.abs(delta).toFixed(1)}x - pode indicar oportunidade cíclica.`
        if (delta > 3) return `P/L aumentou ${delta.toFixed(1)}x - pode indicar sobrevalorização no ciclo.`
      }
      if (!isNaN(atual)) {
        if (atual < 12) return 'P/L baixo pode indicar oportunidade em empresa cíclica.'
        if (atual > 22) return 'P/L alto pode indicar sobrevalorização para setor cíclico.'
      }
      return ''
    }
  },
  {
    label: 'P/S',
    chave: 'ps',
    peso: 0.9,
    ajustarComDelta: true,
    complementar: ['grossMargin', 'receitaCagr3y'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 1.5) return 'P/S baixo atrativo para empresa cíclica com margens variáveis.'
        if (v > 3) return 'P/S alto pode indicar expectativas otimistas no ciclo atual.'
      }
      return ''
    }
  },
  {
    label: 'P/VPA',
    chave: 'pb',
    peso: 0.8,
    ajustarComDelta: true,
    complementar: ['roe', 'roic'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 2) return 'P/VPA baixo pode indicar oportunidade em downturn cíclico.'
        if (v > 3.5) return 'P/VPA alto pode indicar peak do ciclo econômico.'
      }
      return ''
    }
  },
  {
    label: 'ROE',
    chave: 'roe',
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['roic', 'debtEquity'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 5) return `ROE melhorou ${delta.toFixed(1)}pp - aproveitando upturn cíclico.`
        if (delta < -5) return `ROE deteriorou ${Math.abs(delta).toFixed(1)}pp - pressão do downturn.`
      }
      if (!isNaN(atual)) {
        if (atual > 15) return 'ROE forte indica boa performance no ciclo atual.'
        if (atual < 10) return 'ROE baixo pode indicar downturn ou ineficiências.'
      }
      return ''
    }
  },
  {
    label: 'ROIC',
    chave: 'roic',
    peso: 1.3, // Crítico para avaliar eficiência cíclica
    ajustarComDelta: true,
    complementar: ['roe', 'assetTurnover'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 3) return `ROIC melhorou ${delta.toFixed(1)}pp - eficiência crescente no ciclo.`
        if (delta < -3) return `ROIC deteriorou ${Math.abs(delta).toFixed(1)}pp - pressão cíclica.`
      }
      if (!isNaN(atual)) {
        if (atual > 12) return 'ROIC excelente demonstra vantagens competitivas sustentáveis.'
        if (atual < 8) return 'ROIC baixo pode indicar setor commoditizado ou downturn.'
      }
      return ''
    }
  },

  // === MARGENS E EFICIÊNCIA ===
  {
    label: 'Margem Bruta',
    chave: 'grossMargin',
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['ebitdaMargin', 'rotatividadeEstoques'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 3) return `Margem bruta melhorou ${delta.toFixed(1)}pp - pricing power ou eficiência.`
        if (delta < -3) return `Margem bruta deteriorou ${Math.abs(delta).toFixed(1)}pp - pressão competitiva.`
      }
      if (!isNaN(atual)) {
        if (atual > 30) return 'Margem bruta forte oferece buffer contra volatilidade cíclica.'
        if (atual < 20) return 'Margem baixa pode amplificar volatilidade nos downturns.'
      }
      return ''
    }
  },
  {
    label: 'Margem EBITDA',
    chave: 'ebitdaMargin',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['grossMargin', 'coberturaJuros'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 2) return `Margem EBITDA melhorou ${delta.toFixed(1)}pp - operações mais eficientes.`
        if (delta < -2) return `Margem EBITDA deteriorou ${Math.abs(delta).toFixed(1)}pp - pressão operacional.`
      }
      if (!isNaN(atual)) {
        if (atual > 15) return 'Margem EBITDA forte oferece flexibilidade no downturn.'
        if (atual < 8) return 'Margem baixa pode limitar capacidade de sobreviver ao downturn.'
      }
      return ''
    }
  },
  {
    label: 'Margem Líquida',
    chave: 'margemLiquida',
    peso: 1.0,
    ajustarComDelta: true,
    complementar: ['ebitdaMargin', 'endividamento'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 2) return `Margem líquida melhorou ${delta.toFixed(1)}pp - beneficiando do upturn.`
        if (delta < -2) return `Margem líquida deteriorou ${Math.abs(delta).toFixed(1)}pp - impacto do downturn.`
      }
      if (!isNaN(atual)) {
        if (atual > 8) return 'Margem líquida sólida oferece resiliência cíclica.'
        if (atual < 3) return 'Margem baixa pode ser vulnerável em downturns.'
      }
      return ''
    }
  },
  {
    label: 'Margem Operacional',
    chave: 'margemOperacional',
    peso: 1.0,
    ajustarComDelta: true,
    complementar: ['ebitdaMargin', 'grossMargin'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 10) return 'Margem operacional forte indica controle de custos eficaz.'
        if (v < 5) return 'Margem operacional baixa pode indicar ineficiências.'
      }
      return ''
    }
  },

  // === CRESCIMENTO E PERFORMANCE CÍCLICA ===
  {
    label: 'Crescimento da Receita (3Y)',
    chave: 'receitaCagr3y',
    peso: 1.3, // Importante para avaliar performance através dos ciclos
    ajustarComDelta: true,
    complementar: ['crescimentoReceita', 'marketShare'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 5) return `CAGR acelerou ${delta.toFixed(1)}pp - ganho de market share ou upturn.`
        if (delta < -5) return `CAGR desacelerou ${Math.abs(delta).toFixed(1)}pp - pressão competitiva ou ciclo.`
      }
      if (!isNaN(atual)) {
        if (atual > 8) return 'CAGR forte demonstra crescimento consistente através dos ciclos.'
        if (atual < 3) return 'Crescimento baixo pode indicar maturidade ou perda de competitividade.'
      }
      return ''
    }
  },
  {
    label: 'Crescimento Receita',
    chave: 'crescimentoReceita',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['receitaCagr3y', 'beta'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 10) return `Crescimento acelerou ${delta.toFixed(1)}pp - forte upturn cíclico.`
        if (delta < -10) return `Crescimento desacelerou ${Math.abs(delta).toFixed(1)}pp - início de downturn.`
      }
      if (!isNaN(atual)) {
        if (atual > 15) return 'Crescimento forte indica momentum cíclico positivo.'
        if (atual < 0) return 'Crescimento negativo pode indicar recessão ou perda de mercado.'
      }
      return ''
    }
  },
  {
    label: 'Crescimento EBITDA',
    chave: 'crescimentoEbitda',
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['crescimentoReceita', 'ebitdaMargin'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 20) return 'Crescimento EBITDA explosivo indica alavancagem operacional.'
        if (v < -10) return 'Declínio EBITDA pode indicar pressão severa no downturn.'
      }
      return ''
    }
  },

  // === ESTRUTURA DE CAPITAL E SOLVÊNCIA ===
  {
    label: 'Endividamento (Dívida/EBITDA)',
    chave: 'endividamento',
    peso: 1.4, // Crítico para empresas cíclicas
    ajustarComDelta: true,
    complementar: ['coberturaJuros', 'freeCashFlow'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta < -0.5) return `Endividamento reduziu ${Math.abs(delta).toFixed(1)}x - fortalecimento financeiro.`
        if (delta > 0.5) return `Endividamento aumentou ${delta.toFixed(1)}x - maior risco cíclico.`
      }
      if (!isNaN(atual)) {
        if (atual < 2) return 'Endividamento baixo oferece resiliência em downturns.'
        if (atual > 3.5) return 'Endividamento alto é arriscado para empresa cíclica.'
      }
      return ''
    }
  },
  {
    label: 'Cobertura de Juros',
    chave: 'coberturaJuros',
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['endividamento', 'ebitdaMargin'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 2) return `Cobertura melhorou ${delta.toFixed(1)}x - maior segurança financeira.`
        if (delta < -2) return `Cobertura deteriorou ${Math.abs(delta).toFixed(1)}x - risco crescente.`
      }
      if (!isNaN(atual)) {
        if (atual > 5) return 'Cobertura robusta oferece proteção em downturns.'
        if (atual < 2.5) return 'Cobertura baixa é arriscada para empresa cíclica.'
      }
      return ''
    }
  },
  {
    label: 'Liquidez Corrente',
    chave: 'liquidezCorrente',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['workingCapitalTurnover', 'rotatividadeEstoques'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 0.3) return `Liquidez melhorou ${delta.toFixed(2)} - maior buffer de segurança.`
        if (delta < -0.3) return `Liquidez deteriorou ${Math.abs(delta).toFixed(2)} - pressão de caixa.`
      }
      if (!isNaN(atual)) {
        if (atual > 1.5) return 'Liquidez adequada para navegar volatilidade cíclica.'
        if (atual < 1.2) return 'Liquidez apertada pode ser problemática em downturns.'
      }
      return ''
    }
  },
  {
    label: 'Dívida/Patrimônio',
    chave: 'debtEquity',
    peso: 1.0,
    ajustarComDelta: true,
    complementar: ['roe', 'endividamento'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 0.5) return 'Estrutura conservadora minimiza riscos cíclicos.'
        if (v > 1.5) return 'Alavancagem alta amplifica riscos em downturns.'
      }
      return ''
    }
  },

  // === EFICIÊNCIA OPERACIONAL ===
  {
    label: 'Rotatividade de Estoques',
    chave: 'rotatividadeEstoques',
    peso: 1.3, // Crítico para cíclicas
    ajustarComDelta: true,
    complementar: ['grossMargin', 'workingCapitalTurnover'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 1) return `Giro melhorou ${delta.toFixed(1)}x - gestão mais eficiente.`
        if (delta < -1) return `Giro deteriorou ${Math.abs(delta).toFixed(1)}x - acúmulo de estoques.`
      }
      if (!isNaN(atual)) {
        if (atual > 6) return 'Giro alto indica gestão eficiente e demanda forte.'
        if (atual < 3) return 'Giro baixo pode indicar excesso de estoque ou demanda fraca.'
      }
      return ''
    }
  },
  {
    label: 'Working Capital Turnover',
    chave: 'workingCapitalTurnover',
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['rotatividadeEstoques', 'assetTurnover'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 8) return 'Excelente eficiência na gestão do capital de giro.'
        if (v < 4) return 'Gestão de capital de giro pode ser otimizada.'
      }
      return ''
    }
  },
  {
    label: 'Asset Turnover',
    chave: 'assetTurnover',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['roic', 'workingCapitalTurnover'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 1.2) return 'Asset turnover forte maximiza utilização de ativos.'
        if (v < 0.8) return 'Baixo giro de ativos pode indicar capacidade ociosa.'
      }
      return ''
    }
  },
  {
    label: 'Receivables Turnover',
    chave: 'receivablesTurnover',
    peso: 0.9,
    ajustarComDelta: true,
    complementar: ['workingCapitalTurnover', 'liquidezCorrente'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 12) return 'Cobrança eficiente minimiza risco de inadimplência.'
        if (v < 6) return 'Cobrança lenta pode pressionar fluxo de caixa.'
      }
      return ''
    }
  },

  // === FLUXO DE CAIXA ===
  {
    label: 'Free Cash Flow',
    chave: 'freeCashFlow',
    peso: 1.4, // Muito importante para cíclicas
    ajustarComDelta: true,
    complementar: ['capexRevenue', 'endividamento'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 50000000) return `FCF melhorou significativamente (+${(delta/1000000).toFixed(0)}M). Fortalece posição cíclica.`
        if (delta < -50000000) return `FCF deteriorou (${(delta/1000000).toFixed(0)}M). Pressão no downturn.`
      }
      if (!isNaN(atual)) {
        if (atual > 0) return 'FCF positivo oferece flexibilidade em ciclos adversos.'
        if (atual < 0) return 'FCF negativo pode ser problemático em downturns.'
      }
      return ''
    }
  },
  {
    label: 'FCF Yield',
    chave: 'fcfYield',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['freeCashFlow', 'dividendYield'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 8) return 'FCF Yield atrativo oferece valor em empresa cíclica.'
        if (v < 3) return 'Yield baixo pode indicar sobrevalorização no peak.'
      }
      return ''
    }
  },
  {
    label: 'CapEx/Receita',
    chave: 'capexRevenue',
    peso: 1.0,
    ajustarComDelta: true,
    complementar: ['freeCashFlow', 'assetTurnover'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 2) return `CapEx aumentou ${delta.toFixed(1)}pp - investindo para o próximo ciclo.`
        if (delta < -2) return `CapEx reduziu ${Math.abs(delta).toFixed(1)}pp - conservando caixa.`
      }
      if (!isNaN(atual)) {
        if (atual < 5) return 'CapEx baixo conserva caixa mas pode limitar crescimento.'
        if (atual > 12) return 'CapEx alto pode pressionar FCF em downturns.'
      }
      return ''
    }
  },

  // === DIVIDENDOS E RETORNO ===
  {
    label: 'Dividend Yield',
    chave: 'dividendYield',
    peso: 0.9, // Menos crítico que para defensivos
    ajustarComDelta: true,
    complementar: ['payoutRatio', 'freeCashFlow'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 1) return `Dividend Yield aumentou ${delta.toFixed(1)}pp - pode indicar stress ou oportunidade.`
        if (delta < -1) return `Dividend Yield reduziu ${Math.abs(delta).toFixed(1)}pp - possível corte ou valorização.`
      }
      if (!isNaN(atual)) {
        if (atual > 3) return 'Yield atrativo mas pode ser insustentável em downturns.'
        if (atual < 1) return 'Yield baixo pode indicar foco em crescimento vs. dividendos.'
      }
      return ''
    }
  },
  {
    label: 'Payout Ratio',
    chave: 'payoutRatio',
    peso: 1.0,
    ajustarComDelta: true,
    complementar: ['dividendYield', 'freeCashFlow'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 15) return `Payout aumentou ${delta.toFixed(1)}pp - pode ser insustentável.`
        if (delta < -15) return `Payout reduziu ${Math.abs(delta).toFixed(1)}pp - maior conservadorismo.`
      }
      if (!isNaN(atual)) {
        if (atual < 40) return 'Payout conservador oferece sustentabilidade cíclica.'
        if (atual > 70) return 'Payout alto é arriscado para empresa cíclica.'
      }
      return ''
    }
  },

  // === VOLATILIDADE E AVALIAÇÃO ===
  {
    label: 'Beta',
    chave: 'beta',
    peso: 0.8, // Esperado ser alto em cíclicas
    setorSensível: true,
    complementar: ['receitaCagr3y', 'endividamento'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta < -0.3) return `Beta reduziu ${Math.abs(delta).toFixed(2)} - menor sensibilidade cíclica.`
        if (delta > 0.3) return `Beta aumentou ${delta.toFixed(2)} - maior sensibilidade cíclica.`
      }
      if (!isNaN(atual)) {
        if (atual > 1.2) return 'Beta alto confirma natureza cíclica e alta volatilidade.'
        if (atual < 0.8) return 'Beta baixo pode indicar empresa menos cíclica que o esperado.'
      }
      return ''
    }
  },
  {
    label: 'Valuation (DCF)',
    chave: 'leveredDcf',
    peso: 1.0,
    complementar: ['freeCashFlow', 'pe'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 0) return 'DCF disponível para avaliar valor intrínseco vs. preço cíclico.'
        return 'Valor de DCF calculado considerando volatilidade cíclica.'
      }
      return ''
    }
  },

  // === MÉTRICAS ESPECÍFICAS DE CONSUMER CYCLICAL ===
  {
    label: 'Market Share',
    chave: 'marketShare',
    peso: 1.0,
    ajustarComDelta: true,
    complementar: ['receitaCagr3y', 'grossMargin'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 2) return `Market share ganhou ${delta.toFixed(1)}pp - vantagem competitiva.`
        if (delta < -2) return `Market share perdeu ${Math.abs(delta).toFixed(1)}pp - pressão competitiva.`
      }
      if (!isNaN(atual)) {
        if (atual > 15) return 'Market share significativo oferece poder de mercado.'
        if (atual < 5) return 'Market share baixo pode indicar vulnerabilidade.'
      }
      return ''
    }
  },
  {
    label: 'Sazonalidade',
    chave: 'seasonalityIndex',
    peso: 0.7,
    ajustarComDelta: true,
    complementar: ['liquidezCorrente', 'workingCapitalTurnover'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 80) return 'Alta sazonalidade requer gestão cuidadosa de capital de giro.'
        if (v < 40) return 'Baixa sazonalidade oferece receitas mais estáveis.'
      }
      return ''
    }
  },
  {
    label: 'Confiança do Consumidor',
    chave: 'consumerConfidence',
    peso: 0.8,
    ajustarComDelta: true,
    complementar: ['crescimentoReceita', 'beta'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 70) return 'Alta correlação com confiança indica sensibilidade econômica.'
        if (v < 40) return 'Baixa correlação pode indicar nicho defensivo.'
      }
      return ''
    }
  },

  // === MÉTRICAS CALCULADAS ===
  {
    label: 'Sensibilidade Cíclica',
    chave: 'sensibilidadeCiclica',
    peso: 1.1,
    complementar: ['beta', 'crescimentoReceita'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 85) return 'Alta sensibilidade - maior risco e retorno potencial.'
        if (v < 60) return 'Baixa sensibilidade pode indicar características defensivas.'
      }
      return ''
    }
  },
  {
    label: 'Eficiência Operacional',
    chave: 'eficienciaOperacional',
    peso: 1.2,
    complementar: ['rotatividadeEstoques', 'assetTurnover'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 80) return 'Excelente eficiência maximiza retornos nos upturns.'
        if (v < 50) return 'Baixa eficiência pode amplificar perdas nos downturns.'
      }
      return ''
    }
  },
  {
    label: 'Resiliência Financeira',
    chave: 'resilienciaFinanceira',
    peso: 1.3, // Crítico para sobreviver downturns
    complementar: ['endividamento', 'liquidezCorrente'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 85) return 'Excelente resiliência financeira para navegar downturns severos.'
        if (v < 60) return 'Resiliência limitada pode ser vulnerável em recessões.'
      }
      return ''
    }
  },
]
export const indicadoresMetaCommunicationServices: IndicadorMeta[] = [
  // === RENTABILIDADE E RETORNO ===
  {
    label: 'P/L',
    chave: 'pe',
    peso: 1.0,
    complementar: ['roe', 'crescimentoReceita'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta < -5) return `P/L reduziu ${Math.abs(delta).toFixed(1)}x - pode indicar oportunidade em empresa de comunicação.`
        if (delta > 5) return `P/L aumentou ${delta.toFixed(1)}x - pode indicar sobrevalorização vs. crescimento.`
      }
      if (!isNaN(atual)) {
        if (atual < 20) return 'P/L atrativo para setor de comunicação com crescimento.'
        if (atual > 35) return 'P/L alto pode indicar sobrevalorização para setor de comunicação.'
      }
      return ''
    }
  },
  {
    label: 'P/S',
    chave: 'ps',
    peso: 1.1, // Importante para empresas de comunicação
    ajustarComDelta: true,
    complementar: ['grossMargin', 'receitaCagr3y'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta < -1) return `P/S reduziu ${Math.abs(delta).toFixed(1)}x - pode indicar oportunidade.`
        if (delta > 1) return `P/S aumentou ${delta.toFixed(1)}x - expectativas crescentes.`
      }
      if (!isNaN(atual)) {
        if (atual < 3) return 'P/S atrativo para empresa de comunicação.'
        if (atual > 6) return 'P/S alto pode indicar expectativas otimistas de crescimento.'
      }
      return ''
    }
  },
  {
    label: 'P/VPA',
    chave: 'pb',
    peso: 0.8,
    ajustarComDelta: true,
    complementar: ['roe', 'roic'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 2.5) return 'P/VPA baixo pode indicar oportunidade em empresa de comunicação.'
        if (v > 5) return 'P/VPA alto pode indicar premium por ativos intangíveis.'
      }
      return ''
    }
  },
  {
    label: 'ROE',
    chave: 'roe',
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['roic', 'debtEquity'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 3) return `ROE melhorou ${delta.toFixed(1)}pp - maior eficiência na geração de retorno.`
        if (delta < -3) return `ROE deteriorou ${Math.abs(delta).toFixed(1)}pp - pressão competitiva ou investimentos.`
      }
      if (!isNaN(atual)) {
        if (atual > 20) return 'ROE forte indica excelente rentabilidade em comunicação.'
        if (atual < 12) return 'ROE baixo pode indicar ineficiências ou investimentos pesados.'
      }
      return ''
    }
  },
  {
    label: 'ROIC',
    chave: 'roic',
    peso: 1.3, // Crítico para avaliar eficiência de capital
    ajustarComDelta: true,
    complementar: ['roe', 'capexRevenue'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 2) return `ROIC melhorou ${delta.toFixed(1)}pp - maior eficiência de capital.`
        if (delta < -2) return `ROIC deteriorou ${Math.abs(delta).toFixed(1)}pp - pressão na rentabilidade.`
      }
      if (!isNaN(atual)) {
        if (atual > 15) return 'ROIC excelente demonstra vantagens competitivas sustentáveis.'
        if (atual < 8) return 'ROIC baixo pode indicar setor commoditizado ou ineficiências.'
      }
      return ''
    }
  },

  // === MARGENS E EFICIÊNCIA ===
  {
    label: 'Margem Bruta',
    chave: 'grossMargin',
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['ebitdaMargin', 'ps'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 3) return `Margem bruta melhorou ${delta.toFixed(1)}pp - pricing power ou eficiência.`
        if (delta < -3) return `Margem bruta deteriorou ${Math.abs(delta).toFixed(1)}pp - pressão competitiva.`
      }
      if (!isNaN(atual)) {
        if (atual > 40) return 'Margem bruta forte indica diferenciação e pricing power.'
        if (atual < 25) return 'Margem baixa pode indicar setor commoditizado ou pressão competitiva.'
      }
      return ''
    }
  },
  {
    label: 'Margem EBITDA',
    chave: 'ebitdaMargin',
    peso: 1.3, // Muito importante para comunicação
    ajustarComDelta: true,
    complementar: ['grossMargin', 'capexRevenue'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 3) return `Margem EBITDA melhorou ${delta.toFixed(1)}pp - operações mais eficientes.`
        if (delta < -3) return `Margem EBITDA deteriorou ${Math.abs(delta).toFixed(1)}pp - pressão operacional.`
      }
      if (!isNaN(atual)) {
        if (atual > 25) return 'Margem EBITDA excelente para setor de comunicação.'
        if (atual < 15) return 'Margem baixa pode limitar capacidade de investimento.'
      }
      return ''
    }
  },
  {
    label: 'Margem Líquida',
    chave: 'margemLiquida',
    peso: 1.0,
    ajustarComDelta: true,
    complementar: ['ebitdaMargin', 'dividendYield'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 2) return `Margem líquida melhorou ${delta.toFixed(1)}pp - maior eficiência.`
        if (delta < -2) return `Margem líquida deteriorou ${Math.abs(delta).toFixed(1)}pp - pressão nos lucros.`
      }
      if (!isNaN(atual)) {
        if (atual > 15) return 'Margem líquida forte sustenta crescimento e dividendos.'
        if (atual < 8) return 'Margem baixa pode pressionar rentabilidade.'
      }
      return ''
    }
  },
  {
    label: 'Margem Operacional',
    chave: 'margemOperacional',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['ebitdaMargin', 'grossMargin'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 20) return 'Margem operacional forte indica controle de custos eficaz.'
        if (v < 10) return 'Margem operacional baixa pode indicar ineficiências.'
      }
      return ''
    }
  },

  // === CRESCIMENTO E PERFORMANCE ===
  {
    label: 'Crescimento da Receita (3Y)',
    chave: 'receitaCagr3y',
    peso: 1.4, // Crítico para comunicação
    ajustarComDelta: true,
    complementar: ['crescimentoReceita', 'ps'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 5) return `CAGR acelerou ${delta.toFixed(1)}pp - forte momentum de crescimento.`
        if (delta < -5) return `CAGR desacelerou ${Math.abs(delta).toFixed(1)}pp - pressão competitiva.`
      }
      if (!isNaN(atual)) {
        if (atual > 15) return 'CAGR forte demonstra crescimento consistente em comunicação.'
        if (atual < 5) return 'Crescimento baixo pode indicar maturidade ou pressão competitiva.'
      }
      return ''
    }
  },
  {
    label: 'Crescimento Receita',
    chave: 'crescimentoReceita',
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['receitaCagr3y', 'userGrowth'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 10) return `Crescimento acelerou ${delta.toFixed(1)}pp - expansão forte.`
        if (delta < -10) return `Crescimento desacelerou ${Math.abs(delta).toFixed(1)}pp - desafios competitivos.`
      }
      if (!isNaN(atual)) {
        if (atual > 20) return 'Crescimento forte indica expansão robusta.'
        if (atual < 0) return 'Crescimento negativo pode indicar declínio ou transição.'
      }
      return ''
    }
  },
  {
    label: 'Crescimento EBITDA',
    chave: 'crescimentoEbitda',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['crescimentoReceita', 'ebitdaMargin'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 25) return 'Crescimento EBITDA explosivo indica alavancagem operacional.'
        if (v < -5) return 'Declínio EBITDA pode indicar pressão severa nas margens.'
      }
      return ''
    }
  },

  // === ESTRUTURA DE CAPITAL E SOLVÊNCIA ===
  {
    label: 'Dívida/EBITDA',
    chave: 'dividaEbitda',
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['coberturaJuros', 'freeCashFlow'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta < -0.5) return `Endividamento reduziu ${Math.abs(delta).toFixed(1)}x - fortalecimento financeiro.`
        if (delta > 0.5) return `Endividamento aumentou ${delta.toFixed(1)}x - maior alavancagem.`
      }
      if (!isNaN(atual)) {
        if (atual < 2.5) return 'Endividamento conservador oferece flexibilidade estratégica.'
        if (atual > 4) return 'Endividamento alto pode limitar flexibilidade financeira.'
      }
      return ''
    }
  },
  {
    label: 'Cobertura de Juros',
    chave: 'coberturaJuros',
    peso: 1.0,
    ajustarComDelta: true,
    complementar: ['dividaEbitda', 'ebitdaMargin'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 8) return 'Cobertura robusta oferece segurança financeira.'
        if (v < 3) return 'Cobertura baixa pode indicar risco financeiro.'
      }
      return ''
    }
  },
  {
    label: 'Liquidez Corrente',
    chave: 'liquidezCorrente',
    peso: 0.8,
    ajustarComDelta: true,
    complementar: ['freeCashFlow', 'workingCapitalTurnover'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 1.5) return 'Liquidez adequada para operações estáveis.'
        if (v < 1) return 'Liquidez baixa pode indicar pressão de caixa.'
      }
      return ''
    }
  },
  {
    label: 'Dívida/Patrimônio',
    chave: 'debtEquity',
    peso: 1.0,
    ajustarComDelta: true,
    complementar: ['roe', 'dividaEbitda'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 0.8) return 'Estrutura conservadora minimiza riscos financeiros.'
        if (v > 2) return 'Alta alavancagem pode amplificar riscos e retornos.'
      }
      return ''
    }
  },

  // === FLUXO DE CAIXA E EFICIÊNCIA DE CAPITAL ===
  {
    label: 'Free Cash Flow',
    chave: 'freeCashFlow',
    peso: 1.3,
    ajustarComDelta: true,
    complementar: ['capexRevenue', 'dividendYield'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 100000000) return `FCF melhorou significativamente (+${(delta/1000000).toFixed(0)}M). Fortalece posição.`
        if (delta < -100000000) return `FCF deteriorou (${(delta/1000000).toFixed(0)}M). Pode pressionar investimentos.`
      }
      if (!isNaN(atual)) {
        if (atual > 0) return 'FCF positivo oferece flexibilidade para investimentos e dividendos.'
        if (atual < 0) return 'FCF negativo pode limitar crescimento e retorno aos acionistas.'
      }
      return ''
    }
  },
  {
    label: 'FCF Yield',
    chave: 'fcfYield',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['freeCashFlow', 'dividendYield'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 6) return 'FCF Yield atrativo oferece retorno sólido.'
        if (v < 2) return 'Yield baixo pode indicar sobrevalorização.'
      }
      return ''
    }
  },
  {
    label: 'CapEx/Receita',
    chave: 'capexRevenue',
    peso: 1.2, // Importante para comunicação
    ajustarComDelta: true,
    complementar: ['freeCashFlow', 'roic'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 3) return `CapEx aumentou ${delta.toFixed(1)}pp - investindo em expansão/tecnologia.`
        if (delta < -3) return `CapEx reduziu ${Math.abs(delta).toFixed(1)}pp - conservando caixa.`
      }
      if (!isNaN(atual)) {
        if (atual < 8) return 'CapEx moderado preserva geração de caixa.'
        if (atual > 20) return 'CapEx alto pode pressionar FCF mas indica crescimento.'
      }
      return ''
    }
  },

  // === DIVIDENDOS E RETORNO ===
  {
    label: 'Dividend Yield',
    chave: 'dividendYield',
    peso: 0.9,
    ajustarComDelta: true,
    complementar: ['payoutRatio', 'freeCashFlow'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 3) return 'Yield atrativo oferece retorno defensivo.'
        if (v < 1) return 'Yield baixo pode indicar foco em crescimento vs. renda.'
      }
      return ''
    }
  },
  {
    label: 'Payout Ratio',
    chave: 'payoutRatio',
    peso: 0.9,
    ajustarComDelta: true,
    complementar: ['dividendYield', 'freeCashFlow'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 50) return 'Payout conservador oferece sustentabilidade e crescimento.'
        if (v > 80) return 'Payout alto pode ser arriscado se lucros caírem.'
      }
      return ''
    }
  },

  // === VOLATILIDADE E AVALIAÇÃO ===
  {
    label: 'Beta',
    chave: 'beta',
    peso: 0.7,
    setorSensível: true,
    complementar: ['receitaCagr3y', 'dividaEbitda'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 1.3) return 'Beta alto indica maior volatilidade que o mercado.'
        if (v < 0.9) return 'Beta baixo sugere menor volatilidade - mais estável.'
      }
      return ''
    }
  },
  {
    label: 'Valuation (DCF)',
    chave: 'leveredDcf',
    peso: 1.0,
    complementar: ['freeCashFlow', 'pe'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 0) return 'DCF disponível para avaliar valor intrínseco.'
        return 'Valor de DCF calculado considerando fluxos futuros.'
      }
      return ''
    }
  },

  // === MÉTRICAS ESPECÍFICAS DE COMMUNICATION SERVICES ===
  {
    label: 'Crescimento de Usuários',
    chave: 'userGrowth',
    peso: 1.3, // Crítico para comunicação
    ajustarComDelta: true,
    complementar: ['crescimentoReceita', 'arpu'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 5) return `Crescimento de usuários acelerou ${delta.toFixed(1)}pp - expansão da base.`
        if (delta < -5) return `Crescimento desacelerou ${Math.abs(delta).toFixed(1)}pp - saturação ou competição.`
      }
      if (!isNaN(atual)) {
        if (atual > 15) return 'Crescimento forte da base de usuários impulsiona receitas.'
        if (atual < 0) return 'Declínio de usuários pode pressionar receitas futuras.'
      }
      return ''
    }
  },
  {
    label: 'ARPU (Receita por Usuário)',
    chave: 'arpu',
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['userGrowth', 'crescimentoReceita'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = ((atual - anterior) / anterior) * 100
        if (delta > 5) return `ARPU cresceu ${delta.toFixed(1)}% - monetização melhorada.`
        if (delta < -5) return `ARPU declinou ${Math.abs(delta).toFixed(1)}% - pressão competitiva.`
      }
      if (!isNaN(atual)) {
        if (atual > 0) return 'ARPU positivo indica capacidade de monetização.'
        return 'ARPU disponível para análise de monetização.'
      }
      return ''
    }
  },
  {
    label: 'Churn Rate',
    chave: 'churnRate',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['userGrowth', 'arpu'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta < -1) return `Churn reduziu ${Math.abs(delta).toFixed(1)}pp - maior retenção.`
        if (delta > 1) return `Churn aumentou ${delta.toFixed(1)}pp - perda de clientes.`
      }
      if (!isNaN(atual)) {
        if (atual < 5) return 'Churn baixo indica alta satisfação e retenção.'
        if (atual > 15) return 'Churn alto pode indicar problemas de produto ou competição.'
      }
      return ''
    }
  },
  {
    label: 'Content Investment Ratio',
    chave: 'contentInvestment',
    peso: 1.0,
    ajustarComDelta: true,
    complementar: ['grossMargin', 'userGrowth'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 20) return 'Alto investimento em conteúdo pode impulsionar crescimento.'
        if (v < 10) return 'Baixo investimento pode limitar diferenciação competitiva.'
      }
      return ''
    }
  },

  // === MÉTRICAS CALCULADAS ===
  {
    label: 'Score de Crescimento',
    chave: 'scoreGrowth',
    peso: 1.3,
    complementar: ['userGrowth', 'receitaCagr3y'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 85) return 'Excelente performance de crescimento em comunicação.'
        if (v < 60) return 'Crescimento limitado pode indicar maturidade ou pressão.'
      }
      return ''
    }
  },
  {
    label: 'Score de Rentabilidade',
    chave: 'scoreProfitability',
    peso: 1.2,
    complementar: ['ebitdaMargin', 'roic'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 80) return 'Excelente rentabilidade com margens fortes.'
        if (v < 50) return 'Rentabilidade limitada pode pressionar investimentos.'
      }
      return ''
    }
  },
  {
    label: 'Score de Qualidade',
    chave: 'scoreQuality',
    peso: 1.1,
    complementar: ['freeCashFlow', 'churnRate'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 85) return 'Alta qualidade com FCF forte e baixo churn.'
        if (v < 60) return 'Qualidade limitada pode indicar desafios operacionais.'
      }
      return ''
    }
  },
]
