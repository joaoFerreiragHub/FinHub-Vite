// components/stocks/MLPredictions.tsx - IMPROVED VERSION
import { Brain, AlertTriangle, RefreshCw, Info, ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui'
import { Button } from '@/components/ui'
import { useMLPredictions } from '../hooks/useMLPredictions'
import { MLHeader } from './MLHeader'
import { EarningsCard } from './EarningsCard'
import { PriceTargetCard } from './PriceTargetCard'
import { SectorContextCard } from './SectorContextCard'
import { RiskAnalysisCard } from './RiskAnalysisCard'
import { ModelInsightsCard } from './ModelInsightsCard'
import { ModelMetricsCard } from './ModelMetricsCard'
import { ActionBar } from './ActionBar'
import { useState } from 'react'

interface MLPredictionsProps {
  symbol: string
  showFullAnalysis?: boolean
}

export function MLPredictions({ symbol, showFullAnalysis = true }: MLPredictionsProps) {
  const { data, earningsOnly, loading, error, refetch } = useMLPredictions(symbol, showFullAnalysis)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['earnings', 'priceTarget']),
  )

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  if (loading) {
    return <MLPredictionsSkeleton />
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} symbol={symbol} />
  }

  if (!data && !earningsOnly) {
    return <EmptyState symbol={symbol} />
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600 bg-red-100 border-red-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'low':
        return 'text-green-600 bg-green-100 border-green-200'
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600'
    if (confidence >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getUpsideColor = (upside: number) => {
    if (upside >= 15) return 'text-green-600'
    if (upside >= 5) return 'text-yellow-600'
    if (upside >= 0) return 'text-blue-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <MLHeader
        symbol={symbol}
        data={data}
        earningsOnly={earningsOnly}
        onRefresh={refetch}
        loading={loading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Earnings Prediction */}
        <EarningsCard
          data={data}
          earningsOnly={earningsOnly}
          expanded={expandedSections.has('earnings')}
          onToggle={() => toggleSection('earnings')}
          getConfidenceColor={getConfidenceColor}
        />

        {/* Enhanced Price Target Prediction */}
        {data && (
          <PriceTargetCard
            data={data}
            expanded={expandedSections.has('priceTarget')}
            onToggle={() => toggleSection('priceTarget')}
            getUpsideColor={getUpsideColor}
          />
        )}
      </div>

      {/* Additional Analysis - Only show if full data available */}
      {data && showFullAnalysis && (
        <>
          {/* Sector Context */}
          <SectorContextCard
            data={data}
            expanded={expandedSections.has('sector')}
            onToggle={() => toggleSection('sector')}
          />

          {/* Enhanced Risk Analysis */}
          <RiskAnalysisCard
            data={data}
            expanded={expandedSections.has('risks')}
            onToggle={() => toggleSection('risks')}
            getSeverityColor={getSeverityColor}
          />

          {/* Model Insights & Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ModelInsightsCard
              data={data}
              expanded={expandedSections.has('insights')}
              onToggle={() => toggleSection('insights')}
            />

            <ModelMetricsCard
              data={data}
              expanded={expandedSections.has('metrics')}
              onToggle={() => toggleSection('metrics')}
              getConfidenceColor={getConfidenceColor}
            />
          </div>
        </>
      )}

      {/* Action Bar */}
      <ActionBar data={data} symbol={symbol} />
    </div>
  )
}

// ================================
// LOADING & ERROR STATES
// ================================

function MLPredictionsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
          <div>
            <div className="w-48 h-6 bg-gray-300 rounded mb-2"></div>
            <div className="w-32 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="w-20 h-12 bg-gray-200 rounded"></div>
          <div className="w-20 h-12 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-6">
            <div className="w-40 h-6 bg-gray-300 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="w-full h-20 bg-gray-200 rounded"></div>
              <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
              <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-gray-100 rounded-lg p-4">
            <div className="w-32 h-5 bg-gray-300 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="w-full h-3 bg-gray-200 rounded"></div>
              <div className="w-5/6 h-3 bg-gray-200 rounded"></div>
              <div className="w-4/6 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ErrorState({
  error,
  onRetry,
  symbol,
}: {
  error: string
  onRetry: () => void
  symbol: string
}) {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="p-8 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Erro ao Carregar Previsões</h3>
        <p className="text-red-600 mb-4">Não foi possível carregar as previsões para {symbol}</p>
        <div className="bg-red-100 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
        <div className="flex justify-center space-x-3">
          <Button
            onClick={onRetry}
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-100"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
          <Button variant="outline" asChild>
            <a href={`#/stocks/${symbol}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Stock
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({ symbol }: { symbol: string }) {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-8 text-center">
        <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Previsões Não Disponíveis</h3>
        <p className="text-gray-500 mb-4">Ainda não temos previsões suficientes para {symbol}</p>
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm text-blue-800 font-medium mb-1">
                Por que as previsões podem não estar disponíveis:
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Dados insuficientes para análise confiável</li>
                <li>• Stock não coberto pelos nossos modelos</li>
                <li>• Problemas temporários na coleta de dados</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex justify-center space-x-3">
          <Button variant="outline" asChild>
            <a href={`#/stocks/${symbol}/fundamentals`}>Ver Dados Fundamentais</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="#/ml/coverage">Ver Cobertura ML</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default MLPredictions
