import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminDirectoriesService } from '../services/adminDirectoriesService'
import type {
  AdminDirectoryCreateInput,
  AdminDirectoryListQuery,
  AdminDirectoryUpdateInput,
  AdminDirectoryVertical,
} from '../types/adminDirectories'

interface AdminDirectoriesQueryOptions {
  enabled?: boolean
}

interface CreateDirectoryInput {
  vertical: AdminDirectoryVertical
  input: AdminDirectoryCreateInput
}

interface UpdateDirectoryInput {
  vertical: AdminDirectoryVertical
  entryId: string
  input: AdminDirectoryUpdateInput
}

interface PublishDirectoryInput {
  vertical: AdminDirectoryVertical
  entryId: string
  reason?: string
}

interface ArchiveDirectoryInput {
  vertical: AdminDirectoryVertical
  entryId: string
  reason: string
}

export function useAdminDirectories(
  vertical: AdminDirectoryVertical,
  query: AdminDirectoryListQuery,
  options?: AdminDirectoriesQueryOptions,
) {
  return useQuery({
    queryKey: ['admin', 'directories', vertical, query],
    queryFn: () => adminDirectoriesService.listDirectories(vertical, query),
    enabled: options?.enabled ?? true,
  })
}

export function useCreateAdminDirectory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ vertical, input }: CreateDirectoryInput) =>
      adminDirectoriesService.createDirectory(vertical, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'directories'] })
    },
  })
}

export function useUpdateAdminDirectory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ vertical, entryId, input }: UpdateDirectoryInput) =>
      adminDirectoriesService.updateDirectory(vertical, entryId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'directories'] })
    },
  })
}

export function usePublishAdminDirectory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ vertical, entryId, reason }: PublishDirectoryInput) =>
      adminDirectoriesService.publishDirectory(vertical, entryId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'directories'] })
    },
  })
}

export function useArchiveAdminDirectory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ vertical, entryId, reason }: ArchiveDirectoryInput) =>
      adminDirectoriesService.archiveDirectory(vertical, entryId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'directories'] })
    },
  })
}
