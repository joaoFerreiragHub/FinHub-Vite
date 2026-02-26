import { apiClient } from '@/lib/api/client'

export type EditorialClaimStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'

export type EditorialClaimTargetType =
  | 'article'
  | 'video'
  | 'course'
  | 'live'
  | 'podcast'
  | 'book'
  | 'directory_entry'

export interface EditorialClaimActorSummary {
  id: string
  name?: string
  username?: string
  email?: string
  role?: string
}

export interface EditorialClaimRecord {
  id: string
  targetType: EditorialClaimTargetType
  targetId: string
  creator: EditorialClaimActorSummary | null
  requestedBy: EditorialClaimActorSummary | null
  status: EditorialClaimStatus
  reason: string
  note: string | null
  evidenceLinks: string[]
  reviewedBy: EditorialClaimActorSummary | null
  reviewedAt: string | null
  reviewNote: string | null
  metadata: Record<string, unknown> | null
  createdAt: string | null
  updatedAt: string | null
}

export interface EditorialClaimsPagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface EditorialClaimsListResponse {
  items: EditorialClaimRecord[]
  pagination: EditorialClaimsPagination
}

export interface EditorialMyClaimsQuery {
  status?: EditorialClaimStatus
  targetType?: EditorialClaimTargetType
  page?: number
  limit?: number
}

export interface CreateEditorialClaimInput {
  targetType: EditorialClaimTargetType
  targetId: string
  reason: string
  note?: string
  evidenceLinks?: string[]
}

export interface CancelEditorialClaimInput {
  note?: string
}

interface BackendClaimActorSummary {
  id?: string
  _id?: string
  name?: string
  username?: string
  email?: string
  role?: string
}

interface BackendClaimRecord {
  id?: string
  _id?: string
  targetType?: string
  targetId?: string
  creatorId?: BackendClaimActorSummary | string | null
  requestedBy?: BackendClaimActorSummary | string | null
  status?: string
  reason?: string
  note?: string | null
  evidenceLinks?: string[]
  reviewedBy?: BackendClaimActorSummary | string | null
  reviewedAt?: string | null
  reviewNote?: string | null
  metadata?: Record<string, unknown> | null
  createdAt?: string | null
  updatedAt?: string | null
}

interface BackendClaimsListResponse {
  items?: BackendClaimRecord[]
  pagination?: Partial<EditorialClaimsPagination>
}

const resolveId = (value: unknown): string | null => {
  if (typeof value === 'string' && value.length > 0) return value

  if (value && typeof value === 'object') {
    const maybeId = (value as { id?: unknown; _id?: unknown }).id
    if (typeof maybeId === 'string' && maybeId.length > 0) return maybeId

    const maybeObjectId = (value as { _id?: unknown })._id
    if (typeof maybeObjectId === 'string' && maybeObjectId.length > 0) return maybeObjectId
  }

  return null
}

const toClaimStatus = (value: unknown): EditorialClaimStatus => {
  if (value === 'approved') return 'approved'
  if (value === 'rejected') return 'rejected'
  if (value === 'cancelled') return 'cancelled'
  return 'pending'
}

const toClaimTargetType = (value: unknown): EditorialClaimTargetType => {
  if (value === 'article') return 'article'
  if (value === 'video') return 'video'
  if (value === 'course') return 'course'
  if (value === 'live') return 'live'
  if (value === 'podcast') return 'podcast'
  if (value === 'book') return 'book'
  return 'directory_entry'
}

const normalizePagination = (
  pagination?: Partial<EditorialClaimsPagination>,
): EditorialClaimsPagination => ({
  page: pagination?.page && pagination.page > 0 ? pagination.page : 1,
  limit: pagination?.limit && pagination.limit > 0 ? pagination.limit : 25,
  total: pagination?.total && pagination.total >= 0 ? pagination.total : 0,
  pages: pagination?.pages && pagination.pages > 0 ? pagination.pages : 1,
})

