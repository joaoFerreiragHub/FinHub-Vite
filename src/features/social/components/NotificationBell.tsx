import { Bell } from 'lucide-react'
import { Button } from '@/components/ui'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui'
import { useNotificationStore } from '../stores/useNotificationStore'
import { useNotifications, useMarkAllNotificationsRead } from '../hooks/useSocial'
import { NotificationList } from './NotificationList'
import type { Notification } from '../types'

interface NotificationBellProps {
  onNavigateToNotifications?: () => void
  onClickNotification?: (notification: Notification) => void
}

export function NotificationBell({
  onNavigateToNotifications,
  onClickNotification,
}: NotificationBellProps) {
  const { unreadCount, isOpen, setOpen } = useNotificationStore()
  const { data } = useNotifications(5)
  const markAllRead = useMarkAllNotificationsRead()

  const notifications = data?.items ?? []

  return (
    <Popover open={isOpen} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0" sideOffset={8}>
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold">Notificacoes</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto py-1 px-2 text-xs"
              onClick={() => markAllRead.mutate()}
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          <NotificationList
            notifications={notifications}
            onClickNotification={(n) => {
              setOpen(false)
              onClickNotification?.(n)
            }}
            maxItems={5}
          />
        </div>

        {notifications.length > 0 && (
          <div className="border-t border-border p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={() => {
                setOpen(false)
                onNavigateToNotifications?.()
              }}
            >
              Ver todas as notificacoes
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
