// components/creators/marketing/estatisticas/GlobalContentOverview.tsx

import { BarChart3, Eye, ThumbsUp, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"

export default function GlobalContentOverview() {
  const stats = [
    {
      title: "Total de Conteúdos",
      value: 124,
      icon: <BarChart3 className="text-primary w-5 h-5" />,
    },
    {
      title: "Visualizações",
      value: 8450,
      icon: <Eye className="text-blue-500 w-5 h-5" />,
    },
    {
      title: "Interações",
      value: 2900,
      icon: <ThumbsUp className="text-green-600 w-5 h-5" />,
    },
    {
      title: "Tempo médio de visualização",
      value: "3m 25s",
      icon: <Clock className="text-yellow-500 w-5 h-5" />,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{s.title}</CardTitle>
            {s.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{s.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
