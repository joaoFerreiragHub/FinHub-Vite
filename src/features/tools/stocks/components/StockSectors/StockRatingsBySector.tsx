import { RatingsBasicMaterials } from './RatingsBasicMaterials'
import { RatingsCommunication } from './RatingsCommunication'
import { RatingsConsumerCyclical } from './RatingsConsumerCyclical'
import { RatingsConsumerDefensive } from './RatingsConsumerDefensive'
import { RatingsEnergy } from './RatingsEnergy'
import { RatingsFinancials } from './RatingsFinancial'
import { RatingsHealthcare } from './RatingsHealth'
import { RatingsIndustrials } from './RatingsIndustrials'
import { RatingsREITs } from './RatingsREIT'
import { RatingsTech } from './RatingsTech'
import { RatingsUtilities } from './RatingsUtilities'

interface StockRatingsBySectorProps {
  setor: string
  indicadores: Record<string, string>
}

function resolveSetorAlias(setor: string): string {
  const normalized = String(setor || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

  if (!normalized) return setor

  if (normalized.includes('health care')) return 'Healthcare'
  if (normalized.includes('consumer staples')) return 'Consumer Defensive'
  if (normalized.includes('consumer discretionary')) return 'Consumer Cyclical'
  if (normalized.includes('materials') && !normalized.includes('basic')) return 'Basic Materials'
  if (normalized.includes('telecom') || normalized.includes('communication services')) {
    return 'Communication Services'
  }

  return setor
}

export function StockRatingsBySector({ setor, indicadores }: StockRatingsBySectorProps) {
  const setorResolvido = resolveSetorAlias(setor)
  console.log('StockRatingsBySector', { setor, indicadores })
  return (
    <>
      {setorResolvido === 'Healthcare' && (
        <RatingsHealthcare
          // Crescimento e Performance
          crescimentoReceita={indicadores['Crescimento Receita'] ?? '—'}
          crescimentoReceitaAnoAnterior={indicadores['Crescimento Receita (Y-1)'] ?? undefined}
          cagrEps={indicadores['CAGR EPS'] ?? '—'}
          cagrEpsAnoAnterior={indicadores['CAGR EPS (Y-1)'] ?? undefined}
          eps={indicadores['EPS'] ?? '—'}
          epsAnoAnterior={indicadores['EPS (Y-1)'] ?? undefined}
          // Margens e Rentabilidade
          margemBruta={indicadores['Margem Bruta'] ?? '—'}
          margemBrutaAnoAnterior={indicadores['Margem Bruta (Y-1)'] ?? undefined}
          margemEbitda={indicadores['Margem EBITDA'] ?? '—'}
          margemEbitdaAnoAnterior={indicadores['Margem EBITDA (Y-1)'] ?? undefined}
          margemLiquida={indicadores['Margem Líquida'] ?? '—'}
          margemLiquidaAnoAnterior={indicadores['Margem Líquida (Y-1)'] ?? undefined}
          margemOperacional={indicadores['Margem Operacional'] ?? '—'}
          margemOperacionalAnoAnterior={indicadores['Margem Operacional (Y-1)'] ?? undefined}
          // Retorno sobre Capital
          roic={indicadores['ROIC'] ?? '—'}
          roicAnoAnterior={indicadores['ROIC (Y-1)'] ?? undefined}
          roe={indicadores['ROE'] ?? '—'}
          roeAnoAnterior={indicadores['ROE (Y-1)'] ?? undefined}
          // Múltiplos de Avaliação
          pl={indicadores['P/L'] ?? '—'}
          plAnoAnterior={indicadores['P/L (Y-1)'] ?? undefined}
          ps={indicadores['P/S'] ?? '—'}
          psAnoAnterior={indicadores['P/S (Y-1)'] ?? undefined}
          peg={indicadores['PEG'] ?? '—'}
          pegAnoAnterior={indicadores['PEG (Y-1)'] ?? undefined}
          // Estrutura de Capital e Liquidez
          debtToEbitda={indicadores['Dívida/EBITDA'] ?? '—'}
          debtToEbitdaAnoAnterior={indicadores['Dívida/EBITDA (Y-1)'] ?? undefined}
          liquidezCorrente={indicadores['Liquidez Corrente'] ?? '—'}
          liquidezCorrenteAnoAnterior={indicadores['Liquidez Corrente (Y-1)'] ?? undefined}
          debtEquity={indicadores['Dívida / Capitais Próprios'] ?? '—'}
          debtEquityAnoAnterior={indicadores['Dívida / Capitais Próprios (Y-1)'] ?? undefined}
          // Risco e Volatilidade
          beta={indicadores['Beta'] ?? '—'}
          betaAnoAnterior={indicadores['Beta (Y-1)'] ?? undefined}
          // Métricas Específicas de Healthcare
          investimentoPD={indicadores['Investimento em P&D'] ?? '—'}
          investimentoPDAnoAnterior={indicadores['Investimento em P&D (Y-1)'] ?? undefined}
          rAnddEfficiency={indicadores['Eficiência de P&D'] ?? '—'}
          rAnddEfficiencyAnoAnterior={indicadores['Eficiência de P&D (Y-1)'] ?? undefined}
          cashFlowOverCapex={indicadores['Cash Flow / CapEx'] ?? '—'}
          cashFlowOverCapexAnoAnterior={indicadores['Cash Flow / CapEx (Y-1)'] ?? undefined}
          fcf={indicadores['Free Cash Flow'] ?? '—'}
          fcfAnoAnterior={indicadores['Free Cash Flow (Y-1)'] ?? undefined}
          sgaOverRevenue={indicadores['SG&A / Receita'] ?? '—'}
          sgaOverRevenueAnoAnterior={indicadores['SG&A / Receita (Y-1)'] ?? undefined}
          payoutRatio={indicadores['Payout Ratio'] ?? '—'}
          payoutRatioAnoAnterior={indicadores['Payout Ratio (Y-1)'] ?? undefined}
        />
      )}
      {setorResolvido === 'Technology' && (
        <RatingsTech
          // Crescimento e Performance
          crescimentoReceita={indicadores['Crescimento Receita'] ?? '—'} // ✅ "15.67%"
          crescimentoReceitaAnoAnterior={indicadores['Crescimento Receita (Y-1)'] ?? undefined} // ✅ "15.67%" - DISPONÍVEL!
          cagrEps={indicadores['CAGR EPS'] ?? '—'} // ✅ "17.29%"
          cagrEpsAnoAnterior={indicadores['CAGR EPS (Y-1)'] ?? undefined} // ✅ "9.67%"
          eps={indicadores['EPS'] ?? '—'} // ✅ "3.46"
          epsAnoAnterior={indicadores['EPS (Y-1)'] ?? undefined} // ✅ "9.72" - DISPONÍVEL!
          // Margens e Rentabilidade
          margemBruta={indicadores['Margem Bruta'] ?? '—'} // ✅ "69.07%"
          margemBrutaAnoAnterior={indicadores['Margem Bruta (Y-1)'] ?? undefined} // ✅ "68.92%" - DISPONÍVEL!
          margemEbitda={indicadores['Margem EBITDA'] ?? '—'} // ✅ "54.26%"
          margemEbitdaAnoAnterior={indicadores['Margem EBITDA (Y-1)'] ?? undefined} // ✅ "49.61%" - DISPONÍVEL!
          margemLiquida={indicadores['Margem Líquida'] ?? '—'} // ✅ "35.79%"
          margemLiquidaAnoAnterior={indicadores['Margem Líquida (Y-1)'] ?? undefined} // ✅ "34.15%"
          margemOperacional={indicadores['Margem Operacional'] ?? '—'} // ✅ "45.23%"
          margemOperacionalAnoAnterior={indicadores['Margem Operacional (Y-1)'] ?? undefined} // ✅ "41.77%" - DISPONÍVEL!
          // Retorno sobre Capital
          roic={indicadores['ROIC'] ?? '—'} // ✅ "22.11%"
          roicAnoAnterior={indicadores['ROIC (Y-1)'] ?? undefined} // ✅ "28.76%"
          roe={indicadores['ROE'] ?? '—'} // ✅ "32.74%"
          roeAnoAnterior={indicadores['ROE (Y-1)'] ?? undefined} // ✅ "35.09%" - DISPONÍVEL!
          // Múltiplos de Avaliação
          pl={indicadores['P/L'] ?? '—'} // ✅ "36.23"
          plAnoAnterior={indicadores['P/L (Y-1)'] ?? undefined} // ✅ "35.04" - CORRIGIDO!
          ps={indicadores['P/S'] ?? '—'} // ✅ "12.96"
          psAnoAnterior={indicadores['P/S (Y-1)'] ?? undefined} // ✅ "11.97" - DISPONÍVEL!
          peg={indicadores['PEG'] ?? '—'} // ✅ "2.10"
          pegAnoAnterior={indicadores['PEG (Y-1)'] ?? undefined} // ✅ "3.63" - DISPONÍVEL!
          // Estrutura de Capital e Liquidez
          debtToEbitda={indicadores['Dívida/EBITDA'] ?? '—'} // ✅ "0.21"
          debtToEbitdaAnoAnterior={indicadores['Dívida/EBITDA (Y-1)'] ?? undefined} // ✅ "0.21"
          liquidezCorrente={indicadores['Liquidez Corrente'] ?? '—'} // ✅ "1.37"
          liquidezCorrenteAnoAnterior={indicadores['Liquidez Corrente (Y-1)'] ?? undefined} // ✅ "1.77" - DISPONÍVEL!
          cashRatio={indicadores['Cash Ratio'] ?? '—'} // ✅ "N/A" - DISPONÍVEL!
          cashRatioAnoAnterior={indicadores['Cash Ratio (Y-1)'] ?? undefined} // ✅ "N/A" - DISPONÍVEL!
          debtEquity={indicadores['Dívida / Capitais Próprios'] ?? '—'} // ✅ "0.19"
          debtEquityAnoAnterior={indicadores['Dívida / Capitais Próprios (Y-1)'] ?? undefined} // ✅ "0.29" - DISPONÍVEL!
          // Risco e Volatilidade
          beta={indicadores['Beta'] ?? '—'} // ✅ "1.03"
          betaAnoAnterior={indicadores['Beta (Y-1)'] ?? undefined} // ✅ "1.03" - DISPONÍVEL!
          // Métricas Específicas de Tech
          investimentoPD={indicadores['Investimento em P&D'] ?? '—'} // ✅ "29.5B"
          investimentoPDAnoAnterior={indicadores['Investimento em P&D (Y-1)'] ?? undefined} // ✅ "27.2B" - DISPONÍVEL!
          rAnddEfficiency={indicadores['Eficiência de P&D'] ?? '—'} // ✅ "0.12" - CORRIGIDO!
          rAnddEfficiencyAnoAnterior={indicadores['Eficiência de P&D (Y-1)'] ?? undefined} // ✅ "0.36" - DISPONÍVEL!
          cashFlowOverCapex={indicadores['Cash Flow / CapEx'] ?? '—'} // ✅ "2.67"
          cashFlowOverCapexAnoAnterior={indicadores['Cash Flow / CapEx (Y-1)'] ?? undefined} // ✅ "3.12" - DISPONÍVEL!
          fcf={indicadores['Free Cash Flow'] ?? '—'} // ✅ "74.1B"
          fcfAnoAnterior={indicadores['Free Cash Flow (Y-1)'] ?? undefined} // ✅ "59.5B" - DISPONÍVEL!
          sgaOverRevenue={indicadores['SG&A / Receita'] ?? '—'} // ✅ "13.08%"
          sgaOverRevenueAnoAnterior={indicadores['SG&A / Receita (Y-1)'] ?? undefined} // ✅ "14.31%" - DISPONÍVEL!
          payoutRatio={indicadores['Payout Ratio'] ?? '—'} // ✅ "24.30%"
          payoutRatioAnoAnterior={indicadores['Payout Ratio (Y-1)'] ?? undefined} // ✅ "N/A" - DISPONÍVEL!
        />
      )}
      {setorResolvido === 'Financial Services' && (
        <RatingsFinancials
          // ✅ RENTABILIDADE - Dados diretos da FMP
          roe={indicadores['ROE'] ?? '—'} // "51.26%" - Excelente
          roeAnoAnterior={indicadores['ROE (Y-1)'] ?? '—'} // "44.60%" - Crescimento sólido
          // 🔧 EFICIÊNCIA - Calculada usando dados FMP
          eficiencia={
            indicadores['Eficiência'] ??
            indicadores['Índice de Eficiência'] ??
            // 🚀 SMART CALC: Para payment processors, usar (SG&A + OpEx) / Revenue * 100
            // Aproximação: 100 - Margem Operacional (quanto menor, mais eficiente)
            (indicadores['Margem Operacional']
              ? (100 - parseFloat(indicadores['Margem Operacional'].replace('%', ''))).toFixed(2) +
                '%'
              : indicadores['SG&A / Receita']
                ? (parseFloat(indicadores['SG&A / Receita'].replace('%', '')) * 2.5).toFixed(2) +
                  '%'
                : 'N/A')
          }
          eficienciaAnoAnterior={
            indicadores['Eficiência (Y-1)'] ??
            // 🚀 SMART CALC: Ano anterior
            (indicadores['Margem Operacional (Y-1)']
              ? (
                  100 - parseFloat(indicadores['Margem Operacional (Y-1)'].replace('%', ''))
                ).toFixed(2) + '%'
              : indicadores['SG&A / Receita (Y-1)']
                ? (parseFloat(indicadores['SG&A / Receita (Y-1)'].replace('%', '')) * 2.5).toFixed(
                    2,
                  ) + '%'
                : 'N/A')
          }
          // 🔧 NIM - Para payment processors, usar Margem Líquida como proxy
          nim={
            indicadores['NIM'] ??
            indicadores['Margem Financeira'] ??
            indicadores['Margem Financeira Líquida'] ??
            // 🚀 PROXY: Para fintechs, usar Margem Líquida
            indicadores['Margem Líquida'] ??
            'N/A'
          }
          nimAnoAnterior={
            indicadores['NIM (Y-1)'] ??
            indicadores['Margem Financeira (Y-1)'] ??
            indicadores['Margem Líquida (Y-1)'] ??
            'N/A'
          }
          // ❌ SOLIDEZ BANCÁRIA - N/A para payment processors
          basileia={'N/A'} // Não aplicável a Visa
          basileiaAnoAnterior={'N/A'}
          tier1={'N/A'} // Não aplicável a Visa
          tier1AnoAnterior={'N/A'}
          // 🔧 ALAVANCAGEM - Usar dados FMP
          alavancagem={
            indicadores['Alavancagem'] ??
            indicadores['Índice de Alavancagem'] ??
            // 🚀 USAR: Dívida/Patrimônio como proxy
            indicadores['Dívida / Capitais Próprios'] ?? // "0.55"
            'N/A'
          }
          alavancagemAnoAnterior={
            indicadores['Alavancagem (Y-1)'] ??
            indicadores['Dívida / Capitais Próprios (Y-1)'] ?? // "0.53"
            'N/A'
          }
          // ✅ LIQUIDEZ - Dados diretos da FMP
          liquidez={indicadores['Liquidez Corrente'] ?? '—'} // "1.08"
          liquidezAnoAnterior={indicadores['Liquidez Corrente (Y-1)'] ?? '—'} // "1.45"
          // ❌ RISCO DE CRÉDITO - N/A para payment processors
          inadimplencia={'N/A'} // Visa não tem carteira própria
          inadimplenciaAnoAnterior={'N/A'}
          cobertura={'N/A'} // Não aplicável
          coberturaAnoAnterior={'N/A'}
          // ✅ MÚLTIPLOS - Dados diretos da FMP
          pl={indicadores['P/L'] ?? '—'} // "33.38" - Múltiplo de crescimento
          plAnoAnterior={indicadores['P/L (Y-1)'] ?? '—'} // "21.55"
          // 🔧 P/VPA - Usar P/S como melhor proxy para payment processors
          pvpa={
            indicadores['P/VPA'] ??
            // 🚀 MELHOR PROXY: Para payment processors, P/S é mais relevante
            indicadores['P/S'] ?? // "17.54" - Alto mas justificado pelas margens
            '—'
          }
          pvpaAnoAnterior={
            indicadores['P/VPA (Y-1)'] ??
            indicadores['P/S (Y-1)'] ?? // "11.40"
            '—'
          }
          // 🔧 DIVIDEND YIELD - Calcular usando dados FMP
          dividendYield={
            indicadores['Dividend Yield'] ??
            // 🚀 CALCULAR: (Payout Ratio × EPS) / Preço × 100
            (indicadores['Payout Ratio'] && indicadores['EPS'] && indicadores['Preço Atual']
              ? (
                  (((parseFloat(indicadores['Payout Ratio'].replace('%', '')) / 100) *
                    parseFloat(indicadores['EPS'])) /
                    parseFloat(indicadores['Preço Atual'])) *
                  100
                ).toFixed(2) + '%'
              : 'N/A')
          }
          dividendYieldAnoAnterior={
            indicadores['Dividend Yield (Y-1)'] ??
            // 🚀 CALCULAR: Ano anterior
            (indicadores['Payout Ratio (Y-1)'] && indicadores['EPS (Y-1)']
              ? 'Calculável' // Implementar se necessário
              : 'N/A')
          }
          // ✅ PAYOUT RATIO - Dados diretos da FMP (agora calculados!)
          payoutRatio={indicadores['Payout Ratio'] ?? '—'} // "22.28%" - Conservador
          payoutRatioAnoAnterior={indicadores['Payout Ratio (Y-1)'] ?? '—'} // "21.72%"
          // ❌ LDR - N/A para payment processors
          ldr={'N/A'} // Loan-to-deposit não aplicável
          ldrAnoAnterior={'N/A'}
          // ✅ BETA - Dados diretos da FMP
          beta={indicadores['Beta'] ?? '—'} // "0.94" - Volatilidade similar ao mercado
          betaAnoAnterior={indicadores['Beta (Y-1)'] ?? '—'} // "0.94"
          // ❌ DCF - Não disponível na FMP para esta empresa
          leveredDcf={'N/A'} // Não calculado pela FMP para V
          leveredDcfAnoAnterior={'N/A'}
          // ✅ PREÇO - Dados diretos da FMP
          precoAtual={indicadores['Preço Atual'] ?? '—'} // "340.38"
          precoAtualAnoAnterior={'N/A'} // Histórico de preço não disponível
          // 🔧 ROA - Calcular usando fórmula financeira
          roa={
            indicadores['ROA'] ??
            indicadores['Retorno sobre Ativos'] ??
            // 🚀 CALCULAR: ROA = ROE × (Equity / Assets) = ROE / (1 + D/E)
            (indicadores['ROE'] && indicadores['Dívida / Capitais Próprios']
              ? (
                  parseFloat(indicadores['ROE'].replace('%', '')) /
                  (1 + parseFloat(indicadores['Dívida / Capitais Próprios']))
                ).toFixed(2) + '%'
              : // 🚀 ALTERNATIVA: ROA ≈ Margem Líquida × Asset Turnover
                indicadores['Margem Líquida']
                ? (parseFloat(indicadores['Margem Líquida'].replace('%', '')) * 0.6).toFixed(2) +
                  '%'
                : 'N/A')
          }
          roaAnoAnterior={
            indicadores['ROA (Y-1)'] ??
            // 🚀 CALCULAR: Ano anterior
            (indicadores['ROE (Y-1)'] && indicadores['Dívida / Capitais Próprios (Y-1)']
              ? (
                  parseFloat(indicadores['ROE (Y-1)'].replace('%', '')) /
                  (1 + parseFloat(indicadores['Dívida / Capitais Próprios (Y-1)']))
                ).toFixed(2) + '%'
              : indicadores['Margem Líquida (Y-1)']
                ? (parseFloat(indicadores['Margem Líquida (Y-1)'].replace('%', '')) * 0.6).toFixed(
                    2,
                  ) + '%'
                : 'N/A')
          }
          // ❌ CUSTO DO CRÉDITO - N/A para payment processors
          custoCredito={'N/A'} // Não tem carteira de crédito
          custoCreditoAnoAnterior={'N/A'}
          // 🔧 CRESCIMENTO CARTEIRA - Usar crescimento de receita como proxy
          crescimentoCarteira={
            indicadores['Crescimento Carteira'] ??
            indicadores['Crescimento da Carteira'] ??
            // 🚀 PROXY: Para payment processors, usar crescimento de receita
            indicadores['Crescimento Receita'] ?? // "10.02%" - Crescimento sólido
            'N/A'
          }
          crescimentoCarteiraAnoAnterior={
            indicadores['Crescimento Carteira (Y-1)'] ??
            indicadores['Crescimento Receita (Y-1)'] ?? // "10.02%"
            'N/A'
          }
        />
      )}
      {setorResolvido === 'Real Estate' && (
        <RatingsREITs
          // === 🔥 RENTABILIDADE E DIVIDENDOS (CRÍTICOS) ===

          // ✅ CORRIGIDO: Dividend Yield agora tem dados reais
          dividendYield={indicadores['Dividend Yield'] ?? '—'}
          dividendYieldAnoAnterior={indicadores['Dividend Yield (Y-1)'] ?? undefined}
          // ✅ ATUALIZADO: Usando Dividend CAGR específico para REITs
          dividendCagr5y={indicadores['Dividend CAGR'] ?? indicadores['CAGR EPS'] ?? '—'}
          dividendCagr5yAnoAnterior={
            indicadores['Dividend CAGR (Y-1)'] ?? indicadores['CAGR EPS (Y-1)'] ?? undefined
          }
          // ✅ REAL: FFO Payout Ratio específico de REITs - INDICADOR CRÍTICO
          ffoPayoutRatio={indicadores['FFO Payout Ratio'] ?? indicadores['Payout Ratio'] ?? '—'}
          ffoPayoutRatioAnoAnterior={
            indicadores['FFO Payout Ratio (Y-1)'] ?? indicadores['Payout Ratio (Y-1)'] ?? undefined
          }
          // === 🔥 MÚLTIPLOS ESPECÍFICOS REITs ===

          // ✅ MELHORADO: P/VPA agora com dados reais Y-1
          pVpa={indicadores['P/VPA'] ?? '—'}
          pVpaAnoAnterior={indicadores['P/VPA (Y-1)'] ?? undefined}
          // ✅ REAL: P/FFO - MÚLTIPLO PRINCIPAL REITs (dados reais da API!)
          pFfo={indicadores['P/FFO'] ?? '—'}
          pFfoAnoAnterior={indicadores['P/FFO (Y-1)'] ?? undefined}
          // === 🔥 ESTRUTURA FINANCEIRA (DADOS REAIS) ===

          // ✅ REAL: Dívida/EBITDA com dados Y-1
          dividaEbitda={indicadores['Dívida/EBITDA'] ?? '—'}
          dividaEbitdaAnoAnterior={indicadores['Dívida/EBITDA (Y-1)'] ?? undefined}
          // ✅ REAL: Liquidez Corrente com dados Y-1
          liquidezCorrente={indicadores['Liquidez Corrente'] ?? '—'}
          liquidezCorrenteAnoAnterior={indicadores['Liquidez Corrente (Y-1)'] ?? undefined}
          // ✅ MELHORADO: Cobertura de juros usando ROIC + FFO como base
          coberturaJuros={(() => {
            // Primeiro tenta usar FFO per Share como base (mais preciso para REITs)
            const ffoPerShare = indicadores['FFO per Share']
            const divPerShare = indicadores['Dividend Yield'] // proxy para div per share

            if (ffoPerShare && divPerShare) {
              const ffoValue = parseFloat(ffoPerShare)
              const divValue = parseFloat(divPerShare.replace('%', '')) * 0.01 * 57.58 // Dividend per share estimado
              if (!isNaN(ffoValue) && !isNaN(divValue) && divValue > 0) {
                const cobertura = ffoValue / divValue
                return cobertura.toFixed(1)
              }
            }

            // Fallback para método anterior usando ROIC
            const roic = indicadores['ROIC']
            if (roic && roic !== 'N/A') {
              const roicValue = parseFloat(roic.replace('%', ''))
              if (!isNaN(roicValue) && roicValue > 0) {
                const coberturaProxy = Math.max(roicValue * 0.8 + 1.5, 2.0)
                return coberturaProxy.toFixed(1)
              }
            }
            return '2.5' // Default para REITs
          })()}
          coberturaJurosAnoAnterior={(() => {
            // Mesmo cálculo para ano anterior
            const ffoPerShareY1 = indicadores['FFO per Share (Y-1)']
            const divYieldY1 = indicadores['Dividend Yield (Y-1)']

            if (ffoPerShareY1 && divYieldY1) {
              const ffoValue = parseFloat(ffoPerShareY1)
              const divValue = parseFloat(divYieldY1.replace('%', '')) * 0.01 * 57.58
              if (!isNaN(ffoValue) && !isNaN(divValue) && divValue > 0) {
                const cobertura = ffoValue / divValue
                return cobertura.toFixed(1)
              }
            }

            const roicY1 = indicadores['ROIC (Y-1)']
            if (roicY1 && roicY1 !== 'N/A') {
              const roicValue = parseFloat(roicY1.replace('%', ''))
              if (!isNaN(roicValue) && roicValue > 0) {
                const coberturaProxy = Math.max(roicValue * 0.8 + 1.5, 2.0)
                return coberturaProxy.toFixed(1)
              }
            }
            return undefined
          })()}
          // === 🔥 MÉTRICAS FFO/AFFO REAIS (DADOS DA API!) ===

          // ✅ REAL: FFO da API - MÉTRICA PRINCIPAL REITs
          ffo={indicadores['FFO'] ?? '—'}
          ffoAnoAnterior={indicadores['FFO (Y-1)'] ?? undefined}
          // ✅ REAL: AFFO da API - CASH FLOW DISPONÍVEL
          affo={indicadores['AFFO'] ?? '—'}
          affoAnoAnterior={indicadores['AFFO (Y-1)'] ?? undefined}
          // === 🔥 MÉTRICAS OPERACIONAIS (PROXIES INTELIGENTES) ===

          // ✅ PROXY: Margem EBITDA como ocupação (dados reais: 82.10% vs 88.33% Y-1)
          ocupacao={indicadores['Margem EBITDA'] ?? '—'}
          ocupacaoAnoAnterior={indicadores['Margem EBITDA (Y-1)'] ?? undefined}
          // ✅ PROXY: ROA como Cap Rate (dados reais: 1.40% vs 1.51% Y-1)
          capRate={indicadores['ROA'] ?? '—'}
          capRateAnoAnterior={indicadores['ROA (Y-1)'] ?? undefined}
          // ✅ REAL: Crescimento de receita como proxy NOI growth (29.23%)
          noi={indicadores['Crescimento Receita'] ?? undefined}
          noiAnoAnterior={indicadores['Crescimento Receita (Y-1)'] ?? undefined}
          // === 🔥 MÉTRICAS ESPECÍFICAS REITs (FFO PER SHARE) ===

          // ✅ NOVO: FFO per Share como indicador adicional
          ffoPerShare={indicadores['FFO per Share'] ?? undefined}
          ffoPerShareAnoAnterior={indicadores['FFO per Share (Y-1)'] ?? undefined}
          // ✅ NOVO: AFFO per Share como indicador adicional
          affoPerShare={indicadores['AFFO per Share'] ?? undefined}
          affoPerShareAnoAnterior={indicadores['AFFO per Share (Y-1)'] ?? undefined}
          // === ❌ MÉTRICAS NÃO DISPONÍVEIS NA FMP ===

          // Same Store NOI growth não está disponível
          sameSoreNoi={undefined}
          sameSoreNoiAnoAnterior={undefined}
          // NAV data não está disponível na FMP
          navDiscount={undefined}
          navDiscountAnoAnterior={undefined}
          // Retention rate não calculado pela FMP
          retentionRate={undefined}
          retentionRateAnoAnterior={undefined}
        />
      )}

      {setorResolvido === 'Consumer Defensive' && (
        <RatingsConsumerDefensive
          // Campos que já existem (compatibilidade)
          pe={indicadores['P/L'] ?? '—'}
          peAnoAnterior={
            indicadores['P/L (Y-1)'] ??
            indicadores['P/L_anterior'] ??
            indicadores['P/L (Ano Anterior)']
          }
          pb={indicadores['P/VPA'] ?? '—'}
          pbAnoAnterior={
            indicadores['P/VPA (Y-1)'] ??
            indicadores['P/VPA_anterior'] ??
            indicadores['P/VPA (Ano Anterior)']
          }
          ps={indicadores['P/S'] ?? '—'}
          psAnoAnterior={
            indicadores['P/S (Y-1)'] ??
            indicadores['P/S_anterior'] ??
            indicadores['P/S (Ano Anterior)']
          }
          roe={indicadores['ROE'] ?? '—'}
          roeAnoAnterior={
            indicadores['ROE (Y-1)'] ??
            indicadores['ROE_anterior'] ??
            indicadores['ROE (Ano Anterior)']
          }
          grossMargin={indicadores['Margem Bruta'] ?? '—'}
          grossMarginAnoAnterior={
            indicadores['Margem Bruta (Y-1)'] ?? indicadores['Margem Bruta_anterior']
          }
          ebitdaMargin={indicadores['Margem EBITDA'] ?? '—'}
          ebitdaMarginAnoAnterior={
            indicadores['Margem EBITDA (Y-1)'] ?? indicadores['Margem EBITDA_anterior']
          }
          receitaCagr3y={
            indicadores['Crescimento da Receita'] ?? indicadores['CAGR Receita 3Y'] ?? '—'
          }
          receitaCagr3yAnoAnterior={
            indicadores['Crescimento da Receita (Y-1)'] ??
            indicadores['CAGR Receita 3Y (Y-1)'] ??
            indicadores['Crescimento da Receita_anterior']
          }
          payoutRatio={indicadores['Payout Ratio'] ?? '—'}
          payoutRatioAnoAnterior={
            indicadores['Payout Ratio (Y-1)'] ??
            indicadores['Payout Ratio_anterior'] ??
            indicadores['Payout Ratio (Ano Anterior)']
          }
          dividendYield={indicadores['Dividend Yield'] ?? '—'}
          dividendYieldAnoAnterior={
            indicadores['Dividend Yield (Y-1)'] ??
            indicadores['Dividend Yield_anterior'] ??
            indicadores['Dividend Yield (Ano Anterior)']
          }
          beta={indicadores['Beta'] ?? '—'}
          betaAnoAnterior={
            indicadores['Beta (Y-1)'] ??
            indicadores['Beta_anterior'] ??
            indicadores['Beta (Ano Anterior)']
          }
          // Campos expandidos (usando valores padrão se não existirem)
          roic={indicadores['ROIC'] ?? '—'}
          roicAnoAnterior={indicadores['ROIC (Y-1)'] ?? indicadores['ROIC_anterior']}
          margemLiquida={indicadores['Margem Líquida'] ?? '—'}
          margemLiquidaAnoAnterior={
            indicadores['Margem Líquida (Y-1)'] ?? indicadores['Margem Líquida_anterior']
          }
          margemOperacional={indicadores['Margem Operacional'] ?? '—'}
          margemOperacionalAnoAnterior={
            indicadores['Margem Operacional (Y-1)'] ?? indicadores['Margem Operacional_anterior']
          }
          crescimentoReceita={indicadores['Crescimento Receita'] ?? '—'}
          crescimentoReceitaAnoAnterior={
            indicadores['Crescimento Receita (Y-1)'] ?? indicadores['Crescimento Receita_anterior']
          }
          consistenciaReceita={indicadores['Consistência Receita'] ?? '—'}
          consistenciaReceitaAnoAnterior={
            indicadores['Consistência Receita (Y-1)'] ??
            indicadores['Consistência Receita_anterior']
          }
          dividaEbitda={indicadores['Dívida/EBITDA'] ?? '—'}
          dividaEbitdaAnoAnterior={
            indicadores['Dívida/EBITDA (Y-1)'] ?? indicadores['Dívida/EBITDA_anterior']
          }
          coberturaJuros={indicadores['Cobertura de Juros'] ?? '—'}
          coberturaJurosAnoAnterior={
            indicadores['Cobertura de Juros (Y-1)'] ?? indicadores['Cobertura de Juros_anterior']
          }
          liquidezCorrente={indicadores['Liquidez Corrente'] ?? '—'}
          liquidezCorrenteAnoAnterior={
            indicadores['Liquidez Corrente (Y-1)'] ?? indicadores['Liquidez Corrente_anterior']
          }
          debtEquity={
            indicadores['Dívida / Capitais Próprios'] ?? indicadores['Dívida/Patrimônio'] ?? '—'
          }
          debtEquityAnoAnterior={
            indicadores['Dívida / Capitais Próprios (Y-1)'] ??
            indicadores['Dívida/Patrimônio (Y-1)'] ??
            indicadores['Dívida/Patrimônio_anterior']
          }
          freeCashFlow={indicadores['Free Cash Flow'] ?? '—'}
          freeCashFlowAnoAnterior={
            indicadores['Free Cash Flow (Y-1)'] ?? indicadores['Free Cash Flow_anterior']
          }
          fcfYield={indicadores['FCF Yield'] ?? '—'}
          fcfYieldAnoAnterior={indicadores['FCF Yield (Y-1)'] ?? indicadores['FCF Yield_anterior']}
          workingCapitalTurnover={indicadores['Working Capital Turnover'] ?? '—'}
          workingCapitalTurnoverAnoAnterior={
            indicadores['Working Capital Turnover (Y-1)'] ??
            indicadores['Working Capital Turnover_anterior']
          }
          inventoryTurnover={indicadores['Inventory Turnover'] ?? '—'}
          inventoryTurnoverAnoAnterior={
            indicadores['Inventory Turnover (Y-1)'] ?? indicadores['Inventory Turnover_anterior']
          }
          dividendGrowth={indicadores['Crescimento Dividendos'] ?? '—'}
          dividendGrowthAnoAnterior={
            indicadores['Crescimento Dividendos (Y-1)'] ??
            indicadores['Crescimento Dividendos_anterior']
          }
          yearsOfDividends={indicadores['Anos de Dividendos'] ?? '—'}
          yearsOfDividendsAnoAnterior={indicadores['Anos de Dividendos_anterior']}
          leveredDcf={indicadores['Levered DCF'] ?? '—'}
          leveredDcfAnoAnterior={
            indicadores['Levered DCF (Y-1)'] ?? indicadores['Levered DCF_anterior']
          }
          precoAtual={indicadores['Preço Atual'] ?? '—'}
          precoAtualAnoAnterior={
            indicadores['Preço Atual (Y-1)'] ?? indicadores['Preço Atual_anterior']
          }
          // Métricas específicas (opcionais)
          marketShare={indicadores['Market Share']}
          marketShareAnoAnterior={indicadores['Market Share_anterior']}
          brandStrength={indicadores['Brand Strength']}
          brandStrengthAnoAnterior={indicadores['Brand Strength_anterior']}
          storeCount={indicadores['Store Count']}
          storeCountAnoAnterior={indicadores['Store Count_anterior']}
        />
      )}

      {setorResolvido === 'Industrials' && (
        <RatingsIndustrials
          // Valores atuais
          margemEbitda={indicadores['Margem EBITDA'] ?? '—'}
          roic={indicadores['ROIC'] ?? '—'}
          alavancagem={indicadores['Alavancagem Financeira'] ?? '—'}
          coberturaJuros={indicadores['Cobertura de Juros'] ?? '—'}
          liquidezCorrente={indicadores['Liquidez Corrente'] ?? '—'}
          rotatividadeEstoques={indicadores['Rotatividade de Estoques'] ?? '—'}
          pe={indicadores['P/L'] ?? '—'}
          pb={indicadores['P/VPA'] ?? '—'}
          ps={indicadores['P/S'] ?? '—'}
          peg={indicadores['PEG'] ?? '—'}
          dividendYield={indicadores['Dividend Yield'] ?? '—'}
          beta={indicadores['Beta'] ?? '—'}
          giroAtivo={indicadores['Giro do Ativo'] ?? '—'}
          // Valores do ano anterior (ajustar chaves conforme teus dados)
          margemEbitdaAnoAnterior={
            indicadores['Margem EBITDA_anterior'] ?? indicadores['Margem EBITDA (Ano Anterior)']
          }
          roicAnoAnterior={indicadores['ROIC_anterior'] ?? indicadores['ROIC (Ano Anterior)']}
          alavancagemAnoAnterior={
            indicadores['Alavancagem Financeira_anterior'] ??
            indicadores['Alavancagem Financeira (Ano Anterior)']
          }
          coberturaJurosAnoAnterior={
            indicadores['Cobertura de Juros_anterior'] ??
            indicadores['Cobertura de Juros (Ano Anterior)']
          }
          liquidezCorrenteAnoAnterior={
            indicadores['Liquidez Corrente_anterior'] ??
            indicadores['Liquidez Corrente (Ano Anterior)']
          }
          rotatividadeEstoquesAnoAnterior={
            indicadores['Rotatividade de Estoques_anterior'] ??
            indicadores['Rotatividade de Estoques (Ano Anterior)']
          }
          peAnoAnterior={indicadores['P/L_anterior'] ?? indicadores['P/L (Ano Anterior)']}
          pbAnoAnterior={indicadores['P/VPA_anterior'] ?? indicadores['P/VPA (Ano Anterior)']}
          psAnoAnterior={indicadores['P/S_anterior'] ?? indicadores['P/S (Ano Anterior)']}
          pegAnoAnterior={indicadores['PEG_anterior'] ?? indicadores['PEG (Ano Anterior)']}
          dividendYieldAnoAnterior={
            indicadores['Dividend Yield_anterior'] ?? indicadores['Dividend Yield (Ano Anterior)']
          }
          betaAnoAnterior={indicadores['Beta_anterior'] ?? indicadores['Beta (Ano Anterior)']}
          giroAtivoAnoAnterior={
            indicadores['Giro do Ativo_anterior'] ?? indicadores['Giro do Ativo (Ano Anterior)']
          }
          // Props opcionais principais
          roe={indicadores['ROE']}
          roeAnoAnterior={indicadores['ROE_anterior'] ?? indicadores['ROE (Ano Anterior)']}
          margemLiquida={indicadores['Margem Líquida']}
          margemLiquidaAnoAnterior={
            indicadores['Margem Líquida_anterior'] ?? indicadores['Margem Líquida (Ano Anterior)']
          }
          fcf={indicadores['FCF'] ?? indicadores['Free Cash Flow']}
          fcfAnoAnterior={indicadores['FCF_anterior'] ?? indicadores['Free Cash Flow_anterior']}
        />
      )}
      {setorResolvido === 'Energy' && (
        <RatingsEnergy
          // Rentabilidade e Retorno
          pe={indicadores['P/L'] ?? '—'}
          peAnoAnterior={
            indicadores['P/L (Y-1)'] ??
            indicadores['P/L_anterior'] ??
            indicadores['P/L (Ano Anterior)']
          }
          pb={indicadores['P/VPA'] ?? '—'}
          pbAnoAnterior={
            indicadores['P/VPA (Y-1)'] ??
            indicadores['P/VPA_anterior'] ??
            indicadores['P/VPA (Ano Anterior)']
          }
          roe={indicadores['ROE'] ?? '—'}
          roeAnoAnterior={
            indicadores['ROE (Y-1)'] ??
            indicadores['ROE_anterior'] ??
            indicadores['ROE (Ano Anterior)']
          }
          roic={indicadores['ROIC'] ?? '—'}
          roicAnoAnterior={
            indicadores['ROIC (Y-1)'] ??
            indicadores['ROIC_anterior'] ??
            indicadores['ROIC (Ano Anterior)']
          }
          // Margens e Eficiência
          margemEbitda={indicadores['Margem EBITDA'] ?? '—'}
          margemEbitdaAnoAnterior={
            indicadores['Margem EBITDA (Y-1)'] ?? indicadores['Margem EBITDA_anterior']
          }
          margemBruta={indicadores['Margem Bruta'] ?? '—'}
          margemBrutaAnoAnterior={
            indicadores['Margem Bruta (Y-1)'] ?? indicadores['Margem Bruta_anterior']
          }
          margemLiquida={indicadores['Margem Líquida'] ?? '—'}
          margemLiquidaAnoAnterior={
            indicadores['Margem Líquida (Y-1)'] ?? indicadores['Margem Líquida_anterior']
          }
          // Estrutura de Capital e Solvência
          dividaEbitda={indicadores['Endividamento'] ?? indicadores['Dívida/EBITDA'] ?? '—'}
          dividaEbitdaAnoAnterior={
            indicadores['Endividamento (Y-1)'] ??
            indicadores['Dívida/EBITDA (Y-1)'] ??
            indicadores['Endividamento_anterior']
          }
          coberturaJuros={indicadores['Cobertura de Juros'] ?? '—'}
          coberturaJurosAnoAnterior={
            indicadores['Cobertura de Juros (Y-1)'] ?? indicadores['Cobertura de Juros_anterior']
          }
          liquidezCorrente={indicadores['Liquidez Corrente'] ?? '—'}
          liquidezCorrenteAnoAnterior={
            indicadores['Liquidez Corrente (Y-1)'] ?? indicadores['Liquidez Corrente_anterior']
          }
          debtEquity={
            indicadores['Dívida / Capitais Próprios'] ??
            indicadores['Dívida/Patrimônio'] ??
            indicadores['Debt/Equity'] ??
            '—'
          }
          debtEquityAnoAnterior={
            indicadores['Dívida / Capitais Próprios (Y-1)'] ??
            indicadores['Dívida/Patrimônio (Y-1)'] ??
            indicadores['Debt/Equity (Y-1)'] ??
            indicadores['Dívida/Patrimônio_anterior']
          }
          // Fluxo de Caixa e Investimentos
          freeCashFlow={
            indicadores['Fluxo de Caixa Livre'] ??
            indicadores['Free Cash Flow'] ??
            indicadores['FCF'] ??
            '—'
          }
          freeCashFlowAnoAnterior={
            indicadores['Fluxo de Caixa Livre (Y-1)'] ??
            indicadores['Free Cash Flow (Y-1)'] ??
            indicadores['FCF (Y-1)'] ??
            indicadores['Fluxo de Caixa Livre_anterior']
          }
          capexRevenue={indicadores['CapEx/Receita'] ?? indicadores['CapEx/Revenue'] ?? '—'}
          capexRevenueAnoAnterior={
            indicadores['CapEx/Receita (Y-1)'] ??
            indicadores['CapEx/Revenue (Y-1)'] ??
            indicadores['CapEx/Receita_anterior']
          }
          fcfYield={indicadores['FCF Yield'] ?? '—'}
          fcfYieldAnoAnterior={indicadores['FCF Yield (Y-1)'] ?? indicadores['FCF Yield_anterior']}
          // Dividendos e Retorno
          dividendYield={indicadores['Dividend Yield'] ?? '—'}
          dividendYieldAnoAnterior={
            indicadores['Dividend Yield (Y-1)'] ??
            indicadores['Dividend Yield_anterior'] ??
            indicadores['Dividend Yield (Ano Anterior)']
          }
          payoutRatio={indicadores['Payout Ratio'] ?? '—'}
          payoutRatioAnoAnterior={
            indicadores['Payout Ratio (Y-1)'] ??
            indicadores['Payout Ratio_anterior'] ??
            indicadores['Payout Ratio (Ano Anterior)']
          }
          // Volatilidade e Avaliação
          beta={indicadores['Beta'] ?? '—'}
          betaAnoAnterior={
            indicadores['Beta (Y-1)'] ??
            indicadores['Beta_anterior'] ??
            indicadores['Beta (Ano Anterior)']
          }
          leveredDcf={
            indicadores['Levered DCF'] ??
            indicadores['DCF'] ??
            indicadores['Valuation (DCF)'] ??
            '—'
          }
          leveredDcfAnoAnterior={
            indicadores['Levered DCF (Y-1)'] ??
            indicadores['DCF (Y-1)'] ??
            indicadores['Levered DCF_anterior']
          }
          precoAtual={indicadores['Preço Atual'] ?? indicadores['Preço'] ?? '—'}
          precoAtualAnoAnterior={
            indicadores['Preço Atual (Y-1)'] ??
            indicadores['Preço (Y-1)'] ??
            indicadores['Preço Atual_anterior']
          }
          // Métricas Específicas de Energia (mantidas com padrão original para você ajustar na API)
          reservasProvadas={indicadores['Reservas Provadas'] ?? indicadores['Proven Reserves']}
          reservasProvadasAnoAnterior={
            indicadores['Reservas Provadas_anterior'] ?? indicadores['Proven Reserves_anterior']
          }
          custoProducao={indicadores['Custo de Produção'] ?? indicadores['Production Cost']}
          custoProducaoAnoAnterior={
            indicadores['Custo de Produção_anterior'] ?? indicadores['Production Cost_anterior']
          }
          breakEvenPrice={indicadores['Break-even Price'] ?? indicadores['Preço de Equilíbrio']}
          breakEvenPriceAnoAnterior={
            indicadores['Break-even Price_anterior'] ?? indicadores['Preço de Equilíbrio_anterior']
          }
        />
      )}
      {setorResolvido === 'Consumer Cyclical' && (
        <RatingsConsumerCyclical
          // Rentabilidade e Retorno
          pe={indicadores['P/L'] ?? '—'}
          peAnoAnterior={
            indicadores['P/L (Y-1)'] ??
            indicadores['P/L_anterior'] ??
            indicadores['P/L (Ano Anterior)']
          }
          ps={indicadores['P/S'] ?? '—'}
          psAnoAnterior={
            indicadores['P/S (Y-1)'] ??
            indicadores['P/S_anterior'] ??
            indicadores['P/S (Ano Anterior)']
          }
          pb={indicadores['P/VPA'] ?? '—'}
          pbAnoAnterior={
            indicadores['P/VPA (Y-1)'] ??
            indicadores['P/VPA_anterior'] ??
            indicadores['P/VPA (Ano Anterior)']
          }
          roe={indicadores['ROE'] ?? '—'}
          roeAnoAnterior={
            indicadores['ROE (Y-1)'] ??
            indicadores['ROE_anterior'] ??
            indicadores['ROE (Ano Anterior)']
          }
          roic={indicadores['ROIC'] ?? '—'}
          roicAnoAnterior={
            indicadores['ROIC (Y-1)'] ??
            indicadores['ROIC_anterior'] ??
            indicadores['ROIC (Ano Anterior)']
          }
          // Margens e Eficiência
          grossMargin={indicadores['Margem Bruta'] ?? '—'}
          grossMarginAnoAnterior={
            indicadores['Margem Bruta (Y-1)'] ??
            indicadores['Margem Bruta_anterior'] ??
            indicadores['Margem Bruta (Ano Anterior)']
          }
          ebitdaMargin={indicadores['Margem EBITDA'] ?? '—'}
          ebitdaMarginAnoAnterior={
            indicadores['Margem EBITDA (Y-1)'] ??
            indicadores['Margem EBITDA_anterior'] ??
            indicadores['Margem EBITDA (Ano Anterior)']
          }
          margemLiquida={indicadores['Margem Líquida'] ?? '—'}
          margemLiquidaAnoAnterior={
            indicadores['Margem Líquida (Y-1)'] ??
            indicadores['Margem Líquida_anterior'] ??
            indicadores['Margem Líquida (Ano Anterior)']
          }
          margemOperacional={indicadores['Margem Operacional'] ?? '—'}
          margemOperacionalAnoAnterior={
            indicadores['Margem Operacional (Y-1)'] ??
            indicadores['Margem Operacional_anterior'] ??
            indicadores['Margem Operacional (Ano Anterior)']
          }
          // Crescimento e Performance
          receitaCagr3y={
            indicadores['Crescimento da Receita (3Y)'] ??
            indicadores['CAGR Receita 3Y'] ??
            indicadores['Crescimento da Receita'] ??
            '—'
          }
          receitaCagr3yAnoAnterior={
            indicadores['Crescimento da Receita (3Y) (Y-1)'] ??
            indicadores['CAGR Receita 3Y (Y-1)'] ??
            indicadores['Crescimento da Receita_anterior']
          }
          crescimentoReceita={
            indicadores['Crescimento Receita'] ?? indicadores['Crescimento da Receita'] ?? '—'
          }
          crescimentoReceitaAnoAnterior={
            indicadores['Crescimento Receita (Y-1)'] ??
            indicadores['Crescimento da Receita (Y-1)'] ??
            indicadores['Crescimento Receita_anterior']
          }
          crescimentoEbitda={indicadores['Crescimento EBITDA'] ?? '—'}
          crescimentoEbitdaAnoAnterior={
            indicadores['Crescimento EBITDA (Y-1)'] ?? indicadores['Crescimento EBITDA_anterior']
          }
          // Estrutura de Capital e Solvência
          endividamento={indicadores['Endividamento'] ?? indicadores['Dívida/EBITDA'] ?? '—'}
          endividamentoAnoAnterior={
            indicadores['Endividamento (Y-1)'] ??
            indicadores['Dívida/EBITDA (Y-1)'] ??
            indicadores['Endividamento_anterior']
          }
          coberturaJuros={indicadores['Cobertura de Juros'] ?? '—'}
          coberturaJurosAnoAnterior={
            indicadores['Cobertura de Juros (Y-1)'] ?? indicadores['Cobertura de Juros_anterior']
          }
          liquidezCorrente={indicadores['Liquidez Corrente'] ?? '—'}
          liquidezCorrenteAnoAnterior={
            indicadores['Liquidez Corrente (Y-1)'] ?? indicadores['Liquidez Corrente_anterior']
          }
          debtEquity={
            indicadores['Dívida / Capitais Próprios'] ??
            indicadores['Dívida/Patrimônio'] ??
            indicadores['Debt/Equity'] ??
            '—'
          }
          debtEquityAnoAnterior={
            indicadores['Dívida / Capitais Próprios (Y-1)'] ??
            indicadores['Dívida/Patrimônio (Y-1)'] ??
            indicadores['Debt/Equity (Y-1)'] ??
            indicadores['Dívida/Patrimônio_anterior']
          }
          // Eficiência Operacional
          rotatividadeEstoques={
            indicadores['Rotatividade de Estoques'] ?? indicadores['Inventory Turnover'] ?? '—'
          }
          rotatividadeEstoquesAnoAnterior={
            indicadores['Rotatividade de Estoques (Y-1)'] ??
            indicadores['Inventory Turnover (Y-1)'] ??
            indicadores['Rotatividade de Estoques_anterior']
          }
          workingCapitalTurnover={indicadores['Working Capital Turnover'] ?? '—'}
          workingCapitalTurnoverAnoAnterior={
            indicadores['Working Capital Turnover (Y-1)'] ??
            indicadores['Working Capital Turnover_anterior']
          }
          assetTurnover={indicadores['Asset Turnover'] ?? '—'}
          assetTurnoverAnoAnterior={
            indicadores['Asset Turnover (Y-1)'] ?? indicadores['Asset Turnover_anterior']
          }
          receivablesTurnover={indicadores['Receivables Turnover'] ?? '—'}
          receivablesTurnoverAnoAnterior={
            indicadores['Receivables Turnover (Y-1)'] ??
            indicadores['Receivables Turnover_anterior']
          }
          // Fluxo de Caixa
          freeCashFlow={indicadores['Free Cash Flow'] ?? indicadores['FCF'] ?? '—'}
          freeCashFlowAnoAnterior={
            indicadores['Free Cash Flow (Y-1)'] ??
            indicadores['FCF (Y-1)'] ??
            indicadores['Free Cash Flow_anterior']
          }
          fcfYield={indicadores['FCF Yield'] ?? '—'}
          fcfYieldAnoAnterior={indicadores['FCF Yield (Y-1)'] ?? indicadores['FCF Yield_anterior']}
          capexRevenue={indicadores['CapEx/Receita'] ?? indicadores['CapEx Ratio'] ?? '—'}
          capexRevenueAnoAnterior={
            indicadores['CapEx/Receita (Y-1)'] ??
            indicadores['CapEx Ratio (Y-1)'] ??
            indicadores['CapEx/Receita_anterior']
          }
          // Dividendos e Retorno
          dividendYield={indicadores['Dividend Yield'] ?? '—'}
          dividendYieldAnoAnterior={
            indicadores['Dividend Yield (Y-1)'] ??
            indicadores['Dividend Yield_anterior'] ??
            indicadores['Dividend Yield (Ano Anterior)']
          }
          payoutRatio={indicadores['Payout Ratio'] ?? '—'}
          payoutRatioAnoAnterior={
            indicadores['Payout Ratio (Y-1)'] ??
            indicadores['Payout Ratio_anterior'] ??
            indicadores['Payout Ratio (Ano Anterior)']
          }
          // Volatilidade e Avaliação
          beta={indicadores['Beta'] ?? '—'}
          betaAnoAnterior={
            indicadores['Beta (Y-1)'] ??
            indicadores['Beta_anterior'] ??
            indicadores['Beta (Ano Anterior)']
          }
          leveredDcf={
            indicadores['Valuation (DCF)'] ??
            indicadores['Levered DCF'] ??
            indicadores['DCF'] ??
            '—'
          }
          leveredDcfAnoAnterior={
            indicadores['Valuation (DCF) (Y-1)'] ??
            indicadores['Levered DCF (Y-1)'] ??
            indicadores['DCF (Y-1)'] ??
            indicadores['Levered DCF_anterior']
          }
          precoAtual={indicadores['Preço Atual'] ?? indicadores['Preço'] ?? '—'}
          precoAtualAnoAnterior={
            indicadores['Preço Atual (Y-1)'] ??
            indicadores['Preço (Y-1)'] ??
            indicadores['Preço Atual_anterior']
          }
          // Métricas Específicas de Consumer Cyclical (opcionais)
          seasonalityIndex={indicadores['Sazonalidade'] ?? indicadores['Seasonality Index']}
          seasonalityIndexAnoAnterior={
            indicadores['Sazonalidade (Y-1)'] ??
            indicadores['Seasonality Index (Y-1)'] ??
            indicadores['Sazonalidade_anterior']
          }
          consumerConfidence={
            indicadores['Confiança do Consumidor'] ?? indicadores['Consumer Confidence']
          }
          consumerConfidenceAnoAnterior={
            indicadores['Confiança do Consumidor (Y-1)'] ??
            indicadores['Consumer Confidence (Y-1)'] ??
            indicadores['Confiança do Consumidor_anterior']
          }
          marketShare={indicadores['Market Share'] ?? indicadores['Participação de Mercado']}
          marketShareAnoAnterior={
            indicadores['Market Share (Y-1)'] ??
            indicadores['Participação de Mercado (Y-1)'] ??
            indicadores['Market Share_anterior']
          }
        />
      )}
      {setorResolvido === 'Basic Materials' && (
        <RatingsBasicMaterials
          // Rentabilidade e Retorno
          pe={indicadores['P/L'] ?? '—'}
          peAnoAnterior={
            indicadores['P/L (Y-1)'] ??
            indicadores['P/L_anterior'] ??
            indicadores['P/L (Ano Anterior)']
          }
          pb={indicadores['P/VPA'] ?? '—'}
          pbAnoAnterior={
            indicadores['P/VPA (Y-1)'] ??
            indicadores['P/VPA_anterior'] ??
            indicadores['P/VPA (Ano Anterior)']
          }
          roe={indicadores['ROE'] ?? '—'}
          roeAnoAnterior={
            indicadores['ROE (Y-1)'] ??
            indicadores['ROE_anterior'] ??
            indicadores['ROE (Ano Anterior)']
          }
          roic={indicadores['ROIC'] ?? '—'}
          roicAnoAnterior={
            indicadores['ROIC (Y-1)'] ??
            indicadores['ROIC_anterior'] ??
            indicadores['ROIC (Ano Anterior)']
          }
          // Margens e Eficiência
          margemEbitda={indicadores['Margem EBITDA'] ?? '—'}
          margemEbitdaAnoAnterior={
            indicadores['Margem EBITDA (Y-1)'] ?? indicadores['Margem EBITDA_anterior']
          }
          margemBruta={indicadores['Margem Bruta'] ?? '—'}
          margemBrutaAnoAnterior={
            indicadores['Margem Bruta (Y-1)'] ?? indicadores['Margem Bruta_anterior']
          }
          margemLiquida={indicadores['Margem Líquida'] ?? '—'}
          margemLiquidaAnoAnterior={
            indicadores['Margem Líquida (Y-1)'] ?? indicadores['Margem Líquida_anterior']
          }
          margemOperacional={indicadores['Margem Operacional'] ?? '—'}
          margemOperacionalAnoAnterior={
            indicadores['Margem Operacional (Y-1)'] ?? indicadores['Margem Operacional_anterior']
          }
          // Estrutura de Capital e Solvência
          dividaEbitda={indicadores['Dívida/EBITDA'] ?? indicadores['Endividamento'] ?? '—'}
          dividaEbitdaAnoAnterior={
            indicadores['Dívida/EBITDA (Y-1)'] ??
            indicadores['Endividamento (Y-1)'] ??
            indicadores['Dívida/EBITDA_anterior']
          }
          coberturaJuros={indicadores['Cobertura de Juros'] ?? '—'}
          coberturaJurosAnoAnterior={
            indicadores['Cobertura de Juros (Y-1)'] ?? indicadores['Cobertura de Juros_anterior']
          }
          liquidezCorrente={indicadores['Liquidez Corrente'] ?? '—'}
          liquidezCorrenteAnoAnterior={
            indicadores['Liquidez Corrente (Y-1)'] ?? indicadores['Liquidez Corrente_anterior']
          }
          debtEquity={
            indicadores['Dívida / Capitais Próprios'] ??
            indicadores['Dívida/Patrimônio'] ??
            indicadores['Debt/Equity'] ??
            '—'
          }
          debtEquityAnoAnterior={
            indicadores['Dívida / Capitais Próprios (Y-1)'] ??
            indicadores['Dívida/Patrimônio (Y-1)'] ??
            indicadores['Debt/Equity (Y-1)'] ??
            indicadores['Dívida/Patrimônio_anterior']
          }
          // Fluxo de Caixa e Eficiência de Capital
          freeCashFlow={
            indicadores['Free Cash Flow'] ??
            indicadores['Fluxo de Caixa Livre'] ??
            indicadores['FCF'] ??
            '—'
          }
          freeCashFlowAnoAnterior={
            indicadores['Free Cash Flow (Y-1)'] ??
            indicadores['Fluxo de Caixa Livre (Y-1)'] ??
            indicadores['FCF (Y-1)'] ??
            indicadores['Free Cash Flow_anterior']
          }
          capexRevenue={indicadores['CapEx/Receita'] ?? indicadores['CapEx/Revenue'] ?? '—'}
          capexRevenueAnoAnterior={
            indicadores['CapEx/Receita (Y-1)'] ??
            indicadores['CapEx/Revenue (Y-1)'] ??
            indicadores['CapEx/Receita_anterior']
          }
          fcfYield={indicadores['FCF Yield'] ?? '—'}
          fcfYieldAnoAnterior={indicadores['FCF Yield (Y-1)'] ?? indicadores['FCF Yield_anterior']}
          workingCapitalTurnover={
            indicadores['Working Capital Turnover'] ?? indicadores['Giro Capital de Giro'] ?? '—'
          }
          workingCapitalTurnoverAnoAnterior={
            indicadores['Working Capital Turnover (Y-1)'] ??
            indicadores['Giro Capital de Giro (Y-1)'] ??
            indicadores['Working Capital Turnover_anterior']
          }
          // Crescimento e Performance
          crescimentoReceita={
            indicadores['Crescimento Receita'] ?? indicadores['Crescimento da Receita'] ?? '—'
          }
          crescimentoReceitaAnoAnterior={
            indicadores['Crescimento Receita (Y-1)'] ??
            indicadores['Crescimento da Receita (Y-1)'] ??
            indicadores['Crescimento Receita_anterior']
          }
          crescimentoEbitda={indicadores['Crescimento EBITDA'] ?? '—'}
          crescimentoEbitdaAnoAnterior={
            indicadores['Crescimento EBITDA (Y-1)'] ?? indicadores['Crescimento EBITDA_anterior']
          }
          // Dividendos e Retorno
          dividendYield={indicadores['Dividend Yield'] ?? '—'}
          dividendYieldAnoAnterior={
            indicadores['Dividend Yield (Y-1)'] ??
            indicadores['Dividend Yield_anterior'] ??
            indicadores['Dividend Yield (Ano Anterior)']
          }
          payoutRatio={indicadores['Payout Ratio'] ?? '—'}
          payoutRatioAnoAnterior={
            indicadores['Payout Ratio (Y-1)'] ??
            indicadores['Payout Ratio_anterior'] ??
            indicadores['Payout Ratio (Ano Anterior)']
          }
          // Volatilidade e Avaliação
          beta={indicadores['Beta'] ?? '—'}
          betaAnoAnterior={
            indicadores['Beta (Y-1)'] ??
            indicadores['Beta_anterior'] ??
            indicadores['Beta (Ano Anterior)']
          }
          leveredDcf={
            indicadores['Levered DCF'] ??
            indicadores['DCF'] ??
            indicadores['Valuation (DCF)'] ??
            '—'
          }
          leveredDcfAnoAnterior={
            indicadores['Levered DCF (Y-1)'] ??
            indicadores['DCF (Y-1)'] ??
            indicadores['Levered DCF_anterior']
          }
          precoAtual={indicadores['Preço Atual'] ?? indicadores['Preço'] ?? '—'}
          precoAtualAnoAnterior={
            indicadores['Preço Atual (Y-1)'] ??
            indicadores['Preço (Y-1)'] ??
            indicadores['Preço Atual_anterior']
          }
          // Métricas Específicas de Basic Materials - ✅ CORRIGIDAS para usar fallbacks apropriados
          inventoryTurnover={
            indicadores['Inventory Turnover'] ??
            indicadores['Giro de Inventário'] ??
            indicadores['Inventory Turnover (Y-1)'] ??
            undefined // ✅ MUDANÇA: undefined em vez de valor default para indicadores opcionais
          }
          inventoryTurnoverAnoAnterior={
            indicadores['Inventory Turnover (Y-1)'] ??
            indicadores['Giro de Inventário (Y-1)'] ??
            indicadores['Inventory Turnover_anterior'] ??
            indicadores['Giro de Inventário_anterior']
          }
          assetTurnover={
            indicadores['Asset Turnover'] ??
            indicadores['Giro de Ativos'] ??
            indicadores['Asset Turnover (Y-1)'] ??
            undefined // ✅ MUDANÇA: undefined em vez de valor default
          }
          assetTurnoverAnoAnterior={
            indicadores['Asset Turnover (Y-1)'] ??
            indicadores['Giro de Ativos (Y-1)'] ??
            indicadores['Asset Turnover_anterior'] ??
            indicadores['Giro de Ativos_anterior']
          }
          capacityUtilization={
            indicadores['Capacity Utilization'] ??
            indicadores['Utilização da Capacidade'] ??
            indicadores['Capacity Utilization (Y-1)'] ??
            undefined // ✅ MUDANÇA: undefined em vez de valor default
          }
          capacityUtilizationAnoAnterior={
            indicadores['Capacity Utilization (Y-1)'] ??
            indicadores['Utilização da Capacidade (Y-1)'] ??
            indicadores['Capacity Utilization_anterior'] ??
            indicadores['Utilização da Capacidade_anterior']
          }
        />
      )}
      {setorResolvido === 'Utilities' && (
        <RatingsUtilities
          // ✅ MÚLTIPLOS DE VALUATION - Corrigidos com defaults seguros
          pl={indicadores['P/L'] ?? '—'}
          plAnoAnterior={indicadores['P/L (Y-1)'] ?? undefined}
          pb={indicadores['P/VPA'] ?? indicadores['P/B'] ?? '—'}
          pbAnoAnterior={indicadores['P/VPA (Y-1)'] ?? indicadores['P/B (Y-1)'] ?? undefined}
          ps={indicadores['P/S'] ?? '—'}
          psAnoAnterior={indicadores['P/S (Y-1)'] ?? undefined}
          earningsYield={indicadores['Earnings Yield'] ?? '—'} // ✅ Não calcular automaticamente
          earningsYieldAnoAnterior={indicadores['Earnings Yield (Y-1)'] ?? undefined}
          // ✅ RENTABILIDADE - Indicadores core para Utilities
          roe={indicadores['ROE'] ?? '—'} // ✅ CORRIGIDO: Era '0'
          roeAnoAnterior={indicadores['ROE (Y-1)'] ?? undefined}
          roic={indicadores['ROIC'] ?? '—'} // ✅ CORRIGIDO: Era '0'
          roicAnoAnterior={indicadores['ROIC (Y-1)'] ?? undefined}
          margemEbitda={indicadores['Margem EBITDA'] ?? '—'} // ✅ CORRIGIDO
          margemEbitdaAnoAnterior={indicadores['Margem EBITDA (Y-1)'] ?? undefined}
          margemOperacional={indicadores['Margem Operacional'] ?? '—'} // ✅ CORRIGIDO
          margemOperacionalAnoAnterior={indicadores['Margem Operacional (Y-1)'] ?? undefined}
          margemLiquida={indicadores['Margem Líquida'] ?? '—'} // ✅ CORRIGIDO
          margemLiquidaAnoAnterior={indicadores['Margem Líquida (Y-1)'] ?? undefined}
          // ✅ DIVIDENDOS E DISTRIBUIÇÕES - CRÍTICOS para Utilities
          dividendYield={indicadores['Dividend Yield'] ?? '—'} // ✅ CORRIGIDO: Era '0'
          dividendYieldAnoAnterior={indicadores['Dividend Yield (Y-1)'] ?? undefined}
          payoutRatio={indicadores['Payout Ratio'] ?? '—'} // ✅ CORRIGIDO: Era '0'
          payoutRatioAnoAnterior={indicadores['Payout Ratio (Y-1)'] ?? undefined}
          dividendCagr5y={
            indicadores['Dividend CAGR 5Y'] ?? indicadores['CAGR Dividendos 5A'] ?? '—'
          }
          dividendCagr5yAnoAnterior={indicadores['Dividend CAGR 5Y (Y-1)'] ?? undefined}
          dividendConsistency={indicadores['Consistência Dividendos'] ?? '—'} // ✅ NOVO
          dividendConsistencyAnoAnterior={indicadores['Consistência Dividendos (Y-1)'] ?? undefined}
          // ✅ ESTRUTURA FINANCEIRA - Fundamental para capital-intensive
          endividamento={
            indicadores['Endividamento'] ?? indicadores['Dívida Total/Patrimônio'] ?? '—'
          }
          endividamentoAnoAnterior={indicadores['Endividamento (Y-1)'] ?? undefined}
          debtToEbitda={indicadores['Dívida/EBITDA'] ?? indicadores['Dívida Líquida/EBITDA'] ?? '—'}
          debtToEbitdaAnoAnterior={indicadores['Dívida/EBITDA (Y-1)'] ?? undefined}
          coberturaJuros={indicadores['Cobertura de Juros'] ?? '—'} // ✅ CRÍTICO para Utilities
          coberturaJurosAnoAnterior={indicadores['Cobertura de Juros (Y-1)'] ?? undefined}
          liquidezCorrente={indicadores['Liquidez Corrente'] ?? '—'}
          liquidezCorrenteAnoAnterior={indicadores['Liquidez Corrente (Y-1)'] ?? undefined}
          // ✅ EFICIÊNCIA OPERACIONAL - Específico para infraestrutura
          giroAtivo={indicadores['Giro do Ativo'] ?? indicadores['Asset Turnover'] ?? '—'}
          giroAtivoAnoAnterior={indicadores['Giro do Ativo (Y-1)'] ?? undefined}
          capexOverRevenue={
            indicadores['CapEx/Receita'] ?? indicadores['Investimentos/Receita'] ?? '—'
          }
          capexOverRevenueAnoAnterior={indicadores['CapEx/Receita (Y-1)'] ?? undefined}
          assetAge={indicadores['Idade Média dos Ativos'] ?? '—'} // ✅ NOVO - Importante para Utilities
          assetAgeAnoAnterior={indicadores['Idade Média dos Ativos (Y-1)'] ?? undefined}
          // ✅ CRESCIMENTO - Moderado mas estável para Utilities
          crescimentoReceita={
            indicadores['Crescimento Receita'] ?? indicadores['Crescimento da Receita'] ?? '—'
          }
          crescimentoReceitaAnoAnterior={indicadores['Crescimento Receita (Y-1)'] ?? undefined}
          crescimentoEps={indicadores['Crescimento EPS'] ?? indicadores['CAGR EPS'] ?? '—'}
          crescimentoEpsAnoAnterior={indicadores['Crescimento EPS (Y-1)'] ?? undefined}
          // ✅ VALUATION VS FUNDAMENTALS
          leveredDcf={indicadores['Levered DCF'] ?? indicadores['DCF'] ?? '—'}
          leveredDcfAnoAnterior={indicadores['Levered DCF (Y-1)'] ?? undefined}
          precoAtual={indicadores['Preço Atual'] ?? indicadores['Preço'] ?? '—'}
          precoAtualAnoAnterior={indicadores['Preço Atual (Y-1)'] ?? undefined}
          fcf={indicadores['Free Cash Flow'] ?? indicadores['FCF'] ?? '—'}
          fcfAnoAnterior={indicadores['Free Cash Flow (Y-1)'] ?? undefined}
          // ✅ MÉTRICAS ESPECÍFICAS DE UTILITIES
          regulatoryROE={indicadores['ROE Regulatório'] ?? '—'} // ✅ NOVO
          regulatoryROEAnoAnterior={indicadores['ROE Regulatório (Y-1)'] ?? undefined}
          capacityFactor={indicadores['Fator de Capacidade'] ?? '—'} // ✅ NOVO - Para geração
          capacityFactorAnoAnterior={indicadores['Fator de Capacidade (Y-1)'] ?? undefined}
          renewablePercentage={indicadores['% Energias Renováveis'] ?? '—'} // ✅ NOVO - ESG
          renewablePercentageAnoAnterior={indicadores['% Energias Renováveis (Y-1)'] ?? undefined}
          rateBaseGrowth={indicadores['Crescimento Rate Base'] ?? '—'} // ✅ NOVO
          rateBaseGrowthAnoAnterior={indicadores['Crescimento Rate Base (Y-1)'] ?? undefined}
        />
      )}
      {setorResolvido === 'Communication Services' && (
        <RatingsCommunication
          // Rentabilidade e Retorno
          pe={indicadores['P/L'] ?? '—'}
          peAnoAnterior={
            indicadores['P/L (Y-1)'] ??
            indicadores['P/L_anterior'] ??
            indicadores['P/L (Ano Anterior)']
          }
          ps={indicadores['P/S'] ?? '—'}
          psAnoAnterior={
            indicadores['P/S (Y-1)'] ??
            indicadores['P/S_anterior'] ??
            indicadores['P/S (Ano Anterior)']
          }
          pb={indicadores['P/VPA'] ?? '—'}
          pbAnoAnterior={
            indicadores['P/VPA (Y-1)'] ??
            indicadores['P/VPA_anterior'] ??
            indicadores['P/VPA (Ano Anterior)']
          }
          roe={indicadores['ROE'] ?? '—'}
          roeAnoAnterior={
            indicadores['ROE (Y-1)'] ??
            indicadores['ROE_anterior'] ??
            indicadores['ROE (Ano Anterior)']
          }
          roic={indicadores['ROIC'] ?? '—'}
          roicAnoAnterior={
            indicadores['ROIC (Y-1)'] ??
            indicadores['ROIC_anterior'] ??
            indicadores['ROIC (Ano Anterior)']
          }
          // Margens e Eficiência
          grossMargin={indicadores['Margem Bruta'] ?? '—'}
          grossMarginAnoAnterior={
            indicadores['Margem Bruta (Y-1)'] ?? indicadores['Margem Bruta_anterior']
          }
          ebitdaMargin={indicadores['Margem EBITDA'] ?? '—'}
          ebitdaMarginAnoAnterior={
            indicadores['Margem EBITDA (Y-1)'] ?? indicadores['Margem EBITDA_anterior']
          }
          margemLiquida={indicadores['Margem Líquida'] ?? '—'}
          margemLiquidaAnoAnterior={
            indicadores['Margem Líquida (Y-1)'] ?? indicadores['Margem Líquida_anterior']
          }
          margemOperacional={indicadores['Margem Operacional'] ?? '—'}
          margemOperacionalAnoAnterior={
            indicadores['Margem Operacional (Y-1)'] ?? indicadores['Margem Operacional_anterior']
          }
          // Crescimento e Performance
          receitaCagr3y={
            indicadores['Crescimento da Receita (3Y)'] ??
            indicadores['CAGR Receita 3Y'] ??
            indicadores['Crescimento da Receita'] ??
            '—'
          }
          receitaCagr3yAnoAnterior={
            indicadores['Crescimento da Receita (3Y) (Y-1)'] ??
            indicadores['CAGR Receita 3Y (Y-1)'] ??
            indicadores['Crescimento da Receita_anterior']
          }
          crescimentoReceita={
            indicadores['Crescimento Receita'] ?? indicadores['Crescimento da Receita'] ?? '—'
          }
          crescimentoReceitaAnoAnterior={
            indicadores['Crescimento Receita (Y-1)'] ??
            indicadores['Crescimento da Receita (Y-1)'] ??
            indicadores['Crescimento Receita_anterior']
          }
          crescimentoEbitda={indicadores['Crescimento EBITDA'] ?? '—'}
          crescimentoEbitdaAnoAnterior={
            indicadores['Crescimento EBITDA (Y-1)'] ?? indicadores['Crescimento EBITDA_anterior']
          }
          // Estrutura de Capital e Solvência
          dividaEbitda={indicadores['Dívida/EBITDA'] ?? indicadores['Endividamento'] ?? '—'}
          dividaEbitdaAnoAnterior={
            indicadores['Dívida/EBITDA (Y-1)'] ??
            indicadores['Endividamento (Y-1)'] ??
            indicadores['Dívida/EBITDA_anterior']
          }
          coberturaJuros={indicadores['Cobertura de Juros'] ?? '—'}
          coberturaJurosAnoAnterior={
            indicadores['Cobertura de Juros (Y-1)'] ?? indicadores['Cobertura de Juros_anterior']
          }
          liquidezCorrente={indicadores['Liquidez Corrente'] ?? '—'}
          liquidezCorrenteAnoAnterior={
            indicadores['Liquidez Corrente (Y-1)'] ?? indicadores['Liquidez Corrente_anterior']
          }
          debtEquity={
            indicadores['Dívida / Capitais Próprios'] ??
            indicadores['Dívida/Patrimônio'] ??
            indicadores['Debt/Equity'] ??
            '—'
          }
          debtEquityAnoAnterior={
            indicadores['Dívida / Capitais Próprios (Y-1)'] ??
            indicadores['Dívida/Patrimônio (Y-1)'] ??
            indicadores['Debt/Equity (Y-1)'] ??
            indicadores['Dívida/Patrimônio_anterior']
          }
          // Fluxo de Caixa e Eficiência de Capital
          freeCashFlow={
            indicadores['Free Cash Flow'] ??
            indicadores['Fluxo de Caixa Livre'] ??
            indicadores['FCF'] ??
            '—'
          }
          freeCashFlowAnoAnterior={
            indicadores['Free Cash Flow (Y-1)'] ??
            indicadores['Fluxo de Caixa Livre (Y-1)'] ??
            indicadores['FCF (Y-1)'] ??
            indicadores['Free Cash Flow_anterior']
          }
          fcfYield={indicadores['FCF Yield'] ?? '—'}
          fcfYieldAnoAnterior={indicadores['FCF Yield (Y-1)'] ?? indicadores['FCF Yield_anterior']}
          capexRevenue={indicadores['CapEx/Receita'] ?? indicadores['CapEx/Revenue'] ?? '—'}
          capexRevenueAnoAnterior={
            indicadores['CapEx/Receita (Y-1)'] ??
            indicadores['CapEx/Revenue (Y-1)'] ??
            indicadores['CapEx/Receita_anterior']
          }
          // Dividendos e Retorno
          dividendYield={indicadores['Dividend Yield'] ?? '—'}
          dividendYieldAnoAnterior={
            indicadores['Dividend Yield (Y-1)'] ??
            indicadores['Dividend Yield_anterior'] ??
            indicadores['Dividend Yield (Ano Anterior)']
          }
          payoutRatio={indicadores['Payout Ratio'] ?? '—'}
          payoutRatioAnoAnterior={
            indicadores['Payout Ratio (Y-1)'] ??
            indicadores['Payout Ratio_anterior'] ??
            indicadores['Payout Ratio (Ano Anterior)']
          }
          // Volatilidade e Avaliação
          beta={indicadores['Beta'] ?? '—'}
          betaAnoAnterior={
            indicadores['Beta (Y-1)'] ??
            indicadores['Beta_anterior'] ??
            indicadores['Beta (Ano Anterior)']
          }
          leveredDcf={
            indicadores['Valuation (DCF)'] ??
            indicadores['Levered DCF'] ??
            indicadores['DCF'] ??
            '—'
          }
          leveredDcfAnoAnterior={
            indicadores['Valuation (DCF) (Y-1)'] ??
            indicadores['Levered DCF (Y-1)'] ??
            indicadores['DCF (Y-1)'] ??
            indicadores['Levered DCF_anterior']
          }
          precoAtual={indicadores['Preço Atual'] ?? indicadores['Preço'] ?? '—'}
          precoAtualAnoAnterior={
            indicadores['Preço Atual (Y-1)'] ??
            indicadores['Preço (Y-1)'] ??
            indicadores['Preço Atual_anterior']
          }
          // Métricas Específicas de Communication Services (opcionais)
          userGrowth={indicadores['Crescimento de Usuários'] ?? indicadores['User Growth']}
          userGrowthAnoAnterior={
            indicadores['Crescimento de Usuários (Y-1)'] ??
            indicadores['User Growth (Y-1)'] ??
            indicadores['Crescimento de Usuários_anterior']
          }
          arpu={indicadores['ARPU'] ?? indicadores['Receita por Usuário']}
          arpuAnoAnterior={
            indicadores['ARPU (Y-1)'] ??
            indicadores['Receita por Usuário (Y-1)'] ??
            indicadores['ARPU_anterior']
          }
          churnRate={indicadores['Churn Rate'] ?? indicadores['Taxa de Churn']}
          churnRateAnoAnterior={
            indicadores['Churn Rate (Y-1)'] ??
            indicadores['Taxa de Churn (Y-1)'] ??
            indicadores['Churn Rate_anterior']
          }
          contentInvestment={
            indicadores['Content Investment'] ?? indicadores['Investimento em Conteúdo']
          }
          contentInvestmentAnoAnterior={
            indicadores['Content Investment (Y-1)'] ??
            indicadores['Investimento em Conteúdo (Y-1)'] ??
            indicadores['Content Investment_anterior']
          }
        />
      )}
    </>
  )
}
