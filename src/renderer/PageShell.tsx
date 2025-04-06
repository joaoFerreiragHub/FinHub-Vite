// src/renderer/PageShell.tsx
import { useEffect } from 'react'
import { useUserStore } from '../stores/useUserStore'
import PublicLayout from '../app/layout/PublicLayout'
import UserLayout from '../app/layout/UserLayout'
import { ThemeProvider } from '../components/providers/ThemeProvider'
import type { PageContext } from '../types/pageContext'

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
  }, [pageContext.user, setUser]) // bom incluir o setUser como dependência também

  const role = getRole()
  const Layout = !isAuthenticated || role === 'visitor' ? PublicLayout : UserLayout

  return (
    <ThemeProvider>
      <Layout>{children}</Layout>
    </ThemeProvider>
  )
}
