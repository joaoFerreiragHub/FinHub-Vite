// src/app/layout/PublicLayout.tsx
import { ReactNode } from 'react'
import { ThemeProvider } from '../../components/providers/ThemeProvider'

interface PublicLayoutProps {
  children: ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        {/* Aqui poderás adicionar o header público, footer, etc */}
        <main>{children}</main>
      </div>
    </ThemeProvider>
  )
}
