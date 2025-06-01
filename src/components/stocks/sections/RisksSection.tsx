import { StockData } from '../../../types/stocks'
import { IndicatorValue } from '../IndicatorValue'
import { CardBlock } from '../StockCard'

export function RisksSection({ data }: { data: StockData }) {
  const beta = parseFloat(data.beta)
  const costOfEquity = parseFloat(data.costOfEquity)
  const costOfDebt = parseFloat(data.costOfDebt)
  const effectiveTaxRate = parseFloat(data.effectiveTaxRate)
  const wacc = parseFloat(data.wacc)

  return (
    <CardBlock title="Riscos e Custos">
      <div className="grid grid-cols-[260px_1fr_auto] gap-y-3 items-center text-sm">
        <div className="font-semibold">Risk-Free Rate:</div>
        <div>{data.riskFreeRate}</div>
        <div />

        <div className="font-semibold">Market Risk Premium:</div>
        <div>{data.marketRiskPremium}</div>
        <div />

        <div className="font-semibold">Beta:</div>
        <div>{data.beta}</div>
        <IndicatorValue value={beta} isGood={(v) => v < 1.2} />

        <div className="font-semibold">Cost of Equity:</div>
        <div>{data.costOfEquity}</div>
        <IndicatorValue value={costOfEquity} isGood={(v) => v < 12} />

        <div className="font-semibold">Cost of Debt:</div>
        <div>{data.costOfDebt}</div>
        <IndicatorValue value={costOfDebt} isGood={(v) => v < 5} />

        <div className="font-semibold">Effective Tax Rate:</div>
        <div>{data.effectiveTaxRate}</div>
        <IndicatorValue value={effectiveTaxRate} isGood={(v) => v < 30} />

        <div className="font-semibold">WACC:</div>
        <div>{data.wacc}</div>
        <IndicatorValue value={wacc} isGood={(v) => v < 10} />
      </div>
    </CardBlock>
  )
}
