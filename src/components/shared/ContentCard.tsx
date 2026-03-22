import type { CSSProperties } from 'react'
import type { LucideIcon } from 'lucide-react'
import { BookOpen, FileText, GraduationCap, ImageOff, Mic2, PlayCircle, User } from 'lucide-react'
import { Badge } from '@/components/ui'
import { cn } from '@/lib/utils'
import { RatingStars } from './RatingStars'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ContentType = 'article' | 'video' | 'course' | 'book' | 'podcast'

export interface ContentCardItem {
  id: string
  slug?: string
  /** Override the computed href entirely. */
  href?: string
  title: string
  /** Normalised image URL (thumbnailImage, coverImage, imageUrl — pick one before passing). */
  imageUrl?: string
  /** Author / creator / host name shown on the left of the metadata row. */
  creatorLabel?: string
  /** Duration / date / secondary text shown on the right of the metadata row. */
  secondaryLabel?: string
  /** Lucide icon placed next to secondaryLabel (Clock3, CalendarDays, Timer…). */
  SecondaryIcon?: LucideIcon
  /** Pre-clamped 0–5 rating. */
  rating?: number
}

export interface ContentCardProps {
  type: ContentType
  item: ContentCardItem
  className?: string
  style?: CSSProperties
}

// ─── Per-type configuration ───────────────────────────────────────────────────

type TypeConfig = {
  label: string
  Icon: LucideIcon
  /** Tailwind aspect-ratio class applied to the image container. */
  aspect: string
  hrefPrefix: string
  defaultWidth: string
}

const TYPE_CONFIG: Record<ContentType, TypeConfig> = {
  article: {
    label: 'Artigo',
    Icon: FileText,
    aspect: 'aspect-[4/3]',
    hrefPrefix: '/hub/articles',
    defaultWidth: 'clamp(240px, 30vw, 320px)',
  },
  video: {
    label: 'Vídeo',
    Icon: PlayCircle,
    aspect: 'aspect-video',
    hrefPrefix: '/hub/videos',
    defaultWidth: 'clamp(250px, 31vw, 330px)',
  },
  course: {
    label: 'Curso',
    Icon: GraduationCap,
    aspect: 'aspect-[4/3]',
    hrefPrefix: '/hub/courses',
    defaultWidth: 'clamp(260px, 32vw, 340px)',
  },
  book: {
    label: 'Livro',
    Icon: BookOpen,
    aspect: 'aspect-[4/3]',
    hrefPrefix: '/hub/books',
    defaultWidth: 'clamp(180px, 22vw, 240px)',
  },
  podcast: {
    label: 'Podcast',
    Icon: Mic2,
    aspect: 'aspect-[4/3]',
    hrefPrefix: '/hub/podcasts',
    defaultWidth: 'clamp(250px, 31vw, 330px)',
  },
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Unified content card used by ArticleCard, VideoCard, CourseCard, BookCard
 * and PodcastCard.  Each wrapper normalises its specific data shape and
 * delegates rendering here.
 *
 * Visual rules:
 *   • hover: -translate-y-0.5 + border-primary/40 + shadow-lg  (never scale)
 *   • image: object-cover + scale-[1.03] on hover
 *   • badge: backdrop-blur-sm top-left
 *   • stars: market-bull colour via RatingStars
 *   • metadata: creator (left) + secondary (right), text-xs muted
 */
export function ContentCard({ type, item, className, style }: ContentCardProps) {
  const { label, Icon, aspect, hrefPrefix, defaultWidth } = TYPE_CONFIG[type]
  const href = item.href ?? `${hrefPrefix}/${encodeURIComponent(item.slug ?? item.id)}`
  const hasMetadata = Boolean(item.creatorLabel ?? item.secondaryLabel)

  return (
    <a
      href={href}
      className={cn(
        'content-row__item group block overflow-hidden rounded-2xl border border-border/70 bg-card/80',
        'transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg',
        className,
      )}
      style={{ width: defaultWidth, ...style }}
    >
      {/* Image */}
      <div className={cn('relative overflow-hidden bg-muted', aspect)}>
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted via-muted/80 to-muted/30">
            <ImageOff className="h-8 w-8 text-muted-foreground" />
          </div>
        )}

        {/* Type badge */}
        <div className="absolute left-3 top-3">
          <Badge variant="secondary" className="border-0 bg-background/85 backdrop-blur-sm">
            <Icon className="h-3.5 w-3.5" />
            {label}
          </Badge>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground sm:text-base">
          {item.title}
        </h3>

        <RatingStars rating={item.rating ?? 0} />

        {hasMetadata && (
          <div
            className={cn(
              'text-xs text-muted-foreground',
              item.secondaryLabel
                ? 'flex items-center justify-between gap-2'
                : 'flex items-center gap-1',
            )}
          >
            {item.creatorLabel && (
              <span className="inline-flex min-w-0 items-center gap-1">
                <User className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{item.creatorLabel}</span>
              </span>
            )}
            {item.secondaryLabel && (
              <span className="inline-flex shrink-0 items-center gap-1">
                {item.SecondaryIcon && <item.SecondaryIcon className="h-3.5 w-3.5" />}
                {item.secondaryLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </a>
  )
}
