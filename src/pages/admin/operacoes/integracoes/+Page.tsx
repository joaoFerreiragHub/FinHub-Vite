import AdminPlatformIntegrationsPage from '@/features/admin/pages/AdminPlatformIntegrationsPage'
import { ProtectedRoute } from '@/shared/guards'

function AdminOperationsIntegrationsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']} requiredAdminModule="operations">
      <div className="mx-auto max-w-7xl p-6">
        <AdminPlatformIntegrationsPage />
      </div>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminOperationsIntegrationsPage,
}
