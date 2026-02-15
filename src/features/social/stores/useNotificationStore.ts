import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Notification } from '../types'

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isOpen: boolean
}

interface NotificationActions {
  add: (notification: Notification) => void
  markRead: (id: string) => void
  markAllRead: () => void
  remove: (id: string) => void
  clear: () => void
  setOpen: (open: boolean) => void
  setNotifications: (notifications: Notification[]) => void
}

type NotificationStore = NotificationState & NotificationActions

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      isOpen: false,

      add: (notification) => {
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
        }))
      },

      markRead: (id) => {
        const notification = get().notifications.find((n) => n.id === id)
        if (!notification || notification.isRead) return

        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }))
      },

      markAllRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
          unreadCount: 0,
        }))
      },

      remove: (id) => {
        const notification = get().notifications.find((n) => n.id === id)
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
          unreadCount:
            notification && !notification.isRead
              ? Math.max(0, state.unreadCount - 1)
              : state.unreadCount,
        }))
      },

      clear: () => {
        set({ notifications: [], unreadCount: 0 })
      },

      setOpen: (open) => {
        set({ isOpen: open })
      },

      setNotifications: (notifications) => {
        set({
          notifications,
          unreadCount: notifications.filter((n) => !n.isRead).length,
        })
      },
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
    },
  ),
)
