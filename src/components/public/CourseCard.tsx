import type { CSSProperties } from 'react'
import { Timer } from 'lucide-react'
import { ContentCard } from '@/components/shared/ContentCard'
import { clampRating, formatDuration } from '@/lib/cardUtils'

export interface CourseCardCourse {
  id: string
  slug?: string
  href?: string
  title: string
  coverImage?: string
  averageRating?: number
  ratingCount?: number
  enrolledCount?: number
  totalDuration?: number
  price?: number
  isPaid?: boolean
  isPremium?: boolean
  level?: string
  creator?: { name: string }
}

export interface CourseCardProps {
  course: CourseCardCourse
  className?: string
  style?: CSSProperties
}

export function CourseCard({ course, className, style }: CourseCardProps) {
  return (
    <ContentCard
      type="course"
      item={{
        id: course.id,
        slug: course.slug,
        href: course.href,
        title: course.title,
        imageUrl: course.coverImage,
        creatorLabel: course.creator?.name || 'FinHub',
        secondaryLabel: formatDuration(course.totalDuration),
        SecondaryIcon: Timer,
        rating: clampRating(course.averageRating),
      }}
      className={className}
      style={style}
    />
  )
}
