import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminModerationAppealsService } from '../services/adminModerationAppealsService'
import type {
  AdminModerationAppealListQuery,
  AdminUpdateModerationAppealStatusPayload,
} from '../types/adminModerationAppeals'

interface AdminModerationAppealsQueryOptions {
  enabled?: boolean
}

const ADMIN_MODERATION_APPEALS_QUERY_KEY = ['admin', 'content', 'appeals'] as const

export function useAdminModerationAppeals(
  query: AdminModerationAppealListQuery,
  options?: AdminModerationAppealsQueryOptions,
) {
  return useQuery({
    queryKey: [...ADMIN_MODERATION_APPEALS_QUERY_KEY, query],
    queryFn: () => adminModerationAppealsService.list(query),
    enabled: options?.enabled ?? true,
    staleTime: 20_000,
  })
}

export function useAdminModerationAppealById(
  appealId: string | null,
  options?: AdminModerationAppealsQueryOptions,
) {
  return useQuery({
    queryKey: [...ADMIN_MODERATION_APPEALS_QUERY_KEY, 'detail', appealId],
    queryFn: () => adminModerationAppealsService.getById(appealId || ''),
    enabled: Boolean(appealId) && (options?.enabled ?? true),
    staleTime: 20_000,
  })
}

export function useUpdateAdminModerationAppealStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { appealId: string; data: AdminUpdateModerationAppealStatusPayload }) =>
      adminModerationAppealsService.updateStatus(payload.appealId, payload.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_MODERATION_APPEALS_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_MODERATION_APPEALS_QUERY_KEY, 'detail', variables.appealId],
      })
    },
  })
}
