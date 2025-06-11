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

export function StockRatingsBySector({ setor, indicadores }: StockRatingsBySectorProps) {
  console.log('StockRatingsBySector', { setor, indicadores })
  return (
    <>
      {setor === 'Healthcare' && (
        <RatingsHealthcare
          // Crescimento e Performance
          crescimentoReceita={indicadores['Crescimento Receita'] ?? '0'}
          crescimentoReceitaAnoAnterior={indicadores['Crescimento Receita (Y-1)'] ?? undefined}
          cagrEps={indicadores['CAGR EPS'] ?? '0'}
          cagrEpsAnoAnterior={indicadores['CAGR EPS (Y-1)'] ?? undefined}
          eps={indicadores['EPS'] ?? '0'}
          epsAnoAnterior={indicadores['EPS (Y-1)'] ?? undefined}
          // Margens e Rentabilidade
          margemBruta={indicadores['Margem Bruta'] ?? '0'}
          margemBrutaAnoAnterior={indicadores['Margem Bruta (Y-1)'] ?? undefined}
          margemEbitda={indicadores['Margem EBITDA'] ?? '0'}
          margemEbitdaAnoAnterior={indicadores['Margem EBITDA (Y-1)'] ?? undefined}
          margemLiquida={indicadores['Margem Líquida'] ?? '0'}
          margemLiquidaAnoAnterior={indicadores['Margem Líquida (Y-1)'] ?? undefined}
          margemOperacional={indicadores['Margem Operacional'] ?? '0'}
          margemOperacionalAnoAnterior={indicadores['Margem Operacional (Y-1)'] ?? undefined}
          // Retorno sobre Capital
          roic={indicadores['ROIC'] ?? '0'}
          roicAnoAnterior={indicadores['ROIC (Y-1)'] ?? undefined}
          roe={indicadores['ROE'] ?? '0'}
          roeAnoAnterior={indicadores['ROE (Y-1)'] ?? undefined}
          // Múltiplos de Avaliação
          pl={indicadores['P/L'] ?? '0'}
          plAnoAnterior={indicadores['P/L (Y-1)'] ?? undefined}
          ps={indicadores['P/S'] ?? '0'}
          psAnoAnterior={indicadores['P/S (Y-1)'] ?? undefined}
          peg={indicadores['PEG'] ?? '0'}
          pegAnoAnterior={indicadores['PEG (Y-1)'] ?? undefined}
          // Estrutura de Capital e Liquidez
          debtToEbitda={indicadores['Dívida/EBITDA'] ?? '0'}
          debtToEbitdaAnoAnterior={indicadores['Dívida/EBITDA (Y-1)'] ?? undefined}
          liquidezCorrente={indicadores['Liquidez Corrente'] ?? '0'}
          liquidezCorrenteAnoAnterior={indicadores['Liquidez Corrente (Y-1)'] ?? undefined}
          debtEquity={indicadores['Dívida / Capitais Próprios'] ?? '0'}
          debtEquityAnoAnterior={indicadores['Dívida / Capitais Próprios (Y-1)'] ?? undefined}
          // Risco e Volatilidade
          beta={indicadores['Beta'] ?? '0'}
          betaAnoAnterior={indicadores['Beta (Y-1)'] ?? undefined}
          // Métricas Específicas de Healthcare
          investimentoPD={indicadores['Investimento em P&D'] ?? '0'}
          investimentoPDAnoAnterior={indicadores['Investimento em P&D (Y-1)'] ?? undefined}
          rAnddEfficiency={indicadores['Eficiência de P&D'] ?? '0'}
          rAnddEfficiencyAnoAnterior={indicadores['Eficiência de P&D (Y-1)'] ?? undefined}
          cashFlowOverCapex={indicadores['Cash Flow / CapEx'] ?? '0'}
          cashFlowOverCapexAnoAnterior={indicadores['Cash Flow / CapEx (Y-1)'] ?? undefined}
          fcf={indicadores['Free Cash Flow'] ?? '0'}
          fcfAnoAnterior={indicadores['Free Cash Flow (Y-1)'] ?? undefined}
          sgaOverRevenue={indicadores['SG&A / Receita'] ?? '0'}
          sgaOverRevenueAnoAnterior={indicadores['SG&A / Receita (Y-1)'] ?? undefined}
          payoutRatio={indicadores['Payout Ratio'] ?? '0'}
          payoutRatioAnoAnterior={indicadores['Payout Ratio (Y-1)'] ?? undefined}
        />
      )}
      {setor === 'Technology' && (
        <RatingsTech
          // Crescimento e Performance
          crescimentoReceita={indicadores['Crescimento Receita'] ?? '0'} // ✅ "15.67%"
          crescimentoReceitaAnoAnterior={indicadores['Crescimento Receita (Y-1)'] ?? undefined} // ✅ "15.67%" - DISPONÍVEL!
          cagrEps={indicadores['CAGR EPS'] ?? '0'} // ✅ "17.29%"
          cagrEpsAnoAnterior={indicadores['CAGR EPS (Y-1)'] ?? undefined} // ✅ "9.67%"
          eps={indicadores['EPS'] ?? '0'} // ✅ "3.46"
          epsAnoAnterior={indicadores['EPS (Y-1)'] ?? undefined} // ✅ "9.72" - DISPONÍVEL!
          // Margens e Rentabilidade
          margemBruta={indicadores['Margem Bruta'] ?? '0'} // ✅ "69.07%"
          margemBrutaAnoAnterior={indicadores['Margem Bruta (Y-1)'] ?? undefined} // ✅ "68.92%" - DISPONÍVEL!
          margemEbitda={indicadores['Margem EBITDA'] ?? '0'} // ✅ "54.26%"
          margemEbitdaAnoAnterior={indicadores['Margem EBITDA (Y-1)'] ?? undefined} // ✅ "49.61%" - DISPONÍVEL!
          margemLiquida={indicadores['Margem Líquida'] ?? '0'} // ✅ "35.79%"
          margemLiquidaAnoAnterior={indicadores['Margem Líquida (Y-1)'] ?? undefined} // ✅ "34.15%"
          margemOperacional={indicadores['Margem Operacional'] ?? '0'} // ✅ "45.23%"
          margemOperacionalAnoAnterior={indicadores['Margem Operacional (Y-1)'] ?? undefined} // ✅ "41.77%" - DISPONÍVEL!
          // Retorno sobre Capital
          roic={indicadores['ROIC'] ?? '0'} // ✅ "22.11%"
          roicAnoAnterior={indicadores['ROIC (Y-1)'] ?? undefined} // ✅ "28.76%"
          roe={indicadores['ROE'] ?? '0'} // ✅ "32.74%"
          roeAnoAnterior={indicadores['ROE (Y-1)'] ?? undefined} // ✅ "35.09%" - DISPONÍVEL!
          // Múltiplos de Avaliação
          pl={indicadores['P/L'] ?? '0'} // ✅ "36.23"
          plAnoAnterior={indicadores['P/L (Y-1)'] ?? undefined} // ✅ "35.04" - CORRIGIDO!
          ps={indicadores['P/S'] ?? '0'} // ✅ "12.96"
          psAnoAnterior={indicadores['P/S (Y-1)'] ?? undefined} // ✅ "11.97" - DISPONÍVEL!
          peg={indicadores['PEG'] ?? '0'} // ✅ "2.10"
          pegAnoAnterior={indicadores['PEG (Y-1)'] ?? undefined} // ✅ "3.63" - DISPONÍVEL!
          // Estrutura de Capital e Liquidez
          debtToEbitda={indicadores['Dívida/EBITDA'] ?? '0'} // ✅ "0.21"
          debtToEbitdaAnoAnterior={indicadores['Dívida/EBITDA (Y-1)'] ?? undefined} // ✅ "0.21"
          liquidezCorrente={indicadores['Liquidez Corrente'] ?? '0'} // ✅ "1.37"
          liquidezCorrenteAnoAnterior={indicadores['Liquidez Corrente (Y-1)'] ?? undefined} // ✅ "1.77" - DISPONÍVEL!
          cashRatio={indicadores['Cash Ratio'] ?? 'N/A'} // ✅ "N/A" - DISPONÍVEL!
          cashRatioAnoAnterior={indicadores['Cash Ratio (Y-1)'] ?? undefined} // ✅ "N/A" - DISPONÍVEL!
          debtEquity={indicadores['Dívida / Capitais Próprios'] ?? '0'} // ✅ "0.19"
          debtEquityAnoAnterior={indicadores['Dívida / Capitais Próprios (Y-1)'] ?? undefined} // ✅ "0.29" - DISPONÍVEL!
          // Risco e Volatilidade
          beta={indicadores['Beta'] ?? '0'} // ✅ "1.03"
          betaAnoAnterior={indicadores['Beta (Y-1)'] ?? undefined} // ✅ "1.03" - DISPONÍVEL!
          // Métricas Específicas de Tech
          investimentoPD={indicadores['Investimento em P&D'] ?? '0'} // ✅ "29.5B"
          investimentoPDAnoAnterior={indicadores['Investimento em P&D (Y-1)'] ?? undefined} // ✅ "27.2B" - DISPONÍVEL!
          rAnddEfficiency={indicadores['Eficiência de P&D'] ?? '0'} // ✅ "0.12" - CORRIGIDO!
          rAnddEfficiencyAnoAnterior={indicadores['Eficiência de P&D (Y-1)'] ?? undefined} // ✅ "0.36" - DISPONÍVEL!
          cashFlowOverCapex={indicadores['Cash Flow / CapEx'] ?? '0'} // ✅ "2.67"
          cashFlowOverCapexAnoAnterior={indicadores['Cash Flow / CapEx (Y-1)'] ?? undefined} // ✅ "3.12" - DISPONÍVEL!
          fcf={indicadores['Free Cash Flow'] ?? '0'} // ✅ "74.1B"
          fcfAnoAnterior={indicadores['Free Cash Flow (Y-1)'] ?? undefined} // ✅ "59.5B" - DISPONÍVEL!
          sgaOverRevenue={indicadores['SG&A / Receita'] ?? '0'} // ✅ "13.08%"
          sgaOverRevenueAnoAnterior={indicadores['SG&A / Receita (Y-1)'] ?? undefined} // ✅ "14.31%" - DISPONÍVEL!
          payoutRatio={indicadores['Payout Ratio'] ?? '0'} // ✅ "24.30%"
          payoutRatioAnoAnterior={indicadores['Payout Ratio (Y-1)'] ?? undefined} // ✅ "N/A" - DISPONÍVEL!
        />
      )}
      {setor === 'Financial Services' && (
        <RatingsFinancials
          // Rentabilidade e Eficiência
          roe={indicadores['ROE'] ?? '0'}
          roeAnoAnterior={
            indicadores['ROE (Y-1)'] ??
            indicadores['ROE_anterior'] ??
            indicadores['ROE (Ano Anterior)']
          }
          eficiencia={indicadores['Eficiência'] ?? indicadores['Índice de Eficiência'] ?? '0'}
          eficienciaAnoAnterior={
            indicadores['Eficiência (Y-1)'] ??
            indicadores['Índice de Eficiência (Y-1)'] ??
            indicadores['Eficiência_anterior'] ??
            indicadores['Índice de Eficiência_anterior']
          }
          nim={
            indicadores['NIM'] ??
            indicadores['Margem Financeira'] ??
            indicadores['Margem Financeira Líquida'] ??
            '0'
          }
          nimAnoAnterior={
            indicadores['NIM (Y-1)'] ??
            indicadores['Margem Financeira (Y-1)'] ??
            indicadores['Margem Financeira Líquida (Y-1)'] ??
            indicadores['NIM_anterior'] ??
            indicadores['Margem Financeira_anterior']
          }
          // Solidez e Capitalização
          basileia={indicadores['Basileia'] ?? indicadores['Índice de Basileia'] ?? '0'}
          basileiaAnoAnterior={
            indicadores['Basileia (Y-1)'] ??
            indicadores['Índice de Basileia (Y-1)'] ??
            indicadores['Basileia_anterior'] ??
            indicadores['Índice de Basileia_anterior']
          }
          tier1={indicadores['Tier 1'] ?? indicadores['Capital Principal'] ?? '0'}
          tier1AnoAnterior={
            indicadores['Tier 1 (Y-1)'] ??
            indicadores['Capital Principal (Y-1)'] ??
            indicadores['Tier 1_anterior'] ??
            indicadores['Capital Principal_anterior']
          }
          // Estrutura de Capital e Risco
          alavancagem={indicadores['Alavancagem'] ?? indicadores['Índice de Alavancagem'] ?? '0'}
          alavancagemAnoAnterior={
            indicadores['Alavancagem (Y-1)'] ??
            indicadores['Índice de Alavancagem (Y-1)'] ??
            indicadores['Alavancagem_anterior'] ??
            indicadores['Índice de Alavancagem_anterior']
          }
          liquidez={indicadores['Liquidez'] ?? indicadores['Liquidez Corrente'] ?? '0'}
          liquidezAnoAnterior={
            indicadores['Liquidez (Y-1)'] ??
            indicadores['Liquidez Corrente (Y-1)'] ??
            indicadores['Liquidez_anterior'] ??
            indicadores['Liquidez Corrente_anterior']
          }
          inadimplencia={
            indicadores['Inadimplência'] ?? indicadores['Taxa de Inadimplência'] ?? '0'
          }
          inadimplenciaAnoAnterior={
            indicadores['Inadimplência (Y-1)'] ??
            indicadores['Taxa de Inadimplência (Y-1)'] ??
            indicadores['Inadimplência_anterior'] ??
            indicadores['Taxa de Inadimplência_anterior']
          }
          cobertura={indicadores['Cobertura'] ?? indicadores['Cobertura de Provisões'] ?? '0'}
          coberturaAnoAnterior={
            indicadores['Cobertura (Y-1)'] ??
            indicadores['Cobertura de Provisões (Y-1)'] ??
            indicadores['Cobertura_anterior'] ??
            indicadores['Cobertura de Provisões_anterior']
          }
          // Múltiplos de Avaliação
          pl={indicadores['P/L'] ?? '0'}
          plAnoAnterior={
            indicadores['P/L (Y-1)'] ??
            indicadores['P/L_anterior'] ??
            indicadores['P/L (Ano Anterior)']
          }
          pvpa={indicadores['P/VPA'] ?? '0'}
          pvpaAnoAnterior={
            indicadores['P/VPA (Y-1)'] ??
            indicadores['P/VPA_anterior'] ??
            indicadores['P/VPA (Ano Anterior)']
          }
          // Dividendos e Retorno
          dividendYield={indicadores['Dividend Yield'] ?? '0'}
          dividendYieldAnoAnterior={
            indicadores['Dividend Yield (Y-1)'] ??
            indicadores['Dividend Yield_anterior'] ??
            indicadores['Dividend Yield (Ano Anterior)']
          }
          payoutRatio={indicadores['Payout Ratio'] ?? '0'}
          payoutRatioAnoAnterior={
            indicadores['Payout Ratio (Y-1)'] ??
            indicadores['Payout Ratio_anterior'] ??
            indicadores['Payout Ratio (Ano Anterior)']
          }
          // Métricas Específicas de Bancos (mantidas com padrão original para você ajustar na API)
          ldr={indicadores['LDR'] ?? indicadores['Loan-to-Deposit Ratio'] ?? '0'}
          ldrAnoAnterior={
            indicadores['LDR_anterior'] ?? indicadores['Loan-to-Deposit Ratio_anterior']
          }
          beta={indicadores['Beta'] ?? '0'}
          betaAnoAnterior={
            indicadores['Beta (Y-1)'] ??
            indicadores['Beta_anterior'] ??
            indicadores['Beta (Ano Anterior)']
          }
          leveredDcf={
            indicadores['Levered DCF'] ??
            indicadores['DCF'] ??
            indicadores['Valuation (DCF)'] ??
            '0'
          }
          leveredDcfAnoAnterior={indicadores['Levered DCF_anterior'] ?? indicadores['DCF_anterior']}
          precoAtual={indicadores['Preço Atual'] ?? indicadores['Preço'] ?? '0'}
          precoAtualAnoAnterior={
            indicadores['Preço Atual_anterior'] ?? indicadores['Preço_anterior']
          }
          // Métricas Adicionais Opcionais (mantidas com padrão original para você ajustar na API)
          roa={indicadores['ROA'] ?? indicadores['Retorno sobre Ativos']}
          roaAnoAnterior={
            indicadores['ROA_anterior'] ?? indicadores['Retorno sobre Ativos_anterior']
          }
          custoCredito={indicadores['Custo do Crédito'] ?? indicadores['Custo do Risco']}
          custoCreditoAnoAnterior={
            indicadores['Custo do Crédito_anterior'] ?? indicadores['Custo do Risco_anterior']
          }
          crescimentoCarteira={
            indicadores['Crescimento Carteira'] ?? indicadores['Crescimento da Carteira']
          }
          crescimentoCarteiraAnoAnterior={
            indicadores['Crescimento Carteira_anterior'] ??
            indicadores['Crescimento da Carteira_anterior']
          }
        />
      )}
      {setor === 'Real Estate' && (
        <RatingsREITs
          // Usar campos que EXISTEM e mapear para os mais próximos

          // Rentabilidade e Dividendos (adaptar com o que temos)
          dividendYield={indicadores['Payout Ratio'] ?? '0'} // ← MUDANÇA: usar Payout Ratio como proxy
          dividendYieldAnoAnterior={indicadores['Payout Ratio (Y-1)'] ?? undefined}
          dividendCagr5y={indicadores['CAGR EPS'] ?? '0'} // ← MUDANÇA: usar CAGR EPS
          dividendCagr5yAnoAnterior={indicadores['CAGR EPS (Y-1)'] ?? undefined}
          ffoPayoutRatio={indicadores['Payout Ratio'] ?? '0'} // ← MUDANÇA: usar Payout Ratio
          ffoPayoutRatioAnoAnterior={indicadores['Payout Ratio (Y-1)'] ?? undefined}
          // Múltiplos Específicos de REITs
          pVpa={indicadores['P/L'] ?? '0'} // ← MUDANÇA: usar P/L como proxy para P/VPA
          pVpaAnoAnterior={indicadores['P/L (Y-1)'] ?? undefined}
          pFfo={indicadores['P/FFO'] ?? '0'} // ✅ EXISTE
          pFfoAnoAnterior={indicadores['P/FFO (Y-1)'] ?? undefined}
          // Operacionais (usar métricas operacionais existentes)
          ocupacao={indicadores['Margem Operacional'] ?? '0'} // ← MUDANÇA: usar Margem Operacional como proxy
          ocupacaoAnoAnterior={indicadores['Margem Operacional (Y-1)'] ?? undefined}
          capRate={indicadores['ROE'] ?? '0'} // ← MUDANÇA: usar ROE como proxy para Cap Rate
          capRateAnoAnterior={indicadores['ROE (Y-1)'] ?? undefined}
          noi={indicadores['Crescimento Receita'] ?? undefined} // ← MUDANÇA: usar Crescimento Receita
          noiAnoAnterior={indicadores['Crescimento Receita (Y-1)'] ?? undefined}
          sameSoreNoi={undefined} // ← Não existe, manter undefined
          sameSoreNoiAnoAnterior={undefined}
          // Fluxo de Caixa Específico
          ffo={indicadores['FFO'] ?? '0'} // ✅ EXISTE
          ffoAnoAnterior={indicadores['FFO (Y-1)'] ?? undefined}
          affo={indicadores['Free Cash Flow'] ?? '0'} // ← MUDANÇA: usar Free Cash Flow como proxy para AFFO
          affoAnoAnterior={indicadores['Free Cash Flow (Y-1)'] ?? undefined}
          // Estrutura Financeira
          coberturaJuros={indicadores['ROIC'] ?? '0'} // ← MUDANÇA: usar ROIC como proxy
          coberturaJurosAnoAnterior={indicadores['ROIC (Y-1)'] ?? undefined}
          dividaEbitda={indicadores['Dívida/EBITDA'] ?? '0'} // ✅ EXISTE (nome ligeiramente diferente)
          dividaEbitdaAnoAnterior={indicadores['Dívida/EBITDA (Y-1)'] ?? undefined}
          liquidezCorrente={indicadores['Liquidez Corrente'] ?? '0'} // ✅ EXISTE
          liquidezCorrenteAnoAnterior={indicadores['Liquidez Corrente (Y-1)'] ?? undefined}
          // Gestão de Capital (manter undefined - não existem)
          navDiscount={undefined}
          navDiscountAnoAnterior={undefined}
          retentionRate={undefined}
          retentionRateAnoAnterior={undefined}
        />
      )}
      {setor === 'Consumer Defensive' && (
        <RatingsConsumerDefensive
          // Campos que já existem (compatibilidade)
          pe={indicadores['P/L'] ?? '0'}
          peAnoAnterior={
            indicadores['P/L (Y-1)'] ??
            indicadores['P/L_anterior'] ??
            indicadores['P/L (Ano Anterior)']
          }
          pb={indicadores['P/VPA'] ?? '0'}
          pbAnoAnterior={
            indicadores['P/VPA (Y-1)'] ??
            indicadores['P/VPA_anterior'] ??
            indicadores['P/VPA (Ano Anterior)']
          }
          ps={indicadores['P/S'] ?? '0'}
          psAnoAnterior={
            indicadores['P/S (Y-1)'] ??
            indicadores['P/S_anterior'] ??
            indicadores['P/S (Ano Anterior)']
          }
          roe={indicadores['ROE'] ?? '0'}
          roeAnoAnterior={
            indicadores['ROE (Y-1)'] ??
            indicadores['ROE_anterior'] ??
            indicadores['ROE (Ano Anterior)']
          }
          grossMargin={indicadores['Margem Bruta'] ?? '0'}
          grossMarginAnoAnterior={
            indicadores['Margem Bruta (Y-1)'] ?? indicadores['Margem Bruta_anterior']
          }
          ebitdaMargin={indicadores['Margem EBITDA'] ?? '0'}
          ebitdaMarginAnoAnterior={
            indicadores['Margem EBITDA (Y-1)'] ?? indicadores['Margem EBITDA_anterior']
          }
          receitaCagr3y={
            indicadores['Crescimento da Receita'] ?? indicadores['CAGR Receita 3Y'] ?? '0'
          }
          receitaCagr3yAnoAnterior={
            indicadores['Crescimento da Receita (Y-1)'] ??
            indicadores['CAGR Receita 3Y (Y-1)'] ??
            indicadores['Crescimento da Receita_anterior']
          }
          payoutRatio={indicadores['Payout Ratio'] ?? '0'}
          payoutRatioAnoAnterior={
            indicadores['Payout Ratio (Y-1)'] ??
            indicadores['Payout Ratio_anterior'] ??
            indicadores['Payout Ratio (Ano Anterior)']
          }
          dividendYield={indicadores['Dividend Yield'] ?? '0'}
          dividendYieldAnoAnterior={
            indicadores['Dividend Yield (Y-1)'] ??
            indicadores['Dividend Yield_anterior'] ??
            indicadores['Dividend Yield (Ano Anterior)']
          }
          beta={indicadores['Beta'] ?? '0'}
          betaAnoAnterior={
            indicadores['Beta (Y-1)'] ??
            indicadores['Beta_anterior'] ??
            indicadores['Beta (Ano Anterior)']
          }
          // Campos expandidos (usando valores padrão se não existirem)
          roic={indicadores['ROIC'] ?? '0'}
          roicAnoAnterior={indicadores['ROIC (Y-1)'] ?? indicadores['ROIC_anterior']}
          margemLiquida={indicadores['Margem Líquida'] ?? '0'}
          margemLiquidaAnoAnterior={
            indicadores['Margem Líquida (Y-1)'] ?? indicadores['Margem Líquida_anterior']
          }
          margemOperacional={indicadores['Margem Operacional'] ?? '0'}
          margemOperacionalAnoAnterior={
            indicadores['Margem Operacional (Y-1)'] ?? indicadores['Margem Operacional_anterior']
          }
          crescimentoReceita={indicadores['Crescimento Receita'] ?? '0'}
          crescimentoReceitaAnoAnterior={
            indicadores['Crescimento Receita (Y-1)'] ?? indicadores['Crescimento Receita_anterior']
          }
          consistenciaReceita={indicadores['Consistência Receita'] ?? '0'}
          consistenciaReceitaAnoAnterior={
            indicadores['Consistência Receita (Y-1)'] ??
            indicadores['Consistência Receita_anterior']
          }
          dividaEbitda={indicadores['Dívida/EBITDA'] ?? '0'}
          dividaEbitdaAnoAnterior={
            indicadores['Dívida/EBITDA (Y-1)'] ?? indicadores['Dívida/EBITDA_anterior']
          }
          coberturaJuros={indicadores['Cobertura de Juros'] ?? '0'}
          coberturaJurosAnoAnterior={
            indicadores['Cobertura de Juros (Y-1)'] ?? indicadores['Cobertura de Juros_anterior']
          }
          liquidezCorrente={indicadores['Liquidez Corrente'] ?? '0'}
          liquidezCorrenteAnoAnterior={
            indicadores['Liquidez Corrente (Y-1)'] ?? indicadores['Liquidez Corrente_anterior']
          }
          debtEquity={indicadores['Dívida/Patrimônio'] ?? '0'}
          debtEquityAnoAnterior={
            indicadores['Dívida/Patrimônio (Y-1)'] ?? indicadores['Dívida/Patrimônio_anterior']
          }
          freeCashFlow={indicadores['Free Cash Flow'] ?? '0'}
          freeCashFlowAnoAnterior={
            indicadores['Free Cash Flow (Y-1)'] ?? indicadores['Free Cash Flow_anterior']
          }
          fcfYield={indicadores['FCF Yield'] ?? '0'}
          fcfYieldAnoAnterior={indicadores['FCF Yield (Y-1)'] ?? indicadores['FCF Yield_anterior']}
          workingCapitalTurnover={indicadores['Working Capital Turnover'] ?? '0'}
          workingCapitalTurnoverAnoAnterior={
            indicadores['Working Capital Turnover (Y-1)'] ??
            indicadores['Working Capital Turnover_anterior']
          }
          inventoryTurnover={indicadores['Inventory Turnover'] ?? '0'}
          inventoryTurnoverAnoAnterior={
            indicadores['Inventory Turnover (Y-1)'] ?? indicadores['Inventory Turnover_anterior']
          }
          dividendGrowth={indicadores['Crescimento Dividendos'] ?? '0'}
          dividendGrowthAnoAnterior={
            indicadores['Crescimento Dividendos (Y-1)'] ??
            indicadores['Crescimento Dividendos_anterior']
          }
          yearsOfDividends={indicadores['Anos de Dividendos'] ?? '0'}
          yearsOfDividendsAnoAnterior={indicadores['Anos de Dividendos_anterior']}
          leveredDcf={indicadores['Levered DCF'] ?? '0'}
          leveredDcfAnoAnterior={
            indicadores['Levered DCF (Y-1)'] ?? indicadores['Levered DCF_anterior']
          }
          precoAtual={indicadores['Preço Atual'] ?? '0'}
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
      {setor === 'Industrials' && (
        <RatingsIndustrials
          // Valores atuais
          margemEbitda={indicadores['Margem EBITDA'] ?? '0'}
          roic={indicadores['ROIC'] ?? '0'}
          alavancagem={indicadores['Alavancagem Financeira'] ?? '0'}
          coberturaJuros={indicadores['Cobertura de Juros'] ?? '0'}
          liquidezCorrente={indicadores['Liquidez Corrente'] ?? '0'}
          rotatividadeEstoques={indicadores['Rotatividade de Estoques'] ?? '0'}
          pe={indicadores['P/L'] ?? '0'}
          pb={indicadores['P/VPA'] ?? '0'}
          ps={indicadores['P/S'] ?? '0'}
          peg={indicadores['PEG'] ?? '0'}
          dividendYield={indicadores['Dividend Yield'] ?? '0'}
          beta={indicadores['Beta'] ?? '0'}
          giroAtivo={indicadores['Giro do Ativo'] ?? '0'}
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
      {setor === 'Energy' && (
        <RatingsEnergy
          // Rentabilidade e Retorno
          pe={indicadores['P/L'] ?? '0'}
          peAnoAnterior={
            indicadores['P/L (Y-1)'] ??
            indicadores['P/L_anterior'] ??
            indicadores['P/L (Ano Anterior)']
          }
          pb={indicadores['P/VPA'] ?? '0'}
          pbAnoAnterior={
            indicadores['P/VPA (Y-1)'] ??
            indicadores['P/VPA_anterior'] ??
            indicadores['P/VPA (Ano Anterior)']
          }
          roe={indicadores['ROE'] ?? '0'}
          roeAnoAnterior={
            indicadores['ROE (Y-1)'] ??
            indicadores['ROE_anterior'] ??
            indicadores['ROE (Ano Anterior)']
          }
          roic={indicadores['ROIC'] ?? '0'}
          roicAnoAnterior={
            indicadores['ROIC (Y-1)'] ??
            indicadores['ROIC_anterior'] ??
            indicadores['ROIC (Ano Anterior)']
          }
          // Margens e Eficiência
          margemEbitda={indicadores['Margem EBITDA'] ?? '0'}
          margemEbitdaAnoAnterior={
            indicadores['Margem EBITDA (Y-1)'] ?? indicadores['Margem EBITDA_anterior']
          }
          margemBruta={indicadores['Margem Bruta'] ?? '0'}
          margemBrutaAnoAnterior={
            indicadores['Margem Bruta (Y-1)'] ?? indicadores['Margem Bruta_anterior']
          }
          margemLiquida={indicadores['Margem Líquida'] ?? '0'}
          margemLiquidaAnoAnterior={
            indicadores['Margem Líquida (Y-1)'] ?? indicadores['Margem Líquida_anterior']
          }
          // Estrutura de Capital e Solvência
          dividaEbitda={indicadores['Endividamento'] ?? indicadores['Dívida/EBITDA'] ?? '0'}
          dividaEbitdaAnoAnterior={
            indicadores['Endividamento (Y-1)'] ??
            indicadores['Dívida/EBITDA (Y-1)'] ??
            indicadores['Endividamento_anterior']
          }
          coberturaJuros={indicadores['Cobertura de Juros'] ?? '0'}
          coberturaJurosAnoAnterior={
            indicadores['Cobertura de Juros (Y-1)'] ?? indicadores['Cobertura de Juros_anterior']
          }
          liquidezCorrente={indicadores['Liquidez Corrente'] ?? '0'}
          liquidezCorrenteAnoAnterior={
            indicadores['Liquidez Corrente (Y-1)'] ?? indicadores['Liquidez Corrente_anterior']
          }
          debtEquity={indicadores['Dívida/Patrimônio'] ?? indicadores['Debt/Equity'] ?? '0'}
          debtEquityAnoAnterior={
            indicadores['Dívida/Patrimônio (Y-1)'] ??
            indicadores['Debt/Equity (Y-1)'] ??
            indicadores['Dívida/Patrimônio_anterior']
          }
          // Fluxo de Caixa e Investimentos
          freeCashFlow={
            indicadores['Fluxo de Caixa Livre'] ??
            indicadores['Free Cash Flow'] ??
            indicadores['FCF'] ??
            '0'
          }
          freeCashFlowAnoAnterior={
            indicadores['Fluxo de Caixa Livre (Y-1)'] ??
            indicadores['Free Cash Flow (Y-1)'] ??
            indicadores['FCF (Y-1)'] ??
            indicadores['Fluxo de Caixa Livre_anterior']
          }
          capexRevenue={indicadores['CapEx/Receita'] ?? indicadores['CapEx/Revenue'] ?? '0'}
          capexRevenueAnoAnterior={
            indicadores['CapEx/Receita (Y-1)'] ??
            indicadores['CapEx/Revenue (Y-1)'] ??
            indicadores['CapEx/Receita_anterior']
          }
          fcfYield={indicadores['FCF Yield'] ?? '0'}
          fcfYieldAnoAnterior={indicadores['FCF Yield (Y-1)'] ?? indicadores['FCF Yield_anterior']}
          // Dividendos e Retorno
          dividendYield={indicadores['Dividend Yield'] ?? '0'}
          dividendYieldAnoAnterior={
            indicadores['Dividend Yield (Y-1)'] ??
            indicadores['Dividend Yield_anterior'] ??
            indicadores['Dividend Yield (Ano Anterior)']
          }
          payoutRatio={indicadores['Payout Ratio'] ?? '0'}
          payoutRatioAnoAnterior={
            indicadores['Payout Ratio (Y-1)'] ??
            indicadores['Payout Ratio_anterior'] ??
            indicadores['Payout Ratio (Ano Anterior)']
          }
          // Volatilidade e Avaliação
          beta={indicadores['Beta'] ?? '0'}
          betaAnoAnterior={
            indicadores['Beta (Y-1)'] ??
            indicadores['Beta_anterior'] ??
            indicadores['Beta (Ano Anterior)']
          }
          leveredDcf={
            indicadores['Levered DCF'] ??
            indicadores['DCF'] ??
            indicadores['Valuation (DCF)'] ??
            '0'
          }
          leveredDcfAnoAnterior={
            indicadores['Levered DCF (Y-1)'] ??
            indicadores['DCF (Y-1)'] ??
            indicadores['Levered DCF_anterior']
          }
          precoAtual={indicadores['Preço Atual'] ?? indicadores['Preço'] ?? '0'}
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
      {setor === 'Consumer Cyclical' && (
        <RatingsConsumerCyclical
          // Rentabilidade e Retorno
          pe={indicadores['P/L'] ?? '0'}
          peAnoAnterior={
            indicadores['P/L (Y-1)'] ??
            indicadores['P/L_anterior'] ??
            indicadores['P/L (Ano Anterior)']
          }
          ps={indicadores['P/S'] ?? '0'}
          psAnoAnterior={
            indicadores['P/S (Y-1)'] ??
            indicadores['P/S_anterior'] ??
            indicadores['P/S (Ano Anterior)']
          }
          pb={indicadores['P/VPA'] ?? '0'}
          pbAnoAnterior={
            indicadores['P/VPA (Y-1)'] ??
            indicadores['P/VPA_anterior'] ??
            indicadores['P/VPA (Ano Anterior)']
          }
          roe={indicadores['ROE'] ?? '0'}
          roeAnoAnterior={
            indicadores['ROE (Y-1)'] ??
            indicadores['ROE_anterior'] ??
            indicadores['ROE (Ano Anterior)']
          }
          roic={indicadores['ROIC'] ?? '0'}
          roicAnoAnterior={
            indicadores['ROIC (Y-1)'] ??
            indicadores['ROIC_anterior'] ??
            indicadores['ROIC (Ano Anterior)']
          }
          // Margens e Eficiência
          grossMargin={indicadores['Margem Bruta'] ?? '0'}
          grossMarginAnoAnterior={
            indicadores['Margem Bruta (Y-1)'] ??
            indicadores['Margem Bruta_anterior'] ??
            indicadores['Margem Bruta (Ano Anterior)']
          }
          ebitdaMargin={indicadores['Margem EBITDA'] ?? '0'}
          ebitdaMarginAnoAnterior={
            indicadores['Margem EBITDA (Y-1)'] ??
            indicadores['Margem EBITDA_anterior'] ??
            indicadores['Margem EBITDA (Ano Anterior)']
          }
          margemLiquida={indicadores['Margem Líquida'] ?? '0'}
          margemLiquidaAnoAnterior={
            indicadores['Margem Líquida (Y-1)'] ??
            indicadores['Margem Líquida_anterior'] ??
            indicadores['Margem Líquida (Ano Anterior)']
          }
          margemOperacional={indicadores['Margem Operacional'] ?? '0'}
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
            '0'
          }
          receitaCagr3yAnoAnterior={
            indicadores['Crescimento da Receita (3Y) (Y-1)'] ??
            indicadores['CAGR Receita 3Y (Y-1)'] ??
            indicadores['Crescimento da Receita_anterior']
          }
          crescimentoReceita={
            indicadores['Crescimento Receita'] ?? indicadores['Crescimento da Receita'] ?? '0'
          }
          crescimentoReceitaAnoAnterior={
            indicadores['Crescimento Receita (Y-1)'] ??
            indicadores['Crescimento da Receita (Y-1)'] ??
            indicadores['Crescimento Receita_anterior']
          }
          crescimentoEbitda={indicadores['Crescimento EBITDA'] ?? '0'}
          crescimentoEbitdaAnoAnterior={
            indicadores['Crescimento EBITDA (Y-1)'] ?? indicadores['Crescimento EBITDA_anterior']
          }
          // Estrutura de Capital e Solvência
          endividamento={indicadores['Endividamento'] ?? indicadores['Dívida/EBITDA'] ?? '0'}
          endividamentoAnoAnterior={
            indicadores['Endividamento (Y-1)'] ??
            indicadores['Dívida/EBITDA (Y-1)'] ??
            indicadores['Endividamento_anterior']
          }
          coberturaJuros={indicadores['Cobertura de Juros'] ?? '0'}
          coberturaJurosAnoAnterior={
            indicadores['Cobertura de Juros (Y-1)'] ?? indicadores['Cobertura de Juros_anterior']
          }
          liquidezCorrente={indicadores['Liquidez Corrente'] ?? '0'}
          liquidezCorrenteAnoAnterior={
            indicadores['Liquidez Corrente (Y-1)'] ?? indicadores['Liquidez Corrente_anterior']
          }
          debtEquity={indicadores['Dívida/Patrimônio'] ?? indicadores['Debt/Equity'] ?? '0'}
          debtEquityAnoAnterior={
            indicadores['Dívida/Patrimônio (Y-1)'] ??
            indicadores['Debt/Equity (Y-1)'] ??
            indicadores['Dívida/Patrimônio_anterior']
          }
          // Eficiência Operacional
          rotatividadeEstoques={
            indicadores['Rotatividade de Estoques'] ?? indicadores['Inventory Turnover'] ?? '0'
          }
          rotatividadeEstoquesAnoAnterior={
            indicadores['Rotatividade de Estoques (Y-1)'] ??
            indicadores['Inventory Turnover (Y-1)'] ??
            indicadores['Rotatividade de Estoques_anterior']
          }
          workingCapitalTurnover={indicadores['Working Capital Turnover'] ?? '0'}
          workingCapitalTurnoverAnoAnterior={
            indicadores['Working Capital Turnover (Y-1)'] ??
            indicadores['Working Capital Turnover_anterior']
          }
          assetTurnover={indicadores['Asset Turnover'] ?? '0'}
          assetTurnoverAnoAnterior={
            indicadores['Asset Turnover (Y-1)'] ?? indicadores['Asset Turnover_anterior']
          }
          receivablesTurnover={indicadores['Receivables Turnover'] ?? '0'}
          receivablesTurnoverAnoAnterior={
            indicadores['Receivables Turnover (Y-1)'] ??
            indicadores['Receivables Turnover_anterior']
          }
          // Fluxo de Caixa
          freeCashFlow={indicadores['Free Cash Flow'] ?? indicadores['FCF'] ?? '0'}
          freeCashFlowAnoAnterior={
            indicadores['Free Cash Flow (Y-1)'] ??
            indicadores['FCF (Y-1)'] ??
            indicadores['Free Cash Flow_anterior']
          }
          fcfYield={indicadores['FCF Yield'] ?? '0'}
          fcfYieldAnoAnterior={indicadores['FCF Yield (Y-1)'] ?? indicadores['FCF Yield_anterior']}
          capexRevenue={indicadores['CapEx/Receita'] ?? indicadores['CapEx Ratio'] ?? '0'}
          capexRevenueAnoAnterior={
            indicadores['CapEx/Receita (Y-1)'] ??
            indicadores['CapEx Ratio (Y-1)'] ??
            indicadores['CapEx/Receita_anterior']
          }
          // Dividendos e Retorno
          dividendYield={indicadores['Dividend Yield'] ?? '0'}
          dividendYieldAnoAnterior={
            indicadores['Dividend Yield (Y-1)'] ??
            indicadores['Dividend Yield_anterior'] ??
            indicadores['Dividend Yield (Ano Anterior)']
          }
          payoutRatio={indicadores['Payout Ratio'] ?? '0'}
          payoutRatioAnoAnterior={
            indicadores['Payout Ratio (Y-1)'] ??
            indicadores['Payout Ratio_anterior'] ??
            indicadores['Payout Ratio (Ano Anterior)']
          }
          // Volatilidade e Avaliação
          beta={indicadores['Beta'] ?? '0'}
          betaAnoAnterior={
            indicadores['Beta (Y-1)'] ??
            indicadores['Beta_anterior'] ??
            indicadores['Beta (Ano Anterior)']
          }
          leveredDcf={
            indicadores['Valuation (DCF)'] ??
            indicadores['Levered DCF'] ??
            indicadores['DCF'] ??
            '0'
          }
          leveredDcfAnoAnterior={
            indicadores['Valuation (DCF) (Y-1)'] ??
            indicadores['Levered DCF (Y-1)'] ??
            indicadores['DCF (Y-1)'] ??
            indicadores['Levered DCF_anterior']
          }
          precoAtual={indicadores['Preço Atual'] ?? indicadores['Preço'] ?? '0'}
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
      {setor === 'Basic Materials' && (
        <RatingsBasicMaterials
          // Rentabilidade e Retorno
          pe={indicadores['P/L'] ?? '0'}
          peAnoAnterior={
            indicadores['P/L (Y-1)'] ??
            indicadores['P/L_anterior'] ??
            indicadores['P/L (Ano Anterior)']
          }
          pb={indicadores['P/VPA'] ?? '0'}
          pbAnoAnterior={
            indicadores['P/VPA (Y-1)'] ??
            indicadores['P/VPA_anterior'] ??
            indicadores['P/VPA (Ano Anterior)']
          }
          roe={indicadores['ROE'] ?? '0'}
          roeAnoAnterior={
            indicadores['ROE (Y-1)'] ??
            indicadores['ROE_anterior'] ??
            indicadores['ROE (Ano Anterior)']
          }
          roic={indicadores['ROIC'] ?? '0'}
          roicAnoAnterior={
            indicadores['ROIC (Y-1)'] ??
            indicadores['ROIC_anterior'] ??
            indicadores['ROIC (Ano Anterior)']
          }
          // Margens e Eficiência
          margemEbitda={indicadores['Margem EBITDA'] ?? '0'}
          margemEbitdaAnoAnterior={
            indicadores['Margem EBITDA (Y-1)'] ?? indicadores['Margem EBITDA_anterior']
          }
          margemBruta={indicadores['Margem Bruta'] ?? '0'}
          margemBrutaAnoAnterior={
            indicadores['Margem Bruta (Y-1)'] ?? indicadores['Margem Bruta_anterior']
          }
          margemLiquida={indicadores['Margem Líquida'] ?? '0'}
          margemLiquidaAnoAnterior={
            indicadores['Margem Líquida (Y-1)'] ?? indicadores['Margem Líquida_anterior']
          }
          margemOperacional={indicadores['Margem Operacional'] ?? '0'}
          margemOperacionalAnoAnterior={
            indicadores['Margem Operacional (Y-1)'] ?? indicadores['Margem Operacional_anterior']
          }
          // Estrutura de Capital e Solvência
          dividaEbitda={indicadores['Dívida/EBITDA'] ?? indicadores['Endividamento'] ?? '0'}
          dividaEbitdaAnoAnterior={
            indicadores['Dívida/EBITDA (Y-1)'] ??
            indicadores['Endividamento (Y-1)'] ??
            indicadores['Dívida/EBITDA_anterior']
          }
          coberturaJuros={indicadores['Cobertura de Juros'] ?? '0'}
          coberturaJurosAnoAnterior={
            indicadores['Cobertura de Juros (Y-1)'] ?? indicadores['Cobertura de Juros_anterior']
          }
          liquidezCorrente={indicadores['Liquidez Corrente'] ?? '0'}
          liquidezCorrenteAnoAnterior={
            indicadores['Liquidez Corrente (Y-1)'] ?? indicadores['Liquidez Corrente_anterior']
          }
          debtEquity={indicadores['Dívida/Patrimônio'] ?? indicadores['Debt/Equity'] ?? '0'}
          debtEquityAnoAnterior={
            indicadores['Dívida/Patrimônio (Y-1)'] ??
            indicadores['Debt/Equity (Y-1)'] ??
            indicadores['Dívida/Patrimônio_anterior']
          }
          // Fluxo de Caixa e Eficiência de Capital
          freeCashFlow={
            indicadores['Free Cash Flow'] ??
            indicadores['Fluxo de Caixa Livre'] ??
            indicadores['FCF'] ??
            '0'
          }
          freeCashFlowAnoAnterior={
            indicadores['Free Cash Flow (Y-1)'] ??
            indicadores['Fluxo de Caixa Livre (Y-1)'] ??
            indicadores['FCF (Y-1)'] ??
            indicadores['Free Cash Flow_anterior']
          }
          capexRevenue={indicadores['CapEx/Receita'] ?? indicadores['CapEx/Revenue'] ?? '0'}
          capexRevenueAnoAnterior={
            indicadores['CapEx/Receita (Y-1)'] ??
            indicadores['CapEx/Revenue (Y-1)'] ??
            indicadores['CapEx/Receita_anterior']
          }
          fcfYield={indicadores['FCF Yield'] ?? '0'}
          fcfYieldAnoAnterior={indicadores['FCF Yield (Y-1)'] ?? indicadores['FCF Yield_anterior']}
          workingCapitalTurnover={
            indicadores['Working Capital Turnover'] ?? indicadores['Giro Capital de Giro'] ?? '0'
          }
          workingCapitalTurnoverAnoAnterior={
            indicadores['Working Capital Turnover (Y-1)'] ??
            indicadores['Giro Capital de Giro (Y-1)'] ??
            indicadores['Working Capital Turnover_anterior']
          }
          // Crescimento e Performance
          crescimentoReceita={
            indicadores['Crescimento Receita'] ?? indicadores['Crescimento da Receita'] ?? '0'
          }
          crescimentoReceitaAnoAnterior={
            indicadores['Crescimento Receita (Y-1)'] ??
            indicadores['Crescimento da Receita (Y-1)'] ??
            indicadores['Crescimento Receita_anterior']
          }
          crescimentoEbitda={indicadores['Crescimento EBITDA'] ?? '0'}
          crescimentoEbitdaAnoAnterior={
            indicadores['Crescimento EBITDA (Y-1)'] ?? indicadores['Crescimento EBITDA_anterior']
          }
          // Dividendos e Retorno
          dividendYield={indicadores['Dividend Yield'] ?? '0'}
          dividendYieldAnoAnterior={
            indicadores['Dividend Yield (Y-1)'] ??
            indicadores['Dividend Yield_anterior'] ??
            indicadores['Dividend Yield (Ano Anterior)']
          }
          payoutRatio={indicadores['Payout Ratio'] ?? '0'}
          payoutRatioAnoAnterior={
            indicadores['Payout Ratio (Y-1)'] ??
            indicadores['Payout Ratio_anterior'] ??
            indicadores['Payout Ratio (Ano Anterior)']
          }
          // Volatilidade e Avaliação
          beta={indicadores['Beta'] ?? '0'}
          betaAnoAnterior={
            indicadores['Beta (Y-1)'] ??
            indicadores['Beta_anterior'] ??
            indicadores['Beta (Ano Anterior)']
          }
          leveredDcf={
            indicadores['Levered DCF'] ??
            indicadores['DCF'] ??
            indicadores['Valuation (DCF)'] ??
            '0'
          }
          leveredDcfAnoAnterior={
            indicadores['Levered DCF (Y-1)'] ??
            indicadores['DCF (Y-1)'] ??
            indicadores['Levered DCF_anterior']
          }
          precoAtual={indicadores['Preço Atual'] ?? indicadores['Preço'] ?? '0'}
          precoAtualAnoAnterior={
            indicadores['Preço Atual (Y-1)'] ??
            indicadores['Preço (Y-1)'] ??
            indicadores['Preço Atual_anterior']
          }
          // Métricas Específicas de Basic Materials (mantidas com padrão original para você ajustar na API)
          inventoryTurnover={indicadores['Inventory Turnover'] ?? indicadores['Giro de Inventário']}
          inventoryTurnoverAnoAnterior={
            indicadores['Inventory Turnover_anterior'] ?? indicadores['Giro de Inventário_anterior']
          }
          assetTurnover={indicadores['Asset Turnover'] ?? indicadores['Giro de Ativos']}
          assetTurnoverAnoAnterior={
            indicadores['Asset Turnover_anterior'] ?? indicadores['Giro de Ativos_anterior']
          }
          capacityUtilization={
            indicadores['Capacity Utilization'] ?? indicadores['Utilização da Capacidade']
          }
          capacityUtilizationAnoAnterior={
            indicadores['Capacity Utilization_anterior'] ??
            indicadores['Utilização da Capacidade_anterior']
          }
        />
      )}
      {setor === 'Utilities' && (
        <RatingsUtilities
          // Múltiplos de Valuation
          pl={indicadores['P/L'] ?? '0'}
          plAnoAnterior={indicadores['P/L (Y-1)'] ?? undefined}
          pb={indicadores['P/VPA'] ?? indicadores['P/B'] ?? '1.5'} // Fallback para P/B se P/VPA não existir
          pbAnoAnterior={indicadores['P/VPA (Y-1)'] ?? indicadores['P/B (Y-1)'] ?? undefined}
          ps={indicadores['P/S'] ?? '0'}
          psAnoAnterior={indicadores['P/S (Y-1)'] ?? undefined}
          earningsYield="0" // Será calculado automaticamente como 1/P/L
          earningsYieldAnoAnterior={undefined}
          // Rentabilidade
          roe={indicadores['ROE'] ?? '0'}
          roeAnoAnterior={indicadores['ROE (Y-1)'] ?? undefined}
          roic={indicadores['ROIC'] ?? '0'} // Se disponível
          roicAnoAnterior={indicadores['ROIC (Y-1)'] ?? undefined}
          margemEbitda={indicadores['Margem EBITDA'] ?? '0'}
          margemEbitdaAnoAnterior={indicadores['Margem EBITDA (Y-1)'] ?? undefined}
          margemOperacional={indicadores['Margem Operacional'] ?? '0'}
          margemOperacionalAnoAnterior={indicadores['Margem Operacional (Y-1)'] ?? undefined}
          margemLiquida={indicadores['Margem Líquida'] ?? '0'}
          margemLiquidaAnoAnterior={indicadores['Margem Líquida (Y-1)'] ?? undefined}
          // Dividendos e Distribuições (usar campos disponíveis ou calcular)
          dividendYield={indicadores['Dividend Yield'] ?? '0'} // Será calculado se não disponível
          dividendYieldAnoAnterior={indicadores['Dividend Yield (Y-1)'] ?? undefined}
          payoutRatio={indicadores['Payout Ratio'] ?? '0'} // Será calculado se não disponível
          payoutRatioAnoAnterior={indicadores['Payout Ratio (Y-1)'] ?? undefined}
          dividendCagr5y={
            indicadores['Dividend CAGR 5Y'] ?? indicadores['CAGR Dividendos 5A'] ?? '0'
          }
          dividendCagr5yAnoAnterior={indicadores['Dividend CAGR 5Y (Y-1)'] ?? undefined}
          // Estrutura Financeira
          endividamento={
            indicadores['Endividamento'] ?? indicadores['Dívida Total/Patrimônio'] ?? '0'
          }
          endividamentoAnoAnterior={indicadores['Endividamento (Y-1)'] ?? undefined}
          debtToEbitda={indicadores['Dívida/EBITDA'] ?? indicadores['Dívida Líquida/EBITDA'] ?? '0'}
          debtToEbitdaAnoAnterior={indicadores['Dívida/EBITDA (Y-1)'] ?? undefined}
          coberturaJuros={indicadores['Cobertura de Juros'] ?? '0'}
          coberturaJurosAnoAnterior={indicadores['Cobertura de Juros (Y-1)'] ?? undefined}
          liquidezCorrente={indicadores['Liquidez Corrente'] ?? '0'}
          liquidezCorrenteAnoAnterior={indicadores['Liquidez Corrente (Y-1)'] ?? undefined}
          // Eficiência Operacional
          giroAtivo={indicadores['Giro do Ativo'] ?? indicadores['Asset Turnover'] ?? '0'}
          giroAtivoAnoAnterior={indicadores['Giro do Ativo (Y-1)'] ?? undefined}
          capexOverRevenue={
            indicadores['CapEx/Receita'] ?? indicadores['Investimentos/Receita'] ?? '0'
          }
          capexOverRevenueAnoAnterior={indicadores['CapEx/Receita (Y-1)'] ?? undefined}
          // Crescimento
          crescimentoReceita={
            indicadores['Crescimento Receita'] ?? indicadores['Crescimento da Receita'] ?? '0'
          }
          crescimentoReceitaAnoAnterior={indicadores['Crescimento Receita (Y-1)'] ?? undefined}
          crescimentoEps={indicadores['Crescimento EPS'] ?? indicadores['CAGR EPS'] ?? '0'}
          crescimentoEpsAnoAnterior={indicadores['Crescimento EPS (Y-1)'] ?? undefined}
          // Valuation vs Fundamentals
          leveredDcf={indicadores['Levered DCF'] ?? indicadores['DCF'] ?? '0'}
          precoAtual={indicadores['Preço Atual'] ?? indicadores['Preço'] ?? '0'}
          fcf={indicadores['Free Cash Flow'] ?? indicadores['FCF'] ?? undefined}
          fcfAnoAnterior={indicadores['Free Cash Flow (Y-1)'] ?? undefined}
        />
      )}
      {setor === 'Communication Services' && (
        <RatingsCommunication
          // Rentabilidade e Retorno
          pe={indicadores['P/L'] ?? '0'}
          peAnoAnterior={
            indicadores['P/L (Y-1)'] ??
            indicadores['P/L_anterior'] ??
            indicadores['P/L (Ano Anterior)']
          }
          ps={indicadores['P/S'] ?? '0'}
          psAnoAnterior={
            indicadores['P/S (Y-1)'] ??
            indicadores['P/S_anterior'] ??
            indicadores['P/S (Ano Anterior)']
          }
          pb={indicadores['P/VPA'] ?? '0'}
          pbAnoAnterior={
            indicadores['P/VPA (Y-1)'] ??
            indicadores['P/VPA_anterior'] ??
            indicadores['P/VPA (Ano Anterior)']
          }
          roe={indicadores['ROE'] ?? '0'}
          roeAnoAnterior={
            indicadores['ROE (Y-1)'] ??
            indicadores['ROE_anterior'] ??
            indicadores['ROE (Ano Anterior)']
          }
          roic={indicadores['ROIC'] ?? '0'}
          roicAnoAnterior={
            indicadores['ROIC (Y-1)'] ??
            indicadores['ROIC_anterior'] ??
            indicadores['ROIC (Ano Anterior)']
          }
          // Margens e Eficiência
          grossMargin={indicadores['Margem Bruta'] ?? '0'}
          grossMarginAnoAnterior={
            indicadores['Margem Bruta (Y-1)'] ?? indicadores['Margem Bruta_anterior']
          }
          ebitdaMargin={indicadores['Margem EBITDA'] ?? '0'}
          ebitdaMarginAnoAnterior={
            indicadores['Margem EBITDA (Y-1)'] ?? indicadores['Margem EBITDA_anterior']
          }
          margemLiquida={indicadores['Margem Líquida'] ?? '0'}
          margemLiquidaAnoAnterior={
            indicadores['Margem Líquida (Y-1)'] ?? indicadores['Margem Líquida_anterior']
          }
          margemOperacional={indicadores['Margem Operacional'] ?? '0'}
          margemOperacionalAnoAnterior={
            indicadores['Margem Operacional (Y-1)'] ?? indicadores['Margem Operacional_anterior']
          }
          // Crescimento e Performance
          receitaCagr3y={
            indicadores['Crescimento da Receita (3Y)'] ??
            indicadores['CAGR Receita 3Y'] ??
            indicadores['Crescimento da Receita'] ??
            '0'
          }
          receitaCagr3yAnoAnterior={
            indicadores['Crescimento da Receita (3Y) (Y-1)'] ??
            indicadores['CAGR Receita 3Y (Y-1)'] ??
            indicadores['Crescimento da Receita_anterior']
          }
          crescimentoReceita={
            indicadores['Crescimento Receita'] ?? indicadores['Crescimento da Receita'] ?? '0'
          }
          crescimentoReceitaAnoAnterior={
            indicadores['Crescimento Receita (Y-1)'] ??
            indicadores['Crescimento da Receita (Y-1)'] ??
            indicadores['Crescimento Receita_anterior']
          }
          crescimentoEbitda={indicadores['Crescimento EBITDA'] ?? '0'}
          crescimentoEbitdaAnoAnterior={
            indicadores['Crescimento EBITDA (Y-1)'] ?? indicadores['Crescimento EBITDA_anterior']
          }
          // Estrutura de Capital e Solvência
          dividaEbitda={indicadores['Dívida/EBITDA'] ?? indicadores['Endividamento'] ?? '0'}
          dividaEbitdaAnoAnterior={
            indicadores['Dívida/EBITDA (Y-1)'] ??
            indicadores['Endividamento (Y-1)'] ??
            indicadores['Dívida/EBITDA_anterior']
          }
          coberturaJuros={indicadores['Cobertura de Juros'] ?? '0'}
          coberturaJurosAnoAnterior={
            indicadores['Cobertura de Juros (Y-1)'] ?? indicadores['Cobertura de Juros_anterior']
          }
          liquidezCorrente={indicadores['Liquidez Corrente'] ?? '0'}
          liquidezCorrenteAnoAnterior={
            indicadores['Liquidez Corrente (Y-1)'] ?? indicadores['Liquidez Corrente_anterior']
          }
          debtEquity={indicadores['Dívida/Patrimônio'] ?? indicadores['Debt/Equity'] ?? '0'}
          debtEquityAnoAnterior={
            indicadores['Dívida/Patrimônio (Y-1)'] ??
            indicadores['Debt/Equity (Y-1)'] ??
            indicadores['Dívida/Patrimônio_anterior']
          }
          // Fluxo de Caixa e Eficiência de Capital
          freeCashFlow={
            indicadores['Free Cash Flow'] ??
            indicadores['Fluxo de Caixa Livre'] ??
            indicadores['FCF'] ??
            '0'
          }
          freeCashFlowAnoAnterior={
            indicadores['Free Cash Flow (Y-1)'] ??
            indicadores['Fluxo de Caixa Livre (Y-1)'] ??
            indicadores['FCF (Y-1)'] ??
            indicadores['Free Cash Flow_anterior']
          }
          fcfYield={indicadores['FCF Yield'] ?? '0'}
          fcfYieldAnoAnterior={indicadores['FCF Yield (Y-1)'] ?? indicadores['FCF Yield_anterior']}
          capexRevenue={indicadores['CapEx/Receita'] ?? indicadores['CapEx/Revenue'] ?? '0'}
          capexRevenueAnoAnterior={
            indicadores['CapEx/Receita (Y-1)'] ??
            indicadores['CapEx/Revenue (Y-1)'] ??
            indicadores['CapEx/Receita_anterior']
          }
          // Dividendos e Retorno
          dividendYield={indicadores['Dividend Yield'] ?? '0'}
          dividendYieldAnoAnterior={
            indicadores['Dividend Yield (Y-1)'] ??
            indicadores['Dividend Yield_anterior'] ??
            indicadores['Dividend Yield (Ano Anterior)']
          }
          payoutRatio={indicadores['Payout Ratio'] ?? '0'}
          payoutRatioAnoAnterior={
            indicadores['Payout Ratio (Y-1)'] ??
            indicadores['Payout Ratio_anterior'] ??
            indicadores['Payout Ratio (Ano Anterior)']
          }
          // Volatilidade e Avaliação
          beta={indicadores['Beta'] ?? '0'}
          betaAnoAnterior={
            indicadores['Beta (Y-1)'] ??
            indicadores['Beta_anterior'] ??
            indicadores['Beta (Ano Anterior)']
          }
          leveredDcf={
            indicadores['Valuation (DCF)'] ??
            indicadores['Levered DCF'] ??
            indicadores['DCF'] ??
            '0'
          }
          leveredDcfAnoAnterior={
            indicadores['Valuation (DCF) (Y-1)'] ??
            indicadores['Levered DCF (Y-1)'] ??
            indicadores['DCF (Y-1)'] ??
            indicadores['Levered DCF_anterior']
          }
          precoAtual={indicadores['Preço Atual'] ?? indicadores['Preço'] ?? '0'}
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
