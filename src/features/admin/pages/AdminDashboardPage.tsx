import { useEffect, useMemo, useState, type ElementType } from 'react'
import {
  Activity,
  AlertTriangle,
  BarChart3,
  EyeOff,
  Layers,
  LifeBuoy,
  Lock,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Users,
  UserX,
} from 'lucide-react'
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { cn } from '@/lib/utils'
import {
  ADMIN_MODULES,
  type AdminModuleConfig,
  canReadAdminModule,
  canWriteAdminModule,
} from '../lib/access'
import { useAdminUsers } from '../hooks/useAdminUsers'
import { useAdminContentQueue } from '../hooks/useAdminContent'
import { useAdminAssistedSessions } from '../hooks/useAdminAssistedSessions'
import { useAdminMetricsOverview } from '../hooks/useAdminMetrics'
import UsersManagementPage from './UsersManagementPage'
import ContentModerationPage from './ContentModerationPage'
import AssistedSessionsPage from './AssistedSessionsPage'
import StatsPage from './StatsPage'
import BrandsManagementPage from './BrandsManagementPage'

type DashboardTab = 'overview' | 'users' | 'content' | 'support' | 'stats' | 'brands'

interface StatCardProps {
  label: string
  value: number | string | undefined
  icon: ElementType
  loading?: boolean
  highlight?: 'warn' | 'danger'
}

