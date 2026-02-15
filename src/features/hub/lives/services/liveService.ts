import { apiClient } from '@/lib/api/client'
import type { LiveEvent, CreateLiveEventDto, UpdateLiveEventDto } from '../types'
import type { ContentListResponse, ContentFilters } from '../../types'

/**
 * Live Events Service
 */
export const liveService = {
  // ========== EVENTS ==========

  getLives: async (filters?: ContentFilters): Promise<ContentListResponse<LiveEvent>> => {
    const response = await apiClient.get<ContentListResponse<LiveEvent>>('/lives', {
      params: filters,
    })
    return response.data
  },

  getLiveBySlug: async (slug: string): Promise<LiveEvent> => {
    const response = await apiClient.get<LiveEvent>(`/lives/${slug}`)
    return response.data
  },

  createLive: async (data: CreateLiveEventDto): Promise<LiveEvent> => {
    const response = await apiClient.post<LiveEvent>('/lives', data)
    return response.data
  },

  updateLive: async (id: string, data: UpdateLiveEventDto): Promise<LiveEvent> => {
    const response = await apiClient.patch<LiveEvent>(`/lives/${id}`, data)
    return response.data
  },

  deleteLive: async (id: string): Promise<void> => {
    await apiClient.delete(`/lives/${id}`)
  },

  publishLive: async (id: string): Promise<LiveEvent> => {
    const response = await apiClient.post<LiveEvent>(`/lives/${id}/publish`)
    return response.data
  },

  getMyLives: async (filters?: ContentFilters): Promise<ContentListResponse<LiveEvent>> => {
    const response = await apiClient.get<ContentListResponse<LiveEvent>>('/lives/me', {
      params: filters,
    })
    return response.data
  },

  // ========== REGISTRATION ==========

  registerForEvent: async (id: string): Promise<{ registered: boolean }> => {
    const response = await apiClient.post<{ registered: boolean }>(`/lives/${id}/register`)
    return response.data
  },

  unregisterFromEvent: async (id: string): Promise<void> => {
    await apiClient.post(`/lives/${id}/unregister`)
  },

  // ========== ACTIONS ==========

  incrementView: async (id: string): Promise<void> => {
    await apiClient.post(`/lives/${id}/view`)
  },

  toggleLike: async (id: string): Promise<{ liked: boolean; likeCount: number }> => {
    const response = await apiClient.post<{ liked: boolean; likeCount: number }>(
      `/lives/${id}/like`,
    )
    return response.data
  },

  toggleFavorite: async (id: string): Promise<{ favorited: boolean; favoriteCount: number }> => {
    const response = await apiClient.post<{ favorited: boolean; favoriteCount: number }>(
      `/lives/${id}/favorite`,
    )
    return response.data
  },
}
