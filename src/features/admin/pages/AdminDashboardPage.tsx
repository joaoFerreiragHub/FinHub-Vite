import React from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  ShieldCheck,
  Layers,
  BarChart3,
  UserCheck,
  UserX,
  AlertTriangle,
  EyeOff,
  Lock,
  ArrowRight,
  Activity,
  Shield,
  Calendar,
} from 'lucide-react'
import { useAdminUsers } from '../hooks/useAdminUsers'
import { useAdminContentQueue } from '../hooks/useAdminContent'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { cn } from '@/lib/utils'

// ── Stat card ──────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: number | undefined
  icon: React.ElementType
  loading?: boolean
  highlight?: 'warn' | 'danger'
}

function StatCard({ label, value, icon: Icon, loading, highlight }: StatCardProps) {
  const hasAlert = value !== undefined && value > 0

  return (
    <div
      className={cn(
        'rounded-xl border bg-card p-5 transition-shadow hover:shadow-sm',
        highlight === 'warn' && hasAlert && 'border-amber-500/30 bg-amber-500/5',
        highlight === 'danger' && hasAlert && 'border-red-500/30 bg-red-500/5',
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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
      <div className="mt-3">
        {loading ? (
          <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
        ) : (
          <p className="text-3xl font-bold tabular-nums tracking-tight">
            {value?.toLocaleString('pt-PT') ?? '—'}
          </p>
        )}
      </div>
    </div>
  )
}

// ── Navigation card ────────────────────────────────────────────────────────────

interface NavCardProps {
  title: string
  description: string
  icon: React.ElementType
  to: string
  operational: boolean
  alertCount?: number
}

function NavCard({ title, description, icon: Icon, to, operational, alertCount }: NavCardProps) {
  return (
    <Link
      to={to}
      className="group flex flex-col gap-4 rounded-xl border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {alertCount !== undefined && alertCount > 0 && (
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
              {alertCount}
            </span>
          )}
          {operational ? (
            <span className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-700 dark:text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Operacional
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
              Em desenvolvimento
            </span>
          )}
        </div>
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>

      <div className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
        Aceder ao módulo
        <ArrowRight className="h-3 w-3" />
      </div>
    </Link>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const user = useAuthStore((s) => s.user)

  // User stats — 3 lightweight queries (limit: 1 only fetches totals)
  const { data: allUsers, isLoading: loadingAll } = useAdminUsers({ limit: 1 })
  const { data: suspendedData, isLoading: loadingSuspended } = useAdminUsers({
    accountStatus: 'suspended',
    limit: 1,
  })
  const { data: bannedData, isLoading: loadingBanned } = useAdminUsers({
    accountStatus: 'banned',
    limit: 1,
  })

  // Content stats
  const { data: allContent, isLoading: loadingContent } = useAdminContentQueue({ limit: 1 })
  const { data: hiddenData, isLoading: loadingHidden } = useAdminContentQueue({
    moderationStatus: 'hidden',
    limit: 1,
  })
  const { data: restrictedData, isLoading: loadingRestricted } = useAdminContentQueue({
    moderationStatus: 'restricted',
    limit: 1,
  })

  const totalUsers = allUsers?.pagination.total
  const suspended = suspendedData?.pagination.total ?? 0
  const banned = bannedData?.pagination.total ?? 0
  const active = totalUsers !== undefined ? totalUsers - suspended - banned : undefined

  const totalContent = allContent?.pagination.total
  const hidden = hiddenData?.pagination.total
  const restricted = restrictedData?.pagination.total

  const today = new Date().toLocaleDateString('pt-PT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="space-y-10">
      {/* ── Header ────────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm capitalize text-muted-foreground">{today}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            Bem-vindo, {user?.name ?? 'Admin'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Painel de administração da plataforma FinHub
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-lg bg-primary/10 px-3 py-2">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-primary">Admin</span>
        </div>
      </div>

      {/* ── User Stats ────────────────────────────────────────────────────────── */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Utilizadores
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total" value={totalUsers} icon={Users} loading={loadingAll} />
          <StatCard
            label="Activos"
            value={active}
            icon={UserCheck}
            loading={loadingAll || loadingSuspended || loadingBanned}
          />
          <StatCard
            label="Suspensos"
            value={suspended}
            icon={AlertTriangle}
            loading={loadingSuspended}
            highlight="warn"
          />
          <StatCard
            label="Banidos"
            value={banned}
            icon={UserX}
            loading={loadingBanned}
            highlight="danger"
          />
        </div>
      </section>

      {/* ── Content Stats ─────────────────────────────────────────────────────── */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Moderação de Conteúdo
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard
            label="Fila Total"
            value={totalContent}
            icon={Activity}
            loading={loadingContent}
          />
          <StatCard
            label="Ocultos"
            value={hidden}
            icon={EyeOff}
            loading={loadingHidden}
            highlight="warn"
          />
          <StatCard
            label="Restritos"
            value={restricted}
            icon={Lock}
            loading={loadingRestricted}
            highlight="danger"
          />
        </div>
      </section>

      {/* ── Modules ───────────────────────────────────────────────────────────── */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Módulos de Administração
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <NavCard
            title="Gestão de Utilizadores"
            description="Listar e pesquisar contas. Suspender, banir, forçar logout e registar anotações internas com histórico completo."
            icon={Users}
            to="/admin/users"
            operational
            alertCount={suspended + banned}
          />
          <NavCard
            title="Moderação de Conteúdo"
            description="Fila unificada de moderação. Ocultar, desbloquear e restringir artigos, vídeos, cursos, podcasts e livros."
            icon={ShieldCheck}
            to="/admin/conteudo"
            operational
            alertCount={(hidden ?? 0) + (restricted ?? 0)}
          />
          <NavCard
            title="Recursos e Marcas"
            description="Gerir brokers, plataformas, exchanges, apps, sites e outros recursos disponíveis na plataforma."
            icon={Layers}
            to="/admin/recursos"
            operational={false}
          />
          <NavCard
            title="Estatísticas e Métricas"
            description="DAU/WAU/MAU, engagement, retenção, KPIs de moderação e métricas operacionais da plataforma."
            icon={BarChart3}
            to="/admin/stats"
            operational
          />
        </div>
      </section>

      {/* ── Roadmap ───────────────────────────────────────────────────────────── */}
      <section>
        <div className="rounded-xl border border-dashed bg-card/50 p-5">
          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-semibold text-foreground">Roadmap P2</p>
              <p className="mt-1 text-sm text-muted-foreground">
                P2.3 Acesso assistido com consentimento &middot; P2.4 Métricas e observabilidade
                &middot; P2.5 Painel unificado &middot; P2.6 Hardening operacional
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
