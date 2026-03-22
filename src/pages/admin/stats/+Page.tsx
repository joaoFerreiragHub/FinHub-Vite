import StatsPage from '@/features/admin/pages/StatsPage'
import { ProtectedRoute } from '@/shared/guards'
import { AdminShell } from '@/shared/layouts'

function AdminStatsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']} requiredAdminModule="stats">
      <AdminShell>
        <StatsPage />
      </AdminShell>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminStatsPage,
}
