import { useQuery } from '@tanstack/react-query'
import {
  editorialPublicApi,
  type PublicDirectoryVertical,
  type PublicEditorialListQuery,
} from '../services/editorialPublicApi'

interface PublicEditorialQueryOptions {
  enabled?: boolean
}

export function useEditorialLanding(
  vertical: PublicDirectoryVertical,
  query: PublicEditorialListQuery = {},
  options?: PublicEditorialQueryOptions,
) {
  return useQuery({
    queryKey: ['editorial', 'landing', vertical, query],
    queryFn: () => editorialPublicApi.getLanding(vertical, query),
    enabled: options?.enabled ?? true,
  })
}

export function useEditorialShowAll(
  vertical: PublicDirectoryVertical,
  query: PublicEditorialListQuery = {},
  options?: PublicEditorialQueryOptions,
) {
  return useQuery({
    queryKey: ['editorial', 'show-all', vertical, query],
    queryFn: () => editorialPublicApi.getShowAll(vertical, query),
    enabled: options?.enabled ?? true,
  })
}
