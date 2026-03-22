import axios from 'axios'
import { apiClient } from '@/lib/api/client'
import type { Video, CreateVideoDto, UpdateVideoDto } from '../types'
import type { ContentListResponse, ContentFilters } from '../../types'

type LegacyVideoListResponse = {
  videos?: Video[]
  pagination?: {
    page?: number
    limit?: number
    total?: number
    pages?: number
  }
}

function normalizeVideoListResponse(
  payload: ContentListResponse<Video> | LegacyVideoListResponse,
  requestedLimit?: number,
): ContentListResponse<Video> {
  if (Array.isArray((payload as ContentListResponse<Video>).items)) {
    return payload as ContentListResponse<Video>
  }

  const legacy = payload as LegacyVideoListResponse
  const items = Array.isArray(legacy.videos) ? legacy.videos : []
  const limit = legacy.pagination?.limit ?? requestedLimit ?? 20
  const page = legacy.pagination?.page ?? 1
  const total = legacy.pagination?.total ?? items.length
  const offset = Math.max(0, (page - 1) * limit)

  return {
    items,
    total,
    limit,
    offset,
    hasMore: offset + items.length < total,
  }
}

export const videoService = {
  getVideos: async (filters?: ContentFilters): Promise<ContentListResponse<Video>> => {
    const response = await apiClient.get<ContentListResponse<Video> | LegacyVideoListResponse>(
      '/videos',
      {
        params: filters,
      },
    )
    return normalizeVideoListResponse(response.data, filters?.limit)
  },

  getVideoBySlug: async (slug: string): Promise<Video> => {
    const response = await apiClient.get<Video>(`/videos/${slug}`)
    return response.data
  },

  getVideoById: async (id: string): Promise<Video> => {
    const response = await apiClient.get<Video>(`/videos/id/${id}`)
    return response.data
  },

  getMyVideos: async (filters?: ContentFilters): Promise<ContentListResponse<Video>> => {
    try {
      const response = await apiClient.get<ContentListResponse<Video> | LegacyVideoListResponse>(
        '/videos/my',
        {
          params: filters,
        },
      )
      return normalizeVideoListResponse(response.data, filters?.limit)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        const fallbackResponse = await apiClient.get<
          ContentListResponse<Video> | LegacyVideoListResponse
        >('/videos/me', {
          params: filters,
        })
        return normalizeVideoListResponse(fallbackResponse.data, filters?.limit)
      }
      throw error
    }
  },

  createVideo: async (data: CreateVideoDto): Promise<Video> => {
    const response = await apiClient.post<Video>('/videos', data)
    return response.data
  },

  updateVideo: async (id: string, data: UpdateVideoDto): Promise<Video> => {
    try {
      const response = await apiClient.put<Video>(`/videos/${id}`, data)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && [404, 405].includes(error.response?.status ?? 0)) {
        const fallbackResponse = await apiClient.patch<Video>(`/videos/${id}`, data)
        return fallbackResponse.data
      }
      throw error
    }
  },

  deleteVideo: async (id: string): Promise<void> => {
    await apiClient.delete(`/videos/${id}`)
  },

  publishVideo: async (id: string): Promise<Video> => {
    const response = await apiClient.patch<Video>(`/videos/${id}/publish`)
    return response.data
  },

  unpublishVideo: async (id: string): Promise<Video> => {
    try {
      const response = await apiClient.post<Video>(`/videos/${id}/unpublish`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && [404, 405].includes(error.response?.status ?? 0)) {
        const fallbackResponse = await apiClient.patch<Video>(`/videos/${id}`, { status: 'draft' })
        return fallbackResponse.data
      }
      throw error
    }
  },

  incrementView: async (id: string): Promise<void> => {
    await apiClient.post(`/videos/${id}/view`)
  },

  toggleLike: async (id: string): Promise<{ liked: boolean; likeCount: number }> => {
    const response = await apiClient.post<{ liked: boolean; likeCount: number }>(
      `/videos/${id}/like`,
    )
    return response.data
  },

  toggleFavorite: async (id: string): Promise<{ favorited: boolean; favoriteCount: number }> => {
    const response = await apiClient.post<{ favorited: boolean; favoriteCount: number }>(
      `/videos/${id}/favorite`,
    )
    return response.data
  },
}
