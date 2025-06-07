import { AlertTriangle, TrendingDown, DollarSign, Zap } from 'lucide-react'
import { Alert } from '../../../types/stocks'
import { ReactNode } from 'react'

// Define explicitamente o tipo esperado
export interface AlertItem {
  icon: ReactNode
  title: string
  description?: string
  severity: 'low' | 'medium' | 'high'
}

export function mapAlertsToAlertItems(alerts: Alert[]): AlertItem[] {
  return alerts.map((alert) => {
    let icon: ReactNode

    const title = alert.title.toLowerCase()

    if (title.includes('dívida')) {
      icon = <AlertTriangle className="w-5 h-5" />
    } else if (title.includes('lucro')) {
      icon = <TrendingDown className="w-5 h-5" />
    } else if (title.includes('dividendo')) {
      icon = <Zap className="w-5 h-5" />
    } else if (title.includes('caixa')) {
      icon = <DollarSign className="w-5 h-5" />
    } else {
      icon = <AlertTriangle className="w-5 h-5" />
    }

    return {
      ...alert,
      icon,
    }
  })
}
