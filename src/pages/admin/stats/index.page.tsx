import StatsPage from '@/features/admin/pages/StatsPage'
import { ProtectedRoute } from '@/shared/guards'

function AdminStatsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']} requiredAdminModule="stats">
      <div className="mx-auto max-w-7xl p-6">
        <StatsPage />
      </div>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminStatsPage,
}
