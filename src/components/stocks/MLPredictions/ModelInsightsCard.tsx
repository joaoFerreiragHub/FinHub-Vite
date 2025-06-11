import { Activity, Brain, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ModelInsightsCard({ data, expanded, onToggle }: any) {
  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader className="cursor-pointer" onClick={onToggle}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <span>Insights do Modelo</span>
          </div>
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </CardTitle>
      </CardHeader>

      {expanded && (
        <CardContent>
          <ul className="space-y-3">
            {data.modelInsights.map((insight: string, idx: number) => (
              <li key={idx} className="flex items-start space-x-3 bg-white rounded-lg p-3 border border-blue-100">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-blue-800 leading-relaxed">{insight}</span>
              </li>
            ))}
          </ul>

          {/* Model Version Info */}
          <div className="mt-4 pt-4 border-t border-blue-200">
            <div className="flex items-center justify-between text-xs text-blue-600">
              <span>Modelo otimizado para {data.sectorConfig.name}</span>
              <span className="flex items-center">
                <Activity className="w-3 h-3 mr-1" />
                Sector-aware AI
              </span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
