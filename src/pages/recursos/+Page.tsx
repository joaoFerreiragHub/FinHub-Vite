import { HomepageLayout } from '@/components/home/HomepageLayout'
import BrandsListPage from '@/features/brands/pages/BrandsListPage'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

export function Page() {
  return (
    <HomepageLayout>
      <MemoryRouter initialEntries={['/recursos']}>
        <Routes>
          <Route path="/recursos" element={<BrandsListPage />} />
        </Routes>
      </MemoryRouter>
    </HomepageLayout>
  )
}

export default { Page }
