import { StockData } from '@/features/tools/stocks/types/stocks'
import { IndicatorValue } from '../IndicatorValue'
import { CardBlock } from '../StockCard'

export function ProfitabilitySection({ data }: { data: StockData }) {
  const indicadores = [
    { label: 'EBITDA', value: data.ebitda },
    { label: 'Lucro Líquido', value: data.lucroLiquido },
    {
      label: 'Margem EBITDA',
      value: data.margemEbitda + '%',
      raw: parseFloat(data.margemEbitda),
      check: (v: number) => v > 20,
    },
    {
      label: 'CAGR EPS',
      value: data.cagrEps + '%',
      raw: parseFloat(data.cagrEps),
      check: (v: number) => v > 10,
    },
    {
      label: 'Margem Bruta',
      value: data.margemBruta + '%',
      raw: parseFloat(data.margemBruta),
      check: (v: number) => v > 30,
    },
    {
      label: 'ROE',
      value: data.roe + '%',
      raw: parseFloat(data.roe),
      check: (v: number) => v > 15,
    },
    {
      label: 'ROIC',
      value: data.roic + '%',
      raw: parseFloat(data.roic),
      check: (v: number) => v > 10,
    },
    {
      label: 'Margem Líquida',
      value: data.netProfitMargin + '%',
      raw: parseFloat(data.netProfitMargin),
      check: (v: number) => v > 10,
    },
    {
      label: 'EPS Growth 5Y',
      value: data.epsGrowth5Y + '%',
      raw: parseFloat(data.epsGrowth5Y),
      check: (v: number) => v > 10,
    },
    {
      label: 'EBITDA Growth 5Y',
      value: data.ebitdaGrowth5Y + '%',
      raw: parseFloat(data.ebitdaGrowth5Y),
      check: (v: number) => v > 10,
    },
  ]

  return (
    <CardBlock title="Rentabilidade">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
        {indicadores.map((item) => (
          <div key={item.label} className="flex justify-between items-center">
            <span className="font-semibold">{item.label}:</span>
            <span className="ml-2 flex items-center gap-1">
              {item.value}
              {'raw' in item && item.raw !== undefined && !isNaN(item.raw) && item.check && (
                <IndicatorValue value={item.raw} isGood={item.check} />
              )}
            </span>
          </div>
        ))}
      </div>
    </CardBlock>
  )
}
