import { useMemo, useState } from 'react'
import { EyeOff, Loader2, RefreshCcw, Search, ShieldAlert, ShieldCheck, Undo2 } from 'lucide-react'
import { toast } from 'react-toastify'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { getErrorMessage } from '@/lib/api/client'
import {
  ReportPriorityBadge,
  RiskLevelBadge,
  TrustRecommendationBadge,
  TrustScoreBar,
} from '../components/RiskSignals'
import {
  useAdminContentHistory,
  useAdminContentQueue,
  useHideAdminContent,
  useRestrictAdminContent,
  useUnhideAdminContent,
} from '../hooks/useAdminContent'
import type {
  AdminContentModerationStatus,
  AdminContentReportPriority,
  AdminContentQueueItem,
  AdminContentQueueQuery,
  AdminContentType,
} from '../types/adminContent'

type ContentTypeFilter = AdminContentType | 'all'
type ModerationFilter = AdminContentModerationStatus | 'all'
type PublishStatusFilter = 'draft' | 'published' | 'archived' | 'all'
type ReportPriorityFilter = Exclude<AdminContentReportPriority, 'none'> | 'all'
type ContentActionKind = 'hide' | 'unhide' | 'restrict'

interface FilterState {
  search: string
  contentType: ContentTypeFilter
  moderationStatus: ModerationFilter
  publishStatus: PublishStatusFilter
  flaggedOnly: 'all' | 'flagged'
  minReportPriority: ReportPriorityFilter
}

interface ContentActionDialogState {
  kind: ContentActionKind
  content: AdminContentQueueItem
}

interface CurrentAdminMeta {
  adminReadOnly?: boolean
  adminScopes?: string[]
}

interface ContentModerationPageProps {
  embedded?: boolean
}

const PAGE_SIZE = 20

const INITIAL_FILTERS: FilterState = {
  search: '',
  contentType: 'all',
  moderationStatus: 'all',
  publishStatus: 'all',
  flaggedOnly: 'all',
  minReportPriority: 'all',
}

const CONTENT_TYPE_LABEL: Record<AdminContentType, string> = {
  article: 'Artigo',
  video: 'Video',
  course: 'Curso',
  live: 'Live',
  podcast: 'Podcast',
  book: 'Livro',
  comment: 'Comentario',
  review: 'Review',
}

const MODERATION_STATUS_LABEL: Record<AdminContentModerationStatus, string> = {
  visible: 'Visivel',
  hidden: 'Oculto',
  restricted: 'Restrito',
}

const MODERATION_ACTION_LABEL: Record<'hide' | 'unhide' | 'restrict', string> = {
  hide: 'Ocultar',
  unhide: 'Reativar',
  restrict: 'Restringir',
}

const MODERATION_STATUS_BADGE = (
  status: AdminContentModerationStatus,
): 'secondary' | 'outline' | 'destructive' => {
  if (status === 'visible') return 'secondary'
  if (status === 'restricted') return 'outline'
  return 'destructive'
}

const ACTION_COPY: Record<
  ContentActionKind,
  {
    title: string
    description: string
    confirmLabel: string
    reasonPlaceholder: string
  }
> = {
  hide: {
    title: 'Ocultar conteudo',
    description: 'O item deixa de aparecer nas listagens publicas e no acesso por slug.',
    confirmLabel: 'Confirmar ocultacao',
    reasonPlaceholder: 'Ex: violacao de politica de conteudo',
  },
  unhide: {
    title: 'Reativar conteudo',
    description: 'O item volta a ficar visivel para a audiencia conforme estado de publicacao.',
    confirmLabel: 'Confirmar reativacao',
    reasonPlaceholder: 'Ex: revisao concluida sem bloqueio',
  },
  restrict: {
    title: 'Restringir conteudo',
    description: 'O item fica marcado como restrito e sai da superficie publica.',
    confirmLabel: 'Confirmar restricao',
    reasonPlaceholder: 'Ex: conteudo sensivel em revisao',
  },
}

const DEFAULT_ACTION_REASON: Record<ContentActionKind, string> = {
  hide: 'Ocultacao administrativa',
  unhide: 'Reativacao administrativa',
  restrict: 'Restricao administrativa',
}

