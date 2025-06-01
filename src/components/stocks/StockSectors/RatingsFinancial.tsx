import { IndicatorValue } from '../IndicatorValue'

interface RatingsFinancialsProps {
  roe: string
  eficiencia: string
  basileia: string
  alavancagem: string
  liquidez: string
  inadimplencia: string
  cobertura: string
  pl: string
  pvpa: string
  dividendYield: string
  payoutRatio: string
  ldr: string
  beta: string
  leveredDcf: string
  precoAtual: string

}


export function RatingsFinancials({
  roe,
  eficiencia,
  basileia,
  alavancagem,
  liquidez,
  inadimplencia,
  cobertura,
  pl,
  pvpa,
  dividendYield,
  payoutRatio,
  ldr,
  beta,
  leveredDcf,
  precoAtual,
}: RatingsFinancialsProps) {
  const roeVal = parseFloat(roe)
  const eficienciaVal = parseFloat(eficiencia)
  const basileiaVal = parseFloat(basileia)
  const alavancagemVal = parseFloat(alavancagem)
  const liquidezVal = parseFloat(liquidez)
  const inadimplenciaVal = parseFloat(inadimplencia)
  const coberturaVal = parseFloat(cobertura)
  const plVal = parseFloat(pl)
  const pvpaVal = parseFloat(pvpa)
  const dividendVal = parseFloat(dividendYield)
  const payoutVal = parseFloat(payoutRatio)
  const ldrVal = parseFloat(ldr)
  const betaVal = parseFloat(beta)
  const precoVal = parseFloat(precoAtual)
  const leveredDcfVal = parseFloat(leveredDcf)

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm">
      <p><strong>ROE:</strong> {roe}% <IndicatorValue value={roeVal} isGood={(v) => v > 12} /></p>
      <p><strong>Eficiência:</strong> {eficiencia}% <IndicatorValue value={eficienciaVal} isGood={(v) => v < 55} /></p>
      <p><strong>Basileia:</strong> {basileia}% <IndicatorValue value={basileiaVal} isGood={(v) => v > 11} /></p>
      <p><strong>Alavancagem:</strong> {alavancagem} <IndicatorValue value={alavancagemVal} isGood={(v) => v < 10} /></p>
      <p><strong>Liquidez Corrente:</strong> {liquidez} <IndicatorValue value={liquidezVal} isGood={(v) => v > 1.2} /></p>
      <p><strong>Inadimplência:</strong> {inadimplencia}% <IndicatorValue value={inadimplenciaVal} isGood={(v) => v < 3} /></p>
      <p><strong>Cobertura de Provisões:</strong> {cobertura}% <IndicatorValue value={coberturaVal} isGood={(v) => v > 100} /></p>
      <p><strong>P/L:</strong> {pl} <IndicatorValue value={plVal} isGood={(v) => v > 0 && v < 15} /></p>
      <p><strong>P/VPA:</strong> {pvpa} <IndicatorValue value={pvpaVal} isGood={(v) => v < 2} /></p>
      <p><strong>Valuation (Levered DCF):</strong> {leveredDcfVal} <IndicatorValue value={leveredDcfVal} isGood={(v) => v > precoVal} /></p>


      {dividendVal > 0 && (
        <p><strong>Dividend Yield:</strong> {dividendYield}% <IndicatorValue value={dividendVal} isGood={(v) => v > 2} /></p>
      )}

      {payoutVal > 0 && (
        <p><strong>Payout Ratio:</strong> {payoutRatio}% <IndicatorValue value={payoutVal} isGood={(v) => v > 20 && v < 60} /></p>
      )}

      {ldrVal > 0 && (
        <p><strong>Loan-to-Deposit Ratio:</strong> {ldr}% <IndicatorValue value={ldrVal} isGood={(v) => v > 70 && v < 90} /></p>
      )}

      {beta && (
        <p><strong>Beta:</strong> {beta} <IndicatorValue value={betaVal} isGood={(v) => v > 0.5 && v < 1.5} /></p>
      )}
    </div>
  )
}
