import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'

const data = [
  { name: 'Seg', cliques: 80, comentarios: 24, partilhas: 10 },
  { name: 'Ter', cliques: 90, comentarios: 30, partilhas: 12 },
  { name: 'Qua', cliques: 70, comentarios: 20, partilhas: 8 },
  { name: 'Qui', cliques: 85, comentarios: 28, partilhas: 15 },
  { name: 'Sex', cliques: 100, comentarios: 35, partilhas: 20 },
  { name: 'Sáb', cliques: 75, comentarios: 22, partilhas: 9 },
  { name: 'Dom', cliques: 95, comentarios: 31, partilhas: 14 },
]

export default function RecentInteractionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Interações Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold mb-2">24</p>
        <p className="text-sm text-muted-foreground mb-4">Últimos 7 dias</p>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cliques" fill="#1e40af" />
              <Bar dataKey="comentarios" fill="#16a34a" />
              <Bar dataKey="partilhas" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