const DOUBLE_CONFIRM_TOKEN = 'CONFIRMAR'
const DESTRUCTIVE_CONTENT_ACTIONS: ContentActionKind[] = ['hide', 'restrict']

const toQueueQuery = (filters: FilterState, page: number): AdminContentQueueQuery => {
  const query: AdminContentQueueQuery = {
    page,
    limit: PAGE_SIZE,
  }

  if (filters.search.trim().length > 0) query.search = filters.search.trim()
  if (filters.contentType !== 'all') query.contentType = filters.contentType
  if (filters.moderationStatus !== 'all') query.moderationStatus = filters.moderationStatus
  if (filters.publishStatus !== 'all') query.publishStatus = filters.publishStatus
  if (filters.flaggedOnly === 'flagged') query.flaggedOnly = true
  if (filters.minReportPriority !== 'all') query.minReportPriority = filters.minReportPriority

  return query
}

const isDestructiveAction = (kind: ContentActionKind): boolean =>
  DESTRUCTIVE_CONTENT_ACTIONS.includes(kind)

const getImpactSummary = (kind: ContentActionKind, content: AdminContentQueueItem): string[] => {
  const target = `${CONTENT_TYPE_LABEL[content.contentType]} /${content.slug}`

  if (kind === 'hide') {
    return [
      `${target} deixa de aparecer nas superficies publicas.`,
      'Acesso por slug/listagens publicas fica indisponivel para utilizadores.',
      'Acao de risco moderado com rasto de auditoria e evento de moderacao.',
    ]
  }

  if (kind === 'restrict') {
    return [
      `${target} fica marcado como "restricted".`,
      'Conteudo e removido da visibilidade publica ate nova decisao.',
      'Acao critica com impacto imediato e rastreabilidade completa.',
    ]
  }

  return [
    `${target} volta ao estado visivel.`,
    'Item regressa a listagens/publicacao conforme estado editorial.',
    'Reversao fica registada no historico para compliance.',
  ]
}

const formatDateTime = (value: string | null): string => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat('pt-PT', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}

const formatActor = (actor: AdminContentQueueItem['creator']): string => {
  if (!actor) return 'N/A'
  return actor.name || actor.username || actor.email || actor.id
}

