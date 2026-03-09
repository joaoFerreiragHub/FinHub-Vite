import { apiClient } from '@/lib/api/client'
import type {
  AdminBulkImportCreatePayload,
  AdminBulkImportCreateResponse,
  AdminBulkImportJobErrorRow,
  AdminBulkImportJobItem,
  AdminBulkImportJobResultRow,
  AdminBulkImportJobsQuery,
  AdminBulkImportJobsResponse,
  AdminBulkImportPagination,
  AdminBulkImportPreviewPayload,
  AdminBulkImportPreviewResponse,
  AdminBulkImportPreviewRowSample,
  AdminBulkImportRowStatus,
  AdminBulkImportStatus,
  AdminBulkImportType,
} from '../types/adminBulkImport'
import type { AdminActorSummary } from '../types/adminUsers'

interface BackendActorSummary {
  id?: string
  _id?: string
  name?: string
  username?: string
  email?: string
  role?: string
}

interface BackendBulkImportSource {
  format?: string
  delimiter?: string
  headers?: string[]
}

interface BackendBulkImportSummary {
  totalRows?: number
  validRows?: number
  processedRows?: number
  succeededRows?: number
  failedRows?: number
  skippedRows?: number
  warningsCount?: number
  errorsCount?: number
}

interface BackendBulkImportErrorRow {
  rowNumber?: number
  code?: string
  message?: string
  targetType?: string | null
  targetId?: string | null
}

interface BackendBulkImportResultRow {
  rowNumber?: number
  status?: string
  message?: string
  targetType?: string | null
  targetId?: string | null
}

interface BackendBulkImportJobItem {
  id?: string
  _id?: string
  importType?: string
  status?: string
  dryRun?: boolean
  reason?: string
  note?: string | null
  source?: BackendBulkImportSource
  summary?: BackendBulkImportSummary
  stats?: Record<string, unknown> | null
  actor?: BackendActorSummary | null
  startedAt?: string | null
  finishedAt?: string | null
  createdAt?: string | null
  updatedAt?: string | null
  warnings?: string[]
  errors?: BackendBulkImportErrorRow[]
  results?: BackendBulkImportResultRow[]
}

interface BackendBulkImportJobsResponse {
  items?: BackendBulkImportJobItem[]
  pagination?: Partial<AdminBulkImportPagination>
}

interface BackendBulkImportPreviewRowSample {
  rowNumber?: number
  status?: string
  code?: string
  message?: string
  targetType?: string | null
  targetId?: string | null
}

interface BackendBulkImportPreviewResponse {
  importType?: string
  source?: {
    delimiter?: string
    headers?: string[]
    totalRows?: number
  }
  summary?: {
    totalRows?: number
    validRows?: number
    failedRows?: number
    skippedRows?: number
    warningsCount?: number
  }
  stats?: Record<string, unknown> | null
  warnings?: string[]
  rowsSample?: BackendBulkImportPreviewRowSample[]
}

interface BackendBulkImportCreateResponse {
  message?: string
  item?: BackendBulkImportJobItem
}

const BULK_IMPORT_TYPES = new Set<AdminBulkImportType>([
  'subscription_entitlements',
  'ad_campaign_status',
])

const BULK_IMPORT_STATUSES = new Set<AdminBulkImportStatus>([
  'running',
  'completed',
  'completed_with_errors',
  'failed',
])

const BULK_IMPORT_ROW_STATUSES = new Set<AdminBulkImportRowStatus>(['success', 'failed', 'skipped'])

const BULK_IMPORT_PREVIEW_ROW_STATUSES = new Set<'valid' | 'invalid' | 'skipped'>([
  'valid',
  'invalid',
  'skipped',
])

const toNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback

const toPositiveInt = (value: unknown, fallback: number): number => {
  const parsed =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number.parseInt(value, 10)
        : Number.NaN
  if (!Number.isFinite(parsed) || parsed < 1) return fallback
  return Math.trunc(parsed)
}

const toString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

const toOptionalString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim().length > 0 ? value : undefined

const toNullableString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim().length > 0 ? value : null

const toIsoDateOrNull = (value: unknown): string | null => {
  if (typeof value !== 'string' || value.trim().length === 0) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
}

const toBulkImportType = (value: unknown): AdminBulkImportType =>
  typeof value === 'string' && BULK_IMPORT_TYPES.has(value as AdminBulkImportType)
    ? (value as AdminBulkImportType)
    : 'subscription_entitlements'

