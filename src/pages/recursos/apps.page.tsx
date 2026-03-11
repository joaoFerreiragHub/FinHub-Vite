import { HomepageLayout } from '@/components/home/HomepageLayout'
import BrandsAppsPage from '@/features/brands/pages/BrandsAppsPage'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

export function Page() {
  return (
    <HomepageLayout>
      <MemoryRouter initialEntries={['/recursos/apps']}>
        <Routes>
          <Route path="/recursos/apps" element={<BrandsAppsPage />} />
        </Routes>
      </MemoryRouter>
    </HomepageLayout>
  )
}

export default { Page }
