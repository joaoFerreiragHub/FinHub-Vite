import type { CSSProperties } from 'react'
import { Clock3, ImageOff, Mic2, Star, User } from 'lucide-react'
import { Badge } from '@/components/ui'
import { cn } from '@/lib/utils'

export interface PodcastCardPodcast {
  id: string
  slug?: string
  href?: string
  title: string
  coverImage?: string
  hostName?: string
  durationMinutes?: number
  averageRating?: number
}

export interface PodcastCardProps {
  podcast: PodcastCardPodcast
  className?: string
  style?: CSSProperties
}

function clampRating(value?: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.min(5, Number(value)))
}

function formatDuration(totalMinutes?: number): string {
  if (!totalMinutes || totalMinutes <= 0) return 'Duracao n/a'
  if (totalMinutes < 60) return `${totalMinutes} min`
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
}

export function PodcastCard({ podcast, className, style }: PodcastCardProps) {
  const href = podcast.href || `/hub/podcasts/${encodeURIComponent(podcast.slug || podcast.id)}`
  const rating = clampRating(podcast.averageRating)
  const roundedRating = Math.round(rating)

  return (
    <a
      href={href}
      className={cn(
        'content-row__item group block overflow-hidden rounded-2xl border border-border/70 bg-card/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg',
        className,
      )}
      style={{ width: 'clamp(250px, 31vw, 330px)', ...style }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {podcast.coverImage ? (
          <img
            src={podcast.coverImage}
            alt={podcast.title}
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
            <Mic2 className="h-3.5 w-3.5" />
            Podcast
          </Badge>
        </div>
      </div>

      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground sm:text-base">
          {podcast.title}
        </h3>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => {
              const filled = index < roundedRating
              return (
                <Star
                  key={`podcast-star-${index}`}
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
            <span className="truncate">{podcast.hostName || 'FinHub'}</span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" />
            {formatDuration(podcast.durationMinutes)}
          </span>
        </div>
      </div>
    </a>
  )
}
