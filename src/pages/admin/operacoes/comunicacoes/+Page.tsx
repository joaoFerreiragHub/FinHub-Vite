import AdminCommunicationsBroadcastsPage from '@/features/admin/pages/AdminCommunicationsBroadcastsPage'
import { ProtectedRoute } from '@/shared/guards'
import { AdminShell } from '@/shared/layouts'

function AdminOperationsCommunicationsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']} requiredAdminModule="operations">
      <AdminShell>
        <AdminCommunicationsBroadcastsPage />
      </AdminShell>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminOperationsCommunicationsPage,
}
