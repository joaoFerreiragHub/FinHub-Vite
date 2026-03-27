import BrandsSitesPage from '@/features/brands/pages/BrandsSitesPage'
import { Route, Routes } from '@/lib/reactRouterDomCompat'

export function Page() {
  return (
    <>
      <Routes>
        <Route path="/recursos/sites" element={<BrandsSitesPage />} />
      </Routes>
    </>
  )
}
