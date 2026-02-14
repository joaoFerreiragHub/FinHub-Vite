
import TopPerformingAdsList from "./TopPerformingAdsList"

import { mockAdMetrics } from '@/lib/mock/mockAdMetrics'
import InsightsKPICards from "./InsightsKPICards"
import BudgetSuggestionBanner from "./budgetSuggestionBanner"
import AdPerformanceChart from "./adPerformanceChart"
import AdSpendBreakdown from "./adSpendBreakdown"

export default function InsightsDashboard() {
  return (
    <div className="space-y-8">
      {/* KPIs principais */}
      <InsightsKPICards metrics={mockAdMetrics} />

      {/* Sugestão de orçamento baseada em performance */}
      <BudgetSuggestionBanner />

      {/* Gráfico de performance ao longo do tempo */}
      <AdPerformanceChart />

      {/* Distribuição do orçamento */}
      <AdSpendBreakdown />

      {/* Top anúncios */}
      <TopPerformingAdsList />
    </div>
  )
}
