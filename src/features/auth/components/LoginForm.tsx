import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'
import { loginSchema, type LoginFormData } from '../schemas/authSchemas'
import { Button, Input } from '@/shared/ui'
import { getErrorMessage } from '@/lib/api'

/**
 * Formulário de Login
 *
 * @example
 * <LoginForm />
 */
export function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((state) => state.login)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null)

    try {
      await login(data)

      // Redirecionar para página original ou dashboard
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    } catch (error) {
      setServerError(getErrorMessage(error))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Server Error */}
      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-medium">Erro ao fazer login</p>
          <p className="mt-1">{serverError}</p>
        </div>
      )}

      {/* Email */}
      <Input
        label="Email"
        type="email"
        placeholder="seu@email.com"
        error={errors.email?.message}
        {...register('email')}
      />

      {/* Password */}
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            {...register('rememberMe')}
          />
          <span>Lembrar-me</span>
        </label>

        <Link
          to="/auth/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          Esqueceu a password?
        </Link>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        isLoading={isSubmitting}
      >
        Entrar
      </Button>

      {/* Register Link */}
      <div className="text-center text-sm text-muted-foreground">
        Não tem conta?{' '}
        <Link to="/auth/register" className="font-medium text-primary hover:underline">
          Criar conta
        </Link>
      </div>
    </form>
  )
}
