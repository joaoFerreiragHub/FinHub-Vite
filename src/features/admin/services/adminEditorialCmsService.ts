import { apiClient } from '@/lib/api/client'
import type { AdminPagination } from '../types/adminUsers'
import type {
  AdminAddEditorialSectionItemInput,
  AdminEditorialSection,
  AdminEditorialSectionItem,
  AdminEditorialSectionItemStatus,
  AdminEditorialSectionItemTargetType,
  AdminEditorialSectionQuery,
  AdminEditorialSectionStatus,
  AdminEditorialSectionType,
  AdminEditorialSectionsListResponse,
  AdminReorderEditorialSectionItemsPayload,
  AdminReorderEditorialSectionItemsResponse,
  AdminRemoveEditorialSectionItemResponse,
  AdminCreateEditorialSectionInput,
  AdminUpdateEditorialSectionInput,
  EditorialHomePreviewResponse,
  EditorialHomePreviewSection,
} from '../types/adminEditorialCms'

interface BackendEditorialSectionItem {
  id?: string
  _id?: string
  sectionId?: string
  targetType?: string
  targetId?: string
  titleOverride?: string | null
  descriptionOverride?: string | null
  imageOverride?: string | null
  urlOverride?: string | null
  badge?: string | null
  sortOrder?: number
  isPinned?: boolean
  status?: string
  startAt?: string | null
  endAt?: string | null
  metadata?: Record<string, unknown> | null
  createdAt?: string | null
  updatedAt?: string | null
}

interface BackendEditorialSection {
  id?: string
  _id?: string
  key?: string
  title?: string
  subtitle?: string | null
  description?: string | null
  sectionType?: string
  order?: number
  maxItems?: number
  status?: string
  showOnHome?: boolean
  showOnLanding?: boolean
  showOnShowAll?: boolean
  createdBy?: unknown
  updatedBy?: unknown
  createdAt?: string | null
  updatedAt?: string | null
  itemCount?: number
  items?: BackendEditorialSectionItem[]
}

interface BackendEditorialSectionsListResponse {
  items?: BackendEditorialSection[]
  pagination?: Partial<AdminPagination>
}

interface BackendReorderEditorialSectionItemsResponse {
  sectionId?: string
  items?: BackendEditorialSectionItem[]
}

interface BackendRemoveEditorialSectionItemResponse {
  removed?: boolean
  sectionId?: string
  itemId?: string
}

interface BackendEditorialHomePreviewResponse {
  items?: Array<
    Pick<
      BackendEditorialSection,
      | 'id'
      | '_id'
      | 'key'
      | 'title'
      | 'subtitle'
      | 'description'
      | 'sectionType'
      | 'order'
      | 'maxItems'
    > & {
      items?: BackendEditorialSectionItem[]
    }
  >
}

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 25

const resolveId = (value: unknown): string | null => {
  if (typeof value === 'string' && value.length > 0) return value

  if (value && typeof value === 'object') {
    const maybeId = (value as { id?: unknown; _id?: unknown }).id
    if (typeof maybeId === 'string' && maybeId.length > 0) return maybeId

    const maybeObjectId = (value as { _id?: unknown })._id
    if (typeof maybeObjectId === 'string' && maybeObjectId.length > 0) return maybeObjectId
  }

  return null
}

const toSectionStatus = (value: string | undefined): AdminEditorialSectionStatus =>
  value === 'inactive' ? 'inactive' : 'active'

const toSectionType = (value: string | undefined): AdminEditorialSectionType => {
  if (value === 'content') return 'content'
  if (value === 'directory') return 'directory'
  if (value === 'custom') return 'custom'
  return 'mixed'
}

const toSectionItemStatus = (value: string | undefined): AdminEditorialSectionItemStatus =>
  value === 'inactive' ? 'inactive' : 'active'

const toSectionItemTargetType = (
  value: string | undefined,
): AdminEditorialSectionItemTargetType | null => {
  if (value === 'article') return 'article'
  if (value === 'video') return 'video'
  if (value === 'course') return 'course'
  if (value === 'live') return 'live'
  if (value === 'podcast') return 'podcast'
  if (value === 'book') return 'book'
  if (value === 'directory_entry') return 'directory_entry'
  if (value === 'external_link') return 'external_link'
  if (value === 'custom') return 'custom'
  return null
}

