import BrandsSitesPage from '@/features/brands/pages/BrandsSitesPage'
import { Route, Routes } from 'react-router-dom'

export function Page() {
  return (
    <>
      <Routes>
        <Route path="/recursos/sites" element={<BrandsSitesPage />} />
      </Routes>
    </>
  )
}
