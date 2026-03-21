import { HomepageLayout } from '@/components/home/HomepageLayout'
import BrandsBrokersPage from '@/features/brands/pages/BrandsBrokersPage'
import { Route, Routes } from 'react-router-dom'

export function Page() {
  return (
    <HomepageLayout>
      <Routes>
        <Route path="/recursos/corretoras" element={<BrandsBrokersPage />} />
      </Routes>
    </HomepageLayout>
  )
}
