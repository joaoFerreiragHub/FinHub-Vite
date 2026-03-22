import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'
import AdminCommandPalette from '../components/AdminCommandPalette'
import Header from '@/components/layout/Header'
import AssistedSessionBanner from '../components/AssistedSessionBanner'
import { CookieConsentBanner } from '@/features/auth/components/CookieConsentBanner'
import { EmailVerificationBanner } from '@/features/auth/components/EmailVerificationBanner'
import { cn } from '@/lib/utils'
import { PageTracker } from '@/shared/providers'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { hasAdminScope } from '../lib/access'
import { useAdminDashboardPersonalization } from '../hooks/useAdminDashboardPersonalization'

/**
 * Layout responsivo do painel de administracao.
 */
/**
 * @deprecated Use AdminShell for Vike admin pages (/admin/*).
 * Kept only for legacy React Router flow in router.tsx.
 */
export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [systemPrefersDark, setSystemPrefersDark] = useState(false)
  const location = useLocation()
  const rootDarkBeforeAdminRef = useRef<boolean | null>(null)
  const user = useAuthStore((state) => state.user)
  const ultrawideContainerClass = 'max-w-[1920px]'
  const canReadDashboardPersonalization = hasAdminScope(user, 'admin.metrics.read')

  const personalizationQuery = useAdminDashboardPersonalization(canReadDashboardPersonalization)

  const preferredTheme = personalizationQuery.data?.preference.theme ?? 'system'
  const shouldApplyAdminThemeOverride = canReadDashboardPersonalization
  const shouldUseDarkTheme =
    preferredTheme === 'dark' || (preferredTheme === 'system' && systemPrefersDark)

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setSystemPrefersDark(mediaQuery.matches)

    const onChange = (event: MediaQueryListEvent) => setSystemPrefersDark(event.matches)
    mediaQuery.addEventListener('change', onChange)
    return () => mediaQuery.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement

    if (rootDarkBeforeAdminRef.current === null) {
      rootDarkBeforeAdminRef.current = root.classList.contains('dark')
    }

    if (!shouldApplyAdminThemeOverride) return

    root.classList.toggle('dark', shouldUseDarkTheme)
  }, [shouldApplyAdminThemeOverride, shouldUseDarkTheme])

  useEffect(() => {
    return () => {
      if (typeof document === 'undefined') return
      if (rootDarkBeforeAdminRef.current === null) return
      document.documentElement.classList.toggle('dark', rootDarkBeforeAdminRef.current)
    }
  }, [])

  return (
    <div
      className={cn(
        'min-h-screen bg-muted/20 text-foreground transition-colors',
        shouldUseDarkTheme && 'dark bg-slate-950/80 text-slate-100',
      )}
    >
      <PageTracker />
      <Header
        onSidebarToggle={() => setMobileOpen((prev) => !prev)}
        sidebarToggleLabel="Abrir menu de administracao"
        containerClassName={ultrawideContainerClass}
      />
      <AssistedSessionBanner containerClassName={ultrawideContainerClass} />
      <EmailVerificationBanner />
      <CookieConsentBanner />

      <div className={cn('mx-auto flex w-full', ultrawideContainerClass)}>
        <AdminSidebar className="sticky top-16 hidden h-[calc(100vh-4rem)] lg:block" />

        <div
          className={cn(
            'fixed inset-0 z-40 bg-background/70 backdrop-blur-sm transition-opacity lg:hidden',
            mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />

        <AdminSidebar
          className={cn(
            'fixed inset-y-16 left-0 z-[45] h-[calc(100vh-4rem)] w-72 transform transition-transform duration-200 lg:hidden',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
          )}
          onNavigate={() => setMobileOpen(false)}
        />

        <main className="relative z-0 min-h-[calc(100vh-4rem)] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8 2xl:px-10">
          <div className="mx-auto w-full">
            <AdminCommandPalette className="mb-4" />
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
