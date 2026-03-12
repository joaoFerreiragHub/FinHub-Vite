import { useMutation, useQuery } from '@tanstack/react-query'
import { adminCreatorPositiveAnalyticsService } from '../services/adminCreatorPositiveAnalyticsService'
import type {
  AdminCreatorPositiveAnalyticsExportQuery,
  AdminCreatorPositiveAnalyticsQuery,
} from '../types/adminCreatorPositiveAnalytics'

interface AdminCreatorPositiveAnalyticsOptions {
  enabled?: boolean
}

const ADMIN_CREATOR_POSITIVE_ANALYTICS_QUERY_KEY = [
  'admin',
  'creators',
  'analytics',
  'positive',
] as const

export function useAdminCreatorPositiveAnalytics(
  query: AdminCreatorPositiveAnalyticsQuery,
  options?: AdminCreatorPositiveAnalyticsOptions,
) {
  return useQuery({
    queryKey: [...ADMIN_CREATOR_POSITIVE_ANALYTICS_QUERY_KEY, query],
    queryFn: () => adminCreatorPositiveAnalyticsService.list(query),
    staleTime: 30_000,
    enabled: options?.enabled ?? true,
  })
}

export function useExportAdminCreatorPositiveAnalyticsCsv() {
  return useMutation({
    mutationFn: (query: AdminCreatorPositiveAnalyticsExportQuery) =>
      adminCreatorPositiveAnalyticsService.exportCsv(query),
  })
}
