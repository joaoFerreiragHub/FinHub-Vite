import { useMemo, type ElementType } from 'react'
import {
  Activity,
  AlertTriangle,
  Clock3,
  Database,
  EyeOff,
  Gauge,
  Layers,
  Loader2,
  Lock,
  Radar,
  RefreshCcw,
  ShieldCheck,
  ShieldAlert,
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
import { useAdminMetricsDrilldown, useAdminMetricsOverview } from '../hooks/useAdminMetrics'
import type { AdminAutomatedModerationRule, AdminMetricContentType } from '../types/adminMetrics'

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

const AUTOMATED_RULE_LABELS: Record<AdminAutomatedModerationRule, string> = {
  spam: 'Spam',
  suspicious_link: 'Links suspeitos',
  flood: 'Flood',
  mass_creation: 'Criacao em massa',
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
  const drilldownQuery = useAdminMetricsDrilldown(8)
  const metrics = metricsQuery.data
  const drilldown = drilldownQuery.data

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

  const reportReasonRows = useMemo(() => metrics?.moderation.reports.topReasons ?? [], [metrics])
  const creatorRiskRows = useMemo(() => {
    if (!metrics) return []
    return Object.entries(metrics.moderation.creatorTrust.byRiskLevel) as Array<[string, number]>
  }, [metrics])
  const automatedRuleRows = useMemo(() => {
    if (!metrics) return []
    return Object.entries(metrics.moderation.automation.automatedDetection.byRule) as Array<
      [AdminAutomatedModerationRule, number]
    >
  }, [metrics])
  const drilldownCreatorRows = useMemo(() => drilldown?.creators ?? [], [drilldown])
  const drilldownTargetRows = useMemo(() => drilldown?.targets ?? [], [drilldown])
  const drilldownSurfaceRows = useMemo(() => drilldown?.surfaces ?? [], [drilldown])
  const drilldownJobRows = useMemo(() => drilldown?.jobs ?? [], [drilldown])

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
            onClick={() => {
              void metricsQuery.refetch()
              void drilldownQuery.refetch()
            }}
            disabled={metricsQuery.isFetching || drilldownQuery.isFetching}
          >
            {metricsQuery.isFetching || drilldownQuery.isFetching ? (
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
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
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
              <KpiCard
                title="Reports abertos"
                value={formatNumber(metrics.moderation.reports.openTotal)}
                description="Backlog atual de reports pendentes."
                icon={Radar}
                tone={metrics.moderation.reports.criticalTargets > 0 ? 'warn' : 'default'}
              />
              <KpiCard
                title="False positives 30d"
                value={formatNumber(metrics.moderation.creatorTrust.falsePositiveEventsLast30d)}
                description="Reversoes marcadas como falso positivo."
                icon={ShieldCheck}
              />
              <KpiCard
                title="Jobs ativos"
                value={formatNumber(
                  metrics.moderation.jobs.queued + metrics.moderation.jobs.running,
                )}
                description="Lotes em fila ou a correr."
                icon={Layers}
                tone={
                  metrics.moderation.jobs.queued + metrics.moderation.jobs.running > 0
                    ? 'warn'
                    : 'default'
                }
              />
            </div>
            <div className="grid gap-4 xl:grid-cols-3">
              <KpiCard
                title="Targets high+"
                value={formatNumber(metrics.moderation.reports.highPriorityTargets)}
                description="Conteudos com pressao relevante de reports."
                icon={AlertTriangle}
                tone={metrics.moderation.reports.highPriorityTargets > 0 ? 'warn' : 'default'}
              />
              <KpiCard
                title="Targets criticos"
                value={formatNumber(metrics.moderation.reports.criticalTargets)}
                description="Targets no topo da triagem de risco."
                icon={ShieldAlert}
                tone={metrics.moderation.reports.criticalTargets > 0 ? 'danger' : 'default'}
              />
              <KpiCard
                title="Auto-hide erros 24h"
                value={formatNumber(metrics.moderation.automation.policyAutoHide.errorLast24h)}
                description="Falhas da automacao preventiva."
                icon={ShieldAlert}
                tone={
                  metrics.moderation.automation.policyAutoHide.errorLast24h > 0
                    ? 'danger'
                    : 'success'
                }
              />
              <KpiCard
                title="Auto sinais ativos"
                value={formatNumber(metrics.moderation.automation.automatedDetection.activeSignals)}
                description="Targets com deteccao automatica ainda ativa."
                icon={Radar}
                tone={
                  metrics.moderation.automation.automatedDetection.activeSignals > 0
                    ? 'warn'
                    : 'default'
                }
              />
              <KpiCard
                title="Auto high+"
                value={formatNumber(
                  metrics.moderation.automation.automatedDetection.highRiskTargets,
                )}
                description="Targets com severidade automatica high ou critical."
                icon={AlertTriangle}
                tone={
                  metrics.moderation.automation.automatedDetection.highRiskTargets > 0
                    ? 'warn'
                    : 'default'
                }
              />
              <KpiCard
                title="Auto criticos"
                value={formatNumber(
                  metrics.moderation.automation.automatedDetection.criticalTargets,
                )}
                description="Alvos a priorizar por deteccao automatica."
                icon={ShieldAlert}
                tone={
                  metrics.moderation.automation.automatedDetection.criticalTargets > 0
                    ? 'danger'
                    : 'default'
                }
              />
              <KpiCard
                title="Detecao hide erros 24h"
                value={formatNumber(
                  metrics.moderation.automation.automatedDetection.autoHide.errorLast24h,
                )}
                description="Falhas do auto-hide tecnico por deteccao."
                icon={ShieldAlert}
                tone={
                  metrics.moderation.automation.automatedDetection.autoHide.errorLast24h > 0
                    ? 'danger'
                    : 'success'
                }
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
            <div className="grid gap-4 xl:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Reports e intake</CardTitle>
                  <CardDescription>Entrada e resolucao operacional de reports.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">
                      Intake 24h: {formatNumber(metrics.moderation.reports.intake.last24h)}
                    </Badge>
                    <Badge variant="outline">
                      Intake 7d: {formatNumber(metrics.moderation.reports.intake.last7d)}
                    </Badge>
                    <Badge variant="outline">
                      Resolvidos 24h: {formatNumber(metrics.moderation.reports.resolved.last24h)}
                    </Badge>
                    <Badge variant="outline">
                      Resolvidos 7d: {formatNumber(metrics.moderation.reports.resolved.last7d)}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {reportReasonRows.length === 0 ? (
                      <span className="text-xs text-muted-foreground">Sem top reasons.</span>
                    ) : (
                      reportReasonRows.map((item) => (
                        <Badge key={item.reason} variant="outline">
                          {item.reason}: {formatNumber(item.count)}
                        </Badge>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Detecao automatica</CardTitle>
                  <CardDescription>
                    Distribuicao de regras e resultado do auto-hide tecnico.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">
                      Hide ok 24h:{' '}
                      {formatNumber(
                        metrics.moderation.automation.automatedDetection.autoHide.successLast24h,
                      )}
                    </Badge>
                    <Badge variant="outline">
                      Hide ok 7d:{' '}
                      {formatNumber(
                        metrics.moderation.automation.automatedDetection.autoHide.successLast7d,
                      )}
                    </Badge>
                    <Badge variant="outline">
                      Hide erro 24h:{' '}
                      {formatNumber(
                        metrics.moderation.automation.automatedDetection.autoHide.errorLast24h,
                      )}
                    </Badge>
                    <Badge variant="outline">
                      Hide erro 7d:{' '}
                      {formatNumber(
                        metrics.moderation.automation.automatedDetection.autoHide.errorLast7d,
                      )}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {automatedRuleRows.map(([rule, count]) => (
                      <Badge key={rule} variant="outline">
                        {AUTOMATED_RULE_LABELS[rule]}: {formatNumber(count)}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Creator controls e trust</CardTitle>
                  <CardDescription>Pressao operacional ao nivel do creator.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-border/70 p-3">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Barreiras ativas
                      </p>
                      <p className="mt-2 text-2xl font-semibold">
                        {formatNumber(metrics.moderation.creatorControls.active.affectedCreators)}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        creationBlocked{' '}
                        {formatNumber(metrics.moderation.creatorControls.active.creationBlocked)}
                        {' · '}publishingBlocked{' '}
                        {formatNumber(metrics.moderation.creatorControls.active.publishingBlocked)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border/70 p-3">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Intervencao sugerida
                      </p>
                      <p className="mt-2 text-2xl font-semibold">
                        {formatNumber(metrics.moderation.creatorTrust.needingIntervention)}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        creators avaliados:{' '}
                        {formatNumber(metrics.moderation.creatorTrust.creatorsEvaluated)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {creatorRiskRows.map(([level, count]) => (
                      <Badge key={level} variant="outline">
                        {level}: {formatNumber(count)}
                      </Badge>
                    ))}
                    <Badge variant="outline">
                      false positives 30d:{' '}
                      {formatNumber(metrics.moderation.creatorTrust.falsePositiveEventsLast30d)}
                    </Badge>
                    <Badge variant="outline">
                      creators c/ historico:{' '}
                      {formatNumber(
                        metrics.moderation.creatorTrust.creatorsWithFalsePositiveHistory,
                      )}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
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

          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Radar className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">Drill-down</h2>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Creators em foco</CardTitle>
                  <CardDescription>Risco atual vs historico de falso positivo.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Creator</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                        <TableHead className="text-right">Reports</TableHead>
                        <TableHead className="text-right">FP 30d</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {drilldownCreatorRows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-muted-foreground">
                            Sem creators em destaque.
                          </TableCell>
                        </TableRow>
                      ) : (
                        drilldownCreatorRows.map((creator) => (
                          <TableRow key={creator.creatorId}>
                            <TableCell>
                              <div className="space-y-1">
                                <p className="font-medium">{creator.name}</p>
                                <p className="text-xs text-muted-foreground">{creator.riskLevel}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {formatNumber(creator.trustScore)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatNumber(creator.openReports)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatNumber(creator.falsePositiveEvents30d)}
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
                  <CardTitle className="text-base">Jobs recentes</CardTitle>
                  <CardDescription>Moderacao e rollback em lote.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Proc.</TableHead>
                        <TableHead className="text-right">Falhas</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {drilldownJobRows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-muted-foreground">
                            Sem jobs recentes.
                          </TableCell>
                        </TableRow>
                      ) : (
                        drilldownJobRows.map((job) => (
                          <TableRow key={job.id}>
                            <TableCell>
                              {job.type === 'bulk_rollback' ? 'Rollback' : 'Moderacao'}
                            </TableCell>
                            <TableCell>{job.status}</TableCell>
                            <TableCell className="text-right">
                              {formatNumber(job.processed)}/{formatNumber(job.requested)}
                            </TableCell>
                            <TableCell className="text-right">{formatNumber(job.failed)}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Targets quentes</CardTitle>
                  <CardDescription>Top alvos por pressao combinada.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Target</TableHead>
                        <TableHead className="text-right">Reports</TableHead>
                        <TableHead className="text-right">Auto</TableHead>
                        <TableHead>Surface</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {drilldownTargetRows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-muted-foreground">
                            Sem targets em destaque.
                          </TableCell>
                        </TableRow>
                      ) : (
                        drilldownTargetRows.map((target) => (
                          <TableRow key={`${target.contentType}:${target.contentId}`}>
                            <TableCell>
                              <div className="space-y-1">
                                <p className="font-medium">{target.title || target.contentId}</p>
                                <p className="text-xs text-muted-foreground">
                                  {target.contentType}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {formatNumber(target.openReports)}
                            </TableCell>
                            <TableCell className="text-right">{target.automatedSeverity}</TableCell>
                            <TableCell>{target.surfaceKey}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Superficies</CardTitle>
                  <CardDescription>Impacto operacional atual por surface.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Surface</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Flagged</TableHead>
                        <TableHead className="text-right">Criticos</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {drilldownSurfaceRows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-muted-foreground">
                            Sem superficies em destaque.
                          </TableCell>
                        </TableRow>
                      ) : (
                        drilldownSurfaceRows.map((surface) => (
                          <TableRow key={surface.key}>
                            <TableCell>{surface.label}</TableCell>
                            <TableCell>{surface.enabled ? 'On' : 'Off'}</TableCell>
                            <TableCell className="text-right">
                              {formatNumber(surface.affectedFlaggedTargets)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatNumber(surface.affectedCriticalTargets)}
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
