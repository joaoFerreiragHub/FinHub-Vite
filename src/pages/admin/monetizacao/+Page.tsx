import AdminMonetizationPaywallPage from '@/features/admin/pages/AdminMonetizationPaywallPage'
import { ProtectedRoute } from '@/shared/guards'

function AdminMonetizationPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']} requiredAdminModule="monetization">
      <div className="mx-auto max-w-7xl p-6">
        <AdminMonetizationPaywallPage />
      </div>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminMonetizationPage,
}
