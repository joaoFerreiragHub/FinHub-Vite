import type {
  AdminContentModerationStatus,
  AdminContentPublishStatus,
  AdminContentReportPriority,
  AdminContentType,
} from '../types/adminContent'

export type AdminContentDeepLinkPanel = 'queue' | 'jobs'
export type AdminContentDeepLinkView = 'trust' | 'controls'
export type AdminContentFlaggedOnly = 'all' | 'flagged'

export interface AdminContentDeepLinkFilters {
  search: string
  contentType: AdminContentType | 'all'
  moderationStatus: AdminContentModerationStatus | 'all'
  publishStatus: AdminContentPublishStatus | 'all'
  creatorId: string
  flaggedOnly: AdminContentFlaggedOnly
  minReportPriority: Exclude<AdminContentReportPriority, 'none'> | 'all'
}

export interface AdminContentDeepLinkState {
  filters: AdminContentDeepLinkFilters
  page: number
  panel: AdminContentDeepLinkPanel
  jobId: string | null
}

interface BuildAdminContentHrefOptions {
  panel?: AdminContentDeepLinkPanel | null
  jobId?: string | null
  search?: string | null
  contentType?: AdminContentType | null
  moderationStatus?: AdminContentModerationStatus | null
  publishStatus?: AdminContentPublishStatus | null
  creatorId?: string | null
  flaggedOnly?: boolean
  minReportPriority?: Exclude<AdminContentReportPriority, 'none'> | null
  page?: number | null
}

interface BuildAdminCreatorRiskHrefOptions {
  creatorId: string
  view?: AdminContentDeepLinkView
  source?: string | null
  contentType?: string | null
  contentId?: string | null
}

const CONTENT_TYPES: AdminContentType[] = [
  'article',
  'video',
  'course',
  'live',
  'podcast',
  'book',
  'comment',
  'review',
]

const MODERATION_STATUSES: AdminContentModerationStatus[] = ['visible', 'hidden', 'restricted']
const PUBLISH_STATUSES: AdminContentPublishStatus[] = ['draft', 'published', 'archived']
const REPORT_PRIORITIES: Array<Exclude<AdminContentReportPriority, 'none'>> = [
  'low',
  'medium',
  'high',
  'critical',
]
const PANELS: AdminContentDeepLinkPanel[] = ['queue', 'jobs']
const VIEWS: AdminContentDeepLinkView[] = ['trust', 'controls']

const isOneOf = <T extends string>(value: string | null, allowed: T[]): value is T =>
  typeof value === 'string' && allowed.includes(value as T)

export const DEFAULT_ADMIN_CONTENT_DEEP_LINK_FILTERS: AdminContentDeepLinkFilters = {
  search: '',
  contentType: 'all',
  moderationStatus: 'all',
  publishStatus: 'all',
  creatorId: '',
  flaggedOnly: 'all',
  minReportPriority: 'all',
}

export const readAdminContentDeepLinkState = (search: string): AdminContentDeepLinkState => {
  const params = new URLSearchParams(search)
  const pageValue = Number(params.get('page'))

  return {
    filters: {
      search: params.get('search')?.trim() ?? '',
      contentType: isOneOf(params.get('contentType'), CONTENT_TYPES)
        ? params.get('contentType')
        : 'all',
      moderationStatus: isOneOf(params.get('moderationStatus'), MODERATION_STATUSES)
        ? params.get('moderationStatus')
        : 'all',
      publishStatus: isOneOf(params.get('publishStatus'), PUBLISH_STATUSES)
        ? params.get('publishStatus')
        : 'all',
      creatorId: params.get('creatorId')?.trim() ?? '',
      flaggedOnly:
        params.get('flaggedOnly') === 'flagged' || params.get('flaggedOnly') === 'true'
          ? 'flagged'
          : 'all',
      minReportPriority: isOneOf(params.get('minReportPriority'), REPORT_PRIORITIES)
        ? params.get('minReportPriority')
        : 'all',
    },
    page: Number.isFinite(pageValue) && pageValue > 0 ? Math.floor(pageValue) : 1,
    panel: isOneOf(params.get('panel'), PANELS) ? params.get('panel') : 'queue',
    jobId: params.get('jobId')?.trim() ?? null,
  }
}

export const buildAdminContentHref = ({
  panel,
  jobId,
  search,
  contentType,
  moderationStatus,
  publishStatus,
  creatorId,
  flaggedOnly,
  minReportPriority,
  page,
}: BuildAdminContentHrefOptions = {}): string => {
  const params = new URLSearchParams()

  if (panel && PANELS.includes(panel)) params.set('panel', panel)
  if (jobId?.trim()) params.set('jobId', jobId.trim())
  if (search?.trim()) params.set('search', search.trim())
  if (contentType && CONTENT_TYPES.includes(contentType)) params.set('contentType', contentType)
  if (moderationStatus && MODERATION_STATUSES.includes(moderationStatus)) {
    params.set('moderationStatus', moderationStatus)
  }
  if (publishStatus && PUBLISH_STATUSES.includes(publishStatus)) {
    params.set('publishStatus', publishStatus)
  }
  if (creatorId?.trim()) params.set('creatorId', creatorId.trim())
  if (flaggedOnly) params.set('flaggedOnly', 'flagged')
  if (minReportPriority && REPORT_PRIORITIES.includes(minReportPriority)) {
    params.set('minReportPriority', minReportPriority)
  }
  if (typeof page === 'number' && Number.isFinite(page) && page > 1) {
    params.set('page', String(Math.floor(page)))
  }

  const query = params.toString()
  return query ? `/admin/conteudo?${query}` : '/admin/conteudo'
}

export const buildAdminCreatorRiskHref = ({
  creatorId,
  view = 'trust',
  source,
  contentType,
  contentId,
}: BuildAdminCreatorRiskHrefOptions): string => {
  const params = new URLSearchParams()
  params.set('creatorId', creatorId)
  if (VIEWS.includes(view)) params.set('view', view)
  if (source?.trim()) params.set('source', source.trim())
  if (contentType?.trim()) params.set('contentType', contentType.trim())
  if (contentId?.trim()) params.set('contentId', contentId.trim())
  return `/admin/creators?${params.toString()}`
}
