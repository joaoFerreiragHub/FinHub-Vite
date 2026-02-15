import { type HTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { type BaseContent } from '../../types'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export interface ContentMetaProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
  /**
   * Conteúdo (para extrair metadata)
   */
  content: Pick<BaseContent, 'creator' | 'creatorId' | 'publishedAt' | 'viewCount' | 'commentCount'>
  /**
   * Mostrar avatar do creator
   */
  showAvatar?: boolean
  /**
   * Tamanho do componente
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Orientação
   */
  orientation?: 'horizontal' | 'vertical'
}

const sizeClasses = {
  sm: {
    text: 'text-xs',
    avatar: 'h-6 w-6',
  },
  md: {
    text: 'text-sm',
    avatar: 'h-8 w-8',
  },
  lg: {
    text: 'text-base',
    avatar: 'h-10 w-10',
  },
}

/**
 * Componente de metadata de conteúdo
 * Mostra: Creator, Data, Views, Comments
 *
 * @example
 * <ContentMeta content={article} showAvatar />
 */
export function ContentMeta({
  content,
  showAvatar = false,
  size = 'sm',
  orientation = 'horizontal',
  className,
  ...props
}: ContentMetaProps) {
  const creator = typeof content.creator === 'string' ? null : content.creator

  const formattedDate = content.publishedAt
    ? formatDistanceToNow(new Date(content.publishedAt), {
        addSuffix: true,
        locale: ptBR,
      })
    : null

  return (
    <div
      className={cn(
        'flex items-center gap-3',
        orientation === 'vertical' && 'flex-col items-start',
        sizeClasses[size].text,
        'text-muted-foreground',
        className,
      )}
      {...props}
    >
      {/* Creator */}
      <div className="flex items-center gap-2">
        {showAvatar && creator && (
          <Link to={`/creators/${creator.username}`}>
            <div
              className={cn(
                sizeClasses[size].avatar,
                'flex items-center justify-center overflow-hidden rounded-full bg-primary text-primary-foreground',
              )}
            >
              {creator.avatar ? (
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs font-medium">{creator.name.charAt(0)}</span>
              )}
            </div>
          </Link>
        )}

        {creator && (
          <Link
            to={`/creators/${creator.username}`}
            className="font-medium text-foreground hover:text-primary transition-colors"
          >
            {creator.name}
          </Link>
        )}
      </div>

      {/* Separator */}
      {orientation === 'horizontal' && <span>•</span>}

      {/* Date */}
      {formattedDate && (
        <time dateTime={content.publishedAt} className="whitespace-nowrap">
          {formattedDate}
        </time>
      )}

      {/* Views */}
      {content.viewCount > 0 && (
        <>
          {orientation === 'horizontal' && <span>•</span>}
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            {formatNumber(content.viewCount)}
          </span>
        </>
      )}

      {/* Comments */}
      {content.commentCount > 0 && (
        <>
          {orientation === 'horizontal' && <span>•</span>}
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            {formatNumber(content.commentCount)}
          </span>
        </>
      )}
    </div>
  )
}

// Helper para formatar números
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}
