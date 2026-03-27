import React from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { Router, createPath, type Navigator, type To } from '@/lib/reactRouterDomCompat'
import { ToastContainer } from 'react-toastify'
import { JsonLd } from '@/components/seo/JsonLd'
import { HelmetProvider } from '@/lib/helmet'
import { usePlatformRuntimeConfig } from '@/features/platform/hooks/usePlatformRuntimeConfig'
import { platformRuntimeConfigService } from '@/features/platform/services/platformRuntimeConfigService'
import type { PageContext } from '../lib/types/pageContext'
import { queryClient } from '../lib/react-query-client'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { UserRole } from '@/features/auth/types'
import { PublicShell, UnifiedTopShell } from '../shared/layouts'
import { DevUserSwitcher } from '../shared/dev'
import { ThemeProvider } from '../shared/providers/ThemeProvider'
import { OnboardingOverlay } from '@/features/onboarding'
import { CookieBanner } from '@/components/consent/CookieBanner'

const PageContextContext = React.createContext<PageContext | null>(null)

export function usePageContext() {
  const context = React.useContext(PageContextContext)
  if (!context) {
    throw new Error('usePageContext must be used within PageContextProvider')
  }
  return context
}

interface Props {
  children: React.ReactNode
  pageContext: PageContext
}

const isPathOrSubpath = (pathname: string, prefix: string): boolean =>
  pathname === prefix || pathname.startsWith(`${prefix}/`)

const shouldBypassShellLayout = (pathname: string): boolean => {
  if (pathname === '/beta' || pathname.startsWith('/beta/')) return true
  if (isPathOrSubpath(pathname, '/admin')) return true
  if (isPathOrSubpath(pathname, '/creators/dashboard')) return true
  if (isPathOrSubpath(pathname, '/marcas/portal')) return true
  if (isPathOrSubpath(pathname, '/conta')) return true

  return (
    isPathOrSubpath(pathname, '/creators/definicoes') ||
    isPathOrSubpath(pathname, '/creators/estatisticas') ||
    isPathOrSubpath(pathname, '/creators/progresso')
  )
}

const BETA_MODE = import.meta.env.VITE_BETA_MODE === 'true'
const BETA_EXEMPT = [
  '/beta',
  '/login',
  '/registar',
  '/privacidade',
  '/termos',
  '/cookies',
  '/aviso-legal',
  '/faq',
  '/sobre',
  '/contacto',
  '/legal/privacidade',
  '/legal/termos',
  '/legal/cookies',
]

const toRouterLocation = (pageContext: PageContext) => {
  const candidate = pageContext.urlOriginal ?? pageContext.urlPathname ?? '/'
  const fallbackPath = pageContext.urlPathname ?? '/'

  const parsedUrl = (() => {
    try {
      return new URL(candidate.startsWith('/') ? `http://localhost${candidate}` : candidate)
    } catch {
      return new URL(`http://localhost${fallbackPath}`)
    }
  })()

  return {
    pathname: parsedUrl.pathname,
    search: parsedUrl.search,
    hash: parsedUrl.hash,
  }
}

const readHistoryUserState = (): unknown => {
  if (typeof window === 'undefined') {
    return null
  }
  if (!window.history.state || typeof window.history.state !== 'object') {
    return null
  }

  return (window.history.state as Record<string, unknown>).usr ?? null
}

const persistHistoryUserState = (state: unknown) => {
  if (typeof window === 'undefined') {
    return
  }

  const currentState =
    window.history.state && typeof window.history.state === 'object'
      ? (window.history.state as Record<string, unknown>)
      : {}

  if (state === undefined) {
    if (!('usr' in currentState)) {
      return
    }
    const rest = { ...currentState }
    delete rest['usr']
    window.history.replaceState(
      rest,
      '',
      `${window.location.pathname}${window.location.search}${window.location.hash}`,
    )
    return
  }

  window.history.replaceState(
    { ...currentState, usr: state },
    '',
    `${window.location.pathname}${window.location.search}${window.location.hash}`,
  )
}

const toHref = (to: To): string => (typeof to === 'string' ? to : createPath(to))

