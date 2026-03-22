import { cn } from '@/lib/utils'
import LoadingSpinner from '@/components/ui/loading-spinner'

// ─── Types ────────────────────────────────────────────────────────────────────

interface LoadingSkeletonProps {
  /**
   * `spinner` — centred LoadingSpinner (first load, full section replacement).
   * `cards`   — grid of animate-pulse skeleton cards (grid-based content lists).
   */
  variant?: 'spinner' | 'cards'
  /** Number of skeleton cards when variant="cards". Default 6. */
  count?: number
  /** Column layout applied to the skeleton grid. Default 3. */
  columns?: 2 | 3 | 4
  className?: string
}

const GRID_CLASSES: Record<2 | 3 | 4, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-2 xl:grid-cols-3',
  4: 'md:grid-cols-2 xl:grid-cols-4',
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Unified loading placeholder.
 *
 * - `variant="spinner"` — use for full-section replacement (list pages, initial load).
 * - `variant="cards"`   — use when content is displayed as a card grid.
 */
export function LoadingSkeleton({
  variant = 'spinner',
  count = 6,
  columns = 3,
  className,
}: LoadingSkeletonProps) {
  if (variant === 'spinner') {
    return (
      <div className={cn('flex justify-center py-20', className)}>
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className={cn('grid gap-4', GRID_CLASSES[columns], className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={`skeleton-${i}`}
          className="animate-pulse space-y-4 rounded-lg border border-border bg-card p-6"
        >
          <div className="h-44 rounded bg-muted" />
          <div className="h-5 w-3/4 rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-2/3 rounded bg-muted" />
        </div>
      ))}
    </div>
  )
}
