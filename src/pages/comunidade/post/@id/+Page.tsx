import { CommunityPostDetailPage } from '@/features/community/pages/CommunityPostDetailPage'
import { usePageContext } from '@/renderer/PageShell'

export const passToClient = ['routeParams']

export function Page() {
  const pageContext = usePageContext()
  const rawId = pageContext.routeParams?.id
  const postId = typeof rawId === 'string' ? decodeURIComponent(rawId) : undefined

  return <CommunityPostDetailPage postId={postId} />
}
