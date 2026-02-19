import { apiClient } from '@/lib/api/client'
import { ContentType } from '@/features/hub/types'
import {
  NotificationType,
  type FollowedCreator,
  type FavoriteItem,
  type Notification,
  type NotificationListResponse,
  type ActivityFeedItem,
  type UserProfile,
  type SearchResponse,
} from '../types'

/**
 * Social Service.
 * Conecta com a API real implementada no backend.
 *
 * Endpoints implementados:
 * - Follow: POST/DELETE /follow/:userId, GET /follow/:userId/following, GET /follow/:userId/followers.
 * - Favorites: POST /favorites, DELETE /favorites (body), GET /favorites, GET /favorites/check.
 * - Notifications: GET /notifications, PATCH /notifications/:id/read, PATCH /notifications/read-all.
 */

type BackendFavoriteTargetType = 'article' | 'video' | 'course' | 'live' | 'podcast' | 'book'
type BackendNotificationType =
  | 'follow'
  | 'comment'
  | 'reply'
  | 'rating'
  | 'like'
  | 'mention'
  | 'content_published'

interface BackendUser {
  id?: string
  _id?: string
  username?: string
  name?: string
  avatar?: string
  bio?: string
  followedAt?: string
}

interface BackendFollowListResponse {
  followers?: BackendUser[]
  following?: BackendUser[]
}

interface BackendFavoriteContent {
  id?: string
  _id?: string
  title?: string
  coverImage?: string
  creator?: string | { id?: string; _id?: string; name?: string; username?: string }
}

interface BackendFavoriteRecord {
  _id: string
  targetType: BackendFavoriteTargetType
  content?: BackendFavoriteContent | null
  createdAt: string
}

interface BackendFavoritesResponse {
  favorites: BackendFavoriteRecord[]
}

interface BackendNotificationRecord {
  id?: string
  _id?: string
  type: BackendNotificationType | string
  triggeredBy?: string | BackendUser | null
  targetType?: string | null
  targetId?: string | { id?: string; _id?: string } | null
  message?: string | null
  isRead?: boolean
  createdAt?: string
}

interface BackendNotificationListResponse {
  notifications: BackendNotificationRecord[]
  unreadCount?: number
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

const readAuthState = (): Record<string, unknown> | null => {
  if (typeof window === 'undefined') return null

  const authStorage = localStorage.getItem('auth-storage')
  if (!authStorage) return null

  try {
    const parsed = JSON.parse(authStorage)
    return parsed?.state ?? null
  } catch (error) {
    console.error('Error parsing auth storage:', error)
    return null
  }
}

const getCurrentUserId = (): string | null => {
  const state = readAuthState()
  const user = state?.user as { id?: string; _id?: string } | undefined
  return user?.id ?? user?._id ?? null
}

const resolveId = (value: unknown): string | null => {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object') {
    const objectValue = value as { id?: string; _id?: string }
    return objectValue.id ?? objectValue._id ?? null
  }
  return null
}

const isMongoObjectId = (value: string): boolean => /^[a-fA-F0-9]{24}$/.test(value)

const toBackendTargetType = (type: ContentType): BackendFavoriteTargetType => {
  switch (type) {
    case ContentType.ARTICLE:
      return 'article'
    case ContentType.COURSE:
      return 'course'
    case ContentType.VIDEO:
      return 'video'
    case ContentType.EVENT:
      return 'live'
    case ContentType.BOOK:
      return 'book'
    case ContentType.PODCAST:
      return 'podcast'
    default:
      throw new Error(`Tipo de conteudo nao suportado para favoritos: ${type}`)
  }
}

const fromBackendTargetType = (type: BackendFavoriteTargetType): ContentType => {
  switch (type) {
    case 'article':
      return ContentType.ARTICLE
    case 'course':
      return ContentType.COURSE
    case 'video':
      return ContentType.VIDEO
    case 'live':
      return ContentType.EVENT
    case 'book':
      return ContentType.BOOK
    case 'podcast':
      return ContentType.PODCAST
  }
}

