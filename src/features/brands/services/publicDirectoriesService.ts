import { apiClient } from '@/lib/api/client'

export type PublicDirectoryVertical =
  | 'broker'
  | 'exchange'
  | 'site'
  | 'app'
  | 'podcast'
  | 'event'
  | 'other'
  | 'insurance'
  | 'bank'
  | 'fund'
  | 'fintech'
  | 'newsletter'

export type PublicDirectoryVerificationStatus = 'unverified' | 'pending' | 'verified'
export type PublicDirectorySort = 'featured' | 'popular' | 'rating' | 'recent' | 'name'

export interface PublicDirectorySummaryEntry {
  id: string
  name: string
  slug: string
  verticalType: PublicDirectoryVertical
  shortDescription: string
  description: string | null
  logo: string | null
  website: string | null
  country: string | null
  verificationStatus: PublicDirectoryVerificationStatus
  isFeatured: boolean
  isSponsoredPlacement: boolean
  views: number
  averageRating: number
  ratingsCount: number
  commentsCount: number
}

export interface PublicDirectoryDetailSocialLinks {
  twitter?: string
  linkedin?: string
  instagram?: string
  youtube?: string
  facebook?: string
  tiktok?: string
}

export interface PublicDirectorySponsoredPlacement {
  active: boolean
  campaignId: string
  priority: number
  code: string | null
  headline: string | null
  disclosureLabel: string | null
}

export interface PublicDirectoryDetailEntry extends PublicDirectorySummaryEntry {
  coverImage: string | null
  canonicalUrl: string | null
  region: string | null
  regulatedBy: string[]
  licenses: string[]
  pros: string[]
  cons: string[]
  keyFeatures: string[]
  pricing: string | null
  categories: string[]
  tags: string[]
  socialLinks: PublicDirectoryDetailSocialLinks | null
  sponsoredPlacement: PublicDirectorySponsoredPlacement | null
  publishedAt: string | null
  updatedAt: string | null
}

export type PublicDirectoryRelatedContentType =
  | 'article'
  | 'course'
  | 'video'
  | 'event'
  | 'book'
  | 'podcast'

export interface PublicDirectoryRelatedContentItem {
  id: string
  type: PublicDirectoryRelatedContentType
  title: string
  slug: string
  description: string
  coverImage: string | null
  url: string
  isSponsored: boolean
  category: string | null
  tags: string[]
  views: number
  averageRating: number
  publishedAt: string | null
  score: number
}

export interface PublicDirectoryRelatedContentResponse {
  directory: {
    id: string
    name: string
    slug: string
    verticalType: PublicDirectoryVertical
  }
  items: PublicDirectoryRelatedContentItem[]
  total: number
  limit: number
}

export interface PublicDirectoryCategoryEntry {
  verticalType: PublicDirectoryVertical
  count: number
  featuredCount: number
  verifiedCount: number
}

export interface PublicDirectoryCategorySummary {
  total: number
  totalFeatured: number
  totalVerified: number
  verticalsWithEntries: number
}

export interface PublicDirectoryCategoryFilters {
  country: string | null
  verificationStatus: PublicDirectoryVerificationStatus | null
  search: string | null
  featured: boolean | null
  tags: string[]
}

export interface PublicDirectoryCategoryQuery {
  country?: string
  verificationStatus?: PublicDirectoryVerificationStatus
  search?: string
  featured?: boolean
  tags?: string[]
}

export interface PublicDirectoryCategoryResponse {
  summary: PublicDirectoryCategorySummary
  filters: PublicDirectoryCategoryFilters
  items: PublicDirectoryCategoryEntry[]
}

export interface PublicDirectoryListFilters {
  verticalType: PublicDirectoryVertical | null
  country: string | null
  verificationStatus: PublicDirectoryVerificationStatus | null
  search: string | null
  featured: boolean | null
  tags: string[]
  sort: PublicDirectorySort
}

