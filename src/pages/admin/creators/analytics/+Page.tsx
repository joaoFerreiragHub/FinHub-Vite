import AdminCreatorsPositiveAnalyticsPage from '@/features/admin/pages/AdminCreatorsPositiveAnalyticsPage'
import { ProtectedRoute } from '@/shared/guards'
import { AdminShell } from '@/shared/layouts'

function AdminCreatorsPositiveAnalyticsRoutePage() {
  return (
    <ProtectedRoute allowedRoles={['admin']} requiredAdminModule="creators">
      <AdminShell>
        <AdminCreatorsPositiveAnalyticsPage />
      </AdminShell>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminCreatorsPositiveAnalyticsRoutePage,
}
