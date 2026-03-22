import AdminBulkImportPage from '@/features/admin/pages/AdminBulkImportPage'
import { ProtectedRoute } from '@/shared/guards'
import { AdminShell } from '@/shared/layouts'

function AdminOperationsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']} requiredAdminModule="operations">
      <AdminShell>
        <AdminBulkImportPage />
      </AdminShell>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminOperationsPage,
}
