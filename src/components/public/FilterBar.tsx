import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SortOption {
  label: string
  value: string
}

interface ToggleFilter {
  label: string
  key: string
  active: boolean
}

export interface FilterBarProps {
  sortOptions: SortOption[]
  sortValue: string
  onSortChange: (value: string) => void
  toggleFilters?: ToggleFilter[]
  onToggleFilter?: (key: string) => void
  resultCount?: number
  resultLabel?: string
  onClearFilters?: () => void
  hasActiveFilters?: boolean
  children?: React.ReactNode
}

export function FilterBar({
  sortOptions,
  sortValue,
  onSortChange,
  toggleFilters,
  onToggleFilter,
  resultCount,
  resultLabel = 'resultados',
  onClearFilters,
  hasActiveFilters,
  children,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      {/* Sort dropdown */}
      <select
        value={sortValue}
        onChange={(e) => onSortChange(e.target.value)}
        className="filter-bar__pill bg-background/60 border-border/50 pr-7 appearance-none cursor-pointer"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Separator */}
      <div className="h-5 w-px bg-border/50 flex-shrink-0 hidden sm:block" />

      {/* Toggle filters */}
      {toggleFilters?.map((filter) => (
        <button
          key={filter.key}
          type="button"
          onClick={() => onToggleFilter?.(filter.key)}
          className={cn('filter-bar__pill', filter.active && 'filter-bar__pill--active')}
        >
          {filter.label}
        </button>
      ))}

      {children}

      {/* Spacer */}
      <div className="flex-1 min-w-0" />

      {/* Result count */}
      {resultCount !== undefined && (
        <span className="flex-shrink-0 text-xs sm:text-sm text-muted-foreground">
          {resultCount} {resultCount === 1 ? resultLabel.replace(/s$/, '') : resultLabel}
        </span>
      )}

      {/* Clear filters */}
      {hasActiveFilters && onClearFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="filter-bar__pill text-destructive border-destructive/30 hover:bg-destructive/10 flex items-center gap-1"
        >
          <X className="h-3 w-3" />
          Limpar
        </button>
      )}
    </div>
  )
}
