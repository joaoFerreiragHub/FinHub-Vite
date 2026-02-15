import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { type ContentType, type Comment, type CommentListResponse } from '../../types'
import { CommentForm } from './CommentForm'
import { CommentCard } from './CommentCard'
import { Button } from '@/components/ui'
import { usePermissions } from '@/features/auth/hooks/usePermissions'
import { Permission } from '@/lib/permissions/config'

export interface CommentSectionProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Tipo e ID do conteúdo
   */
  targetType: ContentType
  targetId: string
  /**
   * Resposta da lista de comentários
   */
  response: CommentListResponse
  /**
   * ID do usuário atual (para verificar ownership)
   */
  currentUserId?: string
  /**
   * Comentários estão habilitados
   */
  enabled?: boolean
  /**
   * Callbacks
   */
  onSubmitComment: (content: string) => Promise<void>
  onReplyComment: (commentId: string, content: string) => Promise<void>
  onEditComment: (commentId: string, content: string) => Promise<void>
  onDeleteComment: (commentId: string) => Promise<void>
  onLikeComment: (commentId: string) => Promise<void>
  onLoadMore?: () => void | Promise<void>
  /**
   * Estado de loading
   */
  isLoading?: boolean
  /**
   * Ordenação
   */
  sortBy?: 'recent' | 'oldest' | 'popular'
  onSortChange?: (sortBy: 'recent' | 'oldest' | 'popular') => void
}

/**
 * Seção completa de comentários
 * Inclui form + lista com threading
 *
 * @example
 * <CommentSection
 *   targetType={ContentType.ARTICLE}
 *   targetId="123"
 *   response={commentsResponse}
 *   onSubmitComment={handleSubmit}
 * />
 */
export function CommentSection({
  targetType,
  targetId,
  response,
  currentUserId,
  enabled = true,
  onSubmitComment,
  onReplyComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
  onLoadMore,
  isLoading = false,
  sortBy = 'recent',
  onSortChange,
  className,
  ...props
}: CommentSectionProps) {
  const { can } = usePermissions()
  const canComment = can(Permission.POST_COMMENTS)

  if (!enabled) {
    return (
      <div className="rounded-lg border border-muted bg-muted/10 p-8 text-center text-sm text-muted-foreground">
        Comentários desativados para este conteúdo
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)} {...props}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">
          Comentários {response.total > 0 && `(${response.total})`}
        </h3>

        {onSortChange && response.total > 0 && (
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'recent' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onSortChange('recent')}
            >
              Recentes
            </Button>
            <Button
              variant={sortBy === 'popular' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onSortChange('popular')}
            >
              Populares
            </Button>
            <Button
              variant={sortBy === 'oldest' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onSortChange('oldest')}
            >
              Antigos
            </Button>
          </div>
        )}
      </div>

      {/* Comment form */}
      {canComment ? (
        <CommentForm
          targetType={targetType}
          targetId={targetId}
          onSubmit={onSubmitComment}
          placeholder="Partilhe a sua opinião..."
        />
      ) : (
        <div className="rounded-lg border border-muted bg-muted/10 p-4 text-center text-sm text-muted-foreground">
          <p>Faça login para comentar</p>
        </div>
      )}

      {/* Comments list */}
      {response.items.length === 0 && !isLoading ? (
        <div className="rounded-lg border border-dashed border-muted-foreground/25 bg-muted/10 p-12 text-center">
          <svg
            className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <h4 className="mb-2 font-semibold">Nenhum comentário ainda</h4>
          <p className="text-sm text-muted-foreground">Seja o primeiro a comentar!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {response.items.map((comment: Comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              isOwner={currentUserId === comment.userId}
              onReply={(content) => onReplyComment(comment.id, content)}
              onEdit={(content) => onEditComment(comment.id, content)}
              onDelete={() => onDeleteComment(comment.id)}
              onLike={() => onLikeComment(comment.id)}
            />
          ))}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}

      {/* Load more */}
      {response.hasMore && !isLoading && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={onLoadMore}>
            Carregar mais comentários
          </Button>
        </div>
      )}
    </div>
  )
}
