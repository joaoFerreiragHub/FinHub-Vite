// src/app/layout/UserLayout.tsx
import { ReactNode } from 'react'
import { useUserStore } from '../../stores/useUserStore'
import { ThemeProvider } from '../../components/providers/ThemeProvider'

import { Header } from '../../components/layout/Header'

interface UserLayoutProps {
  children: ReactNode
}

export default function UserLayout({ children }: UserLayoutProps) {
  const role = useUserStore((state) => state.getRole())

  if (role === 'visitor') {
    return <div className="p-6">Acesso restrito. Faz login para continuares.</div>
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen flex bg-background text-foreground">
        <main className="flex-1">
          <Header />
          {children}
        </main>
      </div>
    </ThemeProvider>
  )
}
