import { StockData } from '../../../types/stocks'

import { ValuationSection } from '../sections/ValuationSection'
import { ProfitabilitySection } from '../sections/ProfitabilitySection'
import { GrowthSection } from '../sections/GrowthSection'
import { FinancialHealthSection } from '../sections/FinancialHealthSection'
import { DebtSection } from '../sections/DebtSection'
import { RisksSection } from '../sections/RisksSection'
import { DividendsSection } from '../sections/DividendsSection'
import { ValuationSimulator } from '../detailedAnalysis/valuation/ValuationSimulator'
import { ValuationComparison } from '../detailedAnalysis/valuation/ValuationComparison'
import { HistoricalMultiplesChart } from '../detailedAnalysis/valuation/HistoricalMultiplesChart'
import { SectorMultiplesComparison } from '../detailedAnalysis/valuation/SectorMultiplesComparison'
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

export function FullDetailedAnalysis({ data }: Props) {
  // Mock para props obrigatórios
  const precoAtual = 230
  const valuation = 250

  const companyMultiples = {
    pe: 15.2,
    ps: 4.5,
    pb: 2.8,
    evEbitda: 10.4,
    roe: 18.2,
    ebitdaMargin: 32.5,
  }

  const sectorMultiples = {
    pe: 17.6,
    ps: 4.2,
    pb: 2.5,
    evEbitda: 11.1,
    roe: 14.7,
    ebitdaMargin: 28.9,
  }

  const historicalMultiplesData = [
    { year: '2019', pe: 18.2, ps: 3.2, pb: 3.1, evEbitda: 11.5 },
    { year: '2020', pe: 22.7, ps: 4.1, pb: 3.4, evEbitda: 12.8 },
    { year: '2021', pe: 19.5, ps: 3.5, pb: 2.9, evEbitda: 10.2 },
    { year: '2022', pe: 16.3, ps: 3.1, pb: 2.7, evEbitda: 9.8 },
    { year: '2023', pe: 17.1, ps: 3.6, pb: 2.8, evEbitda: 10.5 },
  ]

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

      {/* Valuation e Múltiplos */}
      <ValuationSimulator precoAtual={precoAtual} />
      <ValuationComparison valuation={valuation} currentPrice={precoAtual} />
      <HistoricalMultiplesChart data={historicalMultiplesData} />
      <SectorMultiplesComparison company={companyMultiples} sector={sectorMultiples} />

      {/* Performance Financeira */}
      <BalanceSheetChart />
      <CashFlowChart />
      <FinancialStatementsChart />

      {/* Qualidade e Risco */}
      <ValueCreationChart />
      <QualityScores data={{ piotroskiScore: 7, altmanZScore: 3.1, earningsQuality: 82 }} />
      <ProfitVsDebtChart data={[
        { year: '2019', roe: 15, debtRatio: 0.4 },
        { year: '2020', roe: 17, debtRatio: 0.5 },
        { year: '2021', roe: 19, debtRatio: 0.45 },
        { year: '2022', roe: 21, debtRatio: 0.42 },
        { year: '2023', roe: 18, debtRatio: 0.48 },
      ]} />

      {/* Comparação com Pares */}
      <PeersComparisonTable
        peersData={[
          { symbol: 'AAPL', pe: 25.3, roe: 30, ebitdaMargin: 33, revenue: 420 },
          { symbol: 'MSFT', pe: 28.1, roe: 35, ebitdaMargin: 40, revenue: 390 },
          { symbol: 'GOOGL', pe: 22.7, roe: 28, ebitdaMargin: 29, revenue: 320 },
        ]}
      />

      <PeersRadarChart data={[
        { name: 'Empresa A', roe: 18, ebitdaMargin: 32, revenueGrowth: 10, netMargin: 22 },
        { name: 'Empresa B', roe: 14, ebitdaMargin: 28, revenueGrowth: 8, netMargin: 17 },
        { name: 'Empresa C', roe: 20, ebitdaMargin: 30, revenueGrowth: 12, netMargin: 25 },
      ]} />

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
