import { AuthLayout } from '@/shared/layouts'
import { RegisterForm } from '../components'

/**
 * Página de Registro
 */
export function RegisterPage() {
  return (
    <AuthLayout
      title="Criar nova conta"
      description="Junte-se à comunidade FinHub"
    >
      <RegisterForm />
    </AuthLayout>
  )
}
