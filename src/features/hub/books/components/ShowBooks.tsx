// src/components/book/ShowBooks.tsx

import { useState } from 'react'
import { BookCard } from './BookCard'
import { Button } from '@/components/ui'
import { Book } from '@/features/hub/books/types/book'

export default function ShowBooks() {
  const [allBooks] = useState<Book[]>([])

  return (
    <div className="px-6 py-12 max-w-6xl mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-center">📚 Livros Recomendados</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {allBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            averageRating={book.averageRating}
            reviews={book.reviews}
          />
        ))}
      </div>

      <div className="text-center mt-6">
        <a href="/livros">
          <Button variant="secondary">Ver Todos os Livros</Button>
        </a>
      </div>
    </div>
  )
}
