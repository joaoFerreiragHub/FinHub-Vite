import { IndicatorValue } from '../IndicatorValue'

interface RatingsConsumerDefensiveProps {
  pe: string
  pb: string
  ps: string
  roe: string
  grossMargin: string
  ebitdaMargin: string
  receitaCagr3y: string
  payoutRatio: string
  dividendYield: string
  beta: string
}

export function RatingsConsumerDefensive({
  pe,
  pb,
  ps,
  roe,
  grossMargin,
  ebitdaMargin,
  receitaCagr3y,
  payoutRatio,
  dividendYield,
  beta,
}: RatingsConsumerDefensiveProps) {
  const peVal = parseFloat(pe)
  const pbVal = parseFloat(pb)
  const psVal = parseFloat(ps)
  const roeVal = parseFloat(roe)
  const grossVal = parseFloat(grossMargin)
  const ebitdaVal = parseFloat(ebitdaMargin)
  const receitaCagrVal = parseFloat(receitaCagr3y)
  const payoutVal = parseFloat(payoutRatio)
  const dividendVal = parseFloat(dividendYield)
  const betaVal = parseFloat(beta)

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm">
      <p><strong>P/E:</strong> {pe} <IndicatorValue value={peVal} isGood={(v) => v > 0 && v < 22} /></p>
      <p><strong>P/B:</strong> {pb} <IndicatorValue value={pbVal} isGood={(v) => v < 3} /></p>
      <p><strong>P/S:</strong> {ps} <IndicatorValue value={psVal} isGood={(v) => v < 4} /></p>
      <p><strong>ROE:</strong> {roe}% <IndicatorValue value={roeVal} isGood={(v) => v > 15} /></p>
      <p><strong>Margem Bruta:</strong> {grossMargin}% <IndicatorValue value={grossVal} isGood={(v) => v > 30} /></p>
      <p><strong>Margem EBITDA:</strong> {ebitdaMargin}% <IndicatorValue value={ebitdaVal} isGood={(v) => v > 15} /></p>
      <p><strong>CAGR Receita 3Y:</strong> {receitaCagr3y}% <IndicatorValue value={receitaCagrVal} isGood={(v) => v > 7} /></p>
      <p><strong>Payout Ratio:</strong> {payoutRatio}% <IndicatorValue value={payoutVal} isGood={(v) => v > 0 && v < 70} /></p>
      <p><strong>Dividend Yield:</strong> {dividendYield}% <IndicatorValue value={dividendVal} isGood={(v) => v > 3} /></p>
      <p><strong>Beta:</strong> {beta} <IndicatorValue value={betaVal} isGood={(v) => v < 1} /></p>
    </div>
  )
}
