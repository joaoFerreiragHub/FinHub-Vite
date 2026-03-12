import AdminFinancialToolsPage from '@/features/admin/pages/AdminFinancialToolsPage'
import { ProtectedRoute } from '@/shared/guards'

function AdminStatsFinancialToolsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']} requiredAdminModule="stats">
      <div className="mx-auto max-w-7xl p-6">
        <AdminFinancialToolsPage />
      </div>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminStatsFinancialToolsPage,
}
