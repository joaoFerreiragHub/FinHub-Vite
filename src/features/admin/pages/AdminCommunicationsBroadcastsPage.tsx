import { useMemo, useState } from 'react'
import { CheckCircle2, Megaphone, RefreshCw, Send, Users } from 'lucide-react'
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
  useAdminBroadcast,
  useAdminBroadcasts,
  useApproveAdminBroadcast,
  useCreateAdminBroadcast,
  usePreviewAdminBroadcastAudience,
  useSendAdminBroadcast,
} from '../hooks/useAdminBroadcasts'
import { hasAdminScope } from '../lib/access'
import type {
  AdminBroadcastAccountStatus,
  AdminBroadcastChannel,
  AdminBroadcastHistoryAction,
  AdminBroadcastHistoryEntry,
  AdminBroadcastRole,
  AdminBroadcastSegmentInput,
  AdminBroadcastStatus,
} from '../types/adminBroadcasts'

interface AdminCommunicationsBroadcastsPageProps {
  embedded?: boolean
}

const STATUS_LABEL: Record<AdminBroadcastStatus, string> = {
  draft: 'Draft',
  approved: 'Aprovado',
  sent: 'Enviado',
  failed: 'Falhou',
  canceled: 'Cancelado',
}

const STATUS_BADGE_VARIANT: Record<AdminBroadcastStatus, 'secondary' | 'outline' | 'destructive'> = {
  draft: 'outline',
  approved: 'secondary',
  sent: 'secondary',
  failed: 'destructive',
  canceled: 'outline',
}

const ROLE_LABEL: Record<AdminBroadcastRole, string> = {
  visitor: 'Visitante',
  free: 'Free',
  premium: 'Premium',
  creator: 'Creator',
  admin: 'Admin',
}

const ACCOUNT_STATUS_LABEL: Record<AdminBroadcastAccountStatus, string> = {
  active: 'Ativa',
  suspended: 'Suspensa',
  banned: 'Banida',
}

const HISTORY_ACTION_LABEL: Record<AdminBroadcastHistoryAction, string> = {
  created: 'Criado',
  approved: 'Aprovado',
  send_started: 'Envio iniciado',
  sent: 'Enviado',
  failed: 'Falhou',
  canceled: 'Cancelado',
}

const ROLE_OPTIONS: readonly AdminBroadcastRole[] = [
  'visitor',
  'free',
  'premium',
  'creator',
  'admin',
]
const ACCOUNT_STATUS_OPTIONS: readonly AdminBroadcastAccountStatus[] = [
  'active',
  'suspended',
  'banned',
]

const formatDateTime = (value: string | null): string => {
  if (!value) return '-'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '-'
  return new Intl.DateTimeFormat('pt-PT', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(parsed)
}

const parseUniqueIds = (value: string): string[] => {
  if (!value.trim()) return []
  const unique = new Set(
    value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  )
  return Array.from(unique)
}

const toPositiveIntegerOrUndefined = (value: string): number | undefined => {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed < 1) return undefined
  return parsed
}

const formatActor = (entry: AdminBroadcastHistoryEntry): string => {
  if (entry.changedBy?.name) return entry.changedBy.name
  if (entry.changedBy?.username) return entry.changedBy.username
  if (entry.changedBy?.email) return entry.changedBy.email
  if (entry.changedBy?.id) return entry.changedBy.id
  return 'sistema'
}

const toggleArrayValue = <T extends string>(items: T[], value: T): T[] =>
  items.includes(value) ? items.filter((entry) => entry !== value) : [...items, value]

const toFilterParam = <T extends string>(value: string): T | undefined =>
  value === 'all' ? undefined : (value as T)

