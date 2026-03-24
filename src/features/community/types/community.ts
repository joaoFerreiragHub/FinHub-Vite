import { UserRole } from '@/features/auth/types'

export type CommunityRoomCategory =
  | 'general'
  | 'budgeting'
  | 'investing'
  | 'real_estate'
  | 'fire'
  | 'credit'
  | 'expat'
  | 'beginners'
  | 'premium'

export interface CommunityRoom {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  category: CommunityRoomCategory
  isPublic: boolean
  requiredRole: UserRole
  moderators: string[]
  postCount: number
  memberCount: number
  isPremium: boolean
  sortOrder: number
  createdAt?: string
  updatedAt?: string
}

export interface CommunityRoomsResponse {
  items: CommunityRoom[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface CommunityRoomDetailResponse {
  room: CommunityRoom
}

export type CommunityPostSort = 'recent' | 'popular'
export type CommunityVoteDirection = 'up' | 'down'

export interface CommunityAuthor {
  id: string
  name: string
  username: string
  avatar?: string
  level?: number
  levelName?: string
}

export interface CommunityRoomSummary {
  id: string
  slug: string
  name: string
  requiredRole: UserRole
  isPremium: boolean
}

export interface CommunityPostListItem {
  id: string
  room: CommunityRoomSummary
  author: CommunityAuthor
  title: string
  imageUrl?: string
  upvotes: number
  downvotes: number
  score: number
  replyCount: number
  isPinned: boolean
  isLocked: boolean
  moderationStatus: 'visible' | 'hidden' | 'restricted'
  viewerVote: CommunityVoteDirection | null
  createdAt: string
  updatedAt: string
}

export interface CommunityPostDetail extends CommunityPostListItem {
  content: string
  hubContentRef?: {
    contentType: string
    contentId: string
  }
}

export interface CommunityReply {
  id: string
  postId: string
  parentReplyId: string | null
  author: CommunityAuthor
  content: string
  upvotes: number
  downvotes: number
  score: number
  isMarkedHelpful: boolean
  moderationStatus: 'visible' | 'hidden' | 'restricted'
  viewerVote: CommunityVoteDirection | null
  createdAt: string
  updatedAt: string
}

export interface CommunityReplyThread extends CommunityReply {
  replies: CommunityReply[]
}

export interface CommunityPostsListResponse {
  room: CommunityRoomSummary
  items: CommunityPostListItem[]
  pageInfo: {
    limit: number
    sort: CommunityPostSort
    hasMore: boolean
    nextCursor: string | null
  }
}

export interface CommunityPostDetailResponse {
  post: CommunityPostDetail
  replies: CommunityReplyThread[]
}

export interface CommunityVoteResponse {
  targetType: 'post' | 'reply'
  targetId: string
  upvotes: number
  downvotes: number
  score: number
  viewerVote: CommunityVoteDirection | null
}

export interface CommunityLeaderboardEntry {
  rank: number
  username: string
  avatar?: string
  level: number
  levelName: string
  weeklyXp: number
  badges: Array<{ id: string; unlockedAt: string }>
}

export interface CommunityLeaderboardResponse {
  items: CommunityLeaderboardEntry[]
  me?: {
    rank: number
    weeklyXp: number
  }
}

export interface CommunityXpBadge {
  id: string
  unlockedAt: string
}

export interface CommunityXpHistoryEntry {
  action: string
  xp: number
  contentId?: string
  createdAt: string
}

export interface CommunityMyXpResponse {
  totalXp: number
  level: number
  levelName: string
  weeklyXp: number
  badges: CommunityXpBadge[]
  history: CommunityXpHistoryEntry[]
}
