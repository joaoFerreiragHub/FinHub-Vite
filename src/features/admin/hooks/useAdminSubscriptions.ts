import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminSubscriptionsService } from '../services/adminSubscriptionsService'
import type {
  AdminExtendSubscriptionTrialPayload,
  AdminReactivateSubscriptionPayload,
  AdminRevokeSubscriptionEntitlementPayload,
  AdminSubscriptionListQuery,
} from '../types/adminSubscriptions'

interface AdminSubscriptionsQueryOptions {
  enabled?: boolean
}

const ADMIN_SUBSCRIPTIONS_QUERY_KEY = ['admin', 'monetization', 'subscriptions'] as const

export function useAdminSubscriptions(
  query: AdminSubscriptionListQuery,
  options?: AdminSubscriptionsQueryOptions,
) {
  return useQuery({
    queryKey: [...ADMIN_SUBSCRIPTIONS_QUERY_KEY, query],
    queryFn: () => adminSubscriptionsService.list(query),
    enabled: options?.enabled ?? true,
    staleTime: 20_000,
  })
}

export function useAdminSubscriptionByUser(
  userId: string | null,
  options?: AdminSubscriptionsQueryOptions,
) {
  return useQuery({
    queryKey: [...ADMIN_SUBSCRIPTIONS_QUERY_KEY, 'user', userId],
    queryFn: () => adminSubscriptionsService.getByUser(userId || ''),
    enabled: Boolean(userId) && (options?.enabled ?? true),
    staleTime: 20_000,
  })
}

export function useExtendAdminSubscriptionTrial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { userId: string; data: AdminExtendSubscriptionTrialPayload }) =>
      adminSubscriptionsService.extendTrial(payload.userId, payload.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SUBSCRIPTIONS_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_SUBSCRIPTIONS_QUERY_KEY, 'user', variables.userId],
      })
    },
  })
}

export function useRevokeAdminSubscriptionEntitlement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { userId: string; data: AdminRevokeSubscriptionEntitlementPayload }) =>
      adminSubscriptionsService.revokeEntitlement(payload.userId, payload.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SUBSCRIPTIONS_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_SUBSCRIPTIONS_QUERY_KEY, 'user', variables.userId],
      })
    },
  })
}

export function useReactivateAdminSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { userId: string; data: AdminReactivateSubscriptionPayload }) =>
      adminSubscriptionsService.reactivate(payload.userId, payload.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SUBSCRIPTIONS_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_SUBSCRIPTIONS_QUERY_KEY, 'user', variables.userId],
      })
    },
  })
}
