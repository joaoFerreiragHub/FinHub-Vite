import { useQuery } from '@tanstack/react-query'
import {
  fetchExploreHubContent,
  type ExploreContentTypeFilter,
  type ExploreSortOption,
} from '../services/exploreHubService'

interface UseExploreHubContentOptions {
  type: ExploreContentTypeFilter
  page: number
  limit: number
  sort: ExploreSortOption
}

export function useExploreHubContent({ type, page, limit, sort }: UseExploreHubContentOptions) {
  return useQuery({
    queryKey: ['explore-hub-content', type, page, limit, sort],
    queryFn: () =>
      fetchExploreHubContent({
        type,
        page,
        limit,
        sort,
      }),
    staleTime: 60 * 1000,
    placeholderData: (previousData) => previousData,
  })
}
