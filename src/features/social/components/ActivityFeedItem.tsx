import { FileText, RefreshCw, Megaphone } from 'lucide-react'
import { ContentType } from '@/features/hub/types'
import type { ActivityFeedItem as ActivityFeedItemType } from '../types'

interface ActivityFeedItemProps {
  item: ActivityFeedItemType
  onClick?: () => void
}

const activityTypeLabels: Record<string, string> = {
  content_published: 'publicou',
  content_updated: 'atualizou',
  creator_announcement: 'anunciou',
}

const activityTypeIcons: Record<string, typeof FileText> = {
  content_published: FileText,
  content_updated: RefreshCw,
  creator_announcement: Megaphone,
}

const contentTypeLabels: Record<ContentType, string> = {
  [ContentType.ARTICLE]: 'artigo',
  [ContentType.COURSE]: 'curso',
  [ContentType.VIDEO]: 'video',
  [ContentType.EVENT]: 'evento',
  [ContentType.BOOK]: 'livro',
  [ContentType.PODCAST]: 'podcast',
  [ContentType.NEWS]: 'noticia',
}

function formatRelativeTime(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMin / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMin < 1) return 'agora'
  if (diffMin < 60) return `ha ${diffMin} min`
  if (diffHours < 24) return `ha ${diffHours}h`
  if (diffDays < 7) return `ha ${diffDays} dias`
  return date.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })
}

export function ActivityFeedItem({ item, onClick }: ActivityFeedItemProps) {
  const Icon = activityTypeIcons[item.type] ?? FileText
  const actionLabel = activityTypeLabels[item.type] ?? 'partilhou'
  const contentLabel = contentTypeLabels[item.content.type] ?? 'conteudo'

  return (
    <button
      onClick={onClick}
      className="flex w-full items-start gap-4 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-accent"
    >
      {/* Creator avatar */}
      <div className="flex-shrink-0">
        {item.creatorAvatar ? (
          <img
            src={item.creatorAvatar}
            alt={item.creatorName}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
            {item.creatorName.charAt(0)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-medium">{item.creatorName}</span>{' '}
          <span className="text-muted-foreground">
            {actionLabel} um {contentLabel}
          </span>
        </p>

        {/* Content preview */}
        <div className="mt-2 flex gap-3 rounded-md border border-border bg-background p-3">
          {item.content.coverImage && (
            <img
              src={item.content.coverImage}
              alt=""
              className="h-16 w-16 flex-shrink-0 rounded object-cover"
            />
          )}
          <div className="min-w-0">
            <h4 className="text-sm font-medium line-clamp-1">{item.content.title}</h4>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
              {item.content.description}
            </p>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <Icon className="h-3 w-3" />
              <span className="capitalize">{contentLabel}</span>
              {item.content.isPremium && (
                <span className="rounded bg-yellow-100 px-1.5 py-0.5 text-[10px] font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  Premium
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">{formatRelativeTime(item.createdAt)}</p>
      </div>
    </button>
  )
}
