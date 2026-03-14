import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminPlatformIntegrationsService } from '../services/adminPlatformIntegrationsService'
import type {
  AdminPlatformIntegrationItem,
  AdminPlatformIntegrationRollbackPayload,
  AdminPlatformIntegrationUpdatePayload,
} from '../types/adminPlatformIntegrations'

interface UpdatePlatformIntegrationInput {
  key: AdminPlatformIntegrationItem['key']
  payload: AdminPlatformIntegrationUpdatePayload
}

interface RollbackPlatformIntegrationInput {
  key: AdminPlatformIntegrationItem['key']
  payload: AdminPlatformIntegrationRollbackPayload
}

const ADMIN_PLATFORM_INTEGRATIONS_QUERY_KEY = ['admin', 'platform-integrations'] as const

export function useAdminPlatformIntegrations(enabled = true) {
  return useQuery({
    queryKey: ADMIN_PLATFORM_INTEGRATIONS_QUERY_KEY,
    queryFn: () => adminPlatformIntegrationsService.list(),
    enabled,
  })
}

export function useUpdateAdminPlatformIntegration() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ key, payload }: UpdatePlatformIntegrationInput) =>
      adminPlatformIntegrationsService.update(key, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PLATFORM_INTEGRATIONS_QUERY_KEY })
    },
  })
}

export function useRollbackAdminPlatformIntegration() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ key, payload }: RollbackPlatformIntegrationInput) =>
      adminPlatformIntegrationsService.rollback(key, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PLATFORM_INTEGRATIONS_QUERY_KEY })
    },
  })
}
