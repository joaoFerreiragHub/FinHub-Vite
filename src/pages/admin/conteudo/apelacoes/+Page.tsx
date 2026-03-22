import AdminModerationAppealsPage from '@/features/admin/pages/AdminModerationAppealsPage'
import { ProtectedRoute } from '@/shared/guards'
import { AdminShell } from '@/shared/layouts'

function AdminModerationAppealsRoutePage() {
  return (
    <ProtectedRoute allowedRoles={['admin']} requiredAdminModule="content">
      <AdminShell>
        <AdminModerationAppealsPage />
      </AdminShell>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminModerationAppealsRoutePage,
}
