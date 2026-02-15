// features/creators/components/marketing/estatisticas/PodcastsStats.tsx

import { Radio, Headphones, Clock, BarChart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'

const mockStats = {
  totalEpisodes: 12,
  totalListeners: 860,
  avgListens: 72,
  avgListenTime: 14.3,
  topEpisodes: [
    { title: 'Como Organizar a Tua Vida Financeira', listens: 220 },
    { title: 'Liberdade Financeira: Mito ou Realidade?', listens: 190 },
  ],
}

export default function PodcastsStats() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Radio className="w-4 h-4 text-indigo-600" />
              Episódios
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{mockStats.totalEpisodes}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Headphones className="w-4 h-4 text-green-600" />
              Ouvintes
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{mockStats.totalListeners}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <BarChart className="w-4 h-4 text-blue-500" />
              Escutas por episódio
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{mockStats.avgListens}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-yellow-500" />
              Tempo médio
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {mockStats.avgListenTime.toFixed(1)} min
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-base font-semibold mb-2">Episódios Mais Escutados</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          {mockStats.topEpisodes.map((ep, i) => (
            <div key={i} className="flex justify-between">
              <span>{ep.title}</span>
              <span>{ep.listens} escutas</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
