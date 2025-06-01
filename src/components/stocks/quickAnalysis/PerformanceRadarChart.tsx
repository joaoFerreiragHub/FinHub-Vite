import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'

interface ScoreData {
  metric: string
  value: number // Deve estar entre 0 e 100
}

interface PerformanceRadarChartProps {
  data?: ScoreData[]
}

const defaultData: ScoreData[] = [
  { metric: 'Valuation', value: 70 },
  { metric: 'Rentabilidade', value: 80 },
  { metric: 'Crescimento', value: 65 },
  { metric: 'Solidez', value: 75 },
  { metric: 'Risco', value: 40 },
  { metric: 'Dividendos', value: 60 },
]

export function PerformanceRadarChart({ data = defaultData }: PerformanceRadarChartProps) {
  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid strokeDasharray="3 3" />
          <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tickCount={6} />
          <Radar
            name="Desempenho"
            dataKey="value"
            stroke="#2563eb" // azul
            fill="#3b82f6"   // azul claro
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
