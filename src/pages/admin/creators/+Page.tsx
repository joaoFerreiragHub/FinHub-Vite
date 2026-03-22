import CreatorsRiskBoardPage from '@/features/admin/pages/CreatorsRiskBoardPage'
import { ProtectedRoute } from '@/shared/guards'
import { AdminShell } from '@/shared/layouts'

function AdminCreatorsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']} requiredAdminModule="creators">
      <AdminShell>
        <CreatorsRiskBoardPage />
      </AdminShell>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminCreatorsPage,
}
