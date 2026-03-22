import { useEffect } from 'react'
import { Helmet } from '@/lib/helmet'
import LoginPage from '@/features/auth/pages/LoginPage'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'

export function Page() {
  const { isAuthenticated } = useAuthStore()

  // Redirect if already authenticated (client-side only — SSR safe)
  useEffect(() => {
    if (isAuthenticated && typeof window !== 'undefined') {
      window.location.replace('/')
    }
  }, [isAuthenticated])

  return (
    <>
      <Helmet>
        <title>Entrar | FinHub</title>
        <meta name="description" content="Inicia sessao na tua conta FinHub." />
      </Helmet>
      <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card/95 p-6 shadow-lg sm:p-8">
          <LoginPage />
        </div>
      </div>
    </>
  )
}
