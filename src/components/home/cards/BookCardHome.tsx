import { Star } from 'lucide-react'
import { Badge } from '@/components/ui'

interface BookCardBook {
  id: string
  slug?: string
  title: string
  author?: string
  coverImage?: string
  averageRating?: number
  isPremium?: boolean
}

interface BookCardHomeProps {
  book: BookCardBook
}

export function BookCardHome({ book }: BookCardHomeProps) {
  return (
    <a
      href={`/hub/books/${book.slug || book.id}`}
      className="content-row__item netflix-card group/card"
      style={{ width: 'clamp(140px, 18vw, 180px)' }}
    >
      {/* Cover */}
      <div className="netflix-card__image-container rounded-lg" style={{ aspectRatio: '2/3' }}>
        <img
          src={book.coverImage || '/placeholder-book.jpg'}
          alt={book.title}
          className="netflix-card__image rounded-lg"
          loading="lazy"
        />
        <div className="netflix-card__overlay rounded-lg" />
        <div className="netflix-card__overlay--hover rounded-lg" />

        {book.isPremium && (
          <div className="absolute top-2 right-2 z-10">
            <Badge className="text-[10px] bg-amber-500 text-white border-0 px-1.5">Premium</Badge>
          </div>
        )}

        {/* Hover info */}
        <div className="netflix-card__info">
          {book.averageRating != null && book.averageRating > 0 && (
            <span className="flex items-center gap-1 text-xs text-amber-500 font-medium">
              <Star className="h-3 w-3 fill-amber-500" />
              {book.averageRating.toFixed(1)}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-2.5 sm:p-3 space-y-1">
        <h3 className="text-xs sm:text-sm font-semibold leading-tight line-clamp-2 text-foreground group-hover/card:text-primary transition-colors">
          {book.title}
        </h3>
        {book.author && (
          <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1">{book.author}</p>
        )}
      </div>
    </a>
  )
}
