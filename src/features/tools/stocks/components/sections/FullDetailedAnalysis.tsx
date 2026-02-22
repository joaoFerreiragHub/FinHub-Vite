import { StockData } from '@/features/tools/stocks/types/stocks'

import { ValuationSection } from '../sections/ValuationSection'
import { ProfitabilitySection } from '../sections/ProfitabilitySection'
import { GrowthSection } from '../sections/GrowthSection'
import { FinancialHealthSection } from '../sections/FinancialHealthSection'
import { DebtSection } from '../sections/DebtSection'
import { RisksSection } from '../sections/RisksSection'
import { DividendsSection } from '../sections/DividendsSection'
import {
  SectorMultiplesComparison,
  type Multiples,
} from '../detailedAnalysis/valuation/SectorMultiplesComparison'
import { BalanceSheetChart } from '../detailedAnalysis/performance/BalanceSheetChart'
import { CashFlowChart } from '../detailedAnalysis/performance/CashFlowChart'
import { FinancialStatementsChart } from '../detailedAnalysis/performance/FinancialStatementsChart'
import { ValueCreationChart } from '../detailedAnalysis/qualityAndRisk/ValueCreationChart'
import { QualityScores } from '../detailedAnalysis/qualityAndRisk/QualityScores'
import { ProfitVsDebtChart } from '../detailedAnalysis/qualityAndRisk/ProfitVsDebtChart'
import { PeersComparisonTable } from '../detailedAnalysis/peers/PeersComparisonTable'
import { PeersRadarChart } from '../detailedAnalysis/peers/PeersRadarChart'
import { EarningsCalendar } from '../detailedAnalysis/events/EarningsCalendar'
import { MacroCalendar } from '../detailedAnalysis/events/MacroCalendar'
import { NewsFeed } from '../detailedAnalysis/news/NewsFeed'
import { SentimentScore } from '../detailedAnalysis/news/SentimentScore'
import { EarningsSurpriseHistory } from '../detailedAnalysis/extras/EarningsSurpriseHistory'
import { ManagementQuality } from '../detailedAnalysis/extras/ManagementQuality'
import { CustomAlertsForm } from '../detailedAnalysis/extras/CustomAlertsForm'
import { ExportButtons } from '../detailedAnalysis/extras/ExportButtons'

interface Props {
  data: StockData
}

function parseInd(val: string | undefined, stripSuffix?: string): number {
  if (!val || val === '\u2014' || val === 'N/A') return NaN
  const clean = stripSuffix
    ? val.replace(new RegExp(stripSuffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'), '')
    : val
  return parseFloat(clean)
}

export function FullDetailedAnalysis({ data }: Props) {
  const ind = data.indicadores ?? {}

  // E1: companyMultiples de indicadores
  const companyMultiples: Multiples = {
    pe: parseInd(ind['P/L']),
    ps: parseInd(ind['P/S']),
    pb: parseInd(ind['P/VPA']),
    evEbitda: parseInd(ind['EV/EBITDA'], 'x'),
    roe: parseInd(ind['ROE'], '%'),
    ebitdaMargin: parseInd(ind['Margem EBITDA'], '%'),
  }

  // Só mostra comparação sectorial se tiver métricas reais da empresa
  const hasCompanyMultiples = !isNaN(companyMultiples.pe) && !isNaN(companyMultiples.roe)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
      {/* Secções Clássicas */}
      <ValuationSection data={data} />
      <ProfitabilitySection data={data} />
      <GrowthSection data={data} />
      <FinancialHealthSection data={data} />
      <DebtSection data={data} />
      <RisksSection data={data} />
      <DividendsSection data={data} />

      {/* Comparação com o Setor (só com dados reais da empresa) */}
      {hasCompanyMultiples && (
        <SectorMultiplesComparison company={companyMultiples} sector={companyMultiples} />
      )}

      {/* Performance Financeira */}
      <BalanceSheetChart />
      <CashFlowChart />
      <FinancialStatementsChart />

      {/* Qualidade e Risco */}
      <ValueCreationChart />
      <QualityScores
        data={{
          piotroskiScore: data.qualityScore ?? undefined,
          altmanZScore: data.riskScore ?? undefined,
        }}
      />
      <ProfitVsDebtChart
        data={[
          { year: '2019', roe: 15, debtRatio: 0.4 },
          { year: '2020', roe: 17, debtRatio: 0.5 },
          { year: '2021', roe: 19, debtRatio: 0.45 },
          { year: '2022', roe: 21, debtRatio: 0.42 },
          { year: '2023', roe: 18, debtRatio: 0.48 },
        ]}
      />

      {/* Comparação com Pares */}
      <PeersComparisonTable
        peersData={[
          { symbol: 'AAPL', pe: 25.3, roe: 30, ebitdaMargin: 33, revenue: 420 },
          { symbol: 'MSFT', pe: 28.1, roe: 35, ebitdaMargin: 40, revenue: 390 },
          { symbol: 'GOOGL', pe: 22.7, roe: 28, ebitdaMargin: 29, revenue: 320 },
        ]}
      />

      <PeersRadarChart
        data={[
          { name: 'Empresa A', roe: 18, ebitdaMargin: 32, revenueGrowth: 10, netMargin: 22 },
          { name: 'Empresa B', roe: 14, ebitdaMargin: 28, revenueGrowth: 8, netMargin: 17 },
          { name: 'Empresa C', roe: 20, ebitdaMargin: 30, revenueGrowth: 12, netMargin: 25 },
        ]}
      />

      {/* Eventos */}
      <EarningsCalendar />
      <MacroCalendar />

      {/* Notícias e Sentimento */}
      <NewsFeed />
      <SentimentScore />

      {/* Extras */}
      <EarningsSurpriseHistory />
      <ManagementQuality />
      <CustomAlertsForm />
      <ExportButtons />
    </div>
  )
}
