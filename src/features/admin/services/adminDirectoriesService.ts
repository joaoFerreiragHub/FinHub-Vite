import { apiClient } from '@/lib/api/client'
import type {
  AdminDirectoryCreateInput,
  AdminDirectoryEntry,
  AdminDirectoryListQuery,
  AdminDirectoryListResponse,
  AdminDirectoryOwnerType,
  AdminDirectoryPublishArchiveResponse,
  AdminDirectorySourceType,
  AdminDirectoryStatus,
  AdminDirectoryUpdateInput,
  AdminDirectoryVerificationStatus,
  AdminDirectoryVertical,
} from '../types/adminDirectories'
import type { AdminActorSummary, AdminPagination } from '../types/adminUsers'

interface BackendAdminActorSummary {
  id?: string
  _id?: string
  name?: string
  username?: string
  email?: string
  role?: string
}

interface BackendDirectoryEntry {
  id?: string
  _id?: string
  name?: string
  slug?: string
  verticalType?: string
  shortDescription?: string
  description?: string | null
  logo?: string | null
  coverImage?: string | null
  website?: string | null
  canonicalUrl?: string | null
  country?: string | null
  region?: string | null
  categories?: string[]
  tags?: string[]
  socialLinks?: Record<string, unknown> | null
  status?: string
  verificationStatus?: string
  isActive?: boolean
  isFeatured?: boolean
  showInHomeSection?: boolean
  showInDirectory?: boolean
  landingEnabled?: boolean
  showAllEnabled?: boolean
  ownerType?: string
  sourceType?: string
  claimable?: boolean
  ownerUser?: BackendAdminActorSummary | string | null
  metadata?: Record<string, unknown> | null
  publishedAt?: string | null
  archivedAt?: string | null
  createdBy?: BackendAdminActorSummary | string | null
  updatedBy?: BackendAdminActorSummary | string | null
  createdAt?: string | null
  updatedAt?: string | null
}

interface BackendDirectoryListResponse {
  items?: BackendDirectoryEntry[]
  pagination?: Partial<AdminPagination>
}