export interface PublicDirectoryListPagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface PublicDirectoryListQuery {
  verticalType?: PublicDirectoryVertical
  country?: string
  verificationStatus?: PublicDirectoryVerificationStatus
  search?: string
  featured?: boolean
  tags?: string[]
  sort?: PublicDirectorySort
  page?: number
  limit?: number
}

export interface PublicDirectoryFeaturedResponse {
  items: PublicDirectorySummaryEntry[]
  limit: number
  total: number
}

export interface PublicDirectoryListResponse {
  items: PublicDirectorySummaryEntry[]
  filters: PublicDirectoryListFilters
  pagination: PublicDirectoryListPagination
}

export interface PublicDirectorySearchResponse {
  query: string
  items: PublicDirectorySummaryEntry[]
  filters: PublicDirectoryListFilters
  pagination: PublicDirectoryListPagination
}

export interface PublicDirectoryComparisonMetricSummary {
  min: number
  max: number
  spread: number
  leaderIds: string[]
}

export interface PublicDirectoryCompareMetrics {
  views: PublicDirectoryComparisonMetricSummary
  averageRating: PublicDirectoryComparisonMetricSummary
  ratingsCount: PublicDirectoryComparisonMetricSummary
  commentsCount: PublicDirectoryComparisonMetricSummary
}

export interface PublicDirectoryCompareShared {
  tags: string[]
  categories: string[]
  regulatedBy: string[]
}

export interface PublicDirectoryCompareSummary {
  count: number
  requestedSlugs: string[]
  verticalTypes: PublicDirectoryVertical[]
  metrics: PublicDirectoryCompareMetrics
  shared: PublicDirectoryCompareShared
}

export interface PublicDirectoryCompareResponse {
  items: PublicDirectoryDetailEntry[]
  comparison: PublicDirectoryCompareSummary
}

interface BackendDirectorySummaryEntry {
  id?: string
  _id?: string
  name?: string
  slug?: string
  verticalType?: string
  shortDescription?: string
  description?: string | null
  logo?: string | null
  website?: string | null
  country?: string | null
  verificationStatus?: string
  isFeatured?: boolean
  isSponsoredPlacement?: boolean
  views?: number
  averageRating?: number
  ratingsCount?: number
  commentsCount?: number
}

interface BackendDirectorySponsoredPlacement {
  active?: boolean
  campaignId?: string
  priority?: number
  code?: string | null
  headline?: string | null
  disclosureLabel?: string | null
}

interface BackendDirectoryDetailSocialLinks {
  twitter?: string | null
  linkedin?: string | null
  instagram?: string | null
  youtube?: string | null
  facebook?: string | null
  tiktok?: string | null
}

interface BackendDirectoryDetailEntry extends BackendDirectorySummaryEntry {
  coverImage?: string | null
  canonicalUrl?: string | null
  region?: string | null
  regulatedBy?: string[]
  licenses?: string[]
  pros?: string[]
  cons?: string[]
  keyFeatures?: string[]
  pricing?: string | null
  categories?: string[]
  tags?: string[]
  socialLinks?: BackendDirectoryDetailSocialLinks | null
  sponsoredPlacement?: BackendDirectorySponsoredPlacement | null
  publishedAt?: string | null
  updatedAt?: string | null
}

interface BackendDirectoryCategoryEntry {
  verticalType?: string
  count?: number
  featuredCount?: number
  verifiedCount?: number
}

interface BackendDirectoryCategorySummary {
  total?: number
  totalFeatured?: number
  totalVerified?: number
  verticalsWithEntries?: number
}

interface BackendDirectoryCategoryFilters {
  country?: string | null
  verificationStatus?: string | null
  search?: string | null
  featured?: boolean | null
  tags?: string[]
}

interface BackendDirectoryCategoriesResponse {
  summary?: BackendDirectoryCategorySummary
  filters?: BackendDirectoryCategoryFilters
  items?: BackendDirectoryCategoryEntry[]
}

