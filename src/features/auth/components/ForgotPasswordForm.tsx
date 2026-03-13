import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { Button, Input, Label } from '@/components/ui'
import { getErrorMessage } from '@/lib/api/client'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../schemas/authSchemas'
import { authService } from '../services/authService'

export function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setServerError(null)

    try {
      await authService.forgotPassword(data.email)
      setSubmittedEmail(data.email)
    } catch (error) {
      setServerError(getErrorMessage(error))
    }
  }

  if (submittedEmail) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <p className="font-medium">Pedido enviado</p>
          <p className="mt-1">
            Se existir uma conta para <span className="font-semibold">{submittedEmail}</span>, vais
            receber instrucoes por email para redefinir a password.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => setSubmittedEmail(null)}
        >
          Enviar para outro email
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          <Link to="/login" className="font-medium text-primary hover:underline">
            Voltar ao login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-medium">Erro ao enviar pedido</p>
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

      <Button type="submit" variant="default" size="lg" className="w-full" isLoading={isSubmitting}>
        Enviar link de recuperacao
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        Lembrou da password?{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Fazer login
        </Link>
      </div>
    </form>
  )
}
