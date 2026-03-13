import AdminAdPartnershipsPage from '@/features/admin/pages/AdminAdPartnershipsPage'
import { ProtectedRoute } from '@/shared/guards'

function AdminOperationsAdsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']} requiredAdminModule="operations">
      <div className="mx-auto max-w-7xl p-6">
        <AdminAdPartnershipsPage />
      </div>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminOperationsAdsPage,
}
