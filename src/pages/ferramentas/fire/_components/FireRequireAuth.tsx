import { useEffect, type ReactNode } from 'react'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'

interface FireRequireAuthProps {
  children: ReactNode
}

export function FireRequireAuth({ children }: FireRequireAuthProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const hydrated = useAuthStore((state) => state.hydrated)

  useEffect(() => {
    if (!hydrated || isAuthenticated) {
      return
    }

    window.location.assign('/')
  }, [hydrated, isAuthenticated])

  if (!hydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        A carregar autenticacao...
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Acesso restrito. A redirecionar...
      </div>
    )
  }

  return <>{children}</>
}
