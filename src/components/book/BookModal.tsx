// src/components/book/BookModal.tsx

import { useEffect, useState } from 'react'

import CommentSection from './CommentSection'
import { useUserStore } from '../../stores/useUserStore'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { AspectRatio } from '../ui/aspect-ratio'
import { Book, Rating, Review } from '../../types/book'
import { RatingDisplay } from '../ratings/RatingDisplay'

import { ReviewsDisplay } from '../ratings/ReviewsDisplay'
import { RatingForm } from '../ratings/RatingForm'

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
  const user = useUserStore((state) => state.user)
  const role = useUserStore((state) => state.getRole())
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
                <strong>Descrição:</strong> {book.summary || 'Não disponível.'}
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
              <CommentSection bookId={book._id} />
            </TabsContent>

            <TabsContent value="avaliar">
              {submitRating && setUserRating ? (
                <div className="space-y-4">
                  <RatingForm
                    rateableType="Book"
                    rateableId={book._id}
                    userRating={userRating}
                    submitRating={submitRating}
                    setUserRating={setUserRating}
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
