import { IndicatorValue } from '../IndicatorValue'

interface RatingsCommunicationProps {
  pe: string
  ps: string
  roe: string
  roic: string
  grossMargin: string
  ebitdaMargin: string
  receitaCagr3y: string
}

export function RatingsCommunication({
  pe,
  ps,
  roe,
  roic,
  grossMargin,
  ebitdaMargin,
  receitaCagr3y,
}: RatingsCommunicationProps) {
  const peVal = parseFloat(pe)
  const psVal = parseFloat(ps)
  const roeVal = parseFloat(roe)
  const roicVal = parseFloat(roic)
  const grossVal = parseFloat(grossMargin)
  const ebitdaVal = parseFloat(ebitdaMargin)
  const receitaCagrVal = parseFloat(receitaCagr3y)

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm">
      <p>
        <strong>P/E:</strong> {pe}
        <IndicatorValue value={peVal} isGood={(v) => v > 0 && v < 25} />
      </p>
      <p>
        <strong>P/S:</strong> {ps}
        <IndicatorValue value={psVal} isGood={(v) => v < 4} />
      </p>
      <p>
        <strong>ROE:</strong> {roe}%
        <IndicatorValue value={roeVal} isGood={(v) => v > 15} />
      </p>
      <p>
        <strong>ROIC:</strong> {roic}%
        <IndicatorValue value={roicVal} isGood={(v) => v > 10} />
      </p>
      <p>
        <strong>Margem Bruta:</strong> {grossMargin}%
        <IndicatorValue value={grossVal} isGood={(v) => v > 30} />
      </p>
      <p>
        <strong>Margem EBITDA:</strong> {ebitdaMargin}%
        <IndicatorValue value={ebitdaVal} isGood={(v) => v > 20} />
      </p>
      <p>
        <strong>CAGR Receita 3Y:</strong> {receitaCagr3y}%
        <IndicatorValue value={receitaCagrVal} isGood={(v) => v > 10} />
      </p>
    </div>
  )
}
