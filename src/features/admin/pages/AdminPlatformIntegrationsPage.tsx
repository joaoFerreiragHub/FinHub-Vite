import { useEffect, useMemo, useState } from 'react'
import { RefreshCw, RotateCcw, Save, Settings2 } from 'lucide-react'
import { toast } from 'react-toastify'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { getErrorMessage } from '@/lib/api/client'
import { cn } from '@/lib/utils'
import { AdminOperationsNav } from '../components/AdminOperationsNav'
import {
  useAdminPlatformIntegrations,
  useRollbackAdminPlatformIntegration,
  useUpdateAdminPlatformIntegration,
} from '../hooks/useAdminPlatformIntegrations'
import { hasAdminScope } from '../lib/access'
import type {
  AdminPlatformIntegrationHealth,
  AdminPlatformIntegrationItem,
} from '../types/adminPlatformIntegrations'

interface AdminPlatformIntegrationsPageProps {
  embedded?: boolean
}

interface IntegrationDraft {
  enabled: boolean
  config: Record<string, unknown>
  configText: string
  reason: string
  note: string
  revealSensitive: boolean
}

const CATEGORY_LABEL: Record<AdminPlatformIntegrationItem['category'], string> = {
  analytics: 'Analytics',
  security: 'Seguranca',
  seo: 'SEO',
}

const HEALTH_LABEL: Record<AdminPlatformIntegrationHealth['status'], string> = {
  ok: 'Health OK',
  warning: 'Health warning',
  error: 'Health error',
}

const HEALTH_BADGE_CLASS: Record<AdminPlatformIntegrationHealth['status'], string> = {
  ok: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  warning: 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  error: 'border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300',
}

const cloneConfig = (value: Record<string, unknown>): Record<string, unknown> =>
  JSON.parse(JSON.stringify(value ?? {})) as Record<string, unknown>

const toDraft = (item: AdminPlatformIntegrationItem): IntegrationDraft => {
  const config = cloneConfig(item.config ?? {})
  return {
    enabled: item.enabled,
    config,
    configText: JSON.stringify(config, null, 2),
    reason: '',
    note: '',
    revealSensitive: false,
  }
}

const formatDateTime = (value: string | null): string => {
  if (!value) return '-'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '-'
  return new Intl.DateTimeFormat('pt-PT', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(parsed)
}

const resolveActorLabel = (item: AdminPlatformIntegrationItem): string => {
  if (item.updatedBy?.name) return item.updatedBy.name
  if (item.updatedBy?.username) return item.updatedBy.username
  if (item.updatedBy?.email) return item.updatedBy.email
  if (item.updatedBy?.id) return item.updatedBy.id
  return 'sistema'
}

const toStringValue = (record: Record<string, unknown>, key: string): string => {
  const value = record[key]
  return typeof value === 'string' ? value : ''
}

const toArrayValue = (record: Record<string, unknown>, key: string): string[] => {
  const value = record[key]
  if (!Array.isArray(value)) return []
  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item): item is string => item.length > 0)
}

const parsePathList = (raw: string): string[] =>
  Array.from(
    new Set(
      raw
        .split(/[\n,]+/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0),
    ),
  )

