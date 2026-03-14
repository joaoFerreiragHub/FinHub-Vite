import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { brandPortalService } from '../services/brandPortalService'
import type {
  BrandPortalAffiliateLinkClicksQuery,
  BrandPortalAffiliateLinkCreatePayload,
  BrandPortalAffiliateLinkUpdatePayload,
  BrandPortalAffiliateLinksQuery,
  BrandPortalCampaignActionPayload,
  BrandPortalCampaignCreatePayload,
  BrandPortalCampaignUpdatePayload,
  BrandPortalCampaignsQuery,
  BrandPortalIntegrationApiKeyCreatePayload,
  BrandPortalIntegrationApiKeyUsageQuery,
  BrandPortalIntegrationApiKeysQuery,
  BrandPortalWalletTopUpPayload,
  BrandPortalWalletTransactionsQuery,
} from '../types/brandPortal'

interface BrandPortalQueryOptions {
  enabled?: boolean
}

const BRAND_PORTAL_QUERY_KEY = ['brand-portal'] as const

export function useBrandPortalOverview(days = 30, options?: BrandPortalQueryOptions) {
  return useQuery({
    queryKey: [...BRAND_PORTAL_QUERY_KEY, 'overview', days],
    queryFn: () => brandPortalService.getOverview(days),
    enabled: options?.enabled ?? true,
    staleTime: 20_000,
  })
}

export function useBrandPortalDirectories(options?: BrandPortalQueryOptions) {
  return useQuery({
    queryKey: [...BRAND_PORTAL_QUERY_KEY, 'directories'],
    queryFn: () => brandPortalService.listDirectories(),
    enabled: options?.enabled ?? true,
    staleTime: 20_000,
  })
}

export function useBrandPortalWallets(options?: BrandPortalQueryOptions) {
  return useQuery({
    queryKey: [...BRAND_PORTAL_QUERY_KEY, 'wallets'],
    queryFn: () => brandPortalService.listWallets(),
    enabled: options?.enabled ?? true,
    staleTime: 20_000,
  })
}

export function useBrandPortalWallet(
  directoryEntryId: string | null,
  options?: BrandPortalQueryOptions,
) {
  return useQuery({
    queryKey: [...BRAND_PORTAL_QUERY_KEY, 'wallet', directoryEntryId],
    queryFn: () => brandPortalService.getWallet(directoryEntryId || ''),
    enabled: Boolean(directoryEntryId) && (options?.enabled ?? true),
    staleTime: 20_000,
  })
}

export function useBrandPortalWalletTransactions(
  directoryEntryId: string | null,
  query: BrandPortalWalletTransactionsQuery,
  options?: BrandPortalQueryOptions,
) {
  return useQuery({
    queryKey: [...BRAND_PORTAL_QUERY_KEY, 'wallet-transactions', directoryEntryId, query],
    queryFn: () => brandPortalService.listWalletTransactions(directoryEntryId || '', query),
    enabled: Boolean(directoryEntryId) && (options?.enabled ?? true),
    staleTime: 20_000,
  })
}

export function useRequestBrandPortalWalletTopUp() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { directoryEntryId: string; payload: BrandPortalWalletTopUpPayload }) =>
      brandPortalService.requestWalletTopUp(input.directoryEntryId, input.payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: BRAND_PORTAL_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: [...BRAND_PORTAL_QUERY_KEY, 'wallet', variables.directoryEntryId],
      })
      queryClient.invalidateQueries({
        queryKey: [...BRAND_PORTAL_QUERY_KEY, 'wallet-transactions', variables.directoryEntryId],
      })
    },
  })
}

export function useBrandPortalCampaigns(
  query: BrandPortalCampaignsQuery,
  options?: BrandPortalQueryOptions,
) {
  return useQuery({
    queryKey: [...BRAND_PORTAL_QUERY_KEY, 'campaigns', query],
    queryFn: () => brandPortalService.listCampaigns(query),
    enabled: options?.enabled ?? true,
    staleTime: 20_000,
  })
}

export function useCreateBrandPortalCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: BrandPortalCampaignCreatePayload) => brandPortalService.createCampaign(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_PORTAL_QUERY_KEY })
    },
  })
}

