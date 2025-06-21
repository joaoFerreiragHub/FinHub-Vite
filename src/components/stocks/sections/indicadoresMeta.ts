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
    complementar: ['investimentoPD', 'eps', 'peg'],
  },
  {
    label: 'EPS',
    chave: 'eps',
    peso: 1,
    ajustarComDelta: true,
    complementar: ['pl', 'cagrEps', 'payoutRatio'],
  },
  {
    label: 'ROE',
    chave: 'roe',
    peso: 1,
    ajustarComDelta: true,
    complementar: ['debtEquity', 'margemOperacional', 'roic'],
  },
  {
    label: 'ROIC',
    chave: 'roic',
    peso: 1.2,
    ajustarComDelta: true,
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
    complementar: ['margemEbitda', 'roe', 'sgaOverRevenue'],
  },
  {
    label: 'Margem EBITDA',
    chave: 'margemEbitda',
    peso: 1,
    ajustarComDelta: true,
    complementar: ['freeCashFlow', 'sgaOverRevenue', 'margemOperacional'],
  },
  {
    label: 'Margem Líquida',
    chave: 'margemLiquida',
    peso: 1,
    ajustarComDelta: true,
    complementar: ['roe', 'roic', 'margemOperacional'],
  },
  {
    label: 'P/L',
    chave: 'pl',
    peso: 1,
    complementar: ['peg', 'eps', 'cagrEps'],
  },
  {
    label: 'PEG',
    chave: 'peg',
    peso: 0.8,
    complementar: ['pl', 'cagrEps', 'eps'],
  },
  {
    label: 'P/S',
    chave: 'ps',
    peso: 1,
    complementar: ['crescimentoReceita', 'margemBruta'],
  },
  {
    label: 'Margem Bruta',
    chave: 'margemBruta',
    peso: 1,
    ajustarComDelta: true,
    complementar: ['ps', 'crescimentoReceita', 'margemOperacional'],
  },
  {
    label: 'Crescimento Receita',
    chave: 'crescimentoReceita',
    peso: 0.8,
    ajustarComDelta: true,
    complementar: ['ps', 'investimentoPD', 'cagrEps'],
  },
  {
    label: 'Dívida/EBITDA',
    chave: 'debtToEbitda',
    peso: 0.8,
    ajustarComDelta: true,
    complementar: ['freeCashFlow', 'liquidezCorrente', 'debtEquity'],
  },
  {
    label: 'Free Cash Flow',
    chave: 'fcf',
    peso: 1,
    ajustarComDelta: true,
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
    complementar: ['freeCashFlow', 'crescimentoReceita'],
  },
  {
    label: 'SG&A / Receita',
    chave: 'sgaOverRevenue',
    peso: 0.6,
    ajustarComDelta: true,
    complementar: ['margemEbitda', 'margemOperacional'],
  },
  {
    label: 'Payout Ratio',
    chave: 'payoutRatio',
    peso: 0.8,
    complementar: ['eps', 'freeCashFlow', 'payoutRatioAnoAnterior'], // 🆕 ADICIONADO histórico
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
    complementar: ['roe', 'liquidezCorrente', 'debtToEbitda'],
  },
  {
    label: 'Liquidez Corrente',
    chave: 'liquidezCorrente',
    setorSensível: true,
    peso: 0.7,
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
  // 🔧 CORRIGIDO: Cash Ratio agora é um indicador normal (removido apenasInformativo)
  {
    label: 'Cash Ratio',
    chave: 'cashRatio',
    peso: 0.6, // 🆕 ADICIONADO peso normal
    complementar: ['liquidezCorrente', 'cashRatioAnoAnterior'], // 🆕 ADICIONADO histórico
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 0.5) return 'Cash ratio alto proporciona flexibilidade para oportunidades e crises.'
        if (v < 0.1) return 'Cash ratio baixo pode limitar capacidade de resposta a oportunidades.'
        return 'Cash ratio indica capacidade de pagamento imediato usando apenas caixa.'
      }
      return 'Cash ratio não disponível - calculado quando há dados de balance sheet.'
    }
  },
  // 🆕 NOVO: Receitas Recorrentes como indicador
  {
    label: 'Receitas Recorrentes',
    chave: 'receitasRecorrentes',
    peso: 0.4, // Peso baixo pois é sempre 0% para a maioria
    complementar: ['crescimentoReceita', 'margemBruta'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 50) return 'Alto percentual de receitas recorrentes indica modelo de negócio previsível.'
        if (v > 20) return 'Receitas recorrentes moderadas proporcionam alguma previsibilidade.'
        if (v === 0) return 'Sem receitas recorrentes - típico de empresas não-SaaS ou produtos únicos.'
      }
      return 'Receitas recorrentes indicam previsibilidade do modelo de negócio.'
    }
  }
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
// ✅ ATUALIZADO: indicadoresMetaReits - Sincronizado com API