export default function ContentModerationPage({ embedded = false }: ContentModerationPageProps) {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS)
  const [queryFilters, setQueryFilters] = useState<FilterState>(INITIAL_FILTERS)
  const [page, setPage] = useState(1)

  const [actionDialog, setActionDialog] = useState<ContentActionDialogState | null>(null)
  const [actionReason, setActionReason] = useState('')
  const [actionNote, setActionNote] = useState('')
  const [actionConfirmText, setActionConfirmText] = useState('')

  const [historyTarget, setHistoryTarget] = useState<AdminContentQueueItem | null>(null)
  const [historyPage, setHistoryPage] = useState(1)

  const rawAuthUser = useAuthStore((state) => state.user)
  const authUser = (rawAuthUser as unknown as CurrentAdminMeta | null) ?? null

  const canReadContent = useMemo(() => {
    if (!authUser) return false
    if (!Array.isArray(authUser.adminScopes) || authUser.adminScopes.length === 0) return true
    return authUser.adminScopes.includes('admin.content.read')
  }, [authUser])

  const canModerateContent = useMemo(() => {
    if (!authUser) return false
    if (authUser.adminReadOnly) return false
    if (!Array.isArray(authUser.adminScopes) || authUser.adminScopes.length === 0) return true
    return authUser.adminScopes.includes('admin.content.moderate')
  }, [authUser])

  const queueQuery = useMemo(() => toQueueQuery(queryFilters, page), [queryFilters, page])
  const moderationQueue = useAdminContentQueue(queueQuery)
  const historyQuery = useAdminContentHistory(
    historyTarget?.contentType ?? null,
    historyTarget?.id ?? null,
    historyPage,
    10,
  )

  const hideMutation = useHideAdminContent()
  const unhideMutation = useUnhideAdminContent()
  const restrictMutation = useRestrictAdminContent()

  const isActionPending =
    hideMutation.isPending || unhideMutation.isPending || restrictMutation.isPending
  const requiresDoubleConfirm = actionDialog ? isDestructiveAction(actionDialog.kind) : false
  const isDoubleConfirmValid =
    !requiresDoubleConfirm || actionConfirmText.trim().toUpperCase() === DOUBLE_CONFIRM_TOKEN

  const pagination = moderationQueue.data?.pagination
  const items = moderationQueue.data?.items ?? []

  const hiddenCountInPage = items.filter((item) => item.moderationStatus === 'hidden').length
  const restrictedCountInPage = items.filter(
    (item) => item.moderationStatus === 'restricted',
  ).length
  const flaggedCountInPage = items.filter((item) => item.reportSignals.openReports > 0).length
  const highPriorityFlagsInPage = items.filter(
    (item) => item.reportSignals.priority === 'high' || item.reportSignals.priority === 'critical',
  ).length
  const criticalCreatorRiskInPage = items.filter(
    (item) => item.creatorTrustSignals?.riskLevel === 'critical',
  ).length

  const applyFilters = () => {
    setQueryFilters(filters)
    setPage(1)
  }

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS)
    setQueryFilters(INITIAL_FILTERS)
    setPage(1)
  }

  const openActionDialog = (kind: ContentActionKind, content: AdminContentQueueItem) => {
    setActionDialog({ kind, content })
    setActionReason(DEFAULT_ACTION_REASON[kind])
    setActionNote('')
    setActionConfirmText('')
  }

  const closeActionDialog = (force = false) => {
    if (!force && isActionPending) return
    setActionDialog(null)
    setActionReason('')
    setActionNote('')
    setActionConfirmText('')
  }

  const closeHistoryDialog = () => {
    setHistoryTarget(null)
    setHistoryPage(1)
  }

  const submitAction = async () => {
    if (!actionDialog) return

    const reason = actionReason.trim()
    if (!reason) {
      toast.error('Motivo obrigatorio para executar a acao.')
      return
    }
    if (!isDoubleConfirmValid) {
      toast.error(`Escreve "${DOUBLE_CONFIRM_TOKEN}" para confirmar esta acao critica.`)
      return
    }

    try {
      const payload = {
        reason,
        note: actionNote.trim() || undefined,
      }

      if (actionDialog.kind === 'hide') {
        const result = await hideMutation.mutateAsync({
          contentType: actionDialog.content.contentType,
          contentId: actionDialog.content.id,
          payload,
        })
        toast.success(result.message)
      } else if (actionDialog.kind === 'unhide') {
        const result = await unhideMutation.mutateAsync({
          contentType: actionDialog.content.contentType,
          contentId: actionDialog.content.id,
          payload,
        })
        toast.success(result.message)
      } else {
        const result = await restrictMutation.mutateAsync({
          contentType: actionDialog.content.contentType,
          contentId: actionDialog.content.id,
          payload,
        })
        toast.success(result.message)
      }

      closeActionDialog(true)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <div className="space-y-6">
      {embedded ? (
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Moderacao de conteudo</h2>
          <p className="text-sm text-muted-foreground">
            Fila unificada para conteudos, comentarios e reviews com trilha auditavel.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Moderacao de conteudo</h1>
          <p className="text-sm text-muted-foreground">
            Fila unificada para conteudos, comentarios e reviews com trilha auditavel de
            hide/unhide/restrict.
          </p>
        </div>
      )}

      {!canReadContent && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <ShieldAlert className="mt-0.5 h-4 w-4 text-destructive" />
            <p className="text-sm text-destructive">
              Perfil atual sem escopo `admin.content.read`. Nao e possivel consultar a fila.
            </p>
          </CardContent>
        </Card>
      )}

      {canReadContent && !canModerateContent && (
        <Card className="border-yellow-500/40 bg-yellow-500/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <ShieldAlert className="mt-0.5 h-4 w-4 text-yellow-600" />
            <p className="text-sm text-muted-foreground">
              Perfil atual sem escrita em conteudo. Podes consultar fila e historico, mas sem
              executar acoes de moderacao.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total da fila</CardDescription>
            <CardTitle className="text-2xl">{pagination?.total ?? 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Resultado global dos filtros aplicados.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Ocultos na pagina</CardDescription>
            <CardTitle className="text-2xl">{hiddenCountInPage}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Itens com estado `hidden` no lote atual.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Restritos na pagina</CardDescription>
            <CardTitle className="text-2xl">{restrictedCountInPage}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Itens com estado `restricted` no lote atual.
            </p>
          </CardContent>
        </Card>
        <Card className="border-sky-500/20 bg-sky-500/5">
          <CardHeader className="pb-2">
            <CardDescription>Itens com reports</CardDescription>
            <CardTitle className="text-2xl">{flaggedCountInPage}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Targets nesta pagina com pressao de reports ativa.
            </p>
          </CardContent>
        </Card>
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardHeader className="pb-2">
            <CardDescription>Flags high/critical</CardDescription>
            <CardTitle className="text-2xl">{highPriorityFlagsInPage}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Targets que exigem triagem mais rapida.</p>
          </CardContent>
        </Card>
        <Card className="border-red-500/20 bg-red-500/5">
          <CardHeader className="pb-2">
            <CardDescription>Creators criticos</CardDescription>
            <CardTitle className="text-2xl">{criticalCreatorRiskInPage}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Conteudos cujo autor ja esta em risco critico.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pesquisa e filtros</CardTitle>
          <CardDescription>
            Refina por tipo, estado, pressao de reports e prioridade para uma triagem mais rapida.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-7">
          <div className="xl:col-span-2">
            <Label htmlFor="admin-content-search">Pesquisa</Label>
            <div className="mt-1 flex items-center gap-2">
              <Input
                id="admin-content-search"
                placeholder="Titulo, descricao ou slug"
                value={filters.search}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, search: event.target.value }))
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    applyFilters()
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={applyFilters}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label>Tipo</Label>
            <Select
              value={filters.contentType}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, contentType: value as ContentTypeFilter }))
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="article">Artigos</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="course">Cursos</SelectItem>
                <SelectItem value="live">Lives</SelectItem>
                <SelectItem value="podcast">Podcasts</SelectItem>
                <SelectItem value="book">Livros</SelectItem>
                <SelectItem value="comment">Comentarios</SelectItem>
                <SelectItem value="review">Reviews</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Moderacao</Label>
            <Select
              value={filters.moderationStatus}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  moderationStatus: value as ModerationFilter,
                }))
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="visible">Visivel</SelectItem>
                <SelectItem value="hidden">Oculto</SelectItem>
                <SelectItem value="restricted">Restrito</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Publicacao</Label>
            <Select
              value={filters.publishStatus}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  publishStatus: value as PublishStatusFilter,
                }))
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Reports</Label>
            <Select
              value={filters.flaggedOnly}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  flaggedOnly: value as FilterState['flaggedOnly'],
                }))
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="flagged">Apenas com flags</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Prioridade report</Label>
            <Select
              value={filters.minReportPriority}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  minReportPriority: value as ReportPriorityFilter,
                }))
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="low">Low+</SelectItem>
                <SelectItem value="medium">Medium+</SelectItem>
                <SelectItem value="high">High+</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2 xl:col-span-7 flex flex-wrap gap-2">
            <Button type="button" onClick={applyFilters}>
              Aplicar filtros
            </Button>
            <Button type="button" variant="outline" onClick={clearFilters}>
              Limpar
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => moderationQueue.refetch()}
              disabled={moderationQueue.isFetching}
            >
              {moderationQueue.isFetching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fila operacional</CardTitle>
          <CardDescription>
            Sequencia recomendada: validar contexto, aplicar acao com motivo, verificar historico.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {moderationQueue.isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />A carregar fila de moderacao...
            </div>
          ) : moderationQueue.isError ? (
            <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4">
              <p className="text-sm text-destructive">{getErrorMessage(moderationQueue.error)}</p>
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-md border border-dashed border-border p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Sem conteudos para os filtros selecionados.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Conteudo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Criador</TableHead>
                  <TableHead>Ultima moderacao</TableHead>
                  <TableHead>Risco e sinais</TableHead>
                  <TableHead className="w-[360px]">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => {
                  const canAct = canModerateContent
                  return (
                    <TableRow key={`${item.contentType}-${item.id}`}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">/{item.slug}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.description || 'Sem descricao resumida.'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{CONTENT_TYPE_LABEL[item.contentType]}</Badge>
                          <Badge variant="outline">{item.status}</Badge>
                          <Badge variant={MODERATION_STATUS_BADGE(item.moderationStatus)}>
                            {MODERATION_STATUS_LABEL[item.moderationStatus]}
                          </Badge>
                          <ReportPriorityBadge
                            priority={item.reportSignals.priority}
                            openReports={item.reportSignals.openReports}
                          />
                        </div>
                        {item.moderationReason && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {item.moderationReason}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2 text-xs">
                          <p>{formatActor(item.creator)}</p>
                          {item.creatorTrustSignals ? (
                            <>
                              <RiskLevelBadge
                                riskLevel={item.creatorTrustSignals.riskLevel}
                                score={item.creatorTrustSignals.trustScore}
                              />
                              <TrustScoreBar value={item.creatorTrustSignals.trustScore} compact />
                            </>
                          ) : null}
                          <p className="text-muted-foreground">
                            Atualizado: {formatDateTime(item.updatedAt)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <p>Data: {formatDateTime(item.moderatedAt)}</p>
                          <p>Autor: {formatActor(item.moderatedBy)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1.5">
                            <TrustRecommendationBadge
                              action={
                                item.creatorTrustSignals?.recommendedAction ??
                                (item.policySignals.recommendedAction === 'review'
                                  ? 'review'
                                  : item.policySignals.recommendedAction === 'hide'
                                    ? 'block_publishing'
                                    : item.policySignals.recommendedAction === 'restrict'
                                      ? 'set_cooldown'
                                      : 'none')
                              }
                            />
                            {item.policySignals.recommendedAction !== 'none' ? (
                              <Badge variant="outline" className="border-sky-500/40 text-sky-700">
                                Policy: {item.policySignals.recommendedAction}
                              </Badge>
                            ) : null}
                          </div>
                          {item.creatorTrustSignals?.summary.activeControlFlags.length ? (
                            <div className="flex flex-wrap gap-1.5">
                              {item.creatorTrustSignals.summary.activeControlFlags.map((flag) => (
                                <Badge key={flag} variant="outline">
                                  {flag}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              Sem barreiras ativas.
                            </span>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {item.reportSignals.topReasons[0]
                              ? `Top reason: ${item.reportSignals.topReasons[0].reason}`
                              : 'Sem motivo dominante.'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {item.moderationStatus === 'visible' ? (
                            <>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                disabled={!canAct}
                                onClick={() => openActionDialog('hide', item)}
                              >
                                <EyeOff className="h-4 w-4" />
                                Ocultar
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                disabled={!canAct}
                                onClick={() => openActionDialog('restrict', item)}
                              >
                                <ShieldAlert className="h-4 w-4" />
                                Restringir
                              </Button>
                            </>
                          ) : (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              disabled={!canAct}
                              onClick={() => openActionDialog('unhide', item)}
                            >
                              <Undo2 className="h-4 w-4" />
                              Reativar
                            </Button>
                          )}

                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setHistoryTarget(item)
                              setHistoryPage(1)
                            }}
                          >
                            Historico
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between border-t border-border pt-4">
              <p className="text-sm text-muted-foreground">
                Pagina {pagination.page} de {pagination.pages}
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                  Anterior
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => setPage((prev) => Math.min(prev + 1, pagination.pages))}
                >
                  Seguinte
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(actionDialog)}
        onOpenChange={(open) => (!open ? closeActionDialog() : null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog ? ACTION_COPY[actionDialog.kind].title : 'Acao admin'}
            </DialogTitle>
            <DialogDescription>
              {actionDialog ? ACTION_COPY[actionDialog.kind].description : ''}
            </DialogDescription>
          </DialogHeader>

          {actionDialog && (
            <div className="space-y-4">
              <div className="rounded-md border border-border/70 bg-muted/20 p-3 text-sm">
                <p className="font-medium">{actionDialog.content.title}</p>
                <p className="text-xs text-muted-foreground">
                  {CONTENT_TYPE_LABEL[actionDialog.content.contentType]} - /
                  {actionDialog.content.slug}
                </p>
              </div>

              <div className="rounded-md border border-border/70 bg-muted/20 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Resumo de impacto
                </p>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  {getImpactSummary(actionDialog.kind, actionDialog.content).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-content-action-reason">Motivo</Label>
                <Input
                  id="admin-content-action-reason"
                  value={actionReason}
                  onChange={(event) => setActionReason(event.target.value)}
                  placeholder={ACTION_COPY[actionDialog.kind].reasonPlaceholder}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-content-action-note">Nota adicional (opcional)</Label>
                <Textarea
                  id="admin-content-action-note"
                  value={actionNote}
                  onChange={(event) => setActionNote(event.target.value)}
                  rows={4}
                  placeholder="Detalhes operacionais para auditoria interna."
                />
              </div>

              {requiresDoubleConfirm ? (
                <div className="space-y-2">
                  <Label htmlFor="admin-content-action-confirm">
                    Confirmacao dupla (escreve {DOUBLE_CONFIRM_TOKEN})
                  </Label>
                  <Input
                    id="admin-content-action-confirm"
                    value={actionConfirmText}
                    onChange={(event) => setActionConfirmText(event.target.value)}
                    placeholder={DOUBLE_CONFIRM_TOKEN}
                  />
                </div>
              ) : null}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeActionDialog}
              disabled={isActionPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={submitAction}
              disabled={isActionPending || !actionDialog || !isDoubleConfirmValid}
            >
              {isActionPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {actionDialog ? ACTION_COPY[actionDialog.kind].confirmLabel : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(historyTarget)}
        onOpenChange={(open) => (!open ? closeHistoryDialog() : null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Historico de moderacao
              {historyTarget ? ` - ${historyTarget.title}` : ''}
            </DialogTitle>
            <DialogDescription>Eventos auditados para este conteudo.</DialogDescription>
          </DialogHeader>

          {historyQuery.isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />A carregar historico...
            </div>
          ) : historyQuery.isError ? (
            <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
              {getErrorMessage(historyQuery.error)}
            </div>
          ) : (historyQuery.data?.items.length ?? 0) === 0 ? (
            <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Sem eventos de moderacao registados.
            </div>
          ) : (
            <div className="space-y-3">
              {historyQuery.data?.items.map((event) => (
                <div key={event.id} className="rounded-md border border-border/70 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="outline">{MODERATION_ACTION_LABEL[event.action]}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(event.createdAt)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm">{event.reason}</p>
                  {event.note && (
                    <p className="mt-1 text-xs text-muted-foreground">Nota: {event.note}</p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    Estado: {MODERATION_STATUS_LABEL[event.fromStatus]} {' -> '}
                    {MODERATION_STATUS_LABEL[event.toStatus]}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Autor:{' '}
                    {event.actor?.name || event.actor?.username || event.actor?.email || 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          )}

          {historyQuery.data?.pagination && historyQuery.data.pagination.pages > 1 && (
            <div className="flex items-center justify-between border-t border-border pt-3">
              <p className="text-xs text-muted-foreground">
                Pagina {historyQuery.data.pagination.page} de {historyQuery.data.pagination.pages}
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={historyQuery.data.pagination.page <= 1}
                  onClick={() => setHistoryPage((prev) => Math.max(prev - 1, 1))}
                >
                  Anterior
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={historyQuery.data.pagination.page >= historyQuery.data.pagination.pages}
                  onClick={() =>
                    setHistoryPage((prev) =>
                      Math.min(prev + 1, historyQuery.data!.pagination.pages),
                    )
                  }
                >
                  Seguinte
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Card className="border-border/60 bg-muted/10">
        <CardContent className="flex items-start gap-3 pt-6 text-sm text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-4 w-4" />
          <p>
            Cada acao de moderacao exige motivo e gera dois rastos: log administrativo global e
            evento de historico no proprio conteudo.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
