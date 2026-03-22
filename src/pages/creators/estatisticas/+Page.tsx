import { ProtectedRoute } from '@/shared/guards'
import { CreatorDashboardShell } from '@/shared/layouts'
import ContentStatsDashboard from '@/features/creators/components/stats/ContentStatsDashboard'

function ContentStatsPage() {
  return (
    <ProtectedRoute allowedRoles={['creator', 'admin']}>
      <CreatorDashboardShell>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Estatisticas dos Conteudos</h1>
            <p className="text-sm text-muted-foreground">
              Acompanha o desempenho dos teus conteudos partilhados na plataforma.
            </p>
          </div>
          <ContentStatsDashboard />
        </div>
      </CreatorDashboardShell>
    </ProtectedRoute>
  )
}

export default {
  Page: ContentStatsPage,
}
