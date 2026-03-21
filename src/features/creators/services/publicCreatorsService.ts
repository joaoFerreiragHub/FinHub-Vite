import { apiClient } from '@/lib/api/client'
import type { Creator, CreatorFull, SocialMediaLink } from '@/features/creators/types/creator'

interface BackendCreatorSocialLinks {
  website?: string | null
  twitter?: string | null
  linkedin?: string | null
  instagram?: string | null
}

interface BackendCreatorRating {
  average?: number
  count?: number
}

interface BackendPublicCreator {
  id: string
  name: string
  username: string
  avatar?: string | null
  welcomeVideoUrl?: string | null
  bio?: string | null
  socialLinks?: BackendCreatorSocialLinks | null
  followers?: number
  following?: number
  emailVerified?: boolean
  rating?: BackendCreatorRating
  createdAt?: string
  lastActiveAt?: string | null
  contentTypes?: unknown
  typeOfContent?: unknown
  publicationsCount?: unknown
  publicationCount?: unknown
  contentCount?: unknown
  totalPublications?: unknown
}

interface BackendPagination {
  page?: number
  limit?: number
  total?: number
  pages?: number
}

interface BackendPublicCreatorsListResponse {
  items?: BackendPublicCreator[]
  pagination?: BackendPagination
}

interface BackendPublicCreatorProfileResponse {
  creator?: BackendPublicCreator
}

interface BackendContentCreator {
  id?: string
  _id?: string
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
  thumbnail?: string
  creator?: string | BackendContentCreator
  creatorId?: string
  createdAt?: string
  publishedAt?: string
}

interface BackendCreatorContentListResponse {
  pagination?: BackendPagination
  items?: BackendContentRow[]
  data?: BackendContentRow[]
  articles?: BackendContentRow[]
  videos?: BackendContentRow[]
  courses?: BackendContentRow[]
  podcasts?: BackendContentRow[]
  books?: BackendContentRow[]
}

type CreatorContentArrayKey = 'articles' | 'videos' | 'courses' | 'podcasts' | 'books'
type CreatorContentType = 'article' | 'video' | 'course' | 'podcast' | 'book'
type CreatorContentTypeFilter = 'todos' | 'artigos' | 'videos' | 'cursos' | 'podcasts' | 'livros'

interface CreatorContentConfig {
  endpoint: string
  arrayKey: CreatorContentArrayKey
  hrefPrefix: string
  label: string
}

const CONTENT_CONFIG: Record<CreatorContentType, CreatorContentConfig> = {
  article: {
    endpoint: '/articles',
    arrayKey: 'articles',
    hrefPrefix: '/hub/articles',
    label: 'Artigos',
  },
  video: {
    endpoint: '/videos',
    arrayKey: 'videos',
    hrefPrefix: '/hub/videos',
    label: 'Videos',
  },
  course: {
    endpoint: '/courses',
    arrayKey: 'courses',
    hrefPrefix: '/hub/courses',
    label: 'Cursos',
  },
  podcast: {
    endpoint: '/podcasts',
    arrayKey: 'podcasts',
    hrefPrefix: '/hub/podcasts',
    label: 'Podcasts',
  },
  book: {
    endpoint: '/books',
    arrayKey: 'books',
    hrefPrefix: '/hub/books',
    label: 'Livros',
  },
}

const ALL_CONTENT_TYPES: CreatorContentType[] = ['article', 'video', 'course', 'podcast', 'book']
const CONTENT_TYPE_TOPIC_LABEL: Record<CreatorContentType, string> = {
  article: 'Artigos',
  video: 'Videos',
  course: 'Cursos',
  podcast: 'Podcasts',
  book: 'Livros',
}

const toString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

const toNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const toRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : {}

const toArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : [])

const splitDisplayName = (name: string, fallbackUsername: string) => {
  const trimmed = name.trim()
  if (!trimmed) {
    return {
      firstname: fallbackUsername,
      lastname: '',
    }
  }

  const chunks = trimmed.split(/\s+/)
  return {
    firstname: chunks[0] || fallbackUsername,
    lastname: chunks.slice(1).join(' '),
  }
}

