import { StockData } from '../../../types/stocks'
import { IndicatorValue } from '../IndicatorValue'
import { CardBlock } from '../StockCard'

export function DividendsSection({ data }: { data: StockData }) {
  const yieldValue = parseFloat(data.dividendYield)
  const dps = parseFloat(data.dividend_pershare)
  const payout = parseFloat(data.payoutRatio)
  const dividendPorMil = ((yieldValue / 100) * 1000).toFixed(2)

  return (
    <CardBlock title="Dividendos">
      <div className="grid grid-cols-[260px_1fr_auto] gap-y-3 items-center text-sm">
        <div className="font-semibold">Dividend Yield:</div>
        <div>{yieldValue.toFixed(2)}%</div>
        <IndicatorValue value={yieldValue} isGood={(v) => v > 2} />

        <div className="font-semibold">Dividend Per Share:</div>
        <div>{dps.toFixed(2)}</div>
        <IndicatorValue value={dps} isGood={(v) => v > 2} />

        <div className="font-semibold">Payout Ratio:</div>
        <div>{payout.toFixed(2)}%</div>
        <IndicatorValue value={payout} isGood={(v) => v >= 30 && v <= 60} />

        <div className="font-semibold">Dividendos por 1000€:</div>
        <div>{dividendPorMil}€</div>
        <div />
      </div>
    </CardBlock>
  )
}