export const indicadoresMetaReits: IndicadorMeta[] = [
  // === RENTABILIDADE E DIVIDENDOS ===
  {
    label: 'Dividend Yield',
    chave: 'dividendYield',
    peso: 1.5,
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
        if (atual > 10) return 'Yield muito alto pode indicar stress financeiro ou corte iminente.'
        if (atual < 3) return 'Yield baixo pode indicar REIT de crescimento ou sobrevaloração.'
      }
      return 'Dividend Yield é crucial para REITs - foco em rendimento.'
    }
  },
  {
    label: 'Dividend CAGR',
    chave: 'dividendCagr5y', // ✅ CORRIGIDO: consistente com complementares
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['ffoPayoutRatio', 'ffo'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 8) return 'Crescimento consistente de dividendos indica REIT de qualidade.'
        if (v < 0) return 'Crescimento negativo pode indicar dificuldades operacionais.'
      }
      return 'CAGR de dividendos real - fundamental para REITs de renda.'
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
        if (v > 90) return 'FFO Payout muito alto limita crescimento e pode comprometer sustentabilidade.'
        if (v < 60) return 'FFO Payout baixo para REITs pode desapontar investidores de renda.'
      }
      return 'FFO Payout Ratio é a métrica real para REITs - % do FFO distribuído como dividendos.'
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
      return 'P/VPA é fundamental para avaliação de REITs vs valor patrimonial.'
    }
  },
  {
    label: 'P/FFO',
    chave: 'pFfo',
    peso: 1.2,
    complementar: ['ffo', 'affo'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 12) return 'P/FFO baixo pode indicar valor ou problemas operacionais.'
        if (v > 20) return 'P/FFO alto pode indicar sobrevalorização.'
      }
      return 'P/FFO é o múltiplo principal para REITs - equivalente ao P/L para empresas normais.'
    }
  },

  // === OPERACIONAIS ===
  {
    label: 'Margem EBITDA (proxy Ocupação)',
    chave: 'ocupacao',
    peso: 1.4,
    setorSensível: true,
    ajustarComDelta: true,
    complementar: ['noi', 'capRate'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 3) return `Margem EBITDA melhorou ${delta.toFixed(1)}pp. Indica eficiência operacional.`
        if (delta < -3) return `Margem EBITDA caiu ${Math.abs(delta).toFixed(1)}pp. Pode indicar pressão de custos.`
      }
      if (!isNaN(atual)) {
        if (atual > 80) return 'Margem EBITDA excelente indica operações muito eficientes.'
        if (atual < 60) return 'Margem EBITDA baixa pode indicar problemas operacionais.'
      }
      return 'Margem EBITDA usada como proxy para eficiência operacional.'
    }
  },
  {
    label: 'ROA (proxy Cap Rate)',
    chave: 'capRate',
    peso: 1,
    complementar: ['ocupacao', 'noi'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 8) return 'ROA alto indica boa eficiência na geração de retornos.'
        if (v < 3) return 'ROA baixo pode indicar ativos de baixo rendimento.'
      }
      return 'ROA usado como proxy para taxa de capitalização (Cap Rate).'
    }
  },
  {
    label: 'Crescimento Receita (proxy NOI)',
    chave: 'noi',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['ocupacao', 'capRate'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 8) return 'Crescimento forte indica expansão bem-sucedida.'
        if (v < 0) return 'Declínio na receita pode indicar mercado fraco.'
      }
      return 'Crescimento de receita usado como proxy para crescimento NOI.'
    }
  },

  // === FLUXO DE CAIXA ESPECÍFICO ===
  {
    label: 'FFO (Funds From Operations)',
    chave: 'ffo',
    peso: 1.5,
    ajustarComDelta: true,
    complementar: ['affo', 'ffoPayoutRatio'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = ((atual - anterior) / anterior) * 100
        if (delta > 10) return `FFO cresceu ${delta.toFixed(1)}%. Indica melhoria operacional sólida.`
        if (delta < -10) return `FFO caiu ${Math.abs(delta).toFixed(1)}%. Pode comprometer dividendos.`
      }
      return 'FFO (Funds From Operations) é a métrica de cash flow principal para REITs.'
    }
  },
  {
    label: 'AFFO (Adjusted FFO)',
    chave: 'affo',
    peso: 1.3,
    ajustarComDelta: true,
    complementar: ['ffo'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 1) return 'AFFO robusto indica capacidade sustentável de distribuição.'
        if (v <= 0) return 'AFFO negativo indica pressão na capacidade de distribuição.'
      }
      return 'AFFO (Adjusted FFO) é FFO menos CapEx normalizado - cash flow disponível real.'
    }
  },

  // === 🆕 NOVOS INDICADORES ESPECÍFICOS DA API ===
  {
    label: 'FFO per Share',
    chave: 'ffoPerShare',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['ffo', 'affoPerShare'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 3) return 'FFO per Share forte indica boa geração de cash flow por ação.'
        if (v < 1) return 'FFO per Share baixo pode indicar problemas operacionais.'
      }
      return 'FFO per Share é fundamental para calcular P/FFO e avaliar eficiência.'
    }
  },
  {
    label: 'AFFO per Share',
    chave: 'affoPerShare',
    peso: 1.0,
    ajustarComDelta: true,
    complementar: ['ffoPerShare', 'affo'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 2.5) return 'AFFO per Share forte indica cash flow sustentável por ação.'
        if (v < 0.5) return 'AFFO per Share baixo pode indicar pressão no cash flow disponível.'
      }
      return 'AFFO per Share é o cash flow real disponível por ação após CapEx.'
    }
  },

  // === ESTRUTURA FINANCEIRA ===
  {
    // ✅ ATUALIZADO: Label mais específico para REITs
    label: 'Cobertura de Dividendos (FFO/Div)',
    chave: 'coberturaJuros',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['dividaEbitda', 'ffo'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 3) return 'Cobertura confortável proporciona segurança para dividendos.'
        if (v < 1.5) return 'Cobertura baixa aumenta risco de corte de dividendos.'
      }
      return 'Cobertura de dividendos baseada em FFO - indica sustentabilidade dos dividendos.'
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
        if (v > 10) return 'Alavancagem muito alta para um REIT, aumenta risco significativamente.'
        if (v < 4) return 'Alavancagem conservadora pode limitar retornos mas reduz risco.'
      }
      return 'REITs tipicamente operam com mais dívida que empresas tradicionais.'
    }
  },
  {
    label: 'Liquidez Corrente',
    chave: 'liquidezCorrente',
    peso: 0.7,
    complementar: ['dividaEbitda', 'ffo'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 2) return 'Liquidez alta para um REIT pode indicar ineficiência de capital.'
        if (v < 0.8) return 'Liquidez baixa pode indicar problemas de fluxo de caixa.'
      }
      return 'REITs precisam de menos liquidez devido aos fluxos previsíveis.'
    }
  },

  // === GESTÃO DE CAPITAL ===
  {
    label: 'NAV Discount/Premium',
    chave: 'navDiscount',
    peso: 0.8,
    apenasInformativo: true,
    complementar: ['pVpa', 'ocupacao'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < -15) return 'Desconto significativo ao NAV pode indicar oportunidade.'
        if (v > 15) return 'Prémio significativo ao NAV pode indicar sobrevalorização.'
      }
      return 'NAV Discount/Premium quando disponível (raro em dados públicos).'
    }
  },
  {
    label: 'Retention Rate',
    chave: 'retentionRate',
    peso: 0.9,
    apenasInformativo: true,
    complementar: ['ffoPayoutRatio', 'dividendCagr5y'], // ✅ CORRIGIDO
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 25) return 'Boa retenção de capital permite crescimento interno e externo.'
        if (v < 10) return 'Baixa retenção pode limitar capacidade de crescimento.'
      }
      return 'Taxa de retenção quando disponível (raro em dados públicos).'
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
export const indicadoresMetaFinancials: IndicadorMeta[] = [
  // === RENTABILIDADE E EFICIÊNCIA (UNIVERSAL) ===
  {
    label: 'ROE',
    chave: 'roe',
    peso: 1.4, // Muito importante para todo Financial Services
    ajustarComDelta: true,
    complementar: ['alavancagem', 'pvpa', 'rentabilidadeScore'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 25) return 'ROE excepcional indica gestão premium e modelo de negócio defensivo (típico de payment processors).'
        if (v > 18) return 'ROE excelente indica gestão muito eficaz do patrimônio e alavancagem otimizada.'
        if (v < 10) return 'ROE baixo pode indicar ineficiências operacionais ou ambiente competitivo intenso.'
      }
      return ''
    }
  },
  {
    label: 'ROA',
    chave: 'roa',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['roe', 'alavancagem', 'eficiencia'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 15) return 'ROA excepcional típico de payment processors com modelo asset-light.'
        if (v > 1.5) return 'ROA alto indica gestão muito eficiente dos ativos.'
        if (v < 0.8) return 'ROA baixo sugere baixa produtividade dos ativos ou problemas operacionais.'
      }
      return ''
    }
  },
  {
    label: 'Eficiência Operacional',
    chave: 'eficiencia',
    peso: 1.3,
    ajustarComDelta: true,
    complementar: ['roe', 'nim', 'eficienciaScore'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 35) return 'Eficiência excepcional indica operação altamente otimizada (típico de fintechs).'
        if (v < 45) return 'Eficiência excelente para bancos tradicionais com controle rigoroso de custos.'
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
        if (v > 20) return 'Margem excepcional típica de payment processors com modelo de receita premium.'
        if (v > 4.5) return 'Margem financeira forte para bancos indica pricing power e mix favorável.'
        if (v < 3) return 'Margem baixa pode indicar pressão competitiva ou ambiente de juros desfavorável.'
      }
      return ''
    }
  },
  {
    label: 'Margem Financeira',
    chave: 'nim',
    peso: 1.0,
    ajustarComDelta: true,
    complementar: ['roe', 'eficiencia'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 30) return 'Margem excepcional indica modelo de negócio premium com forte pricing power.'
        if (v > 20) return 'Margem forte típica de empresas com vantagens competitivas sustentáveis.'
        if (v < 10) return 'Margem baixa pode indicar pressão competitiva ou necessidade de eficiência.'
      }
      return ''
    }
  },

  // === SOLIDEZ E CAPITALIZAÇÃO (BANCOS) ===
  {
    label: 'Basileia',
    chave: 'basileia',
    peso: 1.3,
    ajustarComDelta: true,
    complementar: ['tier1', 'alavancagem', 'solidezScore'],
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

  // === ESTRUTURA DE CAPITAL E LIQUIDEZ (UNIVERSAL) ===
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
        if (v < 1) return 'Alavancagem muito baixa típica de payment processors com balanços eficientes.'
        if (v < 8) return 'Alavancagem conservadora oferece maior segurança mas pode limitar ROE.'
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
        if (v > 1 && v < 1.5) return 'Liquidez adequada para gestão eficiente do capital de giro.'
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
        if (v < 0.8) return 'Beta baixo sugere maior estabilidade vs. mercado (típico de utilities financeiras).'
        if (v >= 0.8 && v <= 1.2) return 'Beta moderado indica volatilidade similar ao mercado.'
      }
      return ''
    }
  },

  // === GESTÃO DE RISCO (BANCOS) ===
  {
    label: 'Inadimplência',
    chave: 'inadimplencia',
    peso: 1.4, // Crítico para bancos
    ajustarComDelta: true,
    complementar: ['cobertura', 'custoCredito', 'qualidadeAtivos'],
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
    complementar: ['inadimplencia', 'qualidadeAtivos'],
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

  // === MÚLTIPLOS DE AVALIAÇÃO (UNIVERSAL) ===
  {
    label: 'P/L',
    chave: 'pl',
    peso: 0.9,
    complementar: ['roe', 'dividendYield'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 25) return 'P/L alto típico de growth stocks ou empresas com modelos defensivos (payment processors).'
        if (v < 8) return 'P/L baixo pode indicar oportunidade ou expectativas de deterioração.'
        if (v > 18 && v < 25) return 'P/L elevado mas pode ser justificado por qualidade superior dos ativos.'
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
        if (v > 5) return 'P/VPA muito alto pode indicar sobrevalorização vs. valor contábil.'
        if (v > 2.5 && v < 5) return 'P/VPA elevado mas justificável para empresas de alta qualidade.'
      }
      return ''
    }
  },
  {
    label: 'P/S (proxy)',
    chave: 'pvpa',
    peso: 0.8,
    complementar: ['roe', 'eficiencia'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 15) return 'P/S alto típico de payment processors com margens excepcionais.'
        if (v > 10) return 'P/S elevado mas pode ser justificado por modelo de negócio defensivo.'
        if (v < 5) return 'P/S atrativo pode indicar oportunidade de valor.'
      }
      return ''
    }
  },

  // === DIVIDENDOS E DISTRIBUIÇÃO (UNIVERSAL) ===
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
        if (v >= 2 && v <= 4) return 'Yield atrativo e sustentável para investidores de renda.'
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
        if (v >= 30 && v <= 50) return 'Payout equilibrado entre distribuição e retenção de capital.'
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
        if (v >= 8 && v <= 15) return 'Crescimento saudável e sustentável para longo prazo.'
      }
      return ''
    }
  },
  {
    label: 'Crescimento Receita',
    chave: 'crescimentoCarteira',
    peso: 0.9,
    ajustarComDelta: true,
    complementar: ['roe', 'eficiencia'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 15) return 'Crescimento forte indica expansão bem-sucedida e captura de market share.'
        if (v < 5) return 'Crescimento baixo pode indicar maturidade do mercado ou pressão competitiva.'
        if (v >= 8 && v <= 12) return 'Crescimento estável e previsível típico de empresas maduras.'
      }
      return ''
    }
  },

  // === 🆕 SCORES CALCULADOS UNIVERSAIS ===
  {
    label: 'Score de Rentabilidade',
    chave: 'rentabilidadeScore',
    peso: 1.2,
    complementar: ['roe', 'roa', 'eficiencia'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 90) return 'Score excepcional indica rentabilidade premium sustentável.'
        if (v > 80) return 'Score excelente reflete gestão eficaz e modelo de negócio sólido.'
        if (v < 60) return 'Score baixo sugere necessidade de melhoria na rentabilidade.'
      }
      return ''
    }
  },
  {
    label: 'Score de Eficiência',
    chave: 'eficienciaScore',
    peso: 1.1,
    complementar: ['eficiencia', 'roe'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 90) return 'Eficiência operacional excepcional com controle rigoroso de custos.'
        if (v > 80) return 'Boa eficiência operacional vs. peers do setor.'
        if (v < 60) return 'Oportunidades significativas de melhoria na eficiência operacional.'
      }
      return ''
    }
  },
  {
    label: 'Score de Solidez',
    chave: 'solidezScore',
    peso: 1.3,
    complementar: ['basileia', 'tier1', 'liquidez'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 90) return 'Solidez patrimonial excepcional com capitalização robusta.'
        if (v > 80) return 'Boa solidez proporciona resiliência em cenários adversos.'
        if (v < 65) return 'Solidez limitada pode restringir flexibilidade em cenários stress.'
      }
      return ''
    }
  },
  {
    label: 'Qualidade de Ativos',
    chave: 'qualidadeAtivos',
    peso: 1.2,
    complementar: ['inadimplencia', 'cobertura'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 90) return 'Qualidade excepcional indica carteira premium com risco controlado.'
        if (v > 80) return 'Boa qualidade de ativos vs. peers do setor financeiro.'
        if (v < 65) return 'Qualidade abaixo da média sugere necessidade de melhores políticas de risco.'
      }
      return ''
    }
  },

  // === VALUATION (UNIVERSAL) ===
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
  {
    label: 'Preço Atual',
    chave: 'precoAtual',
    peso: 0.5,
    apenasInformativo: true, // Só para referência
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v) && v > 0) {
        return `Preço atual de $${v.toFixed(2)} usado como referência para múltiplos.`
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
    complementar: ['alavancagem', 'roic'],
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
    complementar: ['rotatividadeEstoques'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 2.5) return 'Liquidez alta pode indicar gestão conservadora ou capital mal alocado.'
        if (v < 1.2) return 'Liquidez baixa pode indicar dificuldades de capital de giro.'
      }
      return ''
    }
  },

  // === EFICIÊNCIA OPERACIONAL ===
  {
    label: 'Rotatividade de Estoques',
    chave: 'rotatividadeEstoques',
    peso: 1.2, // Importante para industrials
    ajustarComDelta: true,
    complementar: ['margemEbitda', 'giroAtivo'],
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
    complementar: ['roic', 'rotatividadeEstoques'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 1.5) return 'Giro alto indica uso muito eficiente dos ativos produtivos.'
        if (v < 0.8) return 'Giro baixo pode indicar sobrecapacidade ou ativos subutilizados.'
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
    complementar: ['margemLiquida'],
  },
  {
    label: 'PEG',
    chave: 'peg',
    peso: 1.1,
    complementar: ['pe'],
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
    complementar: ['coberturaJuros', 'fcf'],
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

  // === FLUXO DE CAIXA ===
  {
    label: 'Free Cash Flow',
    chave: 'fcf',
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['dividendYield', 'alavancagem'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 0) return 'FCF positivo indica geração de caixa após investimentos necessários.'
        if (v < 0) return 'FCF negativo pode indicar fase de investimento intenso ou problemas operacionais.'
      }
      return ''
    }
  },

  // === MÉTRICAS CALCULADAS ESPECÍFICAS ===
  {
    label: 'Eficiência Operacional',
    chave: 'eficienciaOperacional',
    peso: 1,
    complementar: ['rotatividadeEstoques', 'giroAtivo'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 80) return 'Excelente eficiência operacional com gestão otimizada.'
        if (v < 60) return 'Oportunidades de melhoria na eficiência operacional.'
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
    label: 'Ciclo Operacional',
    chave: 'cicloOperacional',
    peso: 1,
    complementar: ['rotatividadeEstoques', 'liquidezCorrente'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 45) return 'Ciclo operacional excelente, liberando caixa rapidamente.'
        if (v > 90) return 'Ciclo longo pode pressionar necessidades de capital de giro.'
      }
      return ''
    }
  },
  {
    label: 'Alavancagem Operacional',
    chave: 'alavancagemOperacional',
    peso: 1,
    complementar: ['margemEbitda', 'alavancagem'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 80) return 'Excelente alavancagem operacional com margens fortes.'
        if (v < 60) return 'Alavancagem operacional pode ser otimizada.'
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
export const indicadoresMetaBasicMaterials: IndicadorMeta[] = [
  // === RENTABILIDADE E RETORNO ===
  {
    label: 'P/E', // ✅ CORRIGIDO: Matching exato com componente
    chave: 'pe',
    peso: 0.9,
    complementar: ['roe', 'dividendYield'], // ✅ VERIFICADO: Existem no complementares
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
    label: 'P/B', // ✅ CORRIGIDO: Matching exato com componente
    chave: 'pb',
    peso: 1,
    complementar: ['roe', 'roic'], // ✅ VERIFICADO
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
    complementar: ['roic', 'dividaEbitda'], // ✅ VERIFICADO
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
    peso: 1.3,
    ajustarComDelta: true,
    complementar: ['capexRevenue', 'assetTurnover'], // ✅ VERIFICADO
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
    peso: 1.4,
    ajustarComDelta: true,
    complementar: ['margemOperacional', 'roic'], // ✅ VERIFICADO
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
    complementar: ['margemEbitda', 'crescimentoReceita'], // ✅ VERIFICADO
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
    complementar: ['margemEbitda', 'dividaEbitda'], // ✅ VERIFICADO
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
    complementar: ['margemEbitda', 'roic'], // ✅ VERIFICADO
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
    peso: 1.3,
    ajustarComDelta: true,
    complementar: ['coberturaJuros', 'freeCashFlow'], // ✅ VERIFICADO
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
    complementar: ['dividaEbitda', 'margemEbitda'], // ✅ VERIFICADO
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
    complementar: ['workingCapitalTurnover', 'inventoryTurnover'], // ✅ VERIFICADO
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
    label: 'Dívida/Patrimônio', // ✅ CORRIGIDO: Matching com componente
    chave: 'debtEquity',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['roe', 'dividaEbitda'], // ✅ VERIFICADO
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
    peso: 1.3,
    ajustarComDelta: true,
    complementar: ['capexRevenue', 'dividendYield'], // ✅ VERIFICADO
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
    complementar: ['freeCashFlow', 'roic'], // ✅ VERIFICADO
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
    complementar: ['freeCashFlow', 'dividendYield'], // ✅ VERIFICADO
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
    complementar: ['inventoryTurnover', 'liquidezCorrente'], // ✅ VERIFICADO
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
    complementar: ['crescimentoEbitda', 'margemBruta'], // ✅ VERIFICADO
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
    complementar: ['crescimentoReceita', 'margemEbitda'], // ✅ VERIFICADO
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
    complementar: ['payoutRatio', 'freeCashFlow'], // ✅ VERIFICADO
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
    complementar: ['dividendYield', 'freeCashFlow'], // ✅ VERIFICADO
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
    complementar: ['dividaEbitda', 'freeCashFlow'], // ✅ VERIFICADO
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
    complementar: ['freeCashFlow', 'roic'], // ✅ VERIFICADO
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
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['workingCapitalTurnover', 'liquidezCorrente'], // ✅ VERIFICADO
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
    complementar: ['roic', 'capexRevenue'], // ✅ VERIFICADO
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
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['margemEbitda', 'crescimentoReceita'], // ✅ VERIFICADO
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
    complementar: ['margemEbitda', 'roic'], // ✅ VERIFICADO
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
    complementar: ['inventoryTurnover', 'dividaEbitda'], // ✅ VERIFICADO
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
    complementar: ['freeCashFlow', 'roic'], // ✅ VERIFICADO
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


export const indicadoresMetaUtilities: IndicadorMeta[] = [
  // === MÚLTIPLOS DE VALUATION ===
  {
    label: 'P/L',
    chave: 'pl',
    peso: 1,
    complementar: ['earningsYield', 'dividendYield', 'roe'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)

      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 3) return `P/L aumentou ${delta.toFixed(1)}x. Pode indicar deterioração dos lucros ou aumento das expectativas.`
        if (delta < -3) return `P/L diminuiu ${Math.abs(delta).toFixed(1)}x. Pode indicar melhoria dos lucros ou pessimismo excessivo.`
      }

      if (!isNaN(atual)) {
        if (atual < 10) return 'P/L muito baixo para utility pode indicar oportunidade ou problemas regulatórios sérios.'
        if (atual > 25) return 'P/L alto pode indicar expectativas de crescimento ou mercado sobreaquecido.'
        if (atual >= 12 && atual <= 18) return 'P/L dentro da faixa típica para utilities bem geridas.'
      }
      return ''
    }
  },
  {
    label: 'P/VPA',
    chave: 'pb',
    peso: 0.8,
    complementar: ['roe', 'roic', 'regulatoryROE'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v < 0.8) return 'P/VPA muito baixo pode indicar subvalorização ou problemas fundamentais.'
        if (v > 2.0) return 'P/VPA alto para utility. Verificar se é justificado pelo ROE e qualidade dos ativos.'
        if (v >= 1.0 && v <= 1.5) return 'P/VPA equilibrado para o setor de utilities.'
      }
      return ''
    }
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
        if (v > 8) return 'Earnings yield alto sugere utility subvalorizada ou riscos elevados. Compare com yields de bonds.'
        if (v < 4) return 'Earnings yield baixo pode indicar sobrevalorização ou expectativas muito otimistas.'
        if (v >= 5 && v <= 7) return 'Earnings yield adequado para utilities de qualidade.'
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
    complementar: ['endividamento', 'pb', 'regulatoryROE'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)

      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 3) return `ROE melhorou ${delta.toFixed(1)}pp. Excelente evolução na eficiência do capital.`
        if (delta < -3) return `ROE deteriorou ${Math.abs(delta).toFixed(1)}pp. Investigar causas: regulação, custos ou alavancagem.`
      }

      if (!isNaN(atual)) {
        if (atual > 15) return 'ROE excelente para utility indica gestão eficiente do capital e ambiente regulatório favorável.'
        if (atual < 8) return 'ROE baixo pode refletir ambiente regulatório restritivo ou ineficiência operacional.'
        if (atual >= 10 && atual <= 14) return 'ROE sólido dentro da faixa esperada para utilities de qualidade.'
      }
      return ''
    }
  },
  {
    label: 'ROIC',
    chave: 'roic',
    peso: 1.3,
    ajustarComDelta: true,
    complementar: ['capexOverRevenue', 'giroAtivo', 'assetAge'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)

      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 2) return `ROIC melhorou ${delta.toFixed(1)}pp. Boa eficiência na alocação de capital em infraestrutura.`
        if (delta < -2) return `ROIC deteriorou ${Math.abs(delta).toFixed(1)}pp. Pode indicar novos investimentos ainda não produtivos.`
      }

      if (!isNaN(atual)) {
        if (atual > 10) return 'ROIC sólido indica excelente eficiência na alocação de capital em infraestrutura.'
        if (atual < 5) return 'ROIC baixo pode indicar regulamentação restritiva ou investimentos ineficientes.'
        if (atual >= 7 && atual <= 9) return 'ROIC adequado para utilities com investimentos contínuos em infraestrutura.'
      }
      return ''
    }
  },
  {
    label: 'ROE Regulatório',
    chave: 'regulatoryROE',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['roe', 'roic'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 12) return 'ROE regulatório alto indica ambiente favorável e boa relação com o regulador.'
        if (v < 8) return 'ROE regulatório baixo pode limitar a atratividade dos investimentos.'
        if (v >= 9 && v <= 11) return 'ROE regulatório típico para utilities em mercados maduros.'
      }
      return 'ROE permitido pelo regulador - fundamental para retorno dos investimentos em utilities.'
    }
  },
  {
    label: 'Margem EBITDA',
    chave: 'margemEbitda',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['margemOperacional', 'endividamento', 'capexOverRevenue'],
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

  // === DIVIDENDOS E DISTRIBUIÇÕES (CORE para Utilities) ===
  {
    label: 'Dividend Yield',
    chave: 'dividendYield',
    peso: 1.5, // ✅ AUMENTADO - Mais importante que antes
    setorSensível: true,
    ajustarComDelta: true,
    complementar: ['payoutRatio', 'coberturaJuros', 'dividendConsistency'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)

      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 1) return `Yield aumentou ${delta.toFixed(1)}pp. Analisar se é por queda no preço ou aumento do dividendo.`
        if (delta < -1) return `Yield diminuiu ${Math.abs(delta).toFixed(1)}pp. Pode indicar valorização ou corte nos dividendos.`
      }

      if (!isNaN(atual)) {
        if (atual > 8) return 'Yield muito alto pode indicar risco de corte ou stress financeiro. Verificar sustentabilidade.'
        if (atual < 2.5) return 'Yield baixo pode indicar crescimento forte ou sobrevalorização da ação.'
        if (atual >= 3.5 && atual <= 6) return 'Yield atrativo dentro da faixa típica para utilities de qualidade.'
      }
      return 'Rendimento de dividendos - indicador core para investidores em utilities.'
    }
  },
  {
    label: 'Payout Ratio',
    chave: 'payoutRatio',
    peso: 1.3, // ✅ AUMENTADO
    ajustarComDelta: true,
    complementar: ['dividendYield', 'fcf', 'coberturaJuros'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)

      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 10) return `Payout aumentou ${delta.toFixed(1)}pp. Monitorar sustentabilidade dos dividendos.`
        if (delta < -10) return `Payout diminuiu ${Math.abs(delta).toFixed(1)}pp. Pode indicar conservadorismo ou necessidade de investimentos.`
      }

      if (!isNaN(atual)) {
        if (atual > 90) return 'Payout muito alto pode comprometer sustentabilidade e capacidade de crescimento.'
        if (atual < 50) return 'Payout conservador proporciona excelente margem de segurança para dividendos.'
        if (atual >= 60 && atual <= 80) return 'Payout equilibrado permite crescimento dos dividendos e reinvestimento.'
      }
      return ''
    }
  },
  {
    label: 'Crescimento Dividendo 5Y',
    chave: 'dividendCagr5y',
    peso: 1,
    ajustarComDelta: true,
    complementar: ['payoutRatio', 'crescimentoEps', 'dividendConsistency'],
  },
  {
    label: 'Consistência Dividendos',
    chave: 'dividendConsistency',
    peso: 1.2, // ✅ NOVO - Importante para utilities
    complementar: ['dividendYield', 'payoutRatio'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 95) return 'Histórico excelente de pagamentos - alta previsibilidade para investidores de renda.'
        if (v < 80) return 'Histórico irregular pode indicar volatilidade nos dividendos.'
      }
      return 'Percentual de anos com dividendos pagos - crucial para utilities.'
    }
  },

  // === ESTRUTURA FINANCEIRA ===
  {
    label: 'Endividamento',
    chave: 'endividamento',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['coberturaJuros', 'roe', 'debtToEbitda'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)

      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 10) return `Endividamento aumentou ${delta.toFixed(1)}pp. Monitorar capacidade de pagamento.`
        if (delta < -10) return `Endividamento diminuiu ${Math.abs(delta).toFixed(1)}pp. Redução de risco financeiro.`
      }

      if (!isNaN(atual)) {
        if (atual > 70) return 'Endividamento elevado mesmo para utility - aumenta risco financeiro e sensibilidade a juros.'
        if (atual < 40) return 'Endividamento conservador pode limitar crescimento mas reduz risco significativamente.'
        if (atual >= 50 && atual <= 65) return 'Endividamento típico para utilities - necessário para financiar infraestrutura.'
      }
      return 'Utilities tipicamente operam com alto endividamento devido aos investimentos massivos em infraestrutura.'
    }
  },
  {
    label: 'Dívida/EBITDA',
    chave: 'debtToEbitda',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['coberturaJuros', 'margemEbitda', 'fcf'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)

      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 1) return `Dívida/EBITDA aumentou ${delta.toFixed(1)}x. Monitorar capacidade de geração de caixa.`
        if (delta < -1) return `Dívida/EBITDA melhorou ${Math.abs(delta).toFixed(1)}x. Redução do risco financeiro.`
      }

      if (!isNaN(atual)) {
        if (atual > 6) return 'Múltiplo elevado indica alto endividamento relativo à capacidade de geração de caixa.'
        if (atual < 3) return 'Múltiplo conservador proporciona boa margem de segurança financeira.'
        if (atual >= 4 && atual <= 5.5) return 'Múltiplo adequado para utilities com fluxos de caixa estáveis.'
      }
      return ''
    }
  },
  {
    label: 'Cobertura de Juros',
    chave: 'coberturaJuros',
    peso: 1.4, // ✅ CRÍTICO para Utilities
    ajustarComDelta: true,
    complementar: ['endividamento', 'margemEbitda', 'debtToEbitda'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)

      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 1) return `Cobertura melhorou ${delta.toFixed(1)}x. Fortalecimento da segurança financeira.`
        if (delta < -1) return `Cobertura deteriorou ${Math.abs(delta).toFixed(1)}x. Aumento do risco de stress financeiro.`
      }

      if (!isNaN(atual)) {
        if (atual > 5) return 'Cobertura excelente proporciona segurança financeira sólida mesmo em cenários adversos.'
        if (atual < 2) return 'Cobertura baixa aumenta significativamente o risco de dificuldades financeiras.'
        if (atual >= 2.5 && atual <= 4) return 'Cobertura adequada para utilities com fluxos previsíveis.'
      }
      return 'Indicador CRÍTICO - capacidade de pagamento dos juros da dívida.'
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
        if (v > 1.5) return 'Liquidez alta para utility pode indicar gestão conservadora ou acúmulo de caixa para investimentos.'
        if (v < 0.8) return 'Liquidez baixa pode indicar gestão agressiva de working capital.'
        if (v >= 1.0 && v <= 1.3) return 'Liquidez adequada para utilities com fluxos de caixa previsíveis.'
      }
      return 'Utilities precisam de menos liquidez devido aos fluxos de caixa regulares e previsíveis.'
    }
  },

  // === EFICIÊNCIA OPERACIONAL ===
  {
    label: 'Giro do Ativo',
    chave: 'giroAtivo',
    peso: 0.9,
    complementar: ['roic', 'capexOverRevenue', 'assetAge'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 0.6) return 'Giro alto indica uso muito eficiente dos ativos de infraestrutura.'
        if (v < 0.25) return 'Giro baixo pode indicar sobrecapacidade, ativos subutilizados ou investimentos recentes.'
        if (v >= 0.35 && v <= 0.5) return 'Giro típico para utilities com base de ativos sólida.'
      }
      return ''
    }
  },
  {
    label: 'CapEx / Receita',
    chave: 'capexOverRevenue',
    peso: 1.2, // ✅ IMPORTANTE para infraestrutura
    ajustarComDelta: true,
    complementar: ['roic', 'crescimentoReceita', 'assetAge'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)

      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 5) return `CapEx aumentou ${delta.toFixed(1)}pp. Pode indicar ciclo de investimentos ou modernização.`
        if (delta < -5) return `CapEx reduziu ${Math.abs(delta).toFixed(1)}pp. Pode indicar fim de ciclo de investimentos.`
      }

      if (!isNaN(atual)) {
        if (atual > 30) return 'CapEx muito alto pode pressionar fluxo de caixa e sustentabilidade dos dividendos.'
        if (atual < 10) return 'CapEx baixo pode indicar falta de investimento em manutenção ou modernização.'
        if (atual >= 15 && atual <= 25) return 'CapEx equilibrado permite manutenção e crescimento da infraestrutura.'
      }
      return 'Investimento em infraestrutura - essencial para utilities manterem qualidade e crescimento.'
    }
  },
  {
    label: 'Idade Média dos Ativos',
    chave: 'assetAge',
    peso: 0.8, // ✅ NOVO
    complementar: ['capexOverRevenue', 'giroAtivo'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 25) return 'Ativos envelhecidos podem necessitar de CapEx significativo para modernização.'
        if (v < 10) return 'Ativos novos indicam infraestrutura moderna com menor necessidade de manutenção.'
        if (v >= 15 && v <= 20) return 'Idade adequada com equilíbrio entre eficiência e necessidade de investimentos.'
      }
      return 'Idade da infraestrutura impacta diretamente custos de manutenção e necessidade de CapEx.'
    }
  },

  // === CRESCIMENTO ===
  {
    label: 'Crescimento Receita',
    chave: 'crescimentoReceita',
    peso: 0.8,
    ajustarComDelta: true,
    complementar: ['ps', 'capexOverRevenue', 'rateBaseGrowth'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)

      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 3) return `Aceleração no crescimento (+${delta.toFixed(1)}pp). Pode indicar expansão ou aumentos tarifários.`
        if (delta < -3) return `Desaceleração no crescimento (${delta.toFixed(1)}pp). Verificar fatores regulatórios ou econômicos.`
      }

      if (!isNaN(atual)) {
        if (atual > 8) return 'Crescimento alto para utility pode indicar expansão territorial ou aumentos tarifários.'
        if (atual < 1) return 'Crescimento baixo é típico para utilities em mercados maduros.'
        if (atual >= 3 && atual <= 6) return 'Crescimento saudável para utilities balanceando expansão e estabilidade.'
      }
      return ''
    }
  },
  {
    label: 'Crescimento EPS',
    chave: 'crescimentoEps',
    peso: 0.9,
    ajustarComDelta: true,
    complementar: ['roe', 'dividendCagr5y', 'crescimentoReceita'],
  },
  {
    label: 'Crescimento Rate Base',
    chave: 'rateBaseGrowth',
    peso: 1, // ✅ NOVO - Específico de utilities
    ajustarComDelta: true,
    complementar: ['capexOverRevenue', 'regulatoryROE'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 6) return 'Crescimento forte da rate base indica expansão significativa da infraestrutura.'
        if (v < 2) return 'Crescimento baixo pode indicar mercado maduro ou restrições regulatórias.'
        if (v >= 3 && v <= 5) return 'Crescimento equilibrado da base tarifária.'
      }
      return 'Crescimento da base de ativos regulados - fundamental para retorno das utilities.'
    }
  },

  // === MÉTRICAS ESPECÍFICAS DE UTILITIES ===
  {
    label: 'Free Cash Flow',
    chave: 'fcf',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['capexOverRevenue', 'payoutRatio', 'debtToEbitda'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)

      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (Math.abs(delta) > 100000000) { // 100M
          const deltaFormatted = (delta / 1000000).toFixed(0)
          if (delta > 0) return `FCF melhorou ${deltaFormatted}M. Fortalecimento da capacidade de autofinanciamento.`
          return `FCF deteriorou ${Math.abs(parseFloat(deltaFormatted))}M. Pode refletir ciclo de investimentos.`
        }
      }

      if (!isNaN(atual)) {
        if (atual > 0) return 'FCF positivo indica capacidade de autofinanciamento e sustentabilidade dos dividendos.'
        if (atual < 0) return 'FCF negativo pode ser aceitável durante ciclos intensivos de CapEx.'
      }
      return ''
    }
  },
  {
    label: 'Fator de Capacidade',
    chave: 'capacityFactor',
    peso: 0.8, // ✅ NOVO
    complementar: ['renewablePercentage'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 85) return 'Fator de capacidade excelente indica alta eficiência operacional da geração.'
        if (v < 60) return 'Fator baixo pode indicar problemas operacionais ou sazonalidade elevada.'
        if (v >= 70 && v <= 80) return 'Fator de capacidade adequado para a maioria das tecnologias.'
      }
      return 'Eficiência da geração de energia - aplicável a empresas com ativos de geração.'
    }
  },
  {
    label: '% Energias Renováveis',
    chave: 'renewablePercentage',
    peso: 0.7, // ✅ NOVO - ESG
    complementar: ['capacityFactor'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 60) return 'Alto percentual de renováveis fortalece perfil ESG e reduz riscos regulatórios.'
        if (v < 20) return 'Baixo percentual pode criar pressão regulatória para transição energética.'
        if (v >= 30 && v <= 50) return 'Transição equilibrada para energias renováveis.'
      }
      return 'Sustentabilidade energética - cada vez mais importante para utilities.'
    }
  },

  // === VALUATION VS FUNDAMENTALS ===
  {
    label: 'Levered DCF',
    chave: 'leveredDcf',
    peso: 0.8,
    complementar: ['pl', 'fcf', 'dividendYield'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 1.2) return 'DCF sugere valor intrínseco significativamente acima do preço atual - possível oportunidade.'
        if (v < 0.9) return 'DCF sugere possível sobrevalorização da utility.'
        if (v >= 0.95 && v <= 1.15) return 'Preço próximo ao valor intrínseco calculado.'
      }
      return 'Valuation intrínseco baseado em fluxos de caixa descontados.'
    }
  },
]

