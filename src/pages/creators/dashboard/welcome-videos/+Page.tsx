import { ProtectedRoute } from '@/shared/guards'
import { CreatorDashboardShell } from '@/shared/layouts'
import WelcomeVideoSection from '@/features/creators/components/contentManagement/welcomeVideos/WelcomeVideoSection'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'

function GerirVideosPage() {
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
          <h1 className="text-2xl font-bold">Videos de Boas-Vindas</h1>
          <p className="mt-2 text-muted-foreground">
            Aqui podes adicionar ou gerir os teus videos de boas-vindas, tanto os da tua pagina
            publica como os do teu cartao de apresentacao.
          </p>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <WelcomeVideoSection />
          </div>
        </div>
      </CreatorDashboardShell>
    </ProtectedRoute>
  )
}

export default {
  Page: GerirVideosPage,
}
