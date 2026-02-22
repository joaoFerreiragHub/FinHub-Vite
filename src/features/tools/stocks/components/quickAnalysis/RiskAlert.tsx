import { memo } from 'react'
import { AlertTriangle, TrendingDown, DollarSign, Zap, CheckCircle2, BarChart2 } from 'lucide-react'
import { cn } from '@/lib/utils'

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

const CHECKED_CRITERIA = [
  { icon: <AlertTriangle className="w-3 h-3" />, label: 'Endividamento' },
  { icon: <TrendingDown className="w-3 h-3" />, label: 'Lucros' },
  { icon: <BarChart2 className="w-3 h-3" />, label: 'Receita' },
  { icon: <DollarSign className="w-3 h-3" />, label: 'Fluxo de Caixa' },
  { icon: <Zap className="w-3 h-3" />, label: 'Dividendos' },
]

export const RiskAlert = memo(function RiskAlert({ alerts = defaultAlerts }: RiskAlertProps) {
  if (!alerts.length) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/40 dark:border-green-900 px-4 py-2.5 text-sm text-green-700 dark:text-green-400">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-medium">Sem alertas de risco detectados</span>
        </div>
        <div className="mt-1.5 flex flex-wrap gap-1.5 pl-6">
          {CHECKED_CRITERIA.map((c) => (
            <span
              key={c.label}
              className="inline-flex items-center gap-1 rounded-full border border-green-300 dark:border-green-800 bg-green-100 dark:bg-green-900/40 px-2 py-0.5 text-xs opacity-80"
            >
              {c.icon}
              {c.label}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert, i) => (
        <div
          key={i}
          className={cn(
            'flex items-start gap-3 rounded-md border px-4 py-3 text-sm',
            bgBySeverity[alert.severity],
          )}
        >
          <div className="mt-1">{alert.icon}</div>
          <div>
            <div className="font-semibold">{alert.title}</div>
            {alert.description && <p className="text-xs opacity-90">{alert.description}</p>}
          </div>
        </div>
      ))}
    </div>
  )
})
