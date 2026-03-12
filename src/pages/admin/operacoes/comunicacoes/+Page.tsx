import AdminCommunicationsBroadcastsPage from '@/features/admin/pages/AdminCommunicationsBroadcastsPage'
import { ProtectedRoute } from '@/shared/guards'

function AdminOperationsCommunicationsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']} requiredAdminModule="operations">
      <div className="mx-auto max-w-7xl p-6">
        <AdminCommunicationsBroadcastsPage />
      </div>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminOperationsCommunicationsPage,
}
