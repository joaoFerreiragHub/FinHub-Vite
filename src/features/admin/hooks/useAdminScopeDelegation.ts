import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminScopeDelegationService } from '../services/adminScopeDelegationService'
import type {
  AdminScopeDelegationCreatePayload,
  AdminScopeDelegationListQuery,
  AdminScopeDelegationRevokePayload,
} from '../types/adminScopeDelegation'

interface AdminScopeDelegationQueryOptions {
  enabled?: boolean
}

const ADMIN_SCOPE_DELEGATIONS_KEY = ['admin', 'scope-delegations'] as const

export function useAdminScopeDelegations(
  userId: string | null,
  query: AdminScopeDelegationListQuery,
  options?: AdminScopeDelegationQueryOptions,
) {
  return useQuery({
    queryKey: [...ADMIN_SCOPE_DELEGATIONS_KEY, userId, query],
    queryFn: () => adminScopeDelegationService.list(userId || '', query),
    enabled: Boolean(userId) && (options?.enabled ?? true),
    staleTime: 15_000,
  })
}

export function useCreateAdminScopeDelegation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { userId: string; payload: AdminScopeDelegationCreatePayload }) =>
      adminScopeDelegationService.create(input.userId, input.payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SCOPE_DELEGATIONS_KEY })
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', variables.userId] })
    },
  })
}

export function useRevokeAdminScopeDelegation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: {
      userId: string
      delegationId: string
      payload: AdminScopeDelegationRevokePayload
    }) => adminScopeDelegationService.revoke(input.userId, input.delegationId, input.payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SCOPE_DELEGATIONS_KEY })
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', variables.userId] })
    },
  })
}
