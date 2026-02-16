import { Link } from 'react-router-dom'

/**
 * Header principal da aplicação (público)
 * TODO: Implementar navegação completa, search, user menu
 */
export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900">FinHub</span>
          </Link>

          {/* Navigation - TODO: Implementar menu completo */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/explorar/tudo" className="text-gray-700 hover:text-blue-600">
              Explorar
            </Link>
            <Link to="/criadores" className="text-gray-700 hover:text-blue-600">
              Criadores
            </Link>
            <Link to="/recursos" className="text-gray-700 hover:text-blue-600">
              Recursos
            </Link>
            <Link to="/aprender" className="text-gray-700 hover:text-blue-600">
              Aprender
            </Link>
          </nav>

          {/* Actions - TODO: Implementar search, notif, user menu */}
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">
              Entrar
            </Link>
            <Link
              to="/registar"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              Começar
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