export default function AdminCommunicationsBroadcastsPage({
  embedded = false,
}: AdminCommunicationsBroadcastsPageProps) {
  const user = useAuthStore((state) => state.user)
  const canRead = hasAdminScope(user, 'admin.users.read')
  const canWrite = hasAdminScope(user, 'admin.users.write') && !user?.adminReadOnly

  const [statusFilter, setStatusFilter] = useState<'all' | AdminBroadcastStatus>('all')
  const [channelFilter, setChannelFilter] = useState<'all' | AdminBroadcastChannel>('all')
  const [searchFilter, setSearchFilter] = useState('')
  const [page, setPage] = useState(1)
  const [selectedBroadcastId, setSelectedBroadcastId] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [channel, setChannel] = useState<AdminBroadcastChannel>('in_app')
  const [roles, setRoles] = useState<AdminBroadcastRole[]>([])
  const [accountStatuses, setAccountStatuses] = useState<AdminBroadcastAccountStatus[]>(['active'])
  const [includeUsersInput, setIncludeUsersInput] = useState('')
  const [excludeUsersInput, setExcludeUsersInput] = useState('')
  const [lastActiveWithinDays, setLastActiveWithinDays] = useState('')
  const [previewSampleLimit, setPreviewSampleLimit] = useState('8')
  const [composerNote, setComposerNote] = useState('')

  const [actionReason, setActionReason] = useState('')
  const [actionNote, setActionNote] = useState('')

  const query = useMemo(
    () => ({
      page,
      limit: 15,
      status: toFilterParam<AdminBroadcastStatus>(statusFilter),
      channel: toFilterParam<AdminBroadcastChannel>(channelFilter),
      search: searchFilter.trim() || undefined,
    }),
    [channelFilter, page, searchFilter, statusFilter],
  )

  const broadcastsQuery = useAdminBroadcasts(query, { enabled: canRead })
  const selectedBroadcastQuery = useAdminBroadcast(selectedBroadcastId, {
    enabled: canRead && Boolean(selectedBroadcastId),
  })
  const previewMutation = usePreviewAdminBroadcastAudience()
  const createMutation = useCreateAdminBroadcast()
  const approveMutation = useApproveAdminBroadcast()
  const sendMutation = useSendAdminBroadcast()

  const previewData = previewMutation.data ?? null
  const isMutationPending =
    createMutation.isPending || approveMutation.isPending || sendMutation.isPending

  const selectedFromList =
    selectedBroadcastId && broadcastsQuery.data
      ? (broadcastsQuery.data.items.find((item) => item.id === selectedBroadcastId) ?? null)
      : null
  const selectedBroadcast = selectedBroadcastQuery.data ?? selectedFromList ?? null

  const sortedHistory = useMemo(() => {
    const rows = selectedBroadcast?.history ?? []
    return [...rows].sort((left, right) => {
      const leftTime = left.changedAt ? new Date(left.changedAt).getTime() : 0
      const rightTime = right.changedAt ? new Date(right.changedAt).getTime() : 0
      return rightTime - leftTime
    })
  }, [selectedBroadcast?.history])

  const buildSegmentPayload = (): AdminBroadcastSegmentInput | undefined => {
    const payload: AdminBroadcastSegmentInput = {}
    if (roles.length > 0) payload.roles = roles
    if (accountStatuses.length > 0) payload.accountStatuses = accountStatuses

    const includeUsers = parseUniqueIds(includeUsersInput)
    if (includeUsers.length > 0) payload.includeUsers = includeUsers

    const excludeUsers = parseUniqueIds(excludeUsersInput)
    if (excludeUsers.length > 0) payload.excludeUsers = excludeUsers

    const lastActive = toPositiveIntegerOrUndefined(lastActiveWithinDays)
    if (lastActive) payload.lastActiveWithinDays = lastActive

    return Object.keys(payload).length > 0 ? payload : undefined
  }

  const handlePreviewAudience = async () => {
    try {
      const result = await previewMutation.mutateAsync({
        segment: buildSegmentPayload(),
        sampleLimit: toPositiveIntegerOrUndefined(previewSampleLimit),
      })
      toast.success(`Preview atualizado: ${result.estimatedRecipients} destinatarios estimados.`)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleCreateBroadcast = async () => {
    if (!canWrite) return

    if (!title.trim()) {
      toast.error('Titulo obrigatorio para criar broadcast.')
      return
    }
    if (!message.trim()) {
      toast.error('Mensagem obrigatoria para criar broadcast.')
      return
    }

    try {
      const result = await createMutation.mutateAsync({
        title: title.trim(),
        message: message.trim(),
        channel,
        segment: buildSegmentPayload(),
        note: composerNote.trim() || undefined,
      })
      setSelectedBroadcastId(result.item.id)
      setActionReason('')
      setActionNote('')
      toast.success(result.message)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const ensureActionContext = (): string | null => {
    if (!selectedBroadcastId) {
      toast.error('Seleciona primeiro um broadcast.')
      return null
    }
    const normalizedReason = actionReason.trim()
    if (!normalizedReason) {
      toast.error('Motivo obrigatorio para aprovar/enviar broadcast.')
      return null
    }
    return normalizedReason
  }

  const handleApprove = async () => {
    const normalizedReason = ensureActionContext()
    if (!normalizedReason || !selectedBroadcastId) return

    try {
      const result = await approveMutation.mutateAsync({
        broadcastId: selectedBroadcastId,
        data: {
          reason: normalizedReason,
          note: actionNote.trim() || undefined,
        },
      })
      toast.success(result.message)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleSend = async () => {
    const normalizedReason = ensureActionContext()
    if (!normalizedReason || !selectedBroadcastId) return

    try {
      const result = await sendMutation.mutateAsync({
        broadcastId: selectedBroadcastId,
        data: {
          reason: normalizedReason,
          note: actionNote.trim() || undefined,
        },
      })
      toast.success(result.message)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <div className={cn('space-y-6', embedded ? 'pt-2' : '')}>
      {!embedded ? (
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Comunicacoes admin segmentadas</h1>
          <p className="text-sm text-muted-foreground">
            Composer, preview de audiencia e historico operacional de envios in-app.
          </p>
        </div>
      ) : null}

      <AdminOperationsNav active="communications" />

      {!canRead ? (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Sem permissao para leitura de comunicacoes (`admin.users.read`).
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumo operacional</CardTitle>
          <CardDescription>Distribuicao de broadcasts por estado.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <div className="rounded-md border border-border/70 p-3 text-sm">
            <p className="text-xs text-muted-foreground">Draft</p>
            <p className="text-lg font-semibold">{broadcastsQuery.data?.summary.draft ?? 0}</p>
          </div>
          <div className="rounded-md border border-border/70 p-3 text-sm">
            <p className="text-xs text-muted-foreground">Aprovados</p>
            <p className="text-lg font-semibold">{broadcastsQuery.data?.summary.approved ?? 0}</p>
          </div>
          <div className="rounded-md border border-border/70 p-3 text-sm">
            <p className="text-xs text-muted-foreground">Enviados</p>
            <p className="text-lg font-semibold">{broadcastsQuery.data?.summary.sent ?? 0}</p>
          </div>
          <div className="rounded-md border border-border/70 p-3 text-sm">
            <p className="text-xs text-muted-foreground">Falhados</p>
            <p className="text-lg font-semibold">{broadcastsQuery.data?.summary.failed ?? 0}</p>
          </div>
          <div className="rounded-md border border-border/70 p-3 text-sm">
            <p className="text-xs text-muted-foreground">Cancelados</p>
            <p className="text-lg font-semibold">{broadcastsQuery.data?.summary.canceled ?? 0}</p>
          </div>
          <div className="rounded-md border border-border/70 p-3 text-sm">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-lg font-semibold">{broadcastsQuery.data?.summary.total ?? 0}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Megaphone className="h-4 w-4 text-muted-foreground" />
            Composer e segmentacao
          </CardTitle>
          <CardDescription>
            Define segmento por role/plano/atividade e valida audiencia antes de criar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="broadcast-title">Titulo</Label>
              <Input
                id="broadcast-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Ex: Atualizacao operacional da plataforma"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="broadcast-channel">Canal</Label>
              <Select
                value={channel}
                onValueChange={(value) => setChannel(value as AdminBroadcastChannel)}
              >
                <SelectTrigger id="broadcast-channel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_app">In-app</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="broadcast-message">Mensagem</Label>
            <Textarea
              id="broadcast-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Mensagem enviada para os utilizadores elegiveis."
              rows={4}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 rounded-md border border-border/70 p-3">
              <p className="text-sm font-medium">Roles alvo</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {ROLE_OPTIONS.map((role) => (
                  <label key={role} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Checkbox
                      checked={roles.includes(role)}
                      onCheckedChange={() => setRoles((current) => toggleArrayValue(current, role))}
                    />
                    {ROLE_LABEL[role]}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2 rounded-md border border-border/70 p-3">
              <p className="text-sm font-medium">Estado de conta</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {ACCOUNT_STATUS_OPTIONS.map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <Checkbox
                      checked={accountStatuses.includes(status)}
                      onCheckedChange={() =>
                        setAccountStatuses((current) => toggleArrayValue(current, status))
                      }
                    />
                    {ACCOUNT_STATUS_LABEL[status]}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="broadcast-include-users">Include users (IDs, separados por virgula)</Label>
              <Input
                id="broadcast-include-users"
                value={includeUsersInput}
                onChange={(event) => setIncludeUsersInput(event.target.value)}
                placeholder="id1,id2,id3"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="broadcast-exclude-users">Exclude users (IDs, separados por virgula)</Label>
              <Input
                id="broadcast-exclude-users"
                value={excludeUsersInput}
                onChange={(event) => setExcludeUsersInput(event.target.value)}
                placeholder="id4,id5"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="broadcast-last-active-days">Ativos nos ultimos dias</Label>
              <Input
                id="broadcast-last-active-days"
                type="number"
                min={1}
                value={lastActiveWithinDays}
                onChange={(event) => setLastActiveWithinDays(event.target.value)}
                placeholder="30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="broadcast-preview-limit">Amostra preview</Label>
              <Input
                id="broadcast-preview-limit"
                type="number"
                min={1}
                max={20}
                value={previewSampleLimit}
                onChange={(event) => setPreviewSampleLimit(event.target.value)}
                placeholder="8"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="broadcast-create-note">Nota de criacao (opcional)</Label>
              <Input
                id="broadcast-create-note"
                value={composerNote}
                onChange={(event) => setComposerNote(event.target.value)}
                placeholder="Contexto interno"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handlePreviewAudience}
              disabled={previewMutation.isPending || !canRead}
            >
              <Users className="h-4 w-4" />
              Preview audiencia
            </Button>
            <Button
              type="button"
              onClick={handleCreateBroadcast}
              disabled={!canWrite || createMutation.isPending}
            >
              <CheckCircle2 className="h-4 w-4" />
              Criar broadcast
            </Button>
          </div>

          {previewData ? (
            <div className="space-y-3 rounded-md border border-border/70 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">
                  Destinatarios estimados: {previewData.estimatedRecipients}
                </Badge>
                <Badge variant={previewData.approvalRequired ? 'destructive' : 'secondary'}>
                  {previewData.approvalRequired
                    ? `Requer aprovacao (>= ${previewData.massApprovalMinRecipients})`
                    : 'Aprovacao massiva nao obrigatoria'}
                </Badge>
              </div>
              {previewData.sample.length === 0 ? (
                <p className="text-xs text-muted-foreground">Sem amostra para este segmento.</p>
              ) : (
                <div className="space-y-2">
                  {previewData.sample.map((sampleRow, index) => (
                    <div
                      key={`${sampleRow.id ?? 'sample'}-${index}`}
                      className="rounded-md border border-border/60 p-2 text-xs"
                    >
                      <p className="font-medium">
                        {sampleRow.name || sampleRow.username || sampleRow.email || sampleRow.id || '-'}
                      </p>
                      <p className="text-muted-foreground">
                        {sampleRow.role ?? '-'} | {sampleRow.accountStatus ?? '-'} | ultimo acesso{' '}
                        {formatDateTime(sampleRow.lastActiveAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base">Historico de broadcasts</CardTitle>
              <CardDescription>
                Seleciona um item para ver detalhe, trilho de aprovacao e entrega.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => broadcastsQuery.refetch().catch(() => undefined)}
              disabled={broadcastsQuery.isFetching}
            >
              <RefreshCw className={cn('h-4 w-4', broadcastsQuery.isFetching ? 'animate-spin' : '')} />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as 'all' | AdminBroadcastStatus)
                setPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="approved">Aprovado</SelectItem>
                <SelectItem value="sent">Enviado</SelectItem>
                <SelectItem value="failed">Falhou</SelectItem>
                <SelectItem value="canceled">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={channelFilter}
              onValueChange={(value) => {
                setChannelFilter(value as 'all' | AdminBroadcastChannel)
                setPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Canal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os canais</SelectItem>
                <SelectItem value="in_app">In-app</SelectItem>
              </SelectContent>
            </Select>

            <Input
              value={searchFilter}
              onChange={(event) => {
                setSearchFilter(event.target.value)
                setPage(1)
              }}
              placeholder="Pesquisar titulo ou mensagem..."
            />
          </div>

          {broadcastsQuery.isLoading ? (
            <div className="space-y-2">
              <div className="h-16 animate-pulse rounded-md bg-muted" />
              <div className="h-16 animate-pulse rounded-md bg-muted" />
            </div>
          ) : (broadcastsQuery.data?.items.length ?? 0) === 0 ? (
            <p className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
              Sem broadcasts para os filtros selecionados.
            </p>
          ) : (
            <div className="space-y-2">
              {broadcastsQuery.data?.items.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    'rounded-md border border-border/70 p-3',
                    selectedBroadcastId === item.id ? 'border-primary/40 bg-primary/5' : '',
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {STATUS_LABEL[item.status]} | Canal: {item.channel} | v{item.version}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={STATUS_BADGE_VARIANT[item.status]}>
                        {STATUS_LABEL[item.status]}
                      </Badge>
                      <Badge variant="outline">Audiencia: {item.audienceEstimate}</Badge>
                      <Button
                        type="button"
                        size="sm"
                        variant={selectedBroadcastId === item.id ? 'default' : 'outline'}
                        onClick={() => setSelectedBroadcastId(item.id)}
                      >
                        Detalhe
                      </Button>
                    </div>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{item.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Atualizado em {formatDateTime(item.updatedAt)} | entrega {item.delivery.sent}/
                    {item.delivery.attempted}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              Pagina {broadcastsQuery.data?.pagination.page ?? 1} de{' '}
              {broadcastsQuery.data?.pagination.pages ?? 1}
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
                disabled={page >= (broadcastsQuery.data?.pagination.pages ?? 1)}
              >
                Seguinte
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detalhe e acoes de envio</CardTitle>
          <CardDescription>
            Aprovar e enviar com motivo obrigatorio para auditoria operacional.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!selectedBroadcast ? (
            <p className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
              Seleciona um broadcast na lista para ver detalhe e executar acoes.
            </p>
          ) : (
            <>
              <div className="rounded-md border border-border/70 p-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={STATUS_BADGE_VARIANT[selectedBroadcast.status]}>
                    {STATUS_LABEL[selectedBroadcast.status]}
                  </Badge>
                  <Badge variant="outline">Canal {selectedBroadcast.channel}</Badge>
                  <Badge variant="outline">Audiencia {selectedBroadcast.audienceEstimate}</Badge>
                  <Badge variant={selectedBroadcast.approval.required ? 'destructive' : 'outline'}>
                    {selectedBroadcast.approval.required
                      ? 'Aprovacao obrigatoria'
                      : 'Aprovacao opcional'}
                  </Badge>
                </div>
                <p className="mt-2 font-semibold">{selectedBroadcast.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{selectedBroadcast.message}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Criado em {formatDateTime(selectedBroadcast.createdAt)} | atualizado em{' '}
                  {formatDateTime(selectedBroadcast.updatedAt)}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-md border border-border/70 p-3 text-xs">
                  <p className="font-medium">Aprovacao</p>
                  <p className="mt-1 text-muted-foreground">
                    Estado: {selectedBroadcast.approval.approvedBy ? 'Aprovado' : 'Pendente'} | por{' '}
                    {selectedBroadcast.approval.approvedBy?.name ||
                      selectedBroadcast.approval.approvedBy?.username ||
                      selectedBroadcast.approval.approvedBy?.email ||
                      '-'}
                  </p>
                  <p className="text-muted-foreground">
                    Em {formatDateTime(selectedBroadcast.approval.approvedAt)}
                  </p>
                  <p className="text-muted-foreground">
                    Motivo: {selectedBroadcast.approval.reason || '-'}
                  </p>
                </div>
                <div className="rounded-md border border-border/70 p-3 text-xs">
                  <p className="font-medium">Entrega</p>
                  <p className="mt-1 text-muted-foreground">
                    Tentadas: {selectedBroadcast.delivery.attempted}
                  </p>
                  <p className="text-muted-foreground">Enviadas: {selectedBroadcast.delivery.sent}</p>
                  <p className="text-muted-foreground">Falhadas: {selectedBroadcast.delivery.failed}</p>
                  <p className="text-muted-foreground">
                    SentAt: {formatDateTime(selectedBroadcast.delivery.sentAt)}
                  </p>
                </div>
                <div className="rounded-md border border-border/70 p-3 text-xs">
                  <p className="font-medium">Segmento</p>
                  <p className="mt-1 text-muted-foreground">
                    Roles:{' '}
                    {selectedBroadcast.segment.roles.length > 0
                      ? selectedBroadcast.segment.roles.join(', ')
                      : 'all'}
                  </p>
                  <p className="text-muted-foreground">
                    Estados:{' '}
                    {selectedBroadcast.segment.accountStatuses.length > 0
                      ? selectedBroadcast.segment.accountStatuses.join(', ')
                      : 'all'}
                  </p>
                  <p className="text-muted-foreground">
                    Atividade {'<='} {selectedBroadcast.segment.lastActiveWithinDays ?? '-'} dias
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  value={actionReason}
                  onChange={(event) => setActionReason(event.target.value)}
                  placeholder="Motivo obrigatorio para aprovar/enviar"
                />
                <Input
                  value={actionNote}
                  onChange={(event) => setActionNote(event.target.value)}
                  placeholder="Nota opcional para auditoria"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleApprove}
                  disabled={!canWrite || isMutationPending || selectedBroadcast.status === 'sent'}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Aprovar
                </Button>
                <Button
                  type="button"
                  onClick={handleSend}
                  disabled={
                    !canWrite ||
                    isMutationPending ||
                    selectedBroadcast.status === 'sent' ||
                    selectedBroadcast.status === 'canceled'
                  }
                >
                  <Send className="h-4 w-4" />
                  Enviar
                </Button>
              </div>

              {selectedBroadcastQuery.isFetching ? (
                <div className="space-y-2">
                  <div className="h-16 animate-pulse rounded-md bg-muted" />
                  <div className="h-16 animate-pulse rounded-md bg-muted" />
                </div>
              ) : (
                <div className="space-y-2 rounded-md border border-border/70 p-3">
                  <p className="text-sm font-semibold">Timeline</p>
                  {sortedHistory.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Sem historico para este broadcast.</p>
                  ) : (
                    sortedHistory.map((entry, index) => (
                      <div
                        key={`${entry.action}-${entry.changedAt ?? index}`}
                        className="rounded-md border border-border/60 p-2 text-xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <Badge variant="outline">
                            {HISTORY_ACTION_LABEL[entry.action] ?? entry.action}
                          </Badge>
                          <span className="text-muted-foreground">
                            {formatDateTime(entry.changedAt)}
                          </span>
                        </div>
                        <p className="mt-1">
                          <span className="text-muted-foreground">Motivo:</span> {entry.reason || '-'}
                        </p>
                        {entry.note ? (
                          <p className="mt-0.5">
                            <span className="text-muted-foreground">Nota:</span> {entry.note}
                          </p>
                        ) : null}
                        <p className="mt-0.5">
                          <span className="text-muted-foreground">Ator:</span> {formatActor(entry)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
