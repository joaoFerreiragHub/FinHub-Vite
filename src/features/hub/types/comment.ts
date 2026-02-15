import { type User } from '@/features/auth/types'
import { type ContentType } from './base'

/**
 * Comentário universal do HUB
 */
export interface Comment {
  id: string

  // Conteúdo alvo
  targetType: ContentType
  targetId: string
  parentCommentId?: string | null

  // Autor
  user: Pick<User, 'id' | 'name' | 'username' | 'avatar'> | string
  userId: string

  // Conteúdo
  content: string
  depth: number
  path?: string

  // Engagement
  likeCount: number
  replyCount: number
  hasLiked?: boolean

  // Estado
  isEdited?: boolean
  isDeleted?: boolean
  isPinned?: boolean

  // Timestamps
  createdAt: string
  updatedAt: string

  // Threading
  replies: Comment[]
}

/**
 * Dados para criar comentário/reply
 */
export interface CreateCommentDto {
  targetType: ContentType
  targetId: string
  content: string
  parentCommentId?: string
}

/**
 * Dados para atualizar comentário
 */
export interface UpdateCommentDto {
  content: string
}

/**
 * Filtros para listar comentários
 */
export interface CommentFilters {
  targetType?: ContentType
  targetId?: string
  userId?: string
  parentCommentId?: string | null
  includeDeleted?: boolean
  sortBy?: 'recent' | 'oldest' | 'popular'
  limit?: number
  offset?: number
}

/**
 * Resposta paginada de comentários
 */
export interface CommentListResponse {
  items: Comment[]
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

/**
 * Estrutura de árvore para threading
 */
export interface CommentTree {
  id: string
  comment: Comment
  children: CommentTree[]
  depth: number
}

/**
 * Tipo legado usado na secção de comentários de livros.
 * Mantido para compatibilidade com a API antiga.
 */
export interface CommentType {
  _id: string
  text: string
  userId: { _id: string; name?: string }
  replies: {
    _id: string
    text: string
    userId: { _id: string; name?: string }
  }[]
}
