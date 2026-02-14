import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

export interface RatingStarsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * Rating atual (0-5)
   */
  rating: number
  /**
   * Tamanho das estrelas
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Se é interativo (pode clicar para votar)
   */
  interactive?: boolean
  /**
   * Callback quando rating muda (apenas se interactive=true)
   */
  onChange?: (rating: number) => void
  /**
   * Mostrar número ao lado
   */
  showCount?: boolean
  /**
   * Total de ratings (para mostrar ao lado)
   */
  count?: number
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
}

/**
 * Componente de estrelas de rating
 *
 * @example
 * // Read-only
 * <RatingStars rating={4.5} showCount count={120} />
 *
 * // Interactive
 * <RatingStars
 *   rating={userRating}
 *   interactive
 *   onChange={setUserRating}
 * />
 */
export function RatingStars({
  rating,
  size = 'md',
  interactive = false,
  onChange,
  showCount = false,
  count,
  className,
  ...props
}: RatingStarsProps) {
  const handleClick = (starValue: number) => {
    if (interactive && onChange) {
      onChange(starValue)
    }
  }

  const roundedRating = Math.round(rating * 2) / 2 // Arredondar para 0.5

  return (
    <div className={cn('flex items-center gap-1', className)} {...props}>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((starValue) => {
          const fillPercentage =
            roundedRating >= starValue
              ? 100
              : roundedRating >= starValue - 0.5
              ? 50
              : 0

          return (
            <button
              key={starValue}
              type="button"
              disabled={!interactive}
              onClick={() => handleClick(starValue)}
              className={cn(
                'relative',
                interactive && 'cursor-pointer transition-transform hover:scale-110',
                !interactive && 'cursor-default'
              )}
            >
              {/* Estrela vazia (background) */}
              <svg
                className={cn(sizeClasses[size], 'text-gray-300')}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>

              {/* Estrela preenchida (overlay) */}
              <svg
                className={cn(
                  sizeClasses[size],
                  'absolute left-0 top-0 text-yellow-400',
                  'transition-all duration-200'
                )}
                fill="currentColor"
                viewBox="0 0 20 20"
                style={{
                  clipPath: `inset(0 ${100 - fillPercentage}% 0 0)`,
                }}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          )
        })}
      </div>

      {/* Rating numérico e contagem */}
      {showCount && (
        <span className="text-sm text-muted-foreground">
          {rating.toFixed(1)}
          {count !== undefined && ` (${count})`}
        </span>
      )}
    </div>
  )
}