export const indicadoresMetaCommunicationServices: IndicadorMeta[] = [

  // === CORE FUNDAMENTAIS (peso alto) ===
  {
    label: 'ROIC',
    chave: 'roic',
    peso: 1.3,              // Eficiência capital é crítica
    ajustarComDelta: true,
    complementar: ['roe', 'capexRevenue', 'freeCashFlow'],
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
        if (atual < 6) return 'ROIC baixo pode indicar setor commoditizado ou ineficiências.'
      }
      return ''
    }
  },

  {
    label: 'ROE',
    chave: 'roe',
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['roic', 'debtEquity', 'dividendYield'],
  },

  // === COMMUNICATION SERVICES ESPECÍFICOS (peso muito alto) ===
  {
    label: 'Crescimento de Usuários',
    chave: 'userGrowth',
    peso: 1.5,              // Crítico para o setor
    ajustarComDelta: true,
    complementar: ['crescimentoReceita', 'arpu', 'churnRate'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 5) return `User growth acelerou ${delta.toFixed(1)}pp - expansão da base.`
        if (delta < -5) return `User growth desacelerou ${Math.abs(delta).toFixed(1)}pp - saturação/competição.`
      }
      if (!isNaN(atual)) {
        if (atual > 12) return 'Crescimento forte da base sustenta receitas futuras.'
        if (atual < 0) return 'Declínio de usuários pressiona modelo de negócio.'
      }
      return ''
    }
  },

  {
    label: 'Churn Rate',
    chave: 'churnRate',
    peso: 1.4,              // Crítico para retenção
    ajustarComDelta: true,
    complementar: ['userGrowth', 'arpu', 'contentInvestment'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta < -1) return `Churn reduziu ${Math.abs(delta).toFixed(1)}pp - maior retenção.`
        if (delta > 1) return `Churn aumentou ${delta.toFixed(1)}pp - perda de clientes.`
      }
      if (!isNaN(atual)) {
        if (atual < 8) return 'Churn baixo indica alta satisfação e modelo sustentável.'
        if (atual > 20) return 'Churn alto ameaça viabilidade do modelo de negócio.'
      }
      return ''
    }
  },

  {
    label: 'ARPU',
    chave: 'arpu',
    peso: 1.3,
    ajustarComDelta: true,
    complementar: ['userGrowth', 'crescimentoReceita', 'churnRate'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = ((atual - anterior) / anterior) * 100
        if (delta > 5) return `ARPU cresceu ${delta.toFixed(1)}% - monetização melhorada.`
        if (delta < -5) return `ARPU declinou ${Math.abs(delta).toFixed(1)}% - pressão de pricing.`
      }
      if (!isNaN(atual)) {
        if (atual > 40) return 'ARPU alto demonstra forte capacidade de monetização.'
        if (atual < 15) return 'ARPU baixo pode limitar potencial de receita.'
      }
      return ''
    }
  },

  // === CRESCIMENTO (peso alto) ===
  {
    label: 'Crescimento da Receita (3Y)',
    chave: 'receitaCagr3y',
    peso: 1.3,
    ajustarComDelta: true,
    complementar: ['crescimentoReceita', 'userGrowth', 'ps'],
  },

  {
    label: 'Crescimento Receita',
    chave: 'crescimentoReceita',
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['userGrowth', 'arpu', 'receitaCagr3y'],
  },

  {
    label: 'Crescimento EBITDA',
    chave: 'crescimentoEbitda',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['crescimentoReceita', 'ebitdaMargin'],
  },

  // === MARGENS (peso médio-alto) ===
  {
    label: 'Margem EBITDA',
    chave: 'ebitdaMargin',
    peso: 1.2,
    ajustarComDelta: true,
    complementar: ['grossMargin', 'contentInvestment', 'capexRevenue'],
  },

  {
    label: 'Margem Bruta',
    chave: 'grossMargin',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['ebitdaMargin', 'ps', 'contentInvestment'],
  },

  {
    label: 'Margem Líquida',
    chave: 'margemLiquida',
    peso: 1.0,
    ajustarComDelta: true,
    complementar: ['ebitdaMargin', 'dividendYield'],
  },

  {
    label: 'Margem Operacional',
    chave: 'margemOperacional',
    peso: 1.0,
    ajustarComDelta: true,
    complementar: ['ebitdaMargin', 'grossMargin'],
  },

  // === MÚLTIPLOS (peso médio) ===
  {
    label: 'P/L',
    chave: 'pe',
    peso: 1.0,
    complementar: ['roe', 'crescimentoReceita', 'userGrowth'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta < -5) return `P/L reduziu ${Math.abs(delta).toFixed(1)}x - pode indicar oportunidade.`
        if (delta > 5) return `P/L aumentou ${delta.toFixed(1)}x - expectativas crescentes.`
      }
      if (!isNaN(atual)) {
        if (atual < 22) return 'P/L atrativo para setor de comunicação.'
        if (atual > 40) return 'P/L alto requer justificativa por crescimento.'
      }
      return ''
    }
  },

  {
    label: 'P/S',
    chave: 'ps',
    peso: 1.1,              // Importante para Communication Services
    ajustarComDelta: true,
    complementar: ['grossMargin', 'receitaCagr3y', 'userGrowth'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta < -1) return `P/S reduziu ${Math.abs(delta).toFixed(1)}x - pode indicar oportunidade.`
        if (delta > 1) return `P/S aumentou ${delta.toFixed(1)}x - expectativas otimistas.`
      }
      if (!isNaN(atual)) {
        if (atual < 4) return 'P/S atrativo para empresa de comunicação.'
        if (atual > 8) return 'P/S alto requer crescimento robusto para justificar.'
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
  },

  // === CASH FLOW (peso alto) ===
  {
    label: 'Free Cash Flow',
    chave: 'freeCashFlow',
    peso: 1.3,
    ajustarComDelta: true,
    complementar: ['capexRevenue', 'dividendYield', 'contentInvestment'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 50000000) return `FCF melhorou (+${(delta/1000000).toFixed(0)}M) - fortalece posição.`
        if (delta < -50000000) return `FCF deteriorou (${(delta/1000000).toFixed(0)}M) - pressão nos investimentos.`
      }
      if (!isNaN(atual)) {
        if (atual > 0) return 'FCF positivo oferece flexibilidade estratégica.'
        if (atual < 0) return 'FCF negativo pode limitar crescimento futuro.'
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
  },

  {
    label: 'CapEx/Receita',
    chave: 'capexRevenue',
    peso: 1.1,              // Importante para infraestrutura
    ajustarComDelta: true,
    complementar: ['freeCashFlow', 'roic', 'userGrowth'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 3) return `CapEx aumentou ${delta.toFixed(1)}pp - investindo em crescimento.`
        if (delta < -3) return `CapEx reduziu ${Math.abs(delta).toFixed(1)}pp - conservando caixa.`
      }
      if (!isNaN(atual)) {
        if (atual < 10) return 'CapEx moderado preserva geração de caixa.'
        if (atual > 25) return 'CapEx alto pode pressionar FCF mas indica expansão.'
      }
      return ''
    }
  },

  // === ESTRUTURA CAPITAL (peso médio) ===
  {
    label: 'Dívida/EBITDA',
    chave: 'dividaEbitda',
    peso: 1.1,
    ajustarComDelta: true,
    complementar: ['coberturaJuros', 'freeCashFlow'],
  },

  {
    label: 'Cobertura de Juros',
    chave: 'coberturaJuros',
    peso: 1.0,
    ajustarComDelta: true,
    complementar: ['dividaEbitda', 'ebitdaMargin'],
  },

  {
    label: 'Liquidez Corrente',
    chave: 'liquidezCorrente',
    peso: 0.8,
    ajustarComDelta: true,
    complementar: ['freeCashFlow', 'debtEquity'],
  },

  {
    label: 'Dívida/Patrimônio',
    chave: 'debtEquity',
    peso: 0.9,
    ajustarComDelta: true,
    complementar: ['roe', 'dividaEbitda'],
  },

  // === DIVIDENDOS (peso médio) ===
  {
    label: 'Dividend Yield',
    chave: 'dividendYield',
    peso: 0.9,
    ajustarComDelta: true,
    complementar: ['payoutRatio', 'freeCashFlow'],
  },

  {
    label: 'Payout Ratio',
    chave: 'payoutRatio',
    peso: 0.8,
    ajustarComDelta: true,
    complementar: ['dividendYield', 'freeCashFlow', 'userGrowth'],
  },

  // === CONTENT INVESTMENT (setor específico) ===
  {
    label: 'Content Investment Ratio',
    chave: 'contentInvestment',
    peso: 1.2,              // Importante para diferenciação
    ajustarComDelta: true,
    complementar: ['grossMargin', 'userGrowth', 'churnRate'],
    explicacaoCustom: ({ valor, valorAnterior }) => {
      const atual = Number(valor)
      const anterior = Number(valorAnterior)
      if (!isNaN(atual) && !isNaN(anterior)) {
        const delta = atual - anterior
        if (delta > 3) return `Investment em conteúdo aumentou ${delta.toFixed(1)}pp - apostando em diferenciação.`
        if (delta < -3) return `Investment reduziu ${Math.abs(delta).toFixed(1)}pp - focando em rentabilidade.`
      }
      if (!isNaN(atual)) {
        if (atual > 25) return 'Alto investimento pode impulsionar crescimento mas pressiona margens.'
        if (atual < 10) return 'Investment baixo preserva margens mas pode limitar diferenciação.'
      }
      return ''
    }
  },

  // === RISCO (peso baixo) ===
  {
    label: 'Beta',
    chave: 'beta',
    peso: 0.6,
    setorSensível: true,
    complementar: ['userGrowth', 'dividaEbitda'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 1.6) return 'Beta alto indica maior volatilidade - normal para growth.'
        if (v < 0.9) return 'Beta baixo sugere menor volatilidade - mais defensivo.'
      }
      return ''
    }
  },

  // === SCORES CALCULADOS (peso médio-alto) ===
  {
    label: 'Score de Crescimento',
    chave: 'scoreGrowth',
    peso: 1.2,
    complementar: ['userGrowth', 'receitaCagr3y'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 80) return 'Excelente performance de crescimento no setor.'
        if (v < 55) return 'Crescimento limitado pode indicar maturidade ou pressão.'
      }
      return ''
    }
  },

  {
    label: 'Score de Rentabilidade',
    chave: 'scoreProfitability',
    peso: 1.1,
    complementar: ['ebitdaMargin', 'roic'],
    explicacaoCustom: ({ valor }) => {
      const v = Number(valor)
      if (!isNaN(v)) {
        if (v > 75) return 'Excelente rentabilidade com margens sustentáveis.'
        if (v < 45) return 'Rentabilidade pressionada pode limitar investimentos.'
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
        if (v > 80) return 'Alta qualidade operacional com FCF forte e baixo churn.'
        if (v < 55) return 'Qualidade operacional pode indicar desafios estruturais.'
      }
      return ''
    }
  },

  // === VALUATION ===
  {
    label: 'Valuation (DCF)',
    chave: 'leveredDcf',
    peso: 0.7,              // Informativo
    apenasInformativo: true,
    complementar: ['freeCashFlow', 'pe'],
  },
]
