import { Outlet } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AssistedSessionBanner from '@/features/admin/components/AssistedSessionBanner'
import { PublicRouteSeo } from '@/components/seo/PublicRouteSeo'
import { PageTracker } from '@/shared/providers'

/**
 * Layout principal da aplicação (público)
 * Usado para: Homepage, Explorar, Criadores, Recursos, Aprender, etc.
 */
export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PublicRouteSeo />
      <PageTracker />
      <Header />
      <AssistedSessionBanner />

      <main className="relative z-0 flex-1 pt-2">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
