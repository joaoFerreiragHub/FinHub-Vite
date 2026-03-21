import CreatorProfilePage from '@/features/creators/pages/CreatorProfilePage'
import { usePageContext } from '@/renderer/PageShell'

export const passToClient = ['routeParams', 'pageProps', 'user']

export function Page() {
  const pageContext = usePageContext()
  const username = (pageContext.routeParams?.username as string) ?? undefined

  return <CreatorProfilePage username={username} />
}
