import { Brain, Building, Clock, RefreshCw } from "lucide-react"
import { Button } from "../../ui/button"
import { Badge } from "../../ui/badge"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function MLHeader({ symbol, data, earningsOnly, onRefresh, loading }: any) {
  const lastUpdate = data?.timestamp || earningsOnly?.lastUpdate || new Date().toISOString()

  return (
    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Brain className="w-8 h-8 text-blue-500" />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
            </div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <span>Previsões IA - {symbol}</span>
            {data?.sector && (
              <Badge variant="outline" className="ml-2">
                <Building className="w-3 h-3 mr-1" />
                {data.sector}
              </Badge>
            )}
          </h2>
          <p className="text-gray-600 text-sm flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Atualizado: {new Date(lastUpdate).toLocaleString('pt-PT')}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {data?.modelMetrics && (
          <>
            <div className="text-center">
              <div className="text-sm text-gray-500">Precisão Earnings</div>
              <div className="text-lg font-bold text-green-600">
                {data.modelMetrics.earnings.accuracy}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Precisão Preço</div>
              <div className="text-lg font-bold text-yellow-600">
                {data.modelMetrics.price.accuracy}%
              </div>
            </div>
          </>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center space-x-1"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar</span>
        </Button>
      </div>
    </div>
  )
}
