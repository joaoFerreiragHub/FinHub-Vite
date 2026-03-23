import { useEffect, useMemo, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button, ToggleTheme } from '@/components/ui'
import { CookieConsentBanner } from '@/features/auth/components/CookieConsentBanner'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { UserRole } from '@/features/auth/types'
import { GlobalSearchBar } from '@/features/social/components/GlobalSearchBar'
import { NotificationBell } from '@/features/social/components/NotificationBell'
import { ShellFooter, getMainNavLinks, getUserMenuItems, isMainNavActive } from './shellConfig'

interface UnifiedTopShellProps {
  children: React.ReactNode
  currentPath: string
}

export function UnifiedTopShell({ children, currentPath }: UnifiedTopShellProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const role = user?.role ?? UserRole.VISITOR
  const mainNavLinks = useMemo(() => getMainNavLinks(role), [role])
  const menuItems = useMemo(() => getUserMenuItems(role), [role])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className={`glass-header ${scrolled ? 'glass-header--scrolled' : ''}`}>
        <div className="flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1920px] mx-auto gap-2">
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Fin<span className="text-primary">Hub</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {mainNavLinks.map((navLink) => (
              <a
                key={navLink.path}
                href={navLink.path}
                className={`px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isMainNavActive(currentPath, navLink)
                    ? 'text-foreground bg-accent/60'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
                }`}
              >
                {navLink.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:block flex-1 max-w-sm">
            <GlobalSearchBar
              onNavigate={(url) => {
                window.location.href = url
              }}
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <NotificationBell
              onNavigateToNotifications={() => {
                window.location.href = '/notificacoes'
              }}
              onClickNotification={(notification) => {
                if (notification.targetUrl) {
                  window.location.href = notification.targetUrl
                }
              }}
            />

            <details className="relative hidden sm:block [&_summary::-webkit-details-marker]:hidden">
              <summary className="list-none cursor-pointer">
                <UserSummary user={user} />
              </summary>
              <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-card p-2 shadow-lg z-50">
                {menuItems.map((menuItem) =>
                  menuItem.isAction ? (
                    <button
                      key={menuItem.key}
                      type="button"
                      onClick={() => logout()}
                      className="w-full rounded-md px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      {menuItem.label}
                    </button>
                  ) : (
                    <a
                      key={menuItem.key}
                      href={menuItem.href}
                      className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      {menuItem.label}
                    </a>
                  ),
                )}
              </div>
            </details>

            <ToggleTheme />

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/30 bg-background/95 backdrop-blur-lg">
            <nav className="flex flex-col p-4 gap-1">
              {mainNavLinks.map((navLink) => {
                const Icon = navLink.icon
                return (
                  <a
                    key={navLink.path}
                    href={navLink.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isMainNavActive(currentPath, navLink)
                        ? 'text-foreground bg-accent'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {navLink.label}
                  </a>
                )
              })}

              <div className="mt-2 pt-2 border-t border-border/30">
                <div className="mb-2 px-2">
                  <GlobalSearchBar
                    onNavigate={(url) => {
                      setMobileMenuOpen(false)
                      window.location.href = url
                    }}
                  />
                </div>
                {menuItems.map((menuItem) =>
                  menuItem.isAction ? (
                    <button
                      key={menuItem.key}
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false)
                        logout()
                      }}
                      className="w-full rounded-md px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      {menuItem.label}
                    </button>
                  ) : (
                    <a
                      key={menuItem.key}
                      href={menuItem.href}
                      className="block rounded-md px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      {menuItem.label}
                    </a>
                  ),
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <main>{children}</main>
      <ShellFooter />
      <CookieConsentBanner />
    </div>
  )
}

function UserSummary({ user }: { user: { name: string; avatar?: string } | null }) {
  return (
    <span className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-accent/40">
      {user?.avatar ? (
        <img src={user.avatar} alt={user.name} className="h-7 w-7 rounded-full object-cover" />
      ) : (
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
          {user?.name?.charAt(0) ?? 'U'}
        </span>
      )}
      <span className="text-sm text-foreground hidden lg:inline max-w-28 truncate">
        {user?.name ?? 'Conta'}
      </span>
    </span>
  )
}
