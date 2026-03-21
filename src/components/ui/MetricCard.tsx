import type { HTMLAttributes, ReactNode } from 'react'
import { Info } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Badge } from './badge'
import { Card, CardContent } from './card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

export type MetricCardStatus = 'Direto' | 'Calculado' | 'N/A' | 'Sem dado' | 'Erro'

interface MetricCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  value: ReactNode
  status?: MetricCardStatus
  variationPercent?: number | null
  description?: string
}

const statusStyles: Record<MetricCardStatus, string> = {
  Direto: 'border-blue-500/40 bg-blue-500/10 text-blue-500',
  Calculado: 'border-amber-500/40 bg-amber-500/10 text-amber-500',
  'N/A': 'border-slate-500/30 bg-slate-500/10 text-slate-500',
  'Sem dado': 'border-slate-500/30 bg-slate-500/10 text-slate-500',
  Erro: 'border-red-500/40 bg-red-500/10 text-red-500',
}

function formatVariation(variationPercent: number): string {
  const sign = variationPercent > 0 ? '+' : ''
  return `${sign}${variationPercent.toFixed(2)}%`
}

/**
 * Exemplo de uso:
 * <MetricCard
 *   label="P/FFO"
 *   value="18.40x"
 *   status="Direto"
 *   variationPercent={-3.25}
 *   description="Preco da acao dividido pelo FFO por acao."
 * />
 */
export function MetricCard({
  label,
  value,
  status,
  variationPercent,
  description,
  className,
  ...props
}: MetricCardProps) {
  const showVariation = typeof variationPercent === 'number' && Number.isFinite(variationPercent)
  const variationClass =
    !showVariation || variationPercent === 0
      ? 'text-muted-foreground'
      : variationPercent > 0
        ? 'text-market-bull'
        : 'text-market-bear'

  return (
    <Card className={cn('border-border/60 bg-card/75', className)} {...props}>
      <CardContent className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-1.5">
            <p className="truncate text-xs text-muted-foreground">{label}</p>
            {description ? (
              <TooltipProvider delayDuration={120}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex h-4 w-4 items-center justify-center rounded-sm text-muted-foreground/65 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label="Descricao da metrica"
                    >
                      <Info className="h-3 w-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-64 whitespace-normal text-xs">
                    {description}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : null}
          </div>

          {status ? (
            <Badge
              variant="outline"
              className={cn(
                'shrink-0 rounded-full px-2 py-0 text-[10px] font-semibold tracking-wide',
                statusStyles[status],
              )}
            >
              {status}
            </Badge>
          ) : null}
        </div>

        <p className="text-3xl font-semibold tabular-nums leading-none">{value}</p>

        {showVariation ? (
          <p className={cn('text-sm font-medium tabular-nums leading-none', variationClass)}>
            {formatVariation(variationPercent)}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
