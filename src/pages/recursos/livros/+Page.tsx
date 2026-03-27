import BrandsLivrosPage from '@/features/brands/pages/BrandsLivrosPage'
import { Route, Routes } from '@/lib/reactRouterDomCompat'

export function Page() {
  return (
    <>
      <Routes>
        <Route path="/recursos/livros" element={<BrandsLivrosPage />} />
      </Routes>
    </>
  )
}
