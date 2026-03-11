import { EditLive } from '@/features/creators/dashboard/lives'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resolveId = (props: any): string => {
  const fromProps = props.pageContext?.routeParams?.id ?? props.routeParams?.id ?? props.id
  if (fromProps) return decodeURIComponent(String(fromProps))

  if (typeof window !== 'undefined') {
    const routeMatch = window.location.pathname.match(
      /^\/creators\/dashboard\/lives\/([^/?#]+)\/edit$/,
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
    <MemoryRouter initialEntries={[`/creators/dashboard/lives/${id}/edit`]}>
      <Routes>
        <Route path="/creators/dashboard/lives/:id/edit" element={<EditLive />} />
      </Routes>
    </MemoryRouter>
  )
}

