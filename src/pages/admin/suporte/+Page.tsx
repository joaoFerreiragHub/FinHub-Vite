import AssistedSessionsPage from '@/features/admin/pages/AssistedSessionsPage'
import { ProtectedRoute } from '@/shared/guards'
import { AdminShell } from '@/shared/layouts'

function AdminSupportPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']} requiredAdminModule="support">
      <AdminShell>
        <AssistedSessionsPage />
      </AdminShell>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminSupportPage,
}