const normalizeTypeToken = (raw: string): CreatorContentType | null => {
  const normalized = raw
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  if (!normalized) return null

  if (
    normalized === 'article' ||
    normalized === 'articles' ||
    normalized === 'artigo' ||
    normalized === 'artigos'
  ) {
    return 'article'
  }

  if (
    normalized === 'video' ||
    normalized === 'videos' ||
    normalized === 'reel' ||
    normalized === 'reels' ||
    normalized === 'short' ||
    normalized === 'shorts'
  ) {
    return 'video'
  }

  if (
    normalized === 'course' ||
    normalized === 'courses' ||
    normalized === 'curso' ||
    normalized === 'cursos'
  ) {
    return 'course'
  }

  if (normalized === 'podcast' || normalized === 'podcasts') {
    return 'podcast'
  }

  if (
    normalized === 'book' ||
    normalized === 'books' ||
    normalized === 'livro' ||
    normalized === 'livros'
  ) {
    return 'book'
  }

  return null
}

const parseCreatorContentTypes = (row: BackendPublicCreator): CreatorContentType[] => {
  const values: string[] = []

  toArray(row.contentTypes).forEach((item) => {
    const token = toString(item).trim()
    if (token) values.push(token)
  })

  const typeOfContent = toString(row.typeOfContent)
  if (typeOfContent) {
    typeOfContent
      .split(/[|,/]/)
      .map((token) => token.trim())
      .filter(Boolean)
      .forEach((token) => values.push(token))
  }

  const normalized = values
    .map(normalizeTypeToken)
    .filter((value): value is CreatorContentType => value !== null)

  return Array.from(new Set(normalized))
}

const toCreatorTopics = (contentTypes: CreatorContentType[]): string[] => {
  if (contentTypes.length === 0) return ['Conteudo']
  return contentTypes.map((type) => CONTENT_TYPE_TOPIC_LABEL[type])
}

const resolvePublicationsCount = (row: BackendPublicCreator): number | null => {
  const candidates: unknown[] = [
    row.publicationsCount,
    row.publicationCount,
    row.contentCount,
    row.totalPublications,
  ]

  for (const candidate of candidates) {
    const parsed = Number(candidate)
    if (Number.isFinite(parsed) && parsed >= 0) {
      return Math.floor(parsed)
    }
  }

  const contentStats = toRecord((row as Record<string, unknown>).contentStats)
  const statsCandidates: unknown[] = [
    contentStats.total,
    contentStats.count,
    contentStats.publications,
    contentStats.totalPublications,
  ]

  for (const candidate of statsCandidates) {
    const parsed = Number(candidate)
    if (Number.isFinite(parsed) && parsed >= 0) {
      return Math.floor(parsed)
    }
  }

  return null
}

const toSocialMediaLinks = (links?: BackendCreatorSocialLinks | null): SocialMediaLink[] => {
  if (!links) return []

  const rows: SocialMediaLink[] = []
  if (links.website) rows.push({ platform: 'website', url: links.website })
  if (links.twitter) rows.push({ platform: 'Twitter', url: links.twitter })
  if (links.linkedin) rows.push({ platform: 'LinkedIn', url: links.linkedin })
  if (links.instagram) rows.push({ platform: 'Instagram', url: links.instagram })
  return rows
}

const toBaseCreator = (row: BackendPublicCreator): Creator => {
  const { firstname, lastname } = splitDisplayName(row.name || '', row.username)
  const followersCount = Number(row.followers ?? 0)
  const contentTypes = parseCreatorContentTypes(row)
  const welcomeVideoUrl =
    typeof row.welcomeVideoUrl === 'string' && row.welcomeVideoUrl.trim().length > 0
      ? row.welcomeVideoUrl.trim()
      : undefined

  return {
    _id: row.id,
    username: row.username,
    email: `${row.username}@finhub.local`,
    firstname,
    lastname,
    profilePictureUrl: row.avatar || undefined,
    role: 'creator',
    isPremium: false,
    topics: toCreatorTopics(contentTypes),
    termsAccepted: true,
    termsOfServiceAgreement: true,
    contentLicenseAgreement: true,
    paymentTermsAgreement: true,
    bio: row.bio || undefined,
    socialMediaLinks: toSocialMediaLinks(row.socialLinks),
    followersCount,
    followers: [],
    famous: [],
    content: [],
    averageRating: Number(row.rating?.average ?? 0),
    welcomeVideo: welcomeVideoUrl ? [welcomeVideoUrl] : undefined,
    courses: [],
    createdAt: row.createdAt,
    updatedAt: row.lastActiveAt || row.createdAt,
  }
}

