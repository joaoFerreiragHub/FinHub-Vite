import { useEffect, useState } from 'react'

import { MessageSquareText } from 'lucide-react'

import { Review } from '../../types/book'

interface ReviewsDisplayProps {
  reviews: Review[]
}

export function ReviewsDisplay({ reviews: initialReviews }: ReviewsDisplayProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)

  useEffect(() => {
    setReviews(initialReviews)
  }, [initialReviews])

  if (!reviews?.length) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <MessageSquareText className="w-4 h-4" /> Sem reviews disponíveis.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review, index) => (
        <div key={index} className="rounded-md border p-4 bg-background shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">
              {review.userId?.name || review.userId?._id || 'Utilizador'}
            </span>
            {review.createdAt && (
              <span className="text-xs text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
          <p className="text-sm text-foreground whitespace-pre-wrap">{review.review}</p>
        </div>
      ))}
    </div>
  )
}
