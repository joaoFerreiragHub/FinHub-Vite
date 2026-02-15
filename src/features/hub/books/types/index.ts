import type { BaseContent, ContentCategory } from '../../types'
import { ContentType } from '../../types'

/**
 * Book (extends BaseContent)
 */
export interface Book extends BaseContent {
  type: ContentType.BOOK

  // Dados do livro
  author: string // Autor do livro (diferente do creator)
  isbn?: string
  publisher?: string
  publishYear?: number
  pages?: number

  // Classificacao
  genres: string[]
  keyPhrases?: string[]

  // Links
  purchaseUrl?: string
  pdfUrl?: string // Se disponivel para download
}

/**
 * DTO para criar livro
 */
export interface CreateBookDto {
  title: string
  description: string
  excerpt?: string
  coverImage?: string
  category: ContentCategory
  tags?: string[]

  author: string
  isbn?: string
  publisher?: string
  publishYear?: number
  pages?: number
  genres?: string[]
  keyPhrases?: string[]
  purchaseUrl?: string
  pdfUrl?: string

  requiredRole?: string
  isPremium?: boolean
  status?: string
}

/**
 * DTO para atualizar livro
 */
export interface UpdateBookDto {
  title?: string
  description?: string
  excerpt?: string
  coverImage?: string
  category?: ContentCategory
  tags?: string[]

  author?: string
  isbn?: string
  publisher?: string
  publishYear?: number
  pages?: number
  genres?: string[]
  keyPhrases?: string[]
  purchaseUrl?: string
  pdfUrl?: string

  requiredRole?: string
  isPremium?: boolean
  status?: string
}
