import { Outlet } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

/**
 * Layout principal da aplicação (público)
 * Usado para: Homepage, Explorar, Criadores, Recursos, Aprender, etc.
 */
export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
