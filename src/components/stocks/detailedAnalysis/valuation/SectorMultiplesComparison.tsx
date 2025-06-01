
import { ArrowDown, ArrowUp } from 'lucide-react'
import { Card, CardContent } from '../../../ui/card'
import { cn } from '../../../../lib/utils'


interface Multiples {
  pe: number
  ps: number
  pb: number
  evEbitda: number
  roe: number
  ebitdaMargin: number
}

interface SectorMultiplesComparisonProps {
  company: Multiples
  sector: Multiples
}

export function SectorMultiplesComparison({ company, sector }: SectorMultiplesComparisonProps) {
  const entries = [
    { label: 'P/E', value: company.pe, sector: sector.pe },
    { label: 'P/S', value: company.ps, sector: sector.ps },
    { label: 'P/B', value: company.pb, sector: sector.pb },
    { label: 'EV/EBITDA', value: company.evEbitda, sector: sector.evEbitda },
    { label: 'ROE', value: company.roe, sector: sector.roe, isBetterIfHigher: true },
    { label: 'Margem EBITDA', value: company.ebitdaMargin, sector: sector.ebitdaMargin, isBetterIfHigher: true },
  ]

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <h2 className="text-lg font-semibold">📐 Comparação com o Setor</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {entries.map(({ label, value, sector, isBetterIfHigher }) => {
            const diff = ((value - sector) / sector) * 100
            const isBetter = isBetterIfHigher ? diff > 0 : diff < 0
            const color = isBetter ? 'text-green-600' : 'text-red-600'
            const Icon = isBetter ? ArrowUp : ArrowDown

            return (
              <div key={label} className="bg-muted rounded-lg p-4 shadow-sm">
                <div className="text-sm text-muted-foreground">{label}</div>
                <div className="text-xl font-bold">
                  {value.toFixed(1)}{' '}
                  <span className="text-sm text-muted-foreground">vs {sector.toFixed(1)}</span>
                </div>
                <div className={cn('flex items-center gap-1 mt-1', color)}>
                  <Icon className="w-4 h-4" />
                  <span>{Math.abs(diff).toFixed(1)}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
