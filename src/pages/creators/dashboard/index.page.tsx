import { ProtectedRoute } from '@/shared/guards'
import CreatorSidebar from '@/features/creators/components/sidebar/creatorSidebar'

import ContentSummaryCard from '@/features/creators/components/dashboard/ContentSummaryCard'
import XPProgressCard from '@/features/creators/components/dashboard/XPProgressCard'
import RecentInteractionsCard from '@/features/creators/components/dashboard/RecentInteractionsCard'
import HelpCard from '@/features/creators/components/dashboard/HelpCard'
import FeedbackFormCard from '@/features/creators/components/dashboard/FeedbackFormCard'
import MissionCard from '@/features/creators/components/dashboard/MissionCard'
import RankingCard from '@/features/creators/components/dashboard/RankingCard'
import TopContentCard from '@/features/creators/components/dashboard/TopContentCard'
import VisualizationsChartCard from '@/features/creators/components/dashboard/VisualizationsChartCard'
import FeedbackChartCard from '@/features/creators/components/dashboard/FeedbackCard'
import ChecklistCard from '@/features/creators/components/dashboard/ChecklistCard'
import ContentTrendsCard from '@/features/creators/components/dashboard/ContentTrendsCard'
import CampaignSummaryCard from '@/features/creators/components/dashboard/CampaignSummaryCard'
import CampaignInsightsCard from '@/features/creators/components/dashboard/CampaignInsightsCard'
import { Button } from '@/components/ui'
import { PlusCircle } from 'lucide-react'

function DashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['creator', 'admin']}>
      <div className="flex min-h-screen">
        <CreatorSidebar />
        <main className="flex-1 p-6 space-y-8">
          <h1 className="text-2xl font-bold">Painel do Criador</h1>
          <p className="mt-2 text-muted-foreground">
            Bem-vindo ao teu painel de gestão de conteúdos!
          </p>

          {/* Secção: Métricas de Conteúdo */}
          <section>
            <h2 className="text-lg font-semibold mb-2">Interação e Feedback</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <VisualizationsChartCard />
              <RecentInteractionsCard />
              <FeedbackChartCard />
            </div>
          </section>
          {/* Secção:Marketing & Publicidade */}
          <section>
            <h2 className="text-lg font-semibold mb-2">Marketing & Publicidade</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CampaignSummaryCard />
              <CampaignInsightsCard />
              <Button variant="outline" size="sm" className="mt-2">
                <PlusCircle className="w-4 h-4 mr-2" />
                Criar Nova Campanha
              </Button>
            </div>
          </section>

          {/* Secção: Produtividade do Criador */}
          <section>
            <h2 className="text-lg font-semibold mb-2">Produtividade</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ContentSummaryCard />
              <XPProgressCard />
              <MissionCard />
              <RankingCard />
              <TopContentCard />
            </div>
          </section>

          {/* Secção: Ferramentas e Apoio */}
          <section>
            <h2 className="text-lg font-semibold mb-2">Ferramentas & Apoio</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ChecklistCard />
              <ContentTrendsCard />
              <FeedbackFormCard />
              <HelpCard />
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default {
  Page: DashboardPage,
}
