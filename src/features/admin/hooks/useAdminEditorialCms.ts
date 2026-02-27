import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminEditorialCmsService } from '../services/adminEditorialCmsService'
import type {
  AdminAddEditorialSectionItemInput,
  AdminEditorialClaimsQuery,
  AdminCreateEditorialSectionInput,
  AdminOwnershipTransferInput,
  AdminOwnershipTransfersQuery,
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

interface ApproveClaimMutationInput {
  claimId: string
  note?: string
}

interface RejectClaimMutationInput {
  claimId: string
  note?: string
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

export function useAdminEditorialClaims(
  query: AdminEditorialClaimsQuery,
  options?: AdminEditorialQueryOptions,
) {
  return useQuery({
    queryKey: ['admin', 'editorial', 'claims', query],
    queryFn: () => adminEditorialCmsService.listClaims(query),
    enabled: options?.enabled ?? true,
  })
}

export function useAdminOwnershipTransfers(
  query: AdminOwnershipTransfersQuery,
  options?: AdminEditorialQueryOptions,
) {
  return useQuery({
    queryKey: ['admin', 'editorial', 'ownership-transfers', query],
    queryFn: () => adminEditorialCmsService.listOwnershipTransfers(query),
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

export function useApproveAdminEditorialClaim() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ claimId, note }: ApproveClaimMutationInput) =>
      adminEditorialCmsService.approveClaim(claimId, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'editorial', 'claims'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'editorial', 'ownership-transfers'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'directories'] })
    },
  })
}

export function useRejectAdminEditorialClaim() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ claimId, note }: RejectClaimMutationInput) =>
      adminEditorialCmsService.rejectClaim(claimId, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'editorial', 'claims'] })
    },
  })
}

export function useTransferAdminOwnership() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: AdminOwnershipTransferInput) =>
      adminEditorialCmsService.transferOwnership(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'editorial', 'claims'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'editorial', 'ownership-transfers'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'directories'] })
    },
  })
}
