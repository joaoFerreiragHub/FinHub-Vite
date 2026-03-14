import BrandPortalPage from '@/features/brandPortal/pages/BrandPortalPage'
import { ProtectedRoute } from '@/shared/guards'

function BrandsPortalRoutePage() {
  return (
    <ProtectedRoute allowedRoles={['free', 'premium', 'creator', 'admin']}>
      <BrandPortalPage />
    </ProtectedRoute>
  )
}

export default {
  Page: BrandsPortalRoutePage,
}
