import { apiClient } from '@/lib/api/client'

export type ExploreContentTypeFilter =
  | 'todos'
  | 'artigos'
  | 'videos'
  | 'cursos'
  | 'podcasts'
  | 'livros'

export type ExploreSortOption = 'recent' | 'popular' | 'rating' | 'views'

export interface ExploreTypeOption {
  label: string
  value: ExploreContentTypeFilter
}

export interface ExploreHubItem {
  id: string
  slug: string
  type: Exclude<ExploreContentTypeFilter, 'todos'>
  typeLabel: string
  title: string
  description: string
  coverImage?: string
  authorName: string
  averageRating: number
  views: number
  publishedAt?: string
  createdAt?: string
  href: string
}

export interface ExploreHubPagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface ExploreHubResponse {
  items: ExploreHubItem[]
  pagination: ExploreHubPagination
}

interface ExploreHubQueryOptions {
  type: ExploreContentTypeFilter
  page: number
  limit: number
  sort: ExploreSortOption
}

interface BackendPagination {
  page?: number
  limit?: number
  total?: number
  pages?: number
}

interface BackendCreator {
  name?: string
  username?: string
}

interface BackendRating {
  average?: number
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
  creator?: string | BackendCreator
  author?: string
  averageRating?: number
  rating?: BackendRating
  views?: number
  viewCount?: number
  publishedAt?: string
  createdAt?: string
}

interface BackendListResponse {
  pagination?: BackendPagination
  items?: BackendContentRow[]
  data?: BackendContentRow[]
  articles?: BackendContentRow[]
  videos?: BackendContentRow[]
  courses?: BackendContentRow[]
  podcasts?: BackendContentRow[]
  books?: BackendContentRow[]
}

type ContentEndpointType = Exclude<ExploreContentTypeFilter, 'todos'>
type ContentArrayKey = 'articles' | 'videos' | 'courses' | 'podcasts' | 'books'

interface ContentConfig {
  endpoint: string
  arrayKey: ContentArrayKey
  label: string
  hrefPrefix: string
}

interface ExploreTypeBatch {
  items: ExploreHubItem[]
  pagination: ExploreHubPagination
}

const CONTENT_CONFIG: Record<ContentEndpointType, ContentConfig> = {
  artigos: {
    endpoint: '/articles',
    arrayKey: 'articles',
    label: 'Artigos',
    hrefPrefix: '/hub/articles',
  },
  videos: {
    endpoint: '/videos',
    arrayKey: 'videos',
    label: 'Videos',
    hrefPrefix: '/hub/videos',
  },
  cursos: {
    endpoint: '/courses',
    arrayKey: 'courses',
    label: 'Cursos',
    hrefPrefix: '/hub/courses',
  },
  podcasts: {
    endpoint: '/podcasts',
    arrayKey: 'podcasts',
    label: 'Podcasts',
    hrefPrefix: '/hub/podcasts',
  },
  livros: {
    endpoint: '/books',
    arrayKey: 'books',
    label: 'Livros',
    hrefPrefix: '/hub/books',
  },
}

const CONTENT_TYPES: ContentEndpointType[] = ['artigos', 'videos', 'cursos', 'podcasts', 'livros']

export const EXPLORE_TYPE_OPTIONS: ExploreTypeOption[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Artigos', value: 'artigos' },
  { label: 'Videos', value: 'videos' },
  { label: 'Cursos', value: 'cursos' },
  { label: 'Podcasts', value: 'podcasts' },
  { label: 'Livros', value: 'livros' },
]

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const toNumber = (value: unknown, fallback = 0): number => {
  if (isFiniteNumber(value)) return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return fallback
}

const toString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

const resolveAuthorName = (row: BackendContentRow): string => {
  if (row.author && row.author.trim().length > 0) {
    return row.author.trim()
  }

  if (!row.creator || typeof row.creator === 'string') {
    return 'FinHub'
  }

  if (row.creator.name && row.creator.name.trim().length > 0) {
    return row.creator.name.trim()
  }

  if (row.creator.username && row.creator.username.trim().length > 0) {
    return row.creator.username.trim()
  }

  return 'FinHub'
}

