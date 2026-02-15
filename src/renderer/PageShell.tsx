import { useEffect } from 'react'
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

export function PageShell({ children, pageContext }: Props) {
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (pageContext.user) {
      // Sync page context user if needed
      // useAuthStore.setState({ user: pageContext.user })
    }
  }, [pageContext.user])

  const role = user?.role ?? UserRole.VISITOR
  const Layout = !isAuthenticated || role === UserRole.VISITOR ? PublicLayout : UserLayout

  return (
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
  )
}
