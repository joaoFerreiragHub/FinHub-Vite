import { HomepageLayout } from '@/components/home/HomepageLayout'
import BrandsPodcastsPage from '@/features/brands/pages/BrandsPodcastsPage'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

export function Page() {
  return (
    <HomepageLayout>
      <MemoryRouter initialEntries={['/recursos/podcasts']}>
        <Routes>
          <Route path="/recursos/podcasts" element={<BrandsPodcastsPage />} />
        </Routes>
      </MemoryRouter>
    </HomepageLayout>
  )
}

export default { Page }
