import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { ToggleThemeSimple as ToggleTheme } from '@/components/ui'
import { NotificationBell } from '@/features/social/components/NotificationBell'
import { GlobalSearchBar } from '@/features/social/components/GlobalSearchBar'

export function Header() {
  const user = useAuthStore((state) => state.user)
  const role = useAuthStore((state) => state.getRole())
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const profileHref = role === 'admin' ? '/admin' : '/perfil'

  return (
    <header className="w-full px-6 py-3 border-b bg-background flex items-center justify-between gap-4">
      <h1 className="text-xl font-semibold flex-shrink-0">
        {role === 'admin' ? 'Painel de Administracao' : 'FinHub'}
      </h1>

      {/* Global Search */}
      <div className="flex-1 max-w-md mx-4 hidden sm:block">
        <GlobalSearchBar
          onNavigate={(url) => {
            window.location.href = url
          }}
        />
      </div>

      <div className="flex items-center gap-3">
        {isAuthenticated && (
          <NotificationBell
            onNavigateToNotifications={() => {
              window.location.href = '/notificacoes'
            }}
            onClickNotification={(n) => {
              if (n.targetUrl) window.location.href = n.targetUrl
            }}
          />
        )}

        {isAuthenticated && user && (
          <a
            href={profileHref}
            className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-accent"
          >
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-7 w-7 rounded-full" />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                {user.name.charAt(0)}
              </div>
            )}
            <span className="text-sm text-muted-foreground hidden md:inline">{user.name}</span>
          </a>
        )}

        <ToggleTheme />
      </div>
    </header>
  )
}
