import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'

const mockData = [
  { year: '2019', operational: 500, investing: -200, financing: 100 },
  { year: '2020', operational: 550, investing: -250, financing: 80 },
  { year: '2021', operational: 600, investing: -300, financing: 60 },
  { year: '2022', operational: 620, investing: -280, financing: 70 },
  { year: '2023', operational: 680, investing: -320, financing: 50 },
]

export function CashFlowChart() {
  return (
    <div className="w-full h-[300px]">
      <h3 className="text-sm font-medium mb-2">Fluxo de Caixa</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="operational" stackId="1" stroke="#10b981" fill="#6ee7b7" name="Operacional" />
          <Area type="monotone" dataKey="investing" stackId="1" stroke="#ef4444" fill="#fecaca" name="Investimento" />
          <Area type="monotone" dataKey="financing" stackId="1" stroke="#3b82f6" fill="#bfdbfe" name="Financiamento" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
