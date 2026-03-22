import ContentModerationPage from '@/features/admin/pages/ContentModerationPage'
import { ProtectedRoute } from '@/shared/guards'
import { AdminShell } from '@/shared/layouts'

function AdminContentPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']} requiredAdminModule="content">
      <AdminShell>
        <ContentModerationPage />
      </AdminShell>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminContentPage,
}
