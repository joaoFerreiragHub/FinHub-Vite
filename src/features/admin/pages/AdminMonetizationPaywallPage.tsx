import { useMemo, useState } from 'react'
import { Edit3, Plus, RefreshCw, ShieldCheck, ShieldOff, Sparkles } from 'lucide-react'
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
  Switch,
  Textarea,
} from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { getErrorMessage } from '@/lib/api/client'
import { cn } from '@/lib/utils'
import { hasAdminScope } from '../lib/access'
import {
  useActivateAdminContentAccessPolicy,
  useAdminContentAccessPolicies,
  useCreateAdminContentAccessPolicy,
  useDeactivateAdminContentAccessPolicy,
  usePreviewAdminContentAccessPolicy,
  useUpdateAdminContentAccessPolicy,
} from '../hooks/useAdminContentAccessPolicies'
import type {
  AdminContentAccessPolicyCategory,
  AdminContentAccessPolicyContentType,
  AdminContentAccessPolicyItem,
  AdminContentAccessPolicyPayload,
  AdminContentAccessPolicyPreviewResponse,
  AdminContentAccessPolicyRequiredRole,
} from '../types/adminContentAccessPolicy'

const CONTENT_TYPE_LABELS: Record<AdminContentAccessPolicyContentType, string> = {
  article: 'Artigo',
  video: 'Video',
  course: 'Curso',
  live: 'Live',
  podcast: 'Podcast',
  book: 'Livro',
}

const CONTENT_TYPE_OPTIONS: readonly AdminContentAccessPolicyContentType[] = [
  'article',
  'video',
  'course',
  'live',
  'podcast',
  'book',
]

const CATEGORY_OPTIONS: readonly AdminContentAccessPolicyCategory[] = [
  'finance',
  'investing',
  'trading',
  'crypto',
  'economics',
  'personal-finance',
  'business',
  'technology',
  'education',
  'news',
  'analysis',
  'other',
]

interface PolicyDraftState {
  code: string
  label: string
  description: string
  active: boolean
  priority: string
  effectiveFrom: string
  effectiveTo: string
  requiredRole: AdminContentAccessPolicyRequiredRole
  teaserAllowed: boolean
  blockedMessage: string
  contentTypes: AdminContentAccessPolicyContentType[]
  categories: AdminContentAccessPolicyCategory[]
  tagsInput: string
  featuredOnly: boolean
  changeReason: string
}

const createInitialDraft = (): PolicyDraftState => ({
  code: '',
  label: '',
  description: '',
  active: true,
  priority: '100',
  effectiveFrom: '',
  effectiveTo: '',
  requiredRole: 'premium',
  teaserAllowed: true,
  blockedMessage: '',
  contentTypes: [...CONTENT_TYPE_OPTIONS],
  categories: [],
  tagsInput: '',
  featuredOnly: false,
  changeReason: '',
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

const toFilterParam = <T extends string>(value: string): T | undefined =>
  value === 'all' ? undefined : (value as T)

const toDateTimeLocalValue = (value: string | null): string => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const timezoneOffsetMs = date.getTimezoneOffset() * 60_000
  const local = new Date(date.getTime() - timezoneOffsetMs)
  return local.toISOString().slice(0, 16)
}

const toIsoFromDateTimeLocal = (value: string): string | null => {
  if (!value.trim()) return null
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toISOString()
}

const toPositiveInt = (value: string, fallback: number): number => {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed < 1) return fallback
  return parsed
}

const parseTags = (value: string): string[] => {
  if (!value.trim()) return []
  const unique = new Set(
    value
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
  )
  return Array.from(unique)
}

const toDraftFromPolicy = (policy: AdminContentAccessPolicyItem): PolicyDraftState => ({
  code: policy.code,
  label: policy.label,
  description: policy.description ?? '',
  active: policy.active,
  priority: String(policy.priority),
  effectiveFrom: toDateTimeLocalValue(policy.effectiveFrom),
  effectiveTo: toDateTimeLocalValue(policy.effectiveTo),
  requiredRole: policy.access.requiredRole,
  teaserAllowed: policy.access.teaserAllowed,
  blockedMessage: policy.access.blockedMessage ?? '',
  contentTypes:
    policy.match.contentTypes.length > 0
      ? policy.match.contentTypes
      : [...CONTENT_TYPE_OPTIONS],
  categories: policy.match.categories,
  tagsInput: policy.match.tags.join(', '),
  featuredOnly: policy.match.featuredOnly,
  changeReason: '',
})

