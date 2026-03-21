import { HomepageLayout } from '@/components/home/HomepageLayout'
import BrandsComparePage from '@/features/brands/pages/BrandsComparePage'
import { Route, Routes } from 'react-router-dom'

export function Page() {
  return (
    <HomepageLayout>
      <Routes>
        <Route path="/recursos/comparar" element={<BrandsComparePage />} />
      </Routes>
    </HomepageLayout>
  )
}
