// src/pages/creators/content/gerir-reels/GerirReelsPage.tsx

import ProtectedRoute from "../../../../components/auth/ProtectedRoute"
import ReelsManagementPage from "../../../../components/creators/contentManagement/reels/reelsManager"
import CreatorSidebar from "../../../../components/creators/sidebar/creatorSidebar"

import { useUserStore } from "../../../../stores/useUserStore"

function GerirReelsPage() {
  const { user, hydrated } = useUserStore()
  const isDevelopment = process.env.NODE_ENV === "development"

  console.log("🎬 ~ Estado de hidratação:", hydrated, user)

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
          <h1 className="text-2xl font-bold">Gestão de Reels</h1>
          <p className="mt-2 text-muted-foreground">
            Aqui podes adicionar, editar e organizar os teus reels para partilhar com a comunidade.
          </p>
          <ReelsManagementPage />
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default {
  Page: GerirReelsPage,
}
