import type { CSSProperties } from 'react'
import { Clock3 } from 'lucide-react'
import { ContentCard } from '@/components/shared/ContentCard'
import { clampRating, formatDuration } from '@/lib/cardUtils'

export interface VideoCardVideo {
  id: string
  slug?: string
  href?: string
  title: string
  thumbnailImage?: string
  coverImage?: string
  creatorName?: string
  durationMinutes?: number
  averageRating?: number
}

export interface VideoCardProps {
  video: VideoCardVideo
  className?: string
  style?: CSSProperties
}

export function VideoCard({ video, className, style }: VideoCardProps) {
  return (
    <ContentCard
      type="video"
      item={{
        id: video.id,
        slug: video.slug,
        href: video.href,
        title: video.title,
        imageUrl: video.thumbnailImage ?? video.coverImage,
        creatorLabel: video.creatorName || 'FinHub',
        secondaryLabel: formatDuration(video.durationMinutes),
        SecondaryIcon: Clock3,
        rating: clampRating(video.averageRating),
      }}
      className={className}
      style={style}
    />
  )
}
