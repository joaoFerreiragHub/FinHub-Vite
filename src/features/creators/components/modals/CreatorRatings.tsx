import { useState } from 'react'
import { Creator as CreatorType } from '@/features/creators/types/creator'
import { RatingDisplay, RatingForm } from '~/features/hub'
import { type ContentType } from '@/features/hub/types'

interface CreatorRatingsProps {
  creator: CreatorType
  readOnly?: boolean
}

export function CreatorRatings({ creator, readOnly = false }: CreatorRatingsProps) {
  const [userRating, setUserRating] = useState<number | null>(null)

  const submitRating = async (_type: string, _id: string, rating: number) => {
    setUserRating(rating)
  }

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div>
        <h4 className="font-semibold text-lg mb-1">Avaliacao geral</h4>
        <RatingDisplay rating={creator.averageRating || 0} />
      </div>

      {!readOnly ? (
        <div className="pt-4 border-t">
          <RatingForm
            targetType={'creator' as ContentType}
            targetId={creator._id}
            initialRating={userRating ?? undefined}
            onSubmit={async ({ rating, review }) => {
              await submitRating('Creator', creator._id, rating, review)
            }}
          />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground pt-2">
          Preview em modo leitura: a submissao de avaliacao esta desativada.
        </p>
      )}
    </div>
  )
}