interface BackendDirectoryFeaturedResponse {
  items?: BackendDirectorySummaryEntry[]
  limit?: number
  total?: number
}

interface BackendDirectoryListFilters {
  verticalType?: string | null
  country?: string | null
  verificationStatus?: string | null
  search?: string | null
  featured?: boolean | null
  tags?: string[]
  sort?: string
}

interface BackendDirectoryListPagination {
  page?: number
  limit?: number
  total?: number
  pages?: number
}

interface BackendDirectorySearchResponse {
  query?: string
  items?: BackendDirectorySummaryEntry[]
  filters?: BackendDirectoryListFilters
  pagination?: BackendDirectoryListPagination
}

interface BackendDirectoryListResponse {
  items?: BackendDirectorySummaryEntry[]
  filters?: BackendDirectoryListFilters
  pagination?: BackendDirectoryListPagination
}

interface BackendDirectoryDetailResponse {
  entry?: BackendDirectoryDetailEntry
}

interface BackendDirectoryRelatedContentDirectory {
  id?: string
  _id?: string
  name?: string
  slug?: string
  verticalType?: string
}

interface BackendDirectoryRelatedContentItem {
  id?: string
  _id?: string
  type?: string
  title?: string
  slug?: string
  description?: string
  coverImage?: string | null
  url?: string
  isSponsored?: boolean
  category?: string | null
  tags?: string[]
  views?: number
  averageRating?: number
  publishedAt?: string | null
  score?: number
}

interface BackendDirectoryRelatedContentResponse {
  directory?: BackendDirectoryRelatedContentDirectory
  items?: BackendDirectoryRelatedContentItem[]
  total?: number
  limit?: number
}

interface BackendDirectoryComparisonMetricSummary {
  min?: number
  max?: number
  spread?: number
  leaderIds?: string[]
}

interface BackendDirectoryCompareMetrics {
  views?: BackendDirectoryComparisonMetricSummary
  averageRating?: BackendDirectoryComparisonMetricSummary
  ratingsCount?: BackendDirectoryComparisonMetricSummary
  commentsCount?: BackendDirectoryComparisonMetricSummary
}

interface BackendDirectoryCompareShared {
  tags?: string[]
  categories?: string[]
  regulatedBy?: string[]
}

interface BackendDirectoryCompareSummary {
  count?: number
  requestedSlugs?: string[]
  verticalTypes?: string[]
  metrics?: BackendDirectoryCompareMetrics
  shared?: BackendDirectoryCompareShared
}

interface BackendDirectoryCompareResponse {
  items?: BackendDirectoryDetailEntry[]
  comparison?: BackendDirectoryCompareSummary
}

const DEFAULT_FEATURED_LIMIT = 6
const DEFAULT_LIST_LIMIT = 20
const DEFAULT_SEARCH_LIMIT = 12
const DEFAULT_RELATED_CONTENT_LIMIT = 8
const DEFAULT_PAGE = 1
const PUBLIC_DIRECTORY_SEARCH_MIN_LENGTH = 2

