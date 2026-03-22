import type { CSSProperties } from 'react'
import { Clock3 } from 'lucide-react'
import { ContentCard } from '@/components/shared/ContentCard'
import { clampRating, formatDuration } from '@/lib/cardUtils'

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

export function PodcastCard({ podcast, className, style }: PodcastCardProps) {
  return (
    <ContentCard
      type="podcast"
      item={{
        id: podcast.id,
        slug: podcast.slug,
        href: podcast.href,
        title: podcast.title,
        imageUrl: podcast.coverImage,
        creatorLabel: podcast.hostName || 'FinHub',
        secondaryLabel: formatDuration(podcast.durationMinutes),
        SecondaryIcon: Clock3,
        rating: clampRating(podcast.averageRating),
      }}
      className={className}
      style={style}
    />
  )
}
