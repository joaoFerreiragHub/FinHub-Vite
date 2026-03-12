import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminContentAccessPolicyService } from '../services/adminContentAccessPolicyService'
import type {
  AdminContentAccessPolicyListQuery,
  AdminContentAccessPolicyPayload,
} from '../types/adminContentAccessPolicy'

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

export function useAdminContentAccessPolicy(
  policyId: string | null,
  options?: AdminContentAccessPolicyQueryOptions,
) {
  return useQuery({
    queryKey: [...ADMIN_CONTENT_ACCESS_POLICY_QUERY_KEY, 'item', policyId],
    queryFn: () => adminContentAccessPolicyService.getById(policyId || ''),
    enabled: Boolean(policyId) && (options?.enabled ?? true),
    staleTime: 20_000,
  })
}

export function usePreviewAdminContentAccessPolicy() {
  return useMutation({
    mutationFn: (payload: AdminContentAccessPolicyPayload) =>
      adminContentAccessPolicyService.preview(payload),
  })
}

export function useCreateAdminContentAccessPolicy() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AdminContentAccessPolicyPayload) =>
      adminContentAccessPolicyService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CONTENT_ACCESS_POLICY_QUERY_KEY })
    },
  })
}

export function useUpdateAdminContentAccessPolicy() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { policyId: string; data: AdminContentAccessPolicyPayload }) =>
      adminContentAccessPolicyService.update(payload.policyId, payload.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CONTENT_ACCESS_POLICY_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_CONTENT_ACCESS_POLICY_QUERY_KEY, 'item', variables.policyId],
      })
    },
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
