// src/features/tools/stocks/components/detailedAnalysis/qualityAndRisk/QualityAndRiskSection.tsx

import { Card, CardContent } from '@/components/ui'
import { QualityScores } from '../qualityAndRisk/QualityScores'
import { ValueCreationChart } from '../qualityAndRisk/ValueCreationChart'
import { ProfitVsDebtChart } from '../qualityAndRisk/ProfitVsDebtChart'

const mockData = [
  { year: '2018', roe: 22, debtRatio: 0.3 },
  { year: '2019', roe: 24, debtRatio: 0.35 },
  { year: '2020', roe: 20, debtRatio: 0.4 },
  { year: '2021', roe: 28, debtRatio: 0.38 },
  { year: '2022', roe: 26, debtRatio: 0.32 },
  { year: '2023', roe: 25, debtRatio: 0.31 },
]

export function QualityAndRiskSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
      {/* Indicadores de Qualidade (pontuações) */}
      <QualityScores data={{ piotroskiScore: 7, altmanZScore: 3.5, earningsQuality: 85 }} />

      {/* Criação de Valor: ROIC vs WACC */}
      <Card>
        <CardContent className="p-4">
          <ValueCreationChart />
        </CardContent>
      </Card>

      {/* Relação Rentabilidade vs Endividamento */}
      <ProfitVsDebtChart data={mockData} />
    </div>
  )
}
