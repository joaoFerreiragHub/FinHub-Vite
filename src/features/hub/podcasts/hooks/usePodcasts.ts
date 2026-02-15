import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { podcastService } from '../services/podcastService'
import type { ContentFilters } from '../../types'
import type { CreatePodcastDto, UpdatePodcastDto } from '../types'

export function usePodcasts(filters?: ContentFilters) {
  return useQuery({
    queryKey: ['podcasts', filters],
    queryFn: () => podcastService.getPodcasts(filters),
  })
}

export function usePodcast(slug: string) {
  return useQuery({
    queryKey: ['podcast', slug],
    queryFn: () => podcastService.getPodcastBySlug(slug),
    enabled: !!slug,
  })
}

export function useMyPodcasts(filters?: ContentFilters) {
  return useQuery({
    queryKey: ['my-podcasts', filters],
    queryFn: () => podcastService.getMyPodcasts(filters),
  })
}

export function useCreatePodcast() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePodcastDto) => podcastService.createPodcast(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-podcasts'] })
    },
  })
}

export function useUpdatePodcast() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePodcastDto }) =>
      podcastService.updatePodcast(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['podcasts'] })
      queryClient.invalidateQueries({ queryKey: ['my-podcasts'] })
    },
  })
}

export function useDeletePodcast() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => podcastService.deletePodcast(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['podcasts'] })
      queryClient.invalidateQueries({ queryKey: ['my-podcasts'] })
    },
  })
}

export function usePublishPodcast() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => podcastService.publishPodcast(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['podcasts'] })
      queryClient.invalidateQueries({ queryKey: ['my-podcasts'] })
    },
  })
}
