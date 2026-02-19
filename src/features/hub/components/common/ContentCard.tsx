import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui'
import { type BaseContent, ContentType } from '../../types'
import { RatingStars } from './RatingStars'
import { ContentMeta } from './ContentMeta'
import { usePermissions } from '@/features/auth/hooks/usePermissions'
import { isRoleAtLeast } from '@/lib/permissions/config'

export interface ContentCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
  /**
   * Conteúdo a ser exibido
   */
  content: BaseContent
  /**
   * Variante do card
   */
  variant?: 'default' | 'compact' | 'featured'
  /**
   * Mostrar imagem de capa
   */
  showImage?: boolean
  /**
   * Mostrar rating
   */
  showRating?: boolean
  /**
   * Mostrar metadata (creator, date, views)
   */
  showMeta?: boolean
  /**
   * URL customizada (se não fornecida, usa padrão baseado em type)
   */
  href?: string
}

/**
 * Card genérico para qualquer tipo de conteúdo do HUB
 *
 * Adapta-se automaticamente ao tipo de conteúdo e permissões do usuário
 *
 * @example
 * <ContentCard content={article} variant="featured" />
 * <ContentCard content={course} showRating />
 */
export function ContentCard({
  content,
  variant = 'default',
  showImage = true,
  showRating = true,
  showMeta = true,
  href,
  className,
  ...props
}: ContentCardProps) {
  const { role } = usePermissions()

  // Verificar se usuário tem acesso
  const hasAccess = isRoleAtLeast(role, content.requiredRole)

  // URL padrão baseada no tipo
  const defaultHref = getContentUrl(content.type, content.slug || content.id)
  const finalHref = href || defaultHref

  // Badge do tipo de conteúdo
  const typeBadge = getTypeBadge(content.type)

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-300',
        variant === 'compact' ? 'p-4' : 'p-6',
        variant !== 'compact' && 'hover:shadow-md',
        variant === 'featured' && 'ring-2 ring-primary/20',
        className,
      )}
      {...props}
    >
      <a href={finalHref} className="block">
        {/* Premium Badge */}
        {content.isPremium && (
          <div className="absolute right-2 top-2 z-10 rounded-full bg-yellow-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
            ⭐ Premium
          </div>
        )}

        {/* Cover Image */}
        {showImage && content.coverImage && (
          <div
            className={cn(
              'relative overflow-hidden bg-muted',
              variant === 'compact' ? 'h-32' : 'h-48',
              variant === 'featured' && 'h-64',
            )}
          >
            <img
              src={content.coverImage}
              alt={content.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            {/* Type badge */}
            <div className="absolute bottom-2 left-2">
              <span className="rounded-full bg-background/90 px-2 py-1 text-xs font-medium backdrop-blur-sm">
                {typeBadge}
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className={cn('space-y-3', showImage && 'mt-4')}>
          {/* Title */}
          <h3
            className={cn(
              'font-semibold leading-tight transition-colors group-hover:text-primary',
              variant === 'featured' ? 'text-xl' : 'text-lg',
              variant === 'compact' && 'text-base',
            )}
          >
            {content.title}
          </h3>

          {/* Description */}
          <p
            className={cn(
              'line-clamp-2 text-muted-foreground',
              variant === 'compact' ? 'text-xs' : 'text-sm',
            )}
          >
            {content.description}
          </p>

          {/* Rating */}
          {showRating && content.ratingCount > 0 && (
            <RatingStars
              rating={content.averageRating}
              showCount
              count={content.ratingCount}
              size={variant === 'compact' ? 'sm' : 'md'}
            />
          )}

          {/* Metadata */}
          {showMeta && <ContentMeta content={content} size={variant === 'compact' ? 'sm' : 'md'} />}

          {/* Access Lock */}
          {!hasAccess && (
            <div className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-2 text-xs text-yellow-800">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="font-medium">Requer plano {content.requiredRole.toUpperCase()}</span>
            </div>
          )}
        </div>
      </a>
    </Card>
  )
}

// Helper: URL baseada no tipo
function getContentUrl(type: ContentType, slugOrId: string): string {
  const urls: Record<ContentType, string> = {
    [ContentType.ARTICLE]: `/hub/articles/${slugOrId}`,
    [ContentType.COURSE]: `/hub/courses/${slugOrId}`,
    [ContentType.VIDEO]: `/hub/videos/${slugOrId}`,
    [ContentType.EVENT]: `/hub/events/${slugOrId}`,
    [ContentType.BOOK]: `/hub/books/${slugOrId}`,
    [ContentType.PODCAST]: `/hub/podcasts/${slugOrId}`,
    [ContentType.NEWS]: `/hub/news/${slugOrId}`,
  }
  return urls[type] || `/hub/${type}s/${slugOrId}`
}

// Helper: Badge do tipo
function getTypeBadge(type: ContentType): string {
  const badges: Record<ContentType, string> = {
    [ContentType.ARTICLE]: '📰 Artigo',
    [ContentType.COURSE]: '🎓 Curso',
    [ContentType.VIDEO]: '🎬 Vídeo',
    [ContentType.EVENT]: '📅 Evento',
    [ContentType.BOOK]: '📚 Livro',
    [ContentType.PODCAST]: '🎙️ Podcast',
    [ContentType.NEWS]: '📢 Notícia',
  }
  return badges[type] || type
}
