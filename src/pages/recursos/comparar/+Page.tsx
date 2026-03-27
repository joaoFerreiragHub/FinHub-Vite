import BrandsComparePage from '@/features/brands/pages/BrandsComparePage'
import { Route, Routes } from '@/lib/reactRouterDomCompat'

export function Page() {
  return (
    <>
      <Routes>
        <Route path="/recursos/comparar" element={<BrandsComparePage />} />
      </Routes>
    </>
  )
}
