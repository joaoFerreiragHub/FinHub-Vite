import AdminScopeDelegationsPage from '@/features/admin/pages/AdminScopeDelegationsPage'
import { ProtectedRoute } from '@/shared/guards'
import { AdminShell } from '@/shared/layouts'

function AdminOperationsDelegationsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']} requiredAdminModule="operations">
      <AdminShell>
        <AdminScopeDelegationsPage />
      </AdminShell>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminOperationsDelegationsPage,
}
