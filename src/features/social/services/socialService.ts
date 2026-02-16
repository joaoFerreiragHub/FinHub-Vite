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

/**
 * Social Service
 * Conecta com a API real implementada no backend
 *
 * Endpoints implementados:
 * - Follow: POST/DELETE /follow/:targetId, GET /follow/following, GET /follow/followers
 * - Favorites: POST /favorites, DELETE /favorites/:id, GET /favorites
 * - Notifications: GET /notifications, PATCH /notifications/:id/read, POST /notifications/read-all
 */
export const socialService = {
  // ========== FOLLOWS ==========

  /**
   * Obter lista de quem eu sigo
   */
  getFollowing: async (): Promise<FollowedCreator[]> => {
    const response = await apiClient.get<FollowedCreator[]>('/follow/following')
    return response.data
  },

  /**
   * Obter meus seguidores
   */
  getFollowers: async (): Promise<FollowedCreator[]> => {
    const response = await apiClient.get<FollowedCreator[]>('/follow/followers')
    return response.data
  },

  /**
   * Seguir um criador
   */
  followCreator: async (creatorId: string): Promise<void> => {
    await apiClient.post(`/follow/${creatorId}`)
  },

  /**
   * Deixar de seguir um criador
   */
  unfollowCreator: async (creatorId: string): Promise<void> => {
    await apiClient.delete(`/follow/${creatorId}`)
  },

  /**
   * Verificar se estou a seguir um criador
   */
  isFollowing: async (creatorId: string): Promise<{ isFollowing: boolean }> => {
    const response = await apiClient.get<{ isFollowing: boolean }>(`/follow/${creatorId}/status`)
    return response.data
  },

  /**
   * Obter follows mútuos
   */
  getMutualFollows: async (): Promise<FollowedCreator[]> => {
    const response = await apiClient.get<FollowedCreator[]>('/follow/mutual')
    return response.data
  },

  // ========== FAVORITES ==========

  /**
   * Obter meus favoritos
   */
  getFavorites: async (filters?: { targetType?: ContentType }): Promise<FavoriteItem[]> => {
    const response = await apiClient.get<FavoriteItem[]>('/favorites', {
      params: filters,
    })
    return response.data
  },

  /**
   * Adicionar aos favoritos
   */
  addFavorite: async (targetId: string, targetType: ContentType): Promise<void> => {
    await apiClient.post('/favorites', {
      targetId,
      targetType,
    })
  },

  /**
   * Remover dos favoritos
   */
  removeFavorite: async (favoriteId: string): Promise<void> => {
    await apiClient.delete(`/favorites/${favoriteId}`)
  },

  /**
   * Verificar se está nos favoritos
   */
  isFavorited: async (targetId: string): Promise<{ isFavorited: boolean }> => {
    const response = await apiClient.get<{ isFavorited: boolean }>(`/favorites/check/${targetId}`)
    return response.data
  },

  // ========== NOTIFICATIONS ==========

  /**
   * Obter notificações
   */
  getNotifications: async (limit?: number): Promise<NotificationListResponse> => {
    const response = await apiClient.get<NotificationListResponse>('/notifications', {
      params: { limit },
    })
    return response.data
  },

  /**
   * Obter notificações não lidas
   */
  getUnreadNotifications: async (): Promise<NotificationListResponse> => {
    const response = await apiClient.get<NotificationListResponse>('/notifications/unread')
    return response.data
  },

  /**
   * Marcar notificação como lida
   */
  markNotificationRead: async (id: string): Promise<void> => {
    await apiClient.patch(`/notifications/${id}/read`)
  },

  /**
   * Marcar todas como lidas
   */
  markAllNotificationsRead: async (): Promise<void> => {
    await apiClient.post('/notifications/read-all')
  },

  /**
   * Apagar notificação
   */
  deleteNotification: async (id: string): Promise<void> => {
    await apiClient.delete(`/notifications/${id}`)
  },

  /**
   * Apagar todas as notificações
   */
  deleteAllNotifications: async (): Promise<void> => {
    await apiClient.delete('/notifications')
  },

  // ========== ACTIVITY FEED ==========
  // Nota: Estes endpoints ainda não foram implementados no backend
  // Mantidos para compatibilidade com o frontend existente

  getActivityFeed: async (filters?: {
    following?: boolean
    limit?: number
  }): Promise<ActivityFeedItem[]> => {
    // TODO: Implementar endpoint no backend
    const response = await apiClient.get<ActivityFeedItem[]>('/social/feed', {
      params: filters,
    })
    return response.data
  },

  // ========== USER PROFILE ==========
  // Nota: Perfis são geridos através do /auth/me endpoint

  getUserProfile: async (username: string): Promise<UserProfile> => {
    // TODO: Implementar endpoint no backend para obter perfil público
    const response = await apiClient.get<UserProfile>(`/users/${username}`)
    return response.data
  },

  getMyProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>('/auth/me')
    return response.data
  },

  // ========== SEARCH ==========
  // Nota: Endpoint de search ainda não implementado no backend

  search: async (query: string, filters?: { type?: ContentType }): Promise<SearchResponse> => {
    // TODO: Implementar endpoint no backend
    const response = await apiClient.get<SearchResponse>('/search', {
      params: { q: query, ...filters },
    })
    return response.data
  },
}
