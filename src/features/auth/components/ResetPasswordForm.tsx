import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@/lib/reactRouterDomCompat'
import { Button, Input, Label } from '@/components/ui'
import { getErrorMessage } from '@/lib/api/client'
import { resetPasswordSchema, type ResetPasswordFormData } from '../schemas/authSchemas'
import { authService } from '../services/authService'

interface ResetPasswordFormProps {
  token: string
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    setServerError(null)

    try {
      await authService.resetPassword(token, data.password)
      setIsCompleted(true)
    } catch (error) {
      setServerError(getErrorMessage(error))
    }
  }

  if (isCompleted) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <p className="font-medium">Password atualizada</p>
          <p className="mt-1">
            A tua password foi redefinida com sucesso. Ja podes entrar com a nova credencial.
          </p>
        </div>
        <Button asChild size="lg" className="w-full">
          <Link to="/login">Ir para login</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-medium">Erro ao redefinir password</p>
          <p className="mt-1">{serverError}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="password">Nova password</Label>
        <Input id="password" type="password" placeholder="********" {...register('password')} />
        <p className="text-xs text-muted-foreground">
          Min. 8 caracteres, com maiuscula, minuscula e numero.
        </p>
        {errors.password?.message && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar nova password</Label>
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

      <Button type="submit" variant="default" size="lg" className="w-full" isLoading={isSubmitting}>
        Guardar nova password
      </Button>
    </form>
  )
}
