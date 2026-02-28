import { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2, RefreshCcw, Search, ShieldAlert, Sparkles, Users } from 'lucide-react'
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
import { getErrorMessage } from '@/lib/api/client'
import { cn } from '@/lib/utils'
import {
  CreatorControlsSummary,
  RiskLevelBadge,
  TrustRecommendationBadge,
  TrustReasonList,
  TrustScoreBar,
} from '../components/RiskSignals'
import {
  useAdminUserTrustProfile,
  useAdminUsers,
  useApplyAdminCreatorControls,
} from '../hooks/useAdminUsers'
import { adminUsersService } from '../services/adminUsersService'
import type {
  AdminCreatorControlAction,
  AdminUserListQuery,
  AdminUserRecord,
  CreatorRiskLevel,
  CreatorTrustRecommendedAction,
} from '../types/adminUsers'

type RiskFilter = CreatorRiskLevel | 'all'
type ControlFilter = 'all' | 'active' | 'none'
type RecommendationFilter = CreatorTrustRecommendedAction | 'all' | 'intervention'
type SortMode = 'risk' | 'score' | 'reports' | 'updated'
type DeepLinkView = 'trust' | 'controls'

interface FilterState {
  search: string
  riskLevel: RiskFilter
  controls: ControlFilter
  recommendation: RecommendationFilter
  sortBy: SortMode
}

interface CurrentAdminMeta {
  adminReadOnly?: boolean
  adminScopes?: string[]
}

interface FocusContext {
  creatorId: string | null
  view: DeepLinkView | null
  source: string | null
  contentId: string | null
  contentType: string | null
}

const PAGE_SIZE = 50

const INITIAL_FILTERS: FilterState = {
  search: '',
  riskLevel: 'all',
  controls: 'all',
  recommendation: 'intervention',
  sortBy: 'risk',
}

const CREATOR_CONTROL_ACTION_LABEL: Record<AdminCreatorControlAction, string> = {
  set_cooldown: 'Aplicar cooldown',
  clear_cooldown: 'Limpar cooldown',
  block_creation: 'Bloquear criacao',
  unblock_creation: 'Desbloquear criacao',
  block_publishing: 'Bloquear publicacao',
  unblock_publishing: 'Desbloquear publicacao',
  suspend_creator_ops: 'Suspender operacao',
  restore_creator_ops: 'Restaurar operacao',
}

const CREATOR_CONTROL_REASON_DEFAULT: Record<AdminCreatorControlAction, string> = {
  set_cooldown: 'Cooldown operacional preventivo',
  clear_cooldown: 'Cooldown limpo apos revisao',
  block_creation: 'Criacao bloqueada por risco operacional',
  unblock_creation: 'Criacao restaurada apos revisao',
  block_publishing: 'Publicacao bloqueada por risco de moderacao',
  unblock_publishing: 'Publicacao restaurada apos revisao',
  suspend_creator_ops: 'Suspensao operacional do creator por risco elevado',
  restore_creator_ops: 'Operacao do creator restaurada apos revisao',
}

const RISK_ORDER: Record<CreatorRiskLevel, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
}

const RECOMMENDATION_ORDER: Record<CreatorTrustRecommendedAction, number> = {
  suspend_creator_ops: 0,
  block_publishing: 1,
  set_cooldown: 2,
  review: 3,
  none: 4,
}

const EMPTY_FOCUS_CONTEXT: FocusContext = {
  creatorId: null,
  view: null,
  source: null,
  contentId: null,
  contentType: null,
}

const parseDeepLinkView = (value: string | null): DeepLinkView | null => {
  if (value === 'trust' || value === 'controls') return value
  return null
}

const readFocusContextFromParams = (params: URLSearchParams): FocusContext => ({
  creatorId: params.get('creatorId'),
  view: parseDeepLinkView(params.get('view')),
  source: params.get('source'),
  contentId: params.get('contentId'),
  contentType: params.get('contentType'),
})