const toNumber = (value: unknown): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const cleanOptionalString = (value: unknown): string | null => {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

const cleanOptionalStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

const resolveId = (value: Pick<BackendDirectorySummaryEntry, 'id' | '_id'>): string | null => {
  if (typeof value.id === 'string' && value.id.trim().length > 0) return value.id.trim()
  if (typeof value._id === 'string' && value._id.trim().length > 0) return value._id.trim()
  return null
}

const normalizeUrl = (value: string | null | undefined): string => {
  const normalized = cleanOptionalString(value)
  return normalized ?? ''
}

const normalizeVertical = (value: string | null | undefined): PublicDirectoryVertical => {
  switch (value) {
    case 'broker':
      return 'broker'
    case 'exchange':
      return 'exchange'
    case 'site':
      return 'site'
    case 'app':
      return 'app'
    case 'podcast':
      return 'podcast'
    case 'event':
      return 'event'
    case 'insurance':
      return 'insurance'
    case 'bank':
      return 'bank'
    case 'fund':
      return 'fund'
    case 'fintech':
      return 'fintech'
    case 'newsletter':
      return 'newsletter'
    default:
      return 'other'
  }
}

const normalizeOptionalVertical = (
  value: string | null | undefined,
): PublicDirectoryVertical | null => {
  const normalized = cleanOptionalString(value)
  if (!normalized) return null
  return normalizeVertical(normalized)
}

const normalizeVerificationStatus = (
  value: string | null | undefined,
): PublicDirectoryVerificationStatus => {
  if (value === 'pending') return 'pending'
  if (value === 'verified') return 'verified'
  return 'unverified'
}

const normalizeOptionalVerificationStatus = (
  value: string | null | undefined,
): PublicDirectoryVerificationStatus | null => {
  const normalized = cleanOptionalString(value)
  if (!normalized) return null
  return normalizeVerificationStatus(normalized)
}

const normalizeSort = (value: string | null | undefined): PublicDirectorySort => {
  if (value === 'popular') return 'popular'
  if (value === 'rating') return 'rating'
  if (value === 'recent') return 'recent'
  if (value === 'name') return 'name'
  return 'featured'
}

const sanitizeLimit = (value: number | undefined, fallback: number): number => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return fallback
  return Math.floor(value)
}

const mapDirectorySummary = (
  item: BackendDirectorySummaryEntry,
): PublicDirectorySummaryEntry | null => {
  const id = resolveId(item)
  const name = cleanOptionalString(item.name)
  const slug = cleanOptionalString(item.slug)
  const shortDescription = cleanOptionalString(item.shortDescription)
  if (!id || !name || !slug || !shortDescription) {
    return null
  }

  return {
    id,
    name,
    slug,
    verticalType: normalizeVertical(item.verticalType),
    shortDescription,
    description: cleanOptionalString(item.description),
    logo: cleanOptionalString(item.logo),
    website: cleanOptionalString(item.website),
    country: cleanOptionalString(item.country),
    verificationStatus: normalizeVerificationStatus(item.verificationStatus),
    isFeatured: Boolean(item.isFeatured),
    isSponsoredPlacement: Boolean(item.isSponsoredPlacement),
    views: toNumber(item.views),
    averageRating: toNumber(item.averageRating),
    ratingsCount: toNumber(item.ratingsCount),
    commentsCount: toNumber(item.commentsCount),
  }
}

const mapDirectoryDetail = (
  item: BackendDirectoryDetailEntry | undefined,
): PublicDirectoryDetailEntry | null => {
  if (!item) return null

  const summary = mapDirectorySummary(item)
  if (!summary) return null

  const socialLinks = item.socialLinks
    ? {
        twitter: normalizeUrl(item.socialLinks.twitter) || undefined,
        linkedin: normalizeUrl(item.socialLinks.linkedin) || undefined,
        instagram: normalizeUrl(item.socialLinks.instagram) || undefined,
        youtube: normalizeUrl(item.socialLinks.youtube) || undefined,
        facebook: normalizeUrl(item.socialLinks.facebook) || undefined,
        tiktok: normalizeUrl(item.socialLinks.tiktok) || undefined,
      }
    : null

  const hasSocialLinks = Boolean(
    socialLinks &&
      (socialLinks.twitter ||
        socialLinks.linkedin ||
        socialLinks.instagram ||
        socialLinks.youtube ||
        socialLinks.facebook ||
        socialLinks.tiktok),
  )

  return {
    ...summary,
    coverImage: cleanOptionalString(item.coverImage),
    canonicalUrl: cleanOptionalString(item.canonicalUrl),
    region: cleanOptionalString(item.region),
    regulatedBy: cleanOptionalStringArray(item.regulatedBy),
    licenses: cleanOptionalStringArray(item.licenses),
    pros: cleanOptionalStringArray(item.pros),
    cons: cleanOptionalStringArray(item.cons),
    keyFeatures: cleanOptionalStringArray(item.keyFeatures),
    pricing: cleanOptionalString(item.pricing),
    categories: cleanOptionalStringArray(item.categories),
    tags: cleanOptionalStringArray(item.tags),
    socialLinks: hasSocialLinks ? socialLinks : null,
    sponsoredPlacement: item.sponsoredPlacement
      ? {
          active: Boolean(item.sponsoredPlacement.active),
          campaignId: cleanOptionalString(item.sponsoredPlacement.campaignId) ?? '',
          priority: toNumber(item.sponsoredPlacement.priority),
          code: cleanOptionalString(item.sponsoredPlacement.code),
          headline: cleanOptionalString(item.sponsoredPlacement.headline),
          disclosureLabel: cleanOptionalString(item.sponsoredPlacement.disclosureLabel),
        }
      : null,
    publishedAt: cleanOptionalString(item.publishedAt),
    updatedAt: cleanOptionalString(item.updatedAt),
  }
}

