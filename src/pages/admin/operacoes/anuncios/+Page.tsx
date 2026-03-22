import AdminAdPartnershipsPage from '@/features/admin/pages/AdminAdPartnershipsPage'
import { ProtectedRoute } from '@/shared/guards'
import { AdminShell } from '@/shared/layouts'

function AdminOperationsAdsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']} requiredAdminModule="operations">
      <AdminShell>
        <AdminAdPartnershipsPage />
      </AdminShell>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminOperationsAdsPage,
}