const resolveName = (row: BackendPublicCreator): string => {
  if (row.name && row.name.trim().length > 0) {
    return row.name.trim()
  }
  return row.username
}

const normalizeContentRows = (
  payload: BackendCreatorContentListResponse,
  key: CreatorContentArrayKey,
): BackendContentRow[] => {
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

const resolveContentDescription = (row: BackendContentRow): string =>
  toString(row.description || row.excerpt || row.summary, 'Sem descricao disponivel')

const mapContentItem = (
  row: BackendContentRow,
  type: CreatorContentType,
): PublicCreatorContentItem | null => {
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
    title: toString(row.title, 'Sem titulo'),
    description: resolveContentDescription(row),
    coverImage: toString(row.coverImage || row.imageUrl || row.thumbnail) || undefined,
    publishedAt: toString(row.publishedAt) || undefined,
    createdAt: toString(row.createdAt) || undefined,
    href: `${config.hrefPrefix}/${encodeURIComponent(slug)}`,
  }
}

const mapContentTypeFilterToType = (value: CreatorContentTypeFilter): CreatorContentType | null => {
  if (value === 'artigos') return 'article'
  if (value === 'videos') return 'video'
  if (value === 'cursos') return 'course'
  if (value === 'podcasts') return 'podcast'
  if (value === 'livros') return 'book'
  return null
}

export interface PublicCreatorsListFilters {
  search?: string
  minRating?: number
  sortBy?: 'followers' | 'rating' | 'newest' | 'recent'
  sortOrder?: 'asc' | 'desc'
  limit?: number
  page?: number
  minFollowers?: number
  emailVerified?: boolean
}

export interface PublicCreatorsPagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface PublicCreatorListItem {
  id: string
  username: string
  name: string
  avatar?: string
  welcomeVideoUrl?: string
  bio?: string
  socialLinks?: BackendCreatorSocialLinks
  followersCount: number
  followingCount: number
  ratingAverage: number
  ratingCount: number
  publicationsCount: number | null
  contentTypes: CreatorContentType[]
  createdAt?: string
  lastActiveAt?: string
}

export interface PublicCreatorsPageResponse {
  items: PublicCreatorListItem[]
  pagination: PublicCreatorsPagination
}

export interface PublicCreatorProfile {
  id: string
  username: string
  name: string
  avatar?: string
  welcomeVideoUrl?: string
  bio?: string
  socialLinks?: BackendCreatorSocialLinks
  followersCount: number
  followingCount: number
  ratingAverage: number
  ratingCount: number
  createdAt?: string
  lastActiveAt?: string
}

export type PublicCreatorContentType = CreatorContentType

export interface PublicCreatorContentItem {
  id: string
  slug: string
  type: PublicCreatorContentType
  title: string
  description: string
  coverImage?: string
  publishedAt?: string
  createdAt?: string
  href: string
}

export interface PublicCreatorContentResponse {
  type: PublicCreatorContentType
  label: string
  total: number
  items: PublicCreatorContentItem[]
}

export interface PublicCreatorPublicationStats {
  article: number
  video: number
  course: number
  podcast: number
  book: number
  total: number
}

export async function fetchPublicCreators(
  filters: PublicCreatorsListFilters = {},
): Promise<Creator[]> {
  const response = await apiClient.get<BackendPublicCreatorsListResponse>('/creators', {
    params: {
      search: filters.search?.trim() || undefined,
      minRating: typeof filters.minRating === 'number' ? filters.minRating : undefined,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      limit: filters.limit,
    },
  })

  const rows = Array.isArray(response.data?.items) ? response.data.items : []
  return rows.map(toBaseCreator)
}

