import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminAssistedSessionsService } from '../services/adminAssistedSessionsService'
import type {
  AssistedSessionStatus,
  RequestAssistedSessionPayload,
  RevokeAssistedSessionPayload,
} from '../types/assistedSessions'

interface ListAdminAssistedSessionsQuery {
  status?: AssistedSessionStatus
  targetUserId?: string
  page?: number
  limit?: number
}

export function useAdminAssistedSessions(query: ListAdminAssistedSessionsQuery = {}) {
  return useQuery({
    queryKey: ['admin', 'support', 'sessions', query],
    queryFn: () => adminAssistedSessionsService.listSessions(query),
  })
}

export function useAdminAssistedSessionHistory(sessionId: string | null, page = 1, limit = 20) {
  return useQuery({
    queryKey: ['admin', 'support', 'sessions', 'history', sessionId, page, limit],
    queryFn: () => adminAssistedSessionsService.getSessionHistory(sessionId || '', page, limit),
    enabled: Boolean(sessionId),
  })
}

export function useRequestAdminAssistedSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: RequestAssistedSessionPayload) =>
      adminAssistedSessionsService.requestSession(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'support', 'sessions'] })
    },
  })
}

export function useStartAdminAssistedSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (sessionId: string) => adminAssistedSessionsService.startSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'support', 'sessions'] })
    },
  })
}

export function useRevokeAdminAssistedSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      sessionId,
      payload,
    }: {
      sessionId: string
      payload: RevokeAssistedSessionPayload
    }) => adminAssistedSessionsService.revokeSession(sessionId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'support', 'sessions'] })
      queryClient.invalidateQueries({
        queryKey: ['admin', 'support', 'sessions', 'history', variables.sessionId],
      })
    },
  })
}
