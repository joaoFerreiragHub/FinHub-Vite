import { apiClient } from '@/lib/api/client'
import type {
  AdminFinancialToolConfigOverride,
  AdminFinancialToolConfigSnapshot,
  AdminFinancialToolControlItem,
  AdminFinancialToolEnvironment,
  AdminFinancialToolKey,
  AdminFinancialToolListQuery,
  AdminFinancialToolsListResponse,
  AdminFinancialToolUpdatePayload,
  AdminFinancialToolUpdateResponse,
  AdminFinancialToolUsageByTool,
  AdminFinancialToolUsageByVertical,
  AdminFinancialToolUsageOverview,
  AdminFinancialToolUsageQuery,
} from '../types/adminFinancialTools'

interface BackendConfigSnapshot {
  enabled?: unknown
  maxSymbolsPerRequest?: unknown
  cacheTtlSeconds?: unknown
  requestsPerMinute?: unknown
  experienceMode?: unknown
}

interface BackendControlItem {
  id?: unknown
  _id?: unknown
  tool?: unknown
  vertical?: unknown
  label?: unknown
  notes?: unknown
  baseConfig?: BackendConfigSnapshot
  envOverrides?: Record<string, unknown>
  effectiveConfig?: BackendConfigSnapshot
  version?: unknown
  createdAt?: unknown
  updatedAt?: unknown
}

interface BackendListResponse {
  environment?: unknown
  items?: BackendControlItem[]
  generatedAt?: unknown
}

interface BackendMutationResponse {
  message?: unknown
  item?: BackendControlItem
}

interface BackendDailyPoint {
  day?: unknown
  requests?: unknown
  success?: unknown
  clientError?: unknown
  serverError?: unknown
  avgLatencyMs?: unknown
  maxLatencyMs?: unknown
}

interface BackendUsageByTool {
  tool?: unknown
  vertical?: unknown
  label?: unknown
  requests?: unknown
  authenticatedRequests?: unknown
  successCount?: unknown
  clientErrorCount?: unknown
  serverErrorCount?: unknown
  successRatePercent?: unknown
  errorRatePercent?: unknown
  authenticatedRatePercent?: unknown
  avgLatencyMs?: unknown
  maxLatencyMs?: unknown
  effectiveConfig?: BackendConfigSnapshot | null
  daily?: BackendDailyPoint[]
}

interface BackendUsageByVertical {
  vertical?: unknown
  requests?: unknown
  successCount?: unknown
  clientErrorCount?: unknown
  serverErrorCount?: unknown
  successRatePercent?: unknown
}

interface BackendUsageResponse {
  environment?: unknown
  days?: unknown
  sinceDay?: unknown
  totals?: {
    requests?: unknown
    successCount?: unknown
    clientErrorCount?: unknown
    serverErrorCount?: unknown
    successRatePercent?: unknown
    errorRatePercent?: unknown
  }
  byTool?: BackendUsageByTool[]
  byVertical?: BackendUsageByVertical[]
  generatedAt?: unknown
}

const TOOL_SET = new Set<AdminFinancialToolKey>(['stocks', 'etf', 'reit', 'crypto'])
const VERTICAL_SET = new Set(['equities', 'funds', 'real_estate', 'digital_assets'])
const ENVIRONMENT_SET = new Set<AdminFinancialToolEnvironment>([
  'development',
  'staging',
  'production',
])
const EXPERIENCE_SET = new Set(['legacy', 'standard', 'enhanced'])

const toNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback

const toInteger = (value: unknown, fallback = 0): number => Math.trunc(toNumber(value, fallback))

const toString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

const toIsoDate = (value: unknown): string => {
  if (typeof value !== 'string' || value.trim().length === 0) return new Date(0).toISOString()
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? new Date(0).toISOString() : parsed.toISOString()
}

const toNullableString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : null

const toTool = (value: unknown): AdminFinancialToolKey => {
  if (typeof value === 'string' && TOOL_SET.has(value as AdminFinancialToolKey)) {
    return value as AdminFinancialToolKey
  }
  return 'stocks'
}

const toVertical = (value: unknown): AdminFinancialToolControlItem['vertical'] => {
  if (typeof value === 'string' && VERTICAL_SET.has(value)) {
    return value as AdminFinancialToolControlItem['vertical']
  }
  return 'equities'
}

const toEnvironment = (value: unknown): AdminFinancialToolEnvironment => {
  if (typeof value === 'string' && ENVIRONMENT_SET.has(value as AdminFinancialToolEnvironment)) {
    return value as AdminFinancialToolEnvironment
  }
  return 'development'
}

