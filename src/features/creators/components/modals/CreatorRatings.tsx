import { useState } from 'react'
import { Creator as CreatorType } from '@/features/creators/types/creator'
import { RatingDisplay, RatingForm } from '~/features/hub'
import { type ContentType } from '@/features/hub/types'

interface CreatorRatingsProps {
  creator: CreatorType
}

export function CreatorRatings({ creator }: CreatorRatingsProps) {
  const [userRating, setUserRating] = useState<number | null>(null)

  const submitRating = async (type: string, id: string, rating: number, review?: string) => {
    console.log('Enviar avaliação →', { type, id, rating, review })
  }

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div>
        <h4 className="font-semibold text-lg mb-1">Avaliação Geral</h4>
        <RatingDisplay rating={creator.averageRating || 0} />
      </div>

      <div className="pt-4 border-t">
        <RatingForm
          targetType={'creator' as ContentType}
          targetId={creator._id}
          initialRating={userRating ?? undefined}
          onSubmit={async ({ rating, review }) => {
            await submitRating('Creator', creator._id, rating, review)
            setUserRating(rating)
          }}
        />
      </div>

      {/* <div className="pt-4 border-t">
        <h4 className="font-semibold text-lg mb-2">Opiniões</h4>
        <ReviewsDisplay reviews={[]} />
      </div> */}
    </div>
  )
}
