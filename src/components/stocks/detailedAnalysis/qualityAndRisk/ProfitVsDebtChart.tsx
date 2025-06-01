import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { Card, CardContent } from '../../../ui/card'


interface ProfitVsDebtChartProps {
  data: {
    year: string
    roe: number
    debtRatio: number
  }[]
}

export function ProfitVsDebtChart({ data }: ProfitVsDebtChartProps) {
  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <h4 className="text-base font-semibold">Rentabilidade vs Endividamento</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="year" stroke="#8884d8" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="roe" fill="#4ade80" name="ROE (%)" />
            <Bar dataKey="debtRatio" fill="#f87171" name="Dívida/Capital" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
