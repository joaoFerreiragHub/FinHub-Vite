import type { AdminActorSummary } from './adminUsers'

export type AdminSubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled'
export type AdminSubscriptionBillingCycle = 'monthly' | 'annual' | 'lifetime' | 'custom'
export type AdminSubscriptionSource = 'manual_admin' | 'internal' | 'stripe' | 'import'
export type AdminSubscriptionEligibleRole = 'free' | 'premium'

export interface AdminSubscriptionUserSummary {
  id: string
  name?: string
  username?: string
  email?: string
  role?: AdminSubscriptionEligibleRole
  accountStatus?: string
  subscriptionExpiry?: string | null
}

export interface AdminSubscriptionHistoryEntry {
  version: number
  action: string
  reason: string
  note: string | null
  changedAt: string | null
  changedBy: AdminActorSummary | null
  snapshot: Record<string, unknown> | null
}

export interface AdminSubscriptionItem {
  id: string
  user: AdminSubscriptionUserSummary | null
  planCode: string
  planLabel: string
  billingCycle: AdminSubscriptionBillingCycle
  status: AdminSubscriptionStatus
  derivedStatus: AdminSubscriptionStatus
  entitlementActive: boolean
  currentPeriodStart: string | null
  currentPeriodEnd: string | null
  trialEndsAt: string | null
  canceledAt: string | null
  cancelAtPeriodEnd: boolean
  source: AdminSubscriptionSource
  externalSubscriptionId: string | null
  metadata: Record<string, unknown> | null
  version: number
  createdBy: AdminActorSummary | null
  updatedBy: AdminActorSummary | null
  historyCount: number
  lastHistoryEntry: AdminSubscriptionHistoryEntry | null
  history?: AdminSubscriptionHistoryEntry[]
  createdAt: string | null
  updatedAt: string | null
}

export interface AdminSubscriptionPagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface AdminSubscriptionListSummary {
  active: number
  trialing: number
  pastDue: number
  canceled: number
  entitlementActive: number
  total: number
}

export interface AdminSubscriptionListQuery {
  status?: AdminSubscriptionStatus
  planCode?: string
  periodFrom?: string
  periodTo?: string
  search?: string
  page?: number
  limit?: number
}

export interface AdminSubscriptionListResponse {
  items: AdminSubscriptionItem[]
  pagination: AdminSubscriptionPagination
  summary: AdminSubscriptionListSummary
}

export interface AdminSubscriptionMutationResponse {
  message: string
  item: AdminSubscriptionItem
}

export interface AdminExtendSubscriptionTrialPayload {
  reason: string
  note?: string
  days?: number
  trialEndsAt?: string
}

export interface AdminRevokeSubscriptionEntitlementPayload {
  reason: string
  note?: string
  nextStatus?: 'past_due' | 'canceled'
}

export interface AdminReactivateSubscriptionPayload {
  reason: string
  note?: string
  periodDays?: number
  planCode?: string
  planLabel?: string
  billingCycle?: AdminSubscriptionBillingCycle
}
