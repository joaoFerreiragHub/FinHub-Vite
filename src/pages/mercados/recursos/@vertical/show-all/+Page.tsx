import { EditorialDirectoryPage } from '@/pages/mercados/recursos/_components/EditorialDirectoryPage'

export const passToClient = ['routeParams']

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resolveVerticalSlug = (props: any): string => {
  const fromProps =
    props.pageContext?.routeParams?.vertical ?? props.routeParams?.vertical ?? props.vertical
  if (fromProps) return decodeURIComponent(String(fromProps))

  if (typeof window !== 'undefined') {
    const routeMatch = window.location.pathname.match(/^\/mercados\/recursos\/([^/?#]+)\/show-all/)
    if (routeMatch?.[1]) return decodeURIComponent(routeMatch[1])
  }

  return ''
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Page(props: any) {
  return <EditorialDirectoryPage verticalSlug={resolveVerticalSlug(props)} mode="show-all" />
}

export default { Page }
