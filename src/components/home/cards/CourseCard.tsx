import { Badge } from '@/components/ui'
import { Star, Users, Clock } from 'lucide-react'

interface CourseCardCourse {
  id: string
  slug?: string
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

interface CourseCardProps {
  course: CourseCardCourse
}

const levelLabel: Record<string, string> = {
  beginner: 'Iniciante',
  intermediate: 'Intermedio',
  advanced: 'Avancado',
}

export function CourseCard({ course }: CourseCardProps) {
  const priceLabel =
    !course.isPaid || course.price === 0 ? 'Gratuito' : `${course.price?.toFixed(2)}\u00A0\u20AC`

  return (
    <a
      href={`/hub/courses/${course.slug || course.id}`}
      className="content-row__item netflix-card group/card"
      style={{ width: 'clamp(260px, 32vw, 340px)' }}
    >
      {/* Image */}
      <div className="netflix-card__image-container" style={{ aspectRatio: '16/9' }}>
        <img
          src={
            course.coverImage ||
            'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=640&q=80'
          }
          alt={course.title}
          className="netflix-card__image"
          loading="lazy"
        />
        <div className="netflix-card__overlay" />
        <div className="netflix-card__overlay--hover" />

        {/* Price badge */}
        <div className="absolute top-3 right-3 z-10">
          <Badge
            className={`text-xs font-bold border-0 shadow-md ${
              course.price === 0 || !course.isPaid
                ? 'bg-green-600 text-white'
                : course.isPremium
                  ? 'bg-amber-500 text-white'
                  : 'bg-background/90 backdrop-blur-sm text-foreground'
            }`}
          >
            {course.isPremium && '\u2B50 '}
            {priceLabel}
          </Badge>
        </div>

        {/* Level badge */}
        {course.level && (
          <div className="absolute top-3 left-3 z-10">
            <Badge
              variant="secondary"
              className="text-xs bg-background/80 backdrop-blur-sm border-0 text-foreground"
            >
              {levelLabel[course.level] || course.level}
            </Badge>
          </div>
        )}

        {/* Hover info */}
        <div className="netflix-card__info">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {course.enrolledCount != null && (
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {course.enrolledCount} alunos
              </span>
            )}
            {course.totalDuration != null && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {course.totalDuration}min
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="netflix-card__body">
        <h3 className="text-sm sm:text-base font-semibold leading-tight line-clamp-2 text-foreground group-hover/card:text-primary transition-colors">
          {course.title}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{course.creator?.name ?? 'FinHub'}</p>
          {course.averageRating != null && course.averageRating > 0 && (
            <span className="flex items-center gap-1 text-xs text-amber-500 font-medium">
              <Star className="h-3.5 w-3.5 fill-amber-500" />
              {course.averageRating.toFixed(1)}
              {course.ratingCount != null && (
                <span className="text-muted-foreground font-normal">({course.ratingCount})</span>
              )}
            </span>
          )}
        </div>
      </div>
    </a>
  )
}
