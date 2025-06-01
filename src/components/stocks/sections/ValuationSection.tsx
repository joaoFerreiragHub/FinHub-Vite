// components/stocks/sections/ValuationSection.tsx

import { StockData } from "../../../types/stocks"
import { IndicatorValue } from "../IndicatorValue"
import { CardBlock } from "../StockCard"
import { ValuationSimulator } from "../detailedAnalysis/valuation/ValuationSimulator"

export function ValuationSection({ data }: { data: StockData }) {
  const eps = parseFloat(data.eps)
  const pe = parseFloat(data.pe)
  const peg = parseFloat(data.pegRatio)
  const dcf = parseFloat(data.dcf)
  const preco = parseFloat(data.preco)

  return (
    <CardBlock title="Valorização">
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <p><strong>EPS:</strong> {data.eps} <IndicatorValue value={eps} isGood={(v) => v > 1} /></p>
        <p><strong>P/E Ratio:</strong> {data.pe} <IndicatorValue value={pe} isGood={(v) => v < 25} /></p>
        <p><strong>PEG Ratio:</strong> {data.pegRatio} <IndicatorValue value={peg} isGood={(v) => v < 1} /></p>
        <p><strong>DCF:</strong> {data.dcf} <IndicatorValue value={dcf} isGood={(v) => v > preco} /></p>
      </div>

        {/* Novo componente de simulação */}
        <ValuationSimulator
          precoAtual={preco}
          defaultFCF={parseFloat(data.freeCashFlow)}
          defaultWACC={parseFloat(data.wacc)}
        />
    </CardBlock>
  )
}
