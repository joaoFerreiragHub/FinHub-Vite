import { apiClient } from '@/lib/api/client'

export type ExploreSortBy = 'recent' | 'popular' | 'rating' | 'views'
export type ExploreContentKind =
  | 'articles'
  | 'videos'
  | 'courses'
  | 'events'
  | 'podcasts'
  | 'books'

type ExploreContentType = 'article' | 'video' | 'course' | 'event' | 'podcast' | 'book'

export interface ExploreFilters {
  search?: string
  sortBy?: ExploreSortBy
  limit?: number
  offset?: number
}

export interface ExploreFeedFilters extends ExploreFilters {
  perTypeLimit?: number
}

interface BackendListResponse {
  items?: unknown[]
  data?: unknown[]
  articles?: unknown[]
  videos?: unknown[]
  courses?: unknown[]
  lives?: unknown[]
  podcasts?: unknown[]
  books?: unknown[]
}

interface BackendCreatorSummary {
  name?: string
  username?: string
}

interface BackendContentRow {
  _id?: string
  id?: string
  slug?: string
  title?: string
  description?: string
  excerpt?: string
  summary?: string
  coverImage?: string
  imageUrl?: string
  category?: string
  averageRating?: number
  ratingCount?: number
  ratingsCount?: number
  rating?: {
    average?: number
    count?: number
  }
  views?: number
  viewCount?: number
  createdAt?: string
  publishedAt?: string
  isPremium?: boolean
  creator?: string | BackendCreatorSummary
  author?: string
}

interface ExploreKindConfig {
  endpoint: string
  responseKey: keyof BackendListResponse
  type: ExploreContentType
  label: string
  listPath: string
  detailPrefix: string
}

const EXPLORE_KIND_CONFIG: Record<ExploreContentKind, ExploreKindConfig> = {
  articles: {
    endpoint: '/articles',
    responseKey: 'articles',
    type: 'article',
    label: 'Artigos',
    listPath: '/explorar/artigos',
    detailPrefix: '/artigos',
  },
  videos: {
    endpoint: '/videos',
    responseKey: 'videos',
    type: 'video',
    label: 'Videos',
    listPath: '/explorar/videos',
    detailPrefix: '/videos',
  },
  courses: {
    endpoint: '/courses',
    responseKey: 'courses',
    type: 'course',
    label: 'Cursos',
    listPath: '/explorar/cursos',
    detailPrefix: '/cursos',
  },
  events: {
    endpoint: '/lives',
    responseKey: 'lives',
    type: 'event',
    label: 'Eventos',
    listPath: '/explorar/eventos',
    detailPrefix: '/eventos',
  },
  podcasts: {
    endpoint: '/podcasts',
    responseKey: 'podcasts',
    type: 'podcast',
    label: 'Podcasts',
    listPath: '/explorar/podcasts',
    detailPrefix: '/podcasts',
  },
  books: {
    endpoint: '/books',
    responseKey: 'books',
    type: 'book',
    label: 'Livros',
    listPath: '/explorar/livros',
    detailPrefix: '/livros',
  },
}

export const EXPLORE_KINDS = Object.keys(EXPLORE_KIND_CONFIG) as ExploreContentKind[]

export interface ExploreContentItem {
  id: string
  slug: string
  kind: ExploreContentKind
  type: ExploreContentType
  title: string
  description: string
  category: string
  coverImage?: string
  averageRating: number
  ratingCount: number
  viewCount: number
  authorName: string
  createdAt?: string
  publishedAt?: string
  isPremium: boolean
  href: string
}

export interface ExploreFeedResult {
  items: ExploreContentItem[]
  byKind: Record<ExploreContentKind, ExploreContentItem[]>
  hasErrors: boolean
}

const DEFAULT_SORT: ExploreSortBy = 'recent'
const DEFAULT_LIMIT_BY_KIND = 24
const DEFAULT_PER_TYPE_LIMIT = 8

const parseNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return fallback
}

const parseString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

const normalizeItems = (payload: unknown, responseKey: keyof BackendListResponse): unknown[] => {
  if (Array.isArray(payload)) return payload

  const row = payload as BackendListResponse | null
  if (!row) return []
  if (Array.isArray(row.items)) return row.items
  if (Array.isArray(row.data)) return row.data
  if (Array.isArray(row[responseKey])) return row[responseKey] as unknown[]
  return []
}

