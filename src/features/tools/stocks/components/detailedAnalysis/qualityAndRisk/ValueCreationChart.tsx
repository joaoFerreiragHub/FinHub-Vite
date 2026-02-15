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
  { year: '2018', ROIC: 12, WACC: 8 },
  { year: '2019', ROIC: 13, WACC: 8.5 },
  { year: '2020', ROIC: 10, WACC: 7.5 },
  { year: '2021', ROIC: 14, WACC: 9 },
  { year: '2022', ROIC: 15, WACC: 9.2 },
  { year: '2023', ROIC: 13.5, WACC: 8.8 },
]

export function ValueCreationChart() {
  return (
    <div className="w-full h-[300px]">
      <h3 className="text-sm font-medium mb-2">ROIC vs WACC</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mockData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis unit="%" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="ROIC"
            stroke="#10b981"
            strokeWidth={2}
            dot={true}
            name="ROIC"
          />
          <Line
            type="monotone"
            dataKey="WACC"
            stroke="#ef4444"
            strokeWidth={2}
            dot={true}
            name="WACC"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
