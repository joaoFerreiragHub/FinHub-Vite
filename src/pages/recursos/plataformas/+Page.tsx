import BrandsPlatformsPage from '@/features/brands/pages/BrandsPlatformsPage'
import { Route, Routes } from '@/lib/reactRouterDomCompat'

export function Page() {
  return (
    <>
      <Routes>
        <Route path="/recursos/plataformas" element={<BrandsPlatformsPage />} />
      </Routes>
    </>
  )
}
