import type { CommentListResponse } from '@/features/hub/types'
import { commentService, type CommentSort } from '@/features/hub/services/commentService'

export type DirectoryCommentSort = CommentSort

interface DirectoryCommentQueryOptions {
  page?: number
  limit?: number
  sort?: DirectoryCommentSort
  currentUserId?: string | null
}

export const directoryCommentsService = {
  getCommentTree: async (
    targetId: string,
    options: DirectoryCommentQueryOptions = {},
  ): Promise<CommentListResponse> => {
    return commentService.getCommentTree('directory_entry', targetId, options)
  },

  createComment: async (
    targetId: string,
    content: string,
    parentCommentId?: string,
  ): Promise<void> => {
    await commentService.createComment('directory_entry', targetId, content, parentCommentId)
  },

  updateComment: async (commentId: string, content: string): Promise<void> => {
    await commentService.updateComment(commentId, content)
  },

  deleteComment: async (commentId: string): Promise<void> => {
    await commentService.deleteComment(commentId)
  },

  toggleLike: async (commentId: string): Promise<void> => {
    await commentService.toggleLike(commentId)
  },
}
