import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminUsersService } from '../services/adminUsersService'
import type {
  AdminAddNotePayload,
  AdminCreatorControlPayload,
  AdminUserActionPayload,
  AdminUserListQuery,
} from '../types/adminUsers'

interface AdminUserMutationInput {
  userId: string
  payload: AdminUserActionPayload
}

interface AdminAddNoteMutationInput {
  userId: string
  payload: AdminAddNotePayload
}

interface AdminCreatorControlMutationInput {
  userId: string
  payload: AdminCreatorControlPayload
}

interface AdminUsersQueryOptions {
  enabled?: boolean
}

export function useAdminUsers(query: AdminUserListQuery, options?: AdminUsersQueryOptions) {
  return useQuery({
    queryKey: ['admin', 'users', query],
    queryFn: () => adminUsersService.listUsers(query),
    enabled: options?.enabled ?? true,
  })
}

export function useAdminUserHistory(userId: string | null, page = 1, limit = 10) {
  return useQuery({
    queryKey: ['admin', 'users', 'history', userId, page, limit],
    queryFn: () => adminUsersService.getUserModerationHistory(userId || '', page, limit),
    enabled: Boolean(userId),
  })
}

export function useAdminUserTrustProfile(userId: string | null) {
  return useQuery({
    queryKey: ['admin', 'users', 'trust-profile', userId],
    queryFn: () => adminUsersService.getCreatorTrustProfile(userId || ''),
    enabled: Boolean(userId),
  })
}

export function useSuspendAdminUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, payload }: AdminUserMutationInput) =>
      adminUsersService.suspendUser(userId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'history', variables.userId] })
    },
  })
}

export function useBanAdminUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, payload }: AdminUserMutationInput) =>
      adminUsersService.banUser(userId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'history', variables.userId] })
    },
  })
}

export function useUnbanAdminUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, payload }: AdminUserMutationInput) =>
      adminUsersService.unbanUser(userId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'history', variables.userId] })
    },
  })
}

export function useForceLogoutAdminUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, payload }: AdminUserMutationInput) =>
      adminUsersService.forceLogoutUser(userId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'history', variables.userId] })
    },
  })
}

export function useAddAdminUserNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, payload }: AdminAddNoteMutationInput) =>
      adminUsersService.addUserInternalNote(userId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'history', variables.userId] })
    },
  })
}

export function useApplyAdminCreatorControls() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, payload }: AdminCreatorControlMutationInput) =>
      adminUsersService.applyCreatorControls(userId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'history', variables.userId] })
      queryClient.invalidateQueries({
        queryKey: ['admin', 'users', 'trust-profile', variables.userId],
      })
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'queue'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'metrics', 'overview'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'alerts', 'internal'] })
    },
  })
}
