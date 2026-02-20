import BrandsManagementPage from '@/features/admin/pages/BrandsManagementPage'
import { ProtectedRoute } from '@/shared/guards'

function AdminResourcesPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="mx-auto max-w-7xl p-6">
        <BrandsManagementPage />
      </div>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminResourcesPage,
}
