import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm'

export default function ForgotPasswordPage() {
  return (
    <section className="space-y-5">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Recuperar password</h1>
        <p className="text-sm text-muted-foreground">
          Introduz o teu email para receberes um link de redefinicao.
        </p>
      </div>
      <ForgotPasswordForm />
    </section>
  )
}
