// components/creators/marketing/estatisticas/ReelsStats.tsx


import { Eye, ThumbsUp, PlayCircle, Percent } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"

const mockStats = {
  total: 34,
  views: 5400,
  likes: 2300,
  avgCompletion: 68.2,
  topReels: [
    { title: "Como poupar 500€/mês", views: 1900 },
    { title: "Investimentos para Iniciantes", views: 1250 },
  ],
}

export default function ReelsStats() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <PlayCircle className="w-4 h-4 text-primary" />
              Total de Reels
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
              <ThumbsUp className="w-4 h-4 text-green-600" />
              Likes
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{mockStats.likes}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Percent className="w-4 h-4 text-yellow-500" />
              Conclusão Média
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {mockStats.avgCompletion.toFixed(1)}%
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-base font-semibold mb-2">Reels Mais Vistos</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          {mockStats.topReels.map((reel, i) => (
            <div key={i} className="flex justify-between">
              <span>{reel.title}</span>
              <span>{reel.views} views</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
