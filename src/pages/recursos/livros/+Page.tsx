import { HomepageLayout } from '@/components/home/HomepageLayout'
import BrandsLivrosPage from '@/features/brands/pages/BrandsLivrosPage'
import { Route, Routes } from 'react-router-dom'

export function Page() {
  return (
    <HomepageLayout>
      <Routes>
        <Route path="/recursos/livros" element={<BrandsLivrosPage />} />
      </Routes>
    </HomepageLayout>
  )
}
