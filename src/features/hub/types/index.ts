/**
 * HUB Types
 *
 * Sistema de tipos compartilhado para todos os conteúdos do HUB
 */

// Base types (comum a todos)
export {
  ContentType,
  ContentCategory,
  PublishStatus,
  type BaseContent,
  type CreateContentDto,
  type UpdateContentDto,
  type ContentFilters,
  type ContentListResponse,
  type ContentStats,
  type UserContentInteraction,
} from './base'

// Rating types (universal)
export {
  type Rating,
  type CreateRatingDto,
  type UpdateRatingDto,
  type RatingFilters,
  type RatingListResponse,
  type RatingStats,
} from './rating'

// Comment types (universal)
export {
  type Comment,
  type CreateCommentDto,
  type UpdateCommentDto,
  type CommentFilters,
  type CommentListResponse,
  type CommentTree,
} from './comment'
