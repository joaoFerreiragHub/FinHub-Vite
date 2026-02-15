// src/components/book/BookCard.tsx

import { useState } from 'react'

import { Rating, RatingStars } from '@/features/hub'
import BookModal from './BookModal'
import { Book, Review } from '@/features/hub/books/types/book'
import { Card, CardContent } from '@/components/ui'
import { AspectRatio } from '@/components/ui'

interface BookCardProps {
  book: Book
  averageRating?: number
  ratings?: Rating[]
  reviews?: Review[]
}

export function BookCard({ book, averageRating = 0, ratings = [], reviews = [] }: BookCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Card
        onClick={() => setOpen(true)}
        className="cursor-pointer w-[160px] sm:w-[180px] rounded-2xl border bg-card transition-all duration-300 ease-in-out
                  hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:border-primary"
      >
        <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
          <AspectRatio ratio={2 / 3} className="bg-muted rounded-md overflow-hidden w-full">
            <img
              src={book.coverImage || '/placeholder-book.jpg'}
              alt={`Capa de ${book.title}`}
              className="object-cover w-full h-full"
            />
          </AspectRatio>
          <div className="font-medium text-sm line-clamp-2">{book.title}</div>
          <div className="flex items-center justify-center gap-1">
            <RatingStars rating={averageRating} size="sm" />
          </div>
        </CardContent>
      </Card>

      <BookModal
        open={open}
        onClose={() => setOpen(false)}
        book={book}
        ratings={ratings}
        reviews={reviews}
        averageRating={averageRating}
      />
    </>
  )
}
