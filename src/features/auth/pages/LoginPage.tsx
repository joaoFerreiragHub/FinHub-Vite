import { AuthLayout } from '@/shared/layouts'
import { LoginForm } from '../components'

/**
 * Página de Login
 */
export function LoginPage() {
  return (
    <AuthLayout
      title="Bem-vindo de volta"
      description="Entre na sua conta para continuar"
    >
      <LoginForm />
    </AuthLayout>
  )
}
