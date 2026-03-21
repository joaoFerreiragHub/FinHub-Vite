import type { CSSProperties } from 'react'
import { BookOpen, ImageOff, Star, User } from 'lucide-react'
import { Badge } from '@/components/ui'
import { cn } from '@/lib/utils'

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

function clampRating(value?: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.min(5, Number(value)))
}

export function BookCard({ book, className, style }: BookCardProps) {
  const href = book.href || `/hub/books/${encodeURIComponent(book.slug || book.id)}`
  const rating = clampRating(book.averageRating)
  const roundedRating = Math.round(rating)

  return (
    <a
      href={href}
      className={cn(
        'content-row__item group block overflow-hidden rounded-2xl border border-border/70 bg-card/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg',
        className,
      )}
      style={{ width: 'clamp(180px, 22vw, 240px)', ...style }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted via-muted/80 to-muted/30">
            <ImageOff className="h-8 w-8 text-muted-foreground" />
          </div>
        )}

        <div className="absolute left-3 top-3">
          <Badge variant="secondary" className="border-0 bg-background/85 backdrop-blur-sm">
            <BookOpen className="h-3.5 w-3.5" />
            Livro
          </Badge>
        </div>
      </div>

      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground sm:text-base">
          {book.title}
        </h3>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => {
              const filled = index < roundedRating
              return (
                <Star
                  key={`book-star-${index}`}
                  className={cn(
                    'h-3.5 w-3.5',
                    filled ? 'fill-market-bull text-market-bull' : 'text-market-bull/35',
                  )}
                />
              )
            })}
          </div>
          <span className="tabular-nums text-xs text-muted-foreground">{rating.toFixed(1)}</span>
        </div>

        <p className="inline-flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
          <User className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{book.author || 'Autor desconhecido'}</span>
        </p>
      </div>
    </a>
  )
}
