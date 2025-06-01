import { memo } from 'react'
import { AlertTriangle, TrendingDown, DollarSign, Zap } from 'lucide-react'
import { cn } from '../../../lib/utils'

interface AlertItem {
  icon: React.ReactNode
  title: string
  description?: string
  severity: 'low' | 'medium' | 'high'
}

interface RiskAlertProps {
  alerts?: AlertItem[]
}

const bgBySeverity = {
  low: 'bg-yellow-50 border-yellow-300 text-yellow-800',
  medium: 'bg-orange-50 border-orange-300 text-orange-800',
  high: 'bg-red-50 border-red-400 text-red-800',
}

const defaultAlerts: AlertItem[] = [
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    title: 'Endividamento elevado',
    description: 'A dívida excede 80% dos ativos totais.',
    severity: 'high',
  },
  {
    icon: <TrendingDown className="w-5 h-5" />,
    title: 'Lucros em queda',
    description: 'EPS a cair há 3 anos consecutivos.',
    severity: 'medium',
  },
  {
    icon: <DollarSign className="w-5 h-5" />,
    title: 'Fluxo de caixa negativo',
    description: 'FCF negativo nos últimos 2 anos.',
    severity: 'medium',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Dividendos inconsistentes',
    description: 'Histórico irregular de distribuição.',
    severity: 'low',
  },
]

export const RiskAlert = memo(function RiskAlert({
  alerts = defaultAlerts,
}: RiskAlertProps) {
  if (!alerts.length) {
    return (
      <p className="text-muted-foreground text-sm">
        Sem alertas de risco no momento.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert, i) => (
        <div
          key={i}
          className={cn(
            'flex items-start gap-3 rounded-md border px-4 py-3 text-sm',
            bgBySeverity[alert.severity]
          )}
        >
          <div className="mt-1">{alert.icon}</div>
          <div>
            <div className="font-semibold">{alert.title}</div>
            {alert.description && (
              <p className="text-xs opacity-90">{alert.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
})
