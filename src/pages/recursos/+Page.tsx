import BrandsListPage from '@/features/brands/pages/BrandsListPage'
import { Route, Routes } from '@/lib/reactRouterDomCompat'

export function Page() {
  return (
    <>
      <Routes>
        <Route path="/recursos" element={<BrandsListPage />} />
      </Routes>
    </>
  )
}