export default function AdminPlatformIntegrationsPage({
  embedded = false,
}: AdminPlatformIntegrationsPageProps) {
  const user = useAuthStore((state) => state.user)
  const canRead = hasAdminScope(user, 'admin.content.read')
  const canWrite = hasAdminScope(user, 'admin.content.moderate') && !user?.adminReadOnly

  const integrationsQuery = useAdminPlatformIntegrations(canRead)
  const updateIntegrationMutation = useUpdateAdminPlatformIntegration()
  const rollbackIntegrationMutation = useRollbackAdminPlatformIntegration()

  const [drafts, setDrafts] = useState<Record<string, IntegrationDraft>>({})
  const [savingKey, setSavingKey] = useState<AdminPlatformIntegrationItem['key'] | null>(null)
  const [rollbackKey, setRollbackKey] = useState<AdminPlatformIntegrationItem['key'] | null>(null)

  useEffect(() => {
    if (!integrationsQuery.data) return

    const nextDrafts: Record<string, IntegrationDraft> = {}
    for (const item of integrationsQuery.data.items) {
      nextDrafts[item.key] = toDraft(item)
    }
    setDrafts(nextDrafts)
  }, [integrationsQuery.data])

  const summary = useMemo(() => {
    const items = integrationsQuery.data?.items ?? []
    const enabledCount = items.filter((item) => item.enabled).length
    const healthyCount = items.filter((item) => item.health.status === 'ok').length
    return {
      total: items.length,
      enabled: enabledCount,
      disabled: Math.max(0, items.length - enabledCount),
      healthy: healthyCount,
    }
  }, [integrationsQuery.data?.items])

  const setDraftPatch = (
    key: AdminPlatformIntegrationItem['key'],
    patch: Partial<IntegrationDraft>,
    fallback?: IntegrationDraft,
  ) => {
    setDrafts((current) => {
      const currentDraft = current[key] ?? fallback
      if (!currentDraft) return current
      return {
        ...current,
        [key]: {
          ...currentDraft,
          ...patch,
        },
      }
    })
  }

  const patchDraftConfig = (
    key: AdminPlatformIntegrationItem['key'],
    patch: Record<string, unknown>,
    fallback?: IntegrationDraft,
  ) => {
    setDrafts((current) => {
      const currentDraft = current[key] ?? fallback
      if (!currentDraft) return current
      const nextConfig = {
        ...currentDraft.config,
        ...patch,
      }
      return {
        ...current,
        [key]: {
          ...currentDraft,
          config: nextConfig,
          configText: JSON.stringify(nextConfig, null, 2),
        },
      }
    })
  }

  const handleSaveIntegration = async (item: AdminPlatformIntegrationItem) => {
    if (!canWrite) return

    const draft = drafts[item.key] ?? toDraft(item)
    const reason = draft.reason.trim()
    if (!reason) {
      toast.error('Motivo obrigatorio para atualizar integracao.')
      return
    }

    let parsedConfig: Record<string, unknown>
    try {
      const candidate = JSON.parse(draft.configText)
      if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
        toast.error('Config JSON invalida. Envia um objeto JSON.')
        return
      }
      parsedConfig = candidate as Record<string, unknown>
    } catch {
      toast.error('Config JSON invalida. Corrige o formato antes de guardar.')
      return
    }

    try {
      setSavingKey(item.key)
      const result = await updateIntegrationMutation.mutateAsync({
        key: item.key,
        payload: {
          enabled: draft.enabled,
          config: parsedConfig,
          reason,
          note: draft.note.trim() || undefined,
        },
      })

      setDrafts((current) => ({
        ...current,
        [item.key]: toDraft(result.item),
      }))
      toast.success(result.message)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setSavingKey(null)
    }
  }

  const handleRollbackIntegration = async (item: AdminPlatformIntegrationItem) => {
    if (!canWrite || item.historyCount <= 0) return

    const draft = drafts[item.key] ?? toDraft(item)
    const reason = draft.reason.trim()
    if (!reason) {
      toast.error('Motivo obrigatorio para executar rollback.')
      return
    }

    try {
      setRollbackKey(item.key)
      const result = await rollbackIntegrationMutation.mutateAsync({
        key: item.key,
        payload: {
          reason,
          note: draft.note.trim() || undefined,
        },
      })

      setDrafts((current) => ({
        ...current,
        [item.key]: toDraft(result.item),
      }))
      toast.success(result.message)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setRollbackKey(null)
    }
  }

  const renderConfigEditor = (
    item: AdminPlatformIntegrationItem,
    draft: IntegrationDraft,
    disabled: boolean,
  ) => {
    const config = draft.config

    if (item.key === 'analytics_posthog') {
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`integration-${item.key}-key`}>PostHog key</Label>
            <Input
              id={`integration-${item.key}-key`}
              type={draft.revealSensitive ? 'text' : 'password'}
              value={toStringValue(config, 'key')}
              onChange={(event) => patchDraftConfig(item.key, { key: event.target.value }, draft)}
              disabled={disabled}
              placeholder="phc_..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`integration-${item.key}-host`}>PostHog host</Label>
            <Input
              id={`integration-${item.key}-host`}
              value={toStringValue(config, 'host')}
              onChange={(event) => patchDraftConfig(item.key, { host: event.target.value }, draft)}
              disabled={disabled}
              placeholder="https://app.posthog.com"
            />
          </div>
        </div>
      )
    }

    if (item.key === 'analytics_google_analytics') {
      return (
        <div className="space-y-2">
          <Label htmlFor={`integration-${item.key}-measurement-id`}>GA4 measurement ID</Label>
          <Input
            id={`integration-${item.key}-measurement-id`}
            type={draft.revealSensitive ? 'text' : 'password'}
            value={toStringValue(config, 'measurementId')}
            onChange={(event) => patchDraftConfig(item.key, { measurementId: event.target.value }, draft)}
            disabled={disabled}
            placeholder="G-XXXXXXXXXX"
          />
        </div>
      )
    }

    if (item.key === 'analytics_google_tag_manager') {
      return (
        <div className="space-y-2">
          <Label htmlFor={`integration-${item.key}-container-id`}>GTM container ID</Label>
          <Input
            id={`integration-${item.key}-container-id`}
            type={draft.revealSensitive ? 'text' : 'password'}
            value={toStringValue(config, 'containerId')}
            onChange={(event) => patchDraftConfig(item.key, { containerId: event.target.value }, draft)}
            disabled={disabled}
            placeholder="GTM-XXXXXXX"
          />
        </div>
      )
    }

    if (item.key === 'analytics_meta_pixel') {
      return (
        <div className="space-y-2">
          <Label htmlFor={`integration-${item.key}-pixel-id`}>Meta Pixel ID</Label>
          <Input
            id={`integration-${item.key}-pixel-id`}
            type={draft.revealSensitive ? 'text' : 'password'}
            value={toStringValue(config, 'pixelId')}
            onChange={(event) => patchDraftConfig(item.key, { pixelId: event.target.value }, draft)}
            disabled={disabled}
            placeholder="1234567890"
          />
        </div>
      )
    }

    if (item.key === 'captcha_client') {
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`integration-${item.key}-provider`}>Captcha provider</Label>
            <Select
              value={toStringValue(config, 'provider') || 'disabled'}
              onValueChange={(value) => patchDraftConfig(item.key, { provider: value }, draft)}
              disabled={disabled}
            >
              <SelectTrigger id={`integration-${item.key}-provider`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disabled">disabled</SelectItem>
                <SelectItem value="turnstile">turnstile</SelectItem>
                <SelectItem value="hcaptcha">hcaptcha</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`integration-${item.key}-site-key`}>Captcha site key</Label>
            <Input
              id={`integration-${item.key}-site-key`}
              type={draft.revealSensitive ? 'text' : 'password'}
              value={toStringValue(config, 'siteKey')}
              onChange={(event) => patchDraftConfig(item.key, { siteKey: event.target.value }, draft)}
              disabled={disabled}
              placeholder="site key"
            />
          </div>
        </div>
      )
    }

    if (item.key === 'seo_defaults') {
      const noIndexExact = toArrayValue(config, 'noIndexExactPaths').join('\n')
      const noIndexPrefixes = toArrayValue(config, 'noIndexPrefixes').join('\n')

      return (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`integration-${item.key}-site-name`}>SEO site name</Label>
              <Input
                id={`integration-${item.key}-site-name`}
                value={toStringValue(config, 'siteName')}
                onChange={(event) => patchDraftConfig(item.key, { siteName: event.target.value }, draft)}
                disabled={disabled}
                placeholder="FinHub"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`integration-${item.key}-site-url`}>SEO site URL</Label>
              <Input
                id={`integration-${item.key}-site-url`}
                value={toStringValue(config, 'siteUrl')}
                onChange={(event) => patchDraftConfig(item.key, { siteUrl: event.target.value }, draft)}
                disabled={disabled}
                placeholder="https://finhub.pt"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`integration-${item.key}-default-image`}>SEO default image</Label>
              <Input
                id={`integration-${item.key}-default-image`}
                value={toStringValue(config, 'defaultImage')}
                onChange={(event) => patchDraftConfig(item.key, { defaultImage: event.target.value }, draft)}
                disabled={disabled}
                placeholder="/og/default.png"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`integration-${item.key}-default-description`}>SEO default description</Label>
            <Textarea
              id={`integration-${item.key}-default-description`}
              value={toStringValue(config, 'defaultDescription')}
              onChange={(event) =>
                patchDraftConfig(item.key, { defaultDescription: event.target.value }, draft)
              }
              rows={3}
              disabled={disabled}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`integration-${item.key}-noindex-exact`}>Noindex exact paths</Label>
              <Textarea
                id={`integration-${item.key}-noindex-exact`}
                value={noIndexExact}
                onChange={(event) =>
                  patchDraftConfig(item.key, {
                    noIndexExactPaths: parsePathList(event.target.value),
                  }, draft)
                }
                rows={4}
                disabled={disabled}
                placeholder="/login\n/registar"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`integration-${item.key}-noindex-prefixes`}>Noindex prefixes</Label>
              <Textarea
                id={`integration-${item.key}-noindex-prefixes`}
                value={noIndexPrefixes}
                onChange={(event) =>
                  patchDraftConfig(item.key, {
                    noIndexPrefixes: parsePathList(event.target.value),
                  }, draft)
                }
                rows={4}
                disabled={disabled}
                placeholder="/admin\n/dashboard"
              />
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        <Label htmlFor={`integration-config-${item.key}`}>Config (JSON)</Label>
        <Textarea
          id={`integration-config-${item.key}`}
          value={draft.configText}
          onChange={(event) =>
            setDraftPatch(item.key, { configText: event.target.value }, draft)
          }
          rows={8}
          className="font-mono text-xs"
          disabled={disabled}
        />
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', embedded ? 'pt-2' : '')}>
      {!embedded ? (
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Integracoes e runtime config</h1>
          <p className="text-sm text-muted-foreground">
            Camada de gestao admin para analytics, captcha e SEO sem depender de hardcode no
            frontend.
          </p>
        </div>
      ) : null}

      <AdminOperationsNav active="integrations" />

      {!canRead ? (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Sem permissao para leitura de integracoes (`admin.content.read`).
          </CardContent>
        </Card>
      ) : null}

      {canRead ? (
        <>
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base">Resumo de runtime config</CardTitle>
                  <CardDescription>
                    Snapshot: {formatDateTime(integrationsQuery.data?.generatedAt ?? null)}
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => integrationsQuery.refetch().catch(() => undefined)}
                  disabled={integrationsQuery.isFetching}
                >
                  <RefreshCw
                    className={cn('h-4 w-4', integrationsQuery.isFetching ? 'animate-spin' : '')}
                  />
                  Atualizar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-4">
              <div className="rounded-md border border-border/70 p-3 text-sm">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-semibold">{summary.total}</p>
              </div>
              <div className="rounded-md border border-border/70 p-3 text-sm">
                <p className="text-xs text-muted-foreground">Ativas</p>
                <p className="text-lg font-semibold">{summary.enabled}</p>
              </div>
              <div className="rounded-md border border-border/70 p-3 text-sm">
                <p className="text-xs text-muted-foreground">Desligadas</p>
                <p className="text-lg font-semibold">{summary.disabled}</p>
              </div>
              <div className="rounded-md border border-border/70 p-3 text-sm">
                <p className="text-xs text-muted-foreground">Health OK</p>
                <p className="text-lg font-semibold">{summary.healthy}</p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {(integrationsQuery.data?.items ?? []).map((item) => {
              const draft = drafts[item.key] ?? toDraft(item)
              const isSaving = updateIntegrationMutation.isPending && savingKey === item.key
              const isRollbacking = rollbackIntegrationMutation.isPending && rollbackKey === item.key
              const isBusy = isSaving || isRollbacking

              return (
                <Card key={item.key}>
                  <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Settings2 className="h-4 w-4 text-muted-foreground" />
                          {item.label}
                        </CardTitle>
                        <CardDescription>
                          {item.description} ({item.key})
                        </CardDescription>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{CATEGORY_LABEL[item.category]}</Badge>
                        <Badge variant={draft.enabled ? 'secondary' : 'outline'}>
                          {draft.enabled ? 'Ativo' : 'Desligado'}
                        </Badge>
                        <Badge variant="outline">Historico: {item.historyCount}</Badge>
                        <Badge className={cn('border', HEALTH_BADGE_CLASS[item.health.status])}>
                          {HEALTH_LABEL[item.health.status]}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-md border border-border/70 p-3 text-xs text-muted-foreground">
                      <p>{item.health.summary}</p>
                      {item.health.issues.length > 0 ? (
                        <ul className="mt-2 list-disc space-y-1 pl-4">
                          {item.health.issues.map((issue) => (
                            <li key={`${item.key}-${issue}`}>{issue}</li>
                          ))}
                        </ul>
                      ) : null}
                      <p className="mt-2">Validado em: {formatDateTime(item.health.checkedAt)}</p>
                    </div>

                    <div className="flex items-center gap-2 rounded-md border border-border/70 p-3">
                      <Checkbox
                        id={`integration-enabled-${item.key}`}
                        checked={draft.enabled}
                        disabled={!canWrite || isBusy}
                        onCheckedChange={(checked) =>
                          setDraftPatch(item.key, { enabled: Boolean(checked) }, draft)
                        }
                      />
                      <Label htmlFor={`integration-enabled-${item.key}`} className="text-sm">
                        Integracao ativa em runtime
                      </Label>
                    </div>

                    <div className="flex items-center gap-2 rounded-md border border-border/70 p-3">
                      <Checkbox
                        id={`integration-reveal-sensitive-${item.key}`}
                        checked={draft.revealSensitive}
                        disabled={!canWrite || isBusy}
                        onCheckedChange={(checked) =>
                          setDraftPatch(item.key, { revealSensitive: Boolean(checked) }, draft)
                        }
                      />
                      <Label htmlFor={`integration-reveal-sensitive-${item.key}`} className="text-sm">
                        Mostrar IDs/chaves sensiveis
                      </Label>
                    </div>

                    {renderConfigEditor(item, draft, !canWrite || isBusy)}

                    <details className="rounded-md border border-border/70 p-3">
                      <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
                        Editor JSON avancado
                      </summary>
                      <div className="mt-3 space-y-2">
                        <Label htmlFor={`integration-config-json-${item.key}`}>Config (JSON)</Label>
                        <Textarea
                          id={`integration-config-json-${item.key}`}
                          value={draft.configText}
                          onChange={(event) =>
                            setDraftPatch(item.key, { configText: event.target.value }, draft)
                          }
                          rows={10}
                          className="font-mono text-xs"
                          disabled={!canWrite || isBusy}
                        />
                      </div>
                    </details>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`integration-reason-${item.key}`}>
                          Motivo da alteracao (obrigatorio)
                        </Label>
                        <Input
                          id={`integration-reason-${item.key}`}
                          value={draft.reason}
                          onChange={(event) =>
                            setDraftPatch(item.key, { reason: event.target.value }, draft)
                          }
                          placeholder="Ex.: atualizar IDs para pre-release."
                          disabled={!canWrite || isBusy}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`integration-note-${item.key}`}>Nota interna</Label>
                        <Input
                          id={`integration-note-${item.key}`}
                          value={draft.note}
                          onChange={(event) =>
                            setDraftPatch(item.key, { note: event.target.value }, draft)
                          }
                          placeholder="Contexto adicional para auditoria."
                          disabled={!canWrite || isBusy}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                      <span>
                        Ultima alteracao: {formatDateTime(item.updatedAt)} por {resolveActorLabel(item)}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRollbackIntegration(item)}
                          disabled={!canWrite || isBusy || item.historyCount <= 0}
                        >
                          {isRollbacking ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <RotateCcw className="h-4 w-4" />
                          )}
                          Rollback ultima versao
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleSaveIntegration(item)}
                          disabled={!canWrite || isBusy}
                        >
                          {isSaving ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                          Guardar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      ) : null}
    </div>
  )
}
