import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminBulkImportService } from '../services/adminBulkImportService'
import type {
  AdminBulkImportCreatePayload,
  AdminBulkImportJobsQuery,
  AdminBulkImportPreviewPayload,
} from '../types/adminBulkImport'

interface AdminBulkImportQueryOptions {
  enabled?: boolean
}

const ADMIN_BULK_IMPORT_JOBS_QUERY_KEY = ['admin', 'bulk-import', 'jobs'] as const

export function useAdminBulkImportJobs(
  query: AdminBulkImportJobsQuery,
  options?: AdminBulkImportQueryOptions,
) {
  return useQuery({
    queryKey: [...ADMIN_BULK_IMPORT_JOBS_QUERY_KEY, query],
    queryFn: () => adminBulkImportService.listJobs(query),
    enabled: options?.enabled ?? true,
    staleTime: 20_000,
  })
}

export function useAdminBulkImportJob(jobId: string | null, options?: AdminBulkImportQueryOptions) {
  return useQuery({
    queryKey: [...ADMIN_BULK_IMPORT_JOBS_QUERY_KEY, 'detail', jobId],
    queryFn: () => adminBulkImportService.getJob(jobId ?? ''),
    enabled: (options?.enabled ?? true) && Boolean(jobId),
    staleTime: 15_000,
  })
}

export function usePreviewAdminBulkImport() {
  return useMutation({
    mutationFn: (payload: AdminBulkImportPreviewPayload) => adminBulkImportService.preview(payload),
  })
}

export function useCreateAdminBulkImportJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminBulkImportCreatePayload) =>
      adminBulkImportService.createJob(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_BULK_IMPORT_JOBS_QUERY_KEY,
      })
      queryClient.setQueryData(
        [...ADMIN_BULK_IMPORT_JOBS_QUERY_KEY, 'detail', response.item.id],
        response.item,
      )
    },
  })
}
