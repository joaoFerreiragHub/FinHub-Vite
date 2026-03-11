import { HomepageLayout } from '@/components/home/HomepageLayout'
import BrandsBrokersPage from '@/features/brands/pages/BrandsBrokersPage'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

export function Page() {
  return (
    <HomepageLayout>
      <MemoryRouter initialEntries={['/recursos/corretoras']}>
        <Routes>
          <Route path="/recursos/corretoras" element={<BrandsBrokersPage />} />
        </Routes>
      </MemoryRouter>
    </HomepageLayout>
  )
}

export default { Page }
