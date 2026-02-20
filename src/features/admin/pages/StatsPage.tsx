import { useMemo, type ElementType } from 'react'
import {
  Activity,
  AlertTriangle,
  Clock3,
  Database,
  EyeOff,
  Gauge,
  Loader2,
  Lock,
  RefreshCcw,
  ShieldCheck,
  Users,
} from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui'
import { getErrorMessage } from '@/lib/api/client'
import { useAdminMetricsOverview } from '../hooks/useAdminMetrics'
import type { AdminMetricContentType } from '../types/adminMetrics'

const CONTENT_TYPE_LABELS: Record<AdminMetricContentType, string> = {
  article: 'Artigos',
  video: 'Videos',
  course: 'Cursos',
  live: 'Lives',
  podcast: 'Podcasts',
  book: 'Livros',
  comment: 'Comentarios',
  review: 'Reviews',
}

const formatNumber = (value: number): string => value.toLocaleString('pt-PT')
const formatPercent = (value: number): string => `${value.toFixed(2)}%`
const formatHours = (value: number | null): string =>
  value === null ? '-' : `${value.toFixed(2)}h`

const formatDateTime = (value: string): string => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('pt-PT', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}

interface KpiCardProps {
  title: string
  value: string
  description: string
  icon: ElementType
  tone?: 'default' | 'warn' | 'danger' | 'success'
}