const toExperienceMode = (value: unknown): AdminFinancialToolConfigSnapshot['experienceMode'] => {
  if (typeof value === 'string' && EXPERIENCE_SET.has(value)) {
    return value as AdminFinancialToolConfigSnapshot['experienceMode']
  }
  return 'standard'
}

const mapConfigSnapshot = (raw?: BackendConfigSnapshot | null): AdminFinancialToolConfigSnapshot => ({
  enabled: raw?.enabled === true,
  maxSymbolsPerRequest: Math.max(1, toInteger(raw?.maxSymbolsPerRequest, 25)),
  cacheTtlSeconds: Math.max(0, toInteger(raw?.cacheTtlSeconds, 300)),
  requestsPerMinute: Math.max(1, toInteger(raw?.requestsPerMinute, 120)),
  experienceMode: toExperienceMode(raw?.experienceMode),
})

const mapConfigOverride = (raw: unknown): AdminFinancialToolConfigOverride => {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  const item = raw as Record<string, unknown>
  const output: AdminFinancialToolConfigOverride = {}

  if (typeof item.enabled === 'boolean') output.enabled = item.enabled
  if (typeof item.maxSymbolsPerRequest === 'number' && Number.isFinite(item.maxSymbolsPerRequest)) {
    output.maxSymbolsPerRequest = Math.max(1, Math.trunc(item.maxSymbolsPerRequest))
  }
  if (typeof item.cacheTtlSeconds === 'number' && Number.isFinite(item.cacheTtlSeconds)) {
    output.cacheTtlSeconds = Math.max(0, Math.trunc(item.cacheTtlSeconds))
  }
  if (typeof item.requestsPerMinute === 'number' && Number.isFinite(item.requestsPerMinute)) {
    output.requestsPerMinute = Math.max(1, Math.trunc(item.requestsPerMinute))
  }
  if (typeof item.experienceMode === 'string' && EXPERIENCE_SET.has(item.experienceMode)) {
    output.experienceMode = item.experienceMode as AdminFinancialToolConfigSnapshot['experienceMode']
  }

  return output
}

const mapControlItem = (item: BackendControlItem): AdminFinancialToolControlItem | null => {
  const idRaw = toNullableString(item.id) ?? toNullableString(item._id)
  if (!idRaw) return null

  const envOverridesRaw =
    item.envOverrides && typeof item.envOverrides === 'object' && !Array.isArray(item.envOverrides)
      ? (item.envOverrides as Record<string, unknown>)
      : {}

  return {
    id: idRaw,
    tool: toTool(item.tool),
    vertical: toVertical(item.vertical),
    label: toString(item.label, toTool(item.tool)),
    notes: toNullableString(item.notes),
    baseConfig: mapConfigSnapshot(item.baseConfig),
    envOverrides: {
      development: mapConfigOverride(envOverridesRaw.development),
      staging: mapConfigOverride(envOverridesRaw.staging),
      production: mapConfigOverride(envOverridesRaw.production),
    },
    effectiveConfig: mapConfigSnapshot(item.effectiveConfig),
    version: Math.max(1, toInteger(item.version, 1)),
    createdAt: toIsoDate(item.createdAt),
    updatedAt: toIsoDate(item.updatedAt),
  }
}

const mapDailyPoint = (item: BackendDailyPoint) => ({
  day: toString(item.day, ''),
  requests: Math.max(0, toInteger(item.requests, 0)),
  success: Math.max(0, toInteger(item.success, 0)),
  clientError: Math.max(0, toInteger(item.clientError, 0)),
  serverError: Math.max(0, toInteger(item.serverError, 0)),
  avgLatencyMs: Math.max(0, toNumber(item.avgLatencyMs, 0)),
  maxLatencyMs: Math.max(0, toNumber(item.maxLatencyMs, 0)),
})

const mapUsageByTool = (item: BackendUsageByTool): AdminFinancialToolUsageByTool => ({
  tool: toTool(item.tool),
  vertical: toVertical(item.vertical),
  label: toString(item.label, toTool(item.tool)),
  requests: Math.max(0, toInteger(item.requests, 0)),
  authenticatedRequests: Math.max(0, toInteger(item.authenticatedRequests, 0)),
  successCount: Math.max(0, toInteger(item.successCount, 0)),
  clientErrorCount: Math.max(0, toInteger(item.clientErrorCount, 0)),
  serverErrorCount: Math.max(0, toInteger(item.serverErrorCount, 0)),
  successRatePercent: Math.max(0, toNumber(item.successRatePercent, 0)),
  errorRatePercent: Math.max(0, toNumber(item.errorRatePercent, 0)),
  authenticatedRatePercent: Math.max(0, toNumber(item.authenticatedRatePercent, 0)),
  avgLatencyMs: Math.max(0, toNumber(item.avgLatencyMs, 0)),
  maxLatencyMs: Math.max(0, toNumber(item.maxLatencyMs, 0)),
  effectiveConfig: item.effectiveConfig ? mapConfigSnapshot(item.effectiveConfig) : null,
  daily: Array.isArray(item.daily) ? item.daily.map(mapDailyPoint) : [],
})

