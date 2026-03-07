import { apiClient } from '@/lib/api/client'
import type { Creator, CreatorFull, SocialMediaLink } from '@/features/creators/types/creator'

interface BackendCreatorSocialLinks {
  website?: string | null
  twitter?: string | null
  linkedin?: string | null
  instagram?: string | null
}

interface BackendPublicCreator {
  id: string
  name: string
  username: string
  avatar?: string | null
  bio?: string | null
  socialLinks?: BackendCreatorSocialLinks | null
  followers?: number
  following?: number
  emailVerified?: boolean
  rating?: {
    average?: number
    count?: number
  }
  createdAt?: string
  lastActiveAt?: string | null
}

interface BackendPublicCreatorsListResponse {
  items?: BackendPublicCreator[]
}

interface BackendPublicCreatorProfileResponse {
  creator?: BackendPublicCreator
}

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

const toSocialMediaLinks = (links?: BackendCreatorSocialLinks | null): SocialMediaLink[] => {
  if (!links) return []

  const rows: SocialMediaLink[] = []
  if (links.website) rows.push({ platform: 'website', url: links.website })
  if (links.twitter) rows.push({ platform: 'twitter', url: links.twitter })
  if (links.linkedin) rows.push({ platform: 'linkedin', url: links.linkedin })
  if (links.instagram) rows.push({ platform: 'instagram', url: links.instagram })
  return rows
}

const toBaseCreator = (row: BackendPublicCreator): Creator => {
  const { firstname, lastname } = splitDisplayName(row.name || '', row.username)
  const followersCount = Number(row.followers ?? 0)

  return {
    _id: row.id,
    username: row.username,
    email: `${row.username}@finhub.local`,
    firstname,
    lastname,
    profilePictureUrl: row.avatar || undefined,
    role: 'creator',
    isPremium: false,
    topics: [],
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
    createdAt: row.createdAt,
    updatedAt: row.lastActiveAt || row.createdAt,
  }
}

export interface PublicCreatorsListFilters {
  search?: string
  minRating?: number
  sortBy?: 'followers' | 'rating' | 'newest' | 'recent'
  sortOrder?: 'asc' | 'desc'
  limit?: number
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

export async function fetchPublicCreatorProfile(username: string): Promise<CreatorFull | null> {
  const normalized = username.trim().toLowerCase()
  if (!normalized) return null

  try {
    const response = await apiClient.get<BackendPublicCreatorProfileResponse>(
      `/creators/${encodeURIComponent(normalized)}`,
    )
    const creator = response.data?.creator
    if (!creator) return null

    return {
      ...toBaseCreator(creator),
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
        welcomeVideo: false,
      },
    }
  } catch {
    return null
  }
}
