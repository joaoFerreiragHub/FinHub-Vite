import { EditVideo } from '@/features/creators/dashboard/videos'
import { usePageContext } from '@/renderer/PageShell'

export const passToClient = ['routeParams']

function CreatorDashboardEditVideoRoutePage() {
  const pageContext = usePageContext()
  const rawId = pageContext.routeParams?.id
  const videoId = typeof rawId === 'string' ? decodeURIComponent(rawId) : undefined

  return <EditVideo videoId={videoId} />
}

export default {
  Page: CreatorDashboardEditVideoRoutePage,
}
