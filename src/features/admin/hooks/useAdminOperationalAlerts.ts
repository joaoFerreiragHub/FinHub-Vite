import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminOperationalAlertsService } from '../services/adminOperationalAlertsService'
import type { AdminOperationalAlertState } from '../types/adminOperationalAlerts'

interface AdminOperationalAlertsQuery {
  windowHours?: number
  limit?: number
  includeDismissed?: boolean
  state?: AdminOperationalAlertState | 'all'
}

interface AdminOperationalAlertsOptions {
  enabled?: boolean
}

const focusedPollingInterval = (): number | false => {
  if (typeof document === 'undefined') return 10_000
  return document.visibilityState === 'visible' ? 10_000 : false
}

export function useAdminOperationalAlerts(
  query: AdminOperationalAlertsQuery = {},
  options?: AdminOperationalAlertsOptions,
) {
  return useQuery({
    queryKey: ['admin', 'alerts', 'internal', query],
    queryFn: () => adminOperationalAlertsService.getInternalAlerts(query),
    staleTime: 30_000,
    refetchInterval: focusedPollingInterval,
    refetchIntervalInBackground: false,
    enabled: options?.enabled ?? true,
  })
}

export function useAcknowledgeAdminOperationalAlert() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ alertId, reason }: { alertId: string; reason?: string }) =>
      adminOperationalAlertsService.acknowledgeInternalAlert(alertId, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'alerts', 'internal'] })
    },
  })
}

export function useDismissAdminOperationalAlert() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ alertId, reason }: { alertId: string; reason?: string }) =>
      adminOperationalAlertsService.dismissInternalAlert(alertId, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'alerts', 'internal'] })
    },
  })
}
