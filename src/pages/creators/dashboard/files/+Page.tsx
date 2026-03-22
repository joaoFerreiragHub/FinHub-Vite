import { ProtectedRoute } from '@/shared/guards'
import { CreatorDashboardShell } from '@/shared/layouts'
import CreatorFilesPanel from '@/features/creators/components/contentManagement/files/CreatorFilesPanel'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'

function GerirFicheirosPage() {
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
          <h1 className="text-2xl font-bold">Gestao de Ficheiros</h1>
          <p className="mt-2 text-muted-foreground">
            Carrega, organiza e torna visiveis os teus ficheiros para a comunidade.
          </p>
          <CreatorFilesPanel />
        </div>
      </CreatorDashboardShell>
    </ProtectedRoute>
  )
}

export default {
  Page: GerirFicheirosPage,
}
