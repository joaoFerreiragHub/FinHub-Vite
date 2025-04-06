import { Star } from 'lucide-react'

interface RatingDisplayProps {
  rating: number
  maxRating?: number
  size?: number
}

export const RatingDisplay = ({ rating, maxRating = 5, size = 16 }: RatingDisplayProps) => {
  const filledStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = maxRating - filledStars - (hasHalfStar ? 1 : 0)

  const starClass =
    'rounded-full p-1 bg-yellow-400/10 dark:bg-yellow-300/10 text-yellow-500 dark:text-yellow-300'

  return (
    <div className="flex items-center gap-1" aria-label={`Rating: ${rating.toFixed(1)}`}>
      {[...Array(filledStars)].map((_, i) => (
        <span key={`filled-${i}`} className={starClass}>
          <Star fill="currentColor" stroke="none" size={size} />
        </span>
      ))}

      {hasHalfStar && (
        <span className={starClass}>
          <Star fill="currentColor" stroke="none" size={size} className="opacity-50" />
        </span>
      )}

      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="text-border dark:text-border/80">
          <Star fill="none" stroke="currentColor" size={size} />
        </span>
      ))}

      <span className="ml-2 text-sm text-muted-foreground">{rating.toFixed(1)}</span>
    </div>
  )
}
