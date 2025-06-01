import { Card, CardContent } from "../../../ui/card"
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar } from "recharts"

const mockData = [
  { quarter: "Q1 2022", surprise: 0.15 },
  { quarter: "Q2 2022", surprise: -0.08 },
  { quarter: "Q3 2022", surprise: 0.20 },
  { quarter: "Q4 2022", surprise: 0.05 },
  { quarter: "Q1 2023", surprise: -0.02 },
  { quarter: "Q2 2023", surprise: 0.1 },
]

export function EarningsSurpriseHistory() {
  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <h4 className="text-base font-semibold">Histórico de Surpresas no EPS</h4>
        <p className="text-sm text-muted-foreground">
          Diferença entre o EPS estimado e o real divulgado por trimestre.
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockData}>
            <XAxis dataKey="quarter" />
            <YAxis />
            <Tooltip formatter={(value: number) => `${value > 0 ? "+" : ""}${value.toFixed(2)}`} />
            <Bar dataKey="surprise" fill="#4ade80" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
