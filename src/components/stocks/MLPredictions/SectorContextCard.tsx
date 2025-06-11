import { Building, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Badge } from "../../ui/badge"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SectorContextCard({ data, expanded, onToggle }: any) {
  const sectorConfig = data?.sectorConfig
  const marketContext = data?.marketContext

  // ✅ Safe number formatting function
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatNumber = (value: any, decimals: number = 1): string => {
    const num = Number(value)
    return isNaN(num) ? '0.0' : num.toFixed(decimals)
  }

  // ✅ Safe number extraction
  const sectorPerformance = Number(marketContext?.sectorPerformance || 0)
  const sectorPE = Number(marketContext?.sectorPE || 0)
  const peersCount = Number(marketContext?.peersCount || 0)
  const growthVsSector = Number(data?.analytics?.sectorComparison?.growthVsSector || 0)

  return (
    <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
      <CardHeader className="cursor-pointer" onClick={onToggle}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building className="w-5 h-5 text-indigo-600" />
            <span>Contexto do Setor - {sectorConfig?.name || 'N/A'}</span>
          </div>
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </CardTitle>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-4">
          {/* Sector Performance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-indigo-100 text-center">
              <div className="text-sm text-gray-500">Performance do Setor</div>
              <div className={`text-lg font-bold ${
                sectorPerformance > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {sectorPerformance > 0 ? '+' : ''}{formatNumber(sectorPerformance)}%
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-indigo-100 text-center">
              <div className="text-sm text-gray-500">P/E do Setor</div>
              <div className="text-lg font-bold text-blue-600">
                {formatNumber(sectorPE)}x
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-indigo-100 text-center">
              <div className="text-sm text-gray-500">Peers Analisados</div>
              <div className="text-lg font-bold text-purple-600">
                {peersCount}
              </div>
            </div>
          </div>

          {/* Sector Metrics */}
          {sectorConfig?.keyMetrics?.primary && (
            <div>
              <h4 className="font-semibold mb-3">Métricas Chave do Setor</h4>
              <div className="grid grid-cols-2 gap-2">
                {sectorConfig.keyMetrics.primary.map((metric: string, idx: number) => (
                  <div key={idx} className="bg-white rounded p-2 border border-indigo-100 text-center">
                    <span className="text-xs text-gray-600">{metric}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sector Benchmarks */}
          {data?.analytics?.sectorComparison && (
            <div>
              <h4 className="font-semibold mb-3">Comparação vs Setor</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Growth vs Setor</span>
                  <span className={`font-medium ${
                    growthVsSector > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {growthVsSector > 0 ? '+' : ''}
                    {formatNumber(growthVsSector)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ranking Geral</span>
                  <Badge variant="outline">
                    {data.analytics.sectorComparison.overallRanking || 'N/A'}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!sectorConfig && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">
                📊 Dados do setor não disponíveis
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
