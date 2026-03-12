import { apiClient } from '@/lib/api/client'
import type { AdminActorSummary } from '../types/adminUsers'
import type {
  AdminContentAccessPolicyCategory,
  AdminContentAccessPolicyContentType,
  AdminContentAccessPolicyItem,
  AdminContentAccessPolicyListQuery,
  AdminContentAccessPolicyListResponse,
  AdminContentAccessPolicyMutationResponse,
  AdminContentAccessPolicyPagination,
  AdminContentAccessPolicyPayload,
  AdminContentAccessPolicyPreviewCounts,
  AdminContentAccessPolicyPreviewResponse,
} from '../types/adminContentAccessPolicy'

interface BackendActorSummary {
  id?: string
  _id?: string
  name?: string
  username?: string
  email?: string
  role?: string
}

interface BackendPolicyListResponse {
  items?: BackendPolicyItem[]
  pagination?: Partial<AdminContentAccessPolicyPagination>
}

interface BackendPolicyMutationResponse {
  message?: string
  item?: BackendPolicyItem
}

interface BackendPolicyPreviewResponse {
  input?: {
    match?: BackendPolicyItem['match']
    access?: BackendPolicyItem['access']
  }
  impact?: {
    totalMatches?: unknown
    currentlyPremium?: unknown
    currentlyFree?: unknown
    byContentType?: Record<string, Partial<AdminContentAccessPolicyPreviewCounts>>
  }
  sample?: BackendPolicyPreviewSample[]
  generatedAt?: unknown
}

interface BackendPolicyPreviewSample {
  id?: unknown
  contentType?: unknown
  title?: unknown
  isPremium?: unknown
  category?: unknown
  publishedAt?: unknown
}

interface BackendPolicyItem {
  id?: string | null
  _id?: string
  code?: string
  label?: string
  description?: string | null
  active?: boolean
  priority?: number
  effectiveFrom?: string | null
  effectiveTo?: string | null
  match?: {
    contentTypes?: string[]
    categories?: string[]
    tags?: string[]
    featuredOnly?: boolean
  }
  access?: {
    requiredRole?: 'free' | 'premium'
    teaserAllowed?: boolean
    blockedMessage?: string | null
  }
  version?: number
  createdBy?: BackendActorSummary | null
  updatedBy?: BackendActorSummary | null
  historyCount?: number
  createdAt?: string | null
  updatedAt?: string | null
}

const POLICY_CONTENT_TYPES: readonly AdminContentAccessPolicyContentType[] = [
  'article',
  'video',
  'course',
  'live',
  'podcast',
  'book',
]

const POLICY_CATEGORIES: readonly AdminContentAccessPolicyCategory[] = [
  'finance',
  'investing',
  'trading',
  'crypto',
  'economics',
  'personal-finance',
  'business',
  'technology',
  'education',
  'news',
  'analysis',
  'other',
]

const POLICY_CONTENT_TYPE_SET = new Set<string>(POLICY_CONTENT_TYPES)
const POLICY_CATEGORY_SET = new Set<string>(POLICY_CATEGORIES)

const toString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

const toNullableString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : null

const toOptionalString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined

const toPositiveInt = (value: unknown, fallback: number): number => {
  const parsed =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number.parseInt(value, 10)
        : Number.NaN
  if (!Number.isFinite(parsed) || parsed < 1) return fallback
  return Math.trunc(parsed)
}

const toIsoDateOrNull = (value: unknown): string | null => {
  if (typeof value !== 'string' || value.trim().length === 0) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
}

const isPolicyContentType = (value: unknown): value is AdminContentAccessPolicyContentType =>
  typeof value === 'string' && POLICY_CONTENT_TYPE_SET.has(value)

const isPolicyCategory = (value: unknown): value is AdminContentAccessPolicyCategory =>
  typeof value === 'string' && POLICY_CATEGORY_SET.has(value)

const mapActor = (actor?: BackendActorSummary | null): AdminActorSummary | null => {
  if (!actor || typeof actor !== 'object') return null
  const id = toOptionalString(actor.id) ?? toOptionalString(actor._id)
  if (!id) return null
  return {
    id,
    name: toOptionalString(actor.name),
    username: toOptionalString(actor.username),
    email: toOptionalString(actor.email),
    role:
      actor.role === 'visitor' ||
      actor.role === 'free' ||
      actor.role === 'premium' ||
      actor.role === 'creator' ||
      actor.role === 'admin'
        ? actor.role
        : undefined,
  }
}

