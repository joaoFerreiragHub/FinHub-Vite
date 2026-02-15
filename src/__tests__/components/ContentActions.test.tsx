import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { ContentActions } from '@/features/hub/components/common/ContentActions'
import { ContentType } from '@/features/hub/types'
import { UserRole } from '@/features/auth/types'
import { useSocialStore } from '@/features/social/stores/useSocialStore'
import {
  renderWithProviders,
  mockAuthenticatedUser,
  mockUnauthenticatedUser,
  resetAuthStore,
} from '../utils'

// Mock useSocial hooks to avoid React Query provider issues
jest.mock('@/features/social/hooks/useSocial', () => ({
  useFollowCreator: () => ({ mutate: jest.fn(), isPending: false }),
  useUnfollowCreator: () => ({ mutate: jest.fn(), isPending: false }),
}))

beforeEach(() => {
  resetAuthStore()
  useSocialStore.setState({ following: [], favorites: [] })
})

describe('ContentActions', () => {
  it('renders like, favorite, and share buttons', () => {
    mockAuthenticatedUser(UserRole.FREE)
    renderWithProviders(<ContentActions contentId="test-1" />)

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(3)
  })

  it('shows like count when > 0', () => {
    mockAuthenticatedUser(UserRole.FREE)
    renderWithProviders(<ContentActions contentId="test-1" likeCount={42} />)

    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('shows labels when showLabels is true', () => {
    mockAuthenticatedUser(UserRole.FREE)
    renderWithProviders(<ContentActions contentId="test-1" showLabels />)

    expect(screen.getByText('Gostei')).toBeInTheDocument()
    expect(screen.getByText('Guardar')).toBeInTheDocument()
    expect(screen.getByText('Partilhar')).toBeInTheDocument()
  })

  it('toggles like state on click', async () => {
    mockAuthenticatedUser(UserRole.FREE)
    const onLike = jest.fn()
    renderWithProviders(
      <ContentActions contentId="test-1" likeCount={10} showLabels onLike={onLike} />,
    )

    const likeButton = screen.getByText('Gostei').closest('button')!
    fireEvent.click(likeButton)

    await waitFor(() => {
      expect(screen.getByText('11')).toBeInTheDocument()
    })
  })

  it('toggles favorite and syncs with social store', async () => {
    mockAuthenticatedUser(UserRole.FREE)
    renderWithProviders(
      <ContentActions
        contentId="test-1"
        contentType={ContentType.ARTICLE}
        contentTitle="Test Article"
        showLabels
      />,
    )

    const favButton = screen.getByText('Guardar').closest('button')!
    fireEvent.click(favButton)

    await waitFor(() => {
      expect(useSocialStore.getState().isFavorited('test-1')).toBe(true)
    })
  })

  it('disables like and favorite for visitors', () => {
    mockUnauthenticatedUser()
    renderWithProviders(<ContentActions contentId="test-1" showLabels />)

    const likeButton = screen.getByText('Gostei').closest('button')!
    const favButton = screen.getByText('Guardar').closest('button')!

    expect(likeButton).toBeDisabled()
    expect(favButton).toBeDisabled()
  })

  it('share button is always enabled', () => {
    mockUnauthenticatedUser()
    renderWithProviders(<ContentActions contentId="test-1" showLabels />)

    const shareButton = screen.getByText('Partilhar').closest('button')!
    expect(shareButton).not.toBeDisabled()
  })

  it('initializes favorite state from social store', () => {
    mockAuthenticatedUser(UserRole.FREE)
    useSocialStore.getState().addFavorite({
      contentId: 'test-1',
      contentType: ContentType.ARTICLE,
      title: 'Test',
      favoritedAt: new Date().toISOString(),
    })

    renderWithProviders(<ContentActions contentId="test-1" showLabels />)

    // The favorite button should have the yellow-500 class (active state)
    const favButton = screen.getByText('Guardar').closest('button')!
    expect(favButton.className).toContain('text-yellow-500')
  })
})
