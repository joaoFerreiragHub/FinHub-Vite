import { StockData } from '@/features/tools/stocks/types/stocks'
import { IndicatorValue } from '../IndicatorValue'
import { CardBlock } from '../StockCard'

const DASH = '\u2014'

function trend(current: string | undefined, previous: string | undefined): string {
  const c = parseFloat(current ?? '')
  const p = parseFloat(previous ?? '')
  if (isNaN(c) || isNaN(p) || p === 0) return ''
  return c > p ? ' ▲' : c < p ? ' ▼' : ''
}

function display(val: string | undefined): string {
  if (!val || val === 'N/A' || val === DASH) return DASH
  return val
}

export function FinancialHealthSection({ data }: { data: StockData }) {
  const ind = data.indicadores ?? {}

  const items = [
    {
      label: 'Dívida / Capitais Próprios',
      value: display(ind['Dívida / Capitais Próprios']),
      prev: ind['Dívida / Capitais Próprios (Y-1)'],
      check: (v: number) => v < 1,
    },
    {
      label: 'Liquidez Corrente',
      value: display(ind['Liquidez Corrente']),
      prev: ind['Liquidez Corrente (Y-1)'],
      check: (v: number) => v > 1.5,
    },
    {
      label: 'Cash e Equiv.',
      value: display(ind['Cash e Equiv.']),
      prev: undefined,
      check: undefined,
    },
    {
      label: 'Cobertura de Juros',
      value: display(ind['Cobertura de Juros']),
      prev: ind['Cobertura de Juros (Y-1)'],
      check: (v: number) => v > 3,
    },
    {
      label: 'Cash Flow / CapEx',
      value: display(ind['Cash Flow / CapEx']),
      prev: ind['Cash Flow / CapEx (Y-1)'],
      check: (v: number) => v > 1.5,
    },
    {
      label: 'Free Cash Flow',
      value: display(ind['Free Cash Flow']),
      prev: ind['Free Cash Flow (Y-1)'],
      check: undefined,
    },
  ]

  return (
    <CardBlock title="Saúde Financeira">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
        {items.map((item) => {
          const trendStr = item.prev ? trend(item.value, item.prev) : ''
          const raw = parseFloat(item.value)
          const showIndicator = item.check && !isNaN(raw) && item.value !== DASH
          return (
            <div key={item.label} className="flex justify-between items-center">
              <span className="font-semibold">
                {item.label}
                {trendStr}:
              </span>
              <span className="ml-2 flex items-center gap-1">
                {item.value}
                {showIndicator && <IndicatorValue value={raw} isGood={item.check!} />}
              </span>
            </div>
          )
        })}
      </div>
    </CardBlock>
  )
}
