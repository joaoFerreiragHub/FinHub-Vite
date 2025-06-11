export const thresholds = {

  Healthcare: {
    // Crescimento - Específico para Healthcare
    crescimentoReceita: { good: 0.10, medium: 0.04 }, // 10%+ é bom, 4%+ é médio
    cagrEps: { good: 0.15, medium: 0.08 }, // 15%+ é excelente, 8%+ é bom
    eps: { good: 2.0, medium: 1.0 }, // $2+ é bom para Healthcare

    // Margens - Otimizadas para Healthcare
    margemBruta: { good: 0.65, medium: 0.45 }, // 65%+ é excelente
    margemEbitda: { good: 0.25, medium: 0.15 }, // 25%+ é muito bom
    margemLiquida: { good: 0.12, medium: 0.06 }, // 12%+ é sólido
    margemOperacional: { good: 0.20, medium: 0.10 }, // 20%+ é excelente

    // Retornos - Adequados para Healthcare
    roic: { good: 0.12, medium: 0.08 }, // 12%+ é bom
    roe: { good: 0.15, medium: 0.10 }, // 15%+ é sólido

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
      crescimentoReceita: { good: 0.20, medium: 0.10 },
      cagrEps: { good: 0.15, medium: 0.08 },
      eps: { good: 3.0, medium: 1.0 }, // ✅ CORRIGIDO para Tech

      // Margens (mantidas)
      margemBruta: { good: 0.6, medium: 0.4 },
      margemEbitda: { good: 0.3, medium: 0.15 },
      margemLiquida: { good: 0.15, medium: 0.08 },
      margemOperacional: { good: 0.20, medium: 0.10 },

      // Retornos (mantidos)
      roic: { good: 0.15, medium: 0.08 },
      roe: { good: 0.18, medium: 0.10 },

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
    utilities: {
      // Múltiplos de Valuation
      pl: { good: 15, medium: 20, reverse: true },              // <15 good, <20 medium
      pb: { good: 1.2, medium: 1.8, reverse: true },            // <1.2 good, <1.8 medium
      ps: { good: 1.5, medium: 2.5, reverse: true },            // <1.5 good, <2.5 medium

      // Rentabilidade
      roe: { good: 12, medium: 8 },                             // >12% good, >8% medium
      roic: { good: 8, medium: 5 },                             // >8% good, >5% medium
      margemEbitda: { good: 35, medium: 25 },                   // >35% good, >25% medium
      margemOperacional: { good: 25, medium: 15 },              // >25% good, >15% medium
      margemLiquida: { good: 15, medium: 10 },                  // >15% good, >10% medium

      // Dividendos e Distribuições
      dividendYield: { good: 4.5, medium: 3 },                  // >4.5% good, >3% medium
      payoutRatio: { good: 70, medium: 85, reverse: true },     // <70% good, <85% medium
      dividendCagr5y: { good: 4, medium: 2 },                   // >4% good, >2% medium

      // Estrutura Financeira
      endividamento: { good: 50, medium: 65, reverse: true },   // <50% good, <65% medium
      debtToEbitda: { good: 4, medium: 5.5, reverse: true },    // <4x good, <5.5x medium
      coberturaJuros: { good: 3.5, medium: 2 },                 // >3.5x good, >2x medium
      liquidezCorrente: { good: 1.2, medium: 0.8 },             // >1.2 good, >0.8 medium

      // Eficiência Operacional
      giroAtivo: { good: 0.4, medium: 0.25 },                   // >0.4 good, >0.25 medium
      capexOverRevenue: { good: 15, medium: 25, reverse: true }, // <15% good, <25% medium

      // Crescimento
      crescimentoReceita: { good: 5, medium: 2 },               // >5% good, >2% medium
      crescimentoEps: { good: 6, medium: 3 },                   // >6% good, >3% medium

      // Valuation vs Fundamentals
      earningsYield: { good: 7, medium: 5 },                    // >7% good, >5% medium (1/PE)
      leveredDcf: { custom: 'aboveCurrentPrice' },              // DCF > Preço atual
    },
    "Real Estate": {
      // ✅ PERCENTUAIS: Os dados vêm como números (283.37, não 2.8337)
      dividendYield: { good: 50, medium: 100, reverse: true },   // Payout Ratio 283.37% vs 50% ✅
      dividendCagr5y: { good: 10, medium: 5 },                  // CAGR EPS 0.00% vs 10% ✅

      // ✅ RATIOS: Números simples
      pVpa: { good: 15, medium: 25, reverse: true },             // P/L 51.84 vs 15 ✅
      pFfo: { good: 12, medium: 15, reverse: true },             // P/FFO 9.38 vs 12 ✅

      // ✅ PERCENTUAIS: Ajustados para formato real
      ocupacao: { good: 30, medium: 20 },                        // Margem Operacional 44.38% vs 30% ✅
      capRate: { good: 15, medium: 10 },                         // ROE 2.52% vs 15% ✅
      noi: { good: 15, medium: 5 },                              // Crescimento Receita 29.23% vs 15% ✅

      // ✅ MONETÁRIOS: Os dados vêm como 3.6 (de "3.6B"), não 3600000000
      ffo: { good: 2, medium: 1 },                               // FFO 3.6B vs 2B ✅
      affo: { good: 2, medium: 1 },                              // Free Cash Flow 3.6B vs 2B ✅

      // ✅ PERCENTUAIS: Ajustados
      coberturaJuros: { good: 15, medium: 8 },                   // ROIC 3.27% vs 15% ✅
      dividaEbitda: { good: 3, medium: 6, reverse: true },       // Dívida/EBITDA 6.34 vs 3 ✅
      liquidezCorrente: { good: 1.5, medium: 1.0 },              // Liquidez 1.45 vs 1.5 ✅
    },
    industrials: {
      // === RENTABILIDADE E EFICIÊNCIA ===
      'margemEbitda': { good: 20, medium: 15 },              // >20% good, >15% medium
      'roic': { good: 15, medium: 10 },                      // >15% good, >10% medium
      'roe': { good: 18, medium: 12 },                       // >18% good, >12% medium
      'margemOperacional': { good: 15, medium: 10 },         // >15% good, >10% medium
      'margemLiquida': { good: 8, medium: 5 },               // >8% good, >5% medium

      // === ESTRUTURA FINANCEIRA ===
      'alavancagem': { good: 2, medium: 3, reverse: true },  // <2x good, <3x medium
      'coberturaJuros': { good: 5, medium: 3 },              // >5x good, >3x medium
      'liquidezCorrente': { good: 1.8, medium: 1.2 },       // >1.8 good, >1.2 medium
      'endividamento': { good: 40, medium: 60, reverse: true }, // <40% good, <60% medium

      // === EFICIÊNCIA OPERACIONAL ===
      'rotatividadeEstoques': { good: 8, medium: 5 },        // >8x good, >5x medium
      'giroAtivo': { good: 1.2, medium: 0.8 },               // >1.2 good, >0.8 medium
      'cicloOperacional': { good: 60, medium: 90, reverse: true }, // <60 dias good, <90 medium
      'capexOverRevenue': { good: 5, medium: 8, reverse: true }, // <5% good, <8% medium

      // === MÚLTIPLOS DE VALUATION ===
      'pe': { good: 15, medium: 20, reverse: true },         // <15 good, <20 medium
      'pb': { good: 2, medium: 3, reverse: true },           // <2 good, <3 medium
      'ps': { good: 1.5, medium: 2.5, reverse: true },      // <1.5 good, <2.5 medium
      'peg': { good: 1, medium: 1.5, reverse: true },       // <1 good, <1.5 medium

      // === DIVIDENDOS E RISCO ===
      'dividendYield': { good: 3, medium: 2 },               // >3% good, >2% medium
      'payoutRatio': { good: 50, medium: 70, reverse: true }, // <50% good, <70% medium
      'beta': { good: 1.2, medium: 1.6, reverse: true },    // <1.2 good, <1.6 medium

      // === CRESCIMENTO ===
      'crescimentoReceita': { good: 8, medium: 4 },          // >8% good, >4% medium
      'crescimentoEps': { good: 10, medium: 5 },             // >10% good, >5% medium

      // === MÉTRICAS ESPECÍFICAS ===
      'fcf': { custom: 'positiveValue' },                    // FCF > 0
      'eficienciaCapitalGiro': { good: 80, medium: 65 },     // >80% good, >65% medium
      'qualidadeAtivos': { good: 85, medium: 70 },           // >85% good, >70% medium
      'cicloConversaoCaixa': { good: 45, medium: 75, reverse: true }, // <45 dias good, <75 medium
    },
    Energy: {
      'pe': { min: 0, max: 18, reverse: true },
      'pb': { max: 2, reverse: true },
      'margemEbitda': { min: 25 },
      'dividaEbitda': { max: 2.5, reverse: true },
      'coberturaJuros': { min: 3 },
      'liquidezCorrente': { min: 1.2 },
      'dividendYield': { min: 3 },
      'roic': { min: 8 },
      'freeCashFlow': { min: 0 },
      'beta': { min: 0.6, max: 1.2 },
      'leveredDcf': { custom: 'aboveCurrentPrice' },
    },
    "Consumer Defensive": {
      'pe': { min: 0, max: 22, reverse: true },
      'pb': { max: 3, reverse: true },
      'ps': { max: 4, reverse: true },
      'roe': { min: 15 },
      'grossMargin': { min: 30 },
      'ebitdaMargin': { min: 15 },
      'receitaCagr3y': { min: 7 },
      'payoutRatio': { min: 0, max: 70 },
      'dividendYield': { min: 3 },
      'beta': { max: 1, reverse: true },
      'roic': { min: 12 },
      'margemLiquida': { min: 8 },
      'margemOperacional': { min: 12 },
      'crescimentoReceita': { min: 5 },
      'consistenciaReceita': { min: 80 },
      'dividaEbitda': { max: 3, reverse: true },
      'coberturaJuros': { min: 4 },
      'liquidezCorrente': { min: 1.2 },
      'debtEquity': { max: 1, reverse: true },
      'freeCashFlow': { min: 0 },
      'fcfYield': { min: 4 },
      'workingCapitalTurnover': { min: 5 },
      'inventoryTurnover': { min: 8 },
      'dividendGrowth': { min: 3 },
      'yearsOfDividends': { min: 10 },
      'leveredDcf': { custom: 'aboveCurrentPrice' },
      'marketShare': { min: 10 },
      'brandStrength': { min: 7 },
      'storeCount': { min: 0 },
    },
    "Financial Services": {
      // Rentabilidade e Eficiência
      'roe': { min: 12 }, // ROE > 12%
      'roa': { min: 1.2 }, // ROA > 1.2% (específico para bancos)
      'nim': { min: 3.5 }, // NIM > 3.5% (Margem Financeira Líquida)
      'eficiencia': { max: 55, reverse: true }, // Eficiência < 55%
      'margemFinanceira': { min: 3.5 }, // Alias para NIM

      // Solidez e Capitalização
      'indiceBasileia': { min: 11 }, // Basileia > 11%
      'basileia': { min: 11 }, // Alias para indiceBasileia
      'tier1': { min: 9 }, // Tier 1 > 9%
      'capitalPrincipal': { min: 9 }, // Alias para tier1

      // Estrutura de Capital e Risco
      'alavancagem': { max: 10, reverse: true }, // Alavancagem < 10x
      'liquidez': { min: 1.2 }, // Liquidez > 1.2
      'liquidezCorrente': { min: 1.2 }, // Alias para liquidez
      'inadimplencia': { max: 3, reverse: true }, // Inadimplência < 3%
      'cobertura': { min: 100 }, // Cobertura > 100%
      'coberturaProvisoes': { min: 100 }, // Alias para cobertura
      'custoCredito': { max: 2.5, reverse: true }, // Custo do Crédito < 2.5%
      'custoRisco': { max: 2.5, reverse: true }, // Alias para custoCredito

      // Múltiplos de Avaliação
      'pl': { min: 0, max: 15, reverse: true }, // P/L entre 0-15 (menor melhor)
      'pVpa': { max: 2, reverse: true }, // P/VPA < 2x
      'pvpa': { max: 2, reverse: true }, // Alias para pVpa
      'leveredDcf': { custom: 'aboveCurrentPrice' }, // DCF > Preço Atual

      // Dividendos e Retorno
      'dividendYield': { min: 2 }, // Dividend Yield > 2%
      'payoutRatio': { min: 20, max: 60 }, // Payout entre 20-60%

      // Métricas Específicas Bancárias
      'ldr': { min: 70, max: 90 }, // LDR entre 70-90%
      'loanToDepositRatio': { min: 70, max: 90 }, // Alias para LDR
      'beta': { min: 0.5, max: 1.5 }, // Beta entre 0.5-1.5
      'crescimentoCarteira': { min: 5, max: 25 }, // Crescimento Carteira 5-25%

      // Métricas Calculadas
      'qualidadeCredito': { min: 70 }, // Score calculado
      'solidezPatrimonial': { min: 70 }, // Score calculado
      'eficienciaAjustada': { min: 60 }, // Score calculado
    },
"Consumer Cyclical": {
  // Rentabilidade e Retorno
  pe: { good: 15, medium: 22, reverse: true },        // <15 good, <22 medium
  ps: { good: 1.5, medium: 3, reverse: true },        // <1.5 good, <3 medium
  pb: { good: 2, medium: 3.5, reverse: true },        // <2 good, <3.5 medium
  roe: { good: 0.15, medium: 0.10 },                  // 15% good, 10% medium
  roic: { good: 0.12, medium: 0.08 },                 // 12% good, 8% medium

  // Margens e Eficiência
  grossMargin: { good: 0.30, medium: 0.20 },          // 30% good, 20% medium
  ebitdaMargin: { good: 0.15, medium: 0.08 },         // 15% good, 8% medium
  margemLiquida: { good: 0.08, medium: 0.03 },        // 8% good, 3% medium
  margemOperacional: { good: 0.10, medium: 0.05 },    // 10% good, 5% medium

  // Crescimento e Performance Cíclica
  receitaCagr3y: { good: 0.08, medium: 0.03 },        // 8% good, 3% medium
  crescimentoReceita: { good: 0.10, medium: 0.02 },   // 10% good, 2% medium
  crescimentoEbitda: { good: 0.15, medium: 0.05 },    // 15% good, 5% medium

  // Estrutura de Capital e Solvência (crítico para cíclicas)
  endividamento: { good: 2, medium: 3.5, reverse: true },     // <2 good, <3.5 medium
  coberturaJuros: { good: 5, medium: 2.5 },                   // >5 good, >2.5 medium
  liquidezCorrente: { good: 1.5, medium: 1.2 },              // >1.5 good, >1.2 medium
  debtEquity: { good: 0.5, medium: 1.5, reverse: true },     // <0.5 good, <1.5 medium

  // Eficiência Operacional (muito importante para cíclicas)
  rotatividadeEstoques: { good: 6, medium: 3 },               // >6 good, >3 medium
  workingCapitalTurnover: { good: 8, medium: 4 },             // >8 good, >4 medium
  assetTurnover: { good: 1.2, medium: 0.8 },                  // >1.2 good, >0.8 medium
  receivablesTurnover: { good: 12, medium: 6 },               // >12 good, >6 medium

  // Fluxo de Caixa
  freeCashFlow: { good: 50000000, medium: 0 },                // >50M good, >0 medium
  fcfYield: { good: 0.08, medium: 0.03 },                     // 8% good, 3% medium
  capexRevenue: { good: 0.05, medium: 0.12, reverse: true },  // <5% good, <12% medium

  // Dividendos e Retorno
  dividendYield: { good: 0.02, medium: 0.01 },                // 2% good, 1% medium
  payoutRatio: { good: 0.40, medium: 0.70, reverse: true },   // <40% good, <70% medium

  // Volatilidade e Avaliação
  beta: { good: 1.2, medium: 1.8, reverse: true },           // <1.2 good, <1.8 medium (cíclicas tendem a ter beta alto)
  leveredDcf: { good: 10, medium: 0 },                        // >10 good, >0 medium

  // Métricas Específicas de Consumer Cyclical
  marketShare: { good: 0.15, medium: 0.05 },                  // 15% good, 5% medium
  seasonalityIndex: { good: 40, medium: 80, reverse: true },  // <40 good, <80 medium (menor sazonalidade é melhor)
  consumerConfidence: { good: 40, medium: 70, reverse: true }, // <40 good, <70 medium (menor correlação pode ser melhor)

  // Métricas Calculadas (scores 0-100)
  sensibilidadeCiclica: { good: 75, medium: 60 },             // >75 good, >60 medium
  eficienciaOperacional: { good: 80, medium: 50 },            // >80 good, >50 medium
  resilienciaFinanceira: { good: 85, medium: 60 },            // >85 good, >60 medium
},
"Communication Services": {
  // Rentabilidade e Retorno
  pe: { good: 20, medium: 35, reverse: true },        // <20 good, <35 medium
  ps: { good: 3, medium: 6, reverse: true },          // <3 good, <6 medium
  pb: { good: 2.5, medium: 5, reverse: true },        // <2.5 good, <5 medium
  roe: { good: 0.20, medium: 0.12 },                  // 20% good, 12% medium
  roic: { good: 0.15, medium: 0.08 },                 // 15% good, 8% medium

  // Margens e Eficiência
  grossMargin: { good: 0.40, medium: 0.25 },          // 40% good, 25% medium
  ebitdaMargin: { good: 0.25, medium: 0.15 },         // 25% good, 15% medium
  margemLiquida: { good: 0.15, medium: 0.08 },        // 15% good, 8% medium
  margemOperacional: { good: 0.20, medium: 0.10 },    // 20% good, 10% medium

  // Crescimento e Performance
  receitaCagr3y: { good: 0.15, medium: 0.05 },        // 15% good, 5% medium
  crescimentoReceita: { good: 0.12, medium: 0.03 },   // 12% good, 3% medium
  crescimentoEbitda: { good: 0.18, medium: 0.05 },    // 18% good, 5% medium

  // Estrutura de Capital e Solvência
  dividaEbitda: { good: 2.5, medium: 4, reverse: true },      // <2.5 good, <4 medium
  coberturaJuros: { good: 8, medium: 3 },                     // >8 good, >3 medium
  liquidezCorrente: { good: 1.5, medium: 1 },                 // >1.5 good, >1 medium
  debtEquity: { good: 0.8, medium: 2, reverse: true },        // <0.8 good, <2 medium

  // Fluxo de Caixa
  freeCashFlow: { good: 100000000, medium: 0 },               // >100M good, >0 medium
  fcfYield: { good: 0.06, medium: 0.02 },                     // 6% good, 2% medium
  capexRevenue: { good: 0.08, medium: 0.20, reverse: true },  // <8% good, <20% medium

  // Dividendos e Retorno
  dividendYield: { good: 0.03, medium: 0.01 },                // 3% good, 1% medium
  payoutRatio: { good: 0.50, medium: 0.80, reverse: true },   // <50% good, <80% medium

  // Volatilidade e Avaliação
  beta: { good: 0.9, medium: 1.3, reverse: true },           // <0.9 good, <1.3 medium
  leveredDcf: { good: 10, medium: 0 },                        // >10 good, >0 medium

  // Métricas Específicas de Communication Services
  userGrowth: { good: 0.15, medium: 0.05 },                   // 15% good, 5% medium
  arpu: { good: 50, medium: 20 },                             // >$50 good, >$20 medium
  churnRate: { good: 5, medium: 15, reverse: true },          // <5% good, <15% medium
  contentInvestment: { good: 15, medium: 25 },                // 15% good, 25% medium (balanced investment)

  // Métricas Calculadas (scores 0-100)
  scoreGrowth: { good: 85, medium: 60 },                      // >85 good, >60 medium
  scoreProfitability: { good: 80, medium: 50 },               // >80 good, >50 medium
  scoreQuality: { good: 85, medium: 60 },                     // >85 good, >60 medium
},
    "Basic Materials": {
      'pe': { min: 0, max: 25, reverse: true },
      'pb': { max: 3, reverse: true },
      'roic': { min: 10 },
      'margemEbitda': { min: 20 },
    },
} as const;

export type ThresholdsPorSetor = typeof thresholds
export type Setor = keyof ThresholdsPorSetor