const normalizePagination = (pagination?: Partial<AdminPagination>): AdminPagination => ({
  page: pagination?.page && pagination.page > 0 ? pagination.page : DEFAULT_PAGE,
  limit: pagination?.limit && pagination.limit > 0 ? pagination.limit : DEFAULT_LIMIT,
  total: pagination?.total && pagination.total >= 0 ? pagination.total : 0,
  pages: pagination?.pages && pagination.pages > 0 ? pagination.pages : 1,
})

const mapSectionItem = (item: BackendEditorialSectionItem): AdminEditorialSectionItem | null => {
  const id = resolveId(item)
  const sectionId = resolveId(item.sectionId)
  const targetType = toSectionItemTargetType(item.targetType)
  const targetId = resolveId(item.targetId)

  if (!id || !sectionId || !targetType || !targetId) return null

  return {
    id,
    sectionId,
    targetType,
    targetId,
    titleOverride: typeof item.titleOverride === 'string' ? item.titleOverride : null,
    descriptionOverride:
      typeof item.descriptionOverride === 'string' ? item.descriptionOverride : null,
    imageOverride: typeof item.imageOverride === 'string' ? item.imageOverride : null,
    urlOverride: typeof item.urlOverride === 'string' ? item.urlOverride : null,
    badge: typeof item.badge === 'string' ? item.badge : null,
    sortOrder: Number.isFinite(item.sortOrder) ? Number(item.sortOrder) : 0,
    isPinned: Boolean(item.isPinned),
    status: toSectionItemStatus(item.status),
    startAt: typeof item.startAt === 'string' ? item.startAt : null,
    endAt: typeof item.endAt === 'string' ? item.endAt : null,
    metadata: item.metadata ?? null,
    createdAt: typeof item.createdAt === 'string' ? item.createdAt : null,
    updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : null,
  }
}

const mapSection = (section: BackendEditorialSection): AdminEditorialSection | null => {
  const id = resolveId(section)
  if (!id) return null
  if (typeof section.key !== 'string' || section.key.length === 0) return null
  if (typeof section.title !== 'string' || section.title.length === 0) return null

  const items = (section.items ?? [])
    .map(mapSectionItem)
    .filter((item): item is AdminEditorialSectionItem => item !== null)

  return {
    id,
    key: section.key,
    title: section.title,
    subtitle: typeof section.subtitle === 'string' ? section.subtitle : null,
    description: typeof section.description === 'string' ? section.description : null,
    sectionType: toSectionType(section.sectionType),
    order: Number.isFinite(section.order) ? Number(section.order) : 0,
    maxItems: Number.isFinite(section.maxItems) ? Number(section.maxItems) : 12,
    status: toSectionStatus(section.status),
    showOnHome: section.showOnHome !== false,
    showOnLanding: section.showOnLanding !== false,
    showOnShowAll: section.showOnShowAll !== false,
    createdBy: resolveId(section.createdBy),
    updatedBy: resolveId(section.updatedBy),
    createdAt: typeof section.createdAt === 'string' ? section.createdAt : null,
    updatedAt: typeof section.updatedAt === 'string' ? section.updatedAt : null,
    itemCount:
      Number.isFinite(section.itemCount) && Number(section.itemCount) >= 0
        ? Number(section.itemCount)
        : items.length,
    items,
  }
}

const mapHomeSection = (
  section: BackendEditorialHomePreviewResponse['items'][number],
): EditorialHomePreviewSection | null => {
  const id = resolveId(section)
  if (!id) return null
  if (typeof section.key !== 'string' || section.key.length === 0) return null
  if (typeof section.title !== 'string' || section.title.length === 0) return null

  const items = (section.items ?? [])
    .map(mapSectionItem)
    .filter((item): item is AdminEditorialSectionItem => item !== null)

  return {
    id,
    key: section.key,
    title: section.title,
    subtitle: typeof section.subtitle === 'string' ? section.subtitle : null,
    description: typeof section.description === 'string' ? section.description : null,
    sectionType: toSectionType(section.sectionType),
    order: Number.isFinite(section.order) ? Number(section.order) : 0,
    maxItems: Number.isFinite(section.maxItems) ? Number(section.maxItems) : 12,
    items,
  }
}

