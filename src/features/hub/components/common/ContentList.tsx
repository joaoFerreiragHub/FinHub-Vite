import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { type BaseContent } from '../../types'
import { ContentCard, type ContentCardProps } from './ContentCard'
import { Button } from '@/components/ui'

export interface ContentListProps<T extends BaseContent = BaseContent>
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * Lista de conteúdos
   */
  items: T[]
  /**
   * Variante do grid
   */
  variant?: 'grid' | 'list' | 'masonry'
  /**
   * Número de colunas (apenas para grid)
   */
  columns?: 2 | 3 | 4
  /**
   * Props para passar para cada ContentCard
   */
  cardProps?: Partial<ContentCardProps>
  /**
   * Estado de loading
   */
  isLoading?: boolean
  /**
   * Mostrar paginação/load more
   */
  showPagination?: boolean
  /**
   * Há mais itens para carregar
   */
  hasMore?: boolean
  /**
   * Callback para carregar mais
   */
  onLoadMore?: () => void | Promise<void>
  /**
   * Componente de empty state
   */
  emptyState?: React.ReactNode
}

/**
 * Lista genérica de conteúdo do HUB
 *
 * Suporta diferentes layouts (grid, list, masonry) e paginação
 *
 * @example
 * <ContentList
 *   items={articles}
 *   variant="grid"
 *   columns={3}
 *   hasMore={hasMore}
 *   onLoadMore={loadMore}
 * />
 */
export function ContentList<T extends BaseContent = BaseContent>({
  items,
  variant = 'grid',
  columns = 3,
  cardProps,
  isLoading = false,
  showPagination = false,
  hasMore = false,
  onLoadMore,
  emptyState,
  className,
  ...props
}: ContentListProps<T>) {
  // Empty state
  if (!isLoading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 bg-muted/10 p-12 text-center">
        {emptyState || (
          <>
            <svg
              className="mb-4 h-16 w-16 text-muted-foreground/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mb-2 text-lg font-semibold">Nenhum conteúdo encontrado</h3>
            <p className="text-sm text-muted-foreground">
              Tente ajustar os filtros ou volte mais tarde
            </p>
          </>
        )}
      </div>
    )
  }

  const gridClasses = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn('space-y-6', className)} {...props}>
      {/* Content Grid/List */}
      <div
        className={cn(
          variant === 'grid' && `grid gap-6 ${gridClasses[columns]}`,
          variant === 'list' && 'flex flex-col gap-4',
          variant === 'masonry' && 'columns-1 gap-6 md:columns-2 lg:columns-3',
        )}
      >
        {items.map((item) => (
          <ContentCard key={item.id} content={item} {...cardProps} />
        ))}

        {/* Loading skeletons */}
        {isLoading &&
          Array.from({ length: columns * 2 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="animate-pulse space-y-4 rounded-lg border border-border bg-card p-6"
            >
              <div className="h-48 rounded bg-muted" />
              <div className="h-6 w-3/4 rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-2/3 rounded bg-muted" />
            </div>
          ))}
      </div>

      {/* Load More Button */}
      {showPagination && hasMore && !isLoading && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" size="lg" onClick={onLoadMore} disabled={isLoading}>
            Carregar mais
          </Button>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && items.length > 0 && (
        <div className="flex justify-center py-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  )
}
