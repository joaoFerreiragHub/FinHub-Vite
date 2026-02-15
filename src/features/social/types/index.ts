import type { ContentType, BaseContent } from '@/features/hub/types'
import type { User } from '@/features/auth/types'

// ========== NOTIFICATIONS ==========

export enum NotificationType {
  NEW_CONTENT = 'new_content',
  COMMENT_REPLY = 'comment_reply',
  LIKE_RECEIVED = 'like_received',
  FOLLOW_NEW = 'follow_new',
  RATING_RECEIVED = 'rating_received',
  SYSTEM = 'system',
}

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  actorId?: string
  actorName?: string
  actorAvatar?: string
  targetType?: ContentType
  targetId?: string
  targetUrl?: string
  createdAt: string
}

export interface NotificationListResponse {
  items: Notification[]
  total: number
  unreadCount: number
  hasMore: boolean
}

// ========== FOLLOWS ==========

export interface FollowedCreator {
  creatorId: string
  username: string
  name: string
  avatar?: string
  bio?: string
  followedAt: string
}

// ========== FAVORITES ==========

export interface FavoriteItem {
  contentId: string
  contentType: ContentType
  title: string
  coverImage?: string
  creatorName?: string
  favoritedAt: string
}

// ========== ACTIVITY FEED ==========

export type ActivityType = 'content_published' | 'content_updated' | 'creator_announcement'

export interface ActivityFeedItem {
  id: string
  type: ActivityType
  content: BaseContent
  creatorName: string
  creatorAvatar?: string
  createdAt: string
}

// ========== USER PROFILE ==========

export interface UserProfile extends User {
  followingCount: number
  favoritesCount: number
  commentsCount: number
  ratingsCount: number
  joinedAt: string
}

// ========== SEARCH ==========

export type SearchResultType = ContentType | 'creator'

export interface SearchResult {
  id: string
  type: SearchResultType
  title: string
  description: string
  coverImage?: string
  url: string
  score: number
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
  query: string
}
