import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

const mockChartData = [
  { month: 'Jan', carregado: 50, gasto: 30 },
  { month: 'Fev', carregado: 100, gasto: 60 },
  { month: 'Mar', carregado: 75, gasto: 40 },
  { month: 'Abr', carregado: 120, gasto: 90 },
  { month: 'Mai', carregado: 80, gasto: 70 },
]

export default function WalletSpendingChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução de Gastos e Carregamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockChartData}>
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip formatter={(value: number) => `${value.toFixed(2)}€`} />
              <Bar dataKey="carregado" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="gasto" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
