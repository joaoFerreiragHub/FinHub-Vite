import UsersManagementPage from '@/features/admin/pages/UsersManagementPage'
import { ProtectedRoute } from '@/shared/guards'

function AdminUsersPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="mx-auto max-w-7xl p-6">
        <UsersManagementPage />
      </div>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminUsersPage,
}
