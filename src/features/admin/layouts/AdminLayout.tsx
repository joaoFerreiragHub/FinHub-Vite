import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'
import Header from '@/components/layout/Header'
import AssistedSessionBanner from '../components/AssistedSessionBanner'
import { cn } from '@/lib/utils'

/**
 * Layout responsivo do painel de administracao.
 */
export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-muted/20 text-foreground">
      <Header
        onSidebarToggle={() => setMobileOpen((prev) => !prev)}
        sidebarToggleLabel="Abrir menu de administracao"
      />
      <AssistedSessionBanner />

      <div className="mx-auto flex w-full max-w-[1600px]">
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

        <main className="relative z-0 min-h-[calc(100vh-4rem)] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
