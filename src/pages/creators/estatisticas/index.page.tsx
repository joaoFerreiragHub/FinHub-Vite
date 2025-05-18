import ProtectedRoute from "../../../components/auth/ProtectedRoute"
import CreatorSidebar from "../../../components/creators/sidebar/creatorSidebar"
import ContentStatsDashboard from "../../../components/creators/stats/ContentStatsDashboard"


function ContentStatsPage() {
  return (
    <ProtectedRoute allowedRoles={["creator", "admin"]}>
      <div className="flex min-h-screen">
        <CreatorSidebar />
        <main className="flex-1 bg-background text-foreground p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Estatísticas dos Conteúdos</h1>
            <p className="text-sm text-muted-foreground">
              Acompanha o desempenho dos teus conteúdos partilhados na plataforma.
            </p>
          </div>
          <ContentStatsDashboard />
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default {
  Page: ContentStatsPage,
}
