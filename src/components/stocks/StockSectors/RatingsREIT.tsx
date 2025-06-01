import { IndicatorValue } from '../IndicatorValue'

interface RatingsREITsProps {
  dividendYield: string
  pVpa: string
  ocupacao: string
  capRate: string
  coberturaJuros: string
  dividaEbitda: string
  ffo: string
  affo: string
  pFfo: string
  ffoPayoutRatio: string
  dividendCagr5y: string
  precoAtual: string
leveredDcf: string
}

export function RatingsREITs({
  dividendYield,
  pVpa,
  ocupacao,
  capRate,
  coberturaJuros,
  dividaEbitda,
  ffo,
  affo,
  pFfo,
  ffoPayoutRatio,
  dividendCagr5y,
  precoAtual,
  leveredDcf,
}: RatingsREITsProps) {
  const dividendYieldVal = parseFloat(dividendYield)
  const pVpaVal = parseFloat(pVpa)
  const ocupacaoVal = parseFloat(ocupacao)
  const capRateVal = parseFloat(capRate)
  const coberturaJurosVal = parseFloat(coberturaJuros)
  const dividaEbitdaVal = parseFloat(dividaEbitda)
  const ffoVal = parseFloat(ffo)
  const affoVal = parseFloat(affo)
  const pFfoVal = parseFloat(pFfo)
  const ffoPayoutVal = parseFloat(ffoPayoutRatio)
  const dividendCagrVal = parseFloat(dividendCagr5y)
  const precoVal = parseFloat(precoAtual)
  const leveredDcfVal = parseFloat(leveredDcf)

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm">
      <p><strong>Dividend Yield:</strong> {dividendYield}% <IndicatorValue value={dividendYieldVal} isGood={(v) => v > 6} /></p>
      <p><strong>P/VPA:</strong> {pVpa} <IndicatorValue value={pVpaVal} isGood={(v) => v < 1.2} /></p>
      <p><strong>Taxa de Ocupação:</strong> {ocupacao}% <IndicatorValue value={ocupacaoVal} isGood={(v) => v > 90} /></p>
      <p><strong>Cap Rate:</strong> {capRate}% <IndicatorValue value={capRateVal} isGood={(v) => v > 6} /></p>
      <p><strong>Cobertura de Juros:</strong> {coberturaJuros} <IndicatorValue value={coberturaJurosVal} isGood={(v) => v > 1.5} /></p>
      <p><strong>Dívida Líquida / EBITDA:</strong> {dividaEbitda} <IndicatorValue value={dividaEbitdaVal} isGood={(v) => v < 3} /></p>
      <p><strong>FFO:</strong> {ffo} <IndicatorValue value={ffoVal} isGood={(v) => v > 0} /></p>
      <p><strong>AFFO:</strong> {affo} <IndicatorValue value={affoVal} isGood={(v) => v > 0} /></p>
      <p><strong>P/FFO:</strong> {pFfo} <IndicatorValue value={pFfoVal} isGood={(v) => v < 15} /></p>
      <p><strong>FFO Payout Ratio:</strong> {ffoPayoutRatio}% <IndicatorValue value={ffoPayoutVal} isGood={(v) => v > 0 && v < 90} /></p>
      <p><strong>CAGR Dividendos 5Y:</strong> {dividendCagr5y}% <IndicatorValue value={dividendCagrVal} isGood={(v) => v > 2} /></p>
      <p><strong>Levered DCF:</strong> {leveredDcf} <IndicatorValue value={leveredDcfVal} isGood={(v) => v > precoVal} /></p>


    </div>
  )
}
