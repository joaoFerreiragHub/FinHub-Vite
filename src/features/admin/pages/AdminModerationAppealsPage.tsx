import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { toast } from 'react-toastify'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { hasAdminScope } from '../lib/access'
import {
  useAdminModerationAppealById,
  useAdminModerationAppeals,
  useUpdateAdminModerationAppealStatus,
} from '../hooks/useAdminModerationAppeals'
import type {
  AdminModerationAppealContentType,
  AdminModerationAppealHistoryEntry,
  AdminModerationAppealSeverity,
  AdminModerationAppealStatus,
} from '../types/adminModerationAppeals'

interface AdminModerationAppealsPageProps {
  embedded?: boolean
}

type StatusFilter = 'all' | AdminModerationAppealStatus
type SeverityFilter = 'all' | AdminModerationAppealSeverity
type ContentTypeFilter = 'all' | AdminModerationAppealContentType
type BreachedSlaFilter = 'all' | 'breached' | 'on_time'

const CONTENT_TYPE_LABEL: Record<AdminModerationAppealContentType, string> = {
  article: 'Artigo',
  video: 'Video',
  course: 'Curso',
  live: 'Live',
  podcast: 'Podcast',
  book: 'Livro',
  comment: 'Comentario',
  review: 'Review',
}

const STATUS_LABEL: Record<AdminModerationAppealStatus, string> = {
  open: 'Aberta',
  under_review: 'Em revisao',
  accepted: 'Aceite',
  rejected: 'Rejeitada',
  closed: 'Fechada',
}

const SEVERITY_LABEL: Record<AdminModerationAppealSeverity, string> = {
  low: 'Low',
  medium: 'Media',
  high: 'High',
  critical: 'Critica',
}

const STATUS_REASON_PRESETS: Record<
  AdminModerationAppealStatus,
  Array<{ code: string; label: string; reason: string }>
> = {
  open: [
    {
      code: 'reopen_context',
      label: 'Reabrir por contexto novo',
      reason: 'Reabertura por contexto operacional adicional.',
    },
  ],
  under_review: [
    {
      code: 'triage_started',
      label: 'Triagem iniciada',
      reason: 'Apelacao encaminhada para revisao operacional.',
    },
    {
      code: 'pending_evidence',
      label: 'A aguardar evidencias',
      reason: 'Apelacao em revisao com recolha de evidencias adicionais.',
    },
  ],
  accepted: [
    {
      code: 'accepted_false_positive',
      label: 'Falso positivo validado',
      reason: 'Apelacao aceite apos validacao de falso positivo.',
    },
    {
      code: 'accepted_context',
      label: 'Contexto confirmado',
      reason: 'Apelacao aceite apos analise de contexto e impacto.',
    },
  ],
  rejected: [
    {
      code: 'rejected_policy',
      label: 'Politica confirmada',
      reason: 'Apelacao rejeitada por conformidade com a politica vigente.',
    },
    {
      code: 'rejected_insufficient',
      label: 'Sem base suficiente',
      reason: 'Apelacao rejeitada por evidencia insuficiente para reversao.',
    },
  ],
  closed: [
    {
      code: 'closed_resolved',
      label: 'Encerrada por resolucao',
      reason: 'Apelacao encerrada apos resolucao operacional.',
    },
    {
      code: 'closed_timeout',
      label: 'Encerrada por fim de ciclo',
      reason: 'Apelacao encerrada no fecho do ciclo de revisao.',
    },
  ],
}

const toPositiveIntegerOrUndefined = (value: string): number | undefined => {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed < 1) return undefined
  return parsed
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

const formatSla = (remainingMinutes: number | null): string => {
  if (remainingMinutes === null) return '-'
  if (remainingMinutes < 0) return 'Vencido'

  const hours = Math.floor(remainingMinutes / 60)
  const minutes = remainingMinutes % 60
  return `${hours}h ${minutes}m`
}