interface BackendDirectoryPublishArchiveResponse {
  changed?: boolean
  entry?: BackendDirectoryEntry
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

const toDirectoryVertical = (value: string | undefined): AdminDirectoryVertical => {
  if (value === 'broker') return 'broker'
  if (value === 'exchange') return 'exchange'
  if (value === 'site') return 'site'
  if (value === 'app') return 'app'
  if (value === 'podcast') return 'podcast'
  if (value === 'event') return 'event'
  return 'other'
}

const toDirectoryStatus = (value: string | undefined): AdminDirectoryStatus => {
  if (value === 'published') return 'published'
  if (value === 'archived') return 'archived'
  return 'draft'
}

const toVerificationStatus = (value: string | undefined): AdminDirectoryVerificationStatus => {
  if (value === 'pending') return 'pending'
  if (value === 'verified') return 'verified'
  return 'unverified'
}

const toOwnerType = (value: string | undefined): AdminDirectoryOwnerType =>
  value === 'creator_owned' ? 'creator_owned' : 'admin_seeded'

const toSourceType = (value: string | undefined): AdminDirectorySourceType => {
  if (value === 'external_profile') return 'external_profile'
  if (value === 'external_content') return 'external_content'
  return 'internal'
}

const mapActor = (actor?: BackendAdminActorSummary | string | null): AdminActorSummary | null => {
  const id = resolveId(actor)
  if (!id) return null

  if (!actor || typeof actor !== 'object') {
    return { id }
  }

  return {
    id,
    name: actor.name,
    username: actor.username,
    email: actor.email,
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

const normalizePagination = (pagination?: Partial<AdminPagination>): AdminPagination => ({
  page: pagination?.page && pagination.page > 0 ? pagination.page : DEFAULT_PAGE,
  limit: pagination?.limit && pagination.limit > 0 ? pagination.limit : DEFAULT_LIMIT,
  total: pagination?.total && pagination.total >= 0 ? pagination.total : 0,
  pages: pagination?.pages && pagination.pages > 0 ? pagination.pages : 1,
})

const mapDirectoryEntry = (item: BackendDirectoryEntry): AdminDirectoryEntry | null => {
  const id = resolveId(item)
  if (!id) return null
  if (typeof item.name !== 'string' || item.name.length === 0) return null
  if (typeof item.slug !== 'string' || item.slug.length === 0) return null
  if (typeof item.shortDescription !== 'string') return null

  return {
    id,
    name: item.name,
    slug: item.slug,
    verticalType: toDirectoryVertical(item.verticalType),
    shortDescription: item.shortDescription,
    description: typeof item.description === 'string' ? item.description : null,
    logo: typeof item.logo === 'string' ? item.logo : null,
    coverImage: typeof item.coverImage === 'string' ? item.coverImage : null,
    website: typeof item.website === 'string' ? item.website : null,
    canonicalUrl: typeof item.canonicalUrl === 'string' ? item.canonicalUrl : null,
    country: typeof item.country === 'string' ? item.country : null,
    region: typeof item.region === 'string' ? item.region : null,
    categories: Array.isArray(item.categories)
      ? item.categories.filter((value): value is string => typeof value === 'string')
      : [],
    tags: Array.isArray(item.tags)
      ? item.tags.filter((value): value is string => typeof value === 'string')
      : [],
    socialLinks: item.socialLinks ?? null,
    status: toDirectoryStatus(item.status),
    verificationStatus: toVerificationStatus(item.verificationStatus),
    isActive: Boolean(item.isActive),
    isFeatured: Boolean(item.isFeatured),
    showInHomeSection: Boolean(item.showInHomeSection),
    showInDirectory: item.showInDirectory !== false,
    landingEnabled: item.landingEnabled !== false,
    showAllEnabled: item.showAllEnabled !== false,
    ownerType: toOwnerType(item.ownerType),
    sourceType: toSourceType(item.sourceType),
    claimable: Boolean(item.claimable),
    ownerUser: mapActor(item.ownerUser),
    metadata: item.metadata ?? null,
    publishedAt: typeof item.publishedAt === 'string' ? item.publishedAt : null,
    archivedAt: typeof item.archivedAt === 'string' ? item.archivedAt : null,
    createdBy: mapActor(item.createdBy),
    updatedBy: mapActor(item.updatedBy),
    createdAt: typeof item.createdAt === 'string' ? item.createdAt : null,
    updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : null,
  }
}

const buildListQueryParams = (
  query: AdminDirectoryListQuery,
): Record<string, string | number | boolean> => {
  const params: Record<string, string | number | boolean> = {}

  if (query.status) params.status = query.status
  if (query.search && query.search.trim().length > 0) params.search = query.search.trim()
  if (typeof query.isActive === 'boolean') params.isActive = query.isActive
  if (typeof query.isFeatured === 'boolean') params.isFeatured = query.isFeatured
  if (typeof query.claimable === 'boolean') params.claimable = query.claimable
  if (typeof query.page === 'number' && query.page > 0) params.page = query.page
  if (typeof query.limit === 'number' && query.limit > 0) params.limit = query.limit

  return params
}

const cleanOptionalText = (value: string | null | undefined): string | undefined => {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

const cleanOptionalStringArray = (values?: string[] | null): string[] | undefined => {
  if (!Array.isArray(values)) return undefined
  return values
    .filter((value): value is string => typeof value === 'string')
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
}

const buildCreatePayload = (input: AdminDirectoryCreateInput): Record<string, unknown> => {
  const payload: Record<string, unknown> = {
    name: input.name.trim(),
    shortDescription: input.shortDescription.trim(),
  }

  const slug = cleanOptionalText(input.slug)
  if (slug) payload.slug = slug
  const description = cleanOptionalText(input.description)
  if (description) payload.description = description
  const logo = cleanOptionalText(input.logo)
  if (logo) payload.logo = logo
  const coverImage = cleanOptionalText(input.coverImage)
  if (coverImage) payload.coverImage = coverImage
  const website = cleanOptionalText(input.website)
  if (website) payload.website = website
  const canonicalUrl = cleanOptionalText(input.canonicalUrl)
  if (canonicalUrl) payload.canonicalUrl = canonicalUrl
  const country = cleanOptionalText(input.country)
  if (country) payload.country = country
  const region = cleanOptionalText(input.region)
  if (region) payload.region = region
  const categories = cleanOptionalStringArray(input.categories)
  if (categories && categories.length > 0) payload.categories = categories
  const tags = cleanOptionalStringArray(input.tags)
  if (tags && tags.length > 0) payload.tags = tags

  if (input.socialLinks) payload.socialLinks = input.socialLinks
  if (input.status) payload.status = input.status
  if (input.verificationStatus) payload.verificationStatus = input.verificationStatus
  if (typeof input.isActive === 'boolean') payload.isActive = input.isActive
  if (typeof input.isFeatured === 'boolean') payload.isFeatured = input.isFeatured
  if (typeof input.showInHomeSection === 'boolean')
    payload.showInHomeSection = input.showInHomeSection
  if (typeof input.showInDirectory === 'boolean') payload.showInDirectory = input.showInDirectory
  if (typeof input.landingEnabled === 'boolean') payload.landingEnabled = input.landingEnabled
  if (typeof input.showAllEnabled === 'boolean') payload.showAllEnabled = input.showAllEnabled
  if (input.ownerType) payload.ownerType = input.ownerType
  if (input.sourceType) payload.sourceType = input.sourceType
  if (typeof input.claimable === 'boolean') payload.claimable = input.claimable
  if (typeof input.ownerUserId !== 'undefined') payload.ownerUserId = input.ownerUserId
  if (typeof input.metadata !== 'undefined') payload.metadata = input.metadata

  return payload
}

const buildUpdatePayload = (input: AdminDirectoryUpdateInput): Record<string, unknown> => {
  const payload: Record<string, unknown> = {}

  if (typeof input.name !== 'undefined') payload.name = input.name.trim()
  if (typeof input.shortDescription !== 'undefined')
    payload.shortDescription = input.shortDescription.trim()
  if (typeof input.slug !== 'undefined') payload.slug = cleanOptionalText(input.slug) ?? ''
  if (typeof input.description !== 'undefined')
    payload.description = cleanOptionalText(input.description)
  if (typeof input.logo !== 'undefined') payload.logo = cleanOptionalText(input.logo)
  if (typeof input.coverImage !== 'undefined')
    payload.coverImage = cleanOptionalText(input.coverImage)
  if (typeof input.website !== 'undefined') payload.website = cleanOptionalText(input.website)
  if (typeof input.canonicalUrl !== 'undefined')
    payload.canonicalUrl = cleanOptionalText(input.canonicalUrl)
  if (typeof input.country !== 'undefined') payload.country = cleanOptionalText(input.country)
  if (typeof input.region !== 'undefined') payload.region = cleanOptionalText(input.region)

  if (typeof input.categories !== 'undefined') {
    payload.categories = cleanOptionalStringArray(input.categories) ?? []
  }
  if (typeof input.tags !== 'undefined') {
    payload.tags = cleanOptionalStringArray(input.tags) ?? []
  }

  if (typeof input.socialLinks !== 'undefined') payload.socialLinks = input.socialLinks
  if (input.status) payload.status = input.status
  if (input.verificationStatus) payload.verificationStatus = input.verificationStatus
  if (typeof input.isActive === 'boolean') payload.isActive = input.isActive
  if (typeof input.isFeatured === 'boolean') payload.isFeatured = input.isFeatured
  if (typeof input.showInHomeSection === 'boolean')
    payload.showInHomeSection = input.showInHomeSection
  if (typeof input.showInDirectory === 'boolean') payload.showInDirectory = input.showInDirectory
  if (typeof input.landingEnabled === 'boolean') payload.landingEnabled = input.landingEnabled
  if (typeof input.showAllEnabled === 'boolean') payload.showAllEnabled = input.showAllEnabled
  if (input.ownerType) payload.ownerType = input.ownerType
  if (input.sourceType) payload.sourceType = input.sourceType
  if (typeof input.claimable === 'boolean') payload.claimable = input.claimable
  if (typeof input.ownerUserId !== 'undefined') payload.ownerUserId = input.ownerUserId
  if (typeof input.metadata !== 'undefined') payload.metadata = input.metadata

  return payload
}

const mapPublishArchiveResponse = (
  responseData: BackendDirectoryPublishArchiveResponse,
): AdminDirectoryPublishArchiveResponse => {
  const entry = responseData.entry ? mapDirectoryEntry(responseData.entry) : null
  if (!entry) {
    throw new Error('Resposta admin invalida: entry em falta.')
  }
  return {
    changed: Boolean(responseData.changed),
    entry,
  }
}

export const adminDirectoriesService = {
  listDirectories: async (
    vertical: AdminDirectoryVertical,
    query: AdminDirectoryListQuery = {},
  ): Promise<AdminDirectoryListResponse> => {
    const response = await apiClient.get<BackendDirectoryListResponse>(
      `/admin/directories/${vertical}`,
      {
        params: buildListQueryParams(query),
      },
    )

    const items = (response.data.items ?? [])
      .map(mapDirectoryEntry)
      .filter((item): item is AdminDirectoryEntry => item !== null)

    return {
      items,
      pagination: normalizePagination(response.data.pagination),
    }
  },

  createDirectory: async (
    vertical: AdminDirectoryVertical,
    input: AdminDirectoryCreateInput,
  ): Promise<AdminDirectoryEntry> => {
    const response = await apiClient.post<BackendDirectoryEntry>(
      `/admin/directories/${vertical}`,
      buildCreatePayload(input),
    )

    const entry = mapDirectoryEntry(response.data)
    if (!entry) throw new Error('Resposta admin invalida: entry em falta.')
    return entry
  },

  updateDirectory: async (
    vertical: AdminDirectoryVertical,
    entryId: string,
    input: AdminDirectoryUpdateInput,
  ): Promise<AdminDirectoryEntry> => {
    const response = await apiClient.patch<BackendDirectoryEntry>(
      `/admin/directories/${vertical}/${entryId}`,
      buildUpdatePayload(input),
    )

    const entry = mapDirectoryEntry(response.data)
    if (!entry) throw new Error('Resposta admin invalida: entry em falta.')
    return entry
  },

  publishDirectory: async (
    vertical: AdminDirectoryVertical,
    entryId: string,
    reason?: string,
  ): Promise<AdminDirectoryPublishArchiveResponse> => {
    const response = await apiClient.post<BackendDirectoryPublishArchiveResponse>(
      `/admin/directories/${vertical}/${entryId}/publish`,
      {
        reason: cleanOptionalText(reason),
      },
    )
    return mapPublishArchiveResponse(response.data)
  },

  archiveDirectory: async (
    vertical: AdminDirectoryVertical,
    entryId: string,
    reason: string,
  ): Promise<AdminDirectoryPublishArchiveResponse> => {
    const response = await apiClient.post<BackendDirectoryPublishArchiveResponse>(
      `/admin/directories/${vertical}/${entryId}/archive`,
      {
        reason: reason.trim(),
      },
    )
    return mapPublishArchiveResponse(response.data)
  },
}
