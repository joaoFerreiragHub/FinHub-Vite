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
import { ChartTooltip } from '@/components/ui'

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
        <AreaChart data={mockData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="roicGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22C55E" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="waccGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis unit="%" />
          <Tooltip
            content={
              <ChartTooltip
                dataset={mockData as Array<Record<string, unknown>>}
                xDataKey="year"
                deltaDataKey="ROIC"
                deltaLabel="Variacao ROIC"
                labelFormatter={(label) => `Ano ${String(label ?? '')}`}
                valueFormatter={(value) => `${value.toFixed(2)}%`}
                deltaFormatter={(delta) => `${delta > 0 ? '+' : ''}${delta.toFixed(2)} pp`}
              />
            }
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="ROIC"
            stroke="#22C55E"
            fill="url(#roicGradient)"
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 4 }}
            name="ROIC"
          />
          <Area
            type="monotone"
            dataKey="WACC"
            stroke="#EF4444"
            fill="url(#waccGradient)"
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 4 }}
            name="WACC"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