const toRelatedContentType = (value: unknown): PublicDirectoryRelatedContentType | null => {
  if (value === 'article') return 'article'
  if (value === 'course') return 'course'
  if (value === 'video') return 'video'
  if (value === 'event') return 'event'
  if (value === 'book') return 'book'
  if (value === 'podcast') return 'podcast'
  return null
}

const mapRelatedContentItem = (
  item: BackendDirectoryRelatedContentItem,
): PublicDirectoryRelatedContentItem | null => {
  const id = resolveId(item)
  const type = toRelatedContentType(item.type)
  const title = cleanOptionalString(item.title)
  const slug = cleanOptionalString(item.slug)
  if (!id || !type || !title || !slug) return null

  return {
    id,
    type,
    title,
    slug,
    description: cleanOptionalString(item.description) ?? '',
    coverImage: cleanOptionalString(item.coverImage),
    url: cleanOptionalString(item.url) ?? '',
    isSponsored: Boolean(item.isSponsored),
    category: cleanOptionalString(item.category),
    tags: cleanOptionalStringArray(item.tags),
    views: toNumber(item.views),
    averageRating: toNumber(item.averageRating),
    publishedAt: cleanOptionalString(item.publishedAt),
    score: toNumber(item.score),
  }
}

const mapComparisonMetricSummary = (
  value: BackendDirectoryComparisonMetricSummary | undefined,
): PublicDirectoryComparisonMetricSummary => ({
  min: toNumber(value?.min),
  max: toNumber(value?.max),
  spread: toNumber(value?.spread),
  leaderIds: cleanOptionalStringArray(value?.leaderIds),
})

const buildCategoryParams = (
  query: PublicDirectoryCategoryQuery,
): Record<string, string | number | boolean> => {
  const params: Record<string, string | number | boolean> = {}

  const country = cleanOptionalString(query.country)
  if (country) params.country = country

  if (query.verificationStatus) params.verificationStatus = query.verificationStatus

  const search = cleanOptionalString(query.search)
  if (search) params.search = search

  if (typeof query.featured === 'boolean') params.featured = query.featured

  const tags = cleanOptionalStringArray(query.tags)
  if (tags.length > 0) params.tags = tags.join(',')

  return params
}

const buildListParams = (
  query: PublicDirectoryListQuery,
): Record<string, string | number | boolean> => {
  const params = buildCategoryParams(query)

  if (query.verticalType) params.verticalType = query.verticalType
  if (query.sort) params.sort = query.sort
  if (typeof query.page === 'number' && query.page > 0) params.page = Math.floor(query.page)
  if (typeof query.limit === 'number' && query.limit > 0) params.limit = Math.floor(query.limit)

  return params
}

