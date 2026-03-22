import EditorialCmsPage from '@/features/admin/pages/EditorialCmsPage'
import { ProtectedRoute } from '@/shared/guards'
import { AdminShell } from '@/shared/layouts'

function AdminEditorialCmsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']} requiredAdminModule="editorial">
      <AdminShell>
        <EditorialCmsPage />
      </AdminShell>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminEditorialCmsPage,
}
