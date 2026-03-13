import { useEffect, useRef, useState } from 'react'
import { Label } from '@/components/ui'

type CaptchaProvider = 'disabled' | 'turnstile' | 'hcaptcha'

interface CaptchaFieldProps {
  value?: string
  error?: string
  onChange: (token: string) => void
  enabled?: boolean
  provider?: CaptchaProvider
  siteKey?: string
}

const envProvider = (import.meta.env.VITE_CAPTCHA_PROVIDER ?? 'disabled').toLowerCase() as CaptchaProvider
const envSiteKey = import.meta.env.VITE_CAPTCHA_SITE_KEY ?? ''

const scriptByProvider: Record<Exclude<CaptchaProvider, 'disabled'>, string> = {
  turnstile: 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit',
  hcaptcha: 'https://js.hcaptcha.com/1/api.js?render=explicit',
}

const scriptIdByProvider: Record<Exclude<CaptchaProvider, 'disabled'>, string> = {
  turnstile: 'finhub-turnstile-script',
  hcaptcha: 'finhub-hcaptcha-script',
}

const parseProvider = (value: unknown, fallback: CaptchaProvider): CaptchaProvider => {
  if (typeof value !== 'string') return fallback
  const normalized = value.trim().toLowerCase()
  return normalized === 'turnstile' || normalized === 'hcaptcha' || normalized === 'disabled'
    ? normalized
    : fallback
}

const ensureScript = (selectedProvider: Exclude<CaptchaProvider, 'disabled'>): Promise<void> => {
  if (typeof window === 'undefined') return Promise.resolve()

  const scriptId = scriptIdByProvider[selectedProvider]
  const existing = document.getElementById(scriptId) as HTMLScriptElement | null
  if (existing) {
    if (existing.dataset.loaded === 'true') {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('captcha_script_error')), {
        once: true,
      })
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.id = scriptId
    script.src = scriptByProvider[selectedProvider]
    script.async = true
    script.defer = true
    script.onload = () => {
      script.dataset.loaded = 'true'
      resolve()
    }
    script.onerror = () => reject(new Error('captcha_script_error'))
    document.head.appendChild(script)
  })
}

export function CaptchaField({
  value,
  error,
  onChange,
  enabled,
  provider,
  siteKey,
}: CaptchaFieldProps) {
  const resolvedProvider = parseProvider(provider, parseProvider(envProvider, 'disabled'))
  const resolvedSiteKey = typeof siteKey === 'string' ? siteKey.trim() : envSiteKey.trim()
  const isCaptchaEnabled = Boolean(enabled ?? resolvedProvider !== 'disabled') && resolvedProvider !== 'disabled'

  const containerRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<string | null>(null)
  const onChangeRef = useRef(onChange)
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    if (!isCaptchaEnabled) return
    if (resolvedProvider !== 'turnstile' && resolvedProvider !== 'hcaptcha') return
    if (!resolvedSiteKey) {
      setLoadError('CAPTCHA indisponivel: falta site key configurada.')
      return
    }
    if (!containerRef.current) return

    const selectedProvider = resolvedProvider
    let cancelled = false
    setIsLoading(true)
    setLoadError(null)

    const resetToken = () => onChangeRef.current('')
    const assignToken = (token: string) => onChangeRef.current(token)

    const renderWidget = () => {
      if (cancelled || !containerRef.current) return

      if (selectedProvider === 'turnstile' && window.turnstile) {
        const widgetId = window.turnstile.render(containerRef.current, {
          sitekey: resolvedSiteKey,
          callback: (token: string) => assignToken(token),
          'expired-callback': () => resetToken(),
          'error-callback': () => resetToken(),
        })
        widgetIdRef.current = widgetId
        return
      }

      if (selectedProvider === 'hcaptcha' && window.hcaptcha) {
        const widgetId = window.hcaptcha.render(containerRef.current, {
          sitekey: resolvedSiteKey,
          callback: (token: string) => assignToken(token),
          'expired-callback': () => resetToken(),
          'error-callback': () => resetToken(),
        })
        widgetIdRef.current = widgetId
        return
      }

      setLoadError('Nao foi possivel inicializar CAPTCHA.')
    }

    void ensureScript(selectedProvider)
      .then(() => {
        if (cancelled) return
        renderWidget()
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError('Erro ao carregar CAPTCHA.')
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
      const widgetId = widgetIdRef.current
      if (selectedProvider === 'turnstile' && widgetId && window.turnstile?.remove) {
        window.turnstile.remove(widgetId)
      }
      if (selectedProvider === 'hcaptcha' && widgetId && window.hcaptcha?.remove) {
        window.hcaptcha.remove(widgetId)
      }
      widgetIdRef.current = null
      resetToken()
    }
  }, [isCaptchaEnabled, resolvedProvider, resolvedSiteKey])

  if (!isCaptchaEnabled) return null

  return (
    <div className="space-y-2">
      <Label>Verificacao humana</Label>
      <div className="rounded-md border border-border p-3">
        {isLoading && <p className="text-xs text-muted-foreground">A carregar CAPTCHA...</p>}
        <div ref={containerRef} />
      </div>
      {loadError && <p className="text-sm text-destructive">{loadError}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!error && value ? <p className="text-xs text-emerald-700">CAPTCHA validado.</p> : null}
    </div>
  )
}
