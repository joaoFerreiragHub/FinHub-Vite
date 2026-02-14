import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'
import { registerSchema, type RegisterFormData } from '../schemas/authSchemas'
import { Button, Input } from '@/shared/ui'
import { getErrorMessage } from '@/lib/api'

/**
 * Formulário de Registro
 *
 * @example
 * <RegisterForm />
 */
export function RegisterForm() {
  const navigate = useNavigate()
  const register_action = useAuthStore((state) => state.register)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null)

    try {
      await register_action(data)

      // Redirecionar para dashboard
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setServerError(getErrorMessage(error))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Server Error */}
      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-medium">Erro ao criar conta</p>
          <p className="mt-1">{serverError}</p>
        </div>
      )}

      {/* Name */}
      <Input
        label="Nome"
        type="text"
        placeholder="João"
        error={errors.name?.message}
        {...register('name')}
      />

      {/* Last Name */}
      <Input
        label="Apelido (opcional)"
        type="text"
        placeholder="Silva"
        error={errors.lastName?.message}
        {...register('lastName')}
      />

      {/* Email */}
      <Input
        label="Email"
        type="email"
        placeholder="seu@email.com"
        error={errors.email?.message}
        helperText="Enviaremos um email de confirmação"
        {...register('email')}
      />

      {/* Username */}
      <Input
        label="Username"
        type="text"
        placeholder="joaosilva"
        error={errors.username?.message}
        helperText="Apenas letras, números e underscore"
        {...register('username')}
      />

      {/* Password */}
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        helperText="Mín. 8 caracteres, com maiúscula, minúscula e número"
        {...register('password')}
      />

      {/* Confirm Password */}
      <Input
        label="Confirmar Password"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      {/* Terms */}
      <div className="text-xs text-muted-foreground">
        Ao criar uma conta, você concorda com os nossos{' '}
        <Link to="/terms" className="text-primary hover:underline">
          Termos de Serviço
        </Link>{' '}
        e{' '}
        <Link to="/privacy" className="text-primary hover:underline">
          Política de Privacidade
        </Link>
        .
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        isLoading={isSubmitting}
      >
        Criar Conta
      </Button>

      {/* Login Link */}
      <div className="text-center text-sm text-muted-foreground">
        Já tem conta?{' '}
        <Link to="/auth/login" className="font-medium text-primary hover:underline">
          Fazer login
        </Link>
      </div>
    </form>
  )
}
