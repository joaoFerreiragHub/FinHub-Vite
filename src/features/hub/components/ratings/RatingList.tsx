import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { type RatingListResponse } from '../../types'
import { RatingCard, type RatingCardProps } from './RatingCard'
import { Button } from '@/components/ui'

export interface RatingListProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Resposta da lista de ratings
   */
  response: RatingListResponse
  /**
   * Props extras para RatingCard
   */
  cardProps?: Partial<RatingCardProps>
  /**
   * Callback ao carregar mais
   */
  onLoadMore?: () => void | Promise<void>
  /**
   * Estado de loading
   */
  isLoading?: boolean
  /**
   * Filtro de ordenação
   */
  sortBy?: 'recent' | 'helpful' | 'rating'
  /**
   * Callback ao mudar ordenação
   */
  onSortChange?: (sortBy: 'recent' | 'helpful' | 'rating') => void
}

/**
 * Lista de ratings com paginação
 *
 * @example
 * <RatingList
 *   response={ratingListResponse}
 *   onLoadMore={handleLoadMore}
 *   cardProps={{ showHelpful: true }}
 * />
 */
export function RatingList({
  response,
  cardProps,
  onLoadMore,
  isLoading = false,
  sortBy = 'recent',
  onSortChange,
  className,
  ...props
}: RatingListProps) {
  if (response.items.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 bg-muted/10 p-12 text-center">
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
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
        <h3 className="mb-2 text-lg font-semibold">Nenhuma avaliação ainda</h3>
        <p className="text-sm text-muted-foreground">Seja o primeiro a avaliar este conteúdo!</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)} {...props}>
      {/* Header with sort */}
      {onSortChange && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Avaliações ({response.total})</h3>

          <div className="flex gap-2">
            <Button
              variant={sortBy === 'recent' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onSortChange('recent')}
            >
              Recentes
            </Button>
            <Button
              variant={sortBy === 'helpful' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onSortChange('helpful')}
            >
              Úteis
            </Button>
            <Button
              variant={sortBy === 'rating' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onSortChange('rating')}
            >
              Classificação
            </Button>
          </div>
        </div>
      )}

      {/* Rating cards */}
      <div className="space-y-4">
        {response.items.map((rating) => (
          <RatingCard key={rating.id} rating={rating} {...cardProps} />
        ))}
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="animate-pulse space-y-3 rounded-lg border border-border bg-card p-6"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/4 rounded bg-muted" />
                  <div className="h-3 w-1/3 rounded bg-muted" />
                </div>
              </div>
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-2/3 rounded bg-muted" />
            </div>
          ))}
        </div>
      )}

      {/* Load more */}
      {response.hasMore && !isLoading && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={onLoadMore}>
            Carregar mais avaliações
          </Button>
        </div>
      )}
    </div>
  )
}
