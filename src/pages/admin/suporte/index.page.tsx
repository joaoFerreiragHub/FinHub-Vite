import AssistedSessionsPage from '@/features/admin/pages/AssistedSessionsPage'
import { ProtectedRoute } from '@/shared/guards'

function AdminSupportPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="mx-auto max-w-7xl p-6">
        <AssistedSessionsPage />
      </div>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminSupportPage,
}
