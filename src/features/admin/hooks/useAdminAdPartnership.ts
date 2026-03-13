import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminAdPartnershipService } from '../services/adminAdPartnershipService'
import type {
  AdminAdCampaignMutationPayload,
  AdminAdCampaignsListQuery,
  AdminAdSlotMutationPayload,
  AdminAdSlotsListQuery,
  AdminAdStatusActionPayload,
} from '../types/adminAdPartnership'

interface AdminAdQueryOptions {
  enabled?: boolean
}

const ADMIN_AD_QUERY_KEY = ['admin', 'ads', 'partnership'] as const

export function useAdminAdsInventoryOverview(options?: AdminAdQueryOptions) {
  return useQuery({
    queryKey: [...ADMIN_AD_QUERY_KEY, 'inventory-overview'],
    queryFn: () => adminAdPartnershipService.inventoryOverview(),
    enabled: options?.enabled ?? true,
    staleTime: 20_000,
  })
}

export function useAdminAdSlots(query: AdminAdSlotsListQuery, options?: AdminAdQueryOptions) {
  return useQuery({
    queryKey: [...ADMIN_AD_QUERY_KEY, 'slots', query],
    queryFn: () => adminAdPartnershipService.listSlots(query),
    enabled: options?.enabled ?? true,
    staleTime: 20_000,
  })
}

export function useAdminAdCampaigns(
  query: AdminAdCampaignsListQuery,
  options?: AdminAdQueryOptions,
) {
  return useQuery({
    queryKey: [...ADMIN_AD_QUERY_KEY, 'campaigns', query],
    queryFn: () => adminAdPartnershipService.listCampaigns(query),
    enabled: options?.enabled ?? true,
    staleTime: 20_000,
  })
}

export function useAdminAdCampaign(
  campaignId: string | null,
  options?: AdminAdQueryOptions,
) {
  return useQuery({
    queryKey: [...ADMIN_AD_QUERY_KEY, 'campaign', campaignId],
    queryFn: () => adminAdPartnershipService.getCampaign(campaignId || ''),
    enabled: Boolean(campaignId) && (options?.enabled ?? true),
    staleTime: 20_000,
  })
}

export function useAdminAdCampaignMetrics(
  campaignId: string | null,
  days: number,
  options?: AdminAdQueryOptions,
) {
  return useQuery({
    queryKey: [...ADMIN_AD_QUERY_KEY, 'campaign-metrics', campaignId, days],
    queryFn: () => adminAdPartnershipService.getCampaignMetrics(campaignId || '', days),
    enabled: Boolean(campaignId) && (options?.enabled ?? true),
    staleTime: 15_000,
  })
}

export function useCreateAdminAdSlot() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AdminAdSlotMutationPayload) => adminAdPartnershipService.createSlot(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_AD_QUERY_KEY })
    },
  })
}

export function useUpdateAdminAdSlot() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { slotId: string; payload: AdminAdSlotMutationPayload }) =>
      adminAdPartnershipService.updateSlot(input.slotId, input.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_AD_QUERY_KEY })
    },
  })
}

export function useCreateAdminAdCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AdminAdCampaignMutationPayload) =>
      adminAdPartnershipService.createCampaign(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_AD_QUERY_KEY })
    },
  })
}

export function useUpdateAdminAdCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { campaignId: string; payload: AdminAdCampaignMutationPayload }) =>
      adminAdPartnershipService.updateCampaign(input.campaignId, input.payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_AD_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_AD_QUERY_KEY, 'campaign', variables.campaignId],
      })
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_AD_QUERY_KEY, 'campaign-metrics', variables.campaignId],
      })
    },
  })
}

export function useSubmitAdminAdCampaignForApproval() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { campaignId: string; payload: AdminAdStatusActionPayload }) =>
      adminAdPartnershipService.submitCampaignForApproval(input.campaignId, input.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_AD_QUERY_KEY })
    },
  })
}

export function useApproveAdminAdCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { campaignId: string; payload: AdminAdStatusActionPayload }) =>
      adminAdPartnershipService.approveCampaign(input.campaignId, input.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_AD_QUERY_KEY })
    },
  })
}

export function useRejectAdminAdCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { campaignId: string; payload: AdminAdStatusActionPayload }) =>
      adminAdPartnershipService.rejectCampaign(input.campaignId, input.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_AD_QUERY_KEY })
    },
  })
}

export function useActivateAdminAdCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { campaignId: string; payload: AdminAdStatusActionPayload }) =>
      adminAdPartnershipService.activateCampaign(input.campaignId, input.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_AD_QUERY_KEY })
    },
  })
}

export function usePauseAdminAdCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { campaignId: string; payload: AdminAdStatusActionPayload }) =>
      adminAdPartnershipService.pauseCampaign(input.campaignId, input.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_AD_QUERY_KEY })
    },
  })
}
