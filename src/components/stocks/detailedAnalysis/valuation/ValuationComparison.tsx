
import { ArrowDown, ArrowUp } from 'lucide-react'
import { Badge } from '../../../ui/badge'
import { Card, CardContent } from '../../../ui/card'

interface ValuationComparisonProps {
  valuation: number
  currentPrice: number
}

export function ValuationComparison({ valuation, currentPrice }: ValuationComparisonProps) {
  const difference = valuation - currentPrice
  const percent = (difference / currentPrice) * 100
  const isUndervalued = difference > 0

  const statusColor = isUndervalued ? 'text-green-600' : 'text-red-600'
  const badgeColor = isUndervalued ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <h2 className="text-lg font-semibold">📊 Comparação de Valuation</h2>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <p>
              <strong>Valuation estimado:</strong>{' '}
              <span className="text-foreground font-bold">
                {valuation.toLocaleString('pt-PT', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </span>
            </p>

            <p>
              <strong>Preço atual:</strong>{' '}
              <span className="text-muted-foreground">
                {currentPrice.toLocaleString('pt-PT', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={badgeColor}>
              {isUndervalued ? (
                <>
                  <ArrowUp className="w-4 h-4 mr-1" /> Subvalorizada
                </>
              ) : (
                <>
                  <ArrowDown className="w-4 h-4 mr-1" /> Sobrevalorizada
                </>
              )}
            </Badge>
            <span className={`font-semibold ${statusColor}`}>
              {Math.abs(percent).toFixed(1)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
