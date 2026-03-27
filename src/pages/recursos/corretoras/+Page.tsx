import BrandsBrokersPage from '@/features/brands/pages/BrandsBrokersPage'
import { Route, Routes } from '@/lib/reactRouterDomCompat'

export function Page() {
  return (
    <>
      <Routes>
        <Route path="/recursos/corretoras" element={<BrandsBrokersPage />} />
      </Routes>
    </>
  )
}
