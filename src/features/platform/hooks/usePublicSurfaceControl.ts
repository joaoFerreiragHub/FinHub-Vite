import { useQuery } from '@tanstack/react-query'
import { publicSurfaceControlsService } from '../services/publicSurfaceControlsService'
import type { PublicSurfaceControlKey } from '../types/publicSurfaceControls'

export function usePublicSurfaceControls() {
  return useQuery({
    queryKey: ['platform', 'surface-controls'],
    queryFn: () => publicSurfaceControlsService.list(),
    staleTime: 60_000,
  })
}

export function usePublicSurfaceControl(key: PublicSurfaceControlKey) {
  return useQuery({
    queryKey: ['platform', 'surface-controls'],
    queryFn: () => publicSurfaceControlsService.list(),
    staleTime: 60_000,
    select: (response) => response.items.find((item) => item.key === key) ?? null,
  })
}