const toBulkImportStatus = (value: unknown): AdminBulkImportStatus =>
  typeof value === 'string' && BULK_IMPORT_STATUSES.has(value as AdminBulkImportStatus)
    ? (value as AdminBulkImportStatus)
    : 'running'

const toBulkImportRowStatus = (value: unknown): AdminBulkImportRowStatus =>
  typeof value === 'string' && BULK_IMPORT_ROW_STATUSES.has(value as AdminBulkImportRowStatus)
    ? (value as AdminBulkImportRowStatus)
    : 'success'

const toPreviewRowStatus = (value: unknown): 'valid' | 'invalid' | 'skipped' =>
  typeof value === 'string' &&
  BULK_IMPORT_PREVIEW_ROW_STATUSES.has(value as 'valid' | 'invalid' | 'skipped')
    ? (value as 'valid' | 'invalid' | 'skipped')
    : 'invalid'

const normalizeStats = (value: unknown): Record<string, number> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}

  const output: Record<string, number> = {}
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (typeof key !== 'string' || key.length === 0) continue
    output[key] = toNumber(entry, 0)
  }
  return output
}

const mapActor = (actor?: BackendActorSummary | null): AdminActorSummary | null => {
  if (!actor || typeof actor !== 'object') return null

  const id = toOptionalString(actor.id) ?? toOptionalString(actor._id)
  if (!id) return null

  return {
    id,
    name: toOptionalString(actor.name),
    username: toOptionalString(actor.username),
    email: toOptionalString(actor.email),
    role:
      actor.role === 'visitor' ||
      actor.role === 'free' ||
      actor.role === 'premium' ||
      actor.role === 'creator' ||
      actor.role === 'admin'
        ? actor.role
        : undefined,
  }
}

const mapErrorRow = (value: BackendBulkImportErrorRow): AdminBulkImportJobErrorRow => ({
  rowNumber: toPositiveInt(value.rowNumber, 1),
  code: toString(value.code, 'error'),
  message: toString(value.message, ''),
  targetType: toNullableString(value.targetType),
  targetId: toNullableString(value.targetId),
})

const mapResultRow = (value: BackendBulkImportResultRow): AdminBulkImportJobResultRow => ({
  rowNumber: toPositiveInt(value.rowNumber, 1),
  status: toBulkImportRowStatus(value.status),
  message: toString(value.message, ''),
  targetType: toNullableString(value.targetType),
  targetId: toNullableString(value.targetId),
})

const mapJob = (value: BackendBulkImportJobItem): AdminBulkImportJobItem | null => {
  const id = toOptionalString(value.id) ?? toOptionalString(value._id)
  if (!id) return null

  return {
    id,
    importType: toBulkImportType(value.importType),
    status: toBulkImportStatus(value.status),
    dryRun: value.dryRun === true,
    reason: toString(value.reason, ''),
    note: toNullableString(value.note),
    source: {
      format: value.source?.format === 'csv' ? 'csv' : 'csv',
      delimiter: toString(value.source?.delimiter, ','),
      headers: Array.isArray(value.source?.headers)
        ? value.source?.headers.filter((header): header is string => typeof header === 'string')
        : [],
    },
    summary: {
      totalRows: toNumber(value.summary?.totalRows, 0),
      validRows: toNumber(value.summary?.validRows, 0),
      processedRows: toNumber(value.summary?.processedRows, 0),
      succeededRows: toNumber(value.summary?.succeededRows, 0),
      failedRows: toNumber(value.summary?.failedRows, 0),
      skippedRows: toNumber(value.summary?.skippedRows, 0),
      warningsCount: toNumber(value.summary?.warningsCount, 0),
      errorsCount: toNumber(value.summary?.errorsCount, 0),
    },
    stats: normalizeStats(value.stats),
    actor: mapActor(value.actor),
    startedAt: toIsoDateOrNull(value.startedAt),
    finishedAt: toIsoDateOrNull(value.finishedAt),
    createdAt: toIsoDateOrNull(value.createdAt),
    updatedAt: toIsoDateOrNull(value.updatedAt),
    warnings: Array.isArray(value.warnings)
      ? value.warnings.filter((entry): entry is string => typeof entry === 'string')
      : undefined,
    errors: Array.isArray(value.errors) ? value.errors.map(mapErrorRow) : undefined,
    results: Array.isArray(value.results) ? value.results.map(mapResultRow) : undefined,
  }
}

