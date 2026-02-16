import { Outlet } from 'react-router-dom'
import DashboardHeader from '../components/DashboardHeader'
import DashboardSidebar from '../components/DashboardSidebar'

/**
 * Layout do Creator Dashboard
 * Com header específico e sidebar de navegação
 */
export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="flex">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
