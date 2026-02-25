import { apiClient } from '@/lib/api/client'

export type PublicDirectoryVertical =
  | 'broker'
  | 'exchange'
  | 'site'
  | 'app'
  | 'podcast'
  | 'event'
  | 'other'

export type PublicDirectoryVerificationStatus = 'unverified' | 'pending' | 'verified'
export type PublicEditorialMode = 'landing' | 'show-all'
export type PublicEditorialSort = 'featured' | 'recent' | 'name'

export interface PublicEditorialEntry {
  id: string
  name: string
  slug: string
  verticalType: PublicDirectoryVertical
  shortDescription: string
  description: string | null
  logo: string | null
  coverImage: string | null
  website: string | null
  canonicalUrl: string | null
  country: string | null
  region: string | null
  categories: string[]
  tags: string[]
  verificationStatus: PublicDirectoryVerificationStatus
  isFeatured: boolean
  updatedAt: string | null
}

export interface PublicEditorialPagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface PublicEditorialFilters {
  search: string | null
  country: string | null
  region: string | null
  categories: string[]
  tags: string[]
  featured: boolean | null
  verificationStatus: PublicDirectoryVerificationStatus | null
  sort: PublicEditorialSort
}

export interface PublicEditorialListResponse {
  vertical: PublicDirectoryVertical
  mode: PublicEditorialMode
  filters: PublicEditorialFilters
  items: PublicEditorialEntry[]
  pagination: PublicEditorialPagination
}

export interface PublicEditorialListQuery {
  search?: string
  country?: string
  region?: string
  categories?: string[]
  tags?: string[]
  featured?: boolean
  verificationStatus?: PublicDirectoryVerificationStatus
  sort?: PublicEditorialSort
  page?: number
  limit?: number
}

interface BackendPublicEditorialEntry {
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
  verificationStatus?: string
  isFeatured?: boolean
  updatedAt?: string | null
}

interface BackendPublicEditorialFilters {
  search?: string | null
  country?: string | null
  region?: string | null
  categories?: string[]
  tags?: string[]
  featured?: boolean | null
  verificationStatus?: string | null
  sort?: string
}

interface BackendPublicEditorialResponse {
  vertical?: string
  mode?: string
  filters?: BackendPublicEditorialFilters
  items?: BackendPublicEditorialEntry[]
  pagination?: Partial<PublicEditorialPagination>
}

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 25
const DEFAULT_SORT: PublicEditorialSort = 'featured'

const resolveId = (value: unknown): string | null => {
  if (typeof value === 'string' && value.length > 0) return value
  if (!value || typeof value !== 'object') return null

  const maybeId = (value as { id?: unknown }).id
  if (typeof maybeId === 'string' && maybeId.length > 0) return maybeId

  const maybeObjectId = (value as { _id?: unknown })._id
  if (typeof maybeObjectId === 'string' && maybeObjectId.length > 0) return maybeObjectId

  return null
}

const toVertical = (value: string | undefined): PublicDirectoryVertical => {
  if (value === 'broker') return 'broker'
  if (value === 'exchange') return 'exchange'
  if (value === 'site') return 'site'
  if (value === 'app') return 'app'
  if (value === 'podcast') return 'podcast'
  if (value === 'event') return 'event'
  return 'other'
}

const toVerificationStatus = (
  value: string | null | undefined,
): PublicDirectoryVerificationStatus | null => {
  if (value === 'pending') return 'pending'
  if (value === 'verified') return 'verified'
  if (value === 'unverified') return 'unverified'
  return null
}

const toSort = (value: string | undefined): PublicEditorialSort => {
  if (value === 'recent') return 'recent'
  if (value === 'name') return 'name'
  return 'featured'
}

const normalizePagination = (
  pagination?: Partial<PublicEditorialPagination>,
): PublicEditorialPagination => ({
  page: pagination?.page && pagination.page > 0 ? pagination.page : DEFAULT_PAGE,
  limit: pagination?.limit && pagination.limit > 0 ? pagination.limit : DEFAULT_LIMIT,
  total: pagination?.total && pagination.total >= 0 ? pagination.total : 0,
  pages: pagination?.pages && pagination.pages > 0 ? pagination.pages : 1,
})