const normalizeRows = (payload: BackendListResponse, key: ContentArrayKey): BackendContentRow[] => {
  const directRows = payload[key]
  if (Array.isArray(directRows)) {
    return directRows
  }

  if (Array.isArray(payload.items)) {
    return payload.items
  }

  if (Array.isArray(payload.data)) {
    return payload.data
  }

  return []
}

const normalizePagination = (
  pagination: BackendPagination | undefined,
  page: number,
  limit: number,
  fallbackTotal: number,
): ExploreHubPagination => {
  const total = toNumber(pagination?.total, fallbackTotal)
  const pagesFromPayload = toNumber(pagination?.pages, 0)
  const pages = pagesFromPayload > 0 ? pagesFromPayload : Math.max(1, Math.ceil(total / limit))

  return {
    page: toNumber(pagination?.page, page),
    limit: toNumber(pagination?.limit, limit),
    total,
    pages,
  }
}

const toItem = (row: BackendContentRow, type: ContentEndpointType): ExploreHubItem | null => {
  const config = CONTENT_CONFIG[type]
  const id = toString(row.id) || toString(row._id)
  const slug = toString(row.slug) || id

  if (!slug) {
    return null
  }

  return {
    id: id || slug,
    slug,
    type,
    typeLabel: config.label,
    title: toString(row.title, 'Sem titulo'),
    description: toString(
      row.description || row.excerpt || row.summary,
      'Sem descricao disponivel',
    ),
    coverImage: toString(row.coverImage || row.imageUrl) || undefined,
    authorName: resolveAuthorName(row),
    averageRating: toNumber(row.averageRating, toNumber(row.rating?.average, 0)),
    views: toNumber(row.views, toNumber(row.viewCount, 0)),
    publishedAt: toString(row.publishedAt) || undefined,
    createdAt: toString(row.createdAt) || undefined,
    href: `${config.hrefPrefix}/${encodeURIComponent(slug)}`,
  }
}

const compareByDateDesc = (a: ExploreHubItem, b: ExploreHubItem): number => {
  const aDate = Date.parse(a.publishedAt || a.createdAt || '')
  const bDate = Date.parse(b.publishedAt || b.createdAt || '')
  return (Number.isFinite(bDate) ? bDate : 0) - (Number.isFinite(aDate) ? aDate : 0)
}

const fetchTypeBatch = async (
  type: ContentEndpointType,
  page: number,
  limit: number,
  sort: ExploreSortOption,
): Promise<ExploreTypeBatch> => {
  const config = CONTENT_CONFIG[type]
  const response = await apiClient.get<BackendListResponse>(config.endpoint, {
    params: {
      page,
      limit,
      sort,
    },
  })

  const rows = normalizeRows(response.data || {}, config.arrayKey)
  const items = rows
    .map((row) => toItem(row, type))
    .filter((item): item is ExploreHubItem => item !== null)
  const pagination = normalizePagination(response.data?.pagination, page, limit, items.length)

  return {
    items,
    pagination,
  }
}

export const isExploreContentTypeFilter = (value: string): value is ExploreContentTypeFilter =>
  EXPLORE_TYPE_OPTIONS.some((option) => option.value === value)

export async function fetchExploreHubContent({
  type,
  page,
  limit,
  sort,
}: ExploreHubQueryOptions): Promise<ExploreHubResponse> {
  if (type === 'todos') {
    // Fetching from page 1 with a larger limit gives a stable global ordering by date.
    const aggregateLimit = Math.max(limit, page * limit)
    const batches = await Promise.all(
      CONTENT_TYPES.map((currentType) => fetchTypeBatch(currentType, 1, aggregateLimit, sort)),
    )

    const mergedItems = batches.flatMap((batch) => batch.items).sort(compareByDateDesc)
    const total = batches.reduce((sum, batch) => sum + batch.pagination.total, 0)
    const pages = Math.max(1, Math.ceil(total / limit))
    const start = (page - 1) * limit
    const items = mergedItems.slice(start, start + limit)

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    }
  }

  const batch = await fetchTypeBatch(type, page, limit, sort)

  return {
    items: batch.items,
    pagination: batch.pagination,
  }
}
