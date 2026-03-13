import { useQuery } from '@tanstack/react-query'
import { platformRuntimeConfigService } from '../services/platformRuntimeConfigService'

export function usePlatformRuntimeConfig(enabled = true) {
  return useQuery({
    queryKey: ['platform', 'runtime-config'],
    queryFn: () => platformRuntimeConfigService.get(),
    enabled,
    staleTime: 60_000,
    retry: 1,
  })
}