const mapListFilters = (
  filters: BackendDirectoryListFilters | undefined,
  fallbackSearch: string | null,
  fallbackSort: PublicDirectorySort,
): PublicDirectoryListFilters => ({
  verticalType: normalizeOptionalVertical(filters?.verticalType),
  country: cleanOptionalString(filters?.country),
  verificationStatus: normalizeOptionalVerificationStatus(filters?.verificationStatus),
  search: cleanOptionalString(filters?.search) ?? fallbackSearch,
  featured: typeof filters?.featured === 'boolean' ? filters.featured : null,
  tags: cleanOptionalStringArray(filters?.tags),
  sort: typeof filters?.sort === 'string' ? normalizeSort(filters.sort) : fallbackSort,
})

const mapListPagination = (
  pagination: BackendDirectoryListPagination | undefined,
  fallbackLimit: number,
): PublicDirectoryListPagination => ({
  page:
    typeof pagination?.page === 'number' && pagination.page > 0
      ? Math.floor(pagination.page)
      : DEFAULT_PAGE,
  limit:
    typeof pagination?.limit === 'number' && pagination.limit > 0
      ? Math.floor(pagination.limit)
      : fallbackLimit,
  total:
    typeof pagination?.total === 'number' && pagination.total >= 0
      ? Math.floor(pagination.total)
      : 0,
  pages:
    typeof pagination?.pages === 'number' && pagination.pages > 0
      ? Math.floor(pagination.pages)
      : 1,
})

