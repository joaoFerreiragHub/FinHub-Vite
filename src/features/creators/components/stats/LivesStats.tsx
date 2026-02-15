// features/creators/components/marketing/estatisticas/LivesStats.tsx

import { CalendarClock, Users, Timer } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'

const mockStats = {
  totalLives: 9,
  avgParticipants: 42,
  avgDuration: 55,
  topLives: [
    { title: 'Live: Hábitos Saudáveis', participants: 68 },
    { title: 'Live: Estratégias de Investimento', participants: 61 },
  ],
}

export default function LivesStats() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <CalendarClock className="w-4 h-4 text-indigo-500" />
              Total de Lives
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{mockStats.totalLives}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-green-600" />
              Participantes Médios
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{mockStats.avgParticipants}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Timer className="w-4 h-4 text-blue-600" />
              Duração Média
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{mockStats.avgDuration} min</CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-base font-semibold mb-2">Lives com Mais Participantes</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          {mockStats.topLives.map((live, i) => (
            <div key={i} className="flex justify-between">
              <span>{live.title}</span>
              <span>{live.participants} participantes</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
