import { apiClient } from '@/lib/api/client'
import type { ContentType } from '@/features/hub/types'
import type {
  FollowedCreator,
  FavoriteItem,
  NotificationListResponse,
  ActivityFeedItem,
  UserProfile,
  SearchResponse,
} from '../types'
import {
  mockFollowing,
  mockFavorites,
  mockNotifications,
  mockActivityFeed,
  mockUserProfiles,
  mockSearchResults,
} from './mockData'

/**
 * Social Service
 * Usa apiClient pattern (pronto para API real).
 * Por agora retorna mock data.
 */
export const socialService = {
  // ========== FOLLOWS ==========

  getFollowing: async (): Promise<FollowedCreator[]> => {
    try {
      const response = await apiClient.get<FollowedCreator[]>('/social/following')
      return response.data
    } catch {
      return mockFollowing
    }
  },

  followCreator: async (creatorId: string): Promise<FollowedCreator> => {
    try {
      const response = await apiClient.post<FollowedCreator>(`/social/follow/${creatorId}`)
      return response.data
    } catch {
      const creator = mockFollowing.find((c) => c.creatorId === creatorId)
      return (
        creator ?? {
          creatorId,
          username: 'creator',
          name: 'Creator',
          followedAt: new Date().toISOString(),
        }
      )
    }
  },

  unfollowCreator: async (creatorId: string): Promise<void> => {
    try {
      await apiClient.delete(`/social/follow/${creatorId}`)
    } catch {
      // Mock: no-op
    }
  },

  // ========== FAVORITES ==========

  getFavorites: async (filters?: { type?: ContentType }): Promise<FavoriteItem[]> => {
    try {
      const response = await apiClient.get<FavoriteItem[]>('/social/favorites', {
        params: filters,
      })
      return response.data
    } catch {
      if (filters?.type) {
        return mockFavorites.filter((f) => f.contentType === filters.type)
      }
      return mockFavorites
    }
  },

  addFavorite: async (contentId: string, contentType: ContentType): Promise<FavoriteItem> => {
    try {
      const response = await apiClient.post<FavoriteItem>('/social/favorites', {
        contentId,
        contentType,
      })
      return response.data
    } catch {
      return {
        contentId,
        contentType,
        title: 'Conteudo',
        favoritedAt: new Date().toISOString(),
      }
    }
  },

  removeFavorite: async (contentId: string): Promise<void> => {
    try {
      await apiClient.delete(`/social/favorites/${contentId}`)
    } catch {
      // Mock: no-op
    }
  },

  // ========== NOTIFICATIONS ==========

  getNotifications: async (limit?: number): Promise<NotificationListResponse> => {
    try {
      const response = await apiClient.get<NotificationListResponse>('/social/notifications', {
        params: { limit },
      })
      return response.data
    } catch {
      const items = limit ? mockNotifications.slice(0, limit) : mockNotifications
      return {
        items,
        total: mockNotifications.length,
        unreadCount: mockNotifications.filter((n) => !n.isRead).length,
        hasMore: limit ? mockNotifications.length > limit : false,
      }
    }
  },

  markNotificationRead: async (id: string): Promise<void> => {
    try {
      await apiClient.patch(`/social/notifications/${id}/read`)
    } catch {
      // Mock: no-op
    }
  },

  markAllNotificationsRead: async (): Promise<void> => {
    try {
      await apiClient.post('/social/notifications/read-all')
    } catch {
      // Mock: no-op
    }
  },

  // ========== ACTIVITY FEED ==========

  getActivityFeed: async (filters?: {
    following?: boolean
    limit?: number
  }): Promise<ActivityFeedItem[]> => {
    try {
      const response = await apiClient.get<ActivityFeedItem[]>('/social/feed', {
        params: filters,
      })
      return response.data
    } catch {
      const items = filters?.limit ? mockActivityFeed.slice(0, filters.limit) : mockActivityFeed
      return items
    }
  },

  // ========== USER PROFILE ==========

  getUserProfile: async (username: string): Promise<UserProfile> => {
    try {
      const response = await apiClient.get<UserProfile>(`/social/profiles/${username}`)
      return response.data
    } catch {
      const profile = mockUserProfiles.find((p) => p.username === username)
      if (profile) return profile
      return {
        ...mockUserProfiles[0],
        username,
        name: username,
      }
    }
  },

  getMyProfile: async (): Promise<UserProfile> => {
    try {
      const response = await apiClient.get<UserProfile>('/social/profiles/me')
      return response.data
    } catch {
      return mockUserProfiles[0]
    }
  },

  // ========== SEARCH ==========

  search: async (query: string, filters?: { type?: ContentType }): Promise<SearchResponse> => {
    try {
      const response = await apiClient.get<SearchResponse>('/search', {
        params: { q: query, ...filters },
      })
      return response.data
    } catch {
      const lowerQuery = query.toLowerCase()
      let results = mockSearchResults.filter(
        (r) =>
          r.title.toLowerCase().includes(lowerQuery) ||
          r.description.toLowerCase().includes(lowerQuery),
      )

      if (filters?.type) {
        results = results.filter((r) => r.type === filters.type)
      }

      return {
        results,
        total: results.length,
        query,
      }
    }
  },
}
