import { CommunityRoomDetailPage } from '@/features/community/pages/CommunityRoomDetailPage'
import { usePageContext } from '@/renderer/PageShell'

export const passToClient = ['routeParams']

export function Page() {
  const pageContext = usePageContext()
  const rawSlug = pageContext.routeParams?.slug
  const slug = typeof rawSlug === 'string' ? decodeURIComponent(rawSlug) : undefined

  return <CommunityRoomDetailPage slug={slug} />
}
