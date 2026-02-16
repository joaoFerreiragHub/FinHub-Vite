import { Link } from 'react-router-dom'

/**
 * Header do Creator Dashboard
 * TODO: Implementar notificações, user menu, quick actions
 */
export default function DashboardHeader() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Logo + Dashboard Title */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">F</span>
            </div>
            <span className="text-lg font-bold text-gray-900">FinHub</span>
          </Link>
          <span className="text-gray-400">|</span>
          <span className="text-gray-700 font-medium">Dashboard Creator</span>
        </div>

        {/* Actions - TODO: Implementar */}
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard/criar"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm"
          >
            + Criar Conteúdo
          </Link>
        </div>
      </div>
    </header>
  )
}