const toContentType = (targetType?: string | null): ContentType | undefined => {
  if (!targetType) return undefined

  switch (targetType) {
    case 'article':
      return ContentType.ARTICLE
    case 'course':
      return ContentType.COURSE
    case 'video':
      return ContentType.VIDEO
    case 'live':
    case 'event':
      return ContentType.EVENT
    case 'book':
      return ContentType.BOOK
    case 'podcast':
      return ContentType.PODCAST
    case 'news':
      return ContentType.NEWS
    default:
      return undefined
  }
}

const mapFollowedCreator = (user: BackendUser): FollowedCreator => ({
  creatorId: user.id ?? user._id ?? '',
  username: user.username ?? '',
  name: user.name ?? user.username ?? 'Utilizador',
  avatar: user.avatar,
  bio: user.bio,
  followedAt: user.followedAt ?? new Date().toISOString(),
})

const mapFavorite = (favorite: BackendFavoriteRecord): FavoriteItem | null => {
  if (!favorite.content) return null

  const contentId = favorite.content.id ?? favorite.content._id
  if (!contentId) return null

  const creatorName =
    typeof favorite.content.creator === 'string'
      ? undefined
      : (favorite.content.creator?.name ?? favorite.content.creator?.username)

  return {
    contentId,
    contentType: fromBackendTargetType(favorite.targetType),
    title: favorite.content.title ?? 'Sem titulo',
    coverImage: favorite.content.coverImage,
    creatorName,
    favoritedAt: favorite.createdAt,
  }
}

const mapNotificationType = (type: string): NotificationType => {
  switch (type) {
    case 'content_published':
      return NotificationType.NEW_CONTENT
    case 'comment':
    case 'reply':
      return NotificationType.COMMENT_REPLY
    case 'like':
      return NotificationType.LIKE_RECEIVED
    case 'follow':
      return NotificationType.FOLLOW_NEW
    case 'rating':
      return NotificationType.RATING_RECEIVED
    default:
      return NotificationType.SYSTEM
  }
}

const buildTargetUrl = (
  targetType?: string | null,
  targetId?: string | null,
): string | undefined => {
  if (!targetType || !targetId) return undefined
  if (isMongoObjectId(targetId)) return undefined

  switch (targetType) {
    case 'article':
      return `/hub/articles/${targetId}`
    case 'course':
      return `/hub/courses/${targetId}`
    case 'video':
      return `/hub/videos/${targetId}`
    case 'live':
    case 'event':
      return `/hub/lives/${targetId}`
    case 'book':
      return `/hub/books/${targetId}`
    case 'podcast':
      return `/hub/podcasts/${targetId}`
    case 'news':
      return `/noticias/${targetId}`
    default:
      return undefined
  }
}

const buildNotificationText = (
  type: NotificationType,
  actorName?: string,
): { title: string; message: string } => {
  switch (type) {
    case NotificationType.NEW_CONTENT:
      return {
        title: 'Novo conteudo publicado',
        message: actorName
          ? `${actorName} publicou novo conteudo.`
          : 'Novo conteudo de criador seguido.',
      }
    case NotificationType.COMMENT_REPLY:
      return {
        title: 'Nova interacao em comentarios',
        message: actorName
          ? `${actorName} comentou ou respondeu no teu conteudo.`
          : 'Recebeste uma nova interacao em comentarios.',
      }
    case NotificationType.LIKE_RECEIVED:
      return {
        title: 'Novo like recebido',
        message: actorName ? `${actorName} gostou do teu conteudo.` : 'Recebeste um novo like.',
      }
    case NotificationType.FOLLOW_NEW:
      return {
        title: 'Novo seguidor',
        message: actorName ? `${actorName} comecou a seguir-te.` : 'Tens um novo seguidor.',
      }
    case NotificationType.RATING_RECEIVED:
      return {
        title: 'Nova avaliacao recebida',
        message: actorName
          ? `${actorName} avaliou o teu conteudo.`
          : 'Recebeste uma nova avaliacao.',
      }
    default:
      return {
        title: 'Notificacao',
        message: 'Tens uma nova notificacao.',
      }
  }
}

