import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingStarsProps {
  rating: number
  className?: string
}

/**
 * Five-star rating display.
 * Uses market-bull colour — consistent across all card types.
 */
export function RatingStars({ rating, className }: RatingStarsProps) {
  const rounded = Math.round(Math.max(0, Math.min(5, rating)))

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={cn(
              'h-3.5 w-3.5',
              index < rounded ? 'fill-market-bull text-market-bull' : 'text-market-bull/35',
            )}
          />
        ))}
      </div>
      <span className="tabular-nums text-xs text-muted-foreground">{rating.toFixed(1)}</span>
    </div>
  )
}
