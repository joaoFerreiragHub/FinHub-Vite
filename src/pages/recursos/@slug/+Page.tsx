import BrandDetailPage from '@/features/brands/pages/BrandDetailPage'
import { Route, Routes } from 'react-router-dom'

export const passToClient = ['routeParams']

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resolveSlug = (props: any): string => {
  const fromProps = props.pageContext?.routeParams?.slug ?? props.routeParams?.slug ?? props.slug
  if (fromProps) return decodeURIComponent(String(fromProps))

  if (typeof window !== 'undefined') {
    const routeMatch = window.location.pathname.match(/^\/recursos\/([^/?#]+)/)
    if (routeMatch?.[1]) return decodeURIComponent(routeMatch[1])
  }

  return ''
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Page(props: any) {
  const slug = resolveSlug(props)

  if (!slug) {
    return (
      <>
        <section className="mx-auto max-w-4xl px-4 py-12 text-center">
          <p className="text-sm text-muted-foreground">Recurso nao encontrado.</p>
        </section>
      </>
    )
  }

  return (
    <>
      <Routes>
        <Route path="/recursos/:slug" element={<BrandDetailPage />} />
      </Routes>
    </>
  )
}
