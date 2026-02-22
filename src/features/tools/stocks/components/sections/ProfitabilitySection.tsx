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

export function ProfitabilitySection({ data }: { data: StockData }) {
  const ind = data.indicadores ?? {}

  const items = [
    {
      label: 'EBITDA',
      value: ind['Margem EBITDA'] ?? data.margemEbitda ?? DASH,
      prev: ind['Margem EBITDA (Y-1)'],
      raw: parseFloat(ind['Margem EBITDA'] ?? data.margemEbitda ?? ''),
      check: (v: number) => v > 20,
      isPercent: true,
    },
    {
      label: 'Margem Bruta',
      value: ind['Margem Bruta'] ?? data.margemBruta ?? DASH,
      prev: ind['Margem Bruta (Y-1)'],
      raw: parseFloat(ind['Margem Bruta'] ?? data.margemBruta ?? ''),
      check: (v: number) => v > 30,
      isPercent: true,
    },
    {
      label: 'Margem Líquida',
      value: ind['Margem Líquida'] ?? ind['Margem Liquida'] ?? data.netProfitMargin ?? DASH,
      prev: ind['Margem Líquida (Y-1)'] ?? ind['Margem Liquida (Y-1)'],
      raw: parseFloat(ind['Margem Líquida'] ?? ind['Margem Liquida'] ?? data.netProfitMargin ?? ''),
      check: (v: number) => v > 10,
      isPercent: true,
    },
    {
      label: 'Margem Operacional',
      value: ind['Margem Operacional'] ?? DASH,
      prev: ind['Margem Operacional (Y-1)'],
      raw: parseFloat(ind['Margem Operacional'] ?? ''),
      check: (v: number) => v > 10,
      isPercent: true,
    },
    {
      label: 'ROE',
      value: ind['ROE'] ?? data.roe ?? DASH,
      prev: ind['ROE (Y-1)'],
      raw: parseFloat(ind['ROE'] ?? data.roe ?? ''),
      check: (v: number) => v > 15,
      isPercent: true,
    },
    {
      label: 'ROA',
      value: ind['ROA'] ?? DASH,
      prev: ind['ROA (Y-1)'],
      raw: parseFloat(ind['ROA'] ?? ''),
      check: (v: number) => v > 5,
      isPercent: true,
    },
    {
      label: 'ROIC',
      value: ind['ROIC'] ?? data.roic ?? DASH,
      prev: ind['ROIC (Y-1)'],
      raw: parseFloat(ind['ROIC'] ?? data.roic ?? ''),
      check: (v: number) => v > 10,
      isPercent: true,
    },
    {
      label: 'CAGR EPS',
      value: ind['CAGR EPS'] ?? DASH,
      prev: ind['CAGR EPS (Y-1)'],
      raw: parseFloat(ind['CAGR EPS'] ?? ''),
      check: (v: number) => v > 10,
      isPercent: true,
    },
    {
      label: 'Crescimento Receita',
      value: ind['Crescimento Receita'] ?? DASH,
      prev: ind['Crescimento Receita (Y-1)'],
      raw: parseFloat(ind['Crescimento Receita'] ?? ''),
      check: (v: number) => v > 8,
      isPercent: true,
    },
  ]

  return (
    <CardBlock title="Rentabilidade & Retornos">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
        {items.map((item) => {
          const trendStr = trend(item.value, item.prev)
          const showIndicator = !isNaN(item.raw) && item.value !== DASH
          return (
            <div key={item.label} className="flex justify-between items-center">
              <span className="font-semibold">
                {item.label}
                {trendStr}:
              </span>
              <span className="ml-2 flex items-center gap-1">
                {item.value !== DASH ? item.value : DASH}
                {showIndicator && <IndicatorValue value={item.raw} isGood={item.check!} />}
              </span>
            </div>
          )
        })}
      </div>
    </CardBlock>
  )
}
