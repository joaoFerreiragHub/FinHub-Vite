import { EditArticle } from '@/features/creators/dashboard/articles'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resolveId = (props: any): string => {
  const fromProps = props.pageContext?.routeParams?.id ?? props.routeParams?.id ?? props.id
  if (fromProps) return decodeURIComponent(String(fromProps))

  if (typeof window !== 'undefined') {
    const routeMatch = window.location.pathname.match(
      /^\/creators\/dashboard\/articles\/([^/?#]+)\/edit$/,
    )
    if (routeMatch?.[1]) return decodeURIComponent(routeMatch[1])
  }

  return ''
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Page(props: any) {
  const id = resolveId(props)
  if (!id) return null

  return (
    <MemoryRouter initialEntries={[`/creators/dashboard/articles/${id}/edit`]}>
      <Routes>
        <Route path="/creators/dashboard/articles/:id/edit" element={<EditArticle />} />
      </Routes>
    </MemoryRouter>
  )
}

export default { Page }
