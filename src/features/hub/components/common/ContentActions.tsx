import { type HTMLAttributes, useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/shared/ui'
import { usePermissions } from '@/features/auth/hooks/usePermissions'
import { Permission } from '@/lib/permissions/config'

export interface ContentActionsProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID do conteúdo
   */
  contentId: string
  /**
   * Estado inicial de like
   */
  isLiked?: boolean
  /**
   * Contagem de likes
   */
  likeCount?: number
  /**
   * Estado inicial de favorito
   */
  isFavorited?: boolean
  /**
   * Contagem de favoritos
   */
  favoriteCount?: number
  /**
   * Callbacks
   */
  onLike?: () => void | Promise<void>
  onFavorite?: () => void | Promise<void>
  onShare?: () => void | Promise<void>
  /**
   * Orientação
   */
  orientation?: 'horizontal' | 'vertical'
  /**
   * Mostrar labels
   */
  showLabels?: boolean
}

/**
 * Componente de ações de conteúdo
 * Like, Favorite, Share
 *
 * @example
 * <ContentActions
 *   contentId="123"
 *   isLiked={userHasLiked}
 *   likeCount={42}
 *   onLike={handleLike}
 *   onShare={handleShare}
 * />
 */
export function ContentActions({
  isLiked: initialIsLiked = false,
  likeCount: initialLikeCount = 0,
  isFavorited: initialIsFavorited = false,
  favoriteCount: initialFavoriteCount = 0,
  onLike,
  onFavorite,
  onShare,
  orientation = 'horizontal',
  showLabels = false,
  className,
  ...props
}: ContentActionsProps) {
  const { can } = usePermissions()
  const canInteract = can(Permission.POST_COMMENTS) // Reutilizando permissão

  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
  const [favoriteCount, setFavoriteCount] = useState(initialFavoriteCount)
  const [isLoading, setIsLoading] = useState(false)

  const handleLike = async () => {
    if (!canInteract || isLoading) return

    setIsLoading(true)
    try {
      // Optimistic update
      setIsLiked(!isLiked)
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))

      await onLike?.()
    } catch {
      // Rollback on error
      setIsLiked(isLiked)
      setLikeCount(likeCount)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFavorite = async () => {
    if (!canInteract || isLoading) return

    setIsLoading(true)
    try {
      // Optimistic update
      setIsFavorited(!isFavorited)
      setFavoriteCount((prev) => (isFavorited ? prev - 1 : prev + 1))

      await onFavorite?.()
    } catch {
      // Rollback on error
      setIsFavorited(isFavorited)
      setFavoriteCount(favoriteCount)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    if (isLoading) return

    // Web Share API se disponível
    if (navigator.share) {
      try {
        await navigator.share({
          url: window.location.href,
        })
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copiar link
      await navigator.clipboard.writeText(window.location.href)
      // TODO: Mostrar toast de sucesso
    }

    await onShare?.()
  }

  return (
    <div
      className={cn(
        'flex gap-2',
        orientation === 'vertical' && 'flex-col',
        className
      )}
      {...props}
    >
      {/* Like */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        disabled={!canInteract || isLoading}
        className={cn(
          'gap-2',
          isLiked && 'text-red-500',
          !canInteract && 'cursor-not-allowed opacity-50'
        )}
      >
        <svg
          className="h-5 w-5"
          fill={isLiked ? 'currentColor' : 'none'}
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        {showLabels && <span>Gostei</span>}
        {likeCount > 0 && <span className="text-muted-foreground">{likeCount}</span>}
      </Button>

      {/* Favorite */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleFavorite}
        disabled={!canInteract || isLoading}
        className={cn(
          'gap-2',
          isFavorited && 'text-yellow-500',
          !canInteract && 'cursor-not-allowed opacity-50'
        )}
      >
        <svg
          className="h-5 w-5"
          fill={isFavorited ? 'currentColor' : 'none'}
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
        {showLabels && <span>Guardar</span>}
        {favoriteCount > 0 && <span className="text-muted-foreground">{favoriteCount}</span>}
      </Button>

      {/* Share */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        disabled={isLoading}
        className="gap-2"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        {showLabels && <span>Partilhar</span>}
      </Button>
    </div>
  )
}
