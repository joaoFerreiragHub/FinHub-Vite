import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { videoService } from '../services/videoService'
import type { ContentFilters } from '../../types'
import type { CreateVideoDto, UpdateVideoDto } from '../types'

export function useVideos(filters?: ContentFilters) {
  return useQuery({
    queryKey: ['videos', filters],
    queryFn: () => videoService.getVideos(filters),
  })
}

export function useVideo(slug: string) {
  return useQuery({
    queryKey: ['video', slug],
    queryFn: () => videoService.getVideoBySlug(slug),
    enabled: !!slug,
  })
}

export function useVideoById(id: string) {
  return useQuery({
    queryKey: ['video-by-id', id],
    queryFn: () => videoService.getVideoById(id),
    enabled: !!id,
  })
}

export function useMyVideos(filters?: ContentFilters) {
  return useQuery({
    queryKey: ['my-videos', filters],
    queryFn: () => videoService.getMyVideos(filters),
  })
}

export function useCreateVideo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateVideoDto) => videoService.createVideo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-videos'] })
    },
  })
}

export function useUpdateVideo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVideoDto }) =>
      videoService.updateVideo(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['video', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['video-by-id', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['videos'] })
      queryClient.invalidateQueries({ queryKey: ['my-videos'] })
    },
  })
}

export function useDeleteVideo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => videoService.deleteVideo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] })
      queryClient.invalidateQueries({ queryKey: ['my-videos'] })
    },
  })
}

export function usePublishVideo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => videoService.publishVideo(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['video', id] })
      queryClient.invalidateQueries({ queryKey: ['video-by-id', id] })
      queryClient.invalidateQueries({ queryKey: ['videos'] })
      queryClient.invalidateQueries({ queryKey: ['my-videos'] })
    },
  })
}
