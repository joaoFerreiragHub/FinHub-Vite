import { BarChart3, ChevronDown, ChevronUp, Target, TrendingUp, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Progress } from "../../ui/progress"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function EarningsCard({ data, earningsOnly, expanded, onToggle, getConfidenceColor }: any) {
  const earnings = data?.earnings || earningsOnly
  if (!earnings) return null

  const surprise = earnings.surprise || earnings.earningsSurprise || 0
  const confidence = earnings.confidence || earnings.nextQuarter?.confidence || 0
  const drivers = earnings.drivers || earnings.nextQuarter?.drivers || []

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
      <CardHeader className="cursor-pointer" onClick={onToggle}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-purple-600" />
            <span>Previsão de Earnings</span>
          </div>
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </CardTitle>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-4">
          {/* Main Prediction */}
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Próximo Quarter</span>
              <div className="flex items-center space-x-1">
                <Zap className="w-4 h-4 text-green-500" />
                <span className={`text-sm font-medium ${getConfidenceColor(confidence)}`}>
                  {confidence}% confiança
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-green-500" />
              <span className="text-2xl font-bold text-green-600">
                {surprise > 0 ? '+' : ''}{surprise.toFixed(1)}%
              </span>
              <span className="text-gray-500">vs estimativas</span>
            </div>
          </div>

          {/* Drivers */}
          {drivers.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Principais Drivers
              </h4>
              <div className="space-y-2">
                {drivers.map((driver: string, idx: number) => (
                  <div key={idx} className="flex items-center p-2 bg-white rounded border border-purple-100">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm">{driver}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Earnings Trend */}
          {data?.earnings?.trend && (
            <div>
              <h4 className="font-semibold mb-3">Tendência (4 Quarters)</h4>
              <div className="grid grid-cols-4 gap-2">
                {data.earnings.trend.map((value: number | null, idx: number) => (
                  <div key={idx} className="bg-white rounded p-3 text-center border border-purple-100">
                    <div className="text-xs text-gray-500">Q{idx + 1}</div>
                    <div className="text-sm font-bold text-green-600">
                      {value !== null ? `${value > 0 ? '+' : ''}${value.toFixed(1)}%` : 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confidence Progress */}
          <div className="bg-white rounded-lg p-3 border border-purple-100">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Confiança do Modelo</span>
              <span className={`text-sm font-medium ${getConfidenceColor(confidence)}`}>
                {confidence}%
              </span>
            </div>
            <Progress value={confidence} className="h-2" />
          </div>
        </CardContent>
      )}
    </Card>
  )
}
