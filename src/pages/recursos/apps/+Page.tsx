import { HomepageLayout } from '@/components/home/HomepageLayout'
import BrandsAppsPage from '@/features/brands/pages/BrandsAppsPage'
import { Route, Routes } from 'react-router-dom'

export function Page() {
  return (
    <HomepageLayout>
      <Routes>
        <Route path="/recursos/apps" element={<BrandsAppsPage />} />
      </Routes>
    </HomepageLayout>
  )
}
