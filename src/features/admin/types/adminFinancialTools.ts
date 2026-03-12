export type AdminFinancialToolKey = 'stocks' | 'etf' | 'reit' | 'crypto'
export type AdminFinancialToolVertical = 'equities' | 'funds' | 'real_estate' | 'digital_assets'
export type AdminFinancialToolEnvironment = 'development' | 'staging' | 'production'
export type AdminFinancialToolExperienceMode = 'legacy' | 'standard' | 'enhanced'

export interface AdminFinancialToolConfigSnapshot {
  enabled: boolean
  maxSymbolsPerRequest: number
  cacheTtlSeconds: number
  requestsPerMinute: number
  experienceMode: AdminFinancialToolExperienceMode
}

export interface AdminFinancialToolConfigOverride {
  enabled?: boolean
  maxSymbolsPerRequest?: number
  cacheTtlSeconds?: number
  requestsPerMinute?: number
  experienceMode?: AdminFinancialToolExperienceMode
}

export interface AdminFinancialToolControlItem {
  id: string
  tool: AdminFinancialToolKey
  vertical: AdminFinancialToolVertical
  label: string
  notes: string | null
  baseConfig: AdminFinancialToolConfigSnapshot
  envOverrides: Record<AdminFinancialToolEnvironment, AdminFinancialToolConfigOverride>
  effectiveConfig: AdminFinancialToolConfigSnapshot
  version: number
  createdAt: string
  updatedAt: string
}

export interface AdminFinancialToolsListResponse {
  environment: AdminFinancialToolEnvironment
  items: AdminFinancialToolControlItem[]
  generatedAt: string
}

export interface AdminFinancialToolListQuery {
  environment?: AdminFinancialToolEnvironment
  tool?: AdminFinancialToolKey
}

export interface AdminFinancialToolUpdatePayload {
  reason: string
  note?: string
  label?: string
  notes?: string | null
  baseConfig?: Partial<AdminFinancialToolConfigSnapshot>
  envOverrides?: Partial<Record<AdminFinancialToolEnvironment, AdminFinancialToolConfigOverride | null>>
}

export interface AdminFinancialToolUpdateResponse {
  message: string
  item: AdminFinancialToolControlItem
}

export interface AdminFinancialToolUsageDailyPoint {
  day: string
  requests: number
  success: number
  clientError: number
  serverError: number
  avgLatencyMs: number
  maxLatencyMs: number
}

export interface AdminFinancialToolUsageByTool {
  tool: AdminFinancialToolKey
  vertical: AdminFinancialToolVertical
  label: string
  requests: number
  authenticatedRequests: number
  successCount: number
  clientErrorCount: number
  serverErrorCount: number
  successRatePercent: number
  errorRatePercent: number
  authenticatedRatePercent: number
  avgLatencyMs: number
  maxLatencyMs: number
  effectiveConfig: AdminFinancialToolConfigSnapshot | null
  daily: AdminFinancialToolUsageDailyPoint[]
}

export interface AdminFinancialToolUsageByVertical {
  vertical: AdminFinancialToolVertical
  requests: number
  successCount: number
  clientErrorCount: number
  serverErrorCount: number
  successRatePercent: number
}

export interface AdminFinancialToolUsageOverview {
  environment: AdminFinancialToolEnvironment
  days: number
  sinceDay: string
  totals: {
    requests: number
    successCount: number
    clientErrorCount: number
    serverErrorCount: number
    successRatePercent: number
    errorRatePercent: number
  }
  byTool: AdminFinancialToolUsageByTool[]
  byVertical: AdminFinancialToolUsageByVertical[]
  generatedAt: string
}

export interface AdminFinancialToolUsageQuery {
  environment?: AdminFinancialToolEnvironment
  tool?: AdminFinancialToolKey
  days?: number
}
