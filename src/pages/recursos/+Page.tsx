import { HomepageLayout } from '@/components/home/HomepageLayout'
import BrandsListPage from '@/features/brands/pages/BrandsListPage'
import { Route, Routes } from 'react-router-dom'

export function Page() {
  return (
    <HomepageLayout>
      <Routes>
        <Route path="/recursos" element={<BrandsListPage />} />
      </Routes>
    </HomepageLayout>
  )
}
