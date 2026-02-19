import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { socialService } from '../services/socialService'
import { useSocialStore } from '../stores/useSocialStore'
import { useNotificationStore } from '../stores/useNotificationStore'
import type { ContentType } from '@/features/hub/types'
import type { FollowedCreator, NotificationPreferencesPatchInput } from '../types'

interface CreatorSubscriptionMutationInput {
  creatorId: string
  isSubscribed: boolean
}

// ========== FOLLOWS ==========

export function useFollowing() {
  return useQuery({
    queryKey: ['social', 'following'],
    queryFn: () => socialService.getFollowing(),
  })
}

export function useFollowCreator() {
  const queryClient = useQueryClient()
  const { followCreator } = useSocialStore()

  return useMutation({
    mutationFn: (creator: FollowedCreator) => socialService.followCreator(creator.creatorId),
    onSuccess: (_, creator) => {
      followCreator(creator)
      queryClient.invalidateQueries({ queryKey: ['social', 'following'] })
    },
  })
}

export function useUnfollowCreator() {
  const queryClient = useQueryClient()
  const { unfollowCreator } = useSocialStore()

  return useMutation({
    mutationFn: (creatorId: string) => socialService.unfollowCreator(creatorId),
    onSuccess: (_, creatorId) => {
      unfollowCreator(creatorId)
      queryClient.invalidateQueries({ queryKey: ['social', 'following'] })
    },
  })
}

// ========== FAVORITES ==========

export function useFavorites(type?: ContentType) {
  return useQuery({
    queryKey: ['social', 'favorites', type],
    queryFn: () => socialService.getFavorites(type ? { targetType: type } : undefined),
  })
}

// ========== NOTIFICATIONS ==========

export function useNotifications(limit?: number) {
  const { setNotifications } = useNotificationStore()

  return useQuery({
    queryKey: ['social', 'notifications', limit],
    queryFn: async () => {
      const response = await socialService.getNotifications(limit)
      setNotifications(response.items)
      return response
    },
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  const { markRead } = useNotificationStore()

  return useMutation({
    mutationFn: (id: string) => socialService.markNotificationRead(id),
    onSuccess: (_, id) => {
      markRead(id)
      queryClient.invalidateQueries({ queryKey: ['social', 'notifications'] })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()
  const { markAllRead } = useNotificationStore()

  return useMutation({
    mutationFn: () => socialService.markAllNotificationsRead(),
    onSuccess: () => {
      markAllRead()
      queryClient.invalidateQueries({ queryKey: ['social', 'notifications'] })
    },
  })
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: ['social', 'notification-preferences'],
    queryFn: () => socialService.getNotificationPreferences(),
  })
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: NotificationPreferencesPatchInput) =>
      socialService.updateNotificationPreferences(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social', 'notification-preferences'] })
    },
  })
}

export function useCreatorSubscriptions(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['social', 'creator-subscriptions', page, limit],
    queryFn: () => socialService.getCreatorSubscriptions({ page, limit }),
  })
}

export function useCreatorSubscriptionStatus(creatorId?: string) {
  return useQuery({
    queryKey: ['social', 'creator-subscription', creatorId],
    queryFn: () => socialService.getCreatorSubscriptionStatus(creatorId || ''),
    enabled: !!creatorId,
  })
}

export function useUpdateCreatorSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ creatorId, isSubscribed }: CreatorSubscriptionMutationInput) =>
      isSubscribed
        ? socialService.subscribeToCreator(creatorId)
        : socialService.unsubscribeFromCreator(creatorId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['social', 'creator-subscriptions'] })
      queryClient.invalidateQueries({
        queryKey: ['social', 'creator-subscription', variables.creatorId],
      })
      queryClient.invalidateQueries({ queryKey: ['social', 'notifications'] })
    },
  })
}

// ========== ACTIVITY FEED ==========

export function useActivityFeed(followingOnly?: boolean, limit?: number) {
  return useQuery({
    queryKey: ['social', 'activity', followingOnly, limit],
    queryFn: () => socialService.getActivityFeed({ following: followingOnly, limit }),
  })
}

// ========== USER PROFILE ==========

export function useUserProfile(username: string) {
  return useQuery({
    queryKey: ['social', 'profile', username],
    queryFn: () => socialService.getUserProfile(username),
    enabled: !!username,
  })
}

export function useMyProfile() {
  return useQuery({
    queryKey: ['social', 'profile', 'me'],
    queryFn: () => socialService.getMyProfile(),
  })
}

// ========== SEARCH ==========

export function useGlobalSearch(query: string, type?: ContentType) {
  return useQuery({
    queryKey: ['search', query, type],
    queryFn: () => socialService.search(query, type ? { type } : undefined),
    enabled: query.length >= 2,
  })
}
