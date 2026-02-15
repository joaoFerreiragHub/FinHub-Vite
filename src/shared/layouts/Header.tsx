import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { ToggleThemeSimple as ToggleTheme } from '@/components/ui'

export function Header() {
  const user = useAuthStore((state) => state.user)
  const role = useAuthStore((state) => state.getRole())

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
