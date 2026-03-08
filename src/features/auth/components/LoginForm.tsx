import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'
import { loginSchema, type LoginFormData } from '../schemas/authSchemas'
import { Button, Input, Label } from '@/components/ui'
import { getErrorMessage } from '@/lib/api/client'
import { authService } from '../services/authService'
import { CaptchaField } from './CaptchaField'

export function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((state) => state.login)
  const [serverError, setServerError] = useState<string | null>(null)
  const fromPath =
    (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard'

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
      captchaToken: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null)

    try {
      await login(data)
      navigate(fromPath, { replace: true })
    } catch (error) {
      setServerError(getErrorMessage(error))
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = authService.getGoogleOAuthStartUrl(fromPath)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-medium">Erro ao fazer login</p>
          <p className="mt-1">{serverError}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="seu@email.com" {...register('email')} />
        {errors.email?.message && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="********" {...register('password')} />
        {errors.password?.message && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <input type="hidden" {...register('captchaToken')} />
      <CaptchaField
        value={watch('captchaToken')}
        error={errors.captchaToken?.message}
        onChange={(token) =>
          setValue('captchaToken', token, { shouldDirty: true, shouldValidate: true })
        }
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            {...register('rememberMe')}
          />
          <span>Lembrar-me</span>
        </label>

        <Link to="/contacto" className="text-sm text-primary hover:underline">
          Precisa de ajuda?
        </Link>
      </div>

      <Button type="submit" variant="default" size="lg" className="w-full" isLoading={isSubmitting}>
        Entrar
      </Button>

      <Button type="button" variant="outline" size="lg" className="w-full" onClick={handleGoogleLogin}>
        Continuar com Google
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        Nao tem conta?{' '}
        <Link to="/registar" className="font-medium text-primary hover:underline">
          Criar conta
        </Link>
      </div>
    </form>
  )
}
