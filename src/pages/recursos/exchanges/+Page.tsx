import { HomepageLayout } from '@/components/home/HomepageLayout'
import BrandsExchangesPage from '@/features/brands/pages/BrandsExchangesPage'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

export function Page() {
  return (
    <HomepageLayout>
      <MemoryRouter initialEntries={['/recursos/exchanges']}>
        <Routes>
          <Route path="/recursos/exchanges" element={<BrandsExchangesPage />} />
        </Routes>
      </MemoryRouter>
    </HomepageLayout>
  )
}

export default { Page }
