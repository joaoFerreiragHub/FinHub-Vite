// features/creators/components/marketing/estatisticas/ArticlesStats.tsx

import { BookOpen, MessageCircle, Eye, Timer } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'

const mockStats = {
  total: 18,
  views: 3100,
  comments: 290,
  avgReadingTime: 4.6,
  topArticles: [
    { title: 'Mentalidade Financeira para 2025', views: 1200 },
    { title: 'Como criar uma rotina de poupança', views: 980 },
  ],
}

export default function ArticlesStats() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4 text-primary" />
              Total de Artigos
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{mockStats.total}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Eye className="w-4 h-4 text-blue-500" />
              Visualizações
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{mockStats.views}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <MessageCircle className="w-4 h-4 text-green-600" />
              Comentários
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{mockStats.comments}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Timer className="w-4 h-4 text-yellow-500" />
              Leitura Média
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {mockStats.avgReadingTime.toFixed(1)} min
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-base font-semibold mb-2">Artigos Mais Lidos</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          {mockStats.topArticles.map((art, i) => (
            <div key={i} className="flex justify-between">
              <span>{art.title}</span>
              <span>{art.views} views</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
