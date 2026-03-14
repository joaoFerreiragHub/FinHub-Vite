import BrandPortalPage from '@/features/brandPortal/pages/BrandPortalPage'
import { ProtectedRoute } from '@/shared/guards'

function BrandsPortalRoutePage() {
  return (
    <ProtectedRoute allowedRoles={['brand_manager', 'admin']}>
      <BrandPortalPage />
    </ProtectedRoute>
  )
}

export default {
  Page: BrandsPortalRoutePage,
}
