import AdminFinancialToolsPage from '@/features/admin/pages/AdminFinancialToolsPage'
import { ProtectedRoute } from '@/shared/guards'
import { AdminShell } from '@/shared/layouts'

function AdminStatsFinancialToolsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']} requiredAdminModule="stats">
      <AdminShell>
        <AdminFinancialToolsPage />
      </AdminShell>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminStatsFinancialToolsPage,
}
