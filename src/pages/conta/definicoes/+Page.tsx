import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Switch,
} from '@/components/ui'
import { AccountSettings } from '@/features/auth/components/settings'
import { authService } from '@/features/auth/services/authService'
import {
  buildCookieConsentSnapshot,
  dispatchCookieConsentUpdated,
  writeStoredCookieConsent,
} from '@/features/auth/services/cookieConsentStorage'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { apiClient, getErrorMessage } from '@/lib/api/client'
import { initAnalytics } from '@/lib/analyticsProviders'
import { Helmet } from '@/lib/helmet'
import { UserAccountShell } from '@/shared/layouts/UserAccountShell'
import { useToast } from '@/components/ui/use-toast'

export function Page() {
  const user = useAuthStore((state) => state.user)
  const updateUser = useAuthStore((state) => state.updateUser)
  const { toast } = useToast()

  const [allowAnalytics, setAllowAnalytics] = useState(user?.allowAnalytics !== false)
  const [error, setError] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    setAllowAnalytics(user?.allowAnalytics !== false)
  }, [user?.allowAnalytics])

  const updateAnalyticsMutation = useMutation({
    mutationFn: (enabled: boolean) => authService.updateMyProfile({ allowAnalytics: enabled }),
    onSuccess: (result, enabled) => {
      const normalized = result.user.allowAnalytics !== false
      updateUser({ allowAnalytics: normalized })

      writeStoredCookieConsent(
        buildCookieConsentSnapshot({
          analytics: enabled,
          marketing: false,
          preferences: false,
        }),
      )
      dispatchCookieConsentUpdated()
      initAnalytics()

      setAllowAnalytics(normalized)
      setError(null)
    },
    onError: (mutationError, enabled) => {
      setAllowAnalytics(!enabled)
      setError(getErrorMessage(mutationError))
    },
  })

  const handleToggleAnalytics = (enabled: boolean) => {
    setAllowAnalytics(enabled)
    setError(null)
    updateAnalyticsMutation.mutate(enabled)
  }

  const handleExport = async () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return

    setIsExporting(true)
    try {
      const response = await apiClient.get('/account/export', {
        responseType: 'blob',
      })

      const blob = response.data instanceof Blob ? response.data : new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      const day = new Date().toISOString().split('T')[0]

      link.href = url
      link.download = `finhub-dados-${day}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({ title: 'Dados exportados com sucesso' })
    } catch (err) {
      toast({ title: getErrorMessage(err), variant: 'destructive' })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Definicoes | FinHub</title>
      </Helmet>

      <UserAccountShell>
        <div className="mx-auto max-w-5xl space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Definicoes da conta</h1>
            <p className="text-sm text-muted-foreground">
              Atualiza dados pessoais, preferencias e seguranca da tua conta.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Privacidade e analytics</CardTitle>
              <CardDescription>
                Controla se a FinHub pode recolher eventos de analytics na tua sessao.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                <div className="space-y-1">
                  <Label htmlFor="allow-analytics-toggle" className="text-sm text-foreground">
                    Permitir analytics
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Quando desativado, os eventos analiticos deixam de ser enviados.
                  </p>
                </div>
                <Switch
                  id="allow-analytics-toggle"
                  checked={allowAnalytics}
                  disabled={updateAnalyticsMutation.isPending}
                  onCheckedChange={(checked) => handleToggleAnalytics(Boolean(checked))}
                />
              </div>

              {error ? <p className="text-xs text-red-600">{error}</p> : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>RGPD e dados da conta</CardTitle>
              <CardDescription>
                Exporta os teus dados pessoais para um ficheiro JSON.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Exportacao de dados</h3>
                <p className="text-sm text-muted-foreground">
                  Descarrega uma copia dos teus dados pessoais em formato JSON (RGPD Art. 20 -
                  portabilidade de dados).
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleExport}
                  disabled={isExporting}
                >
                  {isExporting ? 'A exportar...' : 'Exportar os meus dados'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <AccountSettings />
        </div>
      </UserAccountShell>
    </>
  )
}
