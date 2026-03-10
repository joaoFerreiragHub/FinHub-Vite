import { useQuery } from '@tanstack/react-query'
import {
  PUBLIC_DIRECTORY_SEARCH_MIN_LENGTH,
  publicDirectoriesService,
  type PublicDirectoryCategoryQuery,
  type PublicDirectoryListQuery,
  type PublicDirectoryVertical,
} from '../services/publicDirectoriesService'

interface PublicDirectoriesQueryOptions {
  enabled?: boolean
}

export function usePublicDirectoryCategories(
  query: PublicDirectoryCategoryQuery = {},
  options?: PublicDirectoriesQueryOptions,
) {
  return useQuery({
    queryKey: ['directories', 'categories', query],
    queryFn: () => publicDirectoriesService.getCategories(query),
    enabled: options?.enabled ?? true,
  })
}

export function usePublicDirectories(
  query: PublicDirectoryListQuery = {},
  options?: PublicDirectoriesQueryOptions,
) {
  return useQuery({
    queryKey: ['directories', 'list', query],
    queryFn: () => publicDirectoriesService.list(query),
    enabled: options?.enabled ?? true,
  })
}

export function useFeaturedPublicDirectories(limit = 6, options?: PublicDirectoriesQueryOptions) {
  return useQuery({
    queryKey: ['directories', 'featured', limit],
    queryFn: () => publicDirectoriesService.getFeatured(limit),
    enabled: options?.enabled ?? true,
  })
}

export function useSearchPublicDirectories(
  query: string,
  options: PublicDirectoryListQuery = {},
  queryOptions?: PublicDirectoriesQueryOptions,
) {
  const normalizedQuery = query.trim()
  const hasSearch = normalizedQuery.length >= PUBLIC_DIRECTORY_SEARCH_MIN_LENGTH

  return useQuery({
    queryKey: ['directories', 'search', normalizedQuery, options],
    queryFn: () => publicDirectoriesService.search(normalizedQuery, options),
    enabled: (queryOptions?.enabled ?? true) && hasSearch,
  })
}

export function usePublicDirectoryDetailBySlug(
  slug: string,
  options?: PublicDirectoriesQueryOptions,
) {
  const normalizedSlug = slug.trim().toLowerCase()

  return useQuery({
    queryKey: ['directories', 'detail-by-slug', normalizedSlug],
    queryFn: () => publicDirectoriesService.getDetailBySlug(normalizedSlug),
    enabled:
      (options?.enabled ?? true) && normalizedSlug.length >= PUBLIC_DIRECTORY_SEARCH_MIN_LENGTH,
  })
}

export function usePublicDirectoryRelatedContent(
  vertical: PublicDirectoryVertical | null,
  slug: string,
  limit = 8,
  options?: PublicDirectoriesQueryOptions,
) {
  const normalizedSlug = slug.trim().toLowerCase()

  return useQuery({
    queryKey: ['directories', 'related-content', vertical, normalizedSlug, limit],
    queryFn: () =>
      publicDirectoriesService.getRelatedContent(
        vertical as PublicDirectoryVertical,
        normalizedSlug,
        limit,
      ),
    enabled:
      (options?.enabled ?? true) &&
      Boolean(vertical) &&
      normalizedSlug.length >= PUBLIC_DIRECTORY_SEARCH_MIN_LENGTH,
  })
}
