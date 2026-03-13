import { HomepageLayout } from '@/components/home/HomepageLayout'
import BrandsComparePage from '@/features/brands/pages/BrandsComparePage'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

export function Page() {
  return (
    <HomepageLayout>
      <MemoryRouter initialEntries={['/recursos/comparar']}>
        <Routes>
          <Route path="/recursos/comparar" element={<BrandsComparePage />} />
        </Routes>
      </MemoryRouter>
    </HomepageLayout>
  )
}
