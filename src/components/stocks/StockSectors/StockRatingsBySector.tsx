import { RatingsBasicMaterials } from "./RatingsBasicMaterials"
import { RatingsConsumerCyclical } from "./RatingsConsumerCyclical"
import { RatingsConsumerDefensive } from "./RatingsConsumerDefensive"
import { RatingsEnergy } from "./RatingsEnergy"
import { RatingsFinancials } from "./RatingsFinancial"
import { RatingsHealthcare } from "./RatingsHealth"
import { RatingsIndustrials } from "./RatingsIndustrials"
import { RatingsREITs } from "./RatingsREIT"
import { RatingsTech } from "./RatingsTech"
import { RatingsUtilities } from "./RatingsUtilities"


interface StockRatingsBySectorProps {
  setor: string
  indicadores: Record<string, string>
}

export function StockRatingsBySector({ setor, indicadores }: StockRatingsBySectorProps) {
  console.log('StockRatingsBySector', { setor, indicadores })
  return (
    <>
    {setor === 'Saúde' && (
      <RatingsHealthcare
        investimentoPD={indicadores['Investimento em P&D'] ?? '0'}
        margemBruta={indicadores['Margem Bruta'] ?? '0'}
        margemEbitda={indicadores['Margem EBITDA'] ?? '0'}
        margemLiquida={indicadores['Margem Líquida'] ?? '0'}
        roic={indicadores['ROIC'] ?? '0'}
        roe={indicadores['ROE'] ?? '0'}
        pl={indicadores['P/L'] ?? '0'}
        ps={indicadores['P/S'] ?? '0'}
        debtToEbitda={indicadores['Dívida/EBITDA'] ?? '0'}
        liquidezCorrente={indicadores['Liquidez Corrente'] ?? '0'}
        cagrEps={indicadores['CAGR EPS'] ?? '0'}
        eps={indicadores['EPS'] ?? '0'}
        beta={indicadores['Beta'] ?? '0'}
      />
    )}

    {setor === 'Tecnologia' && (
      <RatingsTech
        crescimentoReceita={indicadores['Crescimento da Receita'] ?? '0'}
        cagrEps={indicadores['CAGR EPS'] ?? '0'}
        eps={indicadores['EPS'] ?? '0'}
        margemBruta={indicadores['Margem Bruta'] ?? '0'}
        margemEbitda={indicadores['Margem EBITDA'] ?? '0'}
        margemLiquida={indicadores['Margem Líquida'] ?? '0'}
        roic={indicadores['ROIC'] ?? '0'}
        roe={indicadores['ROE'] ?? '0'}
        pl={indicadores['P/L'] ?? '0'}
        ps={indicadores['P/S'] ?? '0'}
        peg={indicadores['PEG'] ?? '0'}
        debtToEbitda={indicadores['Dívida/EBITDA'] ?? '0'}
        liquidezCorrente={indicadores['Liquidez Corrente'] ?? '0'}
        cashRatio={indicadores['Cash Ratio'] ?? '0'}
        beta={indicadores['Beta'] ?? '0'}
      />
    )}

  {setor === 'Bancos' && indicadores['ROE'] && (
    <RatingsFinancials
  roe={indicadores['ROE'] ?? '0'}
  eficiencia={indicadores['Índice de Eficiência'] ?? '0'}
  basileia={indicadores['Índice de Basileia'] ?? '0'}
  alavancagem={indicadores['Alavancagem Financeira'] ?? '0'}
  liquidez={indicadores['Liquidez Corrente'] ?? '0'}
  inadimplencia={indicadores['Índice de Inadimplência'] ?? '0'}
  cobertura={indicadores['Cobertura de Provisões'] ?? '0'}
  pl={indicadores['P/L'] ?? '0'}
  pvpa={indicadores['P/VPA'] ?? '0'}
  dividendYield={indicadores['Dividend Yield'] ?? '0'}
  payoutRatio={indicadores['Payout Ratio'] ?? '0'}
  ldr={indicadores['Loan-to-Deposit Ratio'] ?? '0'}
  beta={indicadores['Beta'] ?? '0'}
  precoAtual={indicadores['Preço Atual'] ?? '0'}
  leveredDcf={indicadores['Levered DCF'] ?? '0'}
/>


  )}

{setor === 'REITs' && indicadores['Dividend Yield'] && (
  <RatingsREITs
    dividendYield={indicadores['Dividend Yield'] ?? '0'}
    pVpa={indicadores['P/VPA'] ?? '0'}
    ocupacao={indicadores['Taxa de Ocupação'] ?? '0'}
    capRate={indicadores['Cap Rate'] ?? '0'}
    coberturaJuros={indicadores['Cobertura de Juros'] ?? '0'}
    dividaEbitda={indicadores['Dívida Líquida/EBITDA'] ?? '0'}
    ffo={indicadores['FFO'] ?? '0'}
    affo={indicadores['AFFO'] ?? '0'}
    pFfo={indicadores['P/FFO'] ?? '0'}
    ffoPayoutRatio={indicadores['FFO Payout Ratio'] ?? '0'}
    dividendCagr5y={indicadores['Dividend CAGR 5Y'] ?? '0'}
    precoAtual={indicadores['Preço Atual'] ?? '0'}
    leveredDcf={indicadores['Levered DCF'] ?? '0'}
  />
)}


{setor === 'Bens de Consumo' && indicadores['Margem Bruta'] && (
  <RatingsConsumerDefensive
    pe={indicadores['P/L'] ?? '0'}
    pb={indicadores['P/VPA'] ?? '0'}
    ps={indicadores['P/S'] ?? '0'}
    roe={indicadores['ROE'] ?? '0'}
    grossMargin={indicadores['Margem Bruta'] ?? '0'}
    ebitdaMargin={indicadores['Margem EBITDA'] ?? '0'}
    receitaCagr3y={indicadores['Crescimento da Receita'] ?? '0'}
    payoutRatio={indicadores['Payout Ratio'] ?? '0'}
    dividendYield={indicadores['Dividend Yield'] ?? '0'}
    beta={indicadores['Beta'] ?? '0'}
  />
)}



{setor === 'Indústria' && indicadores['Margem EBITDA'] && (
  <RatingsIndustrials
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
  />
)}



{setor === 'Energia' && indicadores['Margem EBITDA'] && (
  <RatingsEnergy
    pe={indicadores['P/L'] ?? '0'}
    pb={indicadores['P/VPA'] ?? '0'}
    ebitdaMargin={indicadores['Margem EBITDA'] ?? '0'}
    endividamento={indicadores['Endividamento'] ?? '0'}
    coberturaJuros={indicadores['Cobertura de Juros'] ?? '0'}
    liquidezCorrente={indicadores['Liquidez Corrente'] ?? '0'}
    dividendYield={indicadores['Dividend Yield'] ?? '0'}
    roic={indicadores['ROIC'] ?? '0'}
    freeCashFlow={indicadores['Fluxo de Caixa Livre'] ?? '0'}
    beta={indicadores['Beta'] ?? '0'}
    precoAtual={indicadores['Preço Atual'] ?? '0'}
    leveredDcf={indicadores['Levered DCF'] ?? '0'}
  />
)}



{(setor === 'Construção' || setor === 'Consumo Cíclico') && indicadores['P/L'] && (
  <RatingsConsumerCyclical
    pe={indicadores['P/L'] ?? '0'}
    ps={indicadores['P/S'] ?? '0'}
    pb={indicadores['P/VPA'] ?? '0'}
    roe={indicadores['ROE'] ?? '0'}
    grossMargin={indicadores['Margem Bruta'] ?? '0'}
    ebitdaMargin={indicadores['Margem EBITDA'] ?? '0'}
    endividamento={indicadores['Endividamento'] ?? '0'}
    liquidezCorrente={indicadores['Liquidez Corrente'] ?? '0'}
    rotatividadeEstoques={indicadores['Rotatividade de Estoques'] ?? '0'}
    receitaCagr3y={indicadores['Crescimento da Receita'] ?? '0'}
  />
)}



<div className={setor === 'Materiais Básicos' ? '' : 'hidden'}>
  <RatingsBasicMaterials
    pe={indicadores['P/L'] ?? '0'}
    pb={indicadores['P/VPA'] ?? '0'}
    roic={indicadores['ROIC'] ?? '0'}
    ebitdaMargin={indicadores['Margem EBITDA'] ?? '0'}
  />
</div>



<div className={setor === 'Utilities' ? '' : 'hidden'}>
  <RatingsUtilities
    pl={indicadores['P/L'] ?? '0'}
    roe={indicadores['ROE'] ?? '0'}
    margemEbitda={indicadores['Margem EBITDA'] ?? '0'}
    endividamento={indicadores['Endividamento'] ?? '0'}
    coberturaJuros={indicadores['Cobertura de Juros'] ?? '0'}
    precoAtual={indicadores['Preço Atual'] ?? '0'} // <-- adicionar este
    leveredDcf={indicadores['Levered DCF'] ?? '0'} // <-- e este
  />
</div>


    </>
  )
}
