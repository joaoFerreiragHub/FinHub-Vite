import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { socialService } from '../services/socialService'
import { useSocialStore } from '../stores/useSocialStore'
import { useNotificationStore } from '../stores/useNotificationStore'
import type { ContentType } from '@/features/hub/types'
import type {
  FollowedCreator,
  NotificationPreferencesPatchInput,
  SearchFilterType,
  UpdateMyProfileInput,
  UserProfile,
} from '../types'

interface CreatorSubscriptionMutationInput {
  creatorId: string
  isSubscribed: boolean
}

interface UserProfileQueryOptions {
  enabled?: boolean
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
  const pageSize = limit ?? 20

  return useInfiniteQuery({
    queryKey: ['social', 'activity', followingOnly, limit],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      socialService.getActivityFeed({
        following: followingOnly,
        page: Number(pageParam),
        limit: pageSize,
      }),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
  })
}

// ========== USER PROFILE ==========

export function useUserProfile(username: string, options: UserProfileQueryOptions = {}) {
  const enabled = options.enabled ?? true

  return useQuery({
    queryKey: ['social', 'profile', username],
    queryFn: () => socialService.getUserProfile(username),
    enabled: !!username && enabled,
  })
}

export function useMyProfile(options: UserProfileQueryOptions = {}) {
  const enabled = options.enabled ?? true

  return useQuery({
    queryKey: ['social', 'profile', 'me'],
    queryFn: () => socialService.getMyProfile(),
    enabled,
  })
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateMyProfileInput) => socialService.updateMyProfile(input),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData<UserProfile | undefined>(['social', 'profile', 'me'], (current) => {
        if (!current) return current
        return { ...current, ...updatedProfile }
      })
      queryClient.invalidateQueries({ queryKey: ['social', 'profile', 'me'] })
    },
  })
}

// ========== SEARCH ==========

export function useGlobalSearch(query: string, type?: SearchFilterType) {
  const normalizedQuery = query.trim()

  return useQuery({
    queryKey: ['search', normalizedQuery, type],
    queryFn: () => socialService.search(normalizedQuery, type ? { type } : undefined),
    enabled: normalizedQuery.length >= 2,
  })
}
