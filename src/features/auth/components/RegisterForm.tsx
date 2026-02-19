import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'
import { registerSchema, type RegisterFormData } from '../schemas/authSchemas'
import { Button, Input, Label } from '@/components/ui'
import { getErrorMessage } from '@/lib/api/client'

export function RegisterForm() {
  const navigate = useNavigate()
  const registerAction = useAuthStore((state) => state.register)
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
      await registerAction(data)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setServerError(getErrorMessage(error))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-medium">Erro ao criar conta</p>
          <p className="mt-1">{serverError}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" type="text" placeholder="Joao" {...register('name')} />
        {errors.name?.message && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName">Apelido (opcional)</Label>
        <Input id="lastName" type="text" placeholder="Silva" {...register('lastName')} />
        {errors.lastName?.message && (
          <p className="text-sm text-destructive">{errors.lastName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="seu@email.com" {...register('email')} />
        <p className="text-xs text-muted-foreground">Enviaremos um email de confirmacao</p>
        {errors.email?.message && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" type="text" placeholder="joaosilva" {...register('username')} />
        <p className="text-xs text-muted-foreground">Apenas letras, numeros e underscore</p>
        {errors.username?.message && (
          <p className="text-sm text-destructive">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="********" {...register('password')} />
        <p className="text-xs text-muted-foreground">
          Min. 8 caracteres, com maiuscula, minuscula e numero
        </p>
        {errors.password?.message && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="********"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword?.message && (
          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="text-xs text-muted-foreground">
        Ao criar uma conta, voce concorda com os nossos{' '}
        <Link to="/termos" className="text-primary hover:underline">
          Termos de Servico
        </Link>{' '}
        e{' '}
        <Link to="/privacidade" className="text-primary hover:underline">
          Politica de Privacidade
        </Link>
        .
      </div>

      <Button type="submit" variant="default" size="lg" className="w-full" isLoading={isSubmitting}>
        Criar Conta
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        Ja tem conta?{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Fazer login
        </Link>
      </div>
    </form>
  )
}
