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

export function DebtSection({ data }: { data: StockData }) {
  const ind = data.indicadores ?? {}

  const items = [
    {
      label: 'Net Debt',
      value: display(ind['Net Debt']),
      prev: undefined,
      check: undefined,
    },
    {
      label: 'Total Dívida',
      value: display(ind['Total Dívida']),
      prev: undefined,
      check: undefined,
    },
    {
      label: 'Cash e Equiv.',
      value: display(ind['Cash e Equiv.']),
      prev: undefined,
      check: undefined,
    },
    {
      label: 'Despesa de Juros',
      value: display(ind['Despesa de Juros']),
      prev: undefined,
      check: undefined,
    },
    {
      label: 'Cash Ratio',
      value: display(ind['Cash Ratio']),
      prev: ind['Cash Ratio (Y-1)'],
      check: (v: number) => v > 0.5,
    },
    {
      label: 'Dívida/EBITDA',
      value: display(ind['Dívida/EBITDA']),
      prev: ind['Dívida/EBITDA (Y-1)'],
      check: (v: number) => v < 3,
    },
    {
      label: 'Liquidez Corrente',
      value: display(ind['Liquidez Corrente']),
      prev: ind['Liquidez Corrente (Y-1)'],
      check: (v: number) => v > 1.5,
    },
    {
      label: 'Cobertura de Juros',
      value: display(ind['Cobertura de Juros']),
      prev: ind['Cobertura de Juros (Y-1)'],
      check: (v: number) => v > 3,
    },
  ]

  return (
    <CardBlock title="Dívida">
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