function VikeRouter({
  pageContext,
  children,
}: {
  pageContext: PageContext
  children: React.ReactNode
}) {
  const locationBase = toRouterLocation(pageContext)
  const location = {
    ...locationBase,
    state: readHistoryUserState(),
    key: `${locationBase.pathname}${locationBase.search}${locationBase.hash}`,
  }

  const navigator = React.useMemo<Navigator>(
    () => ({
      createHref(to: To) {
        return toHref(to)
      },
      push(to: To, state?: unknown) {
        const href = toHref(to)
        if (typeof window === 'undefined') {
          return
        }
        persistHistoryUserState(state)
        window.location.assign(href)
      },
      replace(to: To, state?: unknown) {
        const href = toHref(to)
        if (typeof window === 'undefined') {
          return
        }
        persistHistoryUserState(state)
        window.location.replace(href)
      },
      go(delta: number) {
        if (typeof window === 'undefined') {
          return
        }
        window.history.go(delta)
      },
    }),
    [],
  )

  return (
    <Router location={location} navigationType="POP" navigator={navigator}>
      {children}
    </Router>
  )
}

function OrganizationJsonLd() {
  const runtimeConfigQuery = usePlatformRuntimeConfig()
  const runtimeConfig = runtimeConfigQuery.data ?? platformRuntimeConfigService.getFallback()
  const siteUrl = runtimeConfig.seo.siteUrl.replace(/\/$/, '')

  const schema = React.useMemo<Record<string, unknown>>(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: runtimeConfig.seo.siteName,
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      description:
        runtimeConfig.seo.defaultDescription || 'Plataforma portuguesa de educacao financeira',
    }),
    [runtimeConfig.seo.defaultDescription, runtimeConfig.seo.siteName, siteUrl],
  )

  return <JsonLd schema={schema} />
}

export function PageShell({ children, pageContext }: Props) {
  const { user, isAuthenticated, hydrated } = useAuthStore()
  const [mounted, setMounted] = React.useState(false)
  const pathname = pageContext.urlPathname ?? '/'

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (pageContext.user) {
      // sync pageContext.user when needed
      // useAuthStore.setState({ user: pageContext.user })
    }
  }, [pageContext.user])

  React.useEffect(() => {
    if (!mounted) return
    if (!hydrated) return
    if (!BETA_MODE) return
    if (isAuthenticated) return
    if (typeof window === 'undefined') return

    const currentPath = window.location.pathname || pathname
    const isExempt = BETA_EXEMPT.some(
      (path) => currentPath === path || currentPath.startsWith(`${path}/`),
    )

    if (!isExempt) {
      window.location.replace('/beta')
    }
  }, [mounted, hydrated, isAuthenticated, pathname])

  const role = user?.role ?? UserRole.VISITOR
  const bypassShellLayout = shouldBypassShellLayout(pathname)
  const useAuthShell = mounted && hydrated && isAuthenticated && role !== UserRole.VISITOR
  const clientPathname =
    mounted && typeof window !== 'undefined' ? window.location.pathname : pathname
  const shouldRenderOnboarding =
    mounted && clientPathname === '/' && !shouldBypassShellLayout(clientPathname)

  return (
    <HelmetProvider>
      <VikeRouter pageContext={pageContext}>
        <PageContextContext.Provider value={pageContext}>
          <QueryClientProvider client={queryClient}>
            <OrganizationJsonLd />
            <ThemeProvider>
              <TooltipProvider>
                {bypassShellLayout ? (
                  <>
                    {children}
                    <ToastContainer
                      position="top-right"
                      autoClose={3000}
                      hideProgressBar={false}
                      closeOnClick
                      pauseOnHover
                      theme="colored"
                    />
                  </>
                ) : useAuthShell ? (
                  <UnifiedTopShell currentPath={pathname}>
                    {children}
                    <ToastContainer
                      position="top-right"
                      autoClose={3000}
                      hideProgressBar={false}
                      closeOnClick
                      pauseOnHover
                      theme="colored"
                    />
                  </UnifiedTopShell>
                ) : (
                  <PublicShell currentPath={pathname}>
                    {children}
                    <ToastContainer
                      position="top-right"
                      autoClose={3000}
                      hideProgressBar={false}
                      closeOnClick
                      pauseOnHover
                      theme="colored"
                    />
                  </PublicShell>
                )}
                {shouldRenderOnboarding ? <OnboardingOverlay /> : null}
                <CookieBanner />
                <DevUserSwitcher />
              </TooltipProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </PageContextContext.Provider>
      </VikeRouter>
    </HelmetProvider>
  )
}