export async function fetchPublicCreatorsPage(
  filters: PublicCreatorsListFilters = {},
): Promise<PublicCreatorsPageResponse> {
  const response = await apiClient.get<BackendPublicCreatorsListResponse>('/creators', {
    params: {
      page: filters.page,
      limit: filters.limit,
      search: filters.search?.trim() || undefined,
      minRating: typeof filters.minRating === 'number' ? filters.minRating : undefined,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      minFollowers: typeof filters.minFollowers === 'number' ? filters.minFollowers : undefined,
      emailVerified:
        typeof filters.emailVerified === 'boolean' ? String(filters.emailVerified) : undefined,
    },
  })

  const rows = Array.isArray(response.data?.items) ? response.data.items : []
  const items: PublicCreatorListItem[] = rows.map((row) => ({
    id: row.id,
    username: row.username,
    name: resolveName(row),
    avatar: row.avatar || undefined,
    welcomeVideoUrl: row.welcomeVideoUrl || undefined,
    bio: row.bio || undefined,
    socialLinks: row.socialLinks || undefined,
    followersCount: toNumber(row.followers, 0),
    followingCount: toNumber(row.following, 0),
    ratingAverage: toNumber(row.rating?.average, 0),
    ratingCount: toNumber(row.rating?.count, 0),
    publicationsCount: resolvePublicationsCount(row),
    contentTypes: parseCreatorContentTypes(row),
    createdAt: row.createdAt || undefined,
    lastActiveAt: row.lastActiveAt || undefined,
  }))

  const limit = toNumber(response.data?.pagination?.limit, filters.limit ?? 20)
  const total = toNumber(response.data?.pagination?.total, items.length)
  const pages = toNumber(
    response.data?.pagination?.pages,
    Math.max(1, Math.ceil(total / Math.max(limit, 1))),
  )
  const page = toNumber(response.data?.pagination?.page, filters.page ?? 1)

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

export const mapPublicCreatorListItemToCreator = (creator: PublicCreatorListItem): Creator => {
  return toBaseCreator({
    id: creator.id,
    name: creator.name,
    username: creator.username,
    avatar: creator.avatar || null,
    welcomeVideoUrl: creator.welcomeVideoUrl || null,
    bio: creator.bio || null,
    socialLinks: creator.socialLinks || null,
    followers: creator.followersCount,
    following: creator.followingCount,
    rating: {
      average: creator.ratingAverage,
      count: creator.ratingCount,
    },
    contentTypes: creator.contentTypes,
    publicationsCount: creator.publicationsCount ?? undefined,
    createdAt: creator.createdAt,
    lastActiveAt: creator.lastActiveAt || null,
  })
}

export async function fetchPublicCreatorByUsername(
  username: string,
): Promise<PublicCreatorProfile | null> {
  const normalized = username.trim().toLowerCase()
  if (!normalized) return null

  try {
    const response = await apiClient.get<BackendPublicCreatorProfileResponse>(
      `/creators/${encodeURIComponent(normalized)}`,
    )
    const creator = response.data?.creator
    if (!creator) return null

    return {
      id: creator.id,
      username: creator.username,
      name: resolveName(creator),
      avatar: creator.avatar || undefined,
      welcomeVideoUrl: creator.welcomeVideoUrl || undefined,
      bio: creator.bio || undefined,
      socialLinks: creator.socialLinks || undefined,
      followersCount: toNumber(creator.followers, 0),
      followingCount: toNumber(creator.following, 0),
      ratingAverage: toNumber(creator.rating?.average, 0),
      ratingCount: toNumber(creator.rating?.count, 0),
      createdAt: creator.createdAt || undefined,
      lastActiveAt: creator.lastActiveAt || undefined,
    }
  } catch {
    return null
  }
}

export async function fetchPublicCreatorProfile(username: string): Promise<CreatorFull | null> {
  const profile = await fetchPublicCreatorByUsername(username)
  if (!profile) {
    return null
  }

  const creator = toBaseCreator({
    id: profile.id,
    name: profile.name,
    username: profile.username,
    avatar: profile.avatar || null,
    welcomeVideoUrl: profile.welcomeVideoUrl || null,
    bio: profile.bio || null,
    socialLinks: profile.socialLinks || null,
    followers: profile.followersCount,
    following: profile.followingCount,
    rating: {
      average: profile.ratingAverage,
      count: profile.ratingCount,
    },
    createdAt: profile.createdAt,
    lastActiveAt: profile.lastActiveAt || null,
  })

  return {
    ...creator,
    fullPlaylists: [],
    announcementsResolved: [],
    articlesResolved: [],
    eventsResolved: [],
    documentsResolved: [],
    coursesResolved: [],
    contentVisibility: {
      announcements: true,
      courses: true,
      articles: true,
      events: true,
      files: true,
      playlists: {
        regular: true,
        shorts: true,
        podcast: true,
        featured: true,
      },
      welcomeVideo: Boolean(profile.welcomeVideoUrl),
    },
  }
}

export async function fetchCreatorContentByType(
  creatorId: string,
  type: PublicCreatorContentType,
  limit = 6,
): Promise<PublicCreatorContentResponse> {
  const normalizedCreatorId = creatorId.trim()
  if (!normalizedCreatorId) {
    return {
      type,
      label: CONTENT_CONFIG[type].label,
      total: 0,
      items: [],
    }
  }

  const config = CONTENT_CONFIG[type]
  const response = await apiClient.get<BackendCreatorContentListResponse>(config.endpoint, {
    params: {
      creatorId: normalizedCreatorId,
      creator: normalizedCreatorId,
      page: 1,
      limit,
      sort: 'recent',
    },
  })

  const payload = response.data || {}
  const rows = normalizeContentRows(payload, config.arrayKey)
  const items = rows
    .map((row) => mapContentItem(row, type))
    .filter((row): row is PublicCreatorContentItem => row !== null)

  const total = toNumber(payload.pagination?.total, items.length)

  return {
    type,
    label: config.label,
    total,
    items,
  }
}

export async function fetchCreatorPublicationStats(
  creatorId: string,
): Promise<PublicCreatorPublicationStats> {
  const results = await Promise.all(
    ALL_CONTENT_TYPES.map(async (type) => {
      try {
        const response = await fetchCreatorContentByType(creatorId, type, 1)
        return [type, response.total] as const
      } catch {
        return [type, 0] as const
      }
    }),
  )

  const article = results.find(([type]) => type === 'article')?.[1] ?? 0
  const video = results.find(([type]) => type === 'video')?.[1] ?? 0
  const course = results.find(([type]) => type === 'course')?.[1] ?? 0
  const podcast = results.find(([type]) => type === 'podcast')?.[1] ?? 0
  const book = results.find(([type]) => type === 'book')?.[1] ?? 0

  return {
    article,
    video,
    course,
    podcast,
    book,
    total: article + video + course + podcast + book,
  }
}

export async function fetchIsFollowingCreator(creatorId: string): Promise<boolean> {
  const normalizedCreatorId = creatorId.trim()
  if (!normalizedCreatorId) return false

  try {
    const response = await apiClient.get<{ isFollowing?: boolean }>(
      `/follow/check/${encodeURIComponent(normalizedCreatorId)}`,
    )
    return Boolean(response.data?.isFollowing)
  } catch {
    return false
  }
}

export async function followCreatorById(creatorId: string): Promise<void> {
  await apiClient.post(`/follow/${encodeURIComponent(creatorId)}`)
}

export async function unfollowCreatorById(creatorId: string): Promise<void> {
  await apiClient.delete(`/follow/${encodeURIComponent(creatorId)}`)
}

export const PUBLIC_CREATOR_CONTENT_FILTER_OPTIONS: Array<{
  label: string
  value: CreatorContentTypeFilter
}> = [
  { label: 'Todos', value: 'todos' },
  { label: 'Artigos', value: 'artigos' },
  { label: 'Videos', value: 'videos' },
  { label: 'Cursos', value: 'cursos' },
  { label: 'Podcasts', value: 'podcasts' },
  { label: 'Livros', value: 'livros' },
]

export const mapCreatorFilterToContentType = mapContentTypeFilterToType
