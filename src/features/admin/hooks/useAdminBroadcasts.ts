import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminBroadcastsService } from '../services/adminBroadcastsService'
import type {
  AdminBroadcastActionPayload,
  AdminBroadcastCreatePayload,
  AdminBroadcastListQuery,
  AdminBroadcastPreviewPayload,
} from '../types/adminBroadcasts'

interface AdminBroadcastsQueryOptions {
  enabled?: boolean
}

const ADMIN_BROADCASTS_QUERY_KEY = ['admin', 'communications', 'broadcasts'] as const

export function useAdminBroadcasts(
  query: AdminBroadcastListQuery,
  options?: AdminBroadcastsQueryOptions,
) {
  return useQuery({
    queryKey: [...ADMIN_BROADCASTS_QUERY_KEY, query],
    queryFn: () => adminBroadcastsService.list(query),
    enabled: options?.enabled ?? true,
    staleTime: 20_000,
  })
}

export function useAdminBroadcast(
  broadcastId: string | null,
  options?: AdminBroadcastsQueryOptions,
) {
  return useQuery({
    queryKey: [...ADMIN_BROADCASTS_QUERY_KEY, 'detail', broadcastId],
    queryFn: () => adminBroadcastsService.getById(broadcastId || ''),
    enabled: Boolean(broadcastId) && (options?.enabled ?? true),
    staleTime: 20_000,
  })
}

export function usePreviewAdminBroadcastAudience() {
  return useMutation({
    mutationFn: (payload: AdminBroadcastPreviewPayload) =>
      adminBroadcastsService.previewAudience(payload),
  })
}

export function useCreateAdminBroadcast() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminBroadcastCreatePayload) => adminBroadcastsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_BROADCASTS_QUERY_KEY })
    },
  })
}

export function useApproveAdminBroadcast() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { broadcastId: string; data: AdminBroadcastActionPayload }) =>
      adminBroadcastsService.approve(payload.broadcastId, payload.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_BROADCASTS_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_BROADCASTS_QUERY_KEY, 'detail', variables.broadcastId],
      })
    },
  })
}

export function useSendAdminBroadcast() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { broadcastId: string; data: AdminBroadcastActionPayload }) =>
      adminBroadcastsService.send(payload.broadcastId, payload.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_BROADCASTS_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_BROADCASTS_QUERY_KEY, 'detail', variables.broadcastId],
      })
    },
  })
}
