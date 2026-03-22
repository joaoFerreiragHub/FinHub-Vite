import AdminMonetizationSubscriptionsPage from '@/features/admin/pages/AdminMonetizationSubscriptionsPage'
import { ProtectedRoute } from '@/shared/guards'
import { AdminShell } from '@/shared/layouts'

function AdminMonetizationSubscriptionsRoutePage() {
  return (
    <ProtectedRoute allowedRoles={['admin']} requiredAdminModule="monetization">
      <AdminShell>
        <AdminMonetizationSubscriptionsPage />
      </AdminShell>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminMonetizationSubscriptionsRoutePage,
}
