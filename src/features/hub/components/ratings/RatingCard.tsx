import { type HTMLAttributes, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui'
import { type Rating, type RatingReaction, type ReviewReactionInput } from '../../types'
import { RatingStars } from '../common/RatingStars'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui'

export interface RatingCardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Rating a exibir
   */
  rating: Rating
  /**
   * Mostrar a area de feedback da review
   */
  showHelpful?: boolean
  showReactions?: boolean
  /**
   * Callback legacy (mantido para compatibilidade)
   */
  onMarkHelpful?: () => void | Promise<void>
  /**
   * Callback novo para like/dislike/none em review
   */
  onReactionChange?: (reaction: ReviewReactionInput) => void | Promise<void>
  /**
   * Reacao atual do utilizador para esta review
   */
  myReaction?: RatingReaction | null
  /**
   * Se o user pode reagir (auth/permissoes)
   */
  canReact?: boolean
  /**
   * Se o utilizador atual e dono do rating
   */
  isOwner?: boolean
  /**
   * Callbacks de edicao/eliminacao (owner)
   */
  onEdit?: () => void
  onDelete?: () => void
}

const applyReaction = (
  previous: RatingReaction | null,
  next: RatingReaction | null,
  currentLikes: number,
  currentDislikes: number,
) => {
  let likes = currentLikes
  let dislikes = currentDislikes

  if (previous === 'like') likes = Math.max(0, likes - 1)
  if (previous === 'dislike') dislikes = Math.max(0, dislikes - 1)

  if (next === 'like') likes += 1
  if (next === 'dislike') dislikes += 1

  return { likes, dislikes }
}

export function RatingCard({
  rating,
  showHelpful = true,
  showReactions = true,
  onMarkHelpful,
  onReactionChange,
  myReaction = null,
  canReact = true,
  isOwner = false,
  onEdit,
  onDelete,
  className,
  ...props
}: RatingCardProps) {
  const [reaction, setReaction] = useState<RatingReaction | null>(myReaction)
  const [likes, setLikes] = useState(rating.likes ?? rating.helpfulCount ?? 0)
  const [dislikes, setDislikes] = useState(rating.dislikes ?? 0)
  const [isSubmittingReaction, setIsSubmittingReaction] = useState(false)

  useEffect(() => {
    setReaction(myReaction)
  }, [myReaction])

  useEffect(() => {
    setLikes(rating.likes ?? rating.helpfulCount ?? 0)
    setDislikes(rating.dislikes ?? 0)
  }, [rating.likes, rating.dislikes, rating.helpfulCount])

  const user = typeof rating.user === 'string' ? null : rating.user

  const formattedDate = formatDistanceToNow(new Date(rating.createdAt), {
    addSuffix: true,
    locale: ptBR,
  })

  const handleReaction = async (clickedReaction: RatingReaction) => {
    if (isSubmittingReaction) return
    if (!onReactionChange && !onMarkHelpful) return

    const previousReaction = reaction
    const nextReaction: RatingReaction | null =
      clickedReaction === previousReaction ? null : clickedReaction

    const optimistic = applyReaction(previousReaction, nextReaction, likes, dislikes)

    setReaction(nextReaction)
    setLikes(optimistic.likes)
    setDislikes(optimistic.dislikes)
    setIsSubmittingReaction(true)

    try {
      if (onReactionChange) {
        await onReactionChange(nextReaction ?? 'none')
      } else if (onMarkHelpful) {
        await onMarkHelpful()
      }
    } catch {
      const rollback = applyReaction(
        nextReaction,
        previousReaction,
        optimistic.likes,
        optimistic.dislikes,
      )
      setReaction(previousReaction)
      setLikes(rollback.likes)
      setDislikes(rollback.dislikes)
    } finally {
      setIsSubmittingReaction(false)
    }
  }

  const userName = user?.name ?? user?.username ?? 'Utilizador'
  const userHandle = user?.username ?? user?.id

  const showLegacyHelpful = showHelpful && !showReactions && !!onMarkHelpful
  const showReviewReactions = showHelpful && showReactions && !isOwner

  return (
    <Card className={cn('space-y-3 p-6', className)} {...props}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {user && (
            <Link to={`/users/${userHandle}`}>
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary text-primary-foreground">
                {user.avatar ? (
                  <img src={user.avatar} alt={userName} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm font-medium">{userName.charAt(0)}</span>
                )}
              </div>
            </Link>
          )}

          <div>
            {user && (
              <Link
                to={`/users/${userHandle}`}
                className="font-medium transition-colors hover:text-primary"
              >
                {userName}
              </Link>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RatingStars rating={rating.rating} size="sm" />
              <span>-</span>
              <time dateTime={rating.createdAt}>{formattedDate}</time>
              {rating.updatedAt !== rating.createdAt && (
                <>
                  <span>-</span>
                  <span className="text-xs">(editado)</span>
                </>
              )}
            </div>
          </div>
        </div>

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

      {rating.review && <p className="text-sm leading-relaxed text-foreground">{rating.review}</p>}

      {showReviewReactions && (
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => handleReaction('like')}
            disabled={!canReact || isSubmittingReaction}
            className={cn(
              'flex items-center gap-1 rounded-lg px-3 py-1 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50',
              reaction === 'like'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80',
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
            <span>Gostei {likes > 0 && `(${likes})`}</span>
          </button>

          <button
            type="button"
            onClick={() => handleReaction('dislike')}
            disabled={!canReact || isSubmittingReaction}
            className={cn(
              'flex items-center gap-1 rounded-lg px-3 py-1 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50',
              reaction === 'dislike'
                ? 'bg-destructive text-destructive-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80',
            )}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.737 3h4.018c.162 0 .325.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2M17 4h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
              />
            </svg>
            <span>Nao gostei {dislikes > 0 && `(${dislikes})`}</span>
          </button>
        </div>
      )}

      {showLegacyHelpful && (
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => handleReaction('like')}
            disabled={!canReact || isSubmittingReaction}
            className={cn(
              'flex items-center gap-1 rounded-lg px-3 py-1 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50',
              reaction === 'like'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80',
            )}
          >
            <span>Util {likes > 0 && `(${likes})`}</span>
          </button>
        </div>
      )}
    </Card>
  )
}
