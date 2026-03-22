import { PublicUserProfilePage } from '@/features/user/pages/PublicUserProfilePage'
import { usePageContext } from '@/renderer/PageShell'

export const passToClient = ['routeParams', 'pageProps', 'user']

export function Page() {
  const pageContext = usePageContext()
  const username = (pageContext.routeParams?.username as string) ?? ''
  return <PublicUserProfilePage username={username} />
}
