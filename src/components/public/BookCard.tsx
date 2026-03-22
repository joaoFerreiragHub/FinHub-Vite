import type { CSSProperties } from 'react'
import { ContentCard } from '@/components/shared/ContentCard'
import { clampRating } from '@/lib/cardUtils'

export interface BookCardBook {
  id: string
  slug?: string
  href?: string
  title: string
  author?: string
  coverImage?: string
  averageRating?: number
  isPremium?: boolean
}

export interface BookCardProps {
  book: BookCardBook
  className?: string
  style?: CSSProperties
}

export function BookCard({ book, className, style }: BookCardProps) {
  return (
    <ContentCard
      type="book"
      item={{
        id: book.id,
        slug: book.slug,
        href: book.href,
        title: book.title,
        imageUrl: book.coverImage,
        creatorLabel: book.author || 'Autor desconhecido',
        rating: clampRating(book.averageRating),
      }}
      className={className}
      style={style}
    />
  )
}