const mapPolicyItem = (row: BackendPolicyItem): AdminContentAccessPolicyItem | null => {
  const id = toOptionalString(row.id) ?? toOptionalString(row._id)
  if (!id) return null

  return {
    id,
    code: toString(row.code),
    label: toString(row.label),
    description: toNullableString(row.description),
    active: row.active === true,
    priority: toPositiveInt(row.priority, 100),
    effectiveFrom: toIsoDateOrNull(row.effectiveFrom),
    effectiveTo: toIsoDateOrNull(row.effectiveTo),
    match: {
      contentTypes: Array.isArray(row.match?.contentTypes)
        ? row.match.contentTypes.filter(isPolicyContentType)
        : [],
      categories: Array.isArray(row.match?.categories)
        ? row.match.categories.filter(isPolicyCategory)
        : [],
      tags: Array.isArray(row.match?.tags)
        ? row.match.tags.filter((value): value is string => typeof value === 'string')
        : [],
      featuredOnly: row.match?.featuredOnly === true,
    },
    access: {
      requiredRole: row.access?.requiredRole === 'free' ? 'free' : 'premium',
      teaserAllowed: row.access?.teaserAllowed !== false,
      blockedMessage: toNullableString(row.access?.blockedMessage),
    },
    version: toPositiveInt(row.version, 1),
    createdBy: mapActor(row.createdBy),
    updatedBy: mapActor(row.updatedBy),
    historyCount: toPositiveInt(row.historyCount, 0),
    createdAt: toIsoDateOrNull(row.createdAt),
    updatedAt: toIsoDateOrNull(row.updatedAt),
  }
}

const mapPagination = (
  pagination?: Partial<AdminContentAccessPolicyPagination>,
): AdminContentAccessPolicyPagination => ({
  page: toPositiveInt(pagination?.page, 1),
  limit: toPositiveInt(pagination?.limit, 25),
  total: toPositiveInt(pagination?.total, 0),
  pages: toPositiveInt(pagination?.pages, 1),
})

const toListQueryParams = (query: AdminContentAccessPolicyListQuery) => {
  const params: Record<string, string | number | boolean> = {}
  if (typeof query.active === 'boolean') params.active = query.active
  if (query.requiredRole) params.requiredRole = query.requiredRole
  if (query.contentType) params.contentType = query.contentType
  if (query.search?.trim()) params.search = query.search.trim()
  if (typeof query.page === 'number' && query.page > 0) params.page = query.page
  if (typeof query.limit === 'number' && query.limit > 0) params.limit = query.limit
  return params
}

const toBackendPayload = (payload: AdminContentAccessPolicyPayload): Record<string, unknown> => {
  const body: Record<string, unknown> = {}

  if (payload.code !== undefined) body.code = payload.code.trim()
  if (payload.label !== undefined) body.label = payload.label.trim()
  if (payload.description !== undefined) body.description = payload.description?.trim() || null
  if (payload.active !== undefined) body.active = payload.active
  if (payload.priority !== undefined) body.priority = payload.priority
  if (payload.effectiveFrom !== undefined) body.effectiveFrom = payload.effectiveFrom || null
  if (payload.effectiveTo !== undefined) body.effectiveTo = payload.effectiveTo || null
  if (payload.changeReason !== undefined) body.changeReason = payload.changeReason.trim()

  if (payload.match !== undefined) {
    const match: Record<string, unknown> = {}
    if (payload.match.contentTypes !== undefined) match.contentTypes = payload.match.contentTypes
    if (payload.match.categories !== undefined) match.categories = payload.match.categories
    if (payload.match.tags !== undefined) match.tags = payload.match.tags
    if (payload.match.featuredOnly !== undefined) match.featuredOnly = payload.match.featuredOnly
    body.match = match
  }

  if (payload.access !== undefined) {
    const access: Record<string, unknown> = {}
    if (payload.access.requiredRole !== undefined) access.requiredRole = payload.access.requiredRole
    if (payload.access.teaserAllowed !== undefined) access.teaserAllowed = payload.access.teaserAllowed
    if (payload.access.blockedMessage !== undefined) {
      access.blockedMessage = payload.access.blockedMessage?.trim() || null
    }
    body.access = access
  }

  return body
}

const buildEmptyPreviewCounts = (): Record<
  AdminContentAccessPolicyContentType,
  AdminContentAccessPolicyPreviewCounts
> => ({
  article: { total: 0, currentlyPremium: 0, currentlyFree: 0 },
  video: { total: 0, currentlyPremium: 0, currentlyFree: 0 },
  course: { total: 0, currentlyPremium: 0, currentlyFree: 0 },
  live: { total: 0, currentlyPremium: 0, currentlyFree: 0 },
  podcast: { total: 0, currentlyPremium: 0, currentlyFree: 0 },
  book: { total: 0, currentlyPremium: 0, currentlyFree: 0 },
})

