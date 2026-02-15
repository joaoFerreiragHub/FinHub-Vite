import React from 'react'
import { screen, fireEvent } from '@testing-library/react'
import { NotificationBell } from '@/features/social/components/NotificationBell'
import { useNotificationStore } from '@/features/social/stores/useNotificationStore'
import { renderWithProviders, mockAuthenticatedUser, resetAuthStore } from '../utils'

// Mock the hooks that use React Query
jest.mock('@/features/social/hooks/useSocial', () => ({
  useNotifications: () => ({
    data: {
      items: [
        {
          id: 'n1',
          type: 'new_content',
          title: 'Novo artigo publicado',
          message: 'Pedro publicou um novo artigo',
          isRead: false,
          actorName: 'Pedro Santos',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'n2',
          type: 'comment_reply',
          title: 'Nova resposta',
          message: 'Ana respondeu ao teu comentario',
          isRead: true,
          actorName: 'Ana Costa',
          createdAt: new Date().toISOString(),
        },
      ],
      total: 2,
      unreadCount: 1,
      hasMore: false,
    },
    isLoading: false,
  }),
  useMarkAllNotificationsRead: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
}))

beforeEach(() => {
  resetAuthStore()
  useNotificationStore.setState({ notifications: [], unreadCount: 0, isOpen: false })
})

describe('NotificationBell', () => {
  it('renders the bell button', () => {
    mockAuthenticatedUser()
    renderWithProviders(<NotificationBell />)

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('shows unread badge when there are unread notifications', () => {
    mockAuthenticatedUser()
    useNotificationStore.setState({ unreadCount: 5 })

    renderWithProviders(<NotificationBell />)

    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('does not show badge when unread count is 0', () => {
    mockAuthenticatedUser()
    useNotificationStore.setState({ unreadCount: 0 })

    renderWithProviders(<NotificationBell />)

    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('shows 99+ for large unread counts', () => {
    mockAuthenticatedUser()
    useNotificationStore.setState({ unreadCount: 150 })

    renderWithProviders(<NotificationBell />)

    expect(screen.getByText('99+')).toBeInTheDocument()
  })

  it('opens popover on click', async () => {
    mockAuthenticatedUser()
    useNotificationStore.setState({ unreadCount: 1 })

    renderWithProviders(<NotificationBell />)

    fireEvent.click(screen.getByRole('button'))

    // Popover heading should appear
    expect(await screen.findByText('Notificacoes')).toBeInTheDocument()
  })

  it('shows mark all as read button when there are unreads', async () => {
    mockAuthenticatedUser()
    useNotificationStore.setState({ unreadCount: 3, isOpen: true })

    renderWithProviders(<NotificationBell />)

    expect(await screen.findByText('Marcar todas como lidas')).toBeInTheDocument()
  })

  it('shows "Ver todas as notificacoes" link', async () => {
    mockAuthenticatedUser()
    useNotificationStore.setState({ isOpen: true })

    renderWithProviders(<NotificationBell />)

    expect(await screen.findByText('Ver todas as notificacoes')).toBeInTheDocument()
  })
})
