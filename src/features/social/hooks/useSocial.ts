import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { socialService } from '../services/socialService'
import { useSocialStore } from '../stores/useSocialStore'
import { useNotificationStore } from '../stores/useNotificationStore'
import type { ContentType } from '@/features/hub/types'
import type { FollowedCreator } from '../types'

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
    queryFn: () => socialService.getFavorites(type ? { type } : undefined),
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
