import { StockData } from '@/features/tools/stocks/types/stocks'
import { IndicatorValue } from '../IndicatorValue'
import { CardBlock } from '../StockCard'

const DASH = '\u2014'

function trend(current: string | undefined, previous: string | undefined): string {
  const c = parseFloat(current ?? '')
  const p = parseFloat(previous ?? '')
  if (isNaN(c) || isNaN(p) || p === 0) return ''
  return c > p ? ' \u25b2' : c < p ? ' \u25bc' : ''
}

function display(val: string | undefined): string {
  if (!val || val === 'N/A' || val === DASH) return DASH
  return val
}

export function DividendsSection({ data }: { data: StockData }) {
  const ind = data.indicadores ?? {}

  const yieldStr = display(ind['Dividend Yield'])
  const dpsStr = display(ind['Dividendo por Ação'])
  const payoutStr = display(ind['Payout Ratio'])
  const cagrStr = display(ind['Dividend CAGR'])

  // Dividend Yield vem formatado como "2.34%" — parseFloat retorna 2.34
  const yieldRaw = parseFloat(yieldStr)
  const dpsRaw = parseFloat(dpsStr)
  const payoutRaw = parseFloat(payoutStr)
  const cagrRaw = parseFloat(cagrStr)

  // Dividendos por 1000€ investidos: (yield% / 100) * 1000
  const dividendPorMil =
    !isNaN(yieldRaw) && yieldRaw > 0 ? ((yieldRaw / 100) * 1000).toFixed(2) : null

  const items = [
    {
      label: 'Dividend Yield',
      value: yieldStr,
      prev: ind['Dividend Yield (Y-1)'],
      raw: yieldRaw,
      check: (v: number) => v > 2,
    },
    {
      label: 'Dividendo por Ação',
      value: dpsStr,
      prev: ind['Dividendo por Ação (Y-1)'],
      raw: dpsRaw,
      check: (v: number) => v > 0,
    },
    {
      label: 'Payout Ratio',
      value: payoutStr,
      prev: ind['Payout Ratio (Y-1)'],
      raw: payoutRaw,
      check: (v: number) => v >= 30 && v <= 60,
    },
    {
      label: 'Dividend CAGR',
      value: cagrStr,
      prev: ind['Dividend CAGR (Y-1)'],
      raw: cagrRaw,
      check: (v: number) => v > 3,
    },
  ]

  return (
    <CardBlock title="Dividendos">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
        {items.map((item) => {
          const trendStr = item.prev ? trend(item.value, item.prev) : ''
          const showIndicator = !isNaN(item.raw) && item.value !== DASH
          return (
            <div key={item.label} className="flex justify-between items-center">
              <span className="font-semibold">
                {item.label}
                {trendStr}:
              </span>
              <span className="ml-2 flex items-center gap-1">
                {item.value}
                {showIndicator && <IndicatorValue value={item.raw} isGood={item.check!} />}
              </span>
            </div>
          )
        })}

        {dividendPorMil && (
          <div className="flex justify-between items-center sm:col-span-2">
            <span className="font-semibold">Dividendos por 1000€:</span>
            <span className="ml-2">{dividendPorMil}€</span>
          </div>
        )}
      </div>
    </CardBlock>
  )
}
