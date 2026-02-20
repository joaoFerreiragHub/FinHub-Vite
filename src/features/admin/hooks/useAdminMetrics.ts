import { useQuery } from '@tanstack/react-query'
import { adminMetricsService } from '../services/adminMetricsService'

export function useAdminMetricsOverview() {
  return useQuery({
    queryKey: ['admin', 'metrics', 'overview'],
    queryFn: () => adminMetricsService.getOverview(),
    staleTime: 60_000,
    refetchInterval: 120_000,
  })
}
