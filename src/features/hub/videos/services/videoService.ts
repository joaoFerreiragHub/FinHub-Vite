import { apiClient } from '@/lib/api/client'
import type { Video, CreateVideoDto } from '../types'
import type { ContentListResponse, ContentFilters } from '../../types'

export const videoService = {
  getVideos: async (filters?: ContentFilters): Promise<ContentListResponse<Video>> => {
    const response = await apiClient.get<ContentListResponse<Video>>('/videos', { params: filters })
    return response.data
  },
  getVideoBySlug: async (slug: string): Promise<Video> => {
    const response = await apiClient.get<Video>(`/videos/${slug}`)
    return response.data
  },
  createVideo: async (data: CreateVideoDto): Promise<Video> => {
    const response = await apiClient.post<Video>('/videos', data)
    return response.data
  },
  updateVideo: async (id: string, data: Partial<CreateVideoDto>): Promise<Video> => {
    const response = await apiClient.patch<Video>(`/videos/${id}`, data)
    return response.data
  },
  deleteVideo: async (id: string): Promise<void> => {
    await apiClient.delete(`/videos/${id}`)
  },
  incrementView: async (id: string): Promise<void> => {
    await apiClient.post(`/videos/${id}/view`)
  },
}
