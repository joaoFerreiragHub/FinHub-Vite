import { HomepageLayout } from '@/components/home/HomepageLayout'
import BrandsExchangesPage from '@/features/brands/pages/BrandsExchangesPage'
import { Route, Routes } from 'react-router-dom'

export function Page() {
  return (
    <HomepageLayout>
      <Routes>
        <Route path="/recursos/exchanges" element={<BrandsExchangesPage />} />
      </Routes>
    </HomepageLayout>
  )
}