const readFocusContext = (): FocusContext => {
  if (typeof window === 'undefined') return EMPTY_FOCUS_CONTEXT
  return readFocusContextFromParams(new URLSearchParams(window.location.search))
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

const hasActiveControls = (user: AdminUserRecord): boolean =>
  user.creatorControls.creationBlocked ||
  user.creatorControls.publishingBlocked ||
  Boolean(user.creatorControls.cooldownUntil)

const needsIntervention = (user: AdminUserRecord): boolean =>
  hasActiveControls(user) ||
  user.trustSignals?.recommendedAction === 'set_cooldown' ||
  user.trustSignals?.recommendedAction === 'block_publishing' ||
  user.trustSignals?.recommendedAction === 'suspend_creator_ops'

const toCreatorQuery = (filters: FilterState, page: number): AdminUserListQuery => {
  const query: AdminUserListQuery = {
    role: 'creator',
    page,
    limit: PAGE_SIZE,
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  }

  if (filters.search.trim().length > 0) query.search = filters.search.trim()

  return query
}

export default function CreatorsRiskBoardPage() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS)
  const [queryFilters, setQueryFilters] = useState<FilterState>(INITIAL_FILTERS)
  const [page, setPage] = useState(1)
  const [selectedCreatorIds, setSelectedCreatorIds] = useState<string[]>([])
  const [focusContext, setFocusContext] = useState<FocusContext>(() => readFocusContext())
  const focusedCreatorId = focusContext.creatorId
  const focusedView = focusContext.view
  const focusSource = focusContext.source
  const focusContentId = focusContext.contentId
  const focusContentType = focusContext.contentType
  const [trustDialogUserId, setTrustDialogUserId] = useState<string | null>(null)
  const [creatorControlDialogUser, setCreatorControlDialogUser] = useState<AdminUserRecord | null>(
    null,
  )
  const [creatorControlAction, setCreatorControlAction] =
    useState<AdminCreatorControlAction>('set_cooldown')
  const [creatorControlReason, setCreatorControlReason] = useState(
    CREATOR_CONTROL_REASON_DEFAULT.set_cooldown,
  )
  const [creatorControlNote, setCreatorControlNote] = useState('')
  const [creatorControlCooldownHours, setCreatorControlCooldownHours] = useState('24')
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false)
  const [bulkAction, setBulkAction] = useState<AdminCreatorControlAction>('set_cooldown')
  const [bulkReason, setBulkReason] = useState(CREATOR_CONTROL_REASON_DEFAULT.set_cooldown)
  const [bulkNote, setBulkNote] = useState('')
  const [bulkCooldownHours, setBulkCooldownHours] = useState('24')
  const [bulkPending, setBulkPending] = useState(false)
  const rawAuthUser = useAuthStore((state) => state.user)
  const authUser = (rawAuthUser as unknown as CurrentAdminMeta | null) ?? null
  const queryClient = useQueryClient()
  const canReadUsers = useMemo(() => {
    if (!authUser) return false
    if (!Array.isArray(authUser.adminScopes) || authUser.adminScopes.length === 0) return true
    return authUser.adminScopes.includes('admin.users.read')
  }, [authUser])
  const canWriteUsers = useMemo(() => {
    if (!authUser) return false
    if (authUser.adminReadOnly) return false
    if (!Array.isArray(authUser.adminScopes) || authUser.adminScopes.length === 0) return true
    return authUser.adminScopes.includes('admin.users.write')
  }, [authUser])
  const creatorsQuery = useAdminUsers(
    useMemo(() => toCreatorQuery(queryFilters, page), [queryFilters, page]),
    {
      enabled: canReadUsers,
    },
  )
  const focusProfileQuery = useAdminUserTrustProfile(focusedCreatorId)
  const trustDialogQuery = useAdminUserTrustProfile(trustDialogUserId)
  const creatorControlMutation = useApplyAdminCreatorControls()

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const syncFocusContext = () => {
      setFocusContext(readFocusContext())
    }

    syncFocusContext()
    window.addEventListener('popstate', syncFocusContext)

    return () => {
      window.removeEventListener('popstate', syncFocusContext)
    }
  }, [])

  useEffect(() => {
    if (!focusedCreatorId || !focusedView) return
    if (focusedView === 'trust') {
      setTrustDialogUserId(focusedCreatorId)
      return
    }
    if (focusedView === 'controls' && canWriteUsers && focusProfileQuery.data?.user) {
      setCreatorControlDialogUser(focusProfileQuery.data.user)
    }
  }, [canWriteUsers, focusedCreatorId, focusedView, focusProfileQuery.data])

  const visibleCreators = useMemo(() => {
    const items = creatorsQuery.data?.items ?? []
    const filtered = items.filter((user) => {
      const riskLevel = user.trustSignals?.riskLevel ?? 'low'
      const recommendation = user.trustSignals?.recommendedAction ?? 'none'
      const userHasActiveControls = hasActiveControls(user)
      if (filters.riskLevel !== 'all' && riskLevel !== filters.riskLevel) return false
      if (filters.controls === 'active' && !userHasActiveControls) return false
      if (filters.controls === 'none' && userHasActiveControls) return false
      if (
        filters.recommendation === 'intervention' &&
        recommendation === 'none' &&
        !userHasActiveControls
      ) {
        return false
      }
      if (
        filters.recommendation !== 'all' &&
        filters.recommendation !== 'intervention' &&
        recommendation !== filters.recommendation
      ) {
        return false
      }
      return true
    })
    filtered.sort((a, b) => {
      const aSignals = a.trustSignals
      const bSignals = b.trustSignals
      if (filters.sortBy === 'score') {
        return (aSignals?.trustScore ?? 100) - (bSignals?.trustScore ?? 100)
      }
      if (filters.sortBy === 'reports') {
        const aPressure =
          (aSignals?.summary.criticalTargets ?? 0) * 100 + (aSignals?.summary.openReports ?? 0)
        const bPressure =
          (bSignals?.summary.criticalTargets ?? 0) * 100 + (bSignals?.summary.openReports ?? 0)
        return bPressure - aPressure
      }
      if (filters.sortBy === 'updated') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }
      const riskDelta =
        RISK_ORDER[aSignals?.riskLevel ?? 'low'] - RISK_ORDER[bSignals?.riskLevel ?? 'low']
      if (riskDelta !== 0) return riskDelta
      const recommendationDelta =
        RECOMMENDATION_ORDER[aSignals?.recommendedAction ?? 'none'] -
        RECOMMENDATION_ORDER[bSignals?.recommendedAction ?? 'none']
      if (recommendationDelta !== 0) return recommendationDelta
      return (aSignals?.trustScore ?? 100) - (bSignals?.trustScore ?? 100)
    })
    return filtered
  }, [
    creatorsQuery.data?.items,
    filters.controls,
    filters.recommendation,
    filters.riskLevel,
    filters.sortBy,
  ])

  useEffect(() => {
    setSelectedCreatorIds((prev) =>
      prev.filter((id) => visibleCreators.some((user) => user.id === id)),
    )
  }, [visibleCreators])

  const visibleCreatorIds = useMemo(() => visibleCreators.map((user) => user.id), [visibleCreators])
  const allVisibleSelected =
    visibleCreatorIds.length > 0 && visibleCreatorIds.every((id) => selectedCreatorIds.includes(id))
  const partiallySelected =
    selectedCreatorIds.length > 0 && !allVisibleSelected && visibleCreatorIds.length > 0
  const creatorsWithIntervention = visibleCreators.filter((user) => needsIntervention(user)).length
  const creatorsWithCriticalRisk = visibleCreators.filter(
    (user) => user.trustSignals?.riskLevel === 'critical',
  ).length
  const creatorsWithActiveControls = visibleCreators.filter((user) =>
    hasActiveControls(user),
  ).length
  const creatorsWithOpenReports = visibleCreators.filter(
    (user) => (user.trustSignals?.summary.openReports ?? 0) > 0,
  ).length
  const focusedCreatorInList = visibleCreators.find((user) => user.id === focusedCreatorId) ?? null
  const focusedCreatorCard = focusedCreatorInList ?? focusProfileQuery.data?.user ?? null

  const applyFocusContextToUrl = (next: URLSearchParams) => {
    if (typeof window !== 'undefined') {
      const nextQuery = next.toString()
      const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ''}${window.location.hash}`
      window.history.replaceState(window.history.state, '', nextUrl)
    }

    setFocusContext(readFocusContextFromParams(next))
  }

  const updateSearchContext = (creatorId: string | null, view: DeepLinkView | null) => {
    const next =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams()
    if (creatorId) next.set('creatorId', creatorId)
    else next.delete('creatorId')
    if (view) next.set('view', view)
    else next.delete('view')
    if (!creatorId) {
      next.delete('source')
      next.delete('contentId')
      next.delete('contentType')
    } else if (!focusedCreatorId || creatorId !== focusedCreatorId) {
      next.delete('source')
      next.delete('contentId')
      next.delete('contentType')
    }
    applyFocusContextToUrl(next)
  }

  const clearFocusContext = () => {
    const next =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams()
    next.delete('creatorId')
    next.delete('view')
    next.delete('source')
    next.delete('contentId')
    next.delete('contentType')
    applyFocusContextToUrl(next)
    setTrustDialogUserId(null)
    setCreatorControlDialogUser(null)
  }

  const openTrustProfile = (creatorId: string) => {
    setTrustDialogUserId(creatorId)
    updateSearchContext(creatorId, 'trust')
  }

  const closeTrustProfile = () => {
    setTrustDialogUserId(null)
    updateSearchContext(focusedCreatorId, null)
  }

  const openCreatorControls = (user: AdminUserRecord) => {
    const recommendedAction =
      user.trustSignals?.recommendedAction === 'set_cooldown' ||
      user.trustSignals?.recommendedAction === 'block_publishing' ||
      user.trustSignals?.recommendedAction === 'suspend_creator_ops'
        ? user.trustSignals.recommendedAction
        : 'set_cooldown'
    setCreatorControlAction(recommendedAction)
    setCreatorControlReason(CREATOR_CONTROL_REASON_DEFAULT[recommendedAction])
    setCreatorControlNote('')
    setCreatorControlCooldownHours('24')
    setCreatorControlDialogUser(user)
    updateSearchContext(user.id, 'controls')
  }

  const closeCreatorControls = () => {
    setCreatorControlDialogUser(null)
    updateSearchContext(focusedCreatorId, null)
  }

  const toggleCreatorSelection = (creatorId: string) => {
    setSelectedCreatorIds((prev) =>
      prev.includes(creatorId) ? prev.filter((id) => id !== creatorId) : [...prev, creatorId],
    )
  }

  const toggleSelectVisible = () => {
    if (allVisibleSelected) {
      setSelectedCreatorIds((prev) => prev.filter((id) => !visibleCreatorIds.includes(id)))
      return
    }
    setSelectedCreatorIds((prev) => Array.from(new Set([...prev, ...visibleCreatorIds])))
  }

  const handleSingleCreatorControl = async () => {
    if (!creatorControlDialogUser) return
    const payload = {
      action: creatorControlAction,
      reason: creatorControlReason.trim() || CREATOR_CONTROL_REASON_DEFAULT[creatorControlAction],
      note: creatorControlNote.trim() || undefined,
      cooldownHours:
        creatorControlAction === 'set_cooldown'
          ? Math.max(Number.parseInt(creatorControlCooldownHours, 10) || 24, 1)
          : undefined,
    }
    try {
      const result = await creatorControlMutation.mutateAsync({
        userId: creatorControlDialogUser.id,
        payload,
      })
      toast.success(result.message)
      closeCreatorControls()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleBulkControls = async () => {
    if (selectedCreatorIds.length === 0) {
      toast.error('Seleciona pelo menos um creator.')
      return
    }
    const payload = {
      action: bulkAction,
      reason: bulkReason.trim() || CREATOR_CONTROL_REASON_DEFAULT[bulkAction],
      note: bulkNote.trim() || undefined,
      cooldownHours:
        bulkAction === 'set_cooldown'
          ? Math.max(Number.parseInt(bulkCooldownHours, 10) || 24, 1)
          : undefined,
    }
    setBulkPending(true)
    try {
      const results = await Promise.allSettled(
        selectedCreatorIds.map((userId) => adminUsersService.applyCreatorControls(userId, payload)),
      )
      const successCount = results.filter((result) => result.status === 'fulfilled').length
      const failed = results.filter((result) => result.status === 'rejected')
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'queue'] }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'metrics', 'overview'] }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'alerts', 'internal'] }),
        ...(focusedCreatorId
          ? [
              queryClient.invalidateQueries({
                queryKey: ['admin', 'users', 'trust-profile', focusedCreatorId],
              }),
            ]
          : []),
      ])
      if (successCount > 0) {
        toast.success(
          `${successCount} creator${successCount > 1 ? 'es' : ''} atualizado${successCount > 1 ? 's' : ''}.`,
        )
      }
      if (failed.length > 0) {
        toast.error(
          `${failed.length} falha${failed.length > 1 ? 's' : ''} no lote. ${getErrorMessage(
            failed[0].status === 'rejected' ? failed[0].reason : 'Erro desconhecido.',
          )}`,
        )
      }
      if (successCount > 0) {
        setBulkDialogOpen(false)
        setSelectedCreatorIds([])
        setBulkNote('')
      }
    } finally {
      setBulkPending(false)
    }
  }

  if (!canReadUsers) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Acesso insuficiente</CardTitle>
          <CardDescription>Este modulo requer permissao `admin.users.read`.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Board operacional de creators
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Creators - risco e triagem</h1>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Vista dedicada para creators com pressao de reports, trust score fragil e controlos
            operacionais ativos.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => creatorsQuery.refetch()}>
            <RefreshCcw className="h-4 w-4" />
            Atualizar
          </Button>
          <Button asChild type="button" variant="outline">
            <a href="/admin/conteudo">
              <ShieldAlert className="h-4 w-4" />
              Ir para moderacao
            </a>
          </Button>
        </div>
      </div>

      {focusedCreatorCard ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <CardTitle className="flex flex-wrap items-center gap-2">
                  <span>Contexto ativo</span>
                  {focusSource === 'content' ? (
                    <Badge variant="outline">Originado na queue de conteudo</Badge>
                  ) : null}
                </CardTitle>
                <CardDescription>
                  {focusedCreatorCard.name ||
                    focusedCreatorCard.username ||
                    focusedCreatorCard.email}
                  {focusContentType && focusContentId
                    ? ` | ${focusContentType} ${focusContentId}`
                    : ' | sem alvo de conteudo associado'}
                </CardDescription>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openTrustProfile(focusedCreatorCard.id)}
                >
                  Abrir trust profile
                </Button>
                {canWriteUsers ? (
                  <Button type="button" onClick={() => openCreatorControls(focusedCreatorCard)}>
                    Controlar creator
                  </Button>
                ) : null}
                <Button type="button" variant="ghost" onClick={clearFocusContext}>
                  Limpar contexto
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-border/70 bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Risco</p>
              {focusProfileQuery.isLoading ? (
                <p className="mt-3 text-sm text-muted-foreground">A carregar...</p>
              ) : focusProfileQuery.data?.trustSignals ? (
                <div className="mt-3 space-y-2">
                  <RiskLevelBadge
                    riskLevel={focusProfileQuery.data.trustSignals.riskLevel}
                    score={focusProfileQuery.data.trustSignals.trustScore}
                  />
                  <TrustScoreBar value={focusProfileQuery.data.trustSignals.trustScore} />
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">Sem trust profile disponivel.</p>
              )}
            </div>
            <div className="rounded-xl border border-border/70 bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Reports abertos
              </p>
              <p className="mt-3 text-2xl font-semibold">
                {focusProfileQuery.data?.trustSignals?.summary.openReports ?? 0}
              </p>
            </div>
            <div className="rounded-xl border border-border/70 bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Targets criticos
              </p>
              <p className="mt-3 text-2xl font-semibold">
                {focusProfileQuery.data?.trustSignals?.summary.criticalTargets ?? 0}
              </p>
            </div>
            <div className="rounded-xl border border-border/70 bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Barreiras ativas
              </p>
              <div className="mt-3">
                <CreatorControlsSummary
                  controls={
                    focusProfileQuery.data?.user.creatorControls ??
                    focusedCreatorCard.creatorControls
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Creators no lote atual</CardDescription>
            <CardTitle>{visibleCreators.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Precisam intervencao</CardDescription>
            <CardTitle>{creatorsWithIntervention}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Risco critico</CardDescription>
            <CardTitle>{creatorsWithCriticalRisk}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Controls ativos</CardDescription>
            <CardTitle>{creatorsWithActiveControls}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Com reports abertos</CardDescription>
            <CardTitle>{creatorsWithOpenReports}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros operacionais</CardTitle>
          <CardDescription>
            Pesquisa server-side por creator e triagem local por risco, recomendacao e barreiras.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="space-y-2 xl:col-span-2">
            <Label htmlFor="creator-board-search">Pesquisa</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="creator-board-search"
                value={filters.search}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, search: event.target.value }))
                }
                className="pl-9"
                placeholder="Nome, username ou email do creator"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Nivel de risco</Label>
            <Select
              value={filters.riskLevel}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, riskLevel: value as FilterState['riskLevel'] }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="critical">Critico</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Barreiras</Label>
            <Select
              value={filters.controls}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, controls: value as FilterState['controls'] }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="active">Com barreiras</SelectItem>
                <SelectItem value="none">Sem barreiras</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Recomendacao</Label>
            <Select
              value={filters.recommendation}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  recommendation: value as FilterState['recommendation'],
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Intervencao" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="intervention">Precisam intervencao</SelectItem>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="set_cooldown">Cooldown</SelectItem>
                <SelectItem value="block_publishing">Block publishing</SelectItem>
                <SelectItem value="suspend_creator_ops">Suspender</SelectItem>
                <SelectItem value="none">Sem acao</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Ordenacao</Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, sortBy: value as FilterState['sortBy'] }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Por risco" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="risk">Por risco</SelectItem>
                <SelectItem value="score">Por trust score</SelectItem>
                <SelectItem value="reports">Por pressao de reports</SelectItem>
                <SelectItem value="updated">Mais recentes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2 md:col-span-2 xl:col-span-5">
            <Button
              type="button"
              onClick={() => {
                setPage(1)
                setQueryFilters(filters)
              }}
            >
              <Sparkles className="h-4 w-4" />
              Aplicar filtros
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFilters(INITIAL_FILTERS)
                setQueryFilters(INITIAL_FILTERS)
                setPage(1)
              }}
            >
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {canWriteUsers && selectedCreatorIds.length > 0 ? (
        <Card className="border-amber-500/30 bg-amber-50/60">
          <CardContent className="flex flex-col gap-3 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium">
                {selectedCreatorIds.length} creator{selectedCreatorIds.length > 1 ? 'es' : ''}{' '}
                selecionado{selectedCreatorIds.length > 1 ? 's' : ''}
              </p>
              <p className="text-xs text-muted-foreground">
                Acoes em lote usam o endpoint individual existente e mantem rastreabilidade por
                user.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => setSelectedCreatorIds([])}>
                Limpar selecao
              </Button>
              <Button type="button" onClick={() => setBulkDialogOpen(true)}>
                <Users className="h-4 w-4" />
                Acao em lote
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Fila de creators</CardTitle>
          <CardDescription>
            O foco aqui e triagem rapida: risco, pressao de reports, controlos e abertura do trust
            profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {creatorsQuery.isLoading ? (
            <div className="flex items-center gap-2 rounded-lg border border-dashed border-border/70 px-4 py-6 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />A carregar creators...
            </div>
          ) : creatorsQuery.isError ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-6 text-sm text-destructive">
              {getErrorMessage(creatorsQuery.error)}
            </div>
          ) : visibleCreators.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border/70 px-4 py-8 text-center text-sm text-muted-foreground">
              Nenhum creator para os filtros atuais.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {canWriteUsers ? (
                        <TableHead className="w-12">
                          <Checkbox
                            aria-label="Selecionar creators visiveis"
                            checked={
                              allVisibleSelected
                                ? true
                                : partiallySelected
                                  ? 'indeterminate'
                                  : false
                            }
                            onCheckedChange={toggleSelectVisible}
                          />
                        </TableHead>
                      ) : null}
                      <TableHead>Creator</TableHead>
                      <TableHead>Trust</TableHead>
                      <TableHead>Pressao</TableHead>
                      <TableHead>Controls</TableHead>
                      <TableHead>Acoes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleCreators.map((user) => {
                      const isFocused = user.id === focusedCreatorId
                      const userNeedsIntervention = needsIntervention(user)
                      return (
                        <TableRow key={user.id} className={cn(isFocused && 'bg-primary/5')}>
                          {canWriteUsers ? (
                            <TableCell>
                              <Checkbox
                                aria-label={`Selecionar creator ${user.username}`}
                                checked={selectedCreatorIds.includes(user.id)}
                                onCheckedChange={() => toggleCreatorSelection(user.id)}
                              />
                            </TableCell>
                          ) : null}
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-medium">{user.name || user.username}</p>
                                {isFocused ? <Badge variant="outline">Em foco</Badge> : null}
                                {userNeedsIntervention ? (
                                  <Badge
                                    variant="outline"
                                    className="border-amber-500/40 text-amber-700"
                                  >
                                    Intervencao
                                  </Badge>
                                ) : null}
                              </div>
                              <p className="text-xs text-muted-foreground">@{user.username}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.trustSignals ? (
                              <div className="space-y-2">
                                <div className="flex flex-wrap gap-1.5">
                                  <RiskLevelBadge
                                    riskLevel={user.trustSignals.riskLevel}
                                    score={user.trustSignals.trustScore}
                                  />
                                  <TrustRecommendationBadge
                                    action={user.trustSignals.recommendedAction}
                                  />
                                </div>
                                <TrustScoreBar value={user.trustSignals.trustScore} compact />
                                <p className="text-xs text-muted-foreground">
                                  {user.trustSignals.reasons[0] ?? 'Sem sinais fortes.'}
                                </p>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                Sem trust profile calculado.
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1 text-xs">
                              <p>Reports: {user.trustSignals?.summary.openReports ?? 0}</p>
                              <p>High+: {user.trustSignals?.summary.highPriorityTargets ?? 0}</p>
                              <p>Criticos: {user.trustSignals?.summary.criticalTargets ?? 0}</p>
                              <p className="text-muted-foreground">
                                Atualizado: {formatDateTime(user.updatedAt)}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <CreatorControlsSummary controls={user.creatorControls} dense />
                              <p className="text-xs text-muted-foreground">
                                Score: {user.trustSignals?.trustScore ?? 100} / 100
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => openTrustProfile(user.id)}
                              >
                                Perfil
                              </Button>
                              {canWriteUsers ? (
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => openCreatorControls(user)}
                                >
                                  <ShieldAlert className="h-4 w-4" />
                                  Controlar
                                </Button>
                              ) : null}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col gap-3 border-t border-border/70 pt-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
                <p>
                  Pagina {creatorsQuery.data?.pagination.page ?? page} de{' '}
                  {creatorsQuery.data?.pagination.pages ?? 1} |{' '}
                  {creatorsQuery.data?.pagination.total ?? 0} creators no resultado bruto
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={(creatorsQuery.data?.pagination.page ?? 1) <= 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  >
                    Anterior
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={
                      (creatorsQuery.data?.pagination.page ?? 1) >=
                      (creatorsQuery.data?.pagination.pages ?? 1)
                    }
                    onClick={() =>
                      setPage((prev) =>
                        Math.min(prev + 1, creatorsQuery.data?.pagination.pages ?? prev + 1),
                      )
                    }
                  >
                    Seguinte
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(trustDialogUserId)}
        onOpenChange={(open) => {
          if (!open) closeTrustProfile()
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Trust profile creator</DialogTitle>
            <DialogDescription>
              Consolida reports, sinais de risco, historico de moderacao e barreiras ativas.
            </DialogDescription>
          </DialogHeader>

          {trustDialogQuery.isLoading ? (
            <div className="flex items-center gap-2 rounded-lg border border-dashed border-border/70 px-4 py-6 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />A carregar trust profile...
            </div>
          ) : trustDialogQuery.isError ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-6 text-sm text-destructive">
              {getErrorMessage(trustDialogQuery.error)}
            </div>
          ) : trustDialogQuery.data ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-xl border border-border/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Risco</p>
                  <div className="mt-3 space-y-2">
                    <RiskLevelBadge
                      riskLevel={trustDialogQuery.data.trustSignals?.riskLevel ?? 'low'}
                      score={trustDialogQuery.data.trustSignals?.trustScore ?? 100}
                    />
                    <TrustRecommendationBadge
                      action={trustDialogQuery.data.trustSignals?.recommendedAction ?? 'none'}
                    />
                  </div>
                </div>
                <div className="rounded-xl border border-border/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Reports abertos
                  </p>
                  <p className="mt-3 text-2xl font-semibold">
                    {trustDialogQuery.data.trustSignals?.summary.openReports ?? 0}
                  </p>
                </div>
                <div className="rounded-xl border border-border/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Targets criticos
                  </p>
                  <p className="mt-3 text-2xl font-semibold">
                    {trustDialogQuery.data.trustSignals?.summary.criticalTargets ?? 0}
                  </p>
                </div>
                <div className="rounded-xl border border-border/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Barreiras ativas
                  </p>
                  <div className="mt-3">
                    <CreatorControlsSummary controls={trustDialogQuery.data.user.creatorControls} />
                  </div>
                </div>
              </div>

              <Card>
                <CardContent className="space-y-4 pt-6">
                  <TrustScoreBar value={trustDialogQuery.data.trustSignals?.trustScore ?? 100} />
                  <TrustReasonList trustSignals={trustDialogQuery.data.trustSignals} maxItems={6} />
                </CardContent>
              </Card>

              <div className="flex justify-end">
                {canWriteUsers ? (
                  <Button
                    type="button"
                    onClick={() => {
                      closeTrustProfile()
                      openCreatorControls(trustDialogQuery.data.user)
                    }}
                  >
                    <ShieldAlert className="h-4 w-4" />
                    Aplicar controlo
                  </Button>
                ) : null}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(creatorControlDialogUser)}
        onOpenChange={(open) => {
          if (!open) closeCreatorControls()
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Controlo operacional do creator</DialogTitle>
            <DialogDescription>
              Aplica cooldown, bloqueios ou suspensao operacional com rastreabilidade.
            </DialogDescription>
          </DialogHeader>

          {creatorControlDialogUser ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">
                    {creatorControlDialogUser.name || creatorControlDialogUser.username}
                  </span>
                  {creatorControlDialogUser.trustSignals ? (
                    <>
                      <RiskLevelBadge
                        riskLevel={creatorControlDialogUser.trustSignals.riskLevel}
                        score={creatorControlDialogUser.trustSignals.trustScore}
                      />
                      <TrustRecommendationBadge
                        action={creatorControlDialogUser.trustSignals.recommendedAction}
                      />
                    </>
                  ) : null}
                </div>
                <div className="mt-3">
                  <CreatorControlsSummary controls={creatorControlDialogUser.creatorControls} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Acao</Label>
                  <Select
                    value={creatorControlAction}
                    onValueChange={(value) => {
                      const nextAction = value as AdminCreatorControlAction
                      setCreatorControlAction(nextAction)
                      setCreatorControlReason(CREATOR_CONTROL_REASON_DEFAULT[nextAction])
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleciona acao" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CREATOR_CONTROL_ACTION_LABEL).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="creator-control-cooldown">Cooldown horas</Label>
                  <Input
                    id="creator-control-cooldown"
                    type="number"
                    min={1}
                    disabled={creatorControlAction !== 'set_cooldown'}
                    value={creatorControlCooldownHours}
                    onChange={(event) => setCreatorControlCooldownHours(event.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="creator-control-reason">Motivo</Label>
                <Input
                  id="creator-control-reason"
                  value={creatorControlReason}
                  onChange={(event) => setCreatorControlReason(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="creator-control-note">Nota operacional</Label>
                <Textarea
                  id="creator-control-note"
                  rows={4}
                  value={creatorControlNote}
                  onChange={(event) => setCreatorControlNote(event.target.value)}
                  placeholder="Contexto complementar para auditoria interna"
                />
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeCreatorControls}>
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={creatorControlMutation.isPending}
              onClick={handleSingleCreatorControl}
            >
              {creatorControlMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShieldAlert className="h-4 w-4" />
              )}
              Aplicar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Acao em lote sobre creators</DialogTitle>
            <DialogDescription>
              Executa a mesma acao sobre o conjunto selecionado, com auditoria por creator.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-xl border border-border/70 bg-muted/30 p-4 text-sm">
              {selectedCreatorIds.length} creator{selectedCreatorIds.length > 1 ? 'es' : ''}{' '}
              selecionado{selectedCreatorIds.length > 1 ? 's' : ''}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Acao</Label>
                <Select
                  value={bulkAction}
                  onValueChange={(value) => {
                    const nextAction = value as AdminCreatorControlAction
                    setBulkAction(nextAction)
                    setBulkReason(CREATOR_CONTROL_REASON_DEFAULT[nextAction])
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleciona acao" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CREATOR_CONTROL_ACTION_LABEL).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bulk-creator-cooldown">Cooldown horas</Label>
                <Input
                  id="bulk-creator-cooldown"
                  type="number"
                  min={1}
                  disabled={bulkAction !== 'set_cooldown'}
                  value={bulkCooldownHours}
                  onChange={(event) => setBulkCooldownHours(event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bulk-creator-reason">Motivo</Label>
              <Input
                id="bulk-creator-reason"
                value={bulkReason}
                onChange={(event) => setBulkReason(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bulk-creator-note">Nota operacional</Label>
              <Textarea
                id="bulk-creator-note"
                rows={4}
                value={bulkNote}
                onChange={(event) => setBulkNote(event.target.value)}
                placeholder="Contexto para auditoria ou execucao do lote"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setBulkDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" disabled={bulkPending} onClick={handleBulkControls}>
              {bulkPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Users className="h-4 w-4" />
              )}
              Aplicar a {selectedCreatorIds.length}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
