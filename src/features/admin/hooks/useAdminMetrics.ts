import { useQuery } from '@tanstack/react-query'
import { adminMetricsService } from '../services/adminMetricsService'

interface AdminMetricsOverviewOptions {
  enabled?: boolean
}

export function useAdminMetricsOverview(options?: AdminMetricsOverviewOptions) {
  return useQuery({
    queryKey: ['admin', 'metrics', 'overview'],
    queryFn: () => adminMetricsService.getOverview(),
    staleTime: 60_000,
    refetchInterval: 120_000,
    enabled: options?.enabled ?? true,
  })
}
