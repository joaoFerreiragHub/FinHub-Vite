import { type HTMLAttributes, useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { type Comment } from '../../types'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui'
import { CommentForm } from './CommentForm'

export interface CommentCardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Comentário
   */
  comment: Comment
  /**
   * Se usuário é owner
   */
  isOwner?: boolean
  /**
   * Permite replies
   */
  allowReply?: boolean
  /**
   * Mostrar replies aninhados
   */
  showReplies?: boolean
  /**
   * Callbacks
   */
  onReply?: (content: string) => Promise<void>
  onEdit?: (content: string) => Promise<void>
  onDelete?: () => void | Promise<void>
  onLike?: () => void | Promise<void>
}

/**
 * Card de comentário individual
 *
 * @example
 * <CommentCard comment={comment} allowReply onReply={handleReply} />
 */
export function CommentCard({
  comment,
  isOwner = false,
  allowReply = true,
  showReplies = true,
  onReply,
  onEdit,
  onDelete,
  onLike,
  className,
  ...props
}: CommentCardProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isLiked, setIsLiked] = useState(comment.hasLiked || false)
  const [likeCount, setLikeCount] = useState(comment.likeCount)

  const user = typeof comment.user === 'string' ? null : comment.user

  const formattedDate = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
    locale: ptBR,
  })

  const handleLike = async () => {
    if (!onLike) return

    // Optimistic update
    setIsLiked(!isLiked)
    setLikeCount((prev: number) => (isLiked ? prev - 1 : prev + 1))

    try {
      await onLike()
    } catch {
      // Rollback on error
      setIsLiked(isLiked)
      setLikeCount(likeCount)
    }
  }

  const handleReply = async (content: string) => {
    if (!onReply) return
    await onReply(content)
    setIsReplying(false)
  }

  const handleEdit = async (content: string) => {
    if (!onEdit) return
    await onEdit(content)
    setIsEditing(false)
  }

  if (comment.isDeleted) {
    return (
      <div className="rounded-lg border border-dashed border-muted-foreground/25 bg-muted/10 p-4 text-sm italic text-muted-foreground">
        [Comentário eliminado]
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)} {...props}>
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {/* Avatar */}
            {user && (
              <Link to={`/users/${user.username}`}>
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary text-primary-foreground">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs font-medium">{user.name.charAt(0)}</span>
                  )}
                </div>
              </Link>
            )}

            {/* User info */}
            <div className="text-sm">
              {user && (
                <Link
                  to={`/users/${user.username}`}
                  className="font-medium hover:text-primary transition-colors"
                >
                  {user.name}
                </Link>
              )}
              <span className="mx-2 text-muted-foreground">•</span>
              <time dateTime={comment.createdAt} className="text-muted-foreground">
                {formattedDate}
              </time>
              {comment.isEdited && (
                <>
                  <span className="mx-2 text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">(editado)</span>
                </>
              )}
              {comment.isPinned && (
                <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  📌 Fixado
                </span>
              )}
            </div>
          </div>

          {/* Owner actions */}
          {isOwner && !isEditing && (
            <div className="flex gap-1">
              {onEdit && (
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
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

        {/* Content */}
        {isEditing ? (
          <CommentForm
            targetType={comment.targetType}
            targetId={comment.targetId}
            initialContent={comment.content}
            onSubmit={handleEdit}
            onCancel={() => setIsEditing(false)}
            compact
          />
        ) : (
          <p className="text-sm leading-relaxed">{comment.content}</p>
        )}

        {/* Actions */}
        {!isEditing && (
          <div className="flex items-center gap-3 text-sm">
            {/* Like */}
            <button
              onClick={handleLike}
              className={cn(
                'flex items-center gap-1 transition-colors',
                isLiked
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground',
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
              {likeCount > 0 && <span>{likeCount}</span>}
            </button>

            {/* Reply */}
            {allowReply && onReply && !isReplying && (
              <button
                onClick={() => setIsReplying(true)}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Responder
              </button>
            )}

            {/* Reply count */}
            {comment.replyCount > 0 && (
              <span className="text-muted-foreground">
                {comment.replyCount} {comment.replyCount === 1 ? 'resposta' : 'respostas'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Reply form */}
      {isReplying && onReply && (
        <div className="ml-10 mt-2">
          <CommentForm
            targetType={comment.targetType}
            targetId={comment.targetId}
            parentCommentId={comment.id}
            onSubmit={handleReply}
            onCancel={() => setIsReplying(false)}
            placeholder={`Responder a ${user?.name}...`}
            compact
          />
        </div>
      )}

      {/* Replies */}
      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div className="ml-10 space-y-3 border-l-2 border-muted pl-4">
          {comment.replies.map((reply: Comment) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              allowReply={reply.depth < 3} // Máximo 3 níveis
              showReplies
              {...props}
            />
          ))}
        </div>
      )}
    </div>
  )
}