const mapNotification = (notification: BackendNotificationRecord): Notification => {
  const actor =
    notification.triggeredBy && typeof notification.triggeredBy === 'object'
      ? notification.triggeredBy
      : undefined
  const actorName = actor?.name ?? actor?.username ?? undefined
  const normalizedType = mapNotificationType(notification.type)
  const targetId = resolveId(notification.targetId)
  const defaultText = buildNotificationText(normalizedType, actorName)

  return {
    id: notification.id ?? notification._id ?? '',
    type: normalizedType,
    title: defaultText.title,
    message: notification.message || defaultText.message,
    isRead: Boolean(notification.isRead),
    actorId: resolveId(notification.triggeredBy) ?? undefined,
    actorName,
    actorAvatar: actor?.avatar ?? undefined,
    targetType: toContentType(notification.targetType),
    targetId: targetId ?? undefined,
    targetUrl: buildTargetUrl(notification.targetType, targetId) ?? undefined,
    createdAt: notification.createdAt ?? new Date().toISOString(),
  }
}

const mapNotificationsResponse = (
  payload: BackendNotificationListResponse,
): NotificationListResponse => {
  const items = (payload.notifications ?? []).map(mapNotification)
  const total = payload.pagination?.total ?? items.length
  const page = payload.pagination?.page ?? 1
  const limit = payload.pagination?.limit ?? items.length

  return {
    items,
    total,
    unreadCount: payload.unreadCount ?? items.filter((notification) => !notification.isRead).length,
    hasMore: page * limit < total,
  }
}

