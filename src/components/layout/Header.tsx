import { useUserStore } from '../../stores/useUserStore'
import { ToggleThemeSimple as ToggleTheme } from '../ui/toggle-theme-simple'

export function Header() {
  const { user } = useUserStore()
  const role = useUserStore((state) => state.getRole())

  return (
    <header className="w-full px-6 py-4 border-b bg-background flex items-center justify-between">
      <h1 className="text-xl font-semibold">
        {role === 'admin' ? 'Painel de Administração' : 'Bem-vindo à Plataforma'}
      </h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">{user?.name || 'Convidado'}</span>
        <ToggleTheme />
      </div>
    </header>
  )
}
