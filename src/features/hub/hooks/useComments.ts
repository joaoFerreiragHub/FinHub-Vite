import { useMemo, useState } from 'react'
import { useInfiniteQuery, useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query'
import type { CommentListResponse, CommentTargetType } from '@/features/hub/types'
import { commentService, type CommentSort } from '../services/commentService'

const PAGE_SIZE = 10

interface UseCommentsOptions {
  enabled?: boolean
  currentUserId?: string | null
  contentQueryKey?: QueryKey
}

interface CreateCommentInput {
  content: string
  parentCommentId?: string
}

const buildEmptyResponse = (): CommentListResponse => ({
  items: [],
  total: 0,
  limit: PAGE_SIZE,
  offset: 0,
  hasMore: false,
})

export function useComments(
  targetType: CommentTargetType,
  targetId: string,
  options: UseCommentsOptions = {},
) {
  const queryClient = useQueryClient()
  const [sortBy, setSortByState] = useState<CommentSort>('recent')
  const normalizedTargetId = targetId.trim()
  const isEnabled = (options.enabled ?? true) && normalizedTargetId.length > 0

  const commentsQuery = useInfiniteQuery({
    queryKey: ['comments', targetType, normalizedTargetId, sortBy, options.currentUserId ?? null],
    queryFn: ({ pageParam }) =>
      commentService.getCommentTree(targetType, normalizedTargetId, {
        page: Number(pageParam),
        limit: PAGE_SIZE,
        sort: sortBy,
        currentUserId: options.currentUserId ?? null,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) return undefined
      const currentPage = Math.floor(lastPage.offset / Math.max(lastPage.limit, 1)) + 1
      return currentPage + 1
    },
    enabled: isEnabled,
  })

  const response = useMemo<CommentListResponse>(() => {
    const pages = commentsQuery.data?.pages ?? []
    if (pages.length === 0) return buildEmptyResponse()

    const items = pages.flatMap((page) => page.items)
    const lastPage = pages[pages.length - 1]

    return {
      items,
      total: lastPage?.total ?? items.length,
      limit: lastPage?.limit ?? PAGE_SIZE,
      offset: 0,
      hasMore: commentsQuery.hasNextPage ?? false,
    }
  }, [commentsQuery.data?.pages, commentsQuery.hasNextPage])

  const invalidateComments = async () => {
    const invalidations: Array<Promise<unknown>> = [
      queryClient.invalidateQueries({
        queryKey: ['comments', targetType, normalizedTargetId],
      }),
    ]

    if (options.contentQueryKey) {
      invalidations.push(
        queryClient.invalidateQueries({
          queryKey: options.contentQueryKey,
        }),
      )
    }

    await Promise.all(invalidations)
  }

  const createCommentMutation = useMutation({
    mutationFn: ({ content, parentCommentId }: CreateCommentInput) =>
      commentService.createComment(targetType, normalizedTargetId, content, parentCommentId),
    onSuccess: async () => {
      await invalidateComments()
    },
  })

  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      commentService.updateComment(commentId, content),
    onSuccess: async () => {
      await invalidateComments()
    },
  })

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => commentService.deleteComment(commentId),
    onSuccess: async () => {
      await invalidateComments()
    },
  })

  const likeCommentMutation = useMutation({
    mutationFn: (commentId: string) => commentService.toggleLike(commentId),
    onSuccess: async () => {
      await invalidateComments()
    },
  })

  const setSortBy = (nextSort: CommentSort) => {
    setSortByState(nextSort)
  }

  const loadMore = async () => {
    if (!commentsQuery.hasNextPage || commentsQuery.isFetchingNextPage) return
    await commentsQuery.fetchNextPage()
  }

  const submitComment = async (content: string) => {
    await createCommentMutation.mutateAsync({ content })
  }

  const replyToComment = async (commentId: string, content: string) => {
    await createCommentMutation.mutateAsync({
      content,
      parentCommentId: commentId,
    })
  }

  const editComment = async (commentId: string, content: string) => {
    await updateCommentMutation.mutateAsync({ commentId, content })
  }

  const deleteComment = async (commentId: string) => {
    await deleteCommentMutation.mutateAsync(commentId)
  }

  const likeComment = async (commentId: string) => {
    await likeCommentMutation.mutateAsync(commentId)
  }

  const isLoading =
    (commentsQuery.isPending && response.items.length === 0) || commentsQuery.isFetchingNextPage

  return {
    response,
    isLoading,
    error: commentsQuery.error,
    sortBy,
    setSortBy,
    submitComment,
    replyToComment,
    editComment,
    deleteComment,
    likeComment,
    loadMore,
  }
}
