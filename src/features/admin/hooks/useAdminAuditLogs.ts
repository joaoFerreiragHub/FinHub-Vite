import { useMutation, useQuery } from '@tanstack/react-query'
import { adminAuditLogsService } from '../services/adminAuditLogsService'
import type { AdminAuditLogsQuery } from '../types/adminAuditLogs'

interface AdminAuditLogsOptions {
  enabled?: boolean
}

export function useAdminAuditLogs(query: AdminAuditLogsQuery, options?: AdminAuditLogsOptions) {
  return useQuery({
    queryKey: ['admin', 'audit-logs', query],
    queryFn: () => adminAuditLogsService.list(query),
    enabled: options?.enabled ?? true,
    staleTime: 30_000,
    refetchInterval: false,
  })
}

export function useExportAdminAuditLogsCsv() {
  return useMutation({
    mutationFn: (query: AdminAuditLogsQuery & { maxRows?: number }) =>
      adminAuditLogsService.exportCsv(query),
  })
}
