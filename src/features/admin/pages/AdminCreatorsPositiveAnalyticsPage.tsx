import { useMemo, useState } from 'react'
import { Download, Loader2, RefreshCcw, Search, ShieldAlert, Sparkles } from 'lucide-react'
import { Link } from '@/lib/reactRouterDomCompat'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import type { User } from '@/features/auth/types'
import { getErrorMessage } from '@/lib/api/client'
import { cn } from '@/lib/utils'
import {
  useAdminCreatorPositiveAnalytics,
  useExportAdminCreatorPositiveAnalyticsCsv,
} from '../hooks/useAdminCreatorPositiveAnalytics'
import { hasAdminScope } from '../lib/access'
import type {
  AdminCreatorPositiveAnalyticsQuery,
  AdminCreatorPositiveSortBy,
  AdminCreatorPositiveSortOrder,
} from '../types/adminCreatorPositiveAnalytics'
import type {
  AdminUserAccountStatus,
  CreatorRiskLevel,
  CreatorTrustRecommendedAction,
} from '../types/adminUsers'

type AccountStatusFilter = AdminUserAccountStatus | 'all'
type RiskFilter = CreatorRiskLevel | 'all'

interface FilterState {
  search: string
  accountStatus: AccountStatusFilter
  riskLevel: RiskFilter
  sortBy: AdminCreatorPositiveSortBy
  sortOrder: AdminCreatorPositiveSortOrder
  windowDays: string
}

const PAGE_SIZE = 25

const INITIAL_FILTERS: FilterState = {
  search: '',
  accountStatus: 'all',
  riskLevel: 'all',
  sortBy: 'growth',
  sortOrder: 'desc',
  windowDays: '30',
}

const RISK_BADGE_VARIANT: Record<CreatorRiskLevel, 'secondary' | 'outline' | 'destructive'> = {
  low: 'secondary',
  medium: 'outline',
  high: 'outline',
  critical: 'destructive',
}

const RISK_LABEL: Record<CreatorRiskLevel, string> = {
  low: 'Baixo',
  medium: 'Medio',
  high: 'Elevado',
  critical: 'Critico',
}

const RECOMMENDED_ACTION_LABEL: Record<CreatorTrustRecommendedAction, string> = {
  none: 'Sem acao',
  review: 'Rever',
  set_cooldown: 'Aplicar cooldown',
  block_publishing: 'Bloquear publicacao',
  suspend_creator_ops: 'Suspender operacao',
}

const SORT_BY_LABEL: Record<AdminCreatorPositiveSortBy, string> = {
  growth: 'Growth score',
  engagement: 'Engagement score',
  followers: 'Followers',
  trust: 'Trust score',
}

const SORT_ORDER_LABEL: Record<AdminCreatorPositiveSortOrder, string> = {
  asc: 'Ascendente',
  desc: 'Descendente',
}

const toPositiveInt = (value: string, fallback: number): number => {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed < 1) return fallback
  return parsed
}

const formatNumber = (value: number, maximumFractionDigits = 0): string =>
  new Intl.NumberFormat('pt-PT', { maximumFractionDigits }).format(value)

const formatDecimal = (value: number, maximumFractionDigits = 2): string =>
  new Intl.NumberFormat('pt-PT', { maximumFractionDigits }).format(value)

const formatSignedNumber = (value: number, maximumFractionDigits = 0): string =>
  `${value > 0 ? '+' : ''}${formatDecimal(value, maximumFractionDigits)}`

const formatPercent = (value: number): string => `${formatDecimal(value, 2)}%`

const valueToneClass = (value: number): string =>
  value > 0
    ? 'text-emerald-600 dark:text-emerald-400'
    : value < 0
      ? 'text-red-500'
      : 'text-muted-foreground'

