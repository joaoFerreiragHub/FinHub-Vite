import type { LucideIcon } from 'lucide-react'
import { PackageOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface EmptyStateProps {
  title?: string
  description?: string
  /** Lucide icon displayed above the title. Defaults to PackageOpen. */
  icon?: LucideIcon
  /** Optional action element (Button, link…). */
  action?: React.ReactNode
  /**
   * `card`     — solid card background, used inside page sections (default).
   * `bordered` — dashed border, used inside content list grids.
   */
  variant?: 'card' | 'bordered'
  className?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Unified empty-state block.
 *
 * Replaces the three different inline "no results" patterns found across
 * CreatorsListPage, PublicDirectoryPage and ContentList.
 */
export function EmptyState({
  title = 'Nenhum resultado encontrado',
  description = 'Tenta ajustar os filtros ou volta mais tarde.',
  icon: Icon = PackageOpen,
  action,
  variant = 'card',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg p-10 text-center',
        variant === 'card' && 'border border-border/70 bg-card/70',
        variant === 'bordered' &&
          'border border-dashed border-muted-foreground/25 bg-muted/10 p-12',
        className,
      )}
    >
      <Icon className="mb-4 h-10 w-10 text-muted-foreground/50" />
      <h3 className="mb-1.5 text-sm font-semibold text-foreground sm:text-base">{title}</h3>
      {description && (
        <p className="mx-auto max-w-xs text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
