import ProtectedRoute from "../../../../components/auth/ProtectedRoute"
import LivesManager from "../../../../components/creators/contentManagement/lives/livesManager"
import CreatorSidebar from "../../../../components/creators/sidebar/creatorSidebar"

import { useUserStore } from "../../../../stores/useUserStore"

function GerirEventosPage() {
  const {  hydrated } = useUserStore()
  const isDevelopment = process.env.NODE_ENV === "development"

  if (!hydrated && !isDevelopment) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-2 text-sm text-muted-foreground">A carregar utilizador...</span>
      </div>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["creator", "admin"]}>
      <div className="flex min-h-screen">
        <CreatorSidebar />
        <main className="flex-1 p-6 space-y-6 bg-background text-foreground">
          <h1 className="text-2xl font-bold">Gestão de Eventos / Lives</h1>
          <p className="mt-2 text-muted-foreground">
            Cria, edita e organiza os teus eventos presenciais ou online.
          </p>
          <LivesManager />
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default {
  Page: GerirEventosPage,
}
