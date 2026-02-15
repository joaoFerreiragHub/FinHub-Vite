// src/features/tools/stocks/components/detailedAnalysis/peers/PeersRadarChart.tsx

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent } from '@/components/ui'

interface Peer {
  name: string
  roe: number
  ebitdaMargin: number
  revenueGrowth: number
  netMargin: number
}

interface PeersRadarChartProps {
  data: Peer[]
}

export function PeersRadarChart({ data }: PeersRadarChartProps) {
  const radarData = ['roe', 'ebitdaMargin', 'revenueGrowth', 'netMargin'].map((metric) => ({
    metric,
    ...Object.fromEntries(data.map((peer) => [peer.name, peer[metric as keyof Peer] ?? 0])),
  }))

  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <h4 className="text-base font-semibold">📊 Comparação Radar com os Pares</h4>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart outerRadius="80%" data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Tooltip />
            {data.map((peer, idx) => (
              <Radar
                key={peer.name}
                name={peer.name}
                dataKey={peer.name}
                stroke={`hsl(${(idx * 60) % 360}, 70%, 50%)`}
                fill={`hsl(${(idx * 60) % 360}, 70%, 50%)`}
                fillOpacity={0.3}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
