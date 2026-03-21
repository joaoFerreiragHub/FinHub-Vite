import { useEffect, useState } from 'react'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { UserRole } from '@/features/auth/types'
import { PublicLayout, UserLayout } from '../shared/layouts'
import { ThemeProvider } from '../shared/providers/ThemeProvider'
import type { PageContext } from '../lib/types/pageContext'
import React from 'react'
import { ToastContainer } from 'react-toastify'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../lib/react-query-client'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { DevUserSwitcher } from '../shared/dev'
import { Router, createPath, type Navigator, type To } from 'react-router-dom'
import { HelmetProvider } from '@/lib/helmet'
import { navigate as vikeNavigate } from 'vike/client/router'

// Create PageContext for component consumption
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
  // Defer layout switch until after hydration to prevent server/client mismatch.
  // Server always renders PublicLayout (user=null). If we read zustand's persisted
  // state immediately, the client would render UserLayout while the server HTML
  // has PublicLayout, causing React hydration to fail silently and killing all
  // interactivity (clicks, navigation, etc.).
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (pageContext.user) {
      // Sync page context user if needed
      // useAuthStore.setState({ user: pageContext.user })
    }
  }, [pageContext.user])

  const role = user?.role ?? UserRole.VISITOR
  const useAuthLayout = mounted && isAuthenticated && role !== UserRole.VISITOR
  const Layout = useAuthLayout ? UserLayout : PublicLayout

  return (
    <HelmetProvider>
      <VikeRouter pageContext={pageContext}>
        <PageContextContext.Provider value={pageContext}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <TooltipProvider>
                <Layout>
                  {children}
                  <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    closeOnClick
                    pauseOnHover
                    theme="colored"
                  />
                </Layout>
                {/* Dev Tools - Só aparece em desenvolvimento */}
                <DevUserSwitcher />
              </TooltipProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </PageContextContext.Provider>
      </VikeRouter>
    </HelmetProvider>
  )
}
