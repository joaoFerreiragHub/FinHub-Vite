import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { publicAdsService, type PublicAdServeQuery } from '../services/publicAdsService'

interface PublicAdsQueryOptions {
  enabled?: boolean
}

export function usePublicAdSlot(query: PublicAdServeQuery, options?: PublicAdsQueryOptions) {
  const normalizedQuery = useMemo<PublicAdServeQuery>(
    () => ({
      slotId: query.slotId.trim().toUpperCase(),
      audience: query.audience === 'premium' ? 'premium' : 'free',
      device: query.device,
      country: query.country ?? null,
      vertical: query.vertical ?? null,
      sessionKey: query.sessionKey ?? null,
    }),
    [query.audience, query.country, query.device, query.sessionKey, query.slotId, query.vertical],
  )

  const isBrowser = typeof window !== 'undefined'
  const hasSlot = normalizedQuery.slotId.length > 0

  return useQuery({
    queryKey: [
      'public-ads',
      normalizedQuery.slotId,
      normalizedQuery.audience,
      normalizedQuery.device ?? 'auto',
      normalizedQuery.country ?? 'all',
      normalizedQuery.vertical ?? 'all',
      normalizedQuery.sessionKey ?? 'auto',
    ],
    queryFn: () => publicAdsService.serve(normalizedQuery),
    enabled: (options?.enabled ?? true) && isBrowser && hasSlot,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  })
}