const mapUsageByVertical = (item: BackendUsageByVertical): AdminFinancialToolUsageByVertical => ({
  vertical: toVertical(item.vertical),
  requests: Math.max(0, toInteger(item.requests, 0)),
  successCount: Math.max(0, toInteger(item.successCount, 0)),
  clientErrorCount: Math.max(0, toInteger(item.clientErrorCount, 0)),
  serverErrorCount: Math.max(0, toInteger(item.serverErrorCount, 0)),
  successRatePercent: Math.max(0, toNumber(item.successRatePercent, 0)),
})

const toListParams = (query: AdminFinancialToolListQuery): Record<string, string> => {
  const params: Record<string, string> = {}
  if (query.environment) params.environment = query.environment
  if (query.tool) params.tool = query.tool
  return params
}

const toUsageParams = (query: AdminFinancialToolUsageQuery): Record<string, string | number> => {
  const params: Record<string, string | number> = {}
  if (query.environment) params.environment = query.environment
  if (query.tool) params.tool = query.tool
  if (typeof query.days === 'number' && query.days > 0) params.days = Math.trunc(query.days)
  return params
}

const toUpdatePayload = (payload: AdminFinancialToolUpdatePayload): Record<string, unknown> => {
  const body: Record<string, unknown> = {
    reason: payload.reason.trim(),
  }
  if (payload.note?.trim()) body.note = payload.note.trim()
  if (typeof payload.label === 'string') body.label = payload.label
  if ('notes' in payload) body.notes = payload.notes ?? null
  if (payload.baseConfig) body.baseConfig = payload.baseConfig
  if (payload.envOverrides) body.envOverrides = payload.envOverrides
  return body
}

export const adminFinancialToolsService = {
  list: async (query: AdminFinancialToolListQuery = {}): Promise<AdminFinancialToolsListResponse> => {
    const response = await apiClient.get<BackendListResponse>('/admin/tools/financial', {
      params: toListParams(query),
    })

    return {
      environment: toEnvironment(response.data.environment),
      items: Array.isArray(response.data.items)
        ? response.data.items.map(mapControlItem).filter((item): item is AdminFinancialToolControlItem => item !== null)
        : [],
      generatedAt: toIsoDate(response.data.generatedAt),
    }
  },

  update: async (
    tool: AdminFinancialToolKey,
    payload: AdminFinancialToolUpdatePayload,
  ): Promise<AdminFinancialToolUpdateResponse> => {
    const response = await apiClient.patch<BackendMutationResponse>(
      `/admin/tools/financial/${encodeURIComponent(tool)}`,
      toUpdatePayload(payload),
    )
    const item = response.data.item ? mapControlItem(response.data.item) : null
    if (!item) {
      throw new Error('Resposta admin invalida: financial tool em falta.')
    }
    return {
      message: toString(response.data.message, 'Financial tool atualizada com sucesso.'),
      item,
    }
  },

  usage: async (query: AdminFinancialToolUsageQuery = {}): Promise<AdminFinancialToolUsageOverview> => {
    const response = await apiClient.get<BackendUsageResponse>('/admin/tools/financial/usage', {
      params: toUsageParams(query),
    })
    const data = response.data ?? {}

    return {
      environment: toEnvironment(data.environment),
      days: Math.max(1, toInteger(data.days, 7)),
      sinceDay: toString(data.sinceDay, ''),
      totals: {
        requests: Math.max(0, toInteger(data.totals?.requests, 0)),
        successCount: Math.max(0, toInteger(data.totals?.successCount, 0)),
        clientErrorCount: Math.max(0, toInteger(data.totals?.clientErrorCount, 0)),
        serverErrorCount: Math.max(0, toInteger(data.totals?.serverErrorCount, 0)),
        successRatePercent: Math.max(0, toNumber(data.totals?.successRatePercent, 0)),
        errorRatePercent: Math.max(0, toNumber(data.totals?.errorRatePercent, 0)),
      },
      byTool: Array.isArray(data.byTool) ? data.byTool.map(mapUsageByTool) : [],
      byVertical: Array.isArray(data.byVertical) ? data.byVertical.map(mapUsageByVertical) : [],
      generatedAt: toIsoDate(data.generatedAt),
    }
  },
}