const normalizeCategory = (value?: string): string => {
  if (!value || value.trim().length === 0) return 'geral'
  return value
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

const resolveAuthorName = (row: BackendContentRow): string => {
  if (row.author && row.author.trim().length > 0) return row.author.trim()

  if (!row.creator || typeof row.creator === 'string') return 'FinHub'

  const creatorName = row.creator.name?.trim()
  if (creatorName) return creatorName

  const username = row.creator.username?.trim()
  if (username) return username

  return 'FinHub'
}

const resolveScore = (item: ExploreContentItem, sortBy: ExploreSortBy): number => {
  if (sortBy === 'rating') return item.averageRating
  if (sortBy === 'views' || sortBy === 'popular') return item.viewCount
  const date = item.publishedAt || item.createdAt
  return date ? Date.parse(date) || 0 : 0
}

const sortItems = (items: ExploreContentItem[], sortBy: ExploreSortBy): ExploreContentItem[] =>
  [...items].sort((a, b) => {
    const score = resolveScore(b, sortBy) - resolveScore(a, sortBy)
    if (score !== 0) return score
    return (Date.parse(b.createdAt || '') || 0) - (Date.parse(a.createdAt || '') || 0)
  })

const toExploreContentItem = (
  row: BackendContentRow,
  kind: ExploreContentKind,
  config: ExploreKindConfig,
): ExploreContentItem | null => {
  const id = parseString(row.id) || parseString(row._id)
  const slug = parseString(row.slug) || id
  if (!slug) return null

  const ratingNode = row.rating
  const ratingAverage =
    parseNumber(row.averageRating, Number.NaN) ||
    parseNumber(ratingNode?.average, Number.NaN) ||
    0
  const ratingCount =
    parseNumber(row.ratingCount, Number.NaN) ||
    parseNumber(row.ratingsCount, Number.NaN) ||
    parseNumber(ratingNode?.count, 0)

  return {
    id: id || slug,
    slug,
    kind,
    type: config.type,
    title: parseString(row.title, 'Sem titulo'),
    description: parseString(row.description || row.excerpt || row.summary, 'Sem descricao'),
    category: normalizeCategory(row.category),
    coverImage: parseString(row.coverImage || row.imageUrl) || undefined,
    averageRating: Number.isFinite(ratingAverage) ? ratingAverage : 0,
    ratingCount,
    viewCount: parseNumber(row.viewCount, parseNumber(row.views, 0)),
    authorName: resolveAuthorName(row),
    createdAt: parseString(row.createdAt) || undefined,
    publishedAt: parseString(row.publishedAt) || undefined,
    isPremium: Boolean(row.isPremium),
    href: `${config.detailPrefix}/${encodeURIComponent(slug)}`,
  }
}

const normalizeKindResult = (
  payload: unknown,
  kind: ExploreContentKind,
  config: ExploreKindConfig,
): ExploreContentItem[] =>
  normalizeItems(payload, config.responseKey)
    .map((entry) => toExploreContentItem(entry as BackendContentRow, kind, config))
    .filter((item): item is ExploreContentItem => item !== null)

const toQueryParams = (filters: ExploreFilters = {}) => ({
  status: 'published',
  search: filters.search?.trim() || undefined,
  sortBy: filters.sortBy || DEFAULT_SORT,
  limit: filters.limit ?? DEFAULT_LIMIT_BY_KIND,
  offset: filters.offset ?? 0,
})

export async function fetchExploreByKind(
  kind: ExploreContentKind,
  filters: ExploreFilters = {},
): Promise<ExploreContentItem[]> {
  const config = EXPLORE_KIND_CONFIG[kind]
  const response = await apiClient.get<unknown>(config.endpoint, {
    params: toQueryParams(filters),
  })

  const sortBy = filters.sortBy || DEFAULT_SORT
  const items = normalizeKindResult(response.data, kind, config)
  return sortItems(items, sortBy)
}

export async function fetchExploreFeed(
  filters: ExploreFeedFilters = {},
): Promise<ExploreFeedResult> {
  const sortBy = filters.sortBy || DEFAULT_SORT
  const kindFilters: ExploreFilters = {
    ...filters,
    limit: filters.perTypeLimit ?? DEFAULT_PER_TYPE_LIMIT,
  }

  const byKind: Record<ExploreContentKind, ExploreContentItem[]> = {
    articles: [],
    videos: [],
    courses: [],
    events: [],
    podcasts: [],
    books: [],
  }

  const rows = await Promise.allSettled(
    EXPLORE_KINDS.map(async (kind) => {
      const items = await fetchExploreByKind(kind, kindFilters)
      return { kind, items }
    }),
  )

  let hasErrors = false
  rows.forEach((entry) => {
    if (entry.status === 'fulfilled') {
      byKind[entry.value.kind] = entry.value.items
    } else {
      hasErrors = true
    }
  })

  const merged = sortItems(EXPLORE_KINDS.flatMap((kind) => byKind[kind]), sortBy)

  return {
    items: merged,
    byKind,
    hasErrors,
  }
}

export const getExploreKindMeta = (kind: ExploreContentKind) => ({
  label: EXPLORE_KIND_CONFIG[kind].label,
  listPath: EXPLORE_KIND_CONFIG[kind].listPath,
})
