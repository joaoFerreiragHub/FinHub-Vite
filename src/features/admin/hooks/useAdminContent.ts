import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminContentService } from '../services/adminContentService'
import type {
  AdminContentModerationActionPayload,
  AdminContentQueueQuery,
  AdminContentType,
} from '../types/adminContent'

interface AdminContentMutationInput {
  contentType: AdminContentType
  contentId: string
  payload: AdminContentModerationActionPayload
}

export function useAdminContentQueue(query: AdminContentQueueQuery) {
  return useQuery({
    queryKey: ['admin', 'content', 'queue', query],
    queryFn: () => adminContentService.listQueue(query),
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
