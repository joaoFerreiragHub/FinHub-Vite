import ProtectedRoute from "../../../components/auth/ProtectedRoute"
import CreatorSidebar from "../../../components/creators/sidebar/creatorSidebar"

import ContentSummaryCard from "../../../components/creators/dashboard/ContentSummaryCard"
import XPProgressCard from "../../../components/creators/dashboard/XPProgressCard"
import RecentInteractionsCard from "../../../components/creators/dashboard/RecentInteractionsCard"
import HelpCard from "../../../components/creators/dashboard/HelpCard"
import FeedbackCard from "../../../components/creators/dashboard/FeedbackCard"
import MissionCard from "../../../components/creators/dashboard/MissionCard"
import RankingCard from "../../../components/creators/dashboard/RankingCard"
import TopContentCard from "../../../components/creators/dashboard/TopContentCard"
import VisualizationsChartCard from "../../../components/creators/dashboard/VisualizationsChartCard"
import FeedbackChartCard from "../../../components/creators/dashboard/FeedbackCard"
import ChecklistCard from "../../../components/creators/dashboard/ChecklistCard"
import ContentTrendsCard from "../../../components/creators/dashboard/ContentTrendsCard"
import CampaignSummaryCard from "../../../components/creators/dashboard/CampaignSummaryCard"
import CampaignInsightsCard from "../../../components/creators/dashboard/CampaignInsightsCard"
import { Button } from "../../../components/ui/button"
import { PlusCircle } from "lucide-react"


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
                 <FeedbackCard />
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
