import { BaseContent, ContentType, ContentCategory } from '../../types'

export interface Video extends BaseContent {
  type: ContentType.VIDEO
  videoUrl: string
  duration: number // segundos
  thumbnail?: string
  quality: '720p' | '1080p' | '4k'
  transcript?: string
  subtitles?: Subtitle[]
  playlist?: string // ID da playlist
}

export interface Subtitle {
  language: string
  url: string
}

export interface CreateVideoDto {
  title: string
  description: string
  excerpt?: string
  videoUrl: string
  duration: number
  thumbnail?: string
  coverImage?: string
  category: ContentCategory
  tags?: string[]
  quality?: '720p' | '1080p' | '4k'
  requiredRole?: 'visitor' | 'free' | 'premium'
  isPremium?: boolean
  status?: 'draft' | 'published'
  language?: string
}

export interface UpdateVideoDto {
  title?: string
  description?: string
  excerpt?: string
  videoUrl?: string
  duration?: number
  thumbnail?: string
  coverImage?: string
  category?: ContentCategory
  tags?: string[]
  quality?: '720p' | '1080p' | '4k'
  requiredRole?: 'visitor' | 'free' | 'premium'
  isPremium?: boolean
  status?: 'draft' | 'published'
  commentsEnabled?: boolean
  isFeatured?: boolean
}
