import { ContentType, ContentCategory, PublishStatus, type BaseContent } from '@/features/hub/types'
import { UserRole } from '@/features/auth/types'
import {
  NotificationType,
  type Notification,
  type FollowedCreator,
  type FavoriteItem,
} from '@/features/social/types'

let idCounter = 0
function nextId(prefix = 'mock') {
  return `${prefix}-${++idCounter}`
}

export function createMockBaseContent(overrides?: Partial<BaseContent>): BaseContent {
  const id = nextId('content')
  return {
    id,
    type: ContentType.ARTICLE,
    slug: `mock-content-${id}`,
    title: 'Mock Content Title',
    description: 'Mock content description for testing.',
    creator: {
      id: 'creator-1',
      name: 'Test Creator',
      username: 'test-creator',
      email: '',
      role: UserRole.CREATOR,
      isEmailVerified: true,
      createdAt: '',
      updatedAt: '',
    },
    creatorId: 'creator-1',
    category: ContentCategory.PERSONAL_FINANCE,
    tags: ['test'],
    viewCount: 100,
    likeCount: 10,
    favoriteCount: 5,
    shareCount: 2,
    averageRating: 4.0,
    ratingCount: 8,
    reviewCount: 8,
    commentCount: 3,
    commentsEnabled: true,
    requiredRole: UserRole.VISITOR,
    isPremium: false,
    isFeatured: false,
    status: PublishStatus.PUBLISHED,
    isPublished: true,
    publishedAt: '2025-01-01T10:00:00Z',
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z',
    ...overrides,
  }
}

export function createMockNotification(overrides?: Partial<Notification>): Notification {
  return {
    id: nextId('notif'),
    type: NotificationType.NEW_CONTENT,
    title: 'Mock Notification',
    message: 'This is a mock notification for testing.',
    isRead: false,
    actorName: 'Test Actor',
    createdAt: new Date().toISOString(),
    ...overrides,
  }
}

export function createMockFollowedCreator(overrides?: Partial<FollowedCreator>): FollowedCreator {
  return {
    creatorId: nextId('creator'),
    username: 'mock-creator',
    name: 'Mock Creator',
    followedAt: new Date().toISOString(),
    ...overrides,
  }
}

export function createMockFavoriteItem(overrides?: Partial<FavoriteItem>): FavoriteItem {
  return {
    contentId: nextId('fav'),
    contentType: ContentType.ARTICLE,
    title: 'Mock Favorite',
    favoritedAt: new Date().toISOString(),
    ...overrides,
  }
}
