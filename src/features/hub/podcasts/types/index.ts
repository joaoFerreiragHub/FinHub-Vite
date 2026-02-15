import type { BaseContent, ContentCategory } from '../../types'
import { ContentType } from '../../types'

/**
 * Episodio de Podcast
 */
export interface PodcastEpisode {
  id: string
  podcastId: string
  title: string
  description?: string
  order: number
  audioUrl: string
  duration: number // segundos
  publishedAt: string
  isPublished: boolean
  transcript?: string
  showNotes?: string
}

/**
 * Podcast (extends BaseContent)
 */
export interface Podcast extends BaseContent {
  type: ContentType.PODCAST

  episodes: PodcastEpisode[]
  totalEpisodes: number
  totalDuration: number // minutos

  frequency?: 'daily' | 'weekly' | 'biweekly' | 'monthly'
  rssFeedUrl?: string
  spotifyUrl?: string
  applePodcastsUrl?: string
  subscriberCount: number
}

/**
 * DTO para criar podcast
 */
export interface CreatePodcastDto {
  title: string
  description: string
  excerpt?: string
  coverImage?: string
  category: ContentCategory
  tags?: string[]

  frequency?: 'daily' | 'weekly' | 'biweekly' | 'monthly'
  rssFeedUrl?: string
  spotifyUrl?: string
  applePodcastsUrl?: string

  requiredRole?: string
  isPremium?: boolean
  status?: string
}

/**
 * DTO para atualizar podcast
 */
export interface UpdatePodcastDto {
  title?: string
  description?: string
  excerpt?: string
  coverImage?: string
  category?: ContentCategory
  tags?: string[]

  frequency?: 'daily' | 'weekly' | 'biweekly' | 'monthly'
  rssFeedUrl?: string
  spotifyUrl?: string
  applePodcastsUrl?: string

  requiredRole?: string
  isPremium?: boolean
  status?: string
}

/**
 * DTO para criar episodio
 */
export interface CreateEpisodeDto {
  podcastId: string
  title: string
  description?: string
  audioUrl: string
  duration: number
  transcript?: string
  showNotes?: string
  isPublished?: boolean
}