const buildPayloadFromDraft = (
  draft: PolicyDraftState,
  mode: 'create' | 'update',
): AdminContentAccessPolicyPayload => {
  const payload: AdminContentAccessPolicyPayload = {
    label: draft.label.trim(),
    description: draft.description.trim() || null,
    active: draft.active,
    priority: toPositiveInt(draft.priority, 100),
    effectiveFrom: toIsoFromDateTimeLocal(draft.effectiveFrom),
    effectiveTo: toIsoFromDateTimeLocal(draft.effectiveTo),
    changeReason: draft.changeReason.trim() || undefined,
    match: {
      contentTypes:
        draft.contentTypes.length > 0 ? draft.contentTypes : [...CONTENT_TYPE_OPTIONS],
      categories: draft.categories,
      tags: parseTags(draft.tagsInput),
      featuredOnly: draft.featuredOnly,
    },
    access: {
      requiredRole: draft.requiredRole,
      teaserAllowed: draft.teaserAllowed,
      blockedMessage: draft.blockedMessage.trim() || null,
    },
  }

  if (mode === 'create') {
    payload.code = draft.code.trim()
  }

  return payload
}

const toggleArrayValue = <T extends string>(items: T[], value: T): T[] =>
  items.includes(value) ? items.filter((entry) => entry !== value) : [...items, value]

interface AdminMonetizationPaywallPageProps {
  embedded?: boolean
}

