import AdminDashboardPage from '@/features/admin/pages/AdminDashboardPage'
import { ProtectedRoute } from '@/shared/guards'
import { AdminShell } from '@/shared/layouts'

function AdminIndexPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']} requiredAdminModule="dashboard">
      <AdminShell>
        <AdminDashboardPage />
      </AdminShell>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminIndexPage,
}
