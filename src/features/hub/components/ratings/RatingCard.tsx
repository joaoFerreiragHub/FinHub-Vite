import { type HTMLAttributes, useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils/cn'
import { Card } from '@/shared/ui'
import { type Rating } from '../../types'
import { RatingStars } from '../common/RatingStars'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/shared/ui'

export interface RatingCardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Rating a exibir
   */
  rating: Rating
  /**
   * Mostrar botão de "útil"
   */
  showHelpful?: boolean
  /**
   * Callback ao marcar como útil
   */
  onMarkHelpful?: () => void | Promise<void>
  /**
   * Se o usuário atual é dono do rating
   */
  isOwner?: boolean
  /**
   * Callbacks de edição/exclusão (apenas para owner)
   */
  onEdit?: () => void
  onDelete?: () => void
}

/**
 * Card de exibição de rating individual
 *
 * @example
 * <RatingCard rating={rating} showHelpful onMarkHelpful={handleMarkHelpful} />
 */
export function RatingCard({
  rating,
  showHelpful = true,
  onMarkHelpful,
  isOwner = false,
  onEdit,
  onDelete,
  className,
  ...props
}: RatingCardProps) {
  const [isHelpful, setIsHelpful] = useState(false)
  const [helpfulCount, setHelpfulCount] = useState(rating.helpfulCount)

  const user = typeof rating.user === 'string' ? null : rating.user

  const formattedDate = formatDistanceToNow(new Date(rating.createdAt), {
    addSuffix: true,
    locale: ptBR,
  })

  const handleMarkHelpful = async () => {
    if (!onMarkHelpful) return

    // Optimistic update
    setIsHelpful(!isHelpful)
    setHelpfulCount((prev) => (isHelpful ? prev - 1 : prev + 1))

    try {
      await onMarkHelpful()
    } catch {
      // Rollback on error
      setIsHelpful(isHelpful)
      setHelpfulCount(helpfulCount)
    }
  }

  return (
    <Card padding="default" className={cn('space-y-3', className)} {...props}>
      {/* Header: User + Rating */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {user && (
            <Link to={`/users/${user.username}`}>
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary text-primary-foreground">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium">{user.name.charAt(0)}</span>
                )}
              </div>
            </Link>
          )}

          {/* User info */}
          <div>
            {user && (
              <Link
                to={`/users/${user.username}`}
                className="font-medium hover:text-primary transition-colors"
              >
                {user.name}
              </Link>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RatingStars rating={rating.rating} size="sm" />
              <span>•</span>
              <time dateTime={rating.createdAt}>{formattedDate}</time>
              {rating.updatedAt !== rating.createdAt && (
                <>
                  <span>•</span>
                  <span className="text-xs">(editado)</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Owner actions */}
        {isOwner && (
          <div className="flex gap-1">
            {onEdit && (
              <Button variant="ghost" size="sm" onClick={onEdit}>
                Editar
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="sm" onClick={onDelete}>
                Eliminar
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Review text */}
      {rating.review && (
        <p className="text-sm leading-relaxed text-foreground">{rating.review}</p>
      )}

      {/* Helpful button */}
      {showHelpful && !isOwner && (
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={handleMarkHelpful}
            className={cn(
              'flex items-center gap-1 rounded-lg px-3 py-1 text-sm transition-colors',
              isHelpful
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
              />
            </svg>
            <span>Útil {helpfulCount > 0 && `(${helpfulCount})`}</span>
          </button>
        </div>
      )}
    </Card>
  )
}