const historyActor = (entry: AdminModerationAppealHistoryEntry): string => {
  if (entry.changedBy?.name) return entry.changedBy.name
  if (entry.changedBy?.username) return entry.changedBy.username
  if (entry.changedBy?.email) return entry.changedBy.email
  if (entry.changedBy?.id) return entry.changedBy.id
  return 'sistema'
}

const severityBadgeVariant = (
  severity: AdminModerationAppealSeverity,
): 'destructive' | 'outline' | 'secondary' => {
  if (severity === 'critical') return 'destructive'
  if (severity === 'high') return 'outline'
  return 'secondary'
}

const statusBadgeVariant = (
  status: AdminModerationAppealStatus,
): 'secondary' | 'outline' | 'destructive' => {
  if (status === 'accepted') return 'secondary'
  if (status === 'rejected') return 'destructive'
  return 'outline'
}

const getDefaultNextStatus = (
  currentStatus: AdminModerationAppealStatus,
): AdminModerationAppealStatus => {
  if (currentStatus === 'open') return 'under_review'
  if (currentStatus === 'under_review') return 'accepted'
  if (currentStatus === 'accepted' || currentStatus === 'rejected') return 'closed'
  return 'under_review'
}

const getDefaultReasonPreset = (nextStatus: AdminModerationAppealStatus) =>
  STATUS_REASON_PRESETS[nextStatus][0]

