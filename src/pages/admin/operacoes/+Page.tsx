import AdminBulkImportPage from '@/features/admin/pages/AdminBulkImportPage'
import { ProtectedRoute } from '@/shared/guards'

function AdminOperationsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']} requiredAdminModule="operations">
      <div className="mx-auto max-w-7xl p-6">
        <AdminBulkImportPage />
      </div>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminOperationsPage,
}
