// components/creators/marketing/estatisticas/VideosStats.tsx


import { Video, Eye, Timer, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"

const mockStats = {
  totalVideos: 18,
  totalViews: 4300,
  avgDuration: 8.6,
  avgRetention: 65,
  topVideos: [
    { title: "Como começar a investir em ETFs", views: 980 },
    { title: "Erros comuns a evitar no orçamento mensal", views: 860 },
  ],
}

export default function VideosStats() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Video className="w-4 h-4 text-indigo-500" />
              Vídeos
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{mockStats.totalVideos}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Eye className="w-4 h-4 text-blue-600" />
              Visualizações
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{mockStats.totalViews.toLocaleString()}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Timer className="w-4 h-4 text-green-600" />
              Duração Média
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{mockStats.avgDuration} min</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4 text-purple-600" />
              Retenção Média
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{mockStats.avgRetention}%</CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-base font-semibold mb-2">Vídeos com Melhor Desempenho</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          {mockStats.topVideos.map((video, i) => (
            <div key={i} className="flex justify-between">
              <span>{video.title}</span>
              <span>{video.views} visualizações</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
