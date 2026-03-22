import BrandsPodcastsPage from '@/features/brands/pages/BrandsPodcastsPage'
import { Route, Routes } from 'react-router-dom'

export function Page() {
  return (
    <>
      <Routes>
        <Route path="/recursos/podcasts" element={<BrandsPodcastsPage />} />
      </Routes>
    </>
  )
}
