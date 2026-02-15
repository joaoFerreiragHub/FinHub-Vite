// src/features/creators/components/dashboard/FeedbackChartCard.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Star } from 'lucide-react'

const data = [
  { name: '5 Estrelas', value: 60 },
  { name: '4 Estrelas', value: 25 },
  { name: '3 Estrelas', value: 10 },
  { name: '2 Estrelas', value: 4 },
  { name: '1 Estrela', value: 1 },
]

const COLORS = ['#4ade80', '#22c55e', '#eab308', '#f97316', '#ef4444']

export default function FeedbackChartCard() {
  const totalAvaliacoes = data.reduce((acc, curr) => acc + curr.value, 0)
  const media = (
    (data[0].value * 5 +
      data[1].value * 4 +
      data[2].value * 3 +
      data[3].value * 2 +
      data[4].value * 1) /
    totalAvaliacoes
  ).toFixed(1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback ao Conteúdo</CardTitle>
      </CardHeader>
      <CardContent className="h-72 space-y-4">
        {/* Estatística Resumida */}
        <div className="flex items-center space-x-2">
          <p className="text-2xl font-bold">{media} / 5</p>
          <Star className="text-yellow-500 w-5 h-5" />
          <p className="text-sm text-muted-foreground">Baseado em {totalAvaliacoes} avaliações</p>
        </div>

        {/* Gráfico de Pizza */}
        <ResponsiveContainer width="100%" height="70%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={60}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
