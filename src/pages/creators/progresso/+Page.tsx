import { ProtectedRoute } from '@/shared/guards'
import { CreatorDashboardShell } from '@/shared/layouts'
import GamificationDashboard from '@/features/creators/components/gamification/GamificationDashboard'

function GamificationPage() {
  return (
    <ProtectedRoute allowedRoles={['creator', 'admin']}>
      <CreatorDashboardShell>
        <GamificationDashboard />
      </CreatorDashboardShell>
    </ProtectedRoute>
  )
}

export default {
  Page: GamificationPage,
}
