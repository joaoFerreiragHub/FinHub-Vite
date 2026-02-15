import { StockData } from '@/features/tools/stocks/types/stocks'
import { IndicatorValue } from '../IndicatorValue'
import { CardBlock } from '../StockCard'

export function FinancialHealthSection({ data }: { data: StockData }) {
  const debtEquity = parseFloat(data.debtToEquity)
  const currentRatio = parseFloat(data.currentRatio)
  const interestCoverage = parseFloat(data.interestCoverage)

  return (
    <CardBlock title="Saúde Financeira">
      <div className="grid grid-cols-[260px_1fr_auto] gap-y-3 items-center text-sm">
        <div className="font-semibold">Debt to Equity:</div>
        <div>{data.debtToEquity}</div>
        <IndicatorValue value={debtEquity} isGood={(v) => v < 1} />

        <div className="font-semibold">Current Ratio:</div>
        <div>{data.currentRatio}</div>
        <IndicatorValue value={currentRatio} isGood={(v) => v > 1.5} />

        <div className="font-semibold">Cash:</div>
        <div>{data.cash}€</div>
        <div />

        <div className="font-semibold">Interest Coverage:</div>
        <div>{data.interestCoverage}</div>
        <IndicatorValue value={interestCoverage} isGood={(v) => v > 3} />
      </div>
    </CardBlock>
  )
}
