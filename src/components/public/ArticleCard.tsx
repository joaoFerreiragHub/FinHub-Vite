import type { CSSProperties } from 'react'
import { CalendarDays } from 'lucide-react'
import { ContentCard } from '@/components/shared/ContentCard'
import { clampRating, deriveArticleRating, formatDate } from '@/lib/cardUtils'

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

export function ArticleCard({ article, className, style }: ArticleCardProps) {
  const rating = clampRating(
    typeof article.rating === 'number'
      ? article.rating
      : deriveArticleRating(article.likes, article.views),
  )

  return (
    <ContentCard
      type="article"
      item={{
        id: article.id,
        slug: article.slug,
        href: article.href,
        title: article.title,
        imageUrl: article.imageUrl,
        creatorLabel: article.author || 'FinHub',
        secondaryLabel: formatDate(article.createdAt),
        SecondaryIcon: CalendarDays,
        rating,
      }}
      className={className}
      style={style}
    />
  )
}
