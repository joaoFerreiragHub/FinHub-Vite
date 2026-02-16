import { Link, useLocation } from 'react-router-dom'

/**
 * Sidebar do Creator Dashboard
 * TODO: Adicionar ícones, active state styling, collapse/expand
 */
export default function DashboardSidebar() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const links = [
    { path: '/dashboard', label: 'Overview' },
    { path: '/dashboard/conteudo', label: 'Meu Conteúdo' },
    { path: '/dashboard/criar', label: 'Criar Novo' },
    { path: '/dashboard/analytics', label: 'Analytics' },
    { path: '/dashboard/seguidores', label: 'Seguidores' },
    { path: '/dashboard/perfil', label: 'Editar Perfil' },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
      <nav className="p-4">
        <ul className="space-y-1">
          {links.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  isActive(link.path)
                    ? 'bg-blue-50 text-blue-600 font-medium'
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
