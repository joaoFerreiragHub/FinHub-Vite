import { ProtectedRoute } from '@/shared/guards'
import { CreatorDashboardShell } from '@/shared/layouts'
import AnnouncementsManager from '@/features/creators/components/contentManagement/announcements/announcementsManager'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'

function GerirConteudosPage() {
  const { user, hydrated } = useAuthStore()

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        <span className="ml-2 text-sm text-muted-foreground">A carregar utilizador...</span>
      </div>
    )
  }

  return (
    <ProtectedRoute allowedRoles={['creator', 'admin']}>
      <CreatorDashboardShell>
        <div className="space-y-6">
          <div>
            <h1 className="mb-2 text-2xl font-bold">Ola, {user?.name}!</h1>
            <p className="mb-6 text-muted-foreground">
              Aqui podes gerir os teus anuncios e manter os teus seguidores atualizados.
            </p>
          </div>

          <AnnouncementsManager />
        </div>
      </CreatorDashboardShell>
    </ProtectedRoute>
  )
}

export default {
  Page: GerirConteudosPage,
}