function StatCard({ label, value, icon: Icon, loading, highlight }: StatCardProps) {
  const hasAlert =
    typeof value === 'number' ? value > 0 : typeof value === 'string' ? value !== '0' : false

  return (
    <div
      className={cn(
        'rounded-xl border bg-card p-4 transition-shadow hover:shadow-sm',
        highlight === 'warn' && hasAlert && 'border-amber-500/30 bg-amber-500/5',
        highlight === 'danger' && hasAlert && 'border-red-500/30 bg-red-500/5',
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <Icon
          className={cn(
            'h-4 w-4',
            highlight === 'warn' && hasAlert && 'text-amber-500',
            highlight === 'danger' && hasAlert && 'text-red-500',
            !highlight || !hasAlert ? 'text-muted-foreground' : '',
          )}
        />
      </div>
      <div className="mt-2">
        {loading ? (
          <div className="h-7 w-16 animate-pulse rounded bg-muted" />
        ) : (
          <p className="text-2xl font-bold tabular-nums">{value ?? '-'}</p>
        )}
      </div>
    </div>
  )
}

interface ModuleCardProps {
  moduleConfig: AdminModuleConfig
  canWrite: boolean
  alertCount?: number
}

const MODULE_ICONS: Record<AdminModuleConfig['key'], ElementType> = {
  dashboard: BarChart3,
  users: Users,
  content: ShieldCheck,
  support: LifeBuoy,
  brands: Layers,
  stats: BarChart3,
}

function ModuleCard({ moduleConfig, canWrite, alertCount }: ModuleCardProps) {
  const Icon = MODULE_ICONS[moduleConfig.key]

  return (
    <a
      href={moduleConfig.path}
      className="group flex flex-col gap-3 rounded-xl border bg-card p-5 transition-colors hover:border-primary/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex items-center gap-2">
          {typeof alertCount === 'number' && alertCount > 0 ? (
            <Badge variant="outline" className="border-amber-500/40 text-amber-600">
              {alertCount}
            </Badge>
          ) : null}
          {!canWrite ? (
            <Badge variant="outline" className="text-muted-foreground">
              Read-only
            </Badge>
          ) : null}
          {!moduleConfig.operational ? (
            <Badge variant="outline" className="text-muted-foreground">
              Em breve
            </Badge>
          ) : (
            <Badge className="bg-green-600 text-white hover:bg-green-600">Operacional</Badge>
          )}
        </div>
      </div>
      <div>
        <p className="font-semibold">{moduleConfig.label}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {canWrite
            ? 'Leitura e escrita disponiveis para este modulo.'
            : 'Acesso limitado a leitura para este modulo.'}
        </p>
      </div>
    </a>
  )
}

export default function AdminDashboardPage() {
  const user = useAuthStore((state) => state.user)

  const moduleAccess = useMemo(() => {
    const byKey: Partial<
      Record<
        Exclude<AdminModuleConfig['key'], 'dashboard'>,
        { moduleConfig: AdminModuleConfig; canRead: boolean; canWrite: boolean }
      >
    > = {}

    for (const moduleConfig of ADMIN_MODULES) {
      if (moduleConfig.key === 'dashboard') continue
      byKey[moduleConfig.key] = {
        moduleConfig,
        canRead: canReadAdminModule(user, moduleConfig),
        canWrite: canWriteAdminModule(user, moduleConfig),
      }
    }

    return byKey
  }, [user])

  const canReadUsers = Boolean(moduleAccess.users?.canRead)
  const canReadContent = Boolean(moduleAccess.content?.canRead)
  const canReadSupport = Boolean(moduleAccess.support?.canRead)
  const canReadStats = Boolean(moduleAccess.stats?.canRead)

  const { data: allUsers, isLoading: loadingAllUsers } = useAdminUsers(
    { limit: 1 },
    { enabled: canReadUsers },
  )
  const { data: suspendedUsers, isLoading: loadingSuspendedUsers } = useAdminUsers(
    { accountStatus: 'suspended', limit: 1 },
    { enabled: canReadUsers },
  )
  const { data: bannedUsers, isLoading: loadingBannedUsers } = useAdminUsers(
    { accountStatus: 'banned', limit: 1 },
    { enabled: canReadUsers },
  )

  const { data: allContent, isLoading: loadingAllContent } = useAdminContentQueue(
    { limit: 1 },
    { enabled: canReadContent },
  )
  const { data: hiddenContent, isLoading: loadingHiddenContent } = useAdminContentQueue(
    { moderationStatus: 'hidden', limit: 1 },
    { enabled: canReadContent },
  )
  const { data: restrictedContent, isLoading: loadingRestrictedContent } = useAdminContentQueue(
    { moderationStatus: 'restricted', limit: 1 },
    { enabled: canReadContent },
  )

  const { data: pendingSupport, isLoading: loadingPendingSupport } = useAdminAssistedSessions(
    { status: 'pending', page: 1, limit: 1 },
    { enabled: canReadSupport },
  )
  const { data: activeSupport, isLoading: loadingActiveSupport } = useAdminAssistedSessions(
    { status: 'active', page: 1, limit: 1 },
    { enabled: canReadSupport },
  )

  const { data: metricsOverview, isLoading: loadingMetricsOverview } = useAdminMetricsOverview({
    enabled: canReadStats,
  })

  const totalUsers = allUsers?.pagination.total
  const suspendedCount = suspendedUsers?.pagination.total ?? 0
  const bannedCount = bannedUsers?.pagination.total ?? 0
  const activeUsersCount =
    totalUsers !== undefined ? Math.max(totalUsers - suspendedCount - bannedCount, 0) : undefined

  const totalContent = allContent?.pagination.total
  const hiddenCount = hiddenContent?.pagination.total ?? 0
  const restrictedCount = restrictedContent?.pagination.total ?? 0

  const pendingSupportCount = pendingSupport?.pagination.total ?? 0
  const activeSupportCount = activeSupport?.pagination.total ?? 0

  const moduleCards = useMemo(
    () =>
      (
        Object.values(moduleAccess).filter(Boolean) as Array<
          NonNullable<(typeof moduleAccess)[keyof typeof moduleAccess]>
        >
      )
        .filter((entry) => entry.canRead)
        .map((entry) => {
          let alertCount: number | undefined
          if (entry.moduleConfig.key === 'users') alertCount = suspendedCount + bannedCount
          if (entry.moduleConfig.key === 'content') alertCount = hiddenCount + restrictedCount
          if (entry.moduleConfig.key === 'support') alertCount = pendingSupportCount

          return (
            <ModuleCard
              key={entry.moduleConfig.key}
              moduleConfig={entry.moduleConfig}
              canWrite={entry.canWrite}
              alertCount={alertCount}
            />
          )
        }),
    [moduleAccess, suspendedCount, bannedCount, hiddenCount, restrictedCount, pendingSupportCount],
  )

  const availableTabs = useMemo(() => {
    const tabs: Array<{ key: DashboardTab; label: string }> = [{ key: 'overview', label: 'Visao' }]
    if (canReadUsers) tabs.push({ key: 'users', label: 'Utilizadores' })
    if (canReadContent) tabs.push({ key: 'content', label: 'Moderacao' })
    if (canReadSupport) tabs.push({ key: 'support', label: 'Suporte' })
    if (canReadStats) tabs.push({ key: 'stats', label: 'Metricas' })
    if (moduleAccess.brands?.canRead) tabs.push({ key: 'brands', label: 'Recursos' })
    return tabs
  }, [canReadUsers, canReadContent, canReadSupport, canReadStats, moduleAccess.brands?.canRead])

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview')

  useEffect(() => {
    if (!availableTabs.some((tab) => tab.key === activeTab)) {
      setActiveTab(availableTabs[0]?.key ?? 'overview')
    }
  }, [activeTab, availableTabs])

  const today = new Date().toLocaleDateString('pt-PT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm capitalize text-muted-foreground">{today}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Painel admin unificado</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Operacao diaria centralizada de utilizadores, conteudo, suporte e metricas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {user?.adminReadOnly ? (
            <Badge variant="outline" className="border-amber-500/40 text-amber-600">
              Read-only
            </Badge>
          ) : null}
          <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-primary">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-semibold">Admin</span>
          </div>
        </div>
      </div>

      {!user?.adminReadOnly ? null : (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardContent className="flex items-start gap-2 pt-6 text-sm text-muted-foreground">
            <ShieldAlert className="mt-0.5 h-4 w-4 text-amber-600" />
            Perfil em modo read-only: as tabs continuam disponiveis para consulta, mas acoes de
            escrita ficam bloqueadas dentro de cada modulo.
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as DashboardTab)}>
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-muted/70 p-1">
          {availableTabs.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key} className="px-3 py-1.5 text-xs sm:text-sm">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Estado operativo
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <StatCard
                label="Users totais"
                value={totalUsers}
                icon={Users}
                loading={canReadUsers && loadingAllUsers}
              />
              <StatCard
                label="Users ativos"
                value={activeUsersCount}
                icon={UserCheck}
                loading={
                  canReadUsers && (loadingAllUsers || loadingSuspendedUsers || loadingBannedUsers)
                }
              />
              <StatCard
                label="Sancoes ativas"
                value={suspendedCount + bannedCount}
                icon={UserX}
                loading={canReadUsers && (loadingSuspendedUsers || loadingBannedUsers)}
                highlight="warn"
              />
              <StatCard
                label="Fila moderacao"
                value={totalContent}
                icon={ShieldCheck}
                loading={canReadContent && loadingAllContent}
              />
              <StatCard
                label="Risco conteudo"
                value={hiddenCount + restrictedCount}
                icon={AlertTriangle}
                loading={canReadContent && (loadingHiddenContent || loadingRestrictedContent)}
                highlight="danger"
              />
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Sinais rapidos
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Suporte pendente"
                value={pendingSupportCount}
                icon={LifeBuoy}
                loading={canReadSupport && loadingPendingSupport}
                highlight="warn"
              />
              <StatCard
                label="Suporte ativo"
                value={activeSupportCount}
                icon={LifeBuoy}
                loading={canReadSupport && loadingActiveSupport}
              />
              <StatCard
                label="Ocultos"
                value={hiddenCount}
                icon={EyeOff}
                loading={canReadContent && loadingHiddenContent}
                highlight="warn"
              />
              <StatCard
                label="Restritos"
                value={restrictedCount}
                icon={Lock}
                loading={canReadContent && loadingRestrictedContent}
                highlight="danger"
              />
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Modulos e permissoes
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">{moduleCards}</div>
          </section>

          {canReadStats ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Snapshot operacional</CardTitle>
                <CardDescription>
                  Dados resumidos do endpoint de metricas admin para triagem rapida.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  DAU:{' '}
                  {loadingMetricsOverview
                    ? '...'
                    : (metricsOverview?.usage.dau ?? 0).toLocaleString('pt-PT')}
                </Badge>
                <Badge variant="outline">
                  Error 5xx:{' '}
                  {loadingMetricsOverview
                    ? '...'
                    : `${(metricsOverview?.operations.errorRatePercent ?? 0).toFixed(2)}%`}
                </Badge>
                <Badge variant="outline">
                  Disponibilidade:{' '}
                  {loadingMetricsOverview
                    ? '...'
                    : `${(metricsOverview?.operations.availabilityPercent ?? 0).toFixed(2)}%`}
                </Badge>
                <Badge variant="outline">
                  Auditoria 24h:{' '}
                  {loadingMetricsOverview
                    ? '...'
                    : (metricsOverview?.operations.adminAuditLast24h.success ?? 0).toLocaleString(
                        'pt-PT',
                      )}
                </Badge>
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>

        {canReadUsers ? (
          <TabsContent value="users">
            <UsersManagementPage embedded />
          </TabsContent>
        ) : null}

        {canReadContent ? (
          <TabsContent value="content">
            <ContentModerationPage embedded />
          </TabsContent>
        ) : null}

        {canReadSupport ? (
          <TabsContent value="support">
            <AssistedSessionsPage embedded />
          </TabsContent>
        ) : null}

        {canReadStats ? (
          <TabsContent value="stats">
            <StatsPage embedded />
          </TabsContent>
        ) : null}

        {moduleAccess.brands?.canRead ? (
          <TabsContent value="brands">
            <BrandsManagementPage embedded />
          </TabsContent>
        ) : null}
      </Tabs>
    </div>
  )
}
