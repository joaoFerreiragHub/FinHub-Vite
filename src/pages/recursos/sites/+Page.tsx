import { HomepageLayout } from '@/components/home/HomepageLayout'
import BrandsSitesPage from '@/features/brands/pages/BrandsSitesPage'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

export function Page() {
  return (
    <HomepageLayout>
      <MemoryRouter initialEntries={['/recursos/sites']}>
        <Routes>
          <Route path="/recursos/sites" element={<BrandsSitesPage />} />
        </Routes>
      </MemoryRouter>
    </HomepageLayout>
  )
}

