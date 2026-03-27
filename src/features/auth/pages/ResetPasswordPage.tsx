import { Link, useSearchParams } from '@/lib/reactRouterDomCompat'
import { Button } from '@/components/ui'
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')?.trim() ?? ''

  if (!token) {
    return (
      <section className="space-y-5">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Link invalido</h1>
          <p className="text-sm text-muted-foreground">
            O link de reset esta incompleto ou expirou. Pede um novo email de recuperacao.
          </p>
        </div>

        <Button asChild size="lg" className="w-full">
          <Link to="/esqueci-password">Pedir novo link</Link>
        </Button>
      </section>
    )
  }

  return (
    <section className="space-y-5">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Redefinir password</h1>
        <p className="text-sm text-muted-foreground">
          Define uma nova password para voltares a aceder a tua conta.
        </p>
      </div>
      <ResetPasswordForm token={token} />
    </section>
  )
}
