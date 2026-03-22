import UsersManagementPage from '@/features/admin/pages/UsersManagementPage'
import { ProtectedRoute } from '@/shared/guards'
import { AdminShell } from '@/shared/layouts'

function AdminUsersPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']} requiredAdminModule="users">
      <AdminShell>
        <UsersManagementPage />
      </AdminShell>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminUsersPage,
}
