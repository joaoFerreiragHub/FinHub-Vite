import AdminMonetizationSubscriptionsPage from '@/features/admin/pages/AdminMonetizationSubscriptionsPage'
import { ProtectedRoute } from '@/shared/guards'

function AdminMonetizationSubscriptionsRoutePage() {
  return (
    <ProtectedRoute allowedRoles={['admin']} requiredAdminModule="monetization">
      <div className="mx-auto max-w-7xl p-6">
        <AdminMonetizationSubscriptionsPage />
      </div>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminMonetizationSubscriptionsRoutePage,
}
