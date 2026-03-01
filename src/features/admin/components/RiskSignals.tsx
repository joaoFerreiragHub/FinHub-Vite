import { AlertTriangle, ShieldAlert, ShieldCheck } from 'lucide-react'
import { Badge, Progress } from '@/components/ui'
import { cn } from '@/lib/utils'
import type {
  AdminCreatorControls,
  AdminCreatorTrustSignals,
  CreatorRiskLevel,
  CreatorTrustRecommendedAction,
} from '../types/adminUsers'
import type {
  AdminContentAutomatedRule,
  AdminContentAutomatedSeverity,
  AdminContentReportPriority,
} from '../types/adminContent'

export const CREATOR_RISK_LABEL: Record<CreatorRiskLevel, string> = {
  low: 'Baixo risco',
  medium: 'Risco medio',
  high: 'Risco alto',
  critical: 'Risco critico',
}

export const TRUST_RECOMMENDATION_LABEL: Record<CreatorTrustRecommendedAction, string> = {
  none: 'Sem acao',
  review: 'Rever',
  set_cooldown: 'Aplicar cooldown',
  block_publishing: 'Bloquear publicacao',
  suspend_creator_ops: 'Suspender operacao',
}

export const REPORT_PRIORITY_LABEL: Record<AdminContentReportPriority, string> = {
  none: 'Sem flags',
  low: 'Flag baixa',
  medium: 'Flag media',
  high: 'Flag alta',
  critical: 'Flag critica',
}

export const AUTOMATED_SEVERITY_LABEL: Record<AdminContentAutomatedSeverity, string> = {
  none: 'Sem sinal auto',
  low: 'Sinal auto baixo',
  medium: 'Sinal auto medio',
  high: 'Sinal auto alto',
  critical: 'Sinal auto critico',
}

export const AUTOMATED_RULE_LABEL: Record<AdminContentAutomatedRule, string> = {
  spam: 'Spam',
  suspicious_link: 'Links suspeitos',
  flood: 'Flood',
  mass_creation: 'Criacao em massa',
}

const riskBadgeVariant = (riskLevel: CreatorRiskLevel): 'secondary' | 'outline' | 'destructive' => {
  if (riskLevel === 'critical') return 'destructive'
  if (riskLevel === 'high') return 'outline'
  return 'secondary'
}

const reportPriorityVariant = (
  priority: AdminContentReportPriority,
): 'secondary' | 'outline' | 'destructive' => {
  if (priority === 'critical') return 'destructive'
  if (priority === 'high' || priority === 'medium') return 'outline'
  return 'secondary'
}

const automatedSeverityVariant = (
  severity: AdminContentAutomatedSeverity,
): 'secondary' | 'outline' | 'destructive' => {
  if (severity === 'critical') return 'destructive'
  if (severity === 'high' || severity === 'medium') return 'outline'
  return 'secondary'
}

const progressToneClass = (value: number): string => {
  if (value <= 25) return 'bg-red-500/15 [&>div]:bg-red-500'
  if (value <= 50) return 'bg-amber-500/15 [&>div]:bg-amber-500'
  if (value <= 75) return 'bg-sky-500/15 [&>div]:bg-sky-500'
  return 'bg-emerald-500/15 [&>div]:bg-emerald-500'
}

export function RiskLevelBadge({
  riskLevel,
  score,
}: {
  riskLevel: CreatorRiskLevel
  score?: number
}) {
  return (
    <Badge
      variant={riskBadgeVariant(riskLevel)}
      className={cn(
        riskLevel === 'high' && 'border-amber-500/40 text-amber-700',
        riskLevel === 'medium' && 'border-sky-500/40 text-sky-700',
      )}
    >
      {CREATOR_RISK_LABEL[riskLevel]}
      {typeof score === 'number' ? ` · ${score}` : ''}
    </Badge>
  )
}

export function TrustScoreBar({ value, compact = false }: { value: number; compact?: boolean }) {
  const normalized = Math.max(0, Math.min(100, value))

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-muted-foreground">
        <span>Trust score</span>
        <span>{normalized}/100</span>
      </div>
      <Progress
        value={normalized}
        className={cn(progressToneClass(normalized), compact ? 'h-1.5' : 'h-2.5')}
      />
    </div>
  )
}

