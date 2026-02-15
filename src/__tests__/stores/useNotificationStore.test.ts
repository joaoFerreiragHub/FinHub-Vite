import { useNotificationStore } from '@/features/social/stores/useNotificationStore'
import { NotificationType } from '@/features/social/types'
import type { Notification } from '@/features/social/types'

function createNotification(overrides?: Partial<Notification>): Notification {
  return {
    id: `notif-${Date.now()}-${Math.random()}`,
    type: NotificationType.NEW_CONTENT,
    title: 'Test Notification',
    message: 'Test message',
    isRead: false,
    createdAt: new Date().toISOString(),
    ...overrides,
  }
}

beforeEach(() => {
  useNotificationStore.setState({ notifications: [], unreadCount: 0, isOpen: false })
})

describe('useNotificationStore', () => {
  describe('initial state', () => {
    it('starts with empty notifications', () => {
      expect(useNotificationStore.getState().notifications).toEqual([])
      expect(useNotificationStore.getState().unreadCount).toBe(0)
      expect(useNotificationStore.getState().isOpen).toBe(false)
    })
  })

  describe('add', () => {
    it('adds a notification and increments unread count', () => {
      const notif = createNotification({ id: 'n1' })
      useNotificationStore.getState().add(notif)

      expect(useNotificationStore.getState().notifications).toHaveLength(1)
      expect(useNotificationStore.getState().unreadCount).toBe(1)
    })

    it('adds new notifications to the beginning', () => {
      const n1 = createNotification({ id: 'n1', title: 'First' })
      const n2 = createNotification({ id: 'n2', title: 'Second' })

      useNotificationStore.getState().add(n1)
      useNotificationStore.getState().add(n2)

      expect(useNotificationStore.getState().notifications[0].title).toBe('Second')
    })

    it('does not increment unread count for read notifications', () => {
      const notif = createNotification({ id: 'n1', isRead: true })
      useNotificationStore.getState().add(notif)

      expect(useNotificationStore.getState().unreadCount).toBe(0)
    })
  })

  describe('markRead', () => {
    it('marks a notification as read and decrements unread count', () => {
      const notif = createNotification({ id: 'n1' })
      useNotificationStore.getState().add(notif)

      useNotificationStore.getState().markRead('n1')

      const updated = useNotificationStore.getState().notifications.find((n) => n.id === 'n1')
      expect(updated?.isRead).toBe(true)
      expect(useNotificationStore.getState().unreadCount).toBe(0)
    })

    it('does nothing for already read notifications', () => {
      const notif = createNotification({ id: 'n1', isRead: true })
      useNotificationStore.getState().add(notif)

      useNotificationStore.getState().markRead('n1')
      expect(useNotificationStore.getState().unreadCount).toBe(0)
    })

    it('does nothing for non-existent notification', () => {
      const notif = createNotification({ id: 'n1' })
      useNotificationStore.getState().add(notif)

      useNotificationStore.getState().markRead('non-existent')
      expect(useNotificationStore.getState().unreadCount).toBe(1)
    })
  })

  describe('markAllRead', () => {
    it('marks all notifications as read', () => {
      useNotificationStore.getState().add(createNotification({ id: 'n1' }))
      useNotificationStore.getState().add(createNotification({ id: 'n2' }))
      useNotificationStore.getState().add(createNotification({ id: 'n3' }))

      expect(useNotificationStore.getState().unreadCount).toBe(3)

      useNotificationStore.getState().markAllRead()

      expect(useNotificationStore.getState().unreadCount).toBe(0)
      expect(useNotificationStore.getState().notifications.every((n) => n.isRead)).toBe(true)
    })
  })

  describe('remove', () => {
    it('removes a notification', () => {
      useNotificationStore.getState().add(createNotification({ id: 'n1' }))
      useNotificationStore.getState().add(createNotification({ id: 'n2' }))

      useNotificationStore.getState().remove('n1')

      expect(useNotificationStore.getState().notifications).toHaveLength(1)
      expect(useNotificationStore.getState().notifications[0].id).toBe('n2')
    })

    it('decrements unread count when removing unread notification', () => {
      useNotificationStore.getState().add(createNotification({ id: 'n1' }))
      expect(useNotificationStore.getState().unreadCount).toBe(1)

      useNotificationStore.getState().remove('n1')
      expect(useNotificationStore.getState().unreadCount).toBe(0)
    })

    it('does not decrement unread count when removing read notification', () => {
      useNotificationStore.getState().add(createNotification({ id: 'n1' }))
      useNotificationStore.getState().markRead('n1')

      useNotificationStore.getState().add(createNotification({ id: 'n2' }))
      expect(useNotificationStore.getState().unreadCount).toBe(1)

      useNotificationStore.getState().remove('n1')
      expect(useNotificationStore.getState().unreadCount).toBe(1)
    })
  })

  describe('clear', () => {
    it('removes all notifications and resets count', () => {
      useNotificationStore.getState().add(createNotification({ id: 'n1' }))
      useNotificationStore.getState().add(createNotification({ id: 'n2' }))

      useNotificationStore.getState().clear()

      expect(useNotificationStore.getState().notifications).toEqual([])
      expect(useNotificationStore.getState().unreadCount).toBe(0)
    })
  })

  describe('setOpen', () => {
    it('toggles open state', () => {
      useNotificationStore.getState().setOpen(true)
      expect(useNotificationStore.getState().isOpen).toBe(true)

      useNotificationStore.getState().setOpen(false)
      expect(useNotificationStore.getState().isOpen).toBe(false)
    })
  })

  describe('setNotifications', () => {
    it('sets notifications and computes unread count', () => {
      const notifications = [
        createNotification({ id: 'n1', isRead: false }),
        createNotification({ id: 'n2', isRead: true }),
        createNotification({ id: 'n3', isRead: false }),
      ]

      useNotificationStore.getState().setNotifications(notifications)

      expect(useNotificationStore.getState().notifications).toHaveLength(3)
      expect(useNotificationStore.getState().unreadCount).toBe(2)
    })
  })
})
