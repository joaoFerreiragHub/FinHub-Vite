import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useUserStore } from '../../../stores/useUserStore'
import { Button } from '../../ui/button'
import { cn } from '../../../lib/utils'
import { creatorDashboardRouts } from '../../../routes/creatorDashboardRouts'
import { Progress } from '../../ui/progress'

export default function CreatorSidebar() {
  const { user } = useUserStore()
  const [currentPath, setCurrentPath] = useState<string>('')
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname)
    }
  }, [])

  // Verifica se algum filho está ativo
  const isActiveGroup = (children: { path: string }[]) =>
    children.some((child) => currentPath.startsWith(child.path))

  // Alterna menu dropdown
  const toggleMenu = (label: string, children?: { path: string }[]) => {
    const isActive = children && isActiveGroup(children)
    setExpandedMenus((prev) => {
      if (isActive) return [...new Set([...prev, label])]
      return prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    })
  }

  // Abre dropdown se alguma rota filha estiver ativa
  useEffect(() => {
    creatorDashboardRouts.forEach((route) => {
      if (route.children && isActiveGroup(route.children)) {
        setExpandedMenus((prev) => [...new Set([...prev, route.label])])
      }
    })
  }, [currentPath])

  return (
    <aside className="w-64 bg-card text-card-foreground shadow-md p-4 flex flex-col justify-between min-h-screen">
      {/* Perfil do Criador */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <img
            src={user?.avatar || '/default-avatar.png'}
            alt="Avatar do Criador"
            className="w-12 h-12 rounded-full border border-primary"
          />
          <div>
            <div className="font-semibold">{user?.username || 'Criador'}</div>
            <div className="text-xs text-muted-foreground">{user?.email}</div>
          </div>
        </div>

        {/* XP/Nível */}
        <div className="mb-4">
          <div className="text-xs font-medium mb-1">Nível 3 - 120 XP</div>
          <Progress value={60} className="h-2" />
        </div>

        {/* Navegação */}
        <nav className="flex flex-col gap-2">
          {creatorDashboardRouts.map(({ label, icon: Icon, path, children }) => (
            <div key={label}>
              {path ? (
                <a href={path} className="w-full">
                  <Button
                    variant="ghost"
                    className={cn(
                      'justify-start w-full',
                      currentPath === path && 'bg-muted text-primary',
                    )}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {label}
                  </Button>
                </a>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="justify-start w-full flex items-center"
                    onClick={() => toggleMenu(label, children)}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {label}
                    {expandedMenus.includes(label) ? (
                      <ChevronUp className="w-4 h-4 ml-auto" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-auto" />
                    )}
                  </Button>
                  {expandedMenus.includes(label) && children && (
                    <div className="ml-6 flex flex-col gap-1">
                      {children.map((child) => (
                        <a key={child.label} href={child.path}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              'justify-start w-full text-sm',
                              currentPath === child.path && 'bg-muted text-primary',
                            )}
                          >
                            {child.label}
                          </Button>
                        </a>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Rodapé */}
      <div className="mt-6 border-t border-border pt-4 text-center text-xs text-muted-foreground">
        <span>FinHub © 2025</span>
      </div>
    </aside>
  )
}
