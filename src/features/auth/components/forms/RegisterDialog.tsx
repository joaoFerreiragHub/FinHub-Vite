import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Checkbox, Label } from '@/components/ui'
import { Button, Input } from '@/components/ui'
interface RegisterData {
  name: string
  username: string
  email: string
  password: string
  confirmPassword: string
  termsAccepted: boolean
  privacyAccepted: boolean
  financialDisclaimerAccepted: boolean
  cookieAnalytics: boolean
  cookieMarketing: boolean
  cookiePreferences: boolean
}

interface RegisterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRegister: (data: RegisterData) => Promise<void> | void
}

type RegisterTextField = 'name' | 'username' | 'email' | 'password' | 'confirmPassword'

export function RegisterDialog({ open, onOpenChange, onRegister }: RegisterDialogProps) {
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
    privacyAccepted: false,
    financialDisclaimerAccepted: false,
    cookieAnalytics: false,
    cookieMarketing: false,
    cookiePreferences: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validações
    if (formData.password !== formData.confirmPassword) {
      setError('As passwords não coincidem')
      return
    }

    if (formData.password.length < 6) {
      setError('A password deve ter pelo menos 6 caracteres')
      return
    }

    const username = formData.username.trim()
    if (username.length < 3) {
      setError('O username deve ter pelo menos 3 caracteres')
      return
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('O username so pode conter letras, numeros e underscore')
      return
    }

    if (
      !formData.termsAccepted ||
      !formData.privacyAccepted ||
      !formData.financialDisclaimerAccepted
    ) {
      setError('Deves aceitar Termos, Privacidade e Aviso Legal para criar conta')
      return
    }

    setIsLoading(true)

    try {
      await onRegister({
        ...formData,
        username,
      })
      // Reset form on success
      setFormData({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        termsAccepted: false,
        privacyAccepted: false,
        financialDisclaimerAccepted: false,
        cookieAnalytics: false,
        cookieMarketing: false,
        cookiePreferences: false,
      })
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: RegisterTextField) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleCheckedChange = (field: keyof RegisterData) => (checked: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: checked }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Conta</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para criar a sua conta no FinHub.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={formData.name}
              onChange={handleChange('name')}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-email">Email</Label>
            <Input
              id="register-email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange('email')}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-username">Username</Label>
            <Input
              id="register-username"
              type="text"
              placeholder="joaosilva"
              value={formData.username}
              onChange={handleChange('username')}
              required
              disabled={isLoading}
              minLength={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-password">Password</Label>
            <Input
              id="register-password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange('password')}
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>

          <div className="space-y-2 rounded-lg border border-border p-3">
            <div className="flex items-start gap-2">
              <Checkbox
                id="dialog-terms"
                checked={formData.termsAccepted}
                onCheckedChange={(checked) =>
                  handleCheckedChange('termsAccepted')(Boolean(checked))
                }
              />
              <Label htmlFor="dialog-terms" className="text-xs text-muted-foreground">
                Aceito os{' '}
                <a href="/termos" className="underline">
                  Termos de Servico
                </a>
              </Label>
            </div>
            <div className="flex items-start gap-2">
              <Checkbox
                id="dialog-privacy"
                checked={formData.privacyAccepted}
                onCheckedChange={(checked) =>
                  handleCheckedChange('privacyAccepted')(Boolean(checked))
                }
              />
              <Label htmlFor="dialog-privacy" className="text-xs text-muted-foreground">
                Aceito a{' '}
                <a href="/privacidade" className="underline">
                  Politica de Privacidade
                </a>
              </Label>
            </div>
            <div className="flex items-start gap-2">
              <Checkbox
                id="dialog-disclaimer"
                checked={formData.financialDisclaimerAccepted}
                onCheckedChange={(checked) =>
                  handleCheckedChange('financialDisclaimerAccepted')(Boolean(checked))
                }
              />
              <Label htmlFor="dialog-disclaimer" className="text-xs text-muted-foreground">
                Li e aceito o{' '}
                <a href="/aviso-legal" className="underline">
                  Aviso Legal Financeiro
                </a>
              </Label>
            </div>
          </div>

          <div className="space-y-2 rounded-lg border border-border p-3">
            <p className="text-xs font-medium text-foreground">Cookies opcionais</p>
            <div className="flex items-start gap-2">
              <Checkbox
                id="dialog-cookie-analytics"
                checked={formData.cookieAnalytics}
                onCheckedChange={(checked) =>
                  handleCheckedChange('cookieAnalytics')(Boolean(checked))
                }
              />
              <Label htmlFor="dialog-cookie-analytics" className="text-xs text-muted-foreground">
                Analytics
              </Label>
            </div>
            <div className="flex items-start gap-2">
              <Checkbox
                id="dialog-cookie-preferences"
                checked={formData.cookiePreferences}
                onCheckedChange={(checked) =>
                  handleCheckedChange('cookiePreferences')(Boolean(checked))
                }
              />
              <Label htmlFor="dialog-cookie-preferences" className="text-xs text-muted-foreground">
                Preferencias
              </Label>
            </div>
            <div className="flex items-start gap-2">
              <Checkbox
                id="dialog-cookie-marketing"
                checked={formData.cookieMarketing}
                onCheckedChange={(checked) =>
                  handleCheckedChange('cookieMarketing')(Boolean(checked))
                }
              />
              <Label htmlFor="dialog-cookie-marketing" className="text-xs text-muted-foreground">
                Marketing
              </Label>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? 'A criar...' : 'Criar Conta'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
