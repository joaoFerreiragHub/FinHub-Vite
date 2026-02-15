import { ChevronDown, ChevronUp, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Badge } from '@/components/ui'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function RiskAnalysisCard({ data, expanded, onToggle, getSeverityColor }: any) {
  return (
    <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
      <CardHeader className="cursor-pointer" onClick={onToggle}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-yellow-600" />
            <span>Análise de Riscos IA</span>
            <Badge variant="outline" className={getSeverityColor('medium')}>
              {data.riskFactors.length} riscos
            </Badge>
          </div>
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </CardTitle>
      </CardHeader>

      {expanded && (
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.riskFactors.map(
              (
                risk: { factor: string; severity: string; impact: number; description: string },
                idx: number,
              ) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg p-4 border border-yellow-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-semibold text-gray-800 text-sm">{risk.factor}</span>
                    <Badge className={`${getSeverityColor(risk.severity)} text-xs`}>
                      {risk.severity}
                    </Badge>
                  </div>
                  <div className="text-right mb-2">
                    <span className="text-lg font-bold text-red-500">{risk.impact}%</span>
                    <div className="text-xs text-gray-500">impacto no preço</div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{risk.description}</p>
                </div>
              ),
            )}
          </div>

          {/* Risk Summary */}
          {data.analytics?.riskAdjustedReturn && (
            <div className="mt-4 bg-white rounded-lg p-4 border border-yellow-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Retorno Ajustado ao Risco</span>
                <span
                  className={`font-bold ${
                    data.analytics.riskAdjustedReturn > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {data.analytics.riskAdjustedReturn > 0 ? '+' : ''}
                  {data.analytics.riskAdjustedReturn.toFixed(1)}%
                </span>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
