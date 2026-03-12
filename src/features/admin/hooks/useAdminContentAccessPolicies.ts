import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminContentAccessPolicyService } from '../services/adminContentAccessPolicyService'
import type { AdminContentAccessPolicyListQuery } from '../types/adminContentAccessPolicy'

interface AdminContentAccessPolicyQueryOptions {
  enabled?: boolean
}

const ADMIN_CONTENT_ACCESS_POLICY_QUERY_KEY = ['admin', 'content', 'access-policies'] as const

export function useAdminContentAccessPolicies(
  query: AdminContentAccessPolicyListQuery,
  options?: AdminContentAccessPolicyQueryOptions,
) {
  return useQuery({
    queryKey: [...ADMIN_CONTENT_ACCESS_POLICY_QUERY_KEY, query],
    queryFn: () => adminContentAccessPolicyService.list(query),
    enabled: options?.enabled ?? true,
    staleTime: 20_000,
  })
}

export function useActivateAdminContentAccessPolicy() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { policyId: string; changeReason: string }) =>
      adminContentAccessPolicyService.activate(payload.policyId, {
        changeReason: payload.changeReason,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CONTENT_ACCESS_POLICY_QUERY_KEY })
    },
  })
}

export function useDeactivateAdminContentAccessPolicy() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { policyId: string; changeReason: string }) =>
      adminContentAccessPolicyService.deactivate(payload.policyId, {
        changeReason: payload.changeReason,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CONTENT_ACCESS_POLICY_QUERY_KEY })
    },
  })
}

