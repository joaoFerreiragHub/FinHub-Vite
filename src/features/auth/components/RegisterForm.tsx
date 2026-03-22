import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'
import { registerSchema, type RegisterFormData } from '../schemas/authSchemas'
import { Button, Checkbox, Input, Label } from '@/components/ui'
import { getErrorMessage } from '@/lib/api/client'
import { CaptchaField } from './CaptchaField'
import { DEFAULT_COOKIE_CONSENT_VERSION } from '@/features/auth/services/cookieConsentStorage'
import { trackSignUpSuccess } from '@/lib/analytics'
import { authService } from '../services/authService'
import { usePlatformRuntimeConfig } from '@/features/platform/hooks/usePlatformRuntimeConfig'
import { platformRuntimeConfigService } from '@/features/platform/services/platformRuntimeConfigService'

const legalVersion = import.meta.env.VITE_LEGAL_VERSION || DEFAULT_COOKIE_CONSENT_VERSION

export function RegisterForm() {
  const navigate = useNavigate()
  const registerAction = useAuthStore((state) => state.register)
  const [serverError, setServerError] = useState<string | null>(null)
  const runtimeConfigQuery = usePlatformRuntimeConfig()
  const runtimeConfig = runtimeConfigQuery.data ?? platformRuntimeConfigService.getFallback()
  const captchaConfig = runtimeConfig.captcha

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
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
      captchaToken: '',
      termsAccepted: false,
      privacyAccepted: false,
      financialDisclaimerAccepted: false,
      cookieAnalytics: false,
      cookieMarketing: false,
      cookiePreferences: false,
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null)

    if (captchaConfig.enabled && !data.captchaToken?.trim()) {
      setError('captchaToken', {
        type: 'manual',
        message: 'Confirma o CAPTCHA para continuar',
      })
      return
    }

    try {
      await registerAction({
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        username: data.username,
        password: data.password,
        confirmPassword: data.confirmPassword,
        captchaToken: data.captchaToken,
        legalAcceptance: {
          termsAccepted: data.termsAccepted,
          privacyAccepted: data.privacyAccepted,
          financialDisclaimerAccepted: data.financialDisclaimerAccepted,
          version: legalVersion,
        },
        cookieConsent: {
          analytics: Boolean(data.cookieAnalytics),
          marketing: Boolean(data.cookieMarketing),
          preferences: Boolean(data.cookiePreferences),
          version: legalVersion,
        },
      })
      trackSignUpSuccess('password', '/dashboard')
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setServerError(getErrorMessage(error))
    }
  }

  const handleGoogleRegister = () => {
    window.location.href = authService.getGoogleOAuthStartUrl('/dashboard')
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

      <input type="hidden" {...register('captchaToken')} />
      <CaptchaField
        value={watch('captchaToken')}
        error={errors.captchaToken?.message}
        enabled={captchaConfig.enabled}
        provider={captchaConfig.provider}
        siteKey={captchaConfig.siteKey ?? ''}
        onChange={(token) => {
          setValue('captchaToken', token, { shouldDirty: true, shouldValidate: true })
          if (token.trim()) {
            clearErrors('captchaToken')
          }
        }}
      />

      <div className="space-y-3 rounded-lg border border-border p-3">
        <div className="flex items-start gap-2">
          <Checkbox
            id="termsAccepted"
            checked={watch('termsAccepted')}
            onCheckedChange={(checked) =>
              setValue('termsAccepted', Boolean(checked), {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
          <Label htmlFor="termsAccepted" className="text-xs leading-relaxed text-muted-foreground">
            Aceito os{' '}
            <Link to="/legal/termos" className="font-medium text-primary hover:underline">
              Termos de Servico
            </Link>
            .
          </Label>
        </div>
        {errors.termsAccepted?.message ? (
          <p className="text-xs text-destructive">{errors.termsAccepted.message}</p>
        ) : null}

        <div className="flex items-start gap-2">
          <Checkbox
            id="privacyAccepted"
            checked={watch('privacyAccepted')}
            onCheckedChange={(checked) =>
              setValue('privacyAccepted', Boolean(checked), {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
          <Label
            htmlFor="privacyAccepted"
            className="text-xs leading-relaxed text-muted-foreground"
          >
            Aceito a{' '}
            <Link to="/legal/privacidade" className="font-medium text-primary hover:underline">
              Politica de Privacidade
            </Link>
            .
          </Label>
        </div>
        {errors.privacyAccepted?.message ? (
          <p className="text-xs text-destructive">{errors.privacyAccepted.message}</p>
        ) : null}

        <div className="flex items-start gap-2">
          <Checkbox
            id="financialDisclaimerAccepted"
            checked={watch('financialDisclaimerAccepted')}
            onCheckedChange={(checked) =>
              setValue('financialDisclaimerAccepted', Boolean(checked), {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
          <Label
            htmlFor="financialDisclaimerAccepted"
            className="text-xs leading-relaxed text-muted-foreground"
          >
            Li e aceito o{' '}
            <Link to="/aviso-legal" className="font-medium text-primary hover:underline">
              Aviso Legal Financeiro
            </Link>
            .
          </Label>
        </div>
        {errors.financialDisclaimerAccepted?.message ? (
          <p className="text-xs text-destructive">{errors.financialDisclaimerAccepted.message}</p>
        ) : null}
      </div>

      <div className="space-y-2 rounded-lg border border-border p-3">
        <p className="text-xs font-medium text-foreground">Cookies opcionais</p>
        <div className="flex items-start gap-2">
          <Checkbox
            id="cookieAnalytics"
            checked={watch('cookieAnalytics')}
            onCheckedChange={(checked) =>
              setValue('cookieAnalytics', Boolean(checked), { shouldDirty: true })
            }
          />
          <Label htmlFor="cookieAnalytics" className="text-xs text-muted-foreground">
            Analytics
          </Label>
        </div>
        <div className="flex items-start gap-2">
          <Checkbox
            id="cookiePreferences"
            checked={watch('cookiePreferences')}
            onCheckedChange={(checked) =>
              setValue('cookiePreferences', Boolean(checked), { shouldDirty: true })
            }
          />
          <Label htmlFor="cookiePreferences" className="text-xs text-muted-foreground">
            Preferencias
          </Label>
        </div>
        <div className="flex items-start gap-2">
          <Checkbox
            id="cookieMarketing"
            checked={watch('cookieMarketing')}
            onCheckedChange={(checked) =>
              setValue('cookieMarketing', Boolean(checked), { shouldDirty: true })
            }
          />
          <Label htmlFor="cookieMarketing" className="text-xs text-muted-foreground">
            Marketing
          </Label>
        </div>
        <p className="text-xs text-muted-foreground">
          Podes alterar estas opcoes mais tarde no banner de consentimento.
        </p>
      </div>

      <Button type="submit" variant="default" size="lg" className="w-full" isLoading={isSubmitting}>
        Criar Conta
      </Button>

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
        onClick={handleGoogleRegister}
      >
        Continuar com Google
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
