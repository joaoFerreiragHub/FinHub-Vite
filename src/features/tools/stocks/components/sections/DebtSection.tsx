import { StockData } from '@/features/tools/stocks/types/stocks'
import { IndicatorValue } from '../IndicatorValue'
import { CardBlock } from '../StockCard'

export function DebtSection({ data }: { data: StockData }) {
  const cashRatio = parseFloat(data.cashRatio)
  const debtToEBITDA = parseFloat(data.debtToEBITDA)
  const netDebtToEBITDA = parseFloat(data.netDebtToEBITDA)
  const currentRatio = parseFloat(data.currentRatio)

  return (
    <CardBlock title="Dívida">
      <div className="grid grid-cols-[260px_1fr_auto] gap-y-3 items-center text-sm">
        <div className="font-semibold">Net Debt:</div>
        <div>{data.netDebt}</div>
        <div />

        <div className="font-semibold">Total Debt:</div>
        <div>{data.totalDebt}</div>
        <div />

        <div className="font-semibold">Interest Expense:</div>
        <div>{data.interestExpense}</div>
        <div />

        <div className="font-semibold">Cash Ratio:</div>
        <div>{data.cashRatio}</div>
        <IndicatorValue value={cashRatio} isGood={(v) => v > 0.5} />

        <div className="font-semibold">Debt/EBITDA:</div>
        <div>{data.debtToEBITDA}</div>
        <IndicatorValue value={debtToEBITDA} isGood={(v) => v < 3} />

        <div className="font-semibold">Net Debt/EBITDA:</div>
        <div>{data.netDebtToEBITDA}</div>
        <IndicatorValue value={netDebtToEBITDA} isGood={(v) => v < 3} />

        <div className="font-semibold">Current Ratio:</div>
        <div>{data.currentRatio}</div>
        <IndicatorValue value={currentRatio} isGood={(v) => v > 1.5} />
      </div>
    </CardBlock>
  )
}
