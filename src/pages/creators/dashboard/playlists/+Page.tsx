import { ProtectedRoute } from '@/shared/guards'
import { CreatorDashboardShell } from '@/shared/layouts'
import PlaylistsManager from '@/features/creators/components/contentManagement/playlists/PlaylistsManager'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'

function GerirPlaylistsPage() {
  const { hydrated } = useAuthStore()
  const isDevelopment = process.env.NODE_ENV === 'development'

  if (!hydrated && !isDevelopment) {
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
          <h1 className="text-2xl font-bold">Gestao de Playlists</h1>
          <p className="mt-2 text-muted-foreground">
            Aqui podes criar, editar e organizar as tuas playlists de video para os teus conteudos.
          </p>
          <PlaylistsManager />
        </div>
      </CreatorDashboardShell>
    </ProtectedRoute>
  )
}

export default {
  Page: GerirPlaylistsPage,
}
