import AdminModerationAppealsPage from '@/features/admin/pages/AdminModerationAppealsPage'
import { ProtectedRoute } from '@/shared/guards'
import { AdminShell } from '@/shared/layouts'

function AdminModerationAppealsAliasRoutePage() {
  return (
    <ProtectedRoute
      allowedRoles={['admin']}
      requiredAdminModule="content"
      requiredAdminScopes={['admin.content.read']}
    >
      <AdminShell>
        <AdminModerationAppealsPage />
      </AdminShell>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminModerationAppealsAliasRoutePage,
}
