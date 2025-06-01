// src/components/stocks/detailedAnalysis/sections/PeersSection.tsx

import { Card, CardContent } from '../../../ui/card'
import { PeersComparisonTable } from '../peers/PeersComparisonTable'
import { PeersRadarChart } from '../peers/PeersRadarChart'

interface PeersSectionProps {
  data: {
    peers: string[] // tickers
    metrics: {
      symbol: string
      pe: number
      roe: number
      ebitdaMargin: number
      revenue: number
    }[]
  }
}

export function PeersSection({ data }: PeersSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2">📊 Comparação com Concorrência</h3>
          <PeersComparisonTable peersData={data.metrics} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
        <PeersRadarChart
          data={data.metrics.map((peer) => ({
            name: peer.symbol,
            roe: peer.roe,
            ebitdaMargin: peer.ebitdaMargin,
            revenueGrowth: peer.revenue, // supondo que ainda não tens `revenueGrowth`
            netMargin: 0, // valor default se não estiver disponível
          }))}
        />
        </CardContent>
      </Card>
    </div>
  )
}
