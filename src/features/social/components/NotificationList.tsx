import { Bell, Heart, Info, MessageSquare, ShieldAlert, Star, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { NotificationType, type Notification } from '../types'

interface NotificationListProps {
  notifications: Notification[]
  onClickNotification?: (notification: Notification) => void
  maxItems?: number
}

const typeIcons: Record<NotificationType, typeof Bell> = {
  [NotificationType.NEW_CONTENT]: Bell,
  [NotificationType.COMMENT_REPLY]: MessageSquare,
  [NotificationType.LIKE_RECEIVED]: Heart,
  [NotificationType.FOLLOW_NEW]: UserPlus,
  [NotificationType.RATING_RECEIVED]: Star,
  [NotificationType.CONTENT_MODERATED]: ShieldAlert,
  [NotificationType.SYSTEM]: Info,
}

const typeColors: Record<NotificationType, string> = {
  [NotificationType.NEW_CONTENT]: 'text-blue-500',
  [NotificationType.COMMENT_REPLY]: 'text-green-500',
  [NotificationType.LIKE_RECEIVED]: 'text-red-500',
  [NotificationType.FOLLOW_NEW]: 'text-purple-500',
  [NotificationType.RATING_RECEIVED]: 'text-yellow-500',
  [NotificationType.CONTENT_MODERATED]: 'text-orange-500',
  [NotificationType.SYSTEM]: 'text-muted-foreground',
}

function formatRelativeTime(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMin / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMin < 1) return 'agora'
  if (diffMin < 60) return `${diffMin}m`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 7) return `${diffDays}d`
  return date.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })
}

export function NotificationList({
  notifications,
  onClickNotification,
  maxItems,
}: NotificationListProps) {
  const items = maxItems ? notifications.slice(0, maxItems) : notifications

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <Bell className="h-8 w-8 mb-2 opacity-50" />
        <p className="text-sm">Sem notificacoes</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border">
      {items.map((notification) => {
        const Icon = typeIcons[notification.type]
        const iconColor = typeColors[notification.type]

        return (
          <button
            key={notification.id}
            onClick={() => onClickNotification?.(notification)}
            className={cn(
              'flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-accent',
              !notification.isRead && 'bg-accent/50',
            )}
          >
            <div className={cn('mt-0.5 flex-shrink-0', iconColor)}>
              {notification.actorAvatar ? (
                <img src={notification.actorAvatar} alt="" className="h-8 w-8 rounded-full" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <Icon className="h-4 w-4" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className={cn('text-sm leading-tight', !notification.isRead && 'font-medium')}>
                {notification.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {notification.message}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatRelativeTime(notification.createdAt)}
              </p>
            </div>

            {!notification.isRead && (
              <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
            )}
          </button>
        )
      })}
    </div>
  )
}