const mapPreviewRow = (
  value: BackendBulkImportPreviewRowSample,
): AdminBulkImportPreviewRowSample => ({
  rowNumber: toPositiveInt(value.rowNumber, 1),
  status: toPreviewRowStatus(value.status),
  code: toString(value.code, ''),
  message: toString(value.message, ''),
  targetType: toNullableString(value.targetType),
  targetId: toNullableString(value.targetId),
})

const normalizePagination = (
  pagination?: Partial<AdminBulkImportPagination>,
): AdminBulkImportPagination => ({
  page: toPositiveInt(pagination?.page, 1),
  limit: toPositiveInt(pagination?.limit, 20),
  total: toNumber(pagination?.total, 0),
  pages: toPositiveInt(pagination?.pages, 1),
})

const trimOptionalValue = (value: string | undefined): string | undefined => {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

const mapCreatePayload = (payload: AdminBulkImportCreatePayload): Record<string, unknown> => ({
  importType: payload.importType,
  csv: payload.csv,
  delimiter: trimOptionalValue(payload.delimiter),
  dryRun: payload.dryRun === true,
  reason: payload.reason,
  note: trimOptionalValue(payload.note),
})

const toListQueryParams = (
  query: AdminBulkImportJobsQuery,
): Record<string, string | number | boolean> => {
  const params: Record<string, string | number | boolean> = {}
  if (query.importType) params.importType = query.importType
  if (query.status) params.status = query.status
  if (typeof query.dryRun === 'boolean') params.dryRun = query.dryRun
  if (typeof query.page === 'number' && query.page > 0) params.page = query.page
  if (typeof query.limit === 'number' && query.limit > 0) params.limit = query.limit
  return params
}

export const adminBulkImportService = {
  listJobs: async (query: AdminBulkImportJobsQuery): Promise<AdminBulkImportJobsResponse> => {
    const response = await apiClient.get<BackendBulkImportJobsResponse>(
      '/admin/operations/bulk-import/jobs',
      {
        params: toListQueryParams(query),
      },
    )

    return {
      items: (response.data.items ?? [])
        .map(mapJob)
        .filter((item): item is AdminBulkImportJobItem => item !== null),
      pagination: normalizePagination(response.data.pagination),
    }
  },

  getJob: async (jobId: string): Promise<AdminBulkImportJobItem> => {
    const response = await apiClient.get<BackendBulkImportJobItem>(
      `/admin/operations/bulk-import/jobs/${encodeURIComponent(jobId)}`,
    )
    const item = mapJob(response.data)
    if (!item) {
      throw new Error('Resposta admin invalida: job bulk import em falta.')
    }
    return item
  },

  preview: async (
    payload: AdminBulkImportPreviewPayload,
  ): Promise<AdminBulkImportPreviewResponse> => {
    const response = await apiClient.post<BackendBulkImportPreviewResponse>(
      '/admin/operations/bulk-import/preview',
      {
        importType: payload.importType,
        csv: payload.csv,
        delimiter: trimOptionalValue(payload.delimiter),
      },
    )

    return {
      importType: toBulkImportType(response.data.importType),
      source: {
        delimiter: toString(response.data.source?.delimiter, ','),
        headers: Array.isArray(response.data.source?.headers)
          ? response.data.source.headers.filter(
              (entry): entry is string => typeof entry === 'string',
            )
          : [],
        totalRows: toNumber(response.data.source?.totalRows, 0),
      },
      summary: {
        totalRows: toNumber(response.data.summary?.totalRows, 0),
        validRows: toNumber(response.data.summary?.validRows, 0),
        failedRows: toNumber(response.data.summary?.failedRows, 0),
        skippedRows: toNumber(response.data.summary?.skippedRows, 0),
        warningsCount: toNumber(response.data.summary?.warningsCount, 0),
      },
      stats: normalizeStats(response.data.stats),
      warnings: Array.isArray(response.data.warnings)
        ? response.data.warnings.filter((entry): entry is string => typeof entry === 'string')
        : [],
      rowsSample: Array.isArray(response.data.rowsSample)
        ? response.data.rowsSample.map(mapPreviewRow)
        : [],
    }
  },

  createJob: async (
    payload: AdminBulkImportCreatePayload,
  ): Promise<AdminBulkImportCreateResponse> => {
    const response = await apiClient.post<BackendBulkImportCreateResponse>(
      '/admin/operations/bulk-import/jobs',
      mapCreatePayload(payload),
    )

    const item = mapJob(response.data.item ?? {})
    if (!item) {
      throw new Error('Resposta admin invalida: item de bulk import em falta.')
    }

    return {
      message: toString(response.data.message, 'Job de bulk import executado com sucesso.'),
      item,
    }
  },
}