export const publicDirectoriesService = {
  list: async (query: PublicDirectoryListQuery = {}): Promise<PublicDirectoryListResponse> => {
    const fallbackSearch = cleanOptionalString(query.search)
    const fallbackSort = query.sort ?? 'featured'
    const fallbackLimit = sanitizeLimit(query.limit, DEFAULT_LIST_LIMIT)

    const response = await apiClient.get<BackendDirectoryListResponse>('/directories', {
      params: buildListParams(query),
    })

    const items = Array.isArray(response.data?.items) ? response.data.items : []
    const mapped = items
      .map(mapDirectorySummary)
      .filter((item): item is PublicDirectorySummaryEntry => item !== null)

    return {
      items: mapped,
      filters: mapListFilters(response.data?.filters, fallbackSearch, fallbackSort),
      pagination: mapListPagination(response.data?.pagination, fallbackLimit),
    }
  },

  getCategories: async (
    query: PublicDirectoryCategoryQuery = {},
  ): Promise<PublicDirectoryCategoryResponse> => {
    const response = await apiClient.get<BackendDirectoryCategoriesResponse>(
      '/directories/categories',
      {
        params: buildCategoryParams(query),
      },
    )

    const summary = response.data?.summary
    const items = Array.isArray(response.data?.items) ? response.data.items : []

    return {
      summary: {
        total: toNumber(summary?.total),
        totalFeatured: toNumber(summary?.totalFeatured),
        totalVerified: toNumber(summary?.totalVerified),
        verticalsWithEntries: toNumber(summary?.verticalsWithEntries),
      },
      filters: {
        country: cleanOptionalString(response.data?.filters?.country),
        verificationStatus: normalizeOptionalVerificationStatus(
          response.data?.filters?.verificationStatus,
        ),
        search: cleanOptionalString(response.data?.filters?.search),
        featured:
          typeof response.data?.filters?.featured === 'boolean'
            ? response.data.filters.featured
            : null,
        tags: cleanOptionalStringArray(response.data?.filters?.tags),
      },
      items: items.map((item) => ({
        verticalType: normalizeVertical(item.verticalType),
        count: toNumber(item.count),
        featuredCount: toNumber(item.featuredCount),
        verifiedCount: toNumber(item.verifiedCount),
      })),
    }
  },

  getFeatured: async (limit = DEFAULT_FEATURED_LIMIT): Promise<PublicDirectoryFeaturedResponse> => {
    const normalizedLimit = sanitizeLimit(limit, DEFAULT_FEATURED_LIMIT)
    const response = await apiClient.get<BackendDirectoryFeaturedResponse>(
      '/directories/featured',
      {
        params: {
          limit: normalizedLimit,
        },
      },
    )

    const items = Array.isArray(response.data?.items) ? response.data.items : []
    const mapped = items
      .map(mapDirectorySummary)
      .filter((item): item is PublicDirectorySummaryEntry => item !== null)

    return {
      items: mapped,
      limit:
        typeof response.data?.limit === 'number' && response.data.limit > 0
          ? Math.floor(response.data.limit)
          : normalizedLimit,
      total:
        typeof response.data?.total === 'number' && response.data.total >= 0
          ? Math.floor(response.data.total)
          : mapped.length,
    }
  },

  resolveBySlug: async (slug: string): Promise<PublicDirectorySummaryEntry | null> => {
    const normalizedSlug = slug.trim().toLowerCase()
    if (normalizedSlug.length < PUBLIC_DIRECTORY_SEARCH_MIN_LENGTH) return null

    const result = await publicDirectoriesService.search(normalizedSlug, {
      sort: 'name',
      page: 1,
      limit: 25,
    })

    return result.items.find((item) => item.slug.trim().toLowerCase() === normalizedSlug) ?? null
  },

  getDetail: async (
    vertical: PublicDirectoryVertical,
    slug: string,
  ): Promise<PublicDirectoryDetailEntry | null> => {
    const normalizedSlug = slug.trim().toLowerCase()
    if (normalizedSlug.length < PUBLIC_DIRECTORY_SEARCH_MIN_LENGTH) return null

    const response = await apiClient.get<BackendDirectoryDetailResponse>(
      `/directories/${vertical}/${encodeURIComponent(normalizedSlug)}`,
    )

    return mapDirectoryDetail(response.data?.entry)
  },

  getDetailBySlug: async (slug: string): Promise<PublicDirectoryDetailEntry | null> => {
    const resolved = await publicDirectoriesService.resolveBySlug(slug)
    if (!resolved) return null
    return publicDirectoriesService.getDetail(resolved.verticalType, resolved.slug)
  },

  getRelatedContent: async (
    vertical: PublicDirectoryVertical,
    slug: string,
    limit = DEFAULT_RELATED_CONTENT_LIMIT,
  ): Promise<PublicDirectoryRelatedContentResponse> => {
    const normalizedSlug = slug.trim().toLowerCase()
    const normalizedLimit = sanitizeLimit(limit, DEFAULT_RELATED_CONTENT_LIMIT)

    const response = await apiClient.get<BackendDirectoryRelatedContentResponse>(
      `/directories/${vertical}/${encodeURIComponent(normalizedSlug)}/related-content`,
      {
        params: {
          limit: normalizedLimit,
        },
      },
    )

    const directory = response.data?.directory
    const directoryId = resolveId(directory ?? {})
    const directoryName = cleanOptionalString(directory?.name)
    const directorySlug = cleanOptionalString(directory?.slug)

    const items = Array.isArray(response.data?.items) ? response.data.items : []
    const mappedItems = items
      .map(mapRelatedContentItem)
      .filter((item): item is PublicDirectoryRelatedContentItem => item !== null)

    return {
      directory: {
        id: directoryId ?? '',
        name: directoryName ?? '',
        slug: directorySlug ?? normalizedSlug,
        verticalType: normalizeVertical(directory?.verticalType),
      },
      items: mappedItems,
      total:
        typeof response.data?.total === 'number' && response.data.total >= 0
          ? Math.floor(response.data.total)
          : mappedItems.length,
      limit:
        typeof response.data?.limit === 'number' && response.data.limit > 0
          ? Math.floor(response.data.limit)
          : normalizedLimit,
    }
  },

  compare: async (slugs: string[]): Promise<PublicDirectoryCompareResponse> => {
    const normalizedSlugs = Array.from(
      new Set(
        slugs
          .filter((item): item is string => typeof item === 'string')
          .map((item) => item.trim().toLowerCase())
          .filter((item) => item.length >= PUBLIC_DIRECTORY_SEARCH_MIN_LENGTH),
      ),
    )

    if (normalizedSlugs.length < 2 || normalizedSlugs.length > 3) {
      throw new Error('Seleciona entre 2 e 3 recursos para comparar.')
    }

    const response = await apiClient.get<BackendDirectoryCompareResponse>('/directories/compare', {
      params: {
        slugs: normalizedSlugs.join(','),
      },
    })

    const items = Array.isArray(response.data?.items) ? response.data.items : []
    const mappedItems = items
      .map((item) => mapDirectoryDetail(item))
      .filter((item): item is PublicDirectoryDetailEntry => item !== null)

    const comparison = response.data?.comparison

    return {
      items: mappedItems,
      comparison: {
        count: toNumber(comparison?.count),
        requestedSlugs: cleanOptionalStringArray(comparison?.requestedSlugs),
        verticalTypes: cleanOptionalStringArray(comparison?.verticalTypes).map(normalizeVertical),
        metrics: {
          views: mapComparisonMetricSummary(comparison?.metrics?.views),
          averageRating: mapComparisonMetricSummary(comparison?.metrics?.averageRating),
          ratingsCount: mapComparisonMetricSummary(comparison?.metrics?.ratingsCount),
          commentsCount: mapComparisonMetricSummary(comparison?.metrics?.commentsCount),
        },
        shared: {
          tags: cleanOptionalStringArray(comparison?.shared?.tags),
          categories: cleanOptionalStringArray(comparison?.shared?.categories),
          regulatedBy: cleanOptionalStringArray(comparison?.shared?.regulatedBy),
        },
      },
    }
  },

  search: async (
    query: string,
    options: PublicDirectoryListQuery = {},
  ): Promise<PublicDirectorySearchResponse> => {
    const normalizedQuery = query.trim()
    const normalizedLimit = sanitizeLimit(options.limit, DEFAULT_SEARCH_LIMIT)
    const fallbackSort = options.sort ?? 'featured'
    const searchOptions: PublicDirectoryListQuery = { ...options }
    delete searchOptions.search

    if (normalizedQuery.length < PUBLIC_DIRECTORY_SEARCH_MIN_LENGTH) {
      return {
        query: normalizedQuery,
        items: [],
        filters: {
          verticalType: searchOptions.verticalType ?? null,
          country: cleanOptionalString(searchOptions.country),
          verificationStatus: searchOptions.verificationStatus ?? null,
          search: normalizedQuery || null,
          featured: typeof searchOptions.featured === 'boolean' ? searchOptions.featured : null,
          tags: cleanOptionalStringArray(searchOptions.tags),
          sort: fallbackSort,
        },
        pagination: {
          page: DEFAULT_PAGE,
          limit: normalizedLimit,
          total: 0,
          pages: 1,
        },
      }
    }

    const response = await apiClient.get<BackendDirectorySearchResponse>('/directories/search', {
      params: {
        q: normalizedQuery,
        ...buildListParams(searchOptions),
      },
    })

    const items = Array.isArray(response.data?.items) ? response.data.items : []
    const mapped = items
      .map(mapDirectorySummary)
      .filter((item): item is PublicDirectorySummaryEntry => item !== null)

    return {
      query: cleanOptionalString(response.data?.query) ?? normalizedQuery,
      items: mapped,
      filters: mapListFilters(response.data?.filters, normalizedQuery, fallbackSort),
      pagination: mapListPagination(response.data?.pagination, normalizedLimit),
    }
  },
}

export { PUBLIC_DIRECTORY_SEARCH_MIN_LENGTH }
