import { StockData } from '@/features/tools/stocks/types/stocks'
import { CardBlock } from '../StockCard'
import { IndicatorValue } from '../IndicatorValue'

const DASH = '\u2014'

function trend(current: string | undefined, previous: string | undefined): string {
  const c = parseFloat(current ?? '')
  const p = parseFloat(previous ?? '')
  if (isNaN(c) || isNaN(p) || p === 0) return ''
  return c > p ? ' ▲' : c < p ? ' ▼' : ''
}

export function GrowthSection({ data }: { data: StockData }) {
  const ind = data.indicadores ?? {}

  const items = [
    {
      label: 'CAGR EPS',
      value: ind['CAGR EPS'] ?? DASH,
      prev: ind['CAGR EPS (Y-1)'],
      check: (v: number) => v > 10,
    },
    {
      label: 'Crescimento Receita',
      value: ind['Crescimento Receita'] ?? DASH,
      prev: ind['Crescimento Receita (Y-1)'],
      check: (v: number) => v > 8,
    },
    {
      label: 'Crescimento Carteira',
      value: ind['Crescimento Carteira'] ?? DASH,
      prev: ind['Crescimento Carteira (Y-1)'],
      check: (v: number) => v > 5,
    },
    {
      label: 'EPS (Y-1)',
      value: ind['EPS (Y-1)'] ?? DASH,
      prev: undefined,
      check: (v: number) => v > 0,
    },
    {
      label: 'EPS Atual',
      value: ind['EPS'] ?? DASH,
      prev: ind['EPS (Y-1)'],
      check: (v: number) => v > 0,
    },
    {
      label: 'Dividend CAGR',
      value: ind['Dividend CAGR'] ?? DASH,
      prev: ind['Dividend CAGR (Y-1)'],
      check: (v: number) => v > 3,
    },
  ]

  return (
    <CardBlock title="Crescimento">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
        {items.map((item) => {
          const trendStr = trend(item.value, item.prev)
          const raw = parseFloat(item.value)
          const showIndicator = !isNaN(raw) && item.value !== DASH
          return (
            <div key={item.label} className="flex justify-between items-center">
              <span className="font-semibold">
                {item.label}
                {trendStr}:
              </span>
              <span className="ml-2 flex items-center gap-1">
                {item.value !== DASH ? item.value : DASH}
                {showIndicator && <IndicatorValue value={raw} isGood={item.check!} />}
              </span>
            </div>
          )
        })}
      </div>
    </CardBlock>
  )
}
