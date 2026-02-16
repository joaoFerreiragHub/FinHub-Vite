import { Link } from 'react-router-dom'

/**
 * Header do Admin Panel
 * TODO: Implementar notificações, stats rápidas, user menu
 */
export default function AdminHeader() {
  return (
    <header className="bg-white border-b border-gray-300">
      <div className="px-8 py-4 flex items-center justify-between">
        {/* Logo + Admin Title */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">F</span>
            </div>
            <span className="text-lg font-bold text-gray-900">FinHub</span>
          </Link>
          <span className="text-gray-400">|</span>
          <span className="text-gray-700 font-medium">Admin Panel</span>
        </div>

        {/* Actions - TODO: Implementar */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Admin</span>
        </div>
      </div>
    </header>
  )
}