const cleanOptionalText = (value: string | undefined): string | undefined => {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

const toActor = (
  actor: BackendClaimActorSummary | string | null | undefined,
): EditorialClaimActorSummary | null => {
  if (!actor) return null
  const id = resolveId(actor)
  if (!id) return null

  if (typeof actor === 'string') {
    return { id }
  }

  return {
    id,
    name: actor.name,
    username: actor.username,
    email: actor.email,
    role: actor.role,
  }
}

const toClaim = (record: BackendClaimRecord): EditorialClaimRecord | null => {
  const id = resolveId(record)
  const targetId = resolveId(record.targetId)
  if (!id || !targetId) return null

  return {
    id,
    targetType: toClaimTargetType(record.targetType),
    targetId,
    creator: toActor(record.creatorId),
    requestedBy: toActor(record.requestedBy),
    status: toClaimStatus(record.status),
    reason: typeof record.reason === 'string' ? record.reason : '',
    note: typeof record.note === 'string' ? record.note : null,
    evidenceLinks: Array.isArray(record.evidenceLinks) ? record.evidenceLinks : [],
    reviewedBy: toActor(record.reviewedBy),
    reviewedAt: typeof record.reviewedAt === 'string' ? record.reviewedAt : null,
    reviewNote: typeof record.reviewNote === 'string' ? record.reviewNote : null,
    metadata: record.metadata ?? null,
    createdAt: typeof record.createdAt === 'string' ? record.createdAt : null,
    updatedAt: typeof record.updatedAt === 'string' ? record.updatedAt : null,
  }
}

const buildQueryParams = (query: EditorialMyClaimsQuery): Record<string, string | number> => {
  const params: Record<string, string | number> = {}
  if (query.status) params.status = query.status
  if (query.targetType) params.targetType = query.targetType
  if (typeof query.page === 'number' && query.page > 0) params.page = query.page
  if (typeof query.limit === 'number' && query.limit > 0) params.limit = query.limit
  return params
}

const normalizeEvidenceLinks = (evidenceLinks?: string[]): string[] => {
  if (!Array.isArray(evidenceLinks)) return []
  return evidenceLinks
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
    .slice(0, 10)
}

export const editorialClaimsService = {
  listMyClaims: async (
    query: EditorialMyClaimsQuery = {},
  ): Promise<EditorialClaimsListResponse> => {
    const response = await apiClient.get<BackendClaimsListResponse>('/editorial/claims/my', {
      params: buildQueryParams(query),
    })

    return {
      items: (response.data.items ?? [])
        .map(toClaim)
        .filter((item): item is EditorialClaimRecord => item !== null),
      pagination: normalizePagination(response.data.pagination),
    }
  },

  createMyClaim: async (input: CreateEditorialClaimInput): Promise<EditorialClaimRecord> => {
    const targetId = input.targetId.trim()
    if (targetId.length === 0) {
      throw new Error('targetId obrigatorio.')
    }

    const reason = input.reason.trim()
    if (reason.length === 0) {
      throw new Error('reason obrigatorio.')
    }

    const payload: Record<string, unknown> = {
      targetType: input.targetType,
      targetId,
      reason,
    }

    const note = cleanOptionalText(input.note)
    if (note) payload.note = note

    const evidenceLinks = normalizeEvidenceLinks(input.evidenceLinks)
    if (evidenceLinks.length > 0) payload.evidenceLinks = evidenceLinks

    const response = await apiClient.post<BackendClaimRecord>('/editorial/claims', payload)
    const claim = toClaim(response.data)
    if (!claim) {
      throw new Error('Resposta invalida: claim em falta.')
    }
    return claim
  },

  cancelMyClaim: async (
    claimId: string,
    input: CancelEditorialClaimInput = {},
  ): Promise<EditorialClaimRecord> => {
    const payload: Record<string, unknown> = {}
    const note = cleanOptionalText(input.note)
    if (note) payload.note = note

    const response = await apiClient.post<BackendClaimRecord>(
      `/editorial/claims/${claimId}/cancel`,
      payload,
    )
    const claim = toClaim(response.data)
    if (!claim) {
      throw new Error('Resposta invalida: claim em falta.')
    }
    return claim
  },
}
