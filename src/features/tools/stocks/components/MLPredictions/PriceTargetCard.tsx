import { ChevronDown, ChevronUp, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Progress } from '@/components/ui'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PriceTargetCard({ data, expanded, onToggle, getUpsideColor }: any) {
  const priceTarget = data.priceTarget

  return (
    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader className="cursor-pointer" onClick={onToggle}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span>Price Target 3M</span>
          </div>
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </CardTitle>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-4">
          {/* Price Summary */}
          <div className="bg-white rounded-lg p-4 border border-green-100">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Preço Atual</div>
                <div className="text-lg font-bold">${priceTarget.current}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Target IA</div>
                <div className="text-lg font-bold text-green-600">${priceTarget.target3M}</div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Upside Potencial</span>
                <span className={`text-xl font-bold ${getUpsideColor(priceTarget.upside)}`}>
                  {priceTarget.upside > 0 ? '+' : ''}
                  {priceTarget?.upside?.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Price Scenarios */}
          <div>
            <h4 className="font-semibold mb-3">Cenários de Preço</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">🔴 Pessimista</span>
                <span className="text-red-500 font-medium">${priceTarget.range.low}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">🟡 Base Case</span>
                <span className="text-green-600 font-medium">${priceTarget.target3M}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">🟢 Otimista</span>
                <span className="text-green-600 font-medium">${priceTarget.range.high}</span>
              </div>
            </div>
          </div>

          {/* Enhanced Probability Distribution */}
          <div>
            <h4 className="font-semibold mb-3">Distribuição de Probabilidade</h4>
            <div className="space-y-3">
              {priceTarget.probabilityDistribution.map(
                (dist: { range: string; prob: number }, idx: number) => (
                  <div key={idx} className="bg-white rounded-lg p-3 border border-green-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{dist.range}</span>
                      <span className="text-sm font-bold text-green-600">{dist.prob}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2 relative overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${dist.prob}%` }}
                      ></div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Confidence */}
          <div className="bg-white rounded-lg p-3 border border-green-100">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Confiança do Target</span>
              <span className="text-sm font-medium text-green-600">{priceTarget.confidence}%</span>
            </div>
            <Progress value={priceTarget.confidence} className="h-2" />
          </div>
        </CardContent>
      )}
    </Card>
  )
}
