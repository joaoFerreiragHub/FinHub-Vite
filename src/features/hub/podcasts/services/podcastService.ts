import { apiClient } from '@/lib/api/client'
import type {
  Podcast,
  CreatePodcastDto,
  UpdatePodcastDto,
  PodcastEpisode,
  CreateEpisodeDto,
} from '../types'
import type { ContentListResponse, ContentFilters } from '../../types'

/**
 * Podcast Service
 */
export const podcastService = {
  // ========== PODCASTS ==========

  getPodcasts: async (filters?: ContentFilters): Promise<ContentListResponse<Podcast>> => {
    const response = await apiClient.get<ContentListResponse<Podcast>>('/podcasts', {
      params: filters,
    })
    return response.data
  },

  getPodcastBySlug: async (slug: string): Promise<Podcast> => {
    const response = await apiClient.get<Podcast>(`/podcasts/${slug}`)
    return response.data
  },

  createPodcast: async (data: CreatePodcastDto): Promise<Podcast> => {
    const response = await apiClient.post<Podcast>('/podcasts', data)
    return response.data
  },

  updatePodcast: async (id: string, data: UpdatePodcastDto): Promise<Podcast> => {
    const response = await apiClient.patch<Podcast>(`/podcasts/${id}`, data)
    return response.data
  },

  deletePodcast: async (id: string): Promise<void> => {
    await apiClient.delete(`/podcasts/${id}`)
  },

  publishPodcast: async (id: string): Promise<Podcast> => {
    const response = await apiClient.post<Podcast>(`/podcasts/${id}/publish`)
    return response.data
  },

  getMyPodcasts: async (filters?: ContentFilters): Promise<ContentListResponse<Podcast>> => {
    const response = await apiClient.get<ContentListResponse<Podcast>>('/podcasts/me', {
      params: filters,
    })
    return response.data
  },

  // ========== EPISODES ==========

  createEpisode: async (data: CreateEpisodeDto): Promise<PodcastEpisode> => {
    const response = await apiClient.post<PodcastEpisode>('/podcasts/episodes', data)
    return response.data
  },

  updateEpisode: async (id: string, data: Partial<CreateEpisodeDto>): Promise<PodcastEpisode> => {
    const response = await apiClient.patch<PodcastEpisode>(`/podcasts/episodes/${id}`, data)
    return response.data
  },

  deleteEpisode: async (id: string): Promise<void> => {
    await apiClient.delete(`/podcasts/episodes/${id}`)
  },

  // ========== SUBSCRIBE ==========

  subscribe: async (id: string): Promise<{ subscribed: boolean }> => {
    const response = await apiClient.post<{ subscribed: boolean }>(`/podcasts/${id}/subscribe`)
    return response.data
  },

  unsubscribe: async (id: string): Promise<void> => {
    await apiClient.post(`/podcasts/${id}/unsubscribe`)
  },

  // ========== ACTIONS ==========

  incrementView: async (id: string): Promise<void> => {
    await apiClient.post(`/podcasts/${id}/view`)
  },

  toggleLike: async (id: string): Promise<{ liked: boolean; likeCount: number }> => {
    const response = await apiClient.post<{ liked: boolean; likeCount: number }>(
      `/podcasts/${id}/like`,
    )
    return response.data
  },

  toggleFavorite: async (id: string): Promise<{ favorited: boolean; favoriteCount: number }> => {
    const response = await apiClient.post<{ favorited: boolean; favoriteCount: number }>(
      `/podcasts/${id}/favorite`,
    )
    return response.data
  },
}
