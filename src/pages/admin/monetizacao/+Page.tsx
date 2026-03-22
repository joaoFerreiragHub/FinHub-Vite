import AdminMonetizationPaywallPage from '@/features/admin/pages/AdminMonetizationPaywallPage'
import { ProtectedRoute } from '@/shared/guards'
import { AdminShell } from '@/shared/layouts'

function AdminMonetizationPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']} requiredAdminModule="monetization">
      <AdminShell>
        <AdminMonetizationPaywallPage />
      </AdminShell>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminMonetizationPage,
}
