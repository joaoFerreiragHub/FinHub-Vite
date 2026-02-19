import { Outlet } from 'react-router-dom'
import Header from '@/components/layout/Header'

/**
 * Layout para autenticacao com visual alinhado ao restante produto.
 */
export default function AuthLayout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-64 w-64 -translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 translate-x-1/3 translate-y-1/3 rounded-full bg-primary/10 blur-3xl"
      />

      <Header />

      <main className="relative z-0 flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card/95 p-6 shadow-lg sm:p-8">
          <Outlet />
        </div>
      </main>

      <footer className="relative z-0 px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
        <p>&copy; 2026 FinHub. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
