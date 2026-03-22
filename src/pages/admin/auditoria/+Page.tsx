import AdminAuditLogsPage from '@/features/admin/pages/AdminAuditLogsPage'
import { ProtectedRoute } from '@/shared/guards'
import { AdminShell } from '@/shared/layouts'

function AdminAuditPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']} requiredAdminModule="audit">
      <AdminShell>
        <AdminAuditLogsPage />
      </AdminShell>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminAuditPage,
}
