import AdminScopeDelegationsPage from '@/features/admin/pages/AdminScopeDelegationsPage'
import { ProtectedRoute } from '@/shared/guards'

function AdminOperationsDelegationsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']} requiredAdminModule="operations">
      <div className="mx-auto max-w-7xl p-6">
        <AdminScopeDelegationsPage />
      </div>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminOperationsDelegationsPage,
}