const buildQueryParams = (query: AdminEditorialSectionQuery): Record<string, string | number> => {
  const params: Record<string, string | number> = {}
  if (query.status) params.status = query.status
  if (query.search && query.search.trim().length > 0) params.search = query.search.trim()
  if (typeof query.page === 'number' && query.page > 0) params.page = query.page
  if (typeof query.limit === 'number' && query.limit > 0) params.limit = query.limit
  return params
}

const cleanOptionalText = (value: string | undefined): string | undefined => {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

const cleanOptionalNullableText = (value: string | null | undefined): string | null | undefined => {
  if (value === null) return null
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

const buildCreateSectionPayload = (
  input: AdminCreateEditorialSectionInput,
): Record<string, unknown> => {
  const payload: Record<string, unknown> = {
    title: input.title.trim(),
  }

  const key = cleanOptionalText(input.key)
  if (key) payload.key = key

  const subtitle = cleanOptionalText(input.subtitle)
  if (subtitle) payload.subtitle = subtitle

  const description = cleanOptionalText(input.description)
  if (description) payload.description = description

  if (input.sectionType) payload.sectionType = input.sectionType
  if (typeof input.order === 'number' && Number.isFinite(input.order)) payload.order = input.order
  if (typeof input.maxItems === 'number' && Number.isFinite(input.maxItems))
    payload.maxItems = input.maxItems
  if (input.status) payload.status = input.status
  if (typeof input.showOnHome === 'boolean') payload.showOnHome = input.showOnHome
  if (typeof input.showOnLanding === 'boolean') payload.showOnLanding = input.showOnLanding
  if (typeof input.showOnShowAll === 'boolean') payload.showOnShowAll = input.showOnShowAll

  return payload
}

const buildUpdateSectionPayload = (
  input: AdminUpdateEditorialSectionInput,
): Record<string, unknown> => {
  const payload: Record<string, unknown> = {}

  if (typeof input.key !== 'undefined') payload.key = cleanOptionalText(input.key) ?? ''
  if (typeof input.title !== 'undefined') payload.title = input.title.trim()

  const subtitle = cleanOptionalNullableText(input.subtitle)
  if (typeof subtitle !== 'undefined') payload.subtitle = subtitle

  const description = cleanOptionalNullableText(input.description)
  if (typeof description !== 'undefined') payload.description = description

  if (input.sectionType) payload.sectionType = input.sectionType
  if (typeof input.order === 'number' && Number.isFinite(input.order)) payload.order = input.order
  if (typeof input.maxItems === 'number' && Number.isFinite(input.maxItems))
    payload.maxItems = input.maxItems
  if (input.status) payload.status = input.status
  if (typeof input.showOnHome === 'boolean') payload.showOnHome = input.showOnHome
  if (typeof input.showOnLanding === 'boolean') payload.showOnLanding = input.showOnLanding
  if (typeof input.showOnShowAll === 'boolean') payload.showOnShowAll = input.showOnShowAll

  return payload
}

const buildAddItemPayload = (input: AdminAddEditorialSectionItemInput): Record<string, unknown> => {
  const payload: Record<string, unknown> = {
    targetType: input.targetType,
    targetId: input.targetId.trim(),
  }

  const titleOverride = cleanOptionalText(input.titleOverride)
  if (titleOverride) payload.titleOverride = titleOverride

  const descriptionOverride = cleanOptionalText(input.descriptionOverride)
  if (descriptionOverride) payload.descriptionOverride = descriptionOverride

  const imageOverride = cleanOptionalText(input.imageOverride)
  if (imageOverride) payload.imageOverride = imageOverride

  const urlOverride = cleanOptionalText(input.urlOverride)
  if (urlOverride) payload.urlOverride = urlOverride

  const badge = cleanOptionalText(input.badge)
  if (badge) payload.badge = badge

  if (typeof input.sortOrder === 'number' && Number.isFinite(input.sortOrder))
    payload.sortOrder = input.sortOrder
  if (typeof input.isPinned === 'boolean') payload.isPinned = input.isPinned
  if (input.status) payload.status = input.status
  if (typeof input.startAt !== 'undefined') payload.startAt = input.startAt
  if (typeof input.endAt !== 'undefined') payload.endAt = input.endAt
  if (typeof input.metadata !== 'undefined') payload.metadata = input.metadata

  return payload
}

export const adminEditorialCmsService = {
  listSections: async (
    query: AdminEditorialSectionQuery = {},
  ): Promise<AdminEditorialSectionsListResponse> => {
    const response = await apiClient.get<BackendEditorialSectionsListResponse>(
      '/admin/editorial/sections',
      {
        params: buildQueryParams(query),
      },
    )

    const items = (response.data.items ?? [])
      .map(mapSection)
      .filter((item): item is AdminEditorialSection => item !== null)

    return {
      items,
      pagination: normalizePagination(response.data.pagination),
    }
  },

  createSection: async (
    input: AdminCreateEditorialSectionInput,
  ): Promise<AdminEditorialSection> => {
    const response = await apiClient.post<BackendEditorialSection>(
      '/admin/editorial/sections',
      buildCreateSectionPayload(input),
    )

    const section = mapSection(response.data)
    if (!section) {
      throw new Error('Resposta admin invalida: secao editorial em falta.')
    }

    return section
  },

  updateSection: async (
    sectionId: string,
    input: AdminUpdateEditorialSectionInput,
  ): Promise<AdminEditorialSection> => {
    const response = await apiClient.patch<BackendEditorialSection>(
      `/admin/editorial/sections/${sectionId}`,
      buildUpdateSectionPayload(input),
    )

    const section = mapSection(response.data)
    if (!section) {
      throw new Error('Resposta admin invalida: secao editorial em falta.')
    }

    return section
  },

  addSectionItem: async (
    sectionId: string,
    input: AdminAddEditorialSectionItemInput,
  ): Promise<AdminEditorialSectionItem> => {
    const response = await apiClient.post<BackendEditorialSectionItem>(
      `/admin/editorial/sections/${sectionId}/items`,
      buildAddItemPayload(input),
    )

    const item = mapSectionItem(response.data)
    if (!item) {
      throw new Error('Resposta admin invalida: item editorial em falta.')
    }

    return item
  },

  reorderSectionItems: async (
    sectionId: string,
    payload: AdminReorderEditorialSectionItemsPayload,
  ): Promise<AdminReorderEditorialSectionItemsResponse> => {
    const response = await apiClient.patch<BackendReorderEditorialSectionItemsResponse>(
      `/admin/editorial/sections/${sectionId}/items/reorder`,
      payload,
    )

    const mappedItems = (response.data.items ?? [])
      .map(mapSectionItem)
      .filter((item): item is AdminEditorialSectionItem => item !== null)

    return {
      sectionId: resolveId(response.data.sectionId) ?? sectionId,
      items: mappedItems,
    }
  },

  removeSectionItem: async (
    sectionId: string,
    itemId: string,
  ): Promise<AdminRemoveEditorialSectionItemResponse> => {
    const response = await apiClient.delete<BackendRemoveEditorialSectionItemResponse>(
      `/admin/editorial/sections/${sectionId}/items/${itemId}`,
    )

    return {
      removed: response.data.removed === true,
      sectionId: resolveId(response.data.sectionId) ?? sectionId,
      itemId: resolveId(response.data.itemId) ?? itemId,
    }
  },

  getHomePreview: async (): Promise<EditorialHomePreviewResponse> => {
    const response = await apiClient.get<BackendEditorialHomePreviewResponse>('/editorial/home')

    const items = (response.data.items ?? [])
      .map(mapHomeSection)
      .filter((section): section is EditorialHomePreviewSection => section !== null)

    return { items }
  },
}
