import { useQuery } from '@tanstack/react-query'
import { adminModerationTemplatesService } from '../services/adminModerationTemplatesService'
import type { AdminModerationTemplatesListQuery } from '../types/adminModerationTemplates'

interface AdminModerationTemplatesQueryOptions {
  enabled?: boolean
}

const ADMIN_MODERATION_TEMPLATES_QUERY_KEY = ['admin', 'content', 'moderation-templates'] as const

export function useAdminModerationTemplates(
  query: AdminModerationTemplatesListQuery,
  options?: AdminModerationTemplatesQueryOptions,
) {
  return useQuery({
    queryKey: [...ADMIN_MODERATION_TEMPLATES_QUERY_KEY, query],
    queryFn: () => adminModerationTemplatesService.list(query),
    enabled: options?.enabled ?? true,
    staleTime: 20_000,
  })
}

export function useAdminModerationTemplateById(
  templateId: string | null,
  options?: AdminModerationTemplatesQueryOptions,
) {
  return useQuery({
    queryKey: [...ADMIN_MODERATION_TEMPLATES_QUERY_KEY, 'detail', templateId],
    queryFn: () => adminModerationTemplatesService.getById(templateId || ''),
    enabled: Boolean(templateId) && (options?.enabled ?? true),
    staleTime: 20_000,
  })
}
