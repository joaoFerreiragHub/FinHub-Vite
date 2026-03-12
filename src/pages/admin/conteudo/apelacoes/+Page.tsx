import AdminModerationAppealsPage from '@/features/admin/pages/AdminModerationAppealsPage'
import { ProtectedRoute } from '@/shared/guards'

function AdminModerationAppealsRoutePage() {
  return (
    <ProtectedRoute allowedRoles={['admin']} requiredAdminModule="content">
      <div className="mx-auto max-w-7xl p-6">
        <AdminModerationAppealsPage />
      </div>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminModerationAppealsRoutePage,
}
