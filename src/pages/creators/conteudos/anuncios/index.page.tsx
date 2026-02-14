import ProtectedRoute from '@/shared/guards'
import AnnouncementsManager from '../../../../components/creators/contentManagement/announcements/announcementsManager'

import CreatorSidebar from '../../../../components/creators/sidebar/creatorSidebar'
import { useUserStore } from '../../../../stores/useUserStore'

function GerirConteudosPage() {
  const { user, hydrated } = useUserStore()

  console.log('🚀 ~ file: index.page.tsx:8 ~ GerirConteudosPage ~ hydrated teste:', hydrated, user)

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-2 text-sm text-muted-foreground ml-2">A carregar utilizador...</span>
      </div>
    )
  }

  return (
    <ProtectedRoute allowedRoles={['creator', 'admin']}>
      <div className="flex min-h-screen">
        {/* Sidebar do Criador */}
        <CreatorSidebar />

        {/* Conteúdo Principal */}
        <main className="flex-1 p-6 space-y-6 bg-background text-foreground">
          <div>
            <h1 className="text-2xl font-bold mb-2">Olá, {user?.name}! 👋</h1>
            <p className="text-muted-foreground mb-6">
              Aqui podes gerir os teus anúncios e manter os teus seguidores atualizados.
            </p>
          </div>

          {/* Gerir Anúncios */}
          <AnnouncementsManager />
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default {
  Page: GerirConteudosPage,
}
