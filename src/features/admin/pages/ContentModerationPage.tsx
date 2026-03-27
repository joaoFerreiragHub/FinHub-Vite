import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  ArrowUpRight,
  Clock3,
  EyeOff,
  Loader2,
  RefreshCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Undo2,
} from 'lucide-react'
import { Link, useInRouterContext } from '@/lib/reactRouterDomCompat'
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
import type { User } from '@/features/auth/types'
import { trackFeature } from '@/lib/analytics'
import { getErrorMessage } from '@/lib/api/client'
import { cn } from '@/lib/utils'
import {
  AutomatedDetectionBadge,
  AUTOMATED_RULE_LABEL,
  FALSE_POSITIVE_CATEGORY_LABEL,
  ReportPriorityBadge,
  RiskLevelBadge,
  TrustRecommendationBadge,
  TrustScoreBar,
} from '../components/RiskSignals'
import {
  useApproveBulkRollbackJob,
  useAdminContentHistory,
  useAdminContentJobs,
  useAdminContentRollbackReview,
  useAdminContentWorkerStatus,
  useAdminContentQueue,
  useCreateBulkModerationJob,
  useHideAdminContent,
  useRequestBulkRollbackJobReview,
  useRollbackAdminContent,
  useScheduleAdminContentUnhide,
  useRestrictAdminContent,
  useUnhideAdminContent,
} from '../hooks/useAdminContent'
import { useAdminModerationTemplates } from '../hooks/useAdminModerationTemplates'
import {
  buildAdminCreatorRiskHref,
  DEFAULT_ADMIN_CONTENT_DEEP_LINK_FILTERS,
  readAdminContentDeepLinkState,
  type AdminContentDeepLinkFilters,
  type AdminContentDeepLinkPanel,
} from '../lib/moderationControlPlaneLinks'
import { hasAdminScope } from '../lib/access'
import {
  EFFECTIVE_VISIBILITY_LABEL,
  resolveEffectivePublicVisibility,
} from '../lib/contentVisibility'
import { getRequiredFieldError, isDoubleConfirmTokenValid } from '../lib/formValidation'
import type {
  AdminContentJob,
  AdminContentModerationEvent,
  AdminContentModerationStatus,
  AdminContentReportPriority,
  AdminContentQueueItem,
  AdminContentQueueQuery,
  AdminContentType,
} from '../types/adminContent'
import type { AdminModerationTemplateItem } from '../types/adminModerationTemplates'

type ContentTypeFilter = AdminContentType | 'all'
type ModerationFilter = AdminContentModerationStatus | 'all'
type PublishStatusFilter = 'draft' | 'published' | 'archived' | 'all'
type ReportPriorityFilter = Exclude<AdminContentReportPriority, 'none'> | 'all'
type ContentActionKind = 'hide' | 'unhide' | 'restrict'

type FilterState = AdminContentDeepLinkFilters & {
  contentType: ContentTypeFilter
  moderationStatus: ModerationFilter
  publishStatus: PublishStatusFilter
  minReportPriority: ReportPriorityFilter
}

interface ContentActionDialogState {
  kind: ContentActionKind
  content: AdminContentQueueItem
}

interface ContentRollbackDialogState {
  content: AdminContentQueueItem
  eventId: string
}

interface BulkModerationDialogState {
  items: AdminContentQueueItem[]
}

interface RollbackJobReviewDialogState {
  job: AdminContentJob
}

interface RollbackJobApprovalDialogState {
  job: AdminContentJob
}

interface CurrentAdminMeta {
  role?: string
  adminReadOnly?: boolean
  adminScopes?: string[]
}

interface ContentModerationPageProps {
  embedded?: boolean
}

interface OptionalRouterLinkProps {
  to: string
  className?: string
  inRouterContext: boolean
  children: ReactNode
}

const PAGE_SIZE = 20
const EMPTY_MODERATION_TEMPLATES: AdminModerationTemplateItem[] = []

const INITIAL_FILTERS: FilterState = { ...DEFAULT_ADMIN_CONTENT_DEEP_LINK_FILTERS }

