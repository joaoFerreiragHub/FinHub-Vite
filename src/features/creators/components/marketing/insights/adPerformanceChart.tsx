import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { mockAdPerformance } from '@/lib/mock/mockAdPerformance'

export default function AdPerformanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance dos Anúncios</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockAdPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="impressions" stroke="#3b82f6" name="Impressões" />
            <Line type="monotone" dataKey="clicks" stroke="#10b981" name="Cliques" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
