import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from 'recharts'

const mockData = [
  { year: '2019', assets: 1200, liabilities: 800, equity: 400 },
  { year: '2020', assets: 1350, liabilities: 900, equity: 450 },
  { year: '2021', assets: 1500, liabilities: 1000, equity: 500 },
  { year: '2022', assets: 1700, liabilities: 1100, equity: 600 },
  { year: '2023', assets: 1850, liabilities: 1200, equity: 650 },
]

export function BalanceSheetChart() {
  return (
    <div className="w-full h-[300px]">
      <h3 className="text-sm font-medium mb-2">Balanço Patrimonial</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="assets" fill="#3b82f6" name="Ativos" />
          <Bar dataKey="liabilities" fill="#f59e0b" name="Passivos" />
          <Bar dataKey="equity" fill="#10b981" name="Património Líquido" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
