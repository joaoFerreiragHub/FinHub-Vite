import BrandsPodcastsPage from '@/features/brands/pages/BrandsPodcastsPage'
import { Route, Routes } from '@/lib/reactRouterDomCompat'

export function Page() {
  return (
    <>
      <Routes>
        <Route path="/recursos/podcasts" element={<BrandsPodcastsPage />} />
      </Routes>
    </>
  )
}
