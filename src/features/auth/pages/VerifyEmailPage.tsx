import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui'
import { getErrorMessage } from '@/lib/api/client'
import { authService } from '../services/authService'
import { useAuthStore } from '../stores/useAuthStore'

type VerificationStatus = 'loading' | 'success' | 'error'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')?.trim() ?? ''
  const updateUser = useAuthStore((state) => state.updateUser)
  const [attempt, setAttempt] = useState(0)
  const [status, setStatus] = useState<VerificationStatus>(token ? 'loading' : 'error')
  const [errorMessage, setErrorMessage] = useState<string | null>(
    token ? null : 'Link de verificacao invalido ou incompleto.'
  )

  useEffect(() => {
    let cancelled = false

    if (!token) {
      setStatus('error')
      setErrorMessage('Link de verificacao invalido ou incompleto.')
      return () => {
        cancelled = true
      }
    }

    setStatus('loading')
    setErrorMessage(null)

    authService
      .verifyEmail(token)
      .then(() => {
        if (!cancelled) {
          updateUser({ isEmailVerified: true })
          setStatus('success')
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setStatus('error')
          setErrorMessage(getErrorMessage(error))
        }
      })

    return () => {
      cancelled = true
    }
  }, [attempt, token, updateUser])

  if (status === 'loading') {
    return (
      <section className="space-y-5 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">A verificar email</h1>
        <p className="text-sm text-muted-foreground">
          Estamos a validar o teu link de confirmacao.
        </p>
      </section>
    )
  }

  if (status === 'success') {
    return (
      <section className="space-y-5">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <p className="font-medium">Email verificado com sucesso</p>
          <p className="mt-1">A tua conta esta confirmada e pronta a usar.</p>
        </div>
        <Button asChild size="lg" className="w-full">
          <Link to="/login">Entrar na conta</Link>
        </Button>
      </section>
    )
  }

  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        <p className="font-medium">Nao foi possivel verificar o email</p>
        <p className="mt-1">
          {errorMessage ??
            'O link pode ter expirado. Tenta novamente com um novo email de verificacao.'}
        </p>
      </div>

      <div className="space-y-3">
        {token ? (
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => setAttempt((value) => value + 1)}
          >
            Tentar novamente
          </Button>
        ) : null}
        <Button asChild size="lg" className="w-full">
          <Link to="/login">Ir para login</Link>
        </Button>
      </div>
    </section>
  )
}
