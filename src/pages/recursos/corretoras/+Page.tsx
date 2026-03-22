import BrandsBrokersPage from '@/features/brands/pages/BrandsBrokersPage'
import { Route, Routes } from 'react-router-dom'

export function Page() {
  return (
    <>
      <Routes>
        <Route path="/recursos/corretoras" element={<BrandsBrokersPage />} />
      </Routes>
    </>
  )
}