export function useUpdateBrandPortalCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { campaignId: string; payload: BrandPortalCampaignUpdatePayload }) =>
      brandPortalService.updateCampaign(input.campaignId, input.payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: BRAND_PORTAL_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: [...BRAND_PORTAL_QUERY_KEY, 'campaign-metrics', variables.campaignId],
      })
    },
  })
}

export function useSubmitBrandPortalCampaignForApproval() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { campaignId: string; payload?: BrandPortalCampaignActionPayload }) =>
      brandPortalService.submitCampaignForApproval(input.campaignId, input.payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: BRAND_PORTAL_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: [...BRAND_PORTAL_QUERY_KEY, 'campaign-metrics', variables.campaignId],
      })
    },
  })
}

export function useBrandPortalCampaignMetrics(
  campaignId: string | null,
  days = 30,
  options?: BrandPortalQueryOptions,
) {
  return useQuery({
    queryKey: [...BRAND_PORTAL_QUERY_KEY, 'campaign-metrics', campaignId, days],
    queryFn: () => brandPortalService.getCampaignMetrics(campaignId || '', days),
    enabled: Boolean(campaignId) && (options?.enabled ?? true),
    staleTime: 20_000,
  })
}

export function useBrandPortalAffiliateLinks(
  query: BrandPortalAffiliateLinksQuery,
  options?: BrandPortalQueryOptions,
) {
  return useQuery({
    queryKey: [...BRAND_PORTAL_QUERY_KEY, 'affiliate-links', query],
    queryFn: () => brandPortalService.listAffiliateLinks(query),
    enabled: options?.enabled ?? true,
    staleTime: 20_000,
  })
}

export function useCreateBrandPortalAffiliateLink() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: BrandPortalAffiliateLinkCreatePayload) =>
      brandPortalService.createAffiliateLink(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_PORTAL_QUERY_KEY })
    },
  })
}

export function useUpdateBrandPortalAffiliateLink() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { linkId: string; patch: BrandPortalAffiliateLinkUpdatePayload }) =>
      brandPortalService.updateAffiliateLink(input.linkId, input.patch),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: BRAND_PORTAL_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: [...BRAND_PORTAL_QUERY_KEY, 'affiliate-clicks', variables.linkId],
      })
    },
  })
}

export function useBrandPortalAffiliateLinkClicks(
  linkId: string | null,
  query: BrandPortalAffiliateLinkClicksQuery,
  options?: BrandPortalQueryOptions,
) {
  return useQuery({
    queryKey: [...BRAND_PORTAL_QUERY_KEY, 'affiliate-clicks', linkId, query],
    queryFn: () => brandPortalService.listAffiliateLinkClicks(linkId || '', query),
    enabled: Boolean(linkId) && (options?.enabled ?? true),
    staleTime: 20_000,
  })
}

export function useBrandPortalIntegrationApiKeys(
  query: BrandPortalIntegrationApiKeysQuery,
  options?: BrandPortalQueryOptions,
) {
  return useQuery({
    queryKey: [...BRAND_PORTAL_QUERY_KEY, 'integration-api-keys', query],
    queryFn: () => brandPortalService.listIntegrationApiKeys(query),
    enabled: options?.enabled ?? true,
    staleTime: 20_000,
  })
}

export function useCreateBrandPortalIntegrationApiKey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: BrandPortalIntegrationApiKeyCreatePayload) =>
      brandPortalService.createIntegrationApiKey(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_PORTAL_QUERY_KEY })
    },
  })
}

export function useRevokeBrandPortalIntegrationApiKey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (keyId: string) => brandPortalService.revokeIntegrationApiKey(keyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_PORTAL_QUERY_KEY })
    },
  })
}

export function useBrandPortalIntegrationApiKeyUsage(
  keyId: string | null,
  query: BrandPortalIntegrationApiKeyUsageQuery,
  options?: BrandPortalQueryOptions,
) {
  return useQuery({
    queryKey: [...BRAND_PORTAL_QUERY_KEY, 'integration-api-key-usage', keyId, query],
    queryFn: () => brandPortalService.listIntegrationApiKeyUsage(keyId || '', query),
    enabled: Boolean(keyId) && (options?.enabled ?? true),
    staleTime: 20_000,
  })
}
