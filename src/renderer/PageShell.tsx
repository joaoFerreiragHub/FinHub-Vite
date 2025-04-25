import { useEffect } from 'react'
import { useUserStore } from '../stores/useUserStore'
import PublicLayout from '../app/layout/PublicLayout'
import UserLayout from '../app/layout/UserLayout'
import { ThemeProvider } from '../components/providers/ThemeProvider'
import type { PageContext } from '../types/pageContext'
import React from 'react'
import { ToastContainer } from 'react-toastify'

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
  const { isAuthenticated, getRole, setUser } = useUserStore()

  useEffect(() => {
    if (pageContext.user) {
      setUser(pageContext.user)
    }
  }, [pageContext.user, setUser])

  const role = getRole()
  const Layout = !isAuthenticated || role === 'visitor' ? PublicLayout : UserLayout

  return (
    <PageContextContext.Provider value={pageContext}>
      <ThemeProvider>
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
      </ThemeProvider>
    </PageContextContext.Provider>
  )
}
