import BrandDetailPage from '@/features/brands/pages/BrandDetailPage'
import { usePageContext } from '@/renderer/PageShell'

export const passToClient = ['routeParams']

function DirectoryDetailRoutePage() {
  const pageContext = usePageContext()
  const rawSlug = pageContext.routeParams?.slug
  const slug = typeof rawSlug === 'string' ? decodeURIComponent(rawSlug) : undefined

  return <BrandDetailPage slug={slug} />
}

export default {
  Page: DirectoryDetailRoutePage,
}
