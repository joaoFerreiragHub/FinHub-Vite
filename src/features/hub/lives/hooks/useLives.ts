import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { liveService } from '../services/liveService'
import type { ContentFilters } from '../../types'
import type { CreateLiveEventDto, UpdateLiveEventDto } from '../types'

export function useLives(filters?: ContentFilters) {
  return useQuery({
    queryKey: ['lives', filters],
    queryFn: () => liveService.getLives(filters),
  })
}

export function useLive(slug: string) {
  return useQuery({
    queryKey: ['live', slug],
    queryFn: () => liveService.getLiveBySlug(slug),
    enabled: !!slug,
  })
}

export function useMyLives(filters?: ContentFilters) {
  return useQuery({
    queryKey: ['my-lives', filters],
    queryFn: () => liveService.getMyLives(filters),
  })
}

export function useCreateLive() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateLiveEventDto) => liveService.createLive(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-lives'] })
    },
  })
}

export function useUpdateLive() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLiveEventDto }) =>
      liveService.updateLive(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lives'] })
      queryClient.invalidateQueries({ queryKey: ['my-lives'] })
    },
  })
}

export function useDeleteLive() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => liveService.deleteLive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lives'] })
      queryClient.invalidateQueries({ queryKey: ['my-lives'] })
    },
  })
}

export function usePublishLive() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => liveService.publishLive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lives'] })
      queryClient.invalidateQueries({ queryKey: ['my-lives'] })
    },
  })
}

export function useRegisterLive() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => liveService.registerForEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lives'] })
      queryClient.invalidateQueries({ queryKey: ['live'] })
    },
  })
}
