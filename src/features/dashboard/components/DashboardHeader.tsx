import { Link } from 'react-router-dom'
import { Menu, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui'

interface DashboardHeaderProps {
  onMenuToggle: () => void
}

export default function DashboardHeader({ onMenuToggle }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuToggle}
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-xs font-bold">F</span>
            </div>
            <span className="text-sm font-semibold sm:text-base">FinHub</span>
          </Link>
          <span className="hidden text-muted-foreground lg:inline">/ Dashboard</span>
        </div>

        <Button asChild size="sm" className="gap-1.5">
          <Link to="/dashboard/criar">
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Criar conteudo</span>
            <span className="sm:hidden">Criar</span>
          </Link>
        </Button>
      </div>
    </header>
  )
}
