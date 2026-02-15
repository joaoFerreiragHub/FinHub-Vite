import type { BaseContent, ContentCategory } from '../../types'
import { ContentType } from '../../types'

/**
 * LiveEvent - Evento ao vivo (extends BaseContent)
 */
export interface LiveEvent extends BaseContent {
  type: ContentType.EVENT

  // Tipo de evento
  eventType: 'online' | 'presencial' | 'hybrid'

  // Datas e horários
  startDate: string // ISO date
  endDate?: string
  startTime: string // HH:mm
  endTime?: string
  timezone?: string

  // Localização
  address?: string // Para presencial/hybrid
  meetingUrl?: string // Para online/hybrid

  // Capacidade
  maxAttendees?: number
  attendeeCount: number
  isRegistered?: boolean // Se o user actual está inscrito

  // Registo
  registrationDeadline?: string // ISO date

  // Preço
  price: number // 0 = gratuito
  currency: string
}

/**
 * DTO para criar evento
 */
export interface CreateLiveEventDto {
  title: string
  description: string
  excerpt?: string
  coverImage?: string
  category: ContentCategory
  tags?: string[]

  eventType: 'online' | 'presencial' | 'hybrid'
  startDate: string
  endDate?: string
  startTime: string
  endTime?: string
  timezone?: string
  address?: string
  meetingUrl?: string
  maxAttendees?: number
  registrationDeadline?: string
  price: number
  currency?: string

  requiredRole?: string
  isPremium?: boolean
  status?: string
}

/**
 * DTO para atualizar evento
 */
export interface UpdateLiveEventDto {
  title?: string
  description?: string
  excerpt?: string
  coverImage?: string
  category?: ContentCategory
  tags?: string[]

  eventType?: 'online' | 'presencial' | 'hybrid'
  startDate?: string
  endDate?: string
  startTime?: string
  endTime?: string
  timezone?: string
  address?: string
  meetingUrl?: string
  maxAttendees?: number
  registrationDeadline?: string
  price?: number
  currency?: string

  requiredRole?: string
  isPremium?: boolean
  status?: string
}
