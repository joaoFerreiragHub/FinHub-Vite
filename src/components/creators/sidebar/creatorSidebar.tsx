import { useState, useEffect } from "react"
import { useUserStore } from "../../../stores/useUserStore"
import { Button } from "../../ui/button"
import { cn } from "../../../lib/utils"
import { creatorDashboardRouts } from "../../../routes/creatorDashboardRouts"
import { Progress } from "../../ui/progress"


export default function CreatorSidebar() {
  const { user } = useUserStore()
  const [currentPath, setCurrentPath] = useState<string>('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname)
    }
  }, [])

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
          <Progress value={60} className="h-2" /> {/* 60% de progresso para o próximo nível */}
        </div>

        {/* Navegação */}
        <nav className="flex flex-col gap-2">
          {creatorDashboardRouts.map(({ label, icon: Icon, path }) => (
            <a key={label} href={path} className="w-full">
              <Button
                variant="ghost"
                className={cn("justify-start w-full", currentPath === path && "bg-muted text-primary")}
              >
                <Icon className="w-5 h-5 mr-2" />
                {label}
              </Button>
            </a>
          ))}
        </nav>
      </div>

      {/* Definições rápidas */}
      <div className="mt-6 border-t border-border pt-4 text-center text-xs text-muted-foreground">
        <span>FinHub © 2025</span>
      </div>
    </aside>
  )
}
