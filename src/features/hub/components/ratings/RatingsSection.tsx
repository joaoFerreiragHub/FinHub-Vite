import { type HTMLAttributes, useMemo, useState } from 'react'
import {
  useInfiniteQuery,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
  type QueryKey,
} from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui'
import { getErrorMessage } from '@/lib/api/client'
import { usePermissions } from '@/features/auth'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { Permission } from '@/lib/permissions/config'
import { ratingService } from '../../services/ratingService'
import type { Rating, RatingSort, RatingTargetType, ReviewReactionInput } from '../../types'
import { RatingDistribution } from './RatingDistribution'
import { RatingForm } from './RatingForm'
import { RatingList } from './RatingList'

const PAGE_SIZE = 10
const EMPTY_DISTRIBUTION = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
}

export interface RatingsSectionProps extends HTMLAttributes<HTMLDivElement> {
  targetType: RatingTargetType
  targetId: string
  sectionTitle?: string
  formTitle?: string
  contentQueryKey?: QueryKey
}

export function RatingsSection({
  targetType,
  targetId,
  sectionTitle = 'Avaliacoes',
  formTitle = 'Avaliar este conteudo',
  contentQueryKey,
  className,
  ...props
}: RatingsSectionProps) {
  const queryClient = useQueryClient()
  const { can } = usePermissions()

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const currentUserId = useAuthStore((state) => state.user?.id)

  const [sortBy, setSortBy] = useState<RatingSort>('recent')

  const canRate = can(Permission.RATE_CONTENT)

  const statsQuery = useQuery({
    queryKey: ['rating-stats', targetType, targetId],
    queryFn: () => ratingService.getRatingStats(targetType, targetId),
    enabled: Boolean(targetType && targetId),
  })

  const myRatingQuery = useQuery({
    queryKey: ['my-rating', targetType, targetId],
    queryFn: () => ratingService.getMyRating(targetType, targetId),
    enabled: isAuthenticated && Boolean(targetType && targetId),
  })

  const ratingsQuery = useInfiniteQuery({
    queryKey: ['ratings', targetType, targetId, sortBy],
    queryFn: ({ pageParam }) =>
      ratingService.getRatings(targetType, targetId, {
        page: pageParam,
        limit: PAGE_SIZE,
        sortBy,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) {
        return undefined
      }

      return allPages.length + 1
    },
    enabled: Boolean(targetType && targetId),
  })

  const mergedItems = useMemo(
    () =>
      (ratingsQuery.data?.pages ?? []).flatMap((page) =>
        Array.isArray(page.items) ? page.items : [],
      ),
    [ratingsQuery.data?.pages],
  )

  const reactionQueries = useQueries({
    queries: mergedItems.map((rating) => ({
      queryKey: ['rating-my-reaction', rating.id],
      queryFn: () => ratingService.getMyRatingReaction(rating.id),
      enabled: isAuthenticated,
      staleTime: 60_000,
    })),
  })

  const reactionsByRatingId = useMemo(() => {
    const map = new Map<string, Rating['myReaction']>()

    mergedItems.forEach((rating, index) => {
      const queryState = reactionQueries[index]
      map.set(rating.id, queryState?.data ?? rating.myReaction ?? null)
    })

    return map
  }, [mergedItems, reactionQueries])

  const invalidateRatings = async () => {
    const invalidatePromises: Array<Promise<unknown>> = [
      queryClient.invalidateQueries({ queryKey: ['ratings', targetType, targetId] }),
      queryClient.invalidateQueries({ queryKey: ['rating-stats', targetType, targetId] }),
      queryClient.invalidateQueries({ queryKey: ['my-rating', targetType, targetId] }),
    ]

    if (contentQueryKey) {
      invalidatePromises.push(queryClient.invalidateQueries({ queryKey: contentQueryKey }))
    }

    await Promise.all(invalidatePromises)
  }

  const submitRatingMutation = useMutation({
    mutationFn: ({ rating, review }: { rating: number; review?: string }) =>
      ratingService.createOrUpdateRating({
        targetType,
        targetId,
        rating,
        review,
      }),
    onSuccess: async () => {
      await invalidateRatings()
    },
  })

  const reactionMutation = useMutation({
    mutationFn: ({ ratingId, reaction }: { ratingId: string; reaction: ReviewReactionInput }) =>
      ratingService.reactToRating(ratingId, reaction),
    onSuccess: async (result, variables) => {
      queryClient.setQueryData(['rating-my-reaction', variables.ratingId], result.reaction)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['ratings', targetType, targetId] }),
        queryClient.invalidateQueries({ queryKey: ['rating-stats', targetType, targetId] }),
      ])
    },
  })

  const latestPage = ratingsQuery.data?.pages?.[ratingsQuery.data.pages.length - 1]

  const ratingsResponse = {
    items: mergedItems,
    total: latestPage?.total ?? 0,
    limit: latestPage?.limit ?? PAGE_SIZE,
    offset: 0,
    hasMore: ratingsQuery.hasNextPage ?? false,
    averageRating: statsQuery.data?.averageRating ?? 0,
    ratingDistribution: statsQuery.data?.distribution ?? { ...EMPTY_DISTRIBUTION },
  }

  const isLoadingList =
    (ratingsQuery.isPending && mergedItems.length === 0) || ratingsQuery.isFetchingNextPage

  const loadError = statsQuery.error ?? ratingsQuery.error

  return (
    <section className={cn('space-y-6', className)} {...props}>
      <h2 className="text-2xl font-bold">{sectionTitle}</h2>

      {statsQuery.data && statsQuery.data.totalRatings > 0 && (
        <RatingDistribution stats={statsQuery.data} />
      )}

      {statsQuery.data?.reviews && statsQuery.data.totalRatings > 0 && (
        <Card className="p-4 text-sm text-muted-foreground">
          <p>
            Reviews com texto:{' '}
            <span className="font-medium text-foreground">{statsQuery.data.reviews.withText}</span>
          </p>
          <p>
            Feedback em reviews:{' '}
            <span className="font-medium text-foreground">
              {statsQuery.data.reviews.totalLikes}
            </span>{' '}
            gostos,{' '}
            <span className="font-medium text-foreground">
              {statsQuery.data.reviews.totalDislikes}
            </span>{' '}
            nao gostos
          </p>
        </Card>
      )}

      {canRate ? (
        <Card className="p-6">
          <h3 className="mb-4 font-semibold">{formTitle}</h3>
          <RatingForm
            targetType={targetType}
            targetId={targetId}
            initialRating={myRatingQuery.data?.rating}
            initialReview={myRatingQuery.data?.review}
            submitText={myRatingQuery.data ? 'Atualizar avaliacao' : 'Publicar avaliacao'}
            onSubmit={async (data) => {
              await submitRatingMutation.mutateAsync(data)
            }}
          />
        </Card>
      ) : (
        <Card className="p-6 text-center text-sm text-muted-foreground">
          Faz login para avaliar este conteudo
        </Card>
      )}

      {loadError ? (
        <Card className="p-6 text-sm text-red-600">
          Erro ao carregar avaliacoes: {getErrorMessage(loadError)}
        </Card>
      ) : (
        <RatingList
          response={ratingsResponse}
          isLoading={isLoadingList}
          sortBy={sortBy}
          onSortChange={(nextSort) => {
            setSortBy(nextSort)
          }}
          onLoadMore={() => {
            if (ratingsQuery.hasNextPage && !ratingsQuery.isFetchingNextPage) {
              void ratingsQuery.fetchNextPage()
            }
          }}
          getCardProps={(rating) => ({
            isOwner: Boolean(currentUserId && rating.userId === currentUserId),
            canReact: isAuthenticated,
            myReaction: reactionsByRatingId.get(rating.id) ?? null,
            onReactionChange: async (reaction) => {
              if (!isAuthenticated) return

              await reactionMutation.mutateAsync({
                ratingId: rating.id,
                reaction,
              })
            },
          })}
        />
      )}
    </section>
  )
}
