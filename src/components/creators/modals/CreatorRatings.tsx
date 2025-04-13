import { useState } from 'react'
import { Creator as CreatorType } from '../../../types/creator'
import { RatingDisplay } from '../../ratings/RatingDisplay'
import { RatingForm } from '../../ratings/RatingForm'

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
        <RatingDisplay rating={creator.averageRating || 0} size={18} />
      </div>

      <div className="pt-4 border-t">
        <RatingForm
          rateableType="Creator"
          rateableId={creator._id}
          userRating={userRating}
          setUserRating={setUserRating}
          submitRating={submitRating}
        />
      </div>

      {/* <div className="pt-4 border-t">
        <h4 className="font-semibold text-lg mb-2">Opiniões</h4>
        <ReviewsDisplay reviews={[]} />
      </div> */}
    </div>
  )
}
