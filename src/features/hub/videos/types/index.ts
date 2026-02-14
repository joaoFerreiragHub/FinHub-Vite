import { BaseContent, ContentType } from '../../types'

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
  videoUrl: string
  duration: number
  thumbnail?: string
  category: string
  tags?: string[]
  requiredRole?: 'visitor' | 'free' | 'premium'
  isPremium?: boolean
}