const formatDateTime = (value: string | null): string => {
  if (!value) return '-'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '-'
  return new Intl.DateTimeFormat('pt-PT', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(parsed)
}

const normalizeRecommendedAction = (value: CreatorTrustRecommendedAction | string): string => {
  if (value in RECOMMENDED_ACTION_LABEL) {
    return RECOMMENDED_ACTION_LABEL[value as CreatorTrustRecommendedAction]
  }
  return value
}

export default function AdminCreatorsPositiveAnalyticsPage() {
  const rawUser = useAuthStore((state) => state.user)
  const user = (rawUser as User | null) ?? null
  const canReadAnalytics = hasAdminScope(user, 'admin.metrics.read')

  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS)
  const [queryFilters, setQueryFilters] = useState<FilterState>(INITIAL_FILTERS)
  const [page, setPage] = useState(1)

  const query = useMemo<AdminCreatorPositiveAnalyticsQuery>(
    () => ({
      page,
      limit: PAGE_SIZE,
      search: queryFilters.search.trim() || undefined,
      accountStatus: queryFilters.accountStatus === 'all' ? undefined : queryFilters.accountStatus,
      riskLevel: queryFilters.riskLevel === 'all' ? undefined : queryFilters.riskLevel,
      sortBy: queryFilters.sortBy,
      sortOrder: queryFilters.sortOrder,
      windowDays: toPositiveInt(queryFilters.windowDays, 30),
    }),
    [page, queryFilters],
  )

  const analyticsQuery = useAdminCreatorPositiveAnalytics(query, { enabled: canReadAnalytics })
  const exportCsvMutation = useExportAdminCreatorPositiveAnalyticsCsv()

  const items = analyticsQuery.data?.items ?? []
  const pagination = analyticsQuery.data?.pagination
  const summary = analyticsQuery.data?.summary

  const applyFilters = () => {
    setQueryFilters(filters)
    setPage(1)
  }

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS)
    setQueryFilters(INITIAL_FILTERS)
    setPage(1)
  }

  const handleExportCsv = async () => {
    try {
      await exportCsvMutation.mutateAsync({
        search: query.search,
        accountStatus: query.accountStatus,
        riskLevel: query.riskLevel,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
        windowDays: query.windowDays,
        maxRows: 5000,
      })
      toast.success('Export CSV iniciado.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  if (!canReadAnalytics) {
    return (
      <Card className="border-destructive/40 bg-destructive/5">
        <CardContent className="flex items-start gap-3 pt-6">
          <ShieldAlert className="mt-0.5 h-4 w-4 text-destructive" />
          <div className="space-y-1 text-sm text-destructive">
            <p>Perfil atual sem escopo `admin.metrics.read`.</p>
            <p className="text-xs text-destructive/80">
              Este painel de creators exige permissao de metrics para leitura e export.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Curadoria de creators
        </div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Analytics positivos de creators
            </h1>
            <p className="max-w-3xl text-sm text-muted-foreground">
              Leaderboard por crescimento/engagement com trust lado a lado para decisoes editoriais.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" asChild>
              <Link to="/admin/creators">Risk board</Link>
            </Button>
            <Button type="button" size="sm" asChild>
              <Link to="/admin/creators/analytics">Analytics positivos</Link>
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumo do ranking</CardTitle>
          <CardDescription>Medias agregadas para o conjunto filtrado.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-md border border-border/70 p-3">
            <p className="text-xs text-muted-foreground">Creators</p>
            <p className="text-lg font-semibold">{formatNumber(summary?.totalCreators ?? 0)}</p>
          </div>
          <div className="rounded-md border border-border/70 p-3">
            <p className="text-xs text-muted-foreground">Avg growth score</p>
            <p className="text-lg font-semibold">{formatDecimal(summary?.avgGrowthScore ?? 0)}</p>
          </div>
          <div className="rounded-md border border-border/70 p-3">
            <p className="text-xs text-muted-foreground">Avg engagement score</p>
            <p className="text-lg font-semibold">
              {formatDecimal(summary?.avgEngagementScore ?? 0)}
            </p>
          </div>
          <div className="rounded-md border border-border/70 p-3">
            <p className="text-xs text-muted-foreground">Avg trust score</p>
            <p className="text-lg font-semibold">{formatDecimal(summary?.avgTrustScore ?? 0)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filtros e ordenacao</CardTitle>
          <CardDescription>
            Pesquisa, risco, estado e janela temporal para rankear creators.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
            <div className="xl:col-span-2">
              <Label htmlFor="creator-positive-search">Pesquisa</Label>
              <Input
                id="creator-positive-search"
                value={filters.search}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, search: event.target.value }))
                }
                placeholder="Nome, username ou email"
              />
            </div>

            <div>
              <Label>Estado conta</Label>
              <Select
                value={filters.accountStatus}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, accountStatus: value as AccountStatusFilter }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativa</SelectItem>
                  <SelectItem value="suspended">Suspensa</SelectItem>
                  <SelectItem value="banned">Banida</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Nivel de risco</Label>
              <Select
                value={filters.riskLevel}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, riskLevel: value as RiskFilter }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="low">Baixo</SelectItem>
                  <SelectItem value="medium">Medio</SelectItem>
                  <SelectItem value="high">Elevado</SelectItem>
                  <SelectItem value="critical">Critico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Sort by</Label>
              <Select
                value={filters.sortBy}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, sortBy: value as AdminCreatorPositiveSortBy }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="growth">Growth score</SelectItem>
                  <SelectItem value="engagement">Engagement score</SelectItem>
                  <SelectItem value="followers">Followers</SelectItem>
                  <SelectItem value="trust">Trust score</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Sort order</Label>
              <Select
                value={filters.sortOrder}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    sortOrder: value as AdminCreatorPositiveSortOrder,
                  }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descendente</SelectItem>
                  <SelectItem value="asc">Ascendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <Label htmlFor="creator-positive-window-days">Janela (dias)</Label>
              <Input
                id="creator-positive-window-days"
                type="number"
                min={7}
                max={180}
                value={filters.windowDays}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, windowDays: event.target.value }))
                }
              />
            </div>
            <div className="md:col-span-2 flex flex-wrap items-end gap-2">
              <Button type="button" onClick={applyFilters}>
                <Search className="mr-2 h-4 w-4" />
                Aplicar
              </Button>
              <Button type="button" variant="outline" onClick={clearFilters}>
                Limpar
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => analyticsQuery.refetch()}
                disabled={analyticsQuery.isFetching}
              >
                {analyticsQuery.isFetching ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCcw className="mr-2 h-4 w-4" />
                )}
                Refresh
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleExportCsv}
                disabled={exportCsvMutation.isPending}
              >
                {exportCsvMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Leaderboard</CardTitle>
          <CardDescription>
            {pagination
              ? `Pagina ${pagination.page} de ${pagination.pages} | total ${pagination.total} creators`
              : 'Sem dados'}
            {' | '}
            ordenado por {SORT_BY_LABEL[query.sortBy ?? 'growth']} (
            {SORT_ORDER_LABEL[query.sortOrder ?? 'desc']}){' | '}
            janela {query.windowDays ?? 30} dias
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {analyticsQuery.isLoading ? (
            <div className="h-20 animate-pulse rounded-md bg-muted" />
          ) : items.length === 0 ? (
            <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
              Sem creators para os filtros atuais.
            </div>
          ) : (
            <>
              <div className="space-y-3 md:hidden">
                {items.map((item) => (
                  <div key={item.creatorId} className="rounded-lg border border-border/70 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">
                          {item.creator.name || item.creator.username || item.creator.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          @{item.creator.username || '-'}
                        </p>
                      </div>
                      <Badge variant={RISK_BADGE_VARIANT[item.trust.riskLevel]}>
                        {RISK_LABEL[item.trust.riskLevel]}
                      </Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded border border-border/60 p-2">
                        <p className="text-muted-foreground">Growth score</p>
                        <p className="font-semibold">{formatDecimal(item.growth.score)}</p>
                        <p className={cn('text-[11px]', valueToneClass(item.growth.followsDelta))}>
                          Follows {formatSignedNumber(item.growth.followsDelta)}
                        </p>
                      </div>
                      <div className="rounded border border-border/60 p-2">
                        <p className="text-muted-foreground">Engagement</p>
                        <p className="font-semibold">{formatDecimal(item.engagement.score)}</p>
                        <p className="text-[11px] text-muted-foreground">
                          Acoes/pub {formatDecimal(item.engagement.actionsPerPublished)}
                        </p>
                      </div>
                      <div className="rounded border border-border/60 p-2">
                        <p className="text-muted-foreground">Trust</p>
                        <p className="font-semibold">{formatDecimal(item.trust.trustScore)}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {normalizeRecommendedAction(item.trust.recommendedAction)}
                        </p>
                      </div>
                      <div className="rounded border border-border/60 p-2">
                        <p className="text-muted-foreground">Followers</p>
                        <p className="font-semibold">{formatNumber(item.creator.followers)}</p>
                        <p className="text-[11px] text-muted-foreground">
                          Ativo: {formatDateTime(item.creator.lastActiveAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden overflow-auto md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Creator</TableHead>
                      <TableHead>Conta</TableHead>
                      <TableHead className="text-right">Followers</TableHead>
                      <TableHead>Growth</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead>Trust</TableHead>
                      <TableHead>Conteudo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.creatorId}>
                        <TableCell>
                          <div className="space-y-0.5">
                            <p className="text-sm font-semibold">
                              {item.creator.name || item.creator.username || item.creator.email}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              @{item.creator.username || '-'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.creator.email || '-'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="outline">{item.creator.accountStatus}</Badge>
                            <p className="text-xs text-muted-foreground">
                              Ult. atividade: {formatDateTime(item.creator.lastActiveAt)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="space-y-0.5">
                            <p className="text-sm font-semibold">
                              {formatNumber(item.creator.followers)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              following {formatNumber(item.creator.following)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-xs">
                            <p className="font-semibold">{formatDecimal(item.growth.score)}</p>
                            <p className={cn(valueToneClass(item.growth.followsDelta))}>
                              follows {formatSignedNumber(item.growth.followsDelta)}
                            </p>
                            <p className={cn(valueToneClass(item.growth.publishedDelta))}>
                              publ. {formatSignedNumber(item.growth.publishedDelta)}
                            </p>
                            <p className="text-muted-foreground">
                              trend {formatPercent(item.growth.followsTrendPercent)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-xs">
                            <p className="font-semibold">{formatDecimal(item.engagement.score)}</p>
                            <p className="text-muted-foreground">
                              acoes/pub {formatDecimal(item.engagement.actionsPerPublished)}
                            </p>
                            <p className="text-muted-foreground">
                              avg rating {formatDecimal(item.engagement.averageRating)}
                            </p>
                            <p className="text-muted-foreground">
                              views {formatNumber(item.engagement.views)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-xs">
                            <div className="flex flex-wrap items-center gap-1">
                              <span className="font-semibold">
                                {formatDecimal(item.trust.trustScore)}
                              </span>
                              <Badge variant={RISK_BADGE_VARIANT[item.trust.riskLevel]}>
                                {RISK_LABEL[item.trust.riskLevel]}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground">
                              {normalizeRecommendedAction(item.trust.recommendedAction)}
                            </p>
                            <p className="text-muted-foreground">
                              reports {formatNumber(item.trust.openReports)} | high{' '}
                              {formatNumber(item.trust.highPriorityTargets)} | critical{' '}
                              {formatNumber(item.trust.criticalTargets)}
                            </p>
                            <p className="text-muted-foreground">
                              FP rate 30d {formatPercent(item.trust.falsePositiveRate30d)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-xs">
                            <p className="font-semibold">
                              pub {formatNumber(item.content.published)} / total{' '}
                              {formatNumber(item.content.total)}
                            </p>
                            <p className="text-muted-foreground">
                              premium {formatNumber(item.content.premiumPublished)} | featured{' '}
                              {formatNumber(item.content.featuredPublished)}
                            </p>
                            <p className="text-muted-foreground">
                              art {formatNumber(item.content.byType.article.published)} | vid{' '}
                              {formatNumber(item.content.byType.video.published)} | cur{' '}
                              {formatNumber(item.content.byType.course.published)}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}

          <div className="flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={!pagination || pagination.page <= 1 || analyticsQuery.isFetching}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Anterior
            </Button>
            <p className="text-xs text-muted-foreground">
              {pagination ? `Pagina ${pagination.page} / ${pagination.pages}` : '-'}
            </p>
            <Button
              type="button"
              variant="outline"
              disabled={
                !pagination || pagination.page >= pagination.pages || analyticsQuery.isFetching
              }
              onClick={() => setPage((current) => current + 1)}
            >
              Seguinte
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