export default function AdminMonetizationPaywallPage({
  embedded = false,
}: AdminMonetizationPaywallPageProps) {
  const user = useAuthStore((state) => state.user)
  const canRead = hasAdminScope(user, 'admin.content.read')
  const canWrite = hasAdminScope(user, 'admin.content.moderate') && !user?.adminReadOnly

  const [activeFilter, setActiveFilter] = useState<'all' | 'true' | 'false'>('all')
  const [requiredRoleFilter, setRequiredRoleFilter] = useState<
    'all' | AdminContentAccessPolicyRequiredRole
  >('all')
  const [contentTypeFilter, setContentTypeFilter] = useState<
    'all' | AdminContentAccessPolicyContentType
  >('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null)
  const [draft, setDraft] = useState<PolicyDraftState>(() => createInitialDraft())
  const [preview, setPreview] = useState<AdminContentAccessPolicyPreviewResponse | null>(null)

  const query = useMemo(
    () => ({
      page,
      limit: 12,
      active: activeFilter === 'all' ? undefined : activeFilter === 'true',
      requiredRole: toFilterParam<AdminContentAccessPolicyRequiredRole>(requiredRoleFilter),
      contentType: toFilterParam<AdminContentAccessPolicyContentType>(contentTypeFilter),
      search: search.trim() || undefined,
    }),
    [activeFilter, contentTypeFilter, page, requiredRoleFilter, search],
  )

  const listQuery = useAdminContentAccessPolicies(query, { enabled: canRead })
  const activateMutation = useActivateAdminContentAccessPolicy()
  const deactivateMutation = useDeactivateAdminContentAccessPolicy()
  const previewMutation = usePreviewAdminContentAccessPolicy()
  const createMutation = useCreateAdminContentAccessPolicy()
  const updateMutation = useUpdateAdminContentAccessPolicy()

  const isPending = activateMutation.isPending || deactivateMutation.isPending
  const isSavePending = createMutation.isPending || updateMutation.isPending
  const isCreateMode = !selectedPolicyId

  const togglePolicy = async (policyId: string, active: boolean) => {
    try {
      if (active) {
        const response = await deactivateMutation.mutateAsync({
          policyId,
          changeReason: 'deactivated_via_monetization_ui',
        })
        toast.success(response.message)
      } else {
        const response = await activateMutation.mutateAsync({
          policyId,
          changeReason: 'activated_via_monetization_ui',
        })
        toast.success(response.message)
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleStartCreate = () => {
    setSelectedPolicyId(null)
    setDraft(createInitialDraft())
    setPreview(null)
  }

  const handleEditPolicy = (policy: AdminContentAccessPolicyItem) => {
    setSelectedPolicyId(policy.id)
    setDraft(toDraftFromPolicy(policy))
    setPreview(null)
  }

  const handlePreview = async () => {
    if (!canWrite) return

    try {
      const response = await previewMutation.mutateAsync(
        buildPayloadFromDraft(draft, isCreateMode ? 'create' : 'update'),
      )
      setPreview(response)
      toast.success('Preview de impacto atualizado.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleSave = async () => {
    if (!canWrite) return

    if (!draft.label.trim()) {
      toast.error('Campo label obrigatorio.')
      return
    }
    if (!draft.changeReason.trim()) {
      toast.error('Motivo obrigatorio para alterar policy.')
      return
    }

    if (isCreateMode && !draft.code.trim()) {
      toast.error('Campo code obrigatorio para criar policy.')
      return
    }

    try {
      const payload = buildPayloadFromDraft(draft, isCreateMode ? 'create' : 'update')

      const response = isCreateMode
        ? await createMutation.mutateAsync(payload)
        : await updateMutation.mutateAsync({
            policyId: selectedPolicyId!,
            data: payload,
          })

      setSelectedPolicyId(response.item.id)
      setDraft(toDraftFromPolicy(response.item))
      setPreview(null)
      toast.success(response.message)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <div className={cn('space-y-6', embedded ? 'pt-2' : '')}>
      {!embedded ? (
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Monetizacao - Paywall</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestao de policies de acesso premium por tipo de conteudo.
          </p>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" asChild>
          <a href="/admin/monetizacao">Paywall</a>
        </Button>
        <Button type="button" variant="outline" size="sm" asChild>
          <a href="/admin/monetizacao/subscricoes">Subscricoes</a>
        </Button>
      </div>

      {!canRead ? (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Sem permissao para leitura de paywall (`admin.content.read`).
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base">Policies de acesso</CardTitle>
              <CardDescription>
                Filtra por estado, role requerida e tipo de conteudo.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => listQuery.refetch().catch(() => undefined)}
              disabled={listQuery.isFetching}
            >
              <RefreshCw className={cn('h-4 w-4', listQuery.isFetching ? 'animate-spin' : '')} />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Select
              value={activeFilter}
              onValueChange={(value) => {
                setActiveFilter(value as 'all' | 'true' | 'false')
                setPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="true">Ativo</SelectItem>
                <SelectItem value="false">Inativo</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={requiredRoleFilter}
              onValueChange={(value) => {
                setRequiredRoleFilter(value as 'all' | AdminContentAccessPolicyRequiredRole)
                setPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Role requerida" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as roles</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="free">Free</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={contentTypeFilter}
              onValueChange={(value) => {
                setContentTypeFilter(value as 'all' | AdminContentAccessPolicyContentType)
                setPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de conteudo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {CONTENT_TYPE_OPTIONS.map((contentType) => (
                  <SelectItem key={contentType} value={contentType}>
                    {CONTENT_TYPE_LABELS[contentType]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              placeholder="Pesquisar code/label..."
            />
          </div>

          {listQuery.isLoading ? (
            <div className="space-y-2">
              <div className="h-20 animate-pulse rounded-md bg-muted" />
              <div className="h-20 animate-pulse rounded-md bg-muted" />
            </div>
          ) : (listQuery.data?.items.length ?? 0) === 0 ? (
            <p className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
              Sem policies para os filtros selecionados.
            </p>
          ) : (
            <div className="space-y-3">
              {listQuery.data?.items.map((policy) => (
                <div key={policy.id} className="rounded-md border border-border/70 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={policy.active ? 'secondary' : 'outline'}>
                        {policy.active ? 'Ativa' : 'Inativa'}
                      </Badge>
                      <Badge variant="outline">{policy.access.requiredRole}</Badge>
                      <Badge variant="outline">Prioridade {policy.priority}</Badge>
                      <Badge variant="outline">v{policy.version}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Atualizada: {formatDateTime(policy.updatedAt)}
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-semibold">{policy.label}</p>
                  <p className="text-xs text-muted-foreground">{policy.code}</p>
                  {policy.description ? (
                    <p className="mt-1 text-sm text-muted-foreground">{policy.description}</p>
                  ) : null}

                  <div className="mt-2 flex flex-wrap gap-1">
                    {policy.match.contentTypes.map((contentType) => (
                      <Badge key={`${policy.id}-${contentType}`} variant="outline" className="text-[10px]">
                        {contentType}
                      </Badge>
                    ))}
                    {policy.match.featuredOnly ? (
                      <Badge variant="outline" className="text-[10px]">
                        featured-only
                      </Badge>
                    ) : null}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs text-muted-foreground">
                      Historico: {policy.historyCount} | Teaser:{' '}
                      {policy.access.teaserAllowed ? 'on' : 'off'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditPolicy(policy)}
                        disabled={!canWrite || isSavePending}
                      >
                        <Edit3 className="h-4 w-4" />
                        Editar
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={policy.active ? 'outline' : 'default'}
                        onClick={() => togglePolicy(policy.id, policy.active)}
                        disabled={!canWrite || isPending}
                      >
                        {policy.active ? (
                          <>
                            <ShieldOff className="h-4 w-4" />
                            Desativar
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="h-4 w-4" />
                            Ativar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              Pagina {listQuery.data?.pagination.page ?? 1} de {listQuery.data?.pagination.pages ?? 1}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page <= 1}
              >
                Anterior
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setPage((current) => current + 1)}
                disabled={page >= (listQuery.data?.pagination.pages ?? 1)}
              >
                Seguinte
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base">
                {isCreateMode ? 'Criar policy de acesso' : 'Editar policy de acesso'}
              </CardTitle>
              <CardDescription>
                Fecho P4.3-01: create/edit de policy com preview de impacto.
              </CardDescription>
            </div>
            <Button type="button" variant="outline" onClick={handleStartCreate} disabled={!canWrite}>
              <Plus className="h-4 w-4" />
              Nova policy
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <div className="space-y-1.5">
              <Label htmlFor="policy-code">Code</Label>
              <Input
                id="policy-code"
                value={draft.code}
                onChange={(event) => setDraft((current) => ({ ...current, code: event.target.value }))}
                placeholder="premium_articles_default"
                disabled={!canWrite || !isCreateMode}
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="policy-label">Label</Label>
              <Input
                id="policy-label"
                value={draft.label}
                onChange={(event) => setDraft((current) => ({ ...current, label: event.target.value }))}
                placeholder="Acesso premium artigos"
                disabled={!canWrite}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="policy-priority">Prioridade</Label>
              <Input
                id="policy-priority"
                type="number"
                min={1}
                max={1000}
                value={draft.priority}
                onChange={(event) => setDraft((current) => ({ ...current, priority: event.target.value }))}
                disabled={!canWrite}
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="policy-required-role">Role requerida</Label>
              <Select
                value={draft.requiredRole}
                onValueChange={(value) =>
                  setDraft((current) => ({
                    ...current,
                    requiredRole: value as AdminContentAccessPolicyRequiredRole,
                  }))
                }
              >
                <SelectTrigger id="policy-required-role">
                  <SelectValue placeholder="Role requerida" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="premium">premium</SelectItem>
                  <SelectItem value="free">free</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="policy-effective-from">Effective from</Label>
              <Input
                id="policy-effective-from"
                type="datetime-local"
                value={draft.effectiveFrom}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, effectiveFrom: event.target.value }))
                }
                disabled={!canWrite}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="policy-effective-to">Effective to</Label>
              <Input
                id="policy-effective-to"
                type="datetime-local"
                value={draft.effectiveTo}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, effectiveTo: event.target.value }))
                }
                disabled={!canWrite}
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="policy-description">Descricao</Label>
              <Textarea
                id="policy-description"
                rows={3}
                value={draft.description}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, description: event.target.value }))
                }
                placeholder="Descricao operacional da policy..."
                disabled={!canWrite}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="policy-blocked-message">Mensagem de bloqueio</Label>
              <Textarea
                id="policy-blocked-message"
                rows={3}
                value={draft.blockedMessage}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, blockedMessage: event.target.value }))
                }
                placeholder="Conteudo disponivel para utilizadores premium."
                disabled={!canWrite}
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="policy-tags">Tags (separadas por virgula)</Label>
              <Input
                id="policy-tags"
                value={draft.tagsInput}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, tagsInput: event.target.value }))
                }
                placeholder="reit, dividendos, valuation"
                disabled={!canWrite}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="policy-reason">Motivo da alteracao</Label>
              <Input
                id="policy-reason"
                value={draft.changeReason}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, changeReason: event.target.value }))
                }
                placeholder="policy_update_via_admin_ui"
                disabled={!canWrite}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-md border border-border/70 p-3">
              <Switch
                checked={draft.active}
                onCheckedChange={(checked) => setDraft((current) => ({ ...current, active: checked }))}
                disabled={!canWrite}
              />
              <div>
                <p className="text-sm font-medium">Policy ativa</p>
                <p className="text-xs text-muted-foreground">Define se entra em avaliacao de acesso.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-border/70 p-3">
              <Switch
                checked={draft.teaserAllowed}
                onCheckedChange={(checked) =>
                  setDraft((current) => ({ ...current, teaserAllowed: checked }))
                }
                disabled={!canWrite}
              />
              <div>
                <p className="text-sm font-medium">Teaser permitido</p>
                <p className="text-xs text-muted-foreground">Permite preview parcial para nao elegiveis.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-border/70 p-3">
              <Switch
                checked={draft.featuredOnly}
                onCheckedChange={(checked) =>
                  setDraft((current) => ({ ...current, featuredOnly: checked }))
                }
                disabled={!canWrite}
              />
              <div>
                <p className="text-sm font-medium">Apenas featured</p>
                <p className="text-xs text-muted-foreground">Filtra para conteudo destacado.</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Tipos de conteudo</p>
            <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {CONTENT_TYPE_OPTIONS.map((contentType) => (
                <label
                  key={contentType}
                  className="flex items-center gap-2 rounded-md border border-border/70 px-2 py-1.5 text-sm"
                >
                  <Checkbox
                    checked={draft.contentTypes.includes(contentType)}
                    onCheckedChange={() =>
                      setDraft((current) => ({
                        ...current,
                        contentTypes: toggleArrayValue(current.contentTypes, contentType),
                      }))
                    }
                    disabled={!canWrite}
                  />
                  <span>{CONTENT_TYPE_LABELS[contentType]}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Categorias</p>
            <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {CATEGORY_OPTIONS.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-2 rounded-md border border-border/70 px-2 py-1.5 text-sm"
                >
                  <Checkbox
                    checked={draft.categories.includes(category)}
                    onCheckedChange={() =>
                      setDraft((current) => ({
                        ...current,
                        categories: toggleArrayValue(current.categories, category),
                      }))
                    }
                    disabled={!canWrite}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handlePreview}
              disabled={!canWrite || previewMutation.isPending}
            >
              <Sparkles className="h-4 w-4" />
              Preview impacto
            </Button>
            <Button type="button" onClick={handleSave} disabled={!canWrite || isSavePending}>
              {isCreateMode ? 'Criar policy' : 'Guardar alteracoes'}
            </Button>
          </div>

          {preview ? (
            <div className="space-y-3 rounded-md border border-border/70 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold">Preview de impacto</p>
                <p className="text-xs text-muted-foreground">
                  Gerado em {formatDateTime(preview.generatedAt)}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-md border border-border/60 p-2">
                  <p className="text-xs text-muted-foreground">Total match</p>
                  <p className="text-lg font-semibold">{preview.impact.totalMatches}</p>
                </div>
                <div className="rounded-md border border-border/60 p-2">
                  <p className="text-xs text-muted-foreground">Atualmente premium</p>
                  <p className="text-lg font-semibold">{preview.impact.currentlyPremium}</p>
                </div>
                <div className="rounded-md border border-border/60 p-2">
                  <p className="text-xs text-muted-foreground">Atualmente free</p>
                  <p className="text-lg font-semibold">{preview.impact.currentlyFree}</p>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {CONTENT_TYPE_OPTIONS.map((contentType) => {
                  const stats = preview.impact.byContentType[contentType]
                  return (
                    <div key={contentType} className="rounded-md border border-border/60 p-2 text-xs">
                      <p className="font-semibold">{CONTENT_TYPE_LABELS[contentType]}</p>
                      <p className="text-muted-foreground">
                        total: {stats.total} | premium: {stats.currentlyPremium} | free:{' '}
                        {stats.currentlyFree}
                      </p>
                    </div>
                  )
                })}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Amostra de conteudo afetado</p>
                {preview.sample.length === 0 ? (
                  <p className="rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">
                    Sem amostra para os filtros atuais.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {preview.sample.map((sample) => (
                      <div
                        key={`${sample.contentType}-${sample.id}`}
                        className="rounded-md border border-border/60 p-2 text-xs"
                      >
                        <p className="font-semibold">
                          [{sample.contentType}] {sample.title || '(sem titulo)'}
                        </p>
                        <p className="text-muted-foreground">
                          {sample.isPremium ? 'premium' : 'free'} | categoria:{' '}
                          {sample.category ?? '-'} | publicado: {formatDateTime(sample.publishedAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
