import { BarChart3, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Progress } from "@radix-ui/react-progress";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ModelMetricsCard({ data, expanded, onToggle, getConfidenceColor }: any) {
  return (
    <Card className="border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50">
      <CardHeader className="cursor-pointer" onClick={onToggle}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            <span>Métricas do Modelo</span>
          </div>
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </CardTitle>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-4">
          {/* Model Performance */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-100">
              <div className="text-sm text-gray-500 mb-2">Precisão Earnings</div>
              <div className={`text-2xl font-bold ${getConfidenceColor(data.modelMetrics.earnings.accuracy)}`}>
                {data.modelMetrics.earnings.accuracy}%
              </div>
              <Progress value={data.modelMetrics.earnings.accuracy} className="h-2 mt-2" />
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-100">
              <div className="text-sm text-gray-500 mb-2">Precisão Price Target</div>
              <div className={`text-2xl font-bold ${getConfidenceColor(data.modelMetrics.price.accuracy)}`}>
                {data.modelMetrics.price.accuracy}%
              </div>
              <Progress value={data.modelMetrics.price.accuracy} className="h-2 mt-2" />
            </div>
          </div>

          {/* Data Quality */}
          {data.analytics?.dataQuality && (
            <div className="bg-white rounded-lg p-4 border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Qualidade dos Dados</span>
                <span className={`font-medium ${getConfidenceColor(data.analytics.dataQuality * 100)}`}>
                  {(data.analytics.dataQuality * 100).toFixed(0)}%
                </span>
              </div>
              <Progress value={data.analytics.dataQuality * 100} className="h-2" />
            </div>
          )}

          {/* Model Confidence */}
          {data.analytics?.modelConfidence && (
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <div className="text-sm text-gray-600 mb-2">Confiança Geral do Modelo</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span>Qualidade:</span>
                  <span>{(data.analytics.modelConfidence.dataQuality * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Cobertura:</span>
                  <span>{(data.analytics.modelConfidence.sectorCoverage * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
