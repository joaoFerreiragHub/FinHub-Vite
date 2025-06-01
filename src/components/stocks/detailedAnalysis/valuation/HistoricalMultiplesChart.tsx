import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface HistoricalMultiples {
  year: string
  pe: number
  ps: number
  evEbitda: number
  pb: number
}

interface HistoricalMultiplesChartProps {
  data: HistoricalMultiples[]
}

export function HistoricalMultiplesChart({ data }: HistoricalMultiplesChartProps) {
  return (
    <div className="w-full h-[350px]">
      <h2 className="text-lg font-semibold mb-2">📈 Múltiplos Históricos</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="pe" stroke="#3b82f6" name="P/E" />
          <Line type="monotone" dataKey="ps" stroke="#10b981" name="P/S" />
          <Line type="monotone" dataKey="evEbitda" stroke="#f59e0b" name="EV/EBITDA" />
          <Line type="monotone" dataKey="pb" stroke="#ef4444" name="P/B" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
