import AdminDashboardPage from '@/features/admin/pages/AdminDashboardPage'
import { ProtectedRoute } from '@/shared/guards'

function AdminIndexPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']} requiredAdminModule="dashboard">
      <div className="mx-auto max-w-7xl p-6">
        <AdminDashboardPage />
      </div>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminIndexPage,
}
