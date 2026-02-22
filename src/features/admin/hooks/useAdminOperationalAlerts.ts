import { useQuery } from '@tanstack/react-query'
import { adminOperationalAlertsService } from '../services/adminOperationalAlertsService'

interface AdminOperationalAlertsQuery {
  windowHours?: number
  limit?: number
}

interface AdminOperationalAlertsOptions {
  enabled?: boolean
}

export function useAdminOperationalAlerts(
  query: AdminOperationalAlertsQuery = {},
  options?: AdminOperationalAlertsOptions,
) {
  return useQuery({
    queryKey: ['admin', 'alerts', 'internal', query],
    queryFn: () => adminOperationalAlertsService.getInternalAlerts(query),
    staleTime: 30_000,
    refetchInterval: 60_000,
    enabled: options?.enabled ?? true,
  })
}
