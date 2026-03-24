import axios from 'axios'
import { UserRole } from '@/features/auth/types'
import { apiClient } from '@/lib/api/client'

type UnknownRecord = Record<string, unknown>

export interface PublicUserProfile {
  id: string
  name: string
  username: string
  avatar?: string
  bio?: string
  createdAt?: string
  role: UserRole | string
  favoriteArticlesCount: number
  followingCreatorsCount: number
  totalXp: number
  level: number
  levelName: string
  badges: Array<{ id: string; unlockedAt: string }>
}

const toRecord = (value: unknown): UnknownRecord =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as UnknownRecord) : {}

const toString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

const toOptionalString = (value: unknown): string | undefined => {
  const normalized = toString(value).trim()
  return normalized.length > 0 ? normalized : undefined
}

const toNumber = (value: unknown): number | null => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

const pickNumber = (...values: unknown[]): number => {
  for (const value of values) {
    const parsed = toNumber(value)
    if (parsed !== null && parsed >= 0) {
      return Math.floor(parsed)
    }
  }

  return 0
}

const toBadgeArray = (value: unknown): Array<{ id: string; unlockedAt: string }> => {
  if (!Array.isArray(value)) return []

  return value
    .map((entry) => toRecord(entry))
    .map((entry) => ({
      id: toString(entry.id).trim(),
      unlockedAt: toString(entry.unlockedAt).trim(),
    }))
    .filter((entry) => entry.id.length > 0 && entry.unlockedAt.length > 0)
}

const isUserRecord = (candidate: UnknownRecord): boolean => {
  return (
    toString(candidate.username).trim().length > 0 ||
    toString(candidate.id).trim().length > 0 ||
    toString(candidate._id).trim().length > 0
  )
}

const toDisplayName = (row: UnknownRecord): string => {
  const name = toString(row.name).trim()
  if (name) return name

  const firstName = toString(row.firstName || row.firstname).trim()
  const lastName = toString(row.lastName || row.lastname).trim()
  const combined = `${firstName} ${lastName}`.trim()
  if (combined) return combined

  return toString(row.username, 'Utilizador')
}

const toRole = (value: unknown): UserRole | string => {
  const normalized = toString(value).trim().toLowerCase()
  if (Object.values(UserRole).includes(normalized as UserRole)) {
    return normalized as UserRole
  }

  return normalized || UserRole.FREE
}

const extractSingleUser = (payload: unknown): UnknownRecord | null => {
  const root = toRecord(payload)
  if (isUserRecord(root)) {
    return root
  }

  const directCandidates = [root.user, root.profile, root.item, root.result, root.data]
  for (const candidate of directCandidates) {
    const record = toRecord(candidate)
    if (isUserRecord(record)) {
      return record
    }

    const nested = [record.user, record.profile, record.item]
    for (const nestedCandidate of nested) {
      const nestedRecord = toRecord(nestedCandidate)
      if (isUserRecord(nestedRecord)) {
        return nestedRecord
      }
    }
  }

  return null
}

const extractUserCollection = (payload: unknown): UnknownRecord[] => {
  if (Array.isArray(payload)) {
    return payload.map(toRecord).filter((candidate) => Object.keys(candidate).length > 0)
  }

  const root = toRecord(payload)
  const buckets: unknown[] = [root.items, root.users, root.results, root.data]
  const nestedData = toRecord(root.data)
  buckets.push(nestedData.items, nestedData.users, nestedData.results, nestedData.data)

  const rows: UnknownRecord[] = []
  for (const bucket of buckets) {
    if (!Array.isArray(bucket)) continue

    bucket.forEach((row) => {
      const record = toRecord(row)
      if (Object.keys(record).length > 0) {
        rows.push(record)
      }
    })
  }

  return rows
}

const normalizeUsername = (value: string): string => {
  return value.trim().toLowerCase()
}

const safeDecode = (value: string): string => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

const mapToPublicUserProfile = (
  row: UnknownRecord,
  fallbackUsername: string,
): PublicUserProfile => {
  const stats = toRecord(row.stats)
  const favorites = toRecord(row.favorites)
  const following = toRecord(row.following)

  const username = toString(row.username || row.userName).trim() || fallbackUsername
  const id = toString(row.id || row._id).trim() || username

  return {
    id,
    name: toDisplayName(row),
    username,
    avatar: toOptionalString(
      row.avatar || row.profilePicture || row.profileImage || row.photo || row.image,
    ),
    bio: toOptionalString(row.bio || row.description),
    createdAt: toOptionalString(row.createdAt || row.joinedAt || row.registeredAt),
    role: toRole(row.role),
    favoriteArticlesCount: pickNumber(
      row.favoriteArticlesCount,
      row.favoritesCount,
      row.favoriteCount,
      stats.favoriteArticles,
      stats.favorites,
      stats.favoritesCount,
      favorites.articles,
      favorites.total,
    ),
    followingCreatorsCount: pickNumber(
      row.followingCreatorsCount,
      row.followingCount,
      row.following,
      stats.followingCreators,
      stats.following,
      stats.followingCount,
      following.creators,
      following.total,
    ),
    totalXp: pickNumber(row.totalXp, stats.totalXp, row.xp),
    level: Math.max(1, pickNumber(row.level, stats.level, 1)),
    levelName: toString(row.levelName, toString(stats.levelName, 'Novato Financeiro')),
    badges: toBadgeArray(row.badges ?? stats.badges),
  }
}

const isNotFoundError = (error: unknown): boolean =>
  axios.isAxiosError(error) && error.response?.status === 404

async function fetchFromPrimaryEndpoint(username: string): Promise<UnknownRecord | null> {
  try {
    const response = await apiClient.get(`/users/${encodeURIComponent(username)}/public`)
    return extractSingleUser(response.data)
  } catch (error) {
    if (isNotFoundError(error)) {
      return null
    }

    throw error
  }
}

async function fetchFromLegacyProfileEndpoint(username: string): Promise<UnknownRecord | null> {
  try {
    const response = await apiClient.get(`/users/profile/${encodeURIComponent(username)}`)
    return extractSingleUser(response.data)
  } catch (error) {
    if (isNotFoundError(error)) {
      return null
    }

    throw error
  }
}

async function fetchFromSearchEndpoint(username: string): Promise<UnknownRecord | null> {
  try {
    const response = await apiClient.get('/users', {
      params: { username },
    })

    const direct = extractSingleUser(response.data)
    if (direct && normalizeUsername(toString(direct.username)) === username) {
      return direct
    }

    const rows = extractUserCollection(response.data)
    return rows.find((row) => normalizeUsername(toString(row.username)) === username) ?? null
  } catch (error) {
    if (isNotFoundError(error)) {
      return null
    }

    throw error
  }
}

export async function fetchPublicUserProfile(username: string): Promise<PublicUserProfile | null> {
  const normalizedUsername = normalizeUsername(safeDecode(username))
  if (!normalizedUsername) {
    return null
  }

  const primaryCandidate = await fetchFromPrimaryEndpoint(normalizedUsername)
  if (primaryCandidate) {
    return mapToPublicUserProfile(primaryCandidate, normalizedUsername)
  }

  const legacyCandidate = await fetchFromLegacyProfileEndpoint(normalizedUsername)
  if (legacyCandidate) {
    return mapToPublicUserProfile(legacyCandidate, normalizedUsername)
  }

  const fallbackCandidate = await fetchFromSearchEndpoint(normalizedUsername)
  if (fallbackCandidate) {
    return mapToPublicUserProfile(fallbackCandidate, normalizedUsername)
  }

  return null
}
