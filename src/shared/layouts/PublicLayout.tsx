import { ReactNode } from 'react'

interface PublicLayoutProps {
  children: ReactNode
}

/**
 * Layout para páginas públicas (sem autenticação)
 *
 * Features:
 * - Header público (opcional)
 * - Footer (opcional)
 * - Sem sidebar
 */
export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* TODO: Adicionar header público */}
      <main>{children}</main>
      {/* TODO: Adicionar footer */}
    </div>
  )
}
