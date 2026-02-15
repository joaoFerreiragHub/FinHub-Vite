// pages/creator/gamification/index.page.tsx

import { ProtectedRoute } from '@/shared/guards'
import CreatorSidebar from '@/features/creators/components/sidebar/creatorSidebar'
import GamificationDashboard from '@/features/creators/components/gamification/GamificationDashboard'

function GamificationPage() {
  return (
    <ProtectedRoute allowedRoles={['creator', 'admin']}>
      <div className="flex min-h-screen">
        <CreatorSidebar />
        <main className="flex-1 bg-background text-foreground p-6">
          <GamificationDashboard />
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default {
  Page: GamificationPage,
}
