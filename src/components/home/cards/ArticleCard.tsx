import { Badge } from '@/components/ui'
import { Eye, Heart, Clock } from 'lucide-react'

interface ArticleCardArticle {
  id: string
  title: string
  topic: string
  imageUrl?: string
  author: string
  createdAt: string
  views?: number
  likes?: number
}

interface ArticleCardProps {
  article: ArticleCardArticle
}

function formatViews(n?: number): string {
  if (!n) return '0'
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days < 1) return 'Hoje'
  if (days < 7) return `${days}d`
  if (days < 30) return `${Math.floor(days / 7)}sem`
  return `${Math.floor(days / 30)}m`
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <a
      href={`/hub/articles/${article.id}`}
      className="content-row__item netflix-card group/card"
      style={{ width: 'clamp(240px, 30vw, 320px)' }}
    >
      {/* Image */}
      <div className="netflix-card__image-container" style={{ aspectRatio: '16/9' }}>
        <img
          src={
            article.imageUrl ||
            `https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=640&q=80`
          }
          alt={article.title}
          className="netflix-card__image"
          loading="lazy"
        />
        <div className="netflix-card__overlay" />
        <div className="netflix-card__overlay--hover" />

        {/* Topic badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge
            variant="secondary"
            className="text-xs bg-background/80 backdrop-blur-sm border-0 text-foreground font-medium"
          >
            {article.topic}
          </Badge>
        </div>

        {/* Hover info overlay */}
        <div className="netflix-card__info">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {formatViews(article.views)}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              {formatViews(article.likes)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {timeAgo(article.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="netflix-card__body">
        <h3 className="text-sm sm:text-base font-semibold leading-tight line-clamp-2 text-foreground group-hover/card:text-primary transition-colors">
          {article.title}
        </h3>
        <p className="text-xs text-muted-foreground">por {article.author}</p>
      </div>
    </a>
  )
}
