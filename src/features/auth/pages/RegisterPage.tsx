import { RegisterForm } from '@/features/auth/components/RegisterForm'

export default function RegisterPage() {
  return (
    <section className="space-y-5">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Criar conta</h1>
        <p className="text-sm text-muted-foreground">
          Junta-te a comunidade FinHub e personaliza o teu percurso de aprendizagem.
        </p>
      </div>
      <RegisterForm />
    </section>
  )
}
