import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminDashboardPersonalizationService } from '../services/adminDashboardPersonalizationService'
import type {
  AdminDashboardPersonalizationResetPayload,
  AdminDashboardPersonalizationUpdatePayload,
} from '../types/adminDashboardPersonalization'

const ADMIN_DASHBOARD_PERSONALIZATION_QUERY_KEY = ['admin', 'dashboard', 'personalization'] as const

export function useAdminDashboardPersonalization(enabled = true) {
  return useQuery({
    queryKey: ADMIN_DASHBOARD_PERSONALIZATION_QUERY_KEY,
    queryFn: () => adminDashboardPersonalizationService.get(),
    staleTime: 60_000,
    enabled,
  })
}

export function useUpdateAdminDashboardPersonalization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminDashboardPersonalizationUpdatePayload) =>
      adminDashboardPersonalizationService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_DASHBOARD_PERSONALIZATION_QUERY_KEY,
      })
    },
  })
}

export function useResetAdminDashboardPersonalization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload?: AdminDashboardPersonalizationResetPayload) =>
      adminDashboardPersonalizationService.reset(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_DASHBOARD_PERSONALIZATION_QUERY_KEY,
      })
    },
  })
}
