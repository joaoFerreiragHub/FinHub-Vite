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

export const indicadoresMetaTech: IndicadorMeta[] = [
  {
    label: 'CAGR EPS',
    chave: 'cagrEps',
    ajustarComDelta: true,
    peso: 1.5,
  },
  {
    label: 'P/L',
    chave: 'pl',
    complementar: ['peg', 'forwardPe'],
    peso: 1,
  },
  {
    label: 'PEG',
    chave: 'peg',
    peso: 1.2,
  },
  {
    label: 'ROE',
    chave: 'roe',
    complementar: ['debtEquity'],
    peso: 1,
  },
  {
    label: 'Liquidez Corrente',
    chave: 'liquidezCorrente',
    setorSensível: true,
    peso: 0.7,
  },
  {
    label: 'Cash Ratio',
    chave: 'cashRatio',
    apenasInformativo: true,
  },
  // ...
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

