export const thresholds = {
  Healthcare: {
    // Crescimento - Específico para Healthcare
    crescimentoReceita: { good: 0.1, medium: 0.04 }, // 10%+ é bom, 4%+ é médio
    cagrEps: { good: 0.15, medium: 0.08 }, // 15%+ é excelente, 8%+ é bom
    eps: { good: 2.0, medium: 1.0 }, // $2+ é bom para Healthcare

    // Margens - Otimizadas para Healthcare
    margemBruta: { good: 0.65, medium: 0.45 }, // 65%+ é excelente
    margemEbitda: { good: 0.25, medium: 0.15 }, // 25%+ é muito bom
    margemLiquida: { good: 0.12, medium: 0.06 }, // 12%+ é sólido
    margemOperacional: { good: 0.2, medium: 0.1 }, // 20%+ é excelente

    // Retornos - Adequados para Healthcare
    roic: { good: 0.12, medium: 0.08 }, // 12%+ é bom
    roe: { good: 0.15, medium: 0.1 }, // 15%+ é sólido

    // Múltiplos - Específicos para Healthcare
    pl: { good: 20, medium: 35, reverse: true }, // <20 é bom, <35 é ok
    ps: { good: 5, medium: 8, reverse: true }, // <5 é bom, <8 é razoável
    peg: { good: 1.0, medium: 1.8, reverse: true }, // <1.0 é excelente, <1.8 é ok

    // Estrutura de capital - Healthcare específico
    debtToEbitda: { good: 2.5, medium: 4.0, reverse: true }, // <2.5 é bom
    liquidezCorrente: { good: 2.0, medium: 1.3 }, // 2.0+ é confortável
    debtEquity: { good: 0.6, medium: 1.2, reverse: true }, // <0.6 é conservador

    // Risco - Setor defensivo
    beta: { good: 0.9, medium: 1.2, reverse: true }, // <0.9 é estável

    // Healthcare específicos - Otimizados
    investimentoPD: { good: 0.15, medium: 0.08 }, // 15%+ é inovador
    rAnddEfficiency: { good: 0.25, medium: 0.12 }, // 0.25+ é eficiente
    cashFlowOverCapex: { good: 2.0, medium: 1.2 }, // 2.0+ é excelente
    fcf: { good: 2000000000, medium: 500000000 }, // 2B+ é muito bom, 500M+ é ok
    sgaOverRevenue: { good: 0.25, medium: 0.35, reverse: true }, // <25% é eficiente
    payoutRatio: { good: 0.6, medium: 0.8, reverse: true }, // <60% permite reinvestimento
  },
  Technology: {
    // Crescimento
    crescimentoReceita: { good: 0.2, medium: 0.1 },
    cagrEps: { good: 0.15, medium: 0.08 },
    eps: { good: 3.0, medium: 1.0 }, // ✅ CORRIGIDO para Tech

    // Margens (mantidas)
    margemBruta: { good: 0.6, medium: 0.4 },
    margemEbitda: { good: 0.3, medium: 0.15 },
    margemLiquida: { good: 0.15, medium: 0.08 },
    margemOperacional: { good: 0.2, medium: 0.1 },

    // Retornos (mantidos)
    roic: { good: 0.15, medium: 0.08 },
    roe: { good: 0.18, medium: 0.1 },

    // Múltiplos - ✅ CORRIGIDOS para Tech
    pl: { good: 25, medium: 40, reverse: true },
    ps: { good: 8, medium: 15, reverse: true },
    peg: { good: 1.0, medium: 1.5, reverse: true },

    // Estrutura de capital
    debtToEbitda: { good: 2, medium: 3.5, reverse: true },
    liquidezCorrente: { good: 1.8, medium: 1.2 }, // ✅ AJUSTADO
    cashRatio: { good: 0.5, medium: 0.3 },
    debtEquity: { good: 1, medium: 2, reverse: true },

    // Risco - ✅ CORRIGIDO para Tech
    beta: { good: 1.2, medium: 1.8, reverse: true },

    // Tech específicos - ✅ CORRIGIDOS
    investimentoPD: { good: 0.15, medium: 0.08 },
    rAnddEfficiency: { good: 0.5, medium: 0.2 }, // ✅ AJUSTADO
    cashFlowOverCapex: { good: 1.2, medium: 0.8 },
    fcf: { good: 1000000000, medium: 100000000 }, // ✅ CORRIGIDO (1B/100M)
    sgaOverRevenue: { good: 0.25, medium: 0.35, reverse: true },
    payoutRatio: { good: 0.4, medium: 0.7, reverse: true },
  },
  'Real Estate': {
    // === RENTABILIDADE E DIVIDENDOS ===
    dividendYield: { good: 6, medium: 4 }, // >6% é bom, >4% é médio

    // ✅ CORRIGIDO: Chave alinhada com indicadoresMeta e complementares
    dividendCagr5y: { good: 6, medium: 3 }, // >6% é bom, >3% é médio (REITs maduros)

    // ✅ MANTIDO: FFO Payout Ratio
    ffoPayoutRatio: { good: 80, medium: 90, reverse: true }, // <80% é ideal, <90% aceitável

    // === MÚLTIPLOS ESPECÍFICOS ===
    pVpa: { good: 1.2, medium: 1.8, reverse: true }, // <1.2 é bom, <1.8 é médio

    // ✅ MANTIDO: P/FFO real da API
    pFfo: { good: 15, medium: 20, reverse: true }, // P/FFO: <15x é bom, <20x é médio

    // === PERFORMANCE OPERACIONAL ===
    // ✅ MANTIDO: Margem EBITDA como proxy ocupação
    ocupacao: { good: 80, medium: 65 }, // Margem EBITDA >80% é boa, >65% é média

    capRate: { good: 6, medium: 4 }, // ROA >6% é bom, >4% é médio
    noi: { good: 5, medium: 2 }, // Crescimento >5% é bom, >2% é médio

    // === FLUXO DE CAIXA ===
    // ✅ MANTIDO: FFO real da API (valores em bilhões)
    ffo: { good: 1, medium: 0.5 }, // FFO >1B é bom, >500M é médio

    // ✅ MANTIDO: AFFO real da API
    affo: { good: 0.8, medium: 0.4 }, // AFFO >800M é bom, >400M é médio

    // ✅ NOVOS: Indicadores per share da API
    ffoPerShare: { good: 3, medium: 2 }, // FFO/Share >$3 é bom, >$2 é médio
    affoPerShare: { good: 2.5, medium: 1.5 }, // AFFO/Share >$2.5 é bom, >$1.5 é médio

    // === ESTRUTURA FINANCEIRA ===
    // ✅ ATUALIZADO: Agora é cobertura de dividendos, não juros
    coberturaJuros: { good: 2, medium: 1.2 }, // Cobertura dividendos >2x é boa, >1.2x é média
    dividaEbitda: { good: 6, medium: 9, reverse: true }, // <6x é bom, <9x é médio
    liquidezCorrente: { good: 1.2, medium: 0.8 }, // >1.2 é bom, >0.8 é médio

    // === GESTÃO DE CAPITAL ===
    navDiscount: { good: -10, medium: 10, reverse: true }, // Desconto >10% é oportunidade
    retentionRate: { good: 20, medium: 10 }, // >20% é bom, >10% é médio
  },
  'Consumer Defensive': {
    // === RENTABILIDADE E RETORNO ===
    // P/L: Setor defensivo prefere múltiplos mais baixos (15-22 é razoável)
    pe: { good: 18, medium: 25, reverse: true },

    // P/VPA: Defensivos premium podem ter P/VPA até 3x
    pb: { good: 2.5, medium: 3.5, reverse: true },

    // P/S: Margens estáveis permitem P/S moderado
    ps: { good: 2.5, medium: 4, reverse: true },

    // ROE: 15%+ é excelente para defensivos, 12%+ é bom
    roe: { good: 0.15, medium: 0.12 },

    // ROIC: 12%+ é excelente, 8%+ é aceitável
    roic: { good: 0.12, medium: 0.08 },

    // === MARGENS E EFICIÊNCIA ===
    // Margem Bruta: Crítica para defensivos, 35%+ é forte
    grossMargin: { good: 0.35, medium: 0.25 },

    // Margem EBITDA: 18%+ é forte, 12%+ é aceitável
    ebitdaMargin: { good: 0.18, medium: 0.12 },

    // Margem Líquida: 12%+ é excelente, 6%+ é ok
    margemLiquida: { good: 0.12, medium: 0.06 },

    // Margem Operacional: 15%+ é forte
    margemOperacional: { good: 0.15, medium: 0.08 },

    // === CRESCIMENTO E ESTABILIDADE ===
    // CAGR Receita: 8%+ é forte para defensivos, 3%+ é ok
    receitaCagr3y: { good: 0.08, medium: 0.03 },

    // Crescimento Receita: 10%+ é forte, 2%+ é aceitável
    crescimentoReceita: { good: 0.1, medium: 0.02 },

    // Consistência: 85%+ é excelente, 70%+ é ok
    consistenciaReceita: { good: 85, medium: 70 },

    // === ESTRUTURA DE CAPITAL ===
    // Dívida/EBITDA: <2x é conservador, <3.5x é aceitável
    dividaEbitda: { good: 2, medium: 3.5, reverse: true },

    // Cobertura de Juros: 6x+ é robusta, 3x+ é ok
    coberturaJuros: { good: 6, medium: 3 },

    // Liquidez: 1.5+ é adequada, 1.2+ é mínima
    liquidezCorrente: { good: 1.5, medium: 1.2 },

    // Debt/Equity: <0.5 é conservador, <1 é moderado
    debtEquity: { good: 0.5, medium: 1, reverse: true },

    // === FLUXO DE CAIXA ===
    // FCF: Positivo é essencial
    freeCashFlow: { good: 500000000, medium: 100000000 }, // 500M+/100M+

    // FCF Yield: 6%+ é atrativo, 3%+ é ok
    fcfYield: { good: 0.06, medium: 0.03 },

    // Working Capital Turnover: 6x+ é eficiente
    workingCapitalTurnover: { good: 6, medium: 3 },

    // Inventory Turnover: 10x+ é excelente, 6x+ é ok
    inventoryTurnover: { good: 10, medium: 6 },

    // === DIVIDENDOS (CRÍTICO PARA DEFENSIVOS) ===
    // Payout Ratio: <60% é conservador, <75% é ok
    payoutRatio: { good: 0.6, medium: 0.75, reverse: true },

    // Dividend Yield: 4%+ é atrativo, 2%+ é ok
    dividendYield: { good: 0.04, medium: 0.02 },

    // Crescimento Dividendos: 5%+ é forte, 0%+ é ok
    dividendGrowth: { good: 0.05, medium: 0 },

    // Anos de Dividendos: 20+ anos é excelente, 5+ é ok
    yearsOfDividends: { good: 20, medium: 5 },

    // === RISCO E VOLATILIDADE ===
    // Beta: <0.8 é defensivo, <1.2 é aceitável
    beta: { good: 0.8, medium: 1.2, reverse: true },

    // === MÉTRICAS ESPECÍFICAS ===
    // Market Share: 20%+ é significativo, 5%+ é relevante
    marketShare: { good: 20, medium: 5 },

    // Brand Strength: 8+/10 é forte, 6+/10 é ok
    brandStrength: { good: 8, medium: 6 },

    // Scores calculados (0-100)
    estabilidade: { good: 90, medium: 70 },
    qualidadeDefensiva: { good: 85, medium: 60 },
    sustentabilidadeDividendos: { good: 80, medium: 60 },
  },
  'Financial Services': {
    // ✅ Existentes e bem alinhados
    roe: { min: 12 },
    roa: { min: 1.2 },
    nim: { min: 3.5 },
    eficiencia: { max: 55, reverse: true },
    basileia: { min: 11 },
    tier1: { min: 9 },
    alavancagem: { max: 10, reverse: true },
    liquidez: { min: 1.2 },
    inadimplencia: { max: 3, reverse: true },
    cobertura: { min: 100 },
    custoCredito: { max: 2.5, reverse: true },
    pl: { min: 0, max: 15, reverse: true },
    pvpa: { max: 2, reverse: true },
    dividendYield: { min: 2 },
    payoutRatio: { min: 20, max: 60 },
    ldr: { min: 70, max: 90 },
    beta: { min: 0.5, max: 1.5 },
    crescimentoCarteira: { min: 5, max: 25 },

    // 🆕 ADICIONAR - Scores calculados que estão implementados
    rentabilidadeScore: { min: 70 },
    eficienciaScore: { min: 70 },
    solidezScore: { min: 70 },
    qualidadeAtivos: { min: 70 },

    // 🆕 ADICIONAR - Métricas que aparecem no código
    leveredDcf: { custom: 'aboveCurrentPrice' },
    precoAtual: { min: 0 }, // Apenas validação > 0
  },
  industrials: {
    // === RENTABILIDADE E EFICIÊNCIA ===
    margemEbitda: { good: 20, medium: 15 }, // >20% good, >15% medium
    roic: { good: 15, medium: 10 }, // >15% good, >10% medium
    roe: { good: 18, medium: 12 }, // >18% good, >12% medium
    margemLiquida: { good: 8, medium: 5 }, // >8% good, >5% medium

    // === ESTRUTURA FINANCEIRA ===
    alavancagem: { good: 2, medium: 3, reverse: true }, // <2x good, <3x medium
    coberturaJuros: { good: 5, medium: 3 }, // >5x good, >3x medium
    liquidezCorrente: { good: 1.8, medium: 1.2 }, // >1.8 good, >1.2 medium

    // === EFICIÊNCIA OPERACIONAL ===
    rotatividadeEstoques: { good: 8, medium: 5 }, // >8x good, >5x medium
    giroAtivo: { good: 1.2, medium: 0.8 }, // >1.2 good, >0.8 medium

    // === MÚLTIPLOS DE VALUATION ===
    pe: { good: 15, medium: 20, reverse: true }, // <15 good, <20 medium
    pb: { good: 2, medium: 3, reverse: true }, // <2 good, <3 medium
    ps: { good: 1.5, medium: 2.5, reverse: true }, // <1.5 good, <2.5 medium
    peg: { good: 1, medium: 1.5, reverse: true }, // <1 good, <1.5 medium

    // === DIVIDENDOS E RISCO ===
    dividendYield: { good: 3, medium: 2 }, // >3% good, >2% medium
    beta: { good: 1.2, medium: 1.6, reverse: true }, // <1.2 good, <1.6 medium

    // === FLUXO DE CAIXA ===
    fcf: { custom: 'positiveValue' }, // FCF > 0

    // === MÉTRICAS ESPECÍFICAS CALCULADAS ===
    eficienciaOperacional: { good: 80, medium: 65 }, // >80% good, >65% medium
    qualidadeAtivos: { good: 85, medium: 70 }, // >85% good, >70% medium
    cicloOperacional: { good: 45, medium: 75, reverse: true }, // <45 dias good, <75 medium
    alavancagemOperacional: { good: 80, medium: 65 }, // >80% good, >65% medium
  },
  Energy: {
    // === EXISTING THRESHOLDS (maintained) ===
    pe: { min: 0, max: 18, reverse: true },
    pb: { max: 2, reverse: true },
    margemEbitda: { min: 25 },
    dividaEbitda: { max: 2.5, reverse: true },
    coberturaJuros: { min: 3 },
    liquidezCorrente: { min: 1.2 },
    dividendYield: { min: 3 },
    roic: { min: 8 },
    freeCashFlow: { min: 0 },
    beta: { min: 0.6, max: 1.2 },
    leveredDcf: { custom: 'aboveCurrentPrice' },

    // === MISSING THRESHOLDS (recommended additions) ===

    // Rentabilidade e Retorno
    roe: { min: 8 }, // ROE mínimo para energy companies

    // Margens e Eficiência
    margemBruta: { min: 25 }, // Gross margin threshold
    margemLiquida: { min: 5 }, // Net margin threshold

    // Estrutura de Capital e Solvência
    debtEquity: { max: 1.2, reverse: true }, // Debt/Equity ratio

    // Fluxo de Caixa e Investimentos
    capexRevenue: { max: 25, reverse: true }, // CapEx intensity should be reasonable
    fcfYield: { min: 4 }, // FCF Yield minimum

    // Dividendos e Retorno
    payoutRatio: { max: 80, reverse: true }, // Sustainable payout ratio

    // Métricas Específicas de Energia
    custoProducao: { max: 70, reverse: true }, // Production cost per barrel
    breakEvenPrice: { max: 80, reverse: true }, // Break-even price threshold
    reservasProvadas: { min: 0 }, // Proven reserves should exist

    // Métricas Calculadas (optional - based on your calculations)
    eficienciaOperacional: { min: 60 }, // Operational efficiency score
    solidezFinanceira: { min: 65 }, // Financial solidity score
    geracaoCaixa: { min: 55 }, // Cash generation score
  },
  'Consumer Cyclical': {
    // Rentabilidade e Retorno
    pe: { good: 15, medium: 22, reverse: true }, // <15 good, <22 medium
    ps: { good: 1.5, medium: 3, reverse: true }, // <1.5 good, <3 medium
    pb: { good: 2, medium: 3.5, reverse: true }, // <2 good, <3.5 medium
    roe: { good: 0.15, medium: 0.1 }, // 15% good, 10% medium
    roic: { good: 0.12, medium: 0.08 }, // 12% good, 8% medium

    // Margens e Eficiência
    grossMargin: { good: 0.3, medium: 0.2 }, // 30% good, 20% medium
    ebitdaMargin: { good: 0.15, medium: 0.08 }, // 15% good, 8% medium
    margemLiquida: { good: 0.08, medium: 0.03 }, // 8% good, 3% medium
    margemOperacional: { good: 0.1, medium: 0.05 }, // 10% good, 5% medium

    // Crescimento e Performance Cíclica
    receitaCagr3y: { good: 0.08, medium: 0.03 }, // 8% good, 3% medium
    crescimentoReceita: { good: 0.1, medium: 0.02 }, // 10% good, 2% medium
    crescimentoEbitda: { good: 0.15, medium: 0.05 }, // 15% good, 5% medium

    // Estrutura de Capital e Solvência (crítico para cíclicas)
    endividamento: { good: 2, medium: 3.5, reverse: true }, // <2 good, <3.5 medium
    coberturaJuros: { good: 5, medium: 2.5 }, // >5 good, >2.5 medium
    liquidezCorrente: { good: 1.5, medium: 1.2 }, // >1.5 good, >1.2 medium
    debtEquity: { good: 0.5, medium: 1.5, reverse: true }, // <0.5 good, <1.5 medium

    // Eficiência Operacional (muito importante para cíclicas)
    rotatividadeEstoques: { good: 6, medium: 3 }, // >6 good, >3 medium
    workingCapitalTurnover: { good: 8, medium: 4 }, // >8 good, >4 medium
    assetTurnover: { good: 1.2, medium: 0.8 }, // >1.2 good, >0.8 medium
    receivablesTurnover: { good: 12, medium: 6 }, // >12 good, >6 medium

    // Fluxo de Caixa
    freeCashFlow: { good: 50000000, medium: 0 }, // >50M good, >0 medium
    fcfYield: { good: 0.08, medium: 0.03 }, // 8% good, 3% medium
    capexRevenue: { good: 0.05, medium: 0.12, reverse: true }, // <5% good, <12% medium

    // Dividendos e Retorno
    dividendYield: { good: 0.02, medium: 0.01 }, // 2% good, 1% medium
    payoutRatio: { good: 0.4, medium: 0.7, reverse: true }, // <40% good, <70% medium

    // Volatilidade e Avaliação
    beta: { good: 1.2, medium: 1.8, reverse: true }, // <1.2 good, <1.8 medium (cíclicas tendem a ter beta alto)
    leveredDcf: { good: 10, medium: 0 }, // >10 good, >0 medium

    // Métricas Específicas de Consumer Cyclical
    marketShare: { good: 0.15, medium: 0.05 }, // 15% good, 5% medium
    seasonalityIndex: { good: 40, medium: 80, reverse: true }, // <40 good, <80 medium (menor sazonalidade é melhor)
    consumerConfidence: { good: 40, medium: 70, reverse: true }, // <40 good, <70 medium (menor correlação pode ser melhor)

    // Métricas Calculadas (scores 0-100)
    sensibilidadeCiclica: { good: 75, medium: 60 }, // >75 good, >60 medium
    eficienciaOperacional: { good: 80, medium: 50 }, // >80 good, >50 medium
    resilienciaFinanceira: { good: 85, medium: 60 }, // >85 good, >60 medium
  },
  'Basic Materials': {
    // === RENTABILIDADE E RETORNO ===
    pe: { good: 15, medium: 25, reverse: true }, // P/E baixo é melhor para setor cíclico
    pb: { good: 2, medium: 3, reverse: true }, // P/B conservador para ativos tangíveis
    roe: { good: 12, medium: 8 }, // ROE sólido considerando ciclicalidade
    roic: { good: 10, medium: 6 }, // ROIC crítico para setor capital-intensivo

    // === MARGENS E EFICIÊNCIA ===
    margemEbitda: { good: 20, medium: 12 }, // Margem forte essencial para competitividade
    margemBruta: { good: 30, medium: 20 }, // Controle de custos diretos
    margemLiquida: { good: 10, medium: 5 }, // Conversão final em lucro
    margemOperacional: { good: 15, medium: 8 }, // Eficiência operacional

    // === ESTRUTURA DE CAPITAL (crítica para setor cíclico) ===
    dividaEbitda: { good: 2.5, medium: 4, reverse: true }, // Endividamento conservador
    coberturaJuros: { good: 4, medium: 2.5 }, // Proteção em ciclos baixos
    liquidezCorrente: { good: 1.5, medium: 1.2 }, // Liquidez para operações
    debtEquity: { good: 0.6, medium: 1.2, reverse: true }, // Alavancagem moderada

    // === FLUXO DE CAIXA E CAPITAL ===
    freeCashFlow: { good: 100000000, medium: 0 }, // FCF positivo (100M threshold)
    capexRevenue: { good: 12, medium: 20, reverse: true }, // CapEx eficiente vs receita
    fcfYield: { good: 7, medium: 3 }, // Yield atrativo vs valorização
    workingCapitalTurnover: { good: 6, medium: 3 }, // Eficiência capital de giro

    // === CRESCIMENTO ===
    crescimentoReceita: { good: 8, medium: 0 }, // Crescimento positivo
    crescimentoEbitda: { good: 15, medium: 0 }, // Alavancagem operacional

    // === DIVIDENDOS E RETORNO ===
    dividendYield: { good: 4, medium: 2 }, // Yield atrativo
    payoutRatio: { good: 50, medium: 75, reverse: true }, // Payout sustentável

    // === RISCO E VOLATILIDADE ===
    beta: { good: 1.2, medium: 1.6, reverse: true }, // Volatilidade controlada

    // === MÉTRICAS ESPECÍFICAS DE BASIC MATERIALS ===
    inventoryTurnover: { good: 6, medium: 3 }, // Giro eficiente de inventário
    assetTurnover: { good: 1, medium: 0.6 }, // Uso eficiente de ativos
    capacityUtilization: { good: 80, medium: 65 }, // Utilização alta da capacidade

    // === MÉTRICAS CALCULADAS (scores compostos) ===
    eficienciaOperacional: { good: 80, medium: 60 }, // Score de eficiência
    gestaoCapital: { good: 85, medium: 65 }, // Score de gestão de capital
    geracaoValor: { good: 75, medium: 55 }, // Score de geração de valor
  },
  utilities: {
    // === MÚLTIPLOS DE VALUATION ===
    pl: { good: 15, medium: 20, reverse: true }, // <15 good, <20 medium (Utilities típico: 12-18x)
    pb: { good: 1.2, medium: 1.8, reverse: true }, // <1.2 good, <1.8 medium
    ps: { good: 1.5, medium: 2.5, reverse: true }, // <1.5 good, <2.5 medium
    earningsYield: { good: 7, medium: 5 }, // >7% good, >5% medium (1/PE)

    // === RENTABILIDADE ===
    roe: { good: 12, medium: 8 }, // >12% good, >8% medium (Típico: 10-15%)
    roic: { good: 8, medium: 5 }, // >8% good, >5% medium
    regulatoryROE: { good: 10, medium: 8 }, // ✅ NOVO: >10% good, >8% medium
    margemEbitda: { good: 35, medium: 25 }, // >35% good, >25% medium
    margemOperacional: { good: 25, medium: 15 }, // >25% good, >15% medium
    margemLiquida: { good: 15, medium: 10 }, // >15% good, >10% medium

    // === DIVIDENDOS E DISTRIBUIÇÕES (CORE) ===
    dividendYield: { good: 4.5, medium: 3 }, // >4.5% good, >3% medium
    payoutRatio: { good: 70, medium: 85, reverse: true }, // <70% good, <85% medium
    dividendCagr5y: { good: 4, medium: 2 }, // >4% good, >2% medium
    dividendConsistency: { good: 95, medium: 85 }, // ✅ NOVO: >95% good, >85% medium

    // === ESTRUTURA FINANCEIRA ===
    endividamento: { good: 50, medium: 65, reverse: true }, // <50% good, <65% medium
    debtToEbitda: { good: 4, medium: 5.5, reverse: true }, // <4x good, <5.5x medium
    coberturaJuros: { good: 3.5, medium: 2 }, // >3.5x good, >2x medium (CRÍTICO)
    liquidezCorrente: { good: 1.2, medium: 0.8 }, // >1.2 good, >0.8 medium

    // === EFICIÊNCIA OPERACIONAL ===
    giroAtivo: { good: 0.4, medium: 0.25 }, // >0.4 good, >0.25 medium
    capexOverRevenue: { good: 15, medium: 25, reverse: true }, // <15% good, <25% medium
    assetAge: { good: 15, medium: 25, reverse: true }, // ✅ NOVO: <15 anos good, <25 medium

    // === CRESCIMENTO ===
    crescimentoReceita: { good: 5, medium: 2 }, // >5% good, >2% medium
    crescimentoEps: { good: 6, medium: 3 }, // >6% good, >3% medium
    rateBaseGrowth: { good: 4, medium: 2 }, // ✅ NOVO: >4% good, >2% medium

    // === MÉTRICAS ESPECÍFICAS ===
    fcf: { good: 0, medium: -500000000 }, // >0 good, >-500M medium (utilities podem ter FCF negativo em ciclos de CapEx)
    capacityFactor: { good: 80, medium: 65 }, // ✅ NOVO: >80% good, >65% medium
    renewablePercentage: { good: 50, medium: 25 }, // ✅ NOVO: >50% good, >25% medium (ESG)

    // === VALUATION ===
    leveredDcf: { custom: 'aboveCurrentPrice' }, // DCF > Preço atual
  },
  // ✅ THRESHOLDS OTIMIZADOS PARA COMMUNICATION SERVICES GENERALIZADO
  'Communication Services': {
    // === RENTABILIDADE E RETORNO (Ajustados) ===
    pe: { good: 22, medium: 40, reverse: true }, // Mais flexível para growth
    ps: { good: 4, medium: 8, reverse: true }, // Ampliado para diferentes modelos
    pb: { good: 3.0, medium: 6, reverse: true }, // Mais inclusivo
    roe: { good: 0.18, medium: 0.1 }, // 18%/10% (realista)
    roic: { good: 0.12, medium: 0.06 }, // 12%/6% (generalizado)

    // === MARGENS (Flexíveis para subsetores) ===
    grossMargin: { good: 0.35, medium: 0.2 }, // 35%/20% (cobre telco a streaming)
    ebitdaMargin: { good: 0.22, medium: 0.12 }, // 22%/12% (realista)
    margemLiquida: { good: 0.12, medium: 0.06 }, // 12%/6% (balanceado)
    margemOperacional: { good: 0.18, medium: 0.08 }, // 18%/8% (operacional)

    // === CRESCIMENTO (Ajustado para realismo) ===
    receitaCagr3y: { good: 0.12, medium: 0.04 }, // 12%/4% (3Y mais conservador)
    crescimentoReceita: { good: 0.1, medium: 0.02 }, // 10%/2% (anual realista)
    crescimentoEbitda: { good: 0.15, medium: 0.03 }, // 15%/3% (alavancagem operacional)

    // === ESTRUTURA CAPITAL (Conservador) ===
    dividaEbitda: { good: 3.0, medium: 5.0, reverse: true }, // Mais flexível
    coberturaJuros: { good: 6, medium: 2.5 }, // 6x/2.5x (realista)
    liquidezCorrente: { good: 1.3, medium: 0.8 }, // Flexível
    debtEquity: { good: 1.0, medium: 2.5, reverse: true }, // Mais inclusivo

    // === FLUXO DE CAIXA (Ajustado por tamanho) ===
    freeCashFlow: { good: 200000000, medium: 10000000 }, // 200M/10M (mais inclusivo)
    fcfYield: { good: 0.05, medium: 0.02 }, // 5%/2% (realista)
    capexRevenue: { good: 0.1, medium: 0.25, reverse: true }, // 10%/25% (flexível)

    // === DIVIDENDOS (Balanceado) ===
    dividendYield: { good: 0.025, medium: 0.01 }, // 2.5%/1% (realista)
    payoutRatio: { good: 0.6, medium: 0.85, reverse: true }, // 60%/85% (sustentável)

    // === RISCO E AVALIAÇÃO ===
    beta: { good: 1.1, medium: 1.6, reverse: true }, // Aceita volatilidade setorial
    leveredDcf: { good: 5, medium: 0 }, // Mais inclusivo

    // === MÉTRICAS ESPECÍFICAS COMMUNICATION SERVICES ===
    userGrowth: { good: 0.12, medium: 0.03 }, // 12%/3% (realista)
    arpu: { good: 40, medium: 15 }, // $40/$15 (flexível)
    churnRate: { good: 8, medium: 20, reverse: true }, // 8%/20% (realista)
    contentInvestment: { good: 0.18, medium: 0.3 }, // 18%/30% (balance ideal)

    // === SCORES CALCULADOS ===
    scoreGrowth: { good: 80, medium: 55 }, // 80/55 (realista)
    scoreProfitability: { good: 75, medium: 45 }, // 75/45 (balanceado)
    scoreQuality: { good: 80, medium: 55 }, // 80/55 (qualidade)
  },
} as const

export type ThresholdsPorSetor = typeof thresholds
export type Setor = keyof ThresholdsPorSetor
