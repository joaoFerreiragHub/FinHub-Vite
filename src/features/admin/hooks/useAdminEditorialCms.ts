import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminEditorialCmsService } from '../services/adminEditorialCmsService'
import type {
  AdminAddEditorialSectionItemInput,
  AdminCreateEditorialSectionInput,
  AdminEditorialSectionQuery,
  AdminReorderEditorialSectionItemsPayload,
  AdminUpdateEditorialSectionInput,
} from '../types/adminEditorialCms'

interface AdminEditorialQueryOptions {
  enabled?: boolean
}

interface UpdateSectionMutationInput {
  sectionId: string
  input: AdminUpdateEditorialSectionInput
}

interface AddSectionItemMutationInput {
  sectionId: string
  input: AdminAddEditorialSectionItemInput
}

interface ReorderSectionItemsMutationInput {
  sectionId: string
  payload: AdminReorderEditorialSectionItemsPayload
}

interface RemoveSectionItemMutationInput {
  sectionId: string
  itemId: string
}

export function useAdminEditorialSections(
  query: AdminEditorialSectionQuery,
  options?: AdminEditorialQueryOptions,
) {
  return useQuery({
    queryKey: ['admin', 'editorial', 'sections', query],
    queryFn: () => adminEditorialCmsService.listSections(query),
    enabled: options?.enabled ?? true,
  })
}

export function useAdminEditorialHomePreview(options?: AdminEditorialQueryOptions) {
  return useQuery({
    queryKey: ['editorial', 'home', 'preview'],
    queryFn: () => adminEditorialCmsService.getHomePreview(),
    enabled: options?.enabled ?? true,
  })
}

export function useCreateAdminEditorialSection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: AdminCreateEditorialSectionInput) =>
      adminEditorialCmsService.createSection(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'editorial', 'sections'] })
      queryClient.invalidateQueries({ queryKey: ['editorial', 'home', 'preview'] })
    },
  })
}

export function useUpdateAdminEditorialSection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ sectionId, input }: UpdateSectionMutationInput) =>
      adminEditorialCmsService.updateSection(sectionId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'editorial', 'sections'] })
      queryClient.invalidateQueries({ queryKey: ['editorial', 'home', 'preview'] })
    },
  })
}

export function useAddAdminEditorialSectionItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ sectionId, input }: AddSectionItemMutationInput) =>
      adminEditorialCmsService.addSectionItem(sectionId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'editorial', 'sections'] })
      queryClient.invalidateQueries({ queryKey: ['editorial', 'home', 'preview'] })
    },
  })
}

export function useReorderAdminEditorialSectionItems() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ sectionId, payload }: ReorderSectionItemsMutationInput) =>
      adminEditorialCmsService.reorderSectionItems(sectionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'editorial', 'sections'] })
      queryClient.invalidateQueries({ queryKey: ['editorial', 'home', 'preview'] })
    },
  })
}

export function useRemoveAdminEditorialSectionItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ sectionId, itemId }: RemoveSectionItemMutationInput) =>
      adminEditorialCmsService.removeSectionItem(sectionId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'editorial', 'sections'] })
      queryClient.invalidateQueries({ queryKey: ['editorial', 'home', 'preview'] })
    },
  })
}