const cleanOptionalText = (value: string | undefined): string | undefined => {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

const cleanOptionalStringArray = (values?: string[]): string[] | undefined => {
  if (!Array.isArray(values)) return undefined
  const normalized = values
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
  return normalized.length > 0 ? normalized : undefined
}

const mapEntry = (item: BackendPublicEditorialEntry): PublicEditorialEntry | null => {
  const id = resolveId(item)
  if (!id) return null
  if (typeof item.name !== 'string' || item.name.length === 0) return null
  if (typeof item.slug !== 'string' || item.slug.length === 0) return null
  if (typeof item.shortDescription !== 'string' || item.shortDescription.length === 0) return null

  return {
    id,
    name: item.name,
    slug: item.slug,
    verticalType: toVertical(item.verticalType),
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
    verificationStatus: toVerificationStatus(item.verificationStatus) ?? 'unverified',
    isFeatured: Boolean(item.isFeatured),
    updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : null,
  }
}

const buildParams = (
  query: PublicEditorialListQuery,
): Record<string, string | number | boolean> => {
  const params: Record<string, string | number | boolean> = {}

  const search = cleanOptionalText(query.search)
  if (search) params.search = search
  const country = cleanOptionalText(query.country)
  if (country) params.country = country
  const region = cleanOptionalText(query.region)
  if (region) params.region = region

  const categories = cleanOptionalStringArray(query.categories)
  if (categories) params.categories = categories.join(',')
  const tags = cleanOptionalStringArray(query.tags)
  if (tags) params.tags = tags.join(',')

  if (typeof query.featured === 'boolean') params.featured = query.featured
  if (query.verificationStatus) params.verificationStatus = query.verificationStatus
  if (query.sort) params.sort = query.sort
  if (typeof query.page === 'number' && query.page > 0) params.page = query.page
  if (typeof query.limit === 'number' && query.limit > 0) params.limit = query.limit

  return params
}

const mapFilters = (
  filters?: BackendPublicEditorialFilters,
  fallbackSort?: PublicEditorialSort,
): PublicEditorialFilters => ({
  search: typeof filters?.search === 'string' ? filters.search : null,
  country: typeof filters?.country === 'string' ? filters.country : null,
  region: typeof filters?.region === 'string' ? filters.region : null,
  categories: Array.isArray(filters?.categories)
    ? filters.categories.filter((value): value is string => typeof value === 'string')
    : [],
  tags: Array.isArray(filters?.tags)
    ? filters.tags.filter((value): value is string => typeof value === 'string')
    : [],
  featured: typeof filters?.featured === 'boolean' ? filters.featured : null,
  verificationStatus: toVerificationStatus(filters?.verificationStatus),
  sort: typeof filters?.sort === 'string' ? toSort(filters.sort) : fallbackSort || DEFAULT_SORT,
})

const fetchVertical = async (
  vertical: PublicDirectoryVertical,
  query: PublicEditorialListQuery,
  mode: PublicEditorialMode,
): Promise<PublicEditorialListResponse> => {
  const path = mode === 'show-all' ? `/editorial/${vertical}/show-all` : `/editorial/${vertical}`
  const response = await apiClient.get<BackendPublicEditorialResponse>(path, {
    params: buildParams(query),
  })

  const backend = response.data ?? {}
  const items = (backend.items ?? [])
    .map(mapEntry)
    .filter((item): item is PublicEditorialEntry => item !== null)
  const fallbackSort = query.sort ?? DEFAULT_SORT

  return {
    vertical: toVertical(backend.vertical),
    mode: backend.mode === 'show-all' ? 'show-all' : 'landing',
    filters: mapFilters(backend.filters, fallbackSort),
    items,
    pagination: normalizePagination(backend.pagination),
  }
}

export const editorialPublicApi = {
  getLanding: async (
    vertical: PublicDirectoryVertical,
    query: PublicEditorialListQuery = {},
  ): Promise<PublicEditorialListResponse> => fetchVertical(vertical, query, 'landing'),
  getShowAll: async (
    vertical: PublicDirectoryVertical,
    query: PublicEditorialListQuery = {},
  ): Promise<PublicEditorialListResponse> => fetchVertical(vertical, query, 'show-all'),
}
