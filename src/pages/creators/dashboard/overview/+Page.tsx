import { ProtectedRoute } from '@/shared/guards'
import { CreatorDashboardShell } from '@/shared/layouts'
import TodosContentPage from '@/features/creators/components/contentManagement/resumo/TodosContentPage'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'

function GerirTodosOsConteudosPage() {
  const { user, hydrated } = useAuthStore()
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
          <h1 className="text-2xl font-bold">Todos os Conteudos</h1>
          <p className="mt-2 text-muted-foreground">
            Aqui podes ver um resumo geral e gerir todos os teus conteudos.
          </p>
          {user && <TodosContentPage user={user} />}
        </div>
      </CreatorDashboardShell>
    </ProtectedRoute>
  )
}

export default {
  Page: GerirTodosOsConteudosPage,
}
