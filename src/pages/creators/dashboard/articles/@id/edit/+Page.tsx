import { EditArticle } from '@/features/creators/dashboard/articles'
import { usePageContext } from '@/renderer/PageShell'

export const passToClient = ['routeParams']

function CreatorDashboardEditArticleRoutePage() {
  const pageContext = usePageContext()
  const rawId = pageContext.routeParams?.id
  const articleId = typeof rawId === 'string' ? decodeURIComponent(rawId) : undefined

  return <EditArticle articleId={articleId} />
}

export default {
  Page: CreatorDashboardEditArticleRoutePage,
}
