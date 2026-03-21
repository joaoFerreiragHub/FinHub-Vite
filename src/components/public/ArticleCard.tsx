import type { CSSProperties } from 'react'
import { CalendarDays, FileText, ImageOff, Star, User } from 'lucide-react'
import { Badge } from '@/components/ui'
import { cn } from '@/lib/utils'

export interface ArticleCardArticle {
  id: string
  slug?: string
  href?: string
  title: string
  topic?: string
  imageUrl?: string
  author?: string
  createdAt?: string
  views?: number
  likes?: number
  rating?: number
}

export interface ArticleCardProps {
  article: ArticleCardArticle
  className?: string
  style?: CSSProperties
}

function clampRating(value?: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.min(5, Number(value)))
}

function formatDate(value?: string): string {
  if (!value) return 'Sem data'
  const timestamp = Date.parse(value)
  if (Number.isNaN(timestamp)) return 'Sem data'
  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(timestamp))
}

function deriveRating(article: ArticleCardArticle): number {
  if (typeof article.rating === 'number') return article.rating
  const likes = article.likes ?? 0
  const views = article.views ?? 0
  if (likes <= 0 || views <= 0) return 0
  return Math.min(5, Math.max(0, (likes / views) * 25))
}

export function ArticleCard({ article, className, style }: ArticleCardProps) {
  const href = article.href || `/hub/articles/${encodeURIComponent(article.slug || article.id)}`
  const rating = clampRating(deriveRating(article))
  const roundedRating = Math.round(rating)

  return (
    <a
      href={href}
      className={cn(
        'content-row__item group block overflow-hidden rounded-2xl border border-border/70 bg-card/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg',
        className,
      )}
      style={{ width: 'clamp(240px, 30vw, 320px)', ...style }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.title}
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
            <FileText className="h-3.5 w-3.5" />
            Artigo
          </Badge>
        </div>
      </div>

      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground sm:text-base">
          {article.title}
        </h3>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => {
              const filled = index < roundedRating
              return (
                <Star
                  key={`article-star-${index}`}
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

        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="inline-flex min-w-0 items-center gap-1">
            <User className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{article.author || 'FinHub'}</span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(article.createdAt)}
          </span>
        </div>
      </div>
    </a>
  )
}
