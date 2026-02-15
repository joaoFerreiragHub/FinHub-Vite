import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { type RatingStats } from '../../types'
import { RatingStars } from '../common/RatingStars'

export interface RatingDistributionProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Estatísticas de ratings
   */
  stats: RatingStats
  /**
   * Tamanho do componente
   */
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Componente de distribuição de ratings
 * Mostra gráfico de barras com percentagens de cada estrela
 *
 * @example
 * <RatingDistribution stats={ratingStats} />
 */
export function RatingDistribution({
  stats,
  size = 'md',
  className,
  ...props
}: RatingDistributionProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  return (
    <div className={cn('space-y-4', sizeClasses[size], className)} {...props}>
      {/* Overall Rating */}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-5xl font-bold">{stats.averageRating.toFixed(1)}</div>
          <RatingStars rating={stats.averageRating} size={size} />
          <div className="mt-1 text-sm text-muted-foreground">
            {stats.totalRatings} {stats.totalRatings === 1 ? 'avaliação' : 'avaliações'}
          </div>
        </div>

        {/* Distribution bars */}
        <div className="flex-1 space-y-1">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = stats.distribution[stars as keyof typeof stats.distribution]
            const percentage = stats.percentages[stars as keyof typeof stats.percentages]

            return (
              <div key={stars} className="flex items-center gap-2 text-sm">
                {/* Star number */}
                <span className="w-8 text-right font-medium">{stars}★</span>

                {/* Progress bar */}
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-yellow-400 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {/* Percentage */}
                <span className="w-12 text-right text-muted-foreground">
                  {percentage.toFixed(0)}%
                </span>

                {/* Count */}
                <span className="w-12 text-right text-xs text-muted-foreground">({count})</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
