// components/stocks/sections/ValuationSection.tsx

import { StockData } from '@/features/tools/stocks/types/stocks'
import { IndicatorValue } from '../IndicatorValue'
import { CardBlock } from '../StockCard'
import { ValuationSimulator } from '../detailedAnalysis/valuation/ValuationSimulator'

const DASH = '\u2014'

function MetricRow({
  label,
  value,
  isGood,
  rawValue,
}: {
  label: string
  value: string | undefined
  isGood?: (v: number) => boolean
  rawValue?: number
}) {
  const display = value && value !== '' ? value : DASH
  const showIndicator = isGood && rawValue !== undefined && !isNaN(rawValue)
  return (
    <p>
      <strong>{label}:</strong> {display}
      {showIndicator && <IndicatorValue value={rawValue!} isGood={isGood!} />}
    </p>
  )
}

export function ValuationSection({ data }: { data: StockData }) {
  const ind = data.indicadores ?? {}

  // Lê de indicadores (fonte real) com fallback para campos legados
  const plStr = ind['P/L'] ?? data.pe ?? DASH
  const plY1Str = ind['P/L (Y-1)'] ?? DASH
  const psStr = ind['P/S'] ?? DASH
  const pvpaStr = ind['P/VPA'] ?? DASH
  const pegStr = ind['PEG'] ?? data.pegRatio ?? DASH
  const epsStr = ind['EPS'] ?? data.eps ?? DASH
  const evEbitdaStr = ind['EV/EBITDA'] ?? DASH
  const fcfYieldStr = ind['FCF Yield'] ?? DASH
  const dcfStr = data.dcf ?? DASH

  const pl = parseFloat(plStr)
  const peg = parseFloat(pegStr)
  const eps = parseFloat(epsStr)
  const dcf = parseFloat(dcfStr)
  const preco = data.price ?? 0

  // Trend arrow (▲▼) entre P/L atual e Y-1
  const plY1 = parseFloat(plY1Str)
  const plTrend =
    !isNaN(pl) && !isNaN(plY1) && plY1 > 0 ? (pl < plY1 ? ' ▼' : pl > plY1 ? ' ▲' : '') : ''

  return (
    <CardBlock title="Valorização">
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <MetricRow label="EPS" value={epsStr} isGood={(v) => v > 1} rawValue={eps} />
        <MetricRow
          label={`P/L${plTrend}`}
          value={plStr}
          isGood={(v) => v > 0 && v < 25}
          rawValue={pl}
        />
        <MetricRow label="P/L (Y-1)" value={plY1Str} />
        <MetricRow label="PEG" value={pegStr} isGood={(v) => v > 0 && v < 1} rawValue={peg} />
        <MetricRow label="P/S" value={psStr} />
        <MetricRow label="P/VPA" value={pvpaStr} />
        <MetricRow
          label="EV/EBITDA"
          value={evEbitdaStr}
          isGood={(v) => v > 0 && v < 15}
          rawValue={parseFloat(evEbitdaStr)}
        />
        <MetricRow
          label="FCF Yield"
          value={fcfYieldStr}
          isGood={(v) => v > 3}
          rawValue={parseFloat(fcfYieldStr)}
        />
        <MetricRow label="DCF" value={dcfStr} isGood={(v) => v > preco} rawValue={dcf} />
      </div>

      <ValuationSimulator
        precoAtual={preco}
        defaultFCF={parseFloat(ind['Free Cash Flow'] ?? data.freeCashFlow ?? '0')}
        defaultWACC={parseFloat(data.wacc ?? '0')}
      />
    </CardBlock>
  )
}