const readCurrentDeepLinkState = () => {
  if (typeof window === 'undefined') {
    return {
      filters: INITIAL_FILTERS,
      page: 1,
      panel: 'queue' as AdminContentDeepLinkPanel,
      jobId: null,
    }
  }

  return readAdminContentDeepLinkState(window.location.search)
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

const DEFAULT_ROLLBACK_REASON = 'Rollback assistido apos revisao administrativa'
const DOUBLE_CONFIRM_TOKEN = 'CONFIRMAR'
const DESTRUCTIVE_CONTENT_ACTIONS: ContentActionKind[] = ['hide', 'restrict']
const TEMPLATE_NONE_VALUE = '__manual__'
const ACTION_TEMPLATE_TAG_HINTS: Record<ContentActionKind, string[]> = {
  hide: ['hide', 'hidden', 'ocultar', 'ocultacao'],
  unhide: ['unhide', 'visible', 'reativar', 'reativacao'],
  restrict: ['restrict', 'restricted', 'restringir', 'restricao'],
}

const OptionalRouterLink = ({
  to,
  className,
  inRouterContext,
  children,
}: OptionalRouterLinkProps) =>
  inRouterContext ? (
    <Link to={to} className={className}>
      {children}
    </Link>
  ) : (
    <a href={to} className={className}>
      {children}
    </a>
  )

const toQueueQuery = (
  filters: FilterState,
  page: number,
  cursor?: string,
): AdminContentQueueQuery => {
  const query: AdminContentQueueQuery = {
    page,
    limit: PAGE_SIZE,
  }

  if (filters.search.trim().length > 0) query.search = filters.search.trim()
  if (filters.creatorId.trim().length > 0) query.creatorId = filters.creatorId.trim()
  if (filters.contentType !== 'all') query.contentType = filters.contentType
  if (filters.moderationStatus !== 'all') query.moderationStatus = filters.moderationStatus
  if (filters.publishStatus !== 'all') query.publishStatus = filters.publishStatus
  if (filters.flaggedOnly === 'flagged') query.flaggedOnly = true
  if (filters.minReportPriority !== 'all') query.minReportPriority = filters.minReportPriority
  if (cursor && cursor.trim().length > 0) query.cursor = cursor

  return query
}

const isDestructiveAction = (kind: ContentActionKind): boolean =>
  DESTRUCTIVE_CONTENT_ACTIONS.includes(kind)

const normalizeTemplateTag = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')

const matchesTemplateAction = (
  template: AdminModerationTemplateItem,
  action: ContentActionKind,
): boolean => {
  const tags = template.tags.map(normalizeTemplateTag)
  if (tags.length === 0) return false
  return ACTION_TEMPLATE_TAG_HINTS[action].some((hint) => tags.includes(hint))
}

const sortTemplatesForAction = (
  templates: AdminModerationTemplateItem[],
  action: ContentActionKind,
): AdminModerationTemplateItem[] =>
  [...templates].sort((left, right) => {
    const leftMatched = matchesTemplateAction(left, action)
    const rightMatched = matchesTemplateAction(right, action)
    if (leftMatched !== rightMatched) return leftMatched ? -1 : 1
    return left.label.localeCompare(right.label, 'pt-PT')
  })

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

  const visibilityAfterUnhide = resolveEffectivePublicVisibility({
    moderationStatus: 'visible',
    publishStatus: content.status,
  })

  return [
    `${target} volta ao estado visivel na moderacao.`,
    visibilityAfterUnhide === 'visible'
      ? 'Como o estado editorial esta "published", o item volta ao publico.'
      : `Moderacao fica "visible", mas o estado editorial "${content.status}" ainda bloqueia o publico.`,
    'Precedencia aplicada: moderationStatus bloqueia sempre antes do estado editorial.',
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

const toDateTimeLocalInputValue = (date: Date): string => {
  const pad = (value: number) => String(value).padStart(2, '0')

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`
}

const getDefaultScheduleInputValue = (): string =>
  toDateTimeLocalInputValue(new Date(Date.now() + 60 * 60 * 1000))

const parseFutureDateInputToIso = (value: string): { valid: boolean; iso?: string } => {
  const trimmed = value.trim()
  if (!trimmed) return { valid: false }
  const parsed = new Date(trimmed)
  if (Number.isNaN(parsed.getTime())) return { valid: false }
  if (parsed.getTime() <= Date.now()) return { valid: false }
  return { valid: true, iso: parsed.toISOString() }
}

const formatActor = (actor: AdminContentQueueItem['creator']): string => {
  if (!actor) return 'N/A'
  return actor.name || actor.username || actor.email || actor.id
}

const hasBooleanMetadataFlag = (
  event: AdminContentModerationEvent,
  key: 'fastTrack' | 'bulkModeration' | 'rollback' | 'automatedDetection' | 'falsePositiveMarked',
): boolean => event.metadata?.[key] === true

const contentSelectionKey = (item: AdminContentQueueItem): string =>
  `${item.contentType}:${item.id}`

const jobApprovalSampleKey = (
  item: NonNullable<AdminContentJob['approval']>['sampleItems'][number],
): string => `${item.contentType}:${item.contentId}:${item.eventId}`

const JOB_STATUS_LABEL: Record<AdminContentJob['status'], string> = {
  queued: 'Na fila',
  running: 'A correr',
  completed: 'Concluido',
  completed_with_errors: 'Concluido com falhas',
  failed: 'Falhou',
}

const JOB_APPROVAL_LABEL: Record<NonNullable<AdminContentJob['approval']>['reviewStatus'], string> =
  {
    draft: 'Draft',
    review: 'Em revisao',
    approved: 'Aprovado',
  }

const JOB_APPROVAL_BADGE = (
  status: NonNullable<AdminContentJob['approval']>['reviewStatus'],
): 'secondary' | 'outline' | 'destructive' => {
  if (status === 'approved') return 'secondary'
  if (status === 'review') return 'outline'
  return 'destructive'
}

const WORKER_STATUS_LABEL: Record<
  'offline' | 'starting' | 'idle' | 'processing' | 'stopping' | 'stale',
  string
> = {
  offline: 'Offline',
  starting: 'A iniciar',
  idle: 'Idle',
  processing: 'A processar',
  stopping: 'A parar',
  stale: 'Stale',
}

const WORKER_STATUS_BADGE = (
  status: 'offline' | 'starting' | 'idle' | 'processing' | 'stopping' | 'stale',
): 'secondary' | 'outline' | 'destructive' => {
  if (status === 'processing') return 'secondary'
  if (status === 'idle' || status === 'starting') return 'outline'
  return 'destructive'
}

export default function ContentModerationPage({ embedded = false }: ContentModerationPageProps) {
  const inRouterContext = useInRouterContext()
  const initialDeepLinkState = useMemo(() => readCurrentDeepLinkState(), [])

  const [filters, setFilters] = useState<FilterState>(initialDeepLinkState.filters)
  const [queryFilters, setQueryFilters] = useState<FilterState>(initialDeepLinkState.filters)
  const [page, setPage] = useState(initialDeepLinkState.page)
  const [queueCursorByPage, setQueueCursorByPage] = useState<Record<number, string>>({})
  const [focusedPanel, setFocusedPanel] = useState<AdminContentDeepLinkPanel>(
    initialDeepLinkState.panel,
  )
  const [highlightedJobId, setHighlightedJobId] = useState<string | null>(
    initialDeepLinkState.jobId,
  )

  const [actionDialog, setActionDialog] = useState<ContentActionDialogState | null>(null)
  const [actionReason, setActionReason] = useState('')
  const [actionNote, setActionNote] = useState('')
  const [actionTemplateCode, setActionTemplateCode] = useState(TEMPLATE_NONE_VALUE)
  const [actionConfirmText, setActionConfirmText] = useState('')
  const [actionMarkFalsePositive, setActionMarkFalsePositive] = useState(false)
  const [actionUnhideMode, setActionUnhideMode] = useState<'immediate' | 'scheduled'>('immediate')
  const [actionScheduledFor, setActionScheduledFor] = useState(getDefaultScheduleInputValue())

  const [historyTarget, setHistoryTarget] = useState<AdminContentQueueItem | null>(null)
  const [historyPage, setHistoryPage] = useState(1)
  const [rollbackDialog, setRollbackDialog] = useState<ContentRollbackDialogState | null>(null)
  const [rollbackReason, setRollbackReason] = useState(DEFAULT_ROLLBACK_REASON)
  const [rollbackNote, setRollbackNote] = useState('')
  const [rollbackConfirmText, setRollbackConfirmText] = useState('')
  const [rollbackMarkFalsePositive, setRollbackMarkFalsePositive] = useState(false)
  const [selectedContentKeys, setSelectedContentKeys] = useState<string[]>([])
  const [bulkDialog, setBulkDialog] = useState<BulkModerationDialogState | null>(null)
  const [bulkAction, setBulkAction] = useState<ContentActionKind>('hide')
  const [bulkReason, setBulkReason] = useState(DEFAULT_ACTION_REASON.hide)
  const [bulkNote, setBulkNote] = useState('')
  const [bulkTemplateCode, setBulkTemplateCode] = useState(TEMPLATE_NONE_VALUE)
  const [bulkScheduledFor, setBulkScheduledFor] = useState('')
  const [bulkConfirmText, setBulkConfirmText] = useState('')
  const [rollbackJobReviewDialog, setRollbackJobReviewDialog] =
    useState<RollbackJobReviewDialogState | null>(null)
  const [rollbackJobReviewNote, setRollbackJobReviewNote] = useState('')
  const [rollbackJobApprovalDialog, setRollbackJobApprovalDialog] =
    useState<RollbackJobApprovalDialogState | null>(null)
  const [rollbackJobApprovalNote, setRollbackJobApprovalNote] = useState('')
  const [rollbackJobApprovalConfirmText, setRollbackJobApprovalConfirmText] = useState('')
  const [rollbackJobReviewedSampleKeys, setRollbackJobReviewedSampleKeys] = useState<string[]>([])
  const [rollbackJobFalsePositiveValidated, setRollbackJobFalsePositiveValidated] = useState(false)

  const rawAuthUser = useAuthStore((state) => state.user)
  const authUser = (rawAuthUser as unknown as CurrentAdminMeta | null) ?? null

  const hasDeepLinkContext = useMemo(
    () =>
      focusedPanel !== 'queue' ||
      Boolean(highlightedJobId) ||
      queryFilters.creatorId.trim().length > 0 ||
      queryFilters.search.trim().length > 0 ||
      queryFilters.contentType !== 'all' ||
      queryFilters.moderationStatus !== 'all' ||
      queryFilters.publishStatus !== 'all' ||
      queryFilters.flaggedOnly !== 'all' ||
      queryFilters.minReportPriority !== 'all' ||
      page > 1,
    [focusedPanel, highlightedJobId, queryFilters, page],
  )

  useEffect(() => {
    const next = readCurrentDeepLinkState()
    setFilters(next.filters)
    setQueryFilters(next.filters)
    setPage(next.page)
    setQueueCursorByPage({})
    setFocusedPanel(next.panel)
    setHighlightedJobId(next.jobId)
    setSelectedContentKeys([])
  }, [])

  useEffect(() => {
    if (embedded || !hasDeepLinkContext || typeof document === 'undefined') return
    const targetId =
      focusedPanel === 'jobs' ? 'admin-content-jobs-panel' : 'admin-content-queue-panel'
    const target = document.getElementById(targetId)
    if (!target) return
    target.scrollIntoView({ block: 'start' })
  }, [embedded, focusedPanel, hasDeepLinkContext])

  const canReadContent = useMemo(() => {
    if (!authUser) return false
    return hasAdminScope(authUser as User, 'admin.content.read')
  }, [authUser])

  const canModerateContent = useMemo(() => {
    if (!authUser) return false
    if (authUser.adminReadOnly) return false
    return hasAdminScope(authUser as User, 'admin.content.moderate')
  }, [authUser])

  const currentQueueCursor = queueCursorByPage[page]
  const queueQuery = useMemo(
    () => toQueueQuery(queryFilters, page, currentQueueCursor),
    [queryFilters, page, currentQueueCursor],
  )
  const moderationQueue = useAdminContentQueue(queueQuery)
  const historyQuery = useAdminContentHistory(
    historyTarget?.contentType ?? null,
    historyTarget?.id ?? null,
    historyPage,
    10,
  )
  const rollbackReviewQuery = useAdminContentRollbackReview(
    rollbackDialog?.content.contentType ?? null,
    rollbackDialog?.content.id ?? null,
    rollbackDialog?.eventId ?? null,
    Boolean(rollbackDialog),
  )
  const moderationTemplatesQuery = useAdminModerationTemplates(
    {
      active: true,
      limit: 100,
    },
    {
      enabled: canReadContent,
    },
  )
  const moderationTemplateItems = moderationTemplatesQuery.data?.items
  const moderationTemplates = useMemo(
    () => moderationTemplateItems ?? EMPTY_MODERATION_TEMPLATES,
    [moderationTemplateItems],
  )
  const actionTemplates = useMemo(
    () =>
      actionDialog
        ? sortTemplatesForAction(moderationTemplates, actionDialog.kind)
        : moderationTemplates,
    [actionDialog, moderationTemplates],
  )
  const bulkTemplates = useMemo(
    () => sortTemplatesForAction(moderationTemplates, bulkAction),
    [bulkAction, moderationTemplates],
  )
  const selectedActionTemplate = useMemo(
    () =>
      actionTemplateCode === TEMPLATE_NONE_VALUE
        ? null
        : (moderationTemplates.find((item) => item.code === actionTemplateCode) ?? null),
    [actionTemplateCode, moderationTemplates],
  )
  const selectedBulkTemplate = useMemo(
    () =>
      bulkTemplateCode === TEMPLATE_NONE_VALUE
        ? null
        : (moderationTemplates.find((item) => item.code === bulkTemplateCode) ?? null),
    [bulkTemplateCode, moderationTemplates],
  )

  const hideMutation = useHideAdminContent()
  const unhideMutation = useUnhideAdminContent()
  const scheduleUnhideMutation = useScheduleAdminContentUnhide()
  const restrictMutation = useRestrictAdminContent()
  const rollbackMutation = useRollbackAdminContent()
  const jobsQuery = useAdminContentJobs({ page: 1, limit: 6 }, { enabled: canReadContent })
  const workerStatusQuery = useAdminContentWorkerStatus({ enabled: canReadContent })
  const bulkJobMutation = useCreateBulkModerationJob()
  const requestRollbackJobReviewMutation = useRequestBulkRollbackJobReview()
  const approveRollbackJobMutation = useApproveBulkRollbackJob()

  const isActionPending =
    hideMutation.isPending ||
    unhideMutation.isPending ||
    scheduleUnhideMutation.isPending ||
    restrictMutation.isPending
  const requiresDoubleConfirm = Boolean(
    actionDialog &&
      (isDestructiveAction(actionDialog.kind) || selectedActionTemplate?.requiresDoubleConfirm),
  )
  const isDoubleConfirmValid =
    !requiresDoubleConfirm || isDoubleConfirmTokenValid(actionConfirmText, DOUBLE_CONFIRM_TOKEN)
  const actionReasonError = actionDialog
    ? getRequiredFieldError(actionReason, 'Motivo obrigatorio para executar a acao.')
    : null
  const actionNoteError =
    actionDialog && selectedActionTemplate?.requiresNote
      ? getRequiredFieldError(actionNote, 'Este template exige nota operacional.')
      : null
  const actionConfirmError =
    requiresDoubleConfirm && actionConfirmText.trim().length > 0 && !isDoubleConfirmValid
      ? `Escreve "${DOUBLE_CONFIRM_TOKEN}" para confirmar esta acao critica.`
      : null
  const actionScheduledForError =
    actionDialog?.kind === 'unhide' && actionUnhideMode === 'scheduled'
      ? parseFutureDateInputToIso(actionScheduledFor).valid
        ? null
        : 'Data/hora de agendamento invalida ou nao futura.'
      : null
  const canSubmitAction =
    Boolean(actionDialog) &&
    !isActionPending &&
    !actionReasonError &&
    !actionNoteError &&
    !actionScheduledForError &&
    isDoubleConfirmValid
  const rollbackReview = rollbackReviewQuery.data?.rollback
  const isRollbackPending = rollbackMutation.isPending
  const rollbackRequiresDoubleConfirm = Boolean(rollbackReview?.requiresConfirm)
  const isRollbackConfirmValid =
    !rollbackRequiresDoubleConfirm ||
    isDoubleConfirmTokenValid(rollbackConfirmText, DOUBLE_CONFIRM_TOKEN)
  const rollbackReasonError = rollbackDialog
    ? getRequiredFieldError(rollbackReason, 'Motivo obrigatorio para executar rollback.')
    : null
  const rollbackConfirmError =
    rollbackRequiresDoubleConfirm &&
    rollbackConfirmText.trim().length > 0 &&
    !isRollbackConfirmValid
      ? `Escreve "${DOUBLE_CONFIRM_TOKEN}" para confirmar este rollback.`
      : null
  const canSubmitRollback =
    Boolean(rollbackDialog) &&
    !isRollbackPending &&
    Boolean(rollbackReview?.canRollback) &&
    !rollbackReasonError &&
    isRollbackConfirmValid
  const bulkRequiresDoubleConfirm =
    (bulkDialog?.items.length ?? 0) >= 10 || selectedBulkTemplate?.requiresDoubleConfirm === true
  const isBulkConfirmValid =
    !bulkRequiresDoubleConfirm || isDoubleConfirmTokenValid(bulkConfirmText, DOUBLE_CONFIRM_TOKEN)
  const bulkReasonError = bulkDialog
    ? getRequiredFieldError(bulkReason, 'Motivo obrigatorio para criar job em lote.')
    : null
  const bulkNoteError =
    bulkDialog && selectedBulkTemplate?.requiresNote
      ? getRequiredFieldError(bulkNote, 'Este template exige nota operacional.')
      : null
  const bulkConfirmError =
    bulkRequiresDoubleConfirm && bulkConfirmText.trim().length > 0 && !isBulkConfirmValid
      ? `Escreve "${DOUBLE_CONFIRM_TOKEN}" para confirmar este lote.`
      : null
  const bulkScheduledForError =
    bulkDialog && bulkAction === 'unhide' && bulkScheduledFor.trim().length > 0
      ? parseFutureDateInputToIso(bulkScheduledFor).valid
        ? null
        : 'Data/hora de agendamento invalida ou nao futura.'
      : null
  const canSubmitBulk =
    Boolean(bulkDialog) &&
    !bulkJobMutation.isPending &&
    !bulkReasonError &&
    !bulkNoteError &&
    !bulkScheduledForError &&
    isBulkConfirmValid
  const rollbackJobApproval = rollbackJobApprovalDialog?.job.approval ?? null
  const rollbackJobApprovalRequiresConfirm =
    Number(rollbackJobApproval?.riskSummary.criticalRiskCount ?? 0) > 0
  const isRollbackJobApprovalConfirmValid =
    !rollbackJobApprovalRequiresConfirm ||
    rollbackJobApprovalConfirmText.trim().toUpperCase() === DOUBLE_CONFIRM_TOKEN
  const areRollbackJobSamplesComplete =
    !rollbackJobApproval?.sampleRequired ||
    rollbackJobApproval.sampleItems.every((item) =>
      rollbackJobReviewedSampleKeys.includes(jobApprovalSampleKey(item)),
    )

  const pagination = moderationQueue.data?.pagination
  const queueCursor = moderationQueue.data?.cursor
  const isCursorPagination = queueCursor?.mode === 'cursor' || page > 1
  const canGoPrevQueuePage = page > 1
  const canGoNextQueuePage = queueCursor?.hasMore === true && Boolean(queueCursor.next)
  const items = moderationQueue.data?.items ?? []
  const activeCreatorContext = queryFilters.creatorId.trim()
  const creatorContextHref = activeCreatorContext
    ? buildAdminCreatorRiskHref({
        creatorId: activeCreatorContext,
        view: 'trust',
        source: 'content',
      })
    : null
  const selectedItems = items.filter((item) =>
    selectedContentKeys.includes(contentSelectionKey(item)),
  )
  const allVisibleSelected =
    items.length > 0 &&
    items.every((item) => selectedContentKeys.includes(contentSelectionKey(item)))
  const partiallySelected = selectedItems.length > 0 && !allVisibleSelected

  const hiddenCountInPage = items.filter((item) => item.moderationStatus === 'hidden').length
  const restrictedCountInPage = items.filter(
    (item) => item.moderationStatus === 'restricted',
  ).length
  const flaggedCountInPage = items.filter(
    (item) => item.reportSignals.openReports > 0 || item.automatedSignals.active,
  ).length
  const highPriorityFlagsInPage = items.filter(
    (item) => item.reportSignals.priority === 'high' || item.reportSignals.priority === 'critical',
  ).length
  const automatedHighRiskInPage = items.filter(
    (item) =>
      item.automatedSignals.active &&
      (item.automatedSignals.severity === 'high' || item.automatedSignals.severity === 'critical'),
  ).length
  const automatedCriticalInPage = items.filter(
    (item) => item.automatedSignals.active && item.automatedSignals.severity === 'critical',
  ).length
  const criticalCreatorRiskInPage = items.filter(
    (item) => item.creatorTrustSignals?.riskLevel === 'critical',
  ).length

  const goToPreviousQueuePage = () => {
    if (!canGoPrevQueuePage) return
    setPage((prev) => Math.max(prev - 1, 1))
  }

  const goToNextQueuePage = () => {
    if (!canGoNextQueuePage || !queueCursor?.next) return

    setQueueCursorByPage((prev) => ({
      ...prev,
      [page + 1]: queueCursor.next as string,
    }))
    setPage((prev) => prev + 1)
  }

  const applyFilters = () => {
    setQueryFilters(filters)
    setPage(1)
    setQueueCursorByPage({})
    setFocusedPanel('queue')
  }

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS)
    setQueryFilters(INITIAL_FILTERS)
    setPage(1)
    setQueueCursorByPage({})
    setFocusedPanel('queue')
    setHighlightedJobId(null)
  }

  const clearCreatorContext = () => {
    setFilters((prev) => ({ ...prev, creatorId: '' }))
    setQueryFilters((prev) => ({ ...prev, creatorId: '' }))
    setPage(1)
    setQueueCursorByPage({})
    setFocusedPanel('queue')
  }

  const openActionDialog = (kind: ContentActionKind, content: AdminContentQueueItem) => {
    setActionDialog({ kind, content })
    setActionTemplateCode(TEMPLATE_NONE_VALUE)
    setActionReason(DEFAULT_ACTION_REASON[kind])
    setActionNote('')
    setActionConfirmText('')
    setActionMarkFalsePositive(false)
    setActionUnhideMode('immediate')
    setActionScheduledFor(getDefaultScheduleInputValue())
  }

  const closeActionDialog = (force = false) => {
    if (!force && isActionPending) return
    setActionDialog(null)
    setActionTemplateCode(TEMPLATE_NONE_VALUE)
    setActionReason('')
    setActionNote('')
    setActionConfirmText('')
    setActionMarkFalsePositive(false)
    setActionUnhideMode('immediate')
    setActionScheduledFor(getDefaultScheduleInputValue())
  }

  const applyActionTemplate = (templateCode: string) => {
    setActionTemplateCode(templateCode)

    if (!actionDialog) return

    if (templateCode === TEMPLATE_NONE_VALUE) {
      setActionReason(DEFAULT_ACTION_REASON[actionDialog.kind])
      return
    }

    const template = moderationTemplates.find((item) => item.code === templateCode)
    if (!template) return

    setActionReason(template.reason)
    setActionNote(template.defaultNote ?? '')
    trackFeature('admin_moderation_template_selected', {
      surface: 'admin_content_action_dialog',
      templateCode: template.code,
      action: actionDialog.kind,
      requiresNote: template.requiresNote,
      requiresDoubleConfirm: template.requiresDoubleConfirm,
    })
  }

  const closeHistoryDialog = () => {
    closeRollbackDialog(true)
    setHistoryTarget(null)
    setHistoryPage(1)
  }

  const openRollbackDialog = (content: AdminContentQueueItem, eventId: string) => {
    setRollbackDialog({ content, eventId })
    setRollbackReason(DEFAULT_ROLLBACK_REASON)
    setRollbackNote('')
    setRollbackConfirmText('')
    setRollbackMarkFalsePositive(false)
  }

  const closeRollbackDialog = (force = false) => {
    if (!force && isRollbackPending) return
    setRollbackDialog(null)
    setRollbackReason(DEFAULT_ROLLBACK_REASON)
    setRollbackNote('')
    setRollbackConfirmText('')
    setRollbackMarkFalsePositive(false)
  }

  const toggleSelectItem = (item: AdminContentQueueItem) => {
    const key = contentSelectionKey(item)
    setSelectedContentKeys((prev) =>
      prev.includes(key) ? prev.filter((value) => value !== key) : [...prev, key],
    )
  }

  const toggleSelectVisible = () => {
    if (allVisibleSelected) {
      const visibleKeys = items.map(contentSelectionKey)
      setSelectedContentKeys((prev) => prev.filter((key) => !visibleKeys.includes(key)))
      return
    }

    setSelectedContentKeys((prev) =>
      Array.from(new Set([...prev, ...items.map(contentSelectionKey)])),
    )
  }

  const openBulkDialog = () => {
    if (selectedItems.length === 0) return
    setBulkDialog({ items: selectedItems })
    setBulkAction('hide')
    setBulkTemplateCode(TEMPLATE_NONE_VALUE)
    setBulkReason(DEFAULT_ACTION_REASON.hide)
    setBulkNote('')
    setBulkScheduledFor('')
    setBulkConfirmText('')
  }

  const closeBulkDialog = (force = false) => {
    if (!force && bulkJobMutation.isPending) return
    setBulkDialog(null)
    setBulkAction('hide')
    setBulkTemplateCode(TEMPLATE_NONE_VALUE)
    setBulkReason(DEFAULT_ACTION_REASON.hide)
    setBulkNote('')
    setBulkScheduledFor('')
    setBulkConfirmText('')
  }

  const applyBulkTemplate = (templateCode: string) => {
    setBulkTemplateCode(templateCode)

    if (templateCode === TEMPLATE_NONE_VALUE) {
      setBulkReason(DEFAULT_ACTION_REASON[bulkAction])
      return
    }

    const template = moderationTemplates.find((item) => item.code === templateCode)
    if (!template) return

    setBulkReason(template.reason)
    setBulkNote(template.defaultNote ?? '')
    trackFeature('admin_moderation_template_selected', {
      surface: 'admin_content_bulk_dialog',
      templateCode: template.code,
      action: bulkAction,
      requiresNote: template.requiresNote,
      requiresDoubleConfirm: template.requiresDoubleConfirm,
    })
  }

  const openRollbackJobReviewDialog = (job: AdminContentJob) => {
    setRollbackJobReviewDialog({ job })
    setRollbackJobReviewNote(job.approval?.reviewNote ?? '')
  }

  const closeRollbackJobReviewDialog = (force = false) => {
    if (!force && requestRollbackJobReviewMutation.isPending) return
    setRollbackJobReviewDialog(null)
    setRollbackJobReviewNote('')
  }

  const openRollbackJobApprovalDialog = (job: AdminContentJob) => {
    const approval = job.approval
    setRollbackJobApprovalDialog({ job })
    setRollbackJobApprovalNote(approval?.approvalNote ?? '')
    setRollbackJobApprovalConfirmText('')
    setRollbackJobReviewedSampleKeys(approval?.reviewedSampleKeys ?? [])
    setRollbackJobFalsePositiveValidated(approval?.falsePositiveValidated === true)
  }

  const closeRollbackJobApprovalDialog = (force = false) => {
    if (!force && approveRollbackJobMutation.isPending) return
    setRollbackJobApprovalDialog(null)
    setRollbackJobApprovalNote('')
    setRollbackJobApprovalConfirmText('')
    setRollbackJobReviewedSampleKeys([])
    setRollbackJobFalsePositiveValidated(false)
  }

  const toggleRollbackJobSample = (
    item: NonNullable<AdminContentJob['approval']>['sampleItems'][number],
  ) => {
    const sampleKey = jobApprovalSampleKey(item)
    setRollbackJobReviewedSampleKeys((prev) =>
      prev.includes(sampleKey) ? prev.filter((value) => value !== sampleKey) : [...prev, sampleKey],
    )
  }

  const submitAction = async () => {
    if (!actionDialog) return

    if (actionReasonError) {
      toast.error(actionReasonError)
      return
    }

    if (actionNoteError) {
      toast.error(actionNoteError)
      return
    }

    if (actionScheduledForError) {
      toast.error(actionScheduledForError)
      return
    }

    const reason = actionReason.trim()
    if (!isDoubleConfirmValid) {
      toast.error(`Escreve "${DOUBLE_CONFIRM_TOKEN}" para confirmar esta acao critica.`)
      return
    }

    try {
      if (selectedActionTemplate) {
        trackFeature('admin_moderation_template_applied', {
          surface: 'admin_content_action_dialog',
          templateCode: selectedActionTemplate.code,
          action: actionDialog.kind,
          mode:
            actionDialog.kind === 'unhide' && actionUnhideMode === 'scheduled'
              ? 'scheduled'
              : 'immediate',
          requiresNote: selectedActionTemplate.requiresNote,
          requiresDoubleConfirm: selectedActionTemplate.requiresDoubleConfirm,
        })
      }

      const payload = {
        reason,
        note: actionNote.trim() || undefined,
        markFalsePositive: actionDialog.kind === 'unhide' ? actionMarkFalsePositive : undefined,
      }

      if (actionDialog.kind === 'hide') {
        const result = await hideMutation.mutateAsync({
          contentType: actionDialog.content.contentType,
          contentId: actionDialog.content.id,
          payload,
        })
        toast.success(result.message)
      } else if (actionDialog.kind === 'unhide') {
        if (actionUnhideMode === 'scheduled') {
          const parsed = parseFutureDateInputToIso(actionScheduledFor)
          if (!parsed.valid || !parsed.iso) {
            toast.error('Data/hora de agendamento invalida ou nao futura.')
            return
          }

          const result = await scheduleUnhideMutation.mutateAsync({
            contentType: actionDialog.content.contentType,
            contentId: actionDialog.content.id,
            payload: {
              reason,
              note: actionNote.trim() || undefined,
              scheduledFor: parsed.iso,
            },
          })
          toast.success(result.message)
        } else {
          const result = await unhideMutation.mutateAsync({
            contentType: actionDialog.content.contentType,
            contentId: actionDialog.content.id,
            payload,
          })
          toast.success(result.message)
        }
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

  const submitRollback = async () => {
    if (!rollbackDialog || !rollbackReviewQuery.data) return

    if (!rollbackReviewQuery.data.rollback.canRollback) {
      toast.error('Rollback bloqueado pelos guardrails atuais.')
      return
    }

    if (rollbackReasonError) {
      toast.error(rollbackReasonError)
      return
    }

    const reason = rollbackReason.trim()

    if (!isRollbackConfirmValid) {
      toast.error(`Escreve "${DOUBLE_CONFIRM_TOKEN}" para confirmar este rollback.`)
      return
    }

    try {
      const result = await rollbackMutation.mutateAsync({
        contentType: rollbackDialog.content.contentType,
        contentId: rollbackDialog.content.id,
        payload: {
          eventId: rollbackDialog.eventId,
          reason,
          note: rollbackNote.trim() || undefined,
          confirm: rollbackRequiresDoubleConfirm ? true : undefined,
          markFalsePositive:
            rollbackMarkFalsePositive && rollbackReviewQuery.data.rollback.falsePositiveEligible,
        },
      })

      toast.success(result.message)
      closeRollbackDialog(true)
      setHistoryPage(1)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const submitBulkJob = async () => {
    if (!bulkDialog || bulkDialog.items.length === 0) return

    if (bulkReasonError) {
      toast.error(bulkReasonError)
      return
    }

    if (bulkNoteError) {
      toast.error(bulkNoteError)
      return
    }

    if (bulkScheduledForError) {
      toast.error(bulkScheduledForError)
      return
    }

    const reason = bulkReason.trim()

    if (!isBulkConfirmValid) {
      toast.error(`Escreve "${DOUBLE_CONFIRM_TOKEN}" para confirmar este lote.`)
      return
    }

    try {
      const parsedScheduledFor =
        bulkAction === 'unhide' && bulkScheduledFor.trim().length > 0
          ? parseFutureDateInputToIso(bulkScheduledFor)
          : null

      if (parsedScheduledFor && (!parsedScheduledFor.valid || !parsedScheduledFor.iso)) {
        toast.error('Data/hora de agendamento invalida ou nao futura.')
        return
      }

      if (selectedBulkTemplate) {
        trackFeature('admin_moderation_template_applied', {
          surface: 'admin_content_bulk_dialog',
          templateCode: selectedBulkTemplate.code,
          action: bulkAction,
          mode: parsedScheduledFor?.iso ? 'scheduled' : 'immediate',
          requiresNote: selectedBulkTemplate.requiresNote,
          requiresDoubleConfirm: selectedBulkTemplate.requiresDoubleConfirm,
          itemCount: bulkDialog.items.length,
        })
      }

      const result = await bulkJobMutation.mutateAsync({
        action: bulkAction,
        reason,
        note: bulkNote.trim() || undefined,
        confirm: bulkRequiresDoubleConfirm ? true : undefined,
        scheduledFor: parsedScheduledFor?.iso,
        items: bulkDialog.items.map((item) => ({
          contentType: item.contentType,
          contentId: item.id,
        })),
      })

      toast.success(result.message)
      setSelectedContentKeys([])
      closeBulkDialog(true)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const submitRollbackJobReview = async () => {
    if (!rollbackJobReviewDialog) return

    try {
      const result = await requestRollbackJobReviewMutation.mutateAsync({
        jobId: rollbackJobReviewDialog.job.id,
        payload: {
          note: rollbackJobReviewNote.trim() || undefined,
        },
      })

      toast.success(result.message)
      closeRollbackJobReviewDialog(true)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const submitRollbackJobApproval = async () => {
    const job = rollbackJobApprovalDialog?.job
    const approval = job?.approval
    if (!job || !approval) return

    if (!areRollbackJobSamplesComplete) {
      toast.error('Revê todos os itens da amostra antes de aprovar o lote.')
      return
    }

    if (!isRollbackJobApprovalConfirmValid) {
      toast.error(`Escreve "${DOUBLE_CONFIRM_TOKEN}" para confirmar este lote critico.`)
      return
    }

    if (approval.falsePositiveValidationRequired && !rollbackJobFalsePositiveValidated) {
      toast.error('Valida os false positives antes de aprovar este rollback em lote.')
      return
    }

    try {
      const result = await approveRollbackJobMutation.mutateAsync({
        jobId: job.id,
        payload: {
          note: rollbackJobApprovalNote.trim() || undefined,
          confirm: rollbackJobApprovalRequiresConfirm ? true : undefined,
          falsePositiveValidated: approval.falsePositiveValidationRequired
            ? rollbackJobFalsePositiveValidated
            : undefined,
          reviewedSampleItems: approval.sampleItems
            .filter((item) => rollbackJobReviewedSampleKeys.includes(jobApprovalSampleKey(item)))
            .map((item) => ({
              contentType: item.contentType,
              contentId: item.contentId,
              eventId: item.eventId,
            })),
        },
      })

      toast.success(result.message)
      closeRollbackJobApprovalDialog(true)
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

      {!embedded ? (
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" asChild>
            <a href="/admin/conteudo">Fila de moderacao</a>
          </Button>
          <Button type="button" size="sm" variant="outline" asChild>
            <a href="/admin/conteudo/apelacoes">Apelacoes</a>
          </Button>
        </div>
      ) : null}

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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5 2xl:grid-cols-8">
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
              Targets nesta pagina com reports ou detecao automatica ativa.
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
        <Card className="border-orange-500/20 bg-orange-500/5">
          <CardHeader className="pb-2">
            <CardDescription>Auto sinais high+</CardDescription>
            <CardTitle className="text-2xl">{automatedHighRiskInPage}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Itens com deteccao automatica alta ou critica.
            </p>
          </CardContent>
        </Card>
        <Card className="border-rose-500/20 bg-rose-500/5">
          <CardHeader className="pb-2">
            <CardDescription>Auto criticos</CardDescription>
            <CardTitle className="text-2xl">{automatedCriticalInPage}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Sinais automaticos com recomendacao de triagem imediata.
            </p>
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
            Refina por tipo, estado e pressao de risco. `flags` inclui reports e deteccao
            automatica.
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

          {activeCreatorContext ? (
            <div className="md:col-span-2 xl:col-span-7 flex flex-wrap items-center gap-2 rounded-md border border-sky-500/30 bg-sky-500/5 p-3 text-sm">
              <Badge variant="outline" className="border-sky-500/40 text-sky-700">
                Contexto creator
              </Badge>
              <span className="text-muted-foreground">{activeCreatorContext}</span>
              {creatorContextHref ? (
                <Button asChild type="button" size="sm" variant="outline">
                  <OptionalRouterLink to={creatorContextHref} inRouterContext={inRouterContext}>
                    <ArrowUpRight className="h-4 w-4" />
                    Abrir trust profile
                  </OptionalRouterLink>
                </Button>
              ) : null}
              <Button type="button" size="sm" variant="ghost" onClick={clearCreatorContext}>
                Limpar contexto
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_0.9fr] 2xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Lote assíncrono</CardTitle>
            <CardDescription>
              Seleciona itens da página atual e cria um job auditável sem bloquear a triagem.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">Selecionados: {selectedItems.length}</Badge>
              <Badge variant="outline">Página: {items.length}</Badge>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!canModerateContent || items.length === 0}
                onClick={toggleSelectVisible}
              >
                {allVisibleSelected ? 'Limpar página' : 'Selecionar página'}
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!canModerateContent || selectedItems.length === 0}
                onClick={openBulkDialog}
              >
                Criar job
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Usa esta via para esconder/restringir/reativar vários targets sem prender a interface
              do admin. Jobs com 10+ itens exigem confirmação forte.
            </p>
          </CardContent>
        </Card>

        <Card
          id="admin-content-jobs-panel"
          className={cn(focusedPanel === 'jobs' && 'border-sky-500/40 bg-sky-500/5')}
        >
          <CardHeader>
            <CardTitle>Jobs recentes</CardTitle>
            <CardDescription>Últimos jobs de moderacao e rollback em lote.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {workerStatusQuery.isError ? (
              <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                {getErrorMessage(workerStatusQuery.error)}
              </div>
            ) : workerStatusQuery.data ? (
              <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={WORKER_STATUS_BADGE(workerStatusQuery.data.worker.status)}>
                      {WORKER_STATUS_LABEL[workerStatusQuery.data.worker.status]}
                    </Badge>
                    {workerStatusQuery.data.worker.workerId ? (
                      <Badge variant="outline">{workerStatusQuery.data.worker.workerId}</Badge>
                    ) : null}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Heartbeat: {formatDateTime(workerStatusQuery.data.worker.lastHeartbeatAt)}
                  </span>
                </div>

                <div className="mt-3 grid gap-2 text-xs text-muted-foreground md:grid-cols-2">
                  <p>
                    Fila executavel: {workerStatusQuery.data.queue.queued} | a aguardar aprovacao{' '}
                    {workerStatusQuery.data.queue.awaitingApproval}
                  </p>
                  <p>
                    Agendados: {workerStatusQuery.data.queue.scheduled} | proximo em{' '}
                    {formatDateTime(workerStatusQuery.data.queue.nextScheduledAt)}
                  </p>
                  <p>
                    Running: {workerStatusQuery.data.queue.running} | retries em curso{' '}
                    {workerStatusQuery.data.queue.retrying}
                  </p>
                  <p>Running stale: {workerStatusQuery.data.queue.staleRunning}</p>
                  <p>Falhas 24h: {workerStatusQuery.data.queue.failedLast24h}</p>
                  <p>Max attempts atingido: {workerStatusQuery.data.queue.maxAttemptsReached}</p>
                  <p>
                    Lease: {Math.round(workerStatusQuery.data.config.leaseMs / 1000)}s | heartbeat{' '}
                    {Math.round(workerStatusQuery.data.config.heartbeatMs / 1000)}s
                  </p>
                </div>

                {workerStatusQuery.data.currentJob ? (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Job atual:{' '}
                    {workerStatusQuery.data.currentJob.type === 'bulk_rollback'
                      ? 'Rollback'
                      : 'Moderacao'}{' '}
                    | tentativa {workerStatusQuery.data.currentJob.attemptCount}/
                    {workerStatusQuery.data.currentJob.maxAttempts} |{' '}
                    {workerStatusQuery.data.currentJob.progress.processed}/
                    {workerStatusQuery.data.currentJob.progress.requested} processados
                  </p>
                ) : null}

                {workerStatusQuery.data.worker.lastError ? (
                  <p className="mt-2 text-xs text-amber-700">
                    Ultimo erro: {workerStatusQuery.data.worker.lastError}
                  </p>
                ) : null}
              </div>
            ) : null}

            {jobsQuery.isLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />A carregar jobs...
              </div>
            ) : jobsQuery.isError ? (
              <p className="text-sm text-destructive">{getErrorMessage(jobsQuery.error)}</p>
            ) : (jobsQuery.data?.items.length ?? 0) === 0 ? (
              <p className="text-sm text-muted-foreground">Sem jobs recentes.</p>
            ) : (
              <div className="space-y-2">
                {jobsQuery.data?.items.map((job) => {
                  const isHighlightedJob = highlightedJobId === job.id

                  return (
                    <div
                      key={job.id}
                      className={cn(
                        'rounded-lg border border-border/70 p-3',
                        isHighlightedJob && 'border-sky-500/40 bg-sky-500/5',
                      )}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline">
                            {job.type === 'bulk_rollback' ? 'Rollback' : 'Moderacao'}
                          </Badge>
                          <Badge
                            variant={
                              job.status === 'failed'
                                ? 'destructive'
                                : job.status === 'completed_with_errors'
                                  ? 'outline'
                                  : 'secondary'
                            }
                          >
                            {JOB_STATUS_LABEL[job.status]}
                          </Badge>
                          {job.scheduledFor ? (
                            <Badge variant="outline" className="border-sky-500/40 text-sky-700">
                              <Clock3 className="h-3 w-3" />
                              Agendado
                            </Badge>
                          ) : null}
                          {job.type === 'bulk_rollback' && job.approval?.required ? (
                            <Badge variant={JOB_APPROVAL_BADGE(job.approval.reviewStatus)}>
                              {JOB_APPROVAL_LABEL[job.approval.reviewStatus]}
                            </Badge>
                          ) : null}
                          {isHighlightedJob ? (
                            <Badge variant="outline" className="border-sky-500/40 text-sky-700">
                              Deep-link
                            </Badge>
                          ) : null}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(job.createdAt)}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {job.progress.processed}/{job.progress.requested} processados | ok{' '}
                        {job.progress.succeeded} | falhas {job.progress.failed}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Tentativa: {job.attemptCount}/{job.maxAttempts}
                        {job.workerId ? ` | worker ${job.workerId}` : ''}
                      </p>
                      {job.scheduledFor ? (
                        <p className="text-xs text-muted-foreground">
                          Execucao agendada para {formatDateTime(job.scheduledFor)}
                        </p>
                      ) : null}
                      <p className="text-xs text-muted-foreground">
                        Actor: {job.actor?.name || job.actor?.username || job.actor?.id || 'n/a'}
                      </p>
                      {job.type === 'bulk_rollback' && job.approval ? (
                        <>
                          <p className="text-xs text-muted-foreground">
                            Risco ativo {job.approval.riskSummary.activeRiskCount} | alto{' '}
                            {job.approval.riskSummary.highRiskCount} | critico{' '}
                            {job.approval.riskSummary.criticalRiskCount}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Repor visibilidade: {job.approval.riskSummary.restoreVisibleCount}
                            {job.approval.sampleRequired
                              ? ` | amostra ${job.approval.reviewedSampleKeys.length}/${job.approval.sampleItems.length}`
                              : ''}
                            {job.approval.falsePositiveValidationRequired
                              ? ` | false positive ${job.approval.falsePositiveValidated ? 'validado' : 'pendente'}`
                              : ''}
                          </p>
                          {job.approval.reviewRequestedAt ? (
                            <p className="text-xs text-muted-foreground">
                              Revisao pedida em {formatDateTime(job.approval.reviewRequestedAt)}
                              {job.approval.reviewRequestedBy
                                ? ` por ${job.approval.reviewRequestedBy.name || job.approval.reviewRequestedBy.username || job.approval.reviewRequestedBy.id}`
                                : ''}
                            </p>
                          ) : null}
                          {job.approval.approvedAt ? (
                            <p className="text-xs text-muted-foreground">
                              Aprovado em {formatDateTime(job.approval.approvedAt)}
                              {job.approval.approvedBy
                                ? ` por ${job.approval.approvedBy.name || job.approval.approvedBy.username || job.approval.approvedBy.id}`
                                : ''}
                            </p>
                          ) : null}
                        </>
                      ) : null}
                      {job.status === 'running' ? (
                        <p className="text-xs text-muted-foreground">
                          Heartbeat: {formatDateTime(job.lastHeartbeatAt)} | lease ate{' '}
                          {formatDateTime(job.leaseExpiresAt)}
                        </p>
                      ) : null}
                      {canModerateContent &&
                      job.type === 'bulk_rollback' &&
                      job.status === 'queued' &&
                      job.approval?.required ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {job.approval.reviewStatus === 'draft' ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => openRollbackJobReviewDialog(job)}
                            >
                              Submeter revisao
                            </Button>
                          ) : null}
                          {job.approval.reviewStatus === 'review' ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => openRollbackJobApprovalDialog(job)}
                            >
                              Aprovar lote
                            </Button>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card
        id="admin-content-queue-panel"
        className={cn(
          focusedPanel === 'queue' && hasDeepLinkContext && 'border-sky-500/40 bg-sky-500/5',
        )}
      >
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>Fila operacional</CardTitle>
              <CardDescription>
                Sequencia recomendada: validar contexto, aplicar acao com motivo, verificar
                historico.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Selecionados: {selectedItems.length}</Badge>
              {canModerateContent ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={selectedItems.length === 0}
                  onClick={openBulkDialog}
                >
                  Criar job em lote
                </Button>
              ) : null}
            </div>
          </div>
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
            <>
              <div className="space-y-3 md:hidden">
                {items.map((item) => {
                  const canAct = canModerateContent
                  const selected = selectedContentKeys.includes(contentSelectionKey(item))
                  const effectiveVisibility = resolveEffectivePublicVisibility({
                    moderationStatus: item.moderationStatus,
                    publishStatus: item.status,
                  })

                  return (
                    <div
                      key={`mobile-${item.contentType}-${item.id}`}
                      className="rounded-lg border border-border/70 p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">/{item.slug}</p>
                        </div>
                        {canModerateContent ? (
                          <Checkbox
                            aria-label={`Selecionar ${item.title}`}
                            checked={selected}
                            onCheckedChange={() => toggleSelectItem(item)}
                          />
                        ) : null}
                      </div>

                      <p className="mt-2 text-xs text-muted-foreground">
                        {item.description || 'Sem descricao resumida.'}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="outline">{CONTENT_TYPE_LABEL[item.contentType]}</Badge>
                        <Badge variant="outline">{item.status}</Badge>
                        <Badge variant={MODERATION_STATUS_BADGE(item.moderationStatus)}>
                          {MODERATION_STATUS_LABEL[item.moderationStatus]}
                        </Badge>
                        <ReportPriorityBadge
                          priority={item.reportSignals.priority}
                          openReports={item.reportSignals.openReports}
                        />
                        <AutomatedDetectionBadge
                          severity={item.automatedSignals.severity}
                          score={item.automatedSignals.score}
                          active={item.automatedSignals.active}
                        />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Visibilidade efetiva: {EFFECTIVE_VISIBILITY_LABEL[effectiveVisibility]}
                      </p>

                      <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                        <p>Criador: {formatActor(item.creator)}</p>
                        <p>Ultima moderacao: {formatDateTime(item.moderatedAt)}</p>
                        <p>Moderado por: {formatActor(item.moderatedBy)}</p>
                        {item.reportSignals.topReasons[0] ? (
                          <p>Top report: {item.reportSignals.topReasons[0].reason}</p>
                        ) : null}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.creator ? (
                          <Button asChild type="button" size="sm" variant="outline">
                            <OptionalRouterLink
                              to={buildAdminCreatorRiskHref({
                                creatorId: item.creator.id,
                                view: 'trust',
                                source: 'content',
                                contentType: item.contentType,
                                contentId: item.id,
                              })}
                              inRouterContext={inRouterContext}
                            >
                              <ArrowUpRight className="h-4 w-4" />
                              Creator
                            </OptionalRouterLink>
                          </Button>
                        ) : null}

                        {item.creator && canAct ? (
                          <Button asChild type="button" size="sm">
                            <OptionalRouterLink
                              to={buildAdminCreatorRiskHref({
                                creatorId: item.creator.id,
                                view: 'controls',
                                source: 'content',
                                contentType: item.contentType,
                                contentId: item.id,
                              })}
                              inRouterContext={inRouterContext}
                            >
                              <ShieldAlert className="h-4 w-4" />
                              Controlar
                            </OptionalRouterLink>
                          </Button>
                        ) : null}

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
                    </div>
                  )
                })}
              </div>

              <div className="hidden overflow-auto md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {canModerateContent ? (
                        <TableHead className="w-[48px]">
                          <Checkbox
                            aria-label="Selecionar conteudos da pagina"
                            checked={partiallySelected ? 'indeterminate' : allVisibleSelected}
                            onCheckedChange={toggleSelectVisible}
                          />
                        </TableHead>
                      ) : null}
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
                      const effectiveVisibility = resolveEffectivePublicVisibility({
                        moderationStatus: item.moderationStatus,
                        publishStatus: item.status,
                      })
                      return (
                        <TableRow key={`${item.contentType}-${item.id}`}>
                          {canModerateContent ? (
                            <TableCell>
                              <Checkbox
                                aria-label={`Selecionar ${item.title}`}
                                checked={selectedContentKeys.includes(contentSelectionKey(item))}
                                onCheckedChange={() => toggleSelectItem(item)}
                              />
                            </TableCell>
                          ) : null}
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
                              <Badge variant="outline">
                                {CONTENT_TYPE_LABEL[item.contentType]}
                              </Badge>
                              <Badge variant="outline">{item.status}</Badge>
                              <Badge variant={MODERATION_STATUS_BADGE(item.moderationStatus)}>
                                {MODERATION_STATUS_LABEL[item.moderationStatus]}
                              </Badge>
                              <ReportPriorityBadge
                                priority={item.reportSignals.priority}
                                openReports={item.reportSignals.openReports}
                              />
                              <AutomatedDetectionBadge
                                severity={item.automatedSignals.severity}
                                score={item.automatedSignals.score}
                                active={item.automatedSignals.active}
                              />
                            </div>
                            {item.moderationReason && (
                              <p className="mt-1 text-xs text-muted-foreground">
                                {item.moderationReason}
                              </p>
                            )}
                            <p className="mt-1 text-xs text-muted-foreground">
                              Visibilidade efetiva:{' '}
                              {EFFECTIVE_VISIBILITY_LABEL[effectiveVisibility]}
                            </p>
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
                                  <TrustScoreBar
                                    value={item.creatorTrustSignals.trustScore}
                                    compact
                                  />
                                </>
                              ) : null}
                              {item.creator ? (
                                <div className="flex flex-wrap gap-2 pt-1">
                                  <Button asChild type="button" size="sm" variant="outline">
                                    <OptionalRouterLink
                                      to={buildAdminCreatorRiskHref({
                                        creatorId: item.creator.id,
                                        view: 'trust',
                                        source: 'content',
                                        contentType: item.contentType,
                                        contentId: item.id,
                                      })}
                                      inRouterContext={inRouterContext}
                                    >
                                      <ArrowUpRight className="h-4 w-4" />
                                      Creator
                                    </OptionalRouterLink>
                                  </Button>
                                  {canAct ? (
                                    <Button asChild type="button" size="sm">
                                      <OptionalRouterLink
                                        to={buildAdminCreatorRiskHref({
                                          creatorId: item.creator.id,
                                          view: 'controls',
                                          source: 'content',
                                          contentType: item.contentType,
                                          contentId: item.id,
                                        })}
                                        inRouterContext={inRouterContext}
                                      >
                                        <ShieldAlert className="h-4 w-4" />
                                        Controlar
                                      </OptionalRouterLink>
                                    </Button>
                                  ) : null}
                                </div>
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
                                    (item.automatedSignals.recommendedAction === 'hide'
                                      ? 'block_publishing'
                                      : item.automatedSignals.recommendedAction === 'restrict'
                                        ? 'set_cooldown'
                                        : item.policySignals.recommendedAction === 'review'
                                          ? 'review'
                                          : item.policySignals.recommendedAction === 'hide'
                                            ? 'block_publishing'
                                            : item.policySignals.recommendedAction === 'restrict'
                                              ? 'set_cooldown'
                                              : 'none')
                                  }
                                />
                                {item.automatedSignals.active ? (
                                  <Badge
                                    variant="outline"
                                    className="border-orange-500/40 text-orange-700"
                                  >
                                    Auto: {item.automatedSignals.recommendedAction}
                                  </Badge>
                                ) : null}
                                {item.policySignals.recommendedAction !== 'none' ? (
                                  <Badge
                                    variant="outline"
                                    className="border-sky-500/40 text-sky-700"
                                  >
                                    Policy: {item.policySignals.recommendedAction}
                                  </Badge>
                                ) : null}
                              </div>
                              {item.creatorTrustSignals?.summary.activeControlFlags.length ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {item.creatorTrustSignals.summary.activeControlFlags.map(
                                    (flag) => (
                                      <Badge key={flag} variant="outline">
                                        {flag}
                                      </Badge>
                                    ),
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  Sem barreiras ativas.
                                </span>
                              )}
                              <div className="space-y-1 text-xs text-muted-foreground">
                                <p>
                                  {item.reportSignals.topReasons[0]
                                    ? `Top report: ${item.reportSignals.topReasons[0].reason}`
                                    : 'Sem motivo dominante por report.'}
                                </p>
                                <p>
                                  Perfil policy: {item.policySignals.profile.label} · hide/high com{' '}
                                  {item.policySignals.thresholds.highPriorityHideMinUniqueReporters}
                                  + reporters
                                </p>
                                <p>
                                  {item.automatedSignals.active &&
                                  item.automatedSignals.triggeredRules[0]
                                    ? `Auto rule: ${AUTOMATED_RULE_LABEL[item.automatedSignals.triggeredRules[0].rule]}`
                                    : 'Sem regra automatica dominante.'}
                                </p>
                                {item.creatorTrustSignals ? (
                                  <p>
                                    FP tuning:{' '}
                                    {
                                      item.creatorTrustSignals.summary
                                        .falsePositiveCompensationScore30d
                                    }{' '}
                                    pts
                                    {item.creatorTrustSignals.summary
                                      .dominantFalsePositiveCategory30d
                                      ? ` · ${FALSE_POSITIVE_CATEGORY_LABEL[item.creatorTrustSignals.summary.dominantFalsePositiveCategory30d]}`
                                      : ''}
                                  </p>
                                ) : null}
                                {item.automatedSignals.active ? (
                                  <p>
                                    Origem auto: {item.automatedSignals.triggerSource ?? 'n/a'} ·
                                    ultimo sinal{' '}
                                    {formatDateTime(item.automatedSignals.lastDetectedAt)}
                                  </p>
                                ) : null}
                                {item.automatedSignals.automation.executed ? (
                                  <p className="text-orange-700">
                                    Auto-hide tecnico executado em{' '}
                                    {formatDateTime(item.automatedSignals.automation.lastAttemptAt)}
                                  </p>
                                ) : item.automatedSignals.active &&
                                  item.automatedSignals.automation.eligible ? (
                                  <p className="text-orange-700">
                                    Elegivel para auto-hide tecnico.
                                  </p>
                                ) : null}
                              </div>
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
              </div>
            </>
          )}

          {pagination && (isCursorPagination || pagination.pages > 1) && (
            <div className="flex items-center justify-between border-t border-border pt-4">
              <p className="text-sm text-muted-foreground">
                {isCursorPagination
                  ? `Pagina ${page}${pagination.total > 0 ? ` - total ${pagination.total}` : ''}`
                  : `Pagina ${pagination.page} de ${pagination.pages}`}
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!canGoPrevQueuePage}
                  onClick={goToPreviousQueuePage}
                >
                  Anterior
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!canGoNextQueuePage}
                  onClick={goToNextQueuePage}
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
                <Label>Template de moderacao</Label>
                <Select value={actionTemplateCode} onValueChange={applyActionTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleciona template (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TEMPLATE_NONE_VALUE}>Manual (sem template)</SelectItem>
                    {actionTemplates.map((template) => (
                      <SelectItem key={template.code} value={template.code}>
                        {template.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {moderationTemplatesQuery.isLoading ? (
                  <p className="text-xs text-muted-foreground">A carregar templates...</p>
                ) : moderationTemplatesQuery.isError ? (
                  <p className="text-xs text-destructive">
                    {getErrorMessage(moderationTemplatesQuery.error)}
                  </p>
                ) : selectedActionTemplate ? (
                  <p className="text-xs text-muted-foreground">
                    Template <span className="font-medium">{selectedActionTemplate.code}</span>:{' '}
                    reason e nota foram preenchidos automaticamente.
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Seleciona um template para auto-fill de motivo/nota.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-content-action-reason">Motivo</Label>
                <Input
                  id="admin-content-action-reason"
                  value={actionReason}
                  onChange={(event) => setActionReason(event.target.value)}
                  placeholder={ACTION_COPY[actionDialog.kind].reasonPlaceholder}
                  className={
                    actionReasonError
                      ? 'border-destructive focus-visible:ring-destructive'
                      : undefined
                  }
                />
                {actionReasonError ? (
                  <p className="text-xs text-destructive">{actionReasonError}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-content-action-note">Nota adicional (opcional)</Label>
                <Textarea
                  id="admin-content-action-note"
                  value={actionNote}
                  onChange={(event) => setActionNote(event.target.value)}
                  rows={4}
                  placeholder="Detalhes operacionais para auditoria interna."
                  className={
                    actionNoteError
                      ? 'border-destructive focus-visible:ring-destructive'
                      : undefined
                  }
                />
                {actionNoteError ? (
                  <p className="text-xs text-destructive">{actionNoteError}</p>
                ) : selectedActionTemplate?.requiresNote ? (
                  <p className="text-xs text-muted-foreground">
                    Este template exige nota antes de confirmar a acao.
                  </p>
                ) : null}
              </div>

              {actionDialog.kind === 'unhide' ? (
                <div className="space-y-3 rounded-md border border-border/70 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Modo de reativacao
                  </p>
                  <Select
                    value={actionUnhideMode}
                    onValueChange={(value) =>
                      setActionUnhideMode(value as 'immediate' | 'scheduled')
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Imediata</SelectItem>
                      <SelectItem value="scheduled">Agendada</SelectItem>
                    </SelectContent>
                  </Select>

                  {actionUnhideMode === 'scheduled' ? (
                    <div className="space-y-2">
                      <Label htmlFor="admin-content-action-scheduled-for">
                        Data/hora de reativacao
                      </Label>
                      <Input
                        id="admin-content-action-scheduled-for"
                        type="datetime-local"
                        value={actionScheduledFor}
                        onChange={(event) => setActionScheduledFor(event.target.value)}
                        className={
                          actionScheduledForError
                            ? 'border-destructive focus-visible:ring-destructive'
                            : undefined
                        }
                      />
                      {actionScheduledForError ? (
                        <p className="text-xs text-destructive">{actionScheduledForError}</p>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          O worker vai executar o unhide automaticamente na hora definida.
                        </p>
                      )}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {actionDialog.kind === 'unhide' && actionUnhideMode === 'immediate' ? (
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox
                    checked={actionMarkFalsePositive}
                    onCheckedChange={(checked) => setActionMarkFalsePositive(checked === true)}
                  />
                  Marcar esta reativacao como falso positivo corrigido
                </label>
              ) : null}

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
                    className={
                      actionConfirmError
                        ? 'border-destructive focus-visible:ring-destructive'
                        : undefined
                    }
                  />
                  {actionConfirmError ? (
                    <p className="text-xs text-destructive">{actionConfirmError}</p>
                  ) : null}
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
            <Button type="button" onClick={submitAction} disabled={!canSubmitAction}>
              {isActionPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {actionDialog?.kind === 'unhide' && actionUnhideMode === 'scheduled'
                ? 'Agendar reativacao'
                : actionDialog
                  ? ACTION_COPY[actionDialog.kind].confirmLabel
                  : 'Confirmar'}
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
                  <div className="mt-2 flex flex-wrap gap-2">
                    {hasBooleanMetadataFlag(event, 'fastTrack') ? (
                      <Badge variant="outline">Fast hide</Badge>
                    ) : null}
                    {hasBooleanMetadataFlag(event, 'bulkModeration') ? (
                      <Badge variant="outline">Lote</Badge>
                    ) : null}
                    {hasBooleanMetadataFlag(event, 'automatedDetection') ? (
                      <Badge variant="outline">Auto</Badge>
                    ) : null}
                    {hasBooleanMetadataFlag(event, 'rollback') ? (
                      <Badge variant="outline">Rollback</Badge>
                    ) : null}
                    {hasBooleanMetadataFlag(event, 'falsePositiveMarked') ? (
                      <Badge variant="outline">False positive</Badge>
                    ) : null}
                  </div>
                  {canModerateContent && historyTarget ? (
                    <div className="mt-3">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => openRollbackDialog(historyTarget, event.id)}
                      >
                        <Undo2 className="h-4 w-4" />
                        Rever rollback
                      </Button>
                    </div>
                  ) : null}
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

      <Dialog
        open={Boolean(rollbackDialog)}
        onOpenChange={(open) => (!open ? closeRollbackDialog() : null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Rollback assistido
              {rollbackDialog ? ` - ${rollbackDialog.content.title}` : ''}
            </DialogTitle>
            <DialogDescription>
              Rever impacto, guardrails e sinais ativos antes de restaurar um estado anterior.
            </DialogDescription>
          </DialogHeader>

          {rollbackReviewQuery.isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />A preparar rollback...
            </div>
          ) : rollbackReviewQuery.isError ? (
            <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
              {getErrorMessage(rollbackReviewQuery.error)}
            </div>
          ) : !rollbackReviewQuery.data ? (
            <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Sem dados para rollback.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Estado atual</CardDescription>
                    <CardTitle className="text-lg">
                      {MODERATION_STATUS_LABEL[rollbackReviewQuery.data.rollback.currentStatus]}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Rollback para</CardDescription>
                    <CardTitle className="text-lg">
                      {MODERATION_STATUS_LABEL[rollbackReviewQuery.data.rollback.targetStatus]}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Acao aplicada</CardDescription>
                    <CardTitle className="text-lg">
                      {MODERATION_ACTION_LABEL[rollbackReviewQuery.data.rollback.action]}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <div className="rounded-md border border-border/70 bg-muted/20 p-3 text-sm">
                <p className="font-medium">{rollbackReviewQuery.data.event.reason}</p>
                {rollbackReviewQuery.data.event.note ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Nota original: {rollbackReviewQuery.data.event.note}
                  </p>
                ) : null}
                <p className="mt-1 text-xs text-muted-foreground">
                  Evento {MODERATION_ACTION_LABEL[rollbackReviewQuery.data.event.action]} em{' '}
                  {formatDateTime(rollbackReviewQuery.data.event.createdAt)}
                </p>
              </div>

              {rollbackReviewQuery.data.rollback.blockers.length > 0 ? (
                <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3">
                  <p className="text-sm font-medium text-destructive">Rollback bloqueado</p>
                  <ul className="mt-2 space-y-1 text-xs text-destructive">
                    {rollbackReviewQuery.data.rollback.blockers.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {rollbackReviewQuery.data.rollback.warnings.length > 0 ? (
                <div className="rounded-md border border-amber-500/40 bg-amber-500/5 p-3">
                  <p className="text-sm font-medium text-amber-700">Warnings operacionais</p>
                  <ul className="mt-2 space-y-1 text-xs text-amber-700">
                    {rollbackReviewQuery.data.rollback.warnings.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="rounded-md border border-border/70 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Checklist de revisao
                </p>
                <div className="mt-2 grid gap-2 text-xs text-muted-foreground md:grid-cols-2">
                  <p>
                    Evento mais recente:{' '}
                    {rollbackReviewQuery.data.rollback.checks.isLatestEvent ? 'Sim' : 'Nao'}
                  </p>
                  <p>
                    Estado alinhado:{' '}
                    {rollbackReviewQuery.data.rollback.checks.currentMatchesEventToStatus
                      ? 'Sim'
                      : 'Nao'}
                  </p>
                  <p>Reports abertos: {rollbackReviewQuery.data.rollback.checks.openReports}</p>
                  <p>
                    Reporters unicos: {rollbackReviewQuery.data.rollback.checks.uniqueReporters}
                  </p>
                  <p>
                    Sinal auto ativo:{' '}
                    {rollbackReviewQuery.data.rollback.checks.automatedSignalActive ? 'Sim' : 'Nao'}
                  </p>
                  <p>
                    Severidade auto: {rollbackReviewQuery.data.rollback.checks.automatedSeverity}
                  </p>
                  <p>
                    Creator risk:{' '}
                    {rollbackReviewQuery.data.rollback.checks.creatorRiskLevel ?? 'n/a'}
                  </p>
                  <p>
                    Eventos mais recentes:{' '}
                    {rollbackReviewQuery.data.rollback.checks.newerEventsCount}
                  </p>
                </div>
              </div>

              <div className="rounded-md border border-border/70 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Guia operacional
                </p>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  {rollbackReviewQuery.data.rollback.guidance.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-content-rollback-reason">Motivo</Label>
                <Input
                  id="admin-content-rollback-reason"
                  value={rollbackReason}
                  onChange={(event) => setRollbackReason(event.target.value)}
                  placeholder="Ex: revisao concluida e restauracao segura"
                  className={
                    rollbackReasonError
                      ? 'border-destructive focus-visible:ring-destructive'
                      : undefined
                  }
                />
                {rollbackReasonError ? (
                  <p className="text-xs text-destructive">{rollbackReasonError}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-content-rollback-note">Nota operacional (opcional)</Label>
                <Textarea
                  id="admin-content-rollback-note"
                  value={rollbackNote}
                  onChange={(event) => setRollbackNote(event.target.value)}
                  rows={4}
                  placeholder="Contexto de revisao, evidencias e decisao tomada."
                />
              </div>

              {rollbackReviewQuery.data.rollback.falsePositiveEligible ? (
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox
                    checked={rollbackMarkFalsePositive}
                    onCheckedChange={(checked) => setRollbackMarkFalsePositive(checked === true)}
                  />
                  Marcar o evento original como falso positivo corrigido
                </label>
              ) : null}

              {rollbackReviewQuery.data.rollback.requiresConfirm ? (
                <div className="space-y-2">
                  <Label htmlFor="admin-content-rollback-confirm">
                    Confirmacao dupla (escreve {DOUBLE_CONFIRM_TOKEN})
                  </Label>
                  <Input
                    id="admin-content-rollback-confirm"
                    value={rollbackConfirmText}
                    onChange={(event) => setRollbackConfirmText(event.target.value)}
                    placeholder={DOUBLE_CONFIRM_TOKEN}
                    className={
                      rollbackConfirmError
                        ? 'border-destructive focus-visible:ring-destructive'
                        : undefined
                    }
                  />
                  {rollbackConfirmError ? (
                    <p className="text-xs text-destructive">{rollbackConfirmError}</p>
                  ) : null}
                  <p className="text-xs text-amber-700">
                    Este rollback volta a expor um alvo com sinais ativos. Confirmacao forte
                    obrigatoria.
                  </p>
                </div>
              ) : null}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeRollbackDialog}
              disabled={isRollbackPending}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={submitRollback} disabled={!canSubmitRollback}>
              {isRollbackPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Executar rollback assistido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(rollbackJobReviewDialog)}
        onOpenChange={(open) => (!open ? closeRollbackJobReviewDialog() : null)}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Submeter rollback em lote para revisao</DialogTitle>
            <DialogDescription>
              O lote passa de draft para review e fica pronto para aprovacao operacional.
            </DialogDescription>
          </DialogHeader>

          {rollbackJobReviewDialog ? (
            <div className="space-y-4">
              <div className="rounded-md border border-border/70 bg-muted/20 p-3 text-sm text-muted-foreground">
                {rollbackJobReviewDialog.job.progress.requested} item(ns) | risco alto{' '}
                {rollbackJobReviewDialog.job.approval?.riskSummary.highRiskCount ?? 0} | critico{' '}
                {rollbackJobReviewDialog.job.approval?.riskSummary.criticalRiskCount ?? 0}
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-content-job-review-note">Nota de revisao (opcional)</Label>
                <Textarea
                  id="admin-content-job-review-note"
                  rows={4}
                  value={rollbackJobReviewNote}
                  onChange={(event) => setRollbackJobReviewNote(event.target.value)}
                  placeholder="Contexto do lote, evidencias revistadas e janela operacional."
                />
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => closeRollbackJobReviewDialog()}
              disabled={requestRollbackJobReviewMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={submitRollbackJobReview}
              disabled={requestRollbackJobReviewMutation.isPending || !rollbackJobReviewDialog}
            >
              {requestRollbackJobReviewMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Submeter para revisao
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(rollbackJobApprovalDialog)}
        onOpenChange={(open) => (!open ? closeRollbackJobApprovalDialog() : null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Aprovar rollback em lote</DialogTitle>
            <DialogDescription>
              Fecha a revisao faseada e liberta o job para o worker dedicado.
            </DialogDescription>
          </DialogHeader>

          {rollbackJobApprovalDialog && rollbackJobApproval ? (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Itens</CardDescription>
                    <CardTitle className="text-lg">
                      {rollbackJobApprovalDialog.job.progress.requested}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Risco ativo</CardDescription>
                    <CardTitle className="text-lg">
                      {rollbackJobApproval.riskSummary.activeRiskCount}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Criticos</CardDescription>
                    <CardTitle className="text-lg">
                      {rollbackJobApproval.riskSummary.criticalRiskCount}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <div className="rounded-md border border-border/70 bg-muted/20 p-3 text-sm text-muted-foreground">
                Repor visibilidade: {rollbackJobApproval.riskSummary.restoreVisibleCount} | false
                positive elegiveis {rollbackJobApproval.riskSummary.falsePositiveEligibleCount}
                {rollbackJobApproval.reviewNote ? (
                  <p className="mt-2 text-xs">Nota de revisao: {rollbackJobApproval.reviewNote}</p>
                ) : null}
              </div>

              {rollbackJobApproval.sampleRequired ? (
                <div className="rounded-md border border-border/70 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Amostra obrigatoria
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Revistos {rollbackJobReviewedSampleKeys.length}/
                    {rollbackJobApproval.sampleItems.length} itens recomendados.
                  </p>

                  <div className="mt-3 space-y-3">
                    {rollbackJobApproval.sampleItems.map((item) => {
                      const sampleKey = jobApprovalSampleKey(item)
                      const checked = rollbackJobReviewedSampleKeys.includes(sampleKey)

                      return (
                        <label
                          key={sampleKey}
                          className="flex gap-3 rounded-md border border-border/70 p-3 text-sm"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() => toggleRollbackJobSample(item)}
                          />
                          <div className="space-y-1">
                            <p className="font-medium">
                              {item.title} <span className="text-xs">({item.contentType})</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Target {MODERATION_STATUS_LABEL[item.targetStatus]} | reports{' '}
                              {item.openReports} | reporters {item.uniqueReporters} | auto{' '}
                              {item.automatedSeverity} | creator risk{' '}
                              {item.creatorRiskLevel ?? 'n/a'}
                            </p>
                            {item.warnings.length > 0 ? (
                              <p className="text-xs text-amber-700">{item.warnings.join(' | ')}</p>
                            ) : null}
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>
              ) : null}

              {rollbackJobApproval.falsePositiveValidationRequired ? (
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox
                    checked={rollbackJobFalsePositiveValidated}
                    onCheckedChange={(checked) =>
                      setRollbackJobFalsePositiveValidated(checked === true)
                    }
                  />
                  Confirmo a validacao manual dos false positives deste lote
                </label>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="admin-content-job-approval-note">
                  Nota de aprovacao (opcional)
                </Label>
                <Textarea
                  id="admin-content-job-approval-note"
                  rows={4}
                  value={rollbackJobApprovalNote}
                  onChange={(event) => setRollbackJobApprovalNote(event.target.value)}
                  placeholder="Decisao tomada, amostra revista e guardrails observados."
                />
              </div>

              {rollbackJobApprovalRequiresConfirm ? (
                <div className="space-y-2">
                  <Label htmlFor="admin-content-job-approval-confirm">
                    Confirmacao dupla (escreve {DOUBLE_CONFIRM_TOKEN})
                  </Label>
                  <Input
                    id="admin-content-job-approval-confirm"
                    value={rollbackJobApprovalConfirmText}
                    onChange={(event) => setRollbackJobApprovalConfirmText(event.target.value)}
                    placeholder={DOUBLE_CONFIRM_TOKEN}
                  />
                  <p className="text-xs text-amber-700">
                    Este lote tem thresholds criticos e so pode seguir com confirmacao forte.
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => closeRollbackJobApprovalDialog()}
              disabled={approveRollbackJobMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={submitRollbackJobApproval}
              disabled={
                approveRollbackJobMutation.isPending ||
                !rollbackJobApprovalDialog ||
                !areRollbackJobSamplesComplete ||
                !isRollbackJobApprovalConfirmValid ||
                Boolean(
                  rollbackJobApproval?.falsePositiveValidationRequired &&
                    !rollbackJobFalsePositiveValidated,
                )
              }
            >
              {approveRollbackJobMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Aprovar e libertar job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(bulkDialog)}
        onOpenChange={(open) => (!open ? closeBulkDialog() : null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Criar job assíncrono de moderacao</DialogTitle>
            <DialogDescription>
              O lote corre em background e fica visivel na lista de jobs recentes.
            </DialogDescription>
          </DialogHeader>

          {bulkDialog ? (
            <div className="space-y-4">
              <div className="rounded-md border border-border/70 bg-muted/20 p-3 text-sm">
                {bulkDialog.items.length} item(ns) selecionado(s) nesta pagina.
              </div>

              <div className="space-y-2">
                <Label>Acao</Label>
                <Select
                  value={bulkAction}
                  onValueChange={(value) => {
                    const nextAction = value as ContentActionKind
                    setBulkAction(nextAction)
                    setBulkTemplateCode(TEMPLATE_NONE_VALUE)
                    setBulkReason(DEFAULT_ACTION_REASON[nextAction])
                    setBulkNote('')
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleciona acao" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hide">Ocultar</SelectItem>
                    <SelectItem value="restrict">Restringir</SelectItem>
                    <SelectItem value="unhide">Reativar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Template de moderacao</Label>
                <Select value={bulkTemplateCode} onValueChange={applyBulkTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleciona template (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TEMPLATE_NONE_VALUE}>Manual (sem template)</SelectItem>
                    {bulkTemplates.map((template) => (
                      <SelectItem key={template.code} value={template.code}>
                        {template.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {moderationTemplatesQuery.isLoading ? (
                  <p className="text-xs text-muted-foreground">A carregar templates...</p>
                ) : moderationTemplatesQuery.isError ? (
                  <p className="text-xs text-destructive">
                    {getErrorMessage(moderationTemplatesQuery.error)}
                  </p>
                ) : selectedBulkTemplate ? (
                  <p className="text-xs text-muted-foreground">
                    Template <span className="font-medium">{selectedBulkTemplate.code}</span>:
                    motivo/nota auto-preenchidos.
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Opcional: aplicar template para padronizar o lote.
                  </p>
                )}
              </div>

              {bulkAction === 'unhide' ? (
                <div className="space-y-2">
                  <Label htmlFor="admin-content-bulk-scheduled-for">
                    Agendar reativacao (opcional)
                  </Label>
                  <Input
                    id="admin-content-bulk-scheduled-for"
                    type="datetime-local"
                    value={bulkScheduledFor}
                    onChange={(event) => setBulkScheduledFor(event.target.value)}
                    className={
                      bulkScheduledForError
                        ? 'border-destructive focus-visible:ring-destructive'
                        : undefined
                    }
                  />
                  {bulkScheduledForError ? (
                    <p className="text-xs text-destructive">{bulkScheduledForError}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Se vazio, o job unhide corre imediatamente. Se preenchido, fica em fila
                      agendada.
                    </p>
                  )}
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="admin-content-bulk-reason">Motivo</Label>
                <Input
                  id="admin-content-bulk-reason"
                  value={bulkReason}
                  onChange={(event) => setBulkReason(event.target.value)}
                  placeholder="Motivo operacional para o job"
                  className={
                    bulkReasonError
                      ? 'border-destructive focus-visible:ring-destructive'
                      : undefined
                  }
                />
                {bulkReasonError ? (
                  <p className="text-xs text-destructive">{bulkReasonError}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-content-bulk-note">Nota operacional</Label>
                <Textarea
                  id="admin-content-bulk-note"
                  rows={4}
                  value={bulkNote}
                  onChange={(event) => setBulkNote(event.target.value)}
                  placeholder="Contexto do lote, referencia de incidente ou janela operacional."
                  className={
                    bulkNoteError ? 'border-destructive focus-visible:ring-destructive' : undefined
                  }
                />
                {bulkNoteError ? (
                  <p className="text-xs text-destructive">{bulkNoteError}</p>
                ) : selectedBulkTemplate?.requiresNote ? (
                  <p className="text-xs text-muted-foreground">
                    Este template exige nota antes de criar o job.
                  </p>
                ) : null}
              </div>

              {bulkRequiresDoubleConfirm ? (
                <div className="space-y-2">
                  <Label htmlFor="admin-content-bulk-confirm">
                    Confirmacao dupla (escreve {DOUBLE_CONFIRM_TOKEN})
                  </Label>
                  <Input
                    id="admin-content-bulk-confirm"
                    value={bulkConfirmText}
                    onChange={(event) => setBulkConfirmText(event.target.value)}
                    placeholder={DOUBLE_CONFIRM_TOKEN}
                    className={
                      bulkConfirmError
                        ? 'border-destructive focus-visible:ring-destructive'
                        : undefined
                    }
                  />
                  {bulkConfirmError ? (
                    <p className="text-xs text-destructive">{bulkConfirmError}</p>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => closeBulkDialog()}
              disabled={bulkJobMutation.isPending}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={submitBulkJob} disabled={!canSubmitBulk}>
              {bulkJobMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Criar job
            </Button>
          </DialogFooter>
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
