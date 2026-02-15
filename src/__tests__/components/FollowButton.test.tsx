import React from 'react'
import { screen, fireEvent } from '@testing-library/react'
import { FollowButton } from '@/features/social/components/FollowButton'
import { useSocialStore } from '@/features/social/stores/useSocialStore'
import { UserRole } from '@/features/auth/types'
import {
  renderWithProviders,
  mockAuthenticatedUser,
  mockUnauthenticatedUser,
  resetAuthStore,
} from '../utils'

const mockMutate = jest.fn()

jest.mock('@/features/social/hooks/useSocial', () => ({
  useFollowCreator: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
  useUnfollowCreator: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}))

const defaultProps = {
  creatorId: 'creator-1',
  creatorName: 'Pedro Santos',
  creatorUsername: 'pedro-santos',
}

beforeEach(() => {
  resetAuthStore()
  useSocialStore.setState({ following: [], favorites: [] })
  mockMutate.mockClear()
})

describe('FollowButton', () => {
  it('shows "Seguir" when not following', () => {
    mockAuthenticatedUser(UserRole.FREE)
    renderWithProviders(<FollowButton {...defaultProps} />)

    expect(screen.getByText('Seguir')).toBeInTheDocument()
  })

  it('shows "A Seguir" when already following', () => {
    mockAuthenticatedUser(UserRole.FREE)
    useSocialStore.getState().followCreator({
      creatorId: 'creator-1',
      username: 'pedro-santos',
      name: 'Pedro Santos',
      followedAt: new Date().toISOString(),
    })

    renderWithProviders(<FollowButton {...defaultProps} />)

    expect(screen.getByText('A Seguir')).toBeInTheDocument()
  })

  it('is disabled for visitors (unauthenticated)', () => {
    mockUnauthenticatedUser()
    renderWithProviders(<FollowButton {...defaultProps} />)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('is enabled for FREE users', () => {
    mockAuthenticatedUser(UserRole.FREE)
    renderWithProviders(<FollowButton {...defaultProps} />)

    const button = screen.getByRole('button')
    expect(button).not.toBeDisabled()
  })

  it('calls follow mutation on click when not following', () => {
    mockAuthenticatedUser(UserRole.FREE)
    renderWithProviders(<FollowButton {...defaultProps} />)

    fireEvent.click(screen.getByRole('button'))

    expect(mockMutate).toHaveBeenCalled()
  })

  it('calls unfollow mutation on click when following', () => {
    mockAuthenticatedUser(UserRole.FREE)
    useSocialStore.getState().followCreator({
      creatorId: 'creator-1',
      username: 'pedro-santos',
      name: 'Pedro Santos',
      followedAt: new Date().toISOString(),
    })

    renderWithProviders(<FollowButton {...defaultProps} />)

    fireEvent.click(screen.getByRole('button'))

    expect(mockMutate).toHaveBeenCalledWith('creator-1')
  })

  it('shows title tooltip for visitors', () => {
    mockUnauthenticatedUser()
    renderWithProviders(<FollowButton {...defaultProps} />)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('title', 'Faz login para seguir criadores')
  })

  it('hides icon when showIcon is false', () => {
    mockAuthenticatedUser(UserRole.FREE)
    renderWithProviders(<FollowButton {...defaultProps} showIcon={false} />)

    // lucide-react icons render as SVGs
    const button = screen.getByRole('button')
    const svgs = button.querySelectorAll('svg')
    expect(svgs).toHaveLength(0)
  })
})
