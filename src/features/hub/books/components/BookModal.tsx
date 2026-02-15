// src/components/book/BookModal.tsx

import { useEffect, useState } from 'react'

import CommentSection from './CommentSection'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui'

import { RatingDisplay } from '@/features/hub/components/ratings/RatingDisplay'
import { ReviewsDisplay } from '@/features/hub/components/ratings/ReviewsDisplay'
import { RatingForm } from '@/features/hub/components/ratings/RatingForm'

import { ContentType, Rating } from '@/features/hub/types'
import { AspectRatio } from '@radix-ui/react-aspect-ratio'
import { Book, Review } from '~/features/hub/books/types'

interface BookModalProps {
  open: boolean
  onClose: () => void
  book: Book
  ratings?: Rating[]
  reviews?: Review[]
  averageRating?: number
  userRating?: number | null
  setUserRating?: (value: number | null) => void
  submitRating?: (
    rateableType: string,
    rateableId: string,
    rating: number,
    review?: string,
  ) => Promise<void>
}

export default function BookModal({
  open,
  onClose,
  book,
  ratings = [],
  reviews = [],
  averageRating = 0,
  userRating = null,
  setUserRating,
  submitRating,
}: BookModalProps) {
  const user = useAuthStore((state) => state.user)
  const role = useAuthStore((state) => state.getRole())
  const [activeTab, setActiveTab] = useState('sobre')
  const [visitorModal, setVisitorModal] = useState(false)

  useEffect(() => {
    if (!ratings.length && setUserRating) {
      setUserRating(null)
    }
  }, [ratings, setUserRating])

  const handleRateClick = () => {
    if (!user || role === 'visitor') {
      setVisitorModal(true)
    } else {
      setActiveTab('avaliar')
    }
  }

  const redirectToLogin = () => {
    setVisitorModal(false)
    window.location.href = '/login'
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <DialogHeader className="flex justify-between items-center p-4 border-b">
          <DialogTitle className="text-xl font-semibold">{book.title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <AspectRatio ratio={2 / 3} className="bg-muted rounded-md overflow-hidden">
            <img
              src={book.coverImage}
              alt={`Capa de ${book.title}`}
              className="object-cover w-full h-full"
            />
          </AspectRatio>

          <Tabs
            defaultValue={activeTab}
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sobre">Sobre</TabsTrigger>
              <TabsTrigger value="comentarios">Comentários</TabsTrigger>
              <TabsTrigger value="avaliar">Avaliar</TabsTrigger>
            </TabsList>

            <TabsContent value="sobre" className="space-y-3">
              <p>
                <strong>Autor:</strong> {book.author}
              </p>
              <p>
                <strong>Descrição:</strong> {book.description || 'Não disponível.'}
              </p>
              <div className="mt-2">
                <RatingDisplay rating={averageRating} />
              </div>
              {Array.isArray(book.genres) && book.genres.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {book.genres.map((genre) => (
                    <Badge key={genre} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="mt-4">
                <Button variant="secondary" onClick={handleRateClick}>
                  Avaliar Livro
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="comentarios">
              <CommentSection bookId={book.id} />
            </TabsContent>

            <TabsContent value="avaliar">
              {submitRating && setUserRating ? (
                <div className="space-y-4">
                  <RatingForm
                    targetType={ContentType.BOOK}
                    targetId={book.id}
                    initialRating={userRating ?? undefined}
                    onSubmit={async ({ rating, review }) => {
                      await submitRating('Book', book.id, rating, review)
                      setUserRating(rating)
                    }}
                  />
                  <ReviewsDisplay reviews={reviews} />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Login necessário para avaliar.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>

      {visitorModal && (
        <Dialog open={visitorModal} onOpenChange={setVisitorModal}>
          <DialogContent className="max-w-md text-center">
            <DialogHeader>
              <DialogTitle>Acesso Restrito</DialogTitle>
            </DialogHeader>
            <p className="mb-4">Precisas de fazer login para avaliar este livro.</p>
            <div className="flex justify-center gap-4">
              <Button onClick={redirectToLogin}>Login</Button>
              <Button variant="secondary" onClick={() => setVisitorModal(false)}>
                Cancelar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  )
}
