import { HomepageLayout } from '@/components/home/HomepageLayout'
import BrandsPlatformsPage from '@/features/brands/pages/BrandsPlatformsPage'
import { Route, Routes } from 'react-router-dom'

export function Page() {
  return (
    <HomepageLayout>
      <Routes>
        <Route path="/recursos/plataformas" element={<BrandsPlatformsPage />} />
      </Routes>
    </HomepageLayout>
  )
}
