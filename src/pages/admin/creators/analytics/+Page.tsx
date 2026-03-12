import AdminCreatorsPositiveAnalyticsPage from '@/features/admin/pages/AdminCreatorsPositiveAnalyticsPage'
import { ProtectedRoute } from '@/shared/guards'

function AdminCreatorsPositiveAnalyticsRoutePage() {
  return (
    <ProtectedRoute allowedRoles={['admin']} requiredAdminModule="creators">
      <div className="mx-auto max-w-7xl p-6">
        <AdminCreatorsPositiveAnalyticsPage />
      </div>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminCreatorsPositiveAnalyticsRoutePage,
}
