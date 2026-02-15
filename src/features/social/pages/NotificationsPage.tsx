import { useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui'
import { Skeleton } from '@/components/ui'
import { NotificationType } from '../types'
import { NotificationList } from '../components/NotificationList'
import {
  useNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from '../hooks/useSocial'

type FilterTab = 'all' | 'unread' | 'content' | 'comments' | 'system'

const tabFilters: { value: FilterTab; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'unread', label: 'Nao Lidas' },
  { value: 'content', label: 'Conteudo' },
  { value: 'comments', label: 'Comentarios' },
  { value: 'system', label: 'Sistema' },
]

const tabTypeMap: Record<FilterTab, NotificationType[] | null> = {
  all: null,
  unread: null,
  content: [NotificationType.NEW_CONTENT],
  comments: [NotificationType.COMMENT_REPLY, NotificationType.LIKE_RECEIVED],
  system: [NotificationType.SYSTEM, NotificationType.FOLLOW_NEW, NotificationType.RATING_RECEIVED],
}

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const { data, isLoading } = useNotifications()
  const markAllRead = useMarkAllNotificationsRead()
  const markRead = useMarkNotificationRead()

  const notifications = data?.items ?? []
  const unreadCount = data?.unreadCount ?? 0

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.isRead
    const types = tabTypeMap[activeTab]
    if (!types) return true
    return types.includes(n.type)
  })

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notificacoes</h1>
          <p className="mt-1 text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} nao lidas` : 'Tudo em dia!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
          >
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FilterTab)}>
        <TabsList>
          {tabFilters.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
          <Bell className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium">Sem notificacoes</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {activeTab === 'unread'
              ? 'Nao tens notificacoes por ler.'
              : 'Nao tens notificacoes nesta categoria.'}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <NotificationList
            notifications={filteredNotifications}
            onClickNotification={(n) => {
              if (!n.isRead) {
                markRead.mutate(n.id)
              }
              if (n.targetUrl) {
                window.location.href = n.targetUrl
              }
            }}
          />
        </div>
      )}
    </div>
  )
}