const mapPreview = (value: BackendPolicyPreviewResponse): AdminContentAccessPolicyPreviewResponse => {
  const byContentType = buildEmptyPreviewCounts()
  for (const [contentType, stats] of Object.entries(value.impact?.byContentType ?? {})) {
    if (!isPolicyContentType(contentType) || !stats) continue
    byContentType[contentType] = {
      total: toPositiveInt(stats.total, 0),
      currentlyPremium: toPositiveInt(stats.currentlyPremium, 0),
      currentlyFree: toPositiveInt(stats.currentlyFree, 0),
    }
  }

  const sample = Array.isArray(value.sample)
    ? value.sample
        .map((row) => {
          const id = toOptionalString(row.id)
          if (!id || !isPolicyContentType(row.contentType)) return null

          return {
            id,
            contentType: row.contentType,
            title: toString(row.title),
            isPremium: row.isPremium === true,
            category: isPolicyCategory(row.category) ? row.category : undefined,
            publishedAt: toIsoDateOrNull(row.publishedAt),
          }
        })
        .filter(
          (
            row,
          ): row is {
            id: string
            contentType: AdminContentAccessPolicyContentType
            title: string
            isPremium: boolean
            category?: AdminContentAccessPolicyCategory
            publishedAt: string | null
          } => row !== null,
        )
    : []

  return {
    input: {
      match: {
        contentTypes: Array.isArray(value.input?.match?.contentTypes)
          ? value.input!.match!.contentTypes!.filter(isPolicyContentType)
          : [],
        categories: Array.isArray(value.input?.match?.categories)
          ? value.input!.match!.categories!.filter(isPolicyCategory)
          : [],
        tags: Array.isArray(value.input?.match?.tags)
          ? value.input!.match!.tags!.filter((tag): tag is string => typeof tag === 'string')
          : [],
        featuredOnly: value.input?.match?.featuredOnly === true,
      },
      access: {
        requiredRole: value.input?.access?.requiredRole === 'free' ? 'free' : 'premium',
        teaserAllowed: value.input?.access?.teaserAllowed !== false,
        blockedMessage: toNullableString(value.input?.access?.blockedMessage),
      },
    },
    impact: {
      totalMatches: toPositiveInt(value.impact?.totalMatches, 0),
      currentlyPremium: toPositiveInt(value.impact?.currentlyPremium, 0),
      currentlyFree: toPositiveInt(value.impact?.currentlyFree, 0),
      byContentType,
    },
    sample,
    generatedAt: toIsoDateOrNull(value.generatedAt),
  }
}

export const adminContentAccessPolicyService = {
  list: async (query: AdminContentAccessPolicyListQuery): Promise<AdminContentAccessPolicyListResponse> => {
    const response = await apiClient.get<BackendPolicyListResponse>('/admin/content/access-policies', {
      params: toListQueryParams(query),
    })

    return {
      items: (response.data.items ?? [])
        .map(mapPolicyItem)
        .filter((item): item is AdminContentAccessPolicyItem => item !== null),
      pagination: mapPagination(response.data.pagination),
    }
  },

  getById: async (policyId: string): Promise<AdminContentAccessPolicyItem> => {
    const response = await apiClient.get<BackendPolicyItem>(
      `/admin/content/access-policies/${encodeURIComponent(policyId)}`,
    )
    const item = mapPolicyItem(response.data)
    if (!item) throw new Error('Resposta admin invalida: policy em falta.')
    return item
  },

  preview: async (payload: AdminContentAccessPolicyPayload): Promise<AdminContentAccessPolicyPreviewResponse> => {
    const response = await apiClient.post<BackendPolicyPreviewResponse>(
      '/admin/content/access-policies/preview',
      toBackendPayload(payload),
    )
    return mapPreview(response.data)
  },

  create: async (payload: AdminContentAccessPolicyPayload): Promise<AdminContentAccessPolicyMutationResponse> => {
    const response = await apiClient.post<BackendPolicyMutationResponse>(
      '/admin/content/access-policies',
      toBackendPayload(payload),
    )
    const item = mapPolicyItem(response.data.item ?? {})
    if (!item) throw new Error('Resposta admin invalida: policy em falta.')
    return {
      message: toString(response.data.message, 'Policy de acesso criada.'),
      item,
    }
  },

  update: async (
    policyId: string,
    payload: AdminContentAccessPolicyPayload,
  ): Promise<AdminContentAccessPolicyMutationResponse> => {
    const response = await apiClient.patch<BackendPolicyMutationResponse>(
      `/admin/content/access-policies/${encodeURIComponent(policyId)}`,
      toBackendPayload(payload),
    )
    const item = mapPolicyItem(response.data.item ?? {})
    if (!item) throw new Error('Resposta admin invalida: policy em falta.')
    return {
      message: toString(response.data.message, 'Policy de acesso atualizada.'),
      item,
    }
  },

  activate: async (
    policyId: string,
    payload: { changeReason: string },
  ): Promise<AdminContentAccessPolicyMutationResponse> => {
    const response = await apiClient.post<BackendPolicyMutationResponse>(
      `/admin/content/access-policies/${encodeURIComponent(policyId)}/activate`,
      payload,
    )
    const item = mapPolicyItem(response.data.item ?? {})
    if (!item) throw new Error('Resposta admin invalida: policy em falta.')
    return {
      message: toString(response.data.message, 'Policy de acesso ativada.'),
      item,
    }
  },

  deactivate: async (
    policyId: string,
    payload: { changeReason: string },
  ): Promise<AdminContentAccessPolicyMutationResponse> => {
    const response = await apiClient.post<BackendPolicyMutationResponse>(
      `/admin/content/access-policies/${encodeURIComponent(policyId)}/deactivate`,
      payload,
    )
    const item = mapPolicyItem(response.data.item ?? {})
    if (!item) throw new Error('Resposta admin invalida: policy em falta.')
    return {
      message: toString(response.data.message, 'Policy de acesso desativada.'),
      item,
    }
  },
}