function KpiCard({ title, value, description, icon: Icon, tone = 'default' }: KpiCardProps) {
  const toneClass =
    tone === 'warn'
      ? 'border-amber-500/30'
      : tone === 'danger'
        ? 'border-red-500/30'
        : tone === 'success'
          ? 'border-green-500/30'
          : ''

  return (
    <Card className={toneClass}>
      <CardHeader className="pb-2">
        <CardDescription className="flex items-center justify-between">
          <span>{title}</span>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

interface StatsPageProps {
  embedded?: boolean
}

export default function StatsPage({ embedded = false }: StatsPageProps) {
  const metricsQuery = useAdminMetricsOverview()
  const metrics = metricsQuery.data

  const moderationVolumeRows = useMemo(() => {
    if (!metrics) return []

    return (
      Object.entries(metrics.moderation.actions.volumeByTypeLast7d) as Array<
        [AdminMetricContentType, number]
      >
    )
      .map(([type, count]) => ({
        type,
        count,
      }))
      .sort((a, b) => b.count - a.count)
  }, [metrics])

  const roleRows = useMemo(() => {
    if (!metrics) return []

    return Object.entries(metrics.usage.roleDistribution).sort((a, b) => b[1] - a[1]) as Array<
      [string, number]
    >
  }, [metrics])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {embedded ? (
            <h2 className="text-xl font-semibold tracking-tight">Estatisticas e metricas</h2>
          ) : (
            <h1 className="text-2xl font-semibold tracking-tight">Estatisticas e metricas</h1>
          )}
          <p className="text-sm text-muted-foreground">
            Visao consolidada de utilizacao, moderacao e operacao admin.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {metrics && (
            <p className="text-xs text-muted-foreground">
              Atualizado: {formatDateTime(metrics.generatedAt)}
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => metricsQuery.refetch()}
            disabled={metricsQuery.isFetching}
          >
            {metricsQuery.isFetching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            Atualizar
          </Button>
        </div>
      </div>

      {metricsQuery.isLoading && !metrics ? (
        <Card>
          <CardContent className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />A carregar metricas administrativas...
          </CardContent>
        </Card>
      ) : null}

      {metricsQuery.isError && !metrics ? (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="py-6 text-sm text-destructive">
            {getErrorMessage(metricsQuery.error)}
          </CardContent>
        </Card>
      ) : null}

      {metrics ? (
        <>
          {metricsQuery.isError ? (
            <Card className="border-yellow-500/40 bg-yellow-500/5">
              <CardContent className="py-4 text-sm text-muted-foreground">
                Erro ao atualizar em tempo real. A mostrar ultimo snapshot disponivel.
              </CardContent>
            </Card>
          ) : null}

          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">Utilizacao</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <KpiCard
                title="DAU"
                value={formatNumber(metrics.usage.dau)}
                description="Utilizadores ativos ultimas 24h."
                icon={Users}
              />
              <KpiCard
                title="WAU"
                value={formatNumber(metrics.usage.wau)}
                description="Utilizadores ativos ultimos 7 dias."
                icon={Users}
              />
              <KpiCard
                title="MAU"
                value={formatNumber(metrics.usage.mau)}
                description="Utilizadores ativos ultimos 30 dias."
                icon={Users}
              />
              <KpiCard
                title="Novos (7d)"
                value={formatNumber(metrics.usage.newUsers.last7d)}
                description="Registos criados na ultima semana."
                icon={Activity}
              />
              <KpiCard
                title="Retencao"
                value={formatPercent(metrics.usage.retention.retainedRatePercent)}
                description="Cohort 30d com atividade em 7d."
                icon={Gauge}
              />
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Distribuicao por role</CardTitle>
                <CardDescription>
                  Base total: {formatNumber(metrics.usage.totalUsers)} users
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {roleRows.map(([role, count]) => (
                  <Badge key={role} variant="outline">
                    {role}: {formatNumber(count)}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">Engagement</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <KpiCard
                title="Interacoes 24h"
                value={formatNumber(metrics.engagement.interactions.last24h)}
                description="Follows + favoritos + comentarios + reviews."
                icon={Activity}
              />
              <KpiCard
                title="Interacoes 7d"
                value={formatNumber(metrics.engagement.interactions.last7d)}
                description="Acumulado dos ultimos 7 dias."
                icon={Activity}
              />
              <KpiCard
                title="Interacoes 30d"
                value={formatNumber(metrics.engagement.interactions.last30d)}
                description="Acumulado dos ultimos 30 dias."
                icon={Activity}
              />
              <KpiCard
                title="Conteudo publicado 7d"
                value={formatNumber(metrics.engagement.contentPublishedLast7d.total)}
                description="Novos conteudos com status published."
                icon={ShieldCheck}
              />
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">Moderacao</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <KpiCard
                title="Fila total"
                value={formatNumber(metrics.moderation.queue.total)}
                description="Itens moderaveis no queue."
                icon={Activity}
              />
              <KpiCard
                title="Ocultos"
                value={formatNumber(metrics.moderation.queue.hidden)}
                description="Itens com status hidden."
                icon={EyeOff}
                tone="warn"
              />
              <KpiCard
                title="Restritos"
                value={formatNumber(metrics.moderation.queue.restricted)}
                description="Itens com status restricted."
                icon={Lock}
                tone="danger"
              />
              <KpiCard
                title="Acoes 24h"
                value={formatNumber(metrics.moderation.actions.last24h)}
                description="Eventos de moderacao nas ultimas 24h."
                icon={AlertTriangle}
              />
              <KpiCard
                title="Resolucao media"
                value={formatHours(metrics.moderation.resolution.averageHours)}
                description="Tempo medio entre criacao e 1a acao (7d)."
                icon={Clock3}
              />
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Volume por tipo (7d)</CardTitle>
                <CardDescription>
                  Reincidencia: {formatNumber(metrics.moderation.recidivismLast30d.repeatedTargets)}{' '}
                  targets e {formatNumber(metrics.moderation.recidivismLast30d.repeatedActors)}{' '}
                  atores.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="text-right">Eventos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {moderationVolumeRows.map((row) => (
                      <TableRow key={row.type}>
                        <TableCell>{CONTENT_TYPE_LABELS[row.type]}</TableCell>
                        <TableCell className="text-right">{formatNumber(row.count)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">Operacao</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <KpiCard
                title="Requests"
                value={formatNumber(metrics.operations.totalRequests)}
                description="Contador em memoria desde o arranque."
                icon={Activity}
              />
              <KpiCard
                title="Erro 5xx"
                value={formatPercent(metrics.operations.errorRatePercent)}
                description="Taxa de erros internos."
                icon={AlertTriangle}
                tone={metrics.operations.errorRatePercent > 5 ? 'danger' : 'default'}
              />
              <KpiCard
                title="Disponibilidade"
                value={formatPercent(metrics.operations.availabilityPercent)}
                description="Share de requests sem erro 5xx."
                icon={ShieldCheck}
                tone={metrics.operations.availabilityPercent >= 99 ? 'success' : 'warn'}
              />
              <KpiCard
                title="Latencia media"
                value={`${metrics.operations.avgLatencyMs.toFixed(2)}ms`}
                description="Media ponderada por request."
                icon={Clock3}
              />
              <KpiCard
                title="Mongo"
                value={metrics.operations.mongoReady ? 'OK' : 'INDISP'}
                description={`Uptime processo: ${metrics.operations.processUptimeSeconds.toFixed(0)}s`}
                icon={Database}
                tone={metrics.operations.mongoReady ? 'success' : 'danger'}
              />
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Top rotas lentas</CardTitle>
                  <CardDescription>Media por rota/metodo.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rota</TableHead>
                        <TableHead className="text-right">Req</TableHead>
                        <TableHead className="text-right">Media</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {metrics.operations.topSlowRoutes.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-muted-foreground">
                            Sem dados de latencia.
                          </TableCell>
                        </TableRow>
                      ) : (
                        metrics.operations.topSlowRoutes.map((item) => (
                          <TableRow key={`${item.method}:${item.route}`}>
                            <TableCell className="font-mono text-xs">
                              {item.method} {item.route}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatNumber(item.requests)}
                            </TableCell>
                            <TableCell className="text-right">
                              {item.avgLatencyMs.toFixed(2)}ms
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Top rotas com erro 5xx</CardTitle>
                  <CardDescription>Risco operacional para investigacao.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">
                      Audit success: {formatNumber(metrics.operations.adminAuditLast24h.success)}
                    </Badge>
                    <Badge variant="outline">
                      Audit forbidden:{' '}
                      {formatNumber(metrics.operations.adminAuditLast24h.forbidden)}
                    </Badge>
                    <Badge variant="outline">
                      Audit error: {formatNumber(metrics.operations.adminAuditLast24h.error)}
                    </Badge>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rota</TableHead>
                        <TableHead className="text-right">5xx</TableHead>
                        <TableHead className="text-right">Taxa</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {metrics.operations.topErrorRoutes.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-muted-foreground">
                            Sem erros 5xx no snapshot atual.
                          </TableCell>
                        </TableRow>
                      ) : (
                        metrics.operations.topErrorRoutes.map((item) => (
                          <TableRow key={`${item.method}:${item.route}`}>
                            <TableCell className="font-mono text-xs">
                              {item.method} {item.route}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatNumber(item.errors5xx)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatPercent(item.errorRatePercent)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </section>
        </>
      ) : null}
    </div>
  )
}
