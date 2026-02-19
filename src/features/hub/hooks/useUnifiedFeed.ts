import { useQuery } from '@tanstack/react-query'
import { useArticles } from '../articles/hooks/useArticles'
import type { ArticleFilters } from '../articles/types'
import { toBaseContentList } from '../news/utils/newsAdapter'
import { PublishStatus } from '../types'
import type { BaseContent, ContentFilters } from '../types'

interface UseUnifiedFeedOptions {
  filters?: ContentFilters
  includeArticles?: boolean
  includeNews?: boolean
  limit?: number
}

/**
 * Hook que combina Articles + News num unico feed ordenado por data
 * Usa o adapter newsAdapter para converter NewsArticle em BaseContent
 */
export function useUnifiedFeed({
  filters,
  includeArticles = true,
  includeNews = true,
  limit = 20,
}: UseUnifiedFeedOptions = {}) {
  const normalizedCategory = Array.isArray(filters?.category)
    ? filters?.category[0]
    : filters?.category
  const articleFilters: ArticleFilters | undefined = includeArticles
    ? ({
        ...filters,
        category: normalizedCategory,
        status: PublishStatus.PUBLISHED,
        limit,
      } as ArticleFilters)
    : undefined

  const articlesQuery = useArticles(articleFilters)

  // News data from the news store (Zustand-based, not React Query)
  // We use a separate query to fetch it
  const newsQuery = useQuery({
    queryKey: ['unified-news', filters, limit],
    queryFn: async () => {
      // Import the news service dynamically to avoid circular deps
      const { newsApi } = await import('../news/services/newsApi')
      const response = await newsApi.getNews()
      return toBaseContentList(response.articles)
    },
    enabled: includeNews,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const isLoading = articlesQuery.isLoading || newsQuery.isLoading
  const isError = articlesQuery.isError || newsQuery.isError

  // Combine and sort by date
  const items: BaseContent[] = []

  if (includeArticles && articlesQuery.data?.items) {
    items.push(...articlesQuery.data.items)
  }

  if (includeNews && newsQuery.data) {
    items.push(...newsQuery.data)
  }

  // Sort by publishedAt/createdAt descending
  items.sort((a, b) => {
    const dateA = new Date(a.publishedAt || a.createdAt).getTime()
    const dateB = new Date(b.publishedAt || b.createdAt).getTime()
    return dateB - dateA
  })

  // Apply limit
  const limitedItems = items.slice(0, limit)

  return {
    items: limitedItems,
    total: items.length,
    isLoading,
    isError,
    hasMore: items.length > limit,
  }
}
