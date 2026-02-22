import EditorialCmsPage from '@/features/admin/pages/EditorialCmsPage'
import { ProtectedRoute } from '@/shared/guards'

function AdminEditorialCmsPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="mx-auto max-w-7xl p-6">
        <EditorialCmsPage />
      </div>
    </ProtectedRoute>
  )
}

export default {
  Page: AdminEditorialCmsPage,
}
