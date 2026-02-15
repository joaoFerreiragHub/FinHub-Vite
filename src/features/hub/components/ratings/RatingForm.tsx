import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui'
import { RatingStars } from '../common/RatingStars'
import { type ContentType } from '../../types'
import { getErrorMessage } from '@/lib/api/client'

const ratingFormSchema = z.object({
  rating: z.number().min(1, 'Selecione uma classificação').max(5),
  review: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
})

type RatingFormData = z.infer<typeof ratingFormSchema>

export interface RatingFormProps {
  /**
   * Tipo e ID do conteúdo alvo
   */
  targetType: ContentType
  targetId: string
  /**
   * Rating inicial (para edição)
   */
  initialRating?: number
  /**
   * Review inicial (para edição)
   */
  initialReview?: string
  /**
   * Callback ao submeter
   */
  onSubmit: (data: { rating: number; review?: string }) => Promise<void>
  /**
   * Callback ao cancelar
   */
  onCancel?: () => void
  /**
   * Texto do botão submit
   */
  submitText?: string
}

/**
 * Formulário para criar/editar rating
 *
 * @example
 * <RatingForm
 *   targetType={ContentType.ARTICLE}
 *   targetId="123"
 *   onSubmit={handleSubmitRating}
 * />
 */
export function RatingForm({
  initialRating,
  initialReview,
  onSubmit,
  onCancel,
  submitText = 'Publicar Avaliação',
}: RatingFormProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [rating, setRating] = useState(initialRating || 0)

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<RatingFormData>({
    resolver: zodResolver(ratingFormSchema),
    defaultValues: {
      rating: initialRating || 0,
      review: initialReview || '',
    },
  })

  const handleRatingChange = (newRating: number) => {
    setRating(newRating)
    setValue('rating', newRating)
  }

  const handleSubmit = async (data: RatingFormData) => {
    setServerError(null)

    try {
      await onSubmit({
        rating: data.rating,
        review: data.review || undefined,
      })
    } catch (error) {
      setServerError(getErrorMessage(error))
    }
  }

  return (
    <form onSubmit={handleFormSubmit(handleSubmit)} className="space-y-4">
      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-medium">Erro ao publicar avaliação</p>
          <p className="mt-1">{serverError}</p>
        </div>
      )}

      {/* Rating Stars */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Classificação <span className="text-red-500">*</span>
        </label>
        <RatingStars rating={rating} size="lg" interactive onChange={handleRatingChange} />
        {errors.rating && <p className="text-sm text-red-600">{errors.rating.message}</p>}
      </div>

      {/* Review Text */}
      <div className="space-y-2">
        <label htmlFor="review" className="text-sm font-medium">
          Escreva uma avaliação (opcional)
        </label>
        <textarea
          id="review"
          rows={4}
          placeholder="Partilhe a sua experiência..."
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-all duration-200 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          {...register('review')}
        />
        {errors.review && <p className="text-sm text-red-600">{errors.review.message}</p>}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button type="submit" variant="default" isLoading={isSubmitting} disabled={rating === 0}>
          {submitText}
        </Button>

        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  )
}
