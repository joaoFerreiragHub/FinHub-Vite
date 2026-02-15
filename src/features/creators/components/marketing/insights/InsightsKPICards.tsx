// features/creators/components/marketing/insights/InsightsKPICards.tsx

import { TrendingUp, MousePointerClick, Eye, ShoppingCart, BadgeCheck } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { AdMetrics } from '~/features/creators/marketing/types/AdMetrics'

interface InsightsKPICardsProps {
  metrics: AdMetrics[]
}

export default function InsightsKPICards({ metrics }: InsightsKPICardsProps) {
  const totalImpressions = metrics.reduce((sum, m) => sum + m.impressions, 0)
  const totalClicks = metrics.reduce((sum, m) => sum + m.clicks, 0)
  const totalConversions = metrics.reduce((sum, m) => sum + m.conversions, 0)
  const totalSpend = metrics.reduce((sum, m) => sum + m.spend, 0)
  const averageCTR = totalImpressions ? (totalClicks / totalImpressions) * 100 : 0
  const averageCPC = totalClicks ? totalSpend / totalClicks : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-500" /> Impressões
          </CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">
          {totalImpressions.toLocaleString()}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-indigo-600" /> Conversões
          </CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">
          {totalConversions.toLocaleString()}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MousePointerClick className="w-4 h-4 text-green-600" /> Cliques
          </CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">{totalClicks.toLocaleString()}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-500" /> CTR Médio
          </CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">{averageCTR.toFixed(2)}%</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-yellow-500" /> CPC Médio
          </CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">{averageCPC.toFixed(2)} €</CardContent>
      </Card>
    </div>
  )
}
