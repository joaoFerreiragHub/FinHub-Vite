import { apiClient } from '@/lib/api/client'
import type { AdminActorSummary } from '../types/adminUsers'
import type {
  AdminContentAccessPolicyItem,
  AdminContentAccessPolicyListQuery,
  AdminContentAccessPolicyListResponse,
  AdminContentAccessPolicyMutationResponse,
  AdminContentAccessPolicyPagination,
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

const toString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

const toNullableString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim().length > 0 ? value : null

const toOptionalString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim().length > 0 ? value : undefined

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
        ? row.match!.contentTypes.filter(
            (value): value is AdminContentAccessPolicyItem['match']['contentTypes'][number] =>
              value === 'article' ||
              value === 'video' ||
              value === 'course' ||
              value === 'live' ||
              value === 'podcast' ||
              value === 'book',
          )
        : [],
      categories: Array.isArray(row.match?.categories)
        ? row.match!.categories.filter((value): value is string => typeof value === 'string')
        : [],
      tags: Array.isArray(row.match?.tags)
        ? row.match!.tags.filter((value): value is string => typeof value === 'string')
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

