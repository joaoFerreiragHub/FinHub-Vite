import AdminPlatformIntegrationsPage from '@/features/admin/pages/AdminPlatformIntegrationsPage'
import { ProtectedRoute } from '@/shared/guards'
import { AdminShell } from '@/shared/layouts'

function AdminOperationsIntegrationsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']} requiredAdminModule="operations">
      <AdminShell>
        <AdminPlatformIntegrationsPage />
      </AdminShell>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminOperationsIntegrationsPage,
}
