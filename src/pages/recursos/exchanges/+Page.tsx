import BrandsExchangesPage from '@/features/brands/pages/BrandsExchangesPage'
import { Route, Routes } from '@/lib/reactRouterDomCompat'

export function Page() {
  return (
    <>
      <Routes>
        <Route path="/recursos/exchanges" element={<BrandsExchangesPage />} />
      </Routes>
    </>
  )
}
