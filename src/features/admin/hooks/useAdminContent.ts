import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminContentService } from '../services/adminContentService'
import type {
  AdminBulkModerationJobPayload,
  AdminContentModerationActionPayload,
  AdminContentQueueQuery,
  AdminContentRollbackPayload,
  AdminContentJob,
  AdminContentType,
} from '../types/adminContent'

interface AdminContentMutationInput {
  contentType: AdminContentType
  contentId: string
  payload: AdminContentModerationActionPayload
}

interface AdminContentRollbackMutationInput {
  contentType: AdminContentType
  contentId: string
  payload: AdminContentRollbackPayload
}

interface AdminContentQueueOptions {
  enabled?: boolean
}

interface AdminContentJobsQuery {
  page?: number
  limit?: number
  type?: AdminContentJob['type']
  status?: AdminContentJob['status']
}

export function useAdminContentQueue(
  query: AdminContentQueueQuery,
  options?: AdminContentQueueOptions,
) {
  return useQuery({
    queryKey: ['admin', 'content', 'queue', query],
    queryFn: () => adminContentService.listQueue(query),
    enabled: options?.enabled ?? true,
  })
}

export function useAdminContentJobs(
  query: AdminContentJobsQuery,
  options?: AdminContentQueueOptions,
) {
  return useQuery({
    queryKey: ['admin', 'content', 'jobs', query],
    queryFn: () => adminContentService.listJobs(query),
    enabled: options?.enabled ?? true,
    refetchInterval: 10_000,
  })
}

export function useAdminContentHistory(
  contentType: AdminContentType | null,
  contentId: string | null,
  page = 1,
  limit = 10,
) {
  return useQuery({
    queryKey: ['admin', 'content', 'history', contentType, contentId, page, limit],
    queryFn: () =>
      adminContentService.getContentModerationHistory(
        contentType || 'article',
        contentId || '',
        page,
        limit,
      ),
    enabled: Boolean(contentType && contentId),
  })
}

export function useAdminContentRollbackReview(
  contentType: AdminContentType | null,
  contentId: string | null,
  eventId: string | null,
  enabled = true,
) {
  return useQuery({
    queryKey: ['admin', 'content', 'rollback-review', contentType, contentId, eventId],
    queryFn: () =>
      adminContentService.getContentRollbackReview(
        contentType || 'article',
        contentId || '',
        eventId || '',
      ),
    enabled: enabled && Boolean(contentType && contentId && eventId),
  })
}

export function useHideAdminContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ contentType, contentId, payload }: AdminContentMutationInput) =>
      adminContentService.hideContent(contentType, contentId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'queue'] })
      queryClient.invalidateQueries({
        queryKey: ['admin', 'content', 'history', variables.contentType, variables.contentId],
      })
    },
  })
}

export function useUnhideAdminContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ contentType, contentId, payload }: AdminContentMutationInput) =>
      adminContentService.unhideContent(contentType, contentId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'queue'] })
      queryClient.invalidateQueries({
        queryKey: ['admin', 'content', 'history', variables.contentType, variables.contentId],
      })
    },
  })
}

export function useRestrictAdminContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ contentType, contentId, payload }: AdminContentMutationInput) =>
      adminContentService.restrictContent(contentType, contentId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'queue'] })
      queryClient.invalidateQueries({
        queryKey: ['admin', 'content', 'history', variables.contentType, variables.contentId],
      })
    },
  })
}

export function useRollbackAdminContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ contentType, contentId, payload }: AdminContentRollbackMutationInput) =>
      adminContentService.rollbackContent(contentType, contentId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'queue'] })
      queryClient.invalidateQueries({
        queryKey: ['admin', 'content', 'history', variables.contentType, variables.contentId],
      })
      queryClient.invalidateQueries({
        queryKey: [
          'admin',
          'content',
          'rollback-review',
          variables.contentType,
          variables.contentId,
        ],
      })
    },
  })
}

export function useCreateBulkModerationJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminBulkModerationJobPayload) =>
      adminContentService.createBulkModerationJob(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'jobs'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'metrics', 'overview'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'metrics', 'drilldown'] })
    },
  })
}
