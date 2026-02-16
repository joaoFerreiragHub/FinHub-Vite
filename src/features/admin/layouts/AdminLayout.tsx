import { Outlet } from 'react-router-dom'
import AdminHeader from '../components/AdminHeader'
import AdminSidebar from '../components/AdminSidebar'

/**
 * Layout do Admin Panel
 * Com header e sidebar específicos para administração
 */
export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />

      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
