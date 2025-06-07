// components/IndicatorValuePro.tsx
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip'

interface IndicatorValueProProps {
  score: 'good' | 'medium' | 'bad'
  tooltip: string
  // 🔴 já não precisas de "value"
}


export function IndicatorValuePro({ score, tooltip }: IndicatorValueProProps) {
  const colorClass = {
    good: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    bad: 'bg-red-100 text-red-800',
  }[score]

  const icon = {
    good: <CheckCircle className="w-4 h-4" />,
    medium: <AlertCircle className="w-4 h-4" />,
    bad: <XCircle className="w-4 h-4" />,
  }[score]

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
          {icon}

        </span>
      </TooltipTrigger>
      <TooltipContent side="top">
        <span className="max-w-[200px] text-sm text-muted-foreground">{tooltip}</span>
      </TooltipContent>
    </Tooltip>
  )
}
