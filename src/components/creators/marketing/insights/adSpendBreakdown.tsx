// components/creators/marketing/insights/adSpendBreakdown.tsx

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "../../../ui/card"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]

const mockSpendData = [
  { name: "Campanhas de Produto", value: 120 },
  { name: "Campanhas de Perfil", value: 90 },
  { name: "Promoções Diretas", value: 60 },
  { name: "Boosts de Conteúdo", value: 30 },
]

export default function AdSpendBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição do Investimento</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={mockSpendData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {mockSpendData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
