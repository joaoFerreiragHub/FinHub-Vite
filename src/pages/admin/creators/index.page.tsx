import CreatorsRiskBoardPage from '@/features/admin/pages/CreatorsRiskBoardPage'
import { ProtectedRoute } from '@/shared/guards'

function AdminCreatorsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="mx-auto max-w-7xl p-6">
        <CreatorsRiskBoardPage />
      </div>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminCreatorsPage,
}
