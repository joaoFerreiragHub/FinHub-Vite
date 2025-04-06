// src/components/book/ShowBooks.tsx

import React, { useEffect, useState } from 'react'
import { mockBooks } from '../../mock/books'
import { BookCard } from './BookCard'
import { Button } from '../ui/button'

import type { Book } from '../../types/book'

export default function ShowBooks() {
  const [allBooks, setAllBooks] = useState<Book[]>([])

  useEffect(() => {
    // Simular delay de carregamento
    setTimeout(() => {
      setAllBooks(mockBooks)
    }, 500)
  }, [])

  return (
    <div className="px-6 py-12 max-w-6xl mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-center">📚 Livros Recomendados</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {allBooks.map((book) => (
          <BookCard
            key={book._id}
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
