import BrandsAppsPage from '@/features/brands/pages/BrandsAppsPage'
import { Route, Routes } from '@/lib/reactRouterDomCompat'

export function Page() {
  return (
    <>
      <Routes>
        <Route path="/recursos/apps" element={<BrandsAppsPage />} />
      </Routes>
    </>
  )
}
