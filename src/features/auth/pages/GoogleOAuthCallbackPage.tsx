import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui'
import { authService } from '../services/authService'
import { useAuthStore } from '../stores/useAuthStore'
import { getErrorMessage } from '@/lib/api/client'
import { trackLoginSuccess } from '@/lib/analytics'

const parseOAuthCallbackParams = () => {
  const hash = window.location.hash.startsWith('#')
    ? window.location.hash.slice(1)
    : window.location.hash
  const hashParams = new URLSearchParams(hash)
  const searchParams = new URLSearchParams(window.location.search)

  const readParam = (key: string): string | null => hashParams.get(key) ?? searchParams.get(key)

  return {
    accessToken: readParam('accessToken'),
    refreshToken: readParam('refreshToken'),
    redirectPath: readParam('redirectPath'),
    error: readParam('error'),
    errorDescription: readParam('errorDescription'),
  }
}

const normalizeRedirectPath = (path: string | null): string => {
  if (!path || !path.startsWith('/') || path.startsWith('//')) {
    return '/dashboard'
  }
  return path
}

export default function GoogleOAuthCallbackPage() {
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      const params = parseOAuthCallbackParams()

      if (params.error) {
        const details = params.errorDescription ? `: ${params.errorDescription}` : ''
        setErrorMessage(`OAuth Google falhou (${params.error}${details})`)
        return
      }

      if (!params.accessToken || !params.refreshToken) {
        setErrorMessage('Callback OAuth invalido: tokens em falta.')
        return
      }

      try {
        const meResponse = await authService.getCurrentUserWithAccessToken(params.accessToken)
        if (cancelled) return

        setUser(meResponse.user, params.accessToken, params.refreshToken)
        trackLoginSuccess('google', normalizeRedirectPath(params.redirectPath))

        if (typeof window !== 'undefined') {
          window.history.replaceState({}, document.title, window.location.pathname)
        }

        navigate(normalizeRedirectPath(params.redirectPath), { replace: true })
      } catch (error) {
        if (cancelled) return
        setErrorMessage(getErrorMessage(error))
      }
    }

    run().catch((error) => {
      if (!cancelled) {
        setErrorMessage(getErrorMessage(error))
      }
    })

    return () => {
      cancelled = true
    }
  }, [navigate, setUser])

  if (errorMessage) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-semibold">Falha na autenticacao Google</h1>
        <p className="text-sm text-muted-foreground">{errorMessage}</p>
        <Button asChild>
          <Link to="/login">Voltar ao login</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">A concluir login com Google</h1>
      <p className="text-sm text-muted-foreground">Estamos a validar a tua conta.</p>
    </div>
  )
}
