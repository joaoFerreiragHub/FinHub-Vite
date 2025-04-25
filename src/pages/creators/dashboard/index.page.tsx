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

function DashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['creator', 'admin']}>
      <div className="flex min-h-screen">
        <CreatorSidebar />
        <main className="flex-1 p-6 space-y-6">
          <h1 className="text-2xl font-bold">Painel do Criador</h1>
          <p className="mt-2 text-muted-foreground">
            Bem-vindo ao teu painel de gestão de conteúdos!
          </p>

          {/* Primeira linha de cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ContentSummaryCard />
            <XPProgressCard />
            <RecentInteractionsCard />
          </div>

          {/* Segunda linha de cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MissionCard />
            <RankingCard />
            <TopContentCard />
          </div>

          {/* Linha final com ajuda e feedback */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeedbackCard />
            <HelpCard />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default {
  Page: DashboardPage,
}
