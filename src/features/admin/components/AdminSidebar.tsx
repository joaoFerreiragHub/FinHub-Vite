import { Link, useLocation } from 'react-router-dom'

/**
 * Sidebar do Admin Panel
 * TODO: Adicionar ícones, stats inline, active state
 */
export default function AdminSidebar() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const links = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/users', label: 'Utilizadores' },
    { path: '/admin/conteudo', label: 'Moderação Conteúdo' },
    { path: '/admin/recursos', label: 'Gestão Recursos' },
    { path: '/admin/stats', label: 'Estatísticas' },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-300 min-h-[calc(100vh-4rem)]">
      <nav className="p-4">
        <ul className="space-y-1">
          {links.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  isActive(link.path)
                    ? 'bg-red-50 text-red-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
