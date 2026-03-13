import { useEffect, useMemo, useState } from 'react'
import { RefreshCw, Save, Settings2 } from 'lucide-react'
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
  Textarea,
} from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { getErrorMessage } from '@/lib/api/client'
import { cn } from '@/lib/utils'
import { AdminOperationsNav } from '../components/AdminOperationsNav'
import {
  useAdminPlatformIntegrations,
  useUpdateAdminPlatformIntegration,
} from '../hooks/useAdminPlatformIntegrations'
import { hasAdminScope } from '../lib/access'
import type { AdminPlatformIntegrationItem } from '../types/adminPlatformIntegrations'

interface AdminPlatformIntegrationsPageProps {
  embedded?: boolean
}

interface IntegrationDraft {
  enabled: boolean
  configText: string
  reason: string
  note: string
}

const CATEGORY_LABEL: Record<AdminPlatformIntegrationItem['category'], string> = {
  analytics: 'Analytics',
  security: 'Seguranca',
  seo: 'SEO',
}

const toDraft = (item: AdminPlatformIntegrationItem): IntegrationDraft => ({
  enabled: item.enabled,
  configText: JSON.stringify(item.config ?? {}, null, 2),
  reason: '',
  note: '',
})

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

export default function AdminPlatformIntegrationsPage({
  embedded = false,
}: AdminPlatformIntegrationsPageProps) {
  const user = useAuthStore((state) => state.user)
  const canRead = hasAdminScope(user, 'admin.content.read')
  const canWrite = hasAdminScope(user, 'admin.content.moderate') && !user?.adminReadOnly

  const integrationsQuery = useAdminPlatformIntegrations(canRead)
  const updateIntegrationMutation = useUpdateAdminPlatformIntegration()

  const [drafts, setDrafts] = useState<Record<string, IntegrationDraft>>({})
  const [savingKey, setSavingKey] = useState<AdminPlatformIntegrationItem['key'] | null>(null)

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
    return {
      total: items.length,
      enabled: enabledCount,
      disabled: Math.max(0, items.length - enabledCount),
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
            <CardContent className="grid gap-3 sm:grid-cols-3">
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
            </CardContent>
          </Card>

          <div className="space-y-4">
            {(integrationsQuery.data?.items ?? []).map((item) => {
              const draft = drafts[item.key] ?? toDraft(item)
              const isSaving = updateIntegrationMutation.isPending && savingKey === item.key

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
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 rounded-md border border-border/70 p-3">
                      <Checkbox
                        id={`integration-enabled-${item.key}`}
                        checked={draft.enabled}
                        disabled={!canWrite || isSaving}
                        onCheckedChange={(checked) =>
                          setDraftPatch(item.key, { enabled: Boolean(checked) }, draft)
                        }
                      />
                      <Label htmlFor={`integration-enabled-${item.key}`} className="text-sm">
                        Integracao ativa em runtime
                      </Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`integration-config-${item.key}`}>Config (JSON)</Label>
                      <Textarea
                        id={`integration-config-${item.key}`}
                        value={draft.configText}
                        onChange={(event) =>
                          setDraftPatch(item.key, { configText: event.target.value }, draft)
                        }
                        rows={9}
                        className="font-mono text-xs"
                        disabled={!canWrite || isSaving}
                      />
                    </div>

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
                          placeholder="Ex.: trocar IDs para pre-release."
                          disabled={!canWrite || isSaving}
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
                          disabled={!canWrite || isSaving}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                      <span>
                        Ultima alteracao: {formatDateTime(item.updatedAt)} por {resolveActorLabel(item)}
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleSaveIntegration(item)}
                        disabled={!canWrite || isSaving}
                      >
                        {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Guardar
                      </Button>
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
