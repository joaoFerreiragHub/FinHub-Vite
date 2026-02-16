import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'

/**
 * Layout para páginas de autenticação (Login, Register)
 * Layout minimalista sem header/footer completo
 */
export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Simple header with logo */}
      <header className="p-6">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">FinHub</span>
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Simple footer */}
      <footer className="p-6 text-center text-sm text-gray-600">
        <p>&copy; 2026 FinHub. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
