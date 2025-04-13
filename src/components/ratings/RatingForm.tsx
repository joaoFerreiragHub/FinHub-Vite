// src/components/ratings/RatingForm.tsx

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import clsx from 'clsx'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'

interface RatingFormProps {
  rateableType: string
  rateableId: string
  userRating: number | null
  submitRating: (type: string, id: string, rating: number, review?: string) => Promise<void>
  setUserRating: (value: number | null) => void
}

export function RatingForm({
  rateableType,
  rateableId,
  userRating,
  submitRating,
  setUserRating,
}: RatingFormProps) {
  const [rating, setRating] = useState<number>(userRating || 0)
  const [hovered, setHovered] = useState<number>(0)
  const [review, setReview] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    setRating(userRating || 0)
  }, [userRating])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    if ((rating <= 2 || rating > 3) && !review.trim()) {
      setMessage('Por favor, adiciona uma opinião para avaliações abaixo de 2 ou acima de 3.')
      return
    }

    try {
      setIsSubmitting(true)
      await submitRating(rateableType, rateableId, rating, review)
      setMessage('Avaliação submetida com sucesso!')
      setUserRating(rating)
      setReview('')
    } catch (error) {
      console.error('Erro ao submeter avaliação:', error)
      setMessage('Erro ao submeter avaliação. Tenta novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-left text-base font-medium">Dá a tua avaliação</div>

      <div className="flex gap-2">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <Star
              key={value}
              className={clsx('w-6 h-6 cursor-pointer transition-colors', {
                'text-yellow-500 fill-yellow-500': value <= (hovered || rating),
                'text-muted-foreground': value > (hovered || rating),
              })}
              onClick={() => setRating(value)}
              onMouseEnter={() => setHovered(value)}
              onMouseLeave={() => setHovered(0)}
            />
          ))}
        </div>
      </div>

      {message && (
        <p
          className={clsx('text-sm', {
            'text-red-500': message.toLowerCase().includes('erro'),
            'text-green-600': message.toLowerCase().includes('sucesso'),
          })}
        >
          {message}
        </p>
      )}

      <div>
        <label htmlFor="review" className="block text-sm font-medium mb-1">
          Dá a tua opinião
        </label>
        <Textarea
          id="review"
          placeholder="Escreve a tua opinião..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      <div className="text-right">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'A enviar...' : 'Submeter'}
        </Button>
      </div>
    </form>
  )
}
