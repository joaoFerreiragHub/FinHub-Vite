import React from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { Router, createPath, type Navigator, type To } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { navigate as vikeNavigate } from 'vike/client/router'
import { HelmetProvider } from '@/lib/helmet'
import type { PageContext } from '../lib/types/pageContext'
import { queryClient } from '../lib/react-query-client'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { UserRole } from '@/features/auth/types'
import { PublicShell, UnifiedTopShell } from '../shared/layouts'
import { DevUserSwitcher } from '../shared/dev'
import { ThemeProvider } from '../shared/providers/ThemeProvider'
import { OnboardingOverlay } from '@/features/onboarding'

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

const isExternalHref = (href: string): boolean => /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)

const isPathOrSubpath = (pathname: string, prefix: string): boolean =>
  pathname === prefix || pathname.startsWith(`${prefix}/`)

const shouldBypassShellLayout = (pathname: string): boolean => {
  if (isPathOrSubpath(pathname, '/admin')) return true
  if (isPathOrSubpath(pathname, '/creators/dashboard')) return true
  if (isPathOrSubpath(pathname, '/marcas/portal')) return true

  return (
    isPathOrSubpath(pathname, '/creators/definicoes') ||
    isPathOrSubpath(pathname, '/creators/estatisticas') ||
    isPathOrSubpath(pathname, '/creators/progresso')
  )
}

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
        if (isExternalHref(href)) {
          window.location.assign(href)
          return
        }
        void vikeNavigate(href).then(() => {
          persistHistoryUserState(state)
        })
      },
      replace(to: To, state?: unknown) {
        const href = toHref(to)
        if (typeof window === 'undefined') {
          return
        }
        if (isExternalHref(href)) {
          window.location.replace(href)
          return
        }
        void vikeNavigate(href, { overwriteLastHistoryEntry: true }).then(() => {
          persistHistoryUserState(state)
        })
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

export function PageShell({ children, pageContext }: Props) {
  const { user, isAuthenticated } = useAuthStore()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (pageContext.user) {
      // sync pageContext.user when needed
      // useAuthStore.setState({ user: pageContext.user })
    }
  }, [pageContext.user])

  const role = user?.role ?? UserRole.VISITOR
  const pathname = pageContext.urlPathname ?? '/'
  const bypassShellLayout = shouldBypassShellLayout(pathname)
  const useAuthShell = mounted && isAuthenticated && role !== UserRole.VISITOR

  return (
    <HelmetProvider>
      <VikeRouter pageContext={pageContext}>
        <PageContextContext.Provider value={pageContext}>
          <QueryClientProvider client={queryClient}>
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
                {mounted ? <OnboardingOverlay /> : null}
                <DevUserSwitcher />
              </TooltipProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </PageContextContext.Provider>
      </VikeRouter>
    </HelmetProvider>
  )
}
