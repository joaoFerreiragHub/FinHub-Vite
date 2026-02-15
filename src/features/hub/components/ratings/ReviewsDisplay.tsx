/**
 * ReviewsDisplay - Componente para exibir lista de reviews
 */
import { Review } from '@/features/hub/books/types/book'

interface ReviewsDisplayProps {
  reviews: Review[]
}

export function ReviewsDisplay({ reviews }: ReviewsDisplayProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Ainda não há avaliações.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Avaliações</h3>
      <div className="space-y-3">
        {reviews.map((review, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="font-medium">{review.userId.name}</div>
              {review.createdAt && (
                <span className="text-sm text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString('pt-PT')}
                </span>
              )}
            </div>
            <p className="text-sm">{review.review}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
