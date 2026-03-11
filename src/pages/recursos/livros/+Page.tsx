import { HomepageLayout } from '@/components/home/HomepageLayout'
import BrandsLivrosPage from '@/features/brands/pages/BrandsLivrosPage'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

export function Page() {
  return (
    <HomepageLayout>
      <MemoryRouter initialEntries={['/recursos/livros']}>
        <Routes>
          <Route path="/recursos/livros" element={<BrandsLivrosPage />} />
        </Routes>
      </MemoryRouter>
    </HomepageLayout>
  )
}

