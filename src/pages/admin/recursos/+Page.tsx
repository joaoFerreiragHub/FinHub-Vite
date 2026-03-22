import BrandsManagementPage from '@/features/admin/pages/BrandsManagementPage'
import { ProtectedRoute } from '@/shared/guards'
import { AdminShell } from '@/shared/layouts'

function AdminResourcesPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']} requiredAdminModule="brands">
      <AdminShell>
        <BrandsManagementPage />
      </AdminShell>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminResourcesPage,
}
