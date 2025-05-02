import ProtectedRoute from "../../../../components/auth/ProtectedRoute"
import CreatorSidebar from "../../../../components/creators/sidebar/creatorSidebar"
import ArticleManagementPage from "../../../../components/creators/contentManagement/articles/ArticleManagementPage"
import { useUserStore } from "../../../../stores/useUserStore"

function GerirArtigosPage() {
  const { user, hydrated } = useUserStore()
  const isDevelopment = process.env.NODE_ENV === 'development'

  console.log('🚀 ~ Estado de hidratação:', hydrated, user)

  // Em desenvolvimento, podemos não esperar por hidratação completa
  if (!hydrated && !isDevelopment) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-2 text-sm text-muted-foreground">A carregar utilizador...</span>
      </div>
    )
  }

  return (
    <ProtectedRoute allowedRoles={['creator', 'admin']}>
      <div className="flex min-h-screen">
        <CreatorSidebar />
        <main className="flex-1 p-6 space-y-6 bg-background text-foreground">
          <h1 className="text-2xl font-bold">Gestão de Artigos</h1>
          <p className="mt-2 text-muted-foreground">
            Aqui podes criar, editar e organizar os teus artigos antes de os publicar.
          </p>
          <ArticleManagementPage />
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default {
  Page: GerirArtigosPage,
}
