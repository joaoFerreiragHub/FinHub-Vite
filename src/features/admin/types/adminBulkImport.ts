import type { AdminActorSummary } from './adminUsers'

export type AdminBulkImportType = 'subscription_entitlements' | 'ad_campaign_status'
export type AdminBulkImportStatus = 'running' | 'completed' | 'completed_with_errors' | 'failed'
export type AdminBulkImportRowStatus = 'success' | 'failed' | 'skipped'

export interface AdminBulkImportJobSource {
  format: 'csv'
  delimiter: string
  headers: string[]
}

export interface AdminBulkImportJobSummary {
  totalRows: number
  validRows: number
  processedRows: number
  succeededRows: number
  failedRows: number
  skippedRows: number
  warningsCount: number
  errorsCount: number
}

export interface AdminBulkImportJobErrorRow {
  rowNumber: number
  code: string
  message: string
  targetType: string | null
  targetId: string | null
}

export interface AdminBulkImportJobResultRow {
  rowNumber: number
  status: AdminBulkImportRowStatus
  message: string
  targetType: string | null
  targetId: string | null
}

export interface AdminBulkImportJobItem {
  id: string
  importType: AdminBulkImportType
  status: AdminBulkImportStatus
  dryRun: boolean
  reason: string
  note: string | null
  source: AdminBulkImportJobSource
  summary: AdminBulkImportJobSummary
  stats: Record<string, number>
  actor: AdminActorSummary | null
  startedAt: string | null
  finishedAt: string | null
  createdAt: string | null
  updatedAt: string | null
  warnings?: string[]
  errors?: AdminBulkImportJobErrorRow[]
  results?: AdminBulkImportJobResultRow[]
}

export interface AdminBulkImportPagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface AdminBulkImportJobsQuery {
  importType?: AdminBulkImportType
  status?: AdminBulkImportStatus
  dryRun?: boolean
  page?: number
  limit?: number
}

export interface AdminBulkImportJobsResponse {
  items: AdminBulkImportJobItem[]
  pagination: AdminBulkImportPagination
}

export interface AdminBulkImportPreviewRowSample {
  rowNumber: number
  status: 'valid' | 'invalid' | 'skipped'
  code: string
  message: string
  targetType: string | null
  targetId: string | null
}

export interface AdminBulkImportPreviewResponse {
  importType: AdminBulkImportType
  source: {
    delimiter: string
    headers: string[]
    totalRows: number
  }
  summary: {
    totalRows: number
    validRows: number
    failedRows: number
    skippedRows: number
    warningsCount: number
  }
  stats: Record<string, number>
  warnings: string[]
  rowsSample: AdminBulkImportPreviewRowSample[]
}

export interface AdminBulkImportPreviewPayload {
  importType: AdminBulkImportType
  csv: string
  delimiter?: string
}

export interface AdminBulkImportCreatePayload {
  importType: AdminBulkImportType
  csv: string
  delimiter?: string
  dryRun: boolean
  reason: string
  note?: string
}

export interface AdminBulkImportCreateResponse {
  message: string
  item: AdminBulkImportJobItem
}