export function CreatorControlsSummary({
  controls,
  dense = false,
}: {
  controls: AdminCreatorControls
  dense?: boolean
}) {
  const controlBadges: Array<{ key: string; label: string; variant: 'outline' | 'destructive' }> =
    []

  if (controls.creationBlocked) {
    controlBadges.push({
      key: 'creationBlocked',
      label: 'Criacao bloqueada',
      variant: 'outline',
    })
  }
  if (controls.publishingBlocked) {
    controlBadges.push({
      key: 'publishingBlocked',
      label: 'Publicacao bloqueada',
      variant: 'destructive',
    })
  }
  if (controls.cooldownUntil) {
    controlBadges.push({
      key: 'cooldownActive',
      label: 'Cooldown ativo',
      variant: 'outline',
    })
  }

  if (controlBadges.length === 0) {
    return (
      <span
        className={cn('text-xs text-muted-foreground', !dense && 'inline-flex items-center gap-1')}
      >
        <ShieldCheck className="h-3.5 w-3.5" />
        Sem barreiras ativas
      </span>
    )
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {controlBadges.map((badge) => (
        <Badge
          key={badge.key}
          variant={badge.variant}
          className={cn(badge.variant === 'outline' && 'border-amber-500/40 text-amber-700')}
        >
          {badge.label}
        </Badge>
      ))}
    </div>
  )
}

export function ReportPriorityBadge({
  priority,
  openReports,
}: {
  priority: AdminContentReportPriority
  openReports?: number
}) {
  return (
    <Badge
      variant={reportPriorityVariant(priority)}
      className={cn(
        priority === 'high' && 'border-amber-500/40 text-amber-700',
        priority === 'medium' && 'border-sky-500/40 text-sky-700',
      )}
    >
      {REPORT_PRIORITY_LABEL[priority]}
      {typeof openReports === 'number' && openReports > 0 ? ` · ${openReports}` : ''}
    </Badge>
  )
}

export function AutomatedDetectionBadge({
  severity,
  score,
  active = true,
}: {
  severity: AdminContentAutomatedSeverity
  score?: number
  active?: boolean
}) {
  if (!active || severity === 'none') {
    return (
      <Badge variant="secondary" className="gap-1">
        <ShieldCheck className="h-3 w-3" />
        Sem sinal auto
      </Badge>
    )
  }

  return (
    <Badge
      variant={automatedSeverityVariant(severity)}
      className={cn(
        severity === 'high' && 'border-amber-500/40 text-amber-700',
        severity === 'medium' && 'border-sky-500/40 text-sky-700',
      )}
    >
      {AUTOMATED_SEVERITY_LABEL[severity]}
      {typeof score === 'number' && score > 0 ? ` · ${score}` : ''}
    </Badge>
  )
}

export function TrustRecommendationBadge({ action }: { action: CreatorTrustRecommendedAction }) {
  if (action === 'none') {
    return (
      <Badge variant="secondary" className="gap-1">
        <ShieldCheck className="h-3 w-3" />
        {TRUST_RECOMMENDATION_LABEL[action]}
      </Badge>
    )
  }

  return (
    <Badge
      variant={action === 'suspend_creator_ops' ? 'destructive' : 'outline'}
      className={cn(action !== 'suspend_creator_ops' && 'border-amber-500/40 text-amber-700 gap-1')}
    >
      {action === 'suspend_creator_ops' ? (
        <ShieldAlert className="h-3 w-3" />
      ) : (
        <AlertTriangle className="h-3 w-3" />
      )}
      {TRUST_RECOMMENDATION_LABEL[action]}
    </Badge>
  )
}

export function TrustReasonList({
  trustSignals,
  maxItems = 3,
}: {
  trustSignals: AdminCreatorTrustSignals | null
  maxItems?: number
}) {
  if (!trustSignals || trustSignals.reasons.length === 0) {
    return <p className="text-xs text-muted-foreground">Sem sinais de risco relevantes.</p>
  }

  return (
    <ul className="space-y-1 text-xs text-muted-foreground">
      {trustSignals.reasons.slice(0, maxItems).map((reason) => (
        <li key={reason}>{reason}</li>
      ))}
    </ul>
  )
}
