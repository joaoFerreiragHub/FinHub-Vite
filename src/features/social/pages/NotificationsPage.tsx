import { useState } from 'react'
import { Bell, Loader2 } from 'lucide-react'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Switch,
} from '@/components/ui'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui'
import { Skeleton } from '@/components/ui'
import { NotificationType, type NotificationPreferences } from '../types'
import { NotificationList } from '../components/NotificationList'
import {
  useNotifications,
  useNotificationPreferences,
  useUpdateNotificationPreferences,
  useCreatorSubscriptions,
  useUpdateCreatorSubscription,
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

const preferenceConfig: Array<{
  key: keyof NotificationPreferences
  label: string
  description: string
}> = [
  {
    key: 'contentPublished',
    label: 'Novo conteudo de criadores',
    description: 'Receber quando criadores que segues publicam conteudo novo.',
  },
  {
    key: 'follow',
    label: 'Novos seguidores',
    description: 'Receber quando alguem comeca a seguir o teu perfil.',
  },
  {
    key: 'comment',
    label: 'Comentarios',
    description: 'Receber quando comentam no teu conteudo.',
  },
  {
    key: 'reply',
    label: 'Respostas',
    description: 'Receber quando respondem aos teus comentarios.',
  },
  {
    key: 'rating',
    label: 'Avaliacoes',
    description: 'Receber quando avaliam o teu conteudo.',
  },
  {
    key: 'like',
    label: 'Likes',
    description: 'Receber quando ha likes em conteudo teu.',
  },
  {
    key: 'mention',
    label: 'Mencoes',
    description: 'Receber quando es mencionado em comentarios.',
  },
]

const defaultPreferences: NotificationPreferences = {
  follow: true,
  comment: true,
  reply: true,
  rating: true,
  like: true,
  mention: true,
  contentPublished: true,
}

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  const { data, isLoading } = useNotifications()
  const { data: preferencesData, isLoading: isPreferencesLoading } = useNotificationPreferences()
  const { data: creatorSubscriptionsData, isLoading: isSubscriptionsLoading } =
    useCreatorSubscriptions(1, 50)

  const markAllRead = useMarkAllNotificationsRead()
  const markRead = useMarkNotificationRead()
  const updatePreferences = useUpdateNotificationPreferences()
  const updateCreatorSubscription = useUpdateCreatorSubscription()

  const notifications = data?.items ?? []
  const unreadCount = data?.unreadCount ?? 0
  const preferences = preferencesData ?? defaultPreferences
  const creatorSubscriptions = creatorSubscriptionsData?.items ?? []

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.isRead
    const types = tabTypeMap[activeTab]
    if (!types) return true
    return types.includes(n.type)
  })

  const togglePreference = (key: keyof NotificationPreferences, checked: boolean) => {
    updatePreferences.mutate({ [key]: checked })
  }

  const toggleCreatorSubscription = (creatorId: string, checked: boolean) => {
    updateCreatorSubscription.mutate({
      creatorId,
      isSubscribed: checked,
    })
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Preferencias de notificacoes</CardTitle>
            <CardDescription>Controla os tipos de eventos que queres receber.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {isPreferencesLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              preferenceConfig.map((item) => (
                <div
                  key={item.key}
                  className="flex items-start justify-between gap-4 rounded-lg border border-border/60 p-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch
                    checked={preferences[item.key]}
                    onCheckedChange={(checked) => togglePreference(item.key, checked)}
                    disabled={updatePreferences.isPending}
                    aria-label={item.label}
                  />
                </div>
              ))
            )}

            {updatePreferences.isPending && (
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />A guardar preferencias...
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscriptions por criador</CardTitle>
            <CardDescription>
              Ativa ou silencia notificacoes de novo conteudo por criador que segues.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {isSubscriptionsLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : creatorSubscriptions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Ainda nao segues criadores suficientes para gerir subscriptions.
              </p>
            ) : (
              creatorSubscriptions.map((subscription) => {
                const creatorName =
                  subscription.creator?.name ||
                  subscription.creator?.username ||
                  subscription.creatorId
                const isPendingRow =
                  updateCreatorSubscription.isPending &&
                  updateCreatorSubscription.variables?.creatorId === subscription.creatorId

                return (
                  <div
                    key={subscription.creatorId}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border/60 p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{creatorName}</p>
                      <p className="text-xs text-muted-foreground">
                        {subscription.isSubscribed
                          ? 'Ativo para novo conteudo'
                          : 'Silenciado para novo conteudo'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {isPendingRow && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      <Switch
                        checked={subscription.isSubscribed}
                        onCheckedChange={(checked) =>
                          toggleCreatorSubscription(subscription.creatorId, checked)
                        }
                        disabled={isPendingRow}
                        aria-label={`Subscription de ${creatorName}`}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
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
