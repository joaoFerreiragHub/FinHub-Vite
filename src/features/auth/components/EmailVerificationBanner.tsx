import { useState } from 'react'
import { Button } from '@/components/ui'
import { getErrorMessage } from '@/lib/api/client'
import { authService } from '../services/authService'
import { useAuthStore } from '../stores/useAuthStore'

type BannerFeedback = {
  kind: 'success' | 'error'
  message: string
}

const resolveEmailVerified = (user: unknown): boolean => {
  if (!user || typeof user !== 'object') {
    return false
  }

  const candidate = user as {
    isEmailVerified?: unknown
    emailVerified?: unknown
  }

  if (typeof candidate.isEmailVerified === 'boolean') {
    return candidate.isEmailVerified
  }

  if (typeof candidate.emailVerified === 'boolean') {
    return candidate.emailVerified
  }

  return false
}

export function EmailVerificationBanner() {
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<BannerFeedback | null>(null)

  if (!isAuthenticated || !user || resolveEmailVerified(user)) {
    return null
  }

  const handleResend = async () => {
    setFeedback(null)
    setIsSubmitting(true)

    try {
      const response = await authService.resendVerification()
      setFeedback({
        kind: 'success',
        message: response.message || 'Email de verificacao reenviado.',
      })
    } catch (error) {
      setFeedback({
        kind: 'error',
        message: getErrorMessage(error),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="border-b border-amber-300 bg-amber-50">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-sm font-semibold text-amber-900">Email por verificar</p>
          <p className="text-xs text-amber-800">
            Confirma o teu email para desbloquear funcionalidades de criacao e publicacao.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-amber-300 bg-white text-amber-900 hover:bg-amber-100"
          onClick={handleResend}
          isLoading={isSubmitting}
        >
          Reenviar email de verificacao
        </Button>
      </div>

      {feedback ? (
        <div className="mx-auto w-full max-w-[1600px] px-4 pb-3 text-xs sm:px-6 lg:px-8">
          <p className={feedback.kind === 'error' ? 'text-red-700' : 'text-emerald-700'}>
            {feedback.message}
          </p>
        </div>
      ) : null}
    </section>
  )
}
