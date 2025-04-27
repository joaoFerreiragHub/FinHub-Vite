import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Seg', views: 120 },
  { name: 'Ter', views: 200 },
  { name: 'Qua', views: 150 },
  { name: 'Qui', views: 170 },
  { name: 'Sex', views: 220 },
  { name: 'Sáb', views: 180 },
  { name: 'Dom', views: 250 },
]

export default function VisualizationsChartCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visualizações Semanais</CardTitle>
      </CardHeader>
      <CardContent className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="views" stroke="#0f172a" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
