import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'

const mockData = [
  { year: '2019', revenue: 800, ebitda: 300, netIncome: 150 },
  { year: '2020', revenue: 850, ebitda: 320, netIncome: 180 },
  { year: '2021', revenue: 900, ebitda: 350, netIncome: 200 },
  { year: '2022', revenue: 950, ebitda: 370, netIncome: 220 },
  { year: '2023', revenue: 1000, ebitda: 400, netIncome: 240 },
]

export function FinancialStatementsChart() {
  return (
    <div className="w-full h-[300px]">
      <h3 className="text-sm font-medium mb-2">Demonstrativos Financeiros</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Receita" />
          <Line type="monotone" dataKey="ebitda" stroke="#10b981" strokeWidth={2} name="EBITDA" />
          <Line
            type="monotone"
            dataKey="netIncome"
            stroke="#f59e0b"
            strokeWidth={2}
            name="Lucro Líquido"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