export const socialService = {
  // ========== FOLLOWS ==========

  /**
   * Obter lista de quem eu sigo.
   */
  getFollowing: async (): Promise<FollowedCreator[]> => {
    const currentUserId = getCurrentUserId()
    if (!currentUserId) return []

    const response = await apiClient.get<BackendFollowListResponse>(
      `/follow/${currentUserId}/following`,
    )
    return (response.data.following ?? [])
      .map(mapFollowedCreator)
      .filter((creator) => creator.creatorId.length > 0)
  },

  /**
   * Obter meus seguidores.
   */
  getFollowers: async (): Promise<FollowedCreator[]> => {
    const currentUserId = getCurrentUserId()
    if (!currentUserId) return []

    const response = await apiClient.get<BackendFollowListResponse>(
      `/follow/${currentUserId}/followers`,
    )
    return (response.data.followers ?? [])
      .map(mapFollowedCreator)
      .filter((creator) => creator.creatorId.length > 0)
  },

  /**
   * Seguir um criador.
   */
  followCreator: async (creatorId: string): Promise<void> => {
    await apiClient.post(`/follow/${creatorId}`)
  },

  /**
   * Deixar de seguir um criador.
   */
  unfollowCreator: async (creatorId: string): Promise<void> => {
    await apiClient.delete(`/follow/${creatorId}`)
  },

  /**
   * Verificar se estou a seguir um criador.
   */
  isFollowing: async (creatorId: string): Promise<{ isFollowing: boolean }> => {
    const response = await apiClient.get<{ isFollowing: boolean }>(`/follow/check/${creatorId}`)
    return response.data
  },

  /**
   * Obter follows mutuos.
   */
  getMutualFollows: async (): Promise<FollowedCreator[]> => {
    const response = await apiClient.get<{ mutual: BackendUser[] }>('/follow/mutual')
    return (response.data.mutual ?? [])
      .map(mapFollowedCreator)
      .filter((creator) => creator.creatorId.length > 0)
  },

  // ========== FAVORITES ==========

  /**
   * Obter meus favoritos.
   */
  getFavorites: async (filters?: { targetType?: ContentType }): Promise<FavoriteItem[]> => {
    const targetType = filters?.targetType ? toBackendTargetType(filters.targetType) : undefined

    const response = await apiClient.get<BackendFavoritesResponse>('/favorites', {
      params: targetType ? { targetType } : undefined,
    })

    return (response.data.favorites ?? [])
      .map(mapFavorite)
      .filter((item): item is FavoriteItem => item !== null)
  },

  /**
   * Adicionar aos favoritos.
   */
  addFavorite: async (targetId: string, targetType: ContentType): Promise<void> => {
    await apiClient.post('/favorites', {
      targetId,
      targetType: toBackendTargetType(targetType),
    })
  },

  /**
   * Remover dos favoritos.
   */
  removeFavorite: async (targetId: string, targetType: ContentType): Promise<void> => {
    await apiClient.delete('/favorites', {
      data: {
        targetId,
        targetType: toBackendTargetType(targetType),
      },
    })
  },

  /**
   * Verificar se esta nos favoritos.
   */
  isFavorited: async (
    targetId: string,
    targetType: ContentType,
  ): Promise<{ isFavorited: boolean }> => {
    const response = await apiClient.get<{ isFavorite: boolean }>('/favorites/check', {
      params: {
        targetId,
        targetType: toBackendTargetType(targetType),
      },
    })

    return { isFavorited: response.data.isFavorite }
  },

  // ========== NOTIFICATIONS ==========

  /**
   * Obter notificacoes.
   */
  getNotifications: async (limit?: number): Promise<NotificationListResponse> => {
    const response = await apiClient.get<BackendNotificationListResponse>('/notifications', {
      params: { limit },
    })
    return mapNotificationsResponse(response.data)
  },

  /**
   * Obter notificacoes nao lidas.
   */
  getUnreadNotifications: async (): Promise<NotificationListResponse> => {
    const response = await apiClient.get<BackendNotificationListResponse>('/notifications/unread')
    return mapNotificationsResponse(response.data)
  },

  /**
   * Marcar notificacao como lida.
   */
  markNotificationRead: async (id: string): Promise<void> => {
    await apiClient.patch(`/notifications/${id}/read`)
  },

  /**
   * Marcar todas como lidas.
   */
  markAllNotificationsRead: async (): Promise<void> => {
    await apiClient.patch('/notifications/read-all')
  },

  /**
   * Apagar notificacao.
   */
  deleteNotification: async (id: string): Promise<void> => {
    await apiClient.delete(`/notifications/${id}`)
  },

  /**
   * Apagar todas as notificacoes lidas.
   */
  deleteAllNotifications: async (): Promise<void> => {
    await apiClient.delete('/notifications/read')
  },

  // ========== ACTIVITY FEED ==========
  // Nota: Estes endpoints ainda nao foram implementados no backend.
  // Mantidos para compatibilidade com o frontend existente.

  getActivityFeed: async (filters?: {
    following?: boolean
    limit?: number
  }): Promise<ActivityFeedItem[]> => {
    // TODO: Implementar endpoint no backend.
    const response = await apiClient.get<ActivityFeedItem[]>('/social/feed', {
      params: filters,
    })
    return response.data
  },

  // ========== USER PROFILE ==========
  // Nota: Perfis sao geridos atraves do /auth/me endpoint.

  getUserProfile: async (username: string): Promise<UserProfile> => {
    // TODO: Implementar endpoint no backend para obter perfil publico.
    const response = await apiClient.get<UserProfile>(`/users/${username}`)
    return response.data
  },

  getMyProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>('/auth/me')
    return response.data
  },

  // ========== SEARCH ==========
  // Nota: Endpoint de search ainda nao implementado no backend.

  search: async (query: string, filters?: { type?: ContentType }): Promise<SearchResponse> => {
    // TODO: Implementar endpoint no backend.
    const response = await apiClient.get<SearchResponse>('/search', {
      params: { q: query, ...filters },
    })
    return response.data
  },
}
