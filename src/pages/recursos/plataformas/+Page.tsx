import { HomepageLayout } from '@/components/home/HomepageLayout'
import BrandsPlatformsPage from '@/features/brands/pages/BrandsPlatformsPage'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

export function Page() {
  return (
    <HomepageLayout>
      <MemoryRouter initialEntries={['/recursos/plataformas']}>
        <Routes>
          <Route path="/recursos/plataformas" element={<BrandsPlatformsPage />} />
        </Routes>
      </MemoryRouter>
    </HomepageLayout>
  )
}