export default function AdminModerationAppealsPage({
  embedded = false,
}: AdminModerationAppealsPageProps) {
  const user = useAuthStore((state) => state.user)
  const canRead = hasAdminScope(user, 'admin.content.read')
  const canWrite = hasAdminScope(user, 'admin.content.moderate') && !user?.adminReadOnly

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all')
  const [contentTypeFilter, setContentTypeFilter] = useState<ContentTypeFilter>('all')
  const [breachedSlaFilter, setBreachedSlaFilter] = useState<BreachedSlaFilter>('all')
  const [searchFilter, setSearchFilter] = useState('')
  const [page, setPage] = useState('1')

  const [selectedAppealId, setSelectedAppealId] = useState<string | null>(null)
  const [nextStatus, setNextStatus] = useState<AdminModerationAppealStatus>('under_review')
  const [reasonPresetCode, setReasonPresetCode] = useState(
    getDefaultReasonPreset('under_review').code,
  )
  const [reason, setReason] = useState(getDefaultReasonPreset('under_review').reason)
  const [note, setNote] = useState('')

  const query = useMemo(
    () => ({
      page: toPositiveIntegerOrUndefined(page),
      limit: 20,
      status: statusFilter === 'all' ? undefined : statusFilter,
      severity: severityFilter === 'all' ? undefined : severityFilter,
      contentType: contentTypeFilter === 'all' ? undefined : contentTypeFilter,
      breachedSla:
        breachedSlaFilter === 'all' ? undefined : breachedSlaFilter === 'breached' ? true : false,
      search: searchFilter.trim() || undefined,
    }),
    [breachedSlaFilter, contentTypeFilter, page, searchFilter, severityFilter, statusFilter],
  )

  const appealsQuery = useAdminModerationAppeals(query, { enabled: canRead })
  const selectedAppealQuery = useAdminModerationAppealById(selectedAppealId, {
    enabled: canRead && Boolean(selectedAppealId),
  })
  const updateStatusMutation = useUpdateAdminModerationAppealStatus()

  const selectedFromList =
    selectedAppealId && appealsQuery.data
      ? (appealsQuery.data.items.find((item) => item.id === selectedAppealId) ?? null)
      : null
  const selectedAppeal = selectedAppealQuery.data ?? selectedFromList ?? null
  const selectedHistory = useMemo(() => {
    const rows = selectedAppeal?.history ?? []
    return [...rows].sort((left, right) => {
      const leftTime = left.changedAt ? new Date(left.changedAt).getTime() : 0
      const rightTime = right.changedAt ? new Date(right.changedAt).getTime() : 0
      return rightTime - leftTime
    })
  }, [selectedAppeal?.history])

  useEffect(() => {
    if (!selectedAppeal) return
    const suggestedStatus = getDefaultNextStatus(selectedAppeal.status)
    const defaultPreset = getDefaultReasonPreset(suggestedStatus)
    setNextStatus(suggestedStatus)
    setReasonPresetCode(defaultPreset.code)
    setReason(defaultPreset.reason)
    setNote('')
  }, [selectedAppeal])

  const onNextStatusChange = (value: AdminModerationAppealStatus) => {
    setNextStatus(value)
    const defaultPreset = getDefaultReasonPreset(value)
    setReasonPresetCode(defaultPreset.code)
    setReason(defaultPreset.reason)
  }

  const onReasonPresetChange = (value: string) => {
    setReasonPresetCode(value)
    const preset = STATUS_REASON_PRESETS[nextStatus].find((row) => row.code === value)
    if (!preset) return
    setReason(preset.reason)
  }

  const submitStatusUpdate = async () => {
    if (!selectedAppealId) {
      toast.error('Seleciona primeiro uma apelacao para atualizar.')
      return
    }
    if (!selectedAppeal) {
      toast.error('Detalhe da apelacao indisponivel. Atualiza e tenta novamente.')
      return
    }
    if (nextStatus === selectedAppeal.status) {
      toast.error('Seleciona um estado diferente do estado atual.')
      return
    }
    if (!reason.trim()) {
      toast.error('Motivo obrigatorio para atualizar estado da apelacao.')
      return
    }

    try {
      const result = await updateStatusMutation.mutateAsync({
        appealId: selectedAppealId,
        data: {
          status: nextStatus,
          reason: reason.trim(),
          note: note.trim() || undefined,
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
          <h1 className="text-2xl font-semibold tracking-tight">Apelacoes de moderacao</h1>
          <p className="text-sm text-muted-foreground">
            Inbox administrativa com SLA, prioridade e decisao auditavel por apelacao.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Apelacoes de moderacao</h2>
          <p className="text-sm text-muted-foreground">
            Inbox administrativa com SLA e decisao auditavel por apelacao.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" asChild>
          <a href="/admin/conteudo">Fila de moderacao</a>
        </Button>
        <Button type="button" size="sm" asChild>
          <a href="/admin/conteudo/apelacoes">Apelacoes</a>
        </Button>
      </div>

      {!canRead ? (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Sem permissao para leitura de apelacoes (`admin.content.read`).
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumo da inbox</CardTitle>
          <CardDescription>Distribuicao de apelacoes por estado e SLA.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
          <div className="rounded-md border border-border/70 p-3 text-sm">
            <p className="text-xs text-muted-foreground">Abertas</p>
            <p className="text-lg font-semibold">{appealsQuery.data?.summary.open ?? 0}</p>
          </div>
          <div className="rounded-md border border-border/70 p-3 text-sm">
            <p className="text-xs text-muted-foreground">Em revisao</p>
            <p className="text-lg font-semibold">{appealsQuery.data?.summary.underReview ?? 0}</p>
          </div>
          <div className="rounded-md border border-border/70 p-3 text-sm">
            <p className="text-xs text-muted-foreground">Aceites</p>
            <p className="text-lg font-semibold">{appealsQuery.data?.summary.accepted ?? 0}</p>
          </div>
          <div className="rounded-md border border-border/70 p-3 text-sm">
            <p className="text-xs text-muted-foreground">Rejeitadas</p>
            <p className="text-lg font-semibold">{appealsQuery.data?.summary.rejected ?? 0}</p>
          </div>
          <div className="rounded-md border border-border/70 p-3 text-sm">
            <p className="text-xs text-muted-foreground">Fechadas</p>
            <p className="text-lg font-semibold">{appealsQuery.data?.summary.closed ?? 0}</p>
          </div>
          <div className="rounded-md border border-border/70 p-3 text-sm">
            <p className="text-xs text-muted-foreground">SLA vencido</p>
            <p className="text-lg font-semibold">{appealsQuery.data?.summary.breachedSla ?? 0}</p>
          </div>
          <div className="rounded-md border border-border/70 p-3 text-sm">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-lg font-semibold">{appealsQuery.data?.summary.total ?? 0}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base">Inbox de apelacoes</CardTitle>
              <CardDescription>
                Seleciona uma apelacao para consultar detalhe e decidir.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => appealsQuery.refetch().catch(() => undefined)}
              disabled={appealsQuery.isFetching}
            >
              <RefreshCw className={cn('h-4 w-4', appealsQuery.isFetching ? 'animate-spin' : '')} />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as StatusFilter)
                setPage('1')
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="open">Abertas</SelectItem>
                <SelectItem value="under_review">Em revisao</SelectItem>
                <SelectItem value="accepted">Aceites</SelectItem>
                <SelectItem value="rejected">Rejeitadas</SelectItem>
                <SelectItem value="closed">Fechadas</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={severityFilter}
              onValueChange={(value) => {
                setSeverityFilter(value as SeverityFilter)
                setPage('1')
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Severidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critica</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={contentTypeFilter}
              onValueChange={(value) => {
                setContentTypeFilter(value as ContentTypeFilter)
                setPage('1')
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de conteudo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="article">Artigo</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="course">Curso</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="podcast">Podcast</SelectItem>
                <SelectItem value="book">Livro</SelectItem>
                <SelectItem value="comment">Comentario</SelectItem>
                <SelectItem value="review">Review</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={breachedSlaFilter}
              onValueChange={(value) => {
                setBreachedSlaFilter(value as BreachedSlaFilter)
                setPage('1')
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="SLA" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="breached">Vencido</SelectItem>
                <SelectItem value="on_time">Dentro do prazo</SelectItem>
              </SelectContent>
            </Select>

            <Input
              value={searchFilter}
              onChange={(event) => {
                setSearchFilter(event.target.value)
                setPage('1')
              }}
              placeholder="Pesquisar utilizador..."
            />
          </div>

          {appealsQuery.isLoading ? (
            <div className="space-y-2">
              <div className="h-16 animate-pulse rounded-md bg-muted" />
              <div className="h-16 animate-pulse rounded-md bg-muted" />
            </div>
          ) : (appealsQuery.data?.items.length ?? 0) === 0 ? (
            <p className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
              Sem apelacoes para os filtros selecionados.
            </p>
          ) : (
            <div className="space-y-2">
              {appealsQuery.data?.items.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    'rounded-md border border-border/70 p-3',
                    selectedAppealId === item.id ? 'border-primary/40 bg-primary/5' : '',
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">
                        {item.appellant?.name ||
                          item.appellant?.username ||
                          item.appellant?.email ||
                          item.appellant?.id ||
                          item.id}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.contentType ? CONTENT_TYPE_LABEL[item.contentType] : 'N/A'} | target{' '}
                        {item.contentId ?? '-'}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={statusBadgeVariant(item.status)}>
                        {STATUS_LABEL[item.status]}
                      </Badge>
                      <Badge variant={severityBadgeVariant(item.severity)}>
                        {SEVERITY_LABEL[item.severity]}
                      </Badge>
                      {item.sla.isBreached ? (
                        <Badge variant="destructive">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          SLA vencido
                        </Badge>
                      ) : (
                        <Badge variant="outline">SLA {formatSla(item.sla.remainingMinutes)}</Badge>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        variant={selectedAppealId === item.id ? 'default' : 'outline'}
                        onClick={() => setSelectedAppealId(item.id)}
                      >
                        Gerir
                      </Button>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Aberta em {formatDateTime(item.openedAt)} | Due {formatDateTime(item.dueAt)}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              Pagina {appealsQuery.data?.pagination.page ?? 1} de{' '}
              {appealsQuery.data?.pagination.pages ?? 1}
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  const current = toPositiveIntegerOrUndefined(page) ?? 1
                  setPage(String(Math.max(1, current - 1)))
                }}
                disabled={(toPositiveIntegerOrUndefined(page) ?? 1) <= 1}
              >
                Anterior
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  const current = toPositiveIntegerOrUndefined(page) ?? 1
                  setPage(String(current + 1))
                }}
                disabled={
                  (toPositiveIntegerOrUndefined(page) ?? 1) >=
                  (appealsQuery.data?.pagination.pages ?? 1)
                }
              >
                Seguinte
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Decisao da apelacao selecionada</CardTitle>
          <CardDescription>
            Atualiza o estado com motivo padronizado e nota interna opcional.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedAppeal ? (
            <div className="rounded-md border border-border/70 p-3 text-sm">
              <p className="font-semibold">
                {selectedAppeal.appellant?.name ||
                  selectedAppeal.appellant?.username ||
                  selectedAppeal.appellant?.email ||
                  selectedAppeal.appellant?.id ||
                  selectedAppeal.id}
              </p>
              <p className="text-xs text-muted-foreground">
                Estado atual: {STATUS_LABEL[selectedAppeal.status]} | severidade:{' '}
                {SEVERITY_LABEL[selectedAppeal.severity]} | SLA{' '}
                {selectedAppeal.sla.isBreached
                  ? 'vencido'
                  : formatSla(selectedAppeal.sla.remainingMinutes)}
              </p>
            </div>
          ) : (
            <p className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
              Seleciona uma apelacao na lista para gerir decisao e historico.
            </p>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Proximo estado</Label>
              <Select
                value={nextStatus}
                onValueChange={(value) => onNextStatusChange(value as AdminModerationAppealStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleciona estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under_review">Em revisao</SelectItem>
                  <SelectItem value="accepted">Aceite</SelectItem>
                  <SelectItem value="rejected">Rejeitada</SelectItem>
                  <SelectItem value="closed">Fechada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Motivo padronizado</Label>
              <Select value={reasonPresetCode} onValueChange={onReasonPresetChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleciona motivo" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_REASON_PRESETS[nextStatus].map((preset) => (
                    <SelectItem key={preset.code} value={preset.code}>
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="appeal-decision-reason">Motivo final</Label>
            <Input
              id="appeal-decision-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Motivo obrigatorio para transicao de estado"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="appeal-decision-note">Nota interna (opcional)</Label>
            <Textarea
              id="appeal-decision-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              placeholder="Contexto operacional e evidencias da decisao."
            />
          </div>

          <Button
            type="button"
            onClick={submitStatusUpdate}
            disabled={
              !canWrite || !selectedAppeal || updateStatusMutation.isPending || !reason.trim()
            }
          >
            {updateStatusMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
            Atualizar estado
          </Button>

          {!canWrite ? (
            <p className="text-xs text-muted-foreground">
              Sem permissao de escrita (`admin.content.moderate`) para decidir apelacoes.
            </p>
          ) : null}

          <div className="space-y-2 rounded-md border border-border/70 p-3">
            <p className="text-sm font-semibold">Timeline da apelacao</p>
            {selectedAppealQuery.isFetching ? (
              <div className="space-y-2">
                <div className="h-16 animate-pulse rounded-md bg-muted" />
                <div className="h-16 animate-pulse rounded-md bg-muted" />
              </div>
            ) : selectedHistory.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Sem historico detalhado para esta apelacao.
              </p>
            ) : (
              <div className="space-y-2">
                {selectedHistory.map((entry, index) => (
                  <div
                    key={`${entry.changedAt ?? 'sem-data'}-${entry.fromStatus}-${entry.toStatus}-${index}`}
                    className="rounded-md border border-border/60 p-2 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">
                          {`${STATUS_LABEL[entry.fromStatus]} -> ${STATUS_LABEL[entry.toStatus]}`}
                        </Badge>
                      </div>
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
                      <span className="text-muted-foreground">Ator:</span> {historyActor(entry)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
