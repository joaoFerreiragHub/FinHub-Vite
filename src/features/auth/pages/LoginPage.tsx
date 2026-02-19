import { LoginForm } from '@/features/auth/components/LoginForm'

export default function LoginPage() {
  return (
    <section className="space-y-5">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Entrar na conta</h1>
        <p className="text-sm text-muted-foreground">
          Acede ao teu perfil para continuar o progresso e gerir os teus conteudos.
        </p>
      </div>
      <LoginForm />
    </section>
  )
}
