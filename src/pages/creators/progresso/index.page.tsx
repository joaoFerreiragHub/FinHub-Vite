// pages/creator/gamification/index.page.tsx

import ProtectedRoute from "../../../components/auth/ProtectedRoute"
import CreatorSidebar from "../../../components/creators/sidebar/creatorSidebar"
import GamificationDashboard from "../../../components/creators/gamification/GamificationDashboard"

function GamificationPage() {
  return (
    <ProtectedRoute allowedRoles={["creator", "admin"]}>
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
