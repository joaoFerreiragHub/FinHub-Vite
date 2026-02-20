import ContentModerationPage from '@/features/admin/pages/ContentModerationPage'
import { ProtectedRoute } from '@/shared/guards'

function AdminContentPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="mx-auto max-w-7xl p-6">
        <ContentModerationPage />
      </div>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminContentPage,
}
