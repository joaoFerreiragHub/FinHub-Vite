import { apiClient } from '@/lib/api/client'
import type {
  AdminDashboardDensityMode,
  AdminDashboardLayoutItem,
  AdminDashboardPersonalizationMutationResponse,
  AdminDashboardPersonalizationResetPayload,
  AdminDashboardPersonalizationResponse,
  AdminDashboardPersonalizationUpdatePayload,
  AdminDashboardPinnedFilter,
  AdminDashboardPreset,
  AdminDashboardThemeMode,
  AdminDashboardWidgetCatalogItem,
  AdminDashboardWidgetKey,
} from '../types/adminDashboardPersonalization'

type BackendPersonalizationPayload = Partial<AdminDashboardPersonalizationResponse>
type BackendPersonalizationMutationPayload = Partial<AdminDashboardPersonalizationMutationResponse>

const DEFAULT_REFRESH_SECONDS = 120

const DASHBOARD_PRESETS = new Set<AdminDashboardPreset>([
  'operations',
  'moderation',
  'monetization',
  'custom',
])
const DASHBOARD_DENSITIES = new Set<AdminDashboardDensityMode>(['comfortable', 'compact'])
const DASHBOARD_THEMES = new Set<AdminDashboardThemeMode>(['system', 'light', 'dark'])
const DASHBOARD_WIDGET_KEYS = new Set<AdminDashboardWidgetKey>([
  'kpi_usage_overview',
  'kpi_moderation_queue',
  'kpi_creator_trust',
  'chart_reports_trend',
  'chart_jobs_health',
  'table_priority_targets',
  'table_creator_positive',
  'table_subscriptions_health',
  'table_ads_inventory',
  'kpi_revenue_health',
])

const toString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

const toPositiveInt = (
  value: unknown,
  fallback: number,
  min = 1,
  max = Number.MAX_SAFE_INTEGER,
): number => {
  const parsed =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number.parseInt(value, 10)
        : Number.NaN

  if (!Number.isFinite(parsed) || parsed < min || parsed > max) return fallback
  return Math.trunc(parsed)
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const toIsoDate = (value: unknown): string => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return new Date(0).toISOString()
  }

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? new Date(0).toISOString() : parsed.toISOString()
}

const toWidgetKey = (value: unknown): AdminDashboardWidgetKey | null =>
  typeof value === 'string' && DASHBOARD_WIDGET_KEYS.has(value as AdminDashboardWidgetKey)
    ? (value as AdminDashboardWidgetKey)
    : null

const mapLayoutItem = (value: unknown): AdminDashboardLayoutItem | null => {
  if (!isRecord(value)) return null

  const widgetKey = toWidgetKey(value.widgetKey)
  if (!widgetKey) return null

  return {
    widgetKey,
    column: toPositiveInt(value.column, 1, 1, 4),
    order: toPositiveInt(value.order, 1, 0, 100),
    width: toPositiveInt(value.width, 1, 1, 12),
    height: toPositiveInt(value.height, 1, 1, 12),
    collapsed: value.collapsed === true,
  }
}

const mapPinnedFilter = (value: unknown): AdminDashboardPinnedFilter | null => {
  if (!isRecord(value)) return null

  const key = toString(value.key).trim()
  const pinnedValue = toString(value.value).trim()
  if (!key || !pinnedValue) return null

  return {
    key,
    value: pinnedValue,
  }
}

const mapWidget = (value: unknown): AdminDashboardWidgetCatalogItem | null => {
  if (!isRecord(value)) return null

  const key = toWidgetKey(value.key)
  if (!key) return null

  const defaultLayoutInput = isRecord(value.defaultLayout) ? value.defaultLayout : {}

  return {
    key,
    label: toString(value.label, key),
    description: toString(value.description),
    requiredScopes: Array.isArray(value.requiredScopes)
      ? value.requiredScopes.filter((scope): scope is string => typeof scope === 'string')
      : [],
    dataEndpoint: toString(value.dataEndpoint),
    defaultLayout: {
      column: toPositiveInt(defaultLayoutInput.column, 1, 1, 4),
      order: toPositiveInt(defaultLayoutInput.order, 1, 0, 100),
      width: toPositiveInt(defaultLayoutInput.width, 1, 1, 12),
      height: toPositiveInt(defaultLayoutInput.height, 1, 1, 12),
    },
  }
}

const buildFallbackLayout = (
  widgets: AdminDashboardWidgetCatalogItem[],
): AdminDashboardLayoutItem[] =>
  widgets.map((widget, index) => ({
    widgetKey: widget.key,
    column: widget.defaultLayout.column,
    order: widget.defaultLayout.order || index + 1,
    width: widget.defaultLayout.width,
    height: widget.defaultLayout.height,
    collapsed: false,
  }))

const mapPersonalizationResponse = (
  payload: BackendPersonalizationPayload,
): AdminDashboardPersonalizationResponse => {
  const availableWidgets = Array.isArray(payload.availableWidgets)
    ? payload.availableWidgets
        .map((item) => mapWidget(item))
        .filter((item): item is AdminDashboardWidgetCatalogItem => item !== null)
    : []

  const preferenceInput = isRecord(payload.preference) ? payload.preference : {}
  const availableWidgetKeySet = new Set(availableWidgets.map((item) => item.key))
  const mappedLayout = Array.isArray(preferenceInput.layout)
    ? preferenceInput.layout
        .map((item) => mapLayoutItem(item))
        .filter(
          (item): item is AdminDashboardLayoutItem =>
            item !== null && availableWidgetKeySet.has(item.widgetKey),
        )
    : []

  const preset = DASHBOARD_PRESETS.has(preferenceInput.preset as AdminDashboardPreset)
    ? (preferenceInput.preset as AdminDashboardPreset)
    : 'operations'
  const density = DASHBOARD_DENSITIES.has(preferenceInput.density as AdminDashboardDensityMode)
    ? (preferenceInput.density as AdminDashboardDensityMode)
    : 'comfortable'
  const theme = DASHBOARD_THEMES.has(preferenceInput.theme as AdminDashboardThemeMode)
    ? (preferenceInput.theme as AdminDashboardThemeMode)
    : 'system'

  return {
    availableWidgets,
    preference: {
      preset,
      density,
      theme,
      refreshSeconds: toPositiveInt(
        preferenceInput.refreshSeconds,
        DEFAULT_REFRESH_SECONDS,
        30,
        3600,
      ),
      layout: mappedLayout.length > 0 ? mappedLayout : buildFallbackLayout(availableWidgets),
      pinnedFilters: Array.isArray(preferenceInput.pinnedFilters)
        ? preferenceInput.pinnedFilters
            .map((item) => mapPinnedFilter(item))
            .filter((item): item is AdminDashboardPinnedFilter => item !== null)
        : [],
      version: toPositiveInt(preferenceInput.version, 1, 1),
      createdAt: toIsoDate(preferenceInput.createdAt),
      updatedAt: toIsoDate(preferenceInput.updatedAt),
    },
  }
}

const trimOptionalText = (value: string | undefined): string | undefined => {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

const buildUpdatePayload = (
  payload: AdminDashboardPersonalizationUpdatePayload,
): AdminDashboardPersonalizationUpdatePayload => {
  const nextPayload: AdminDashboardPersonalizationUpdatePayload = {}

  if (payload.preset) nextPayload.preset = payload.preset
  if (payload.density) nextPayload.density = payload.density
  if (payload.theme) nextPayload.theme = payload.theme
  if (typeof payload.refreshSeconds === 'number')
    nextPayload.refreshSeconds = payload.refreshSeconds
  if (Array.isArray(payload.layout)) nextPayload.layout = payload.layout
  if (Array.isArray(payload.pinnedFilters)) nextPayload.pinnedFilters = payload.pinnedFilters

  const reason = trimOptionalText(payload.reason)
  if (reason) nextPayload.reason = reason

  const note = trimOptionalText(payload.note)
  if (note) nextPayload.note = note

  return nextPayload
}

const buildResetPayload = (
  payload: AdminDashboardPersonalizationResetPayload | undefined,
): AdminDashboardPersonalizationResetPayload => {
  const nextPayload: AdminDashboardPersonalizationResetPayload = {}
  if (payload?.preset) nextPayload.preset = payload.preset

  const reason = trimOptionalText(payload?.reason)
  if (reason) nextPayload.reason = reason

  const note = trimOptionalText(payload?.note)
  if (note) nextPayload.note = note

  return nextPayload
}

export const adminDashboardPersonalizationService = {
  get: async (): Promise<AdminDashboardPersonalizationResponse> => {
    const response = await apiClient.get<BackendPersonalizationPayload>(
      '/admin/dashboard/personalization',
    )
    return mapPersonalizationResponse(response.data)
  },

  update: async (
    payload: AdminDashboardPersonalizationUpdatePayload,
  ): Promise<AdminDashboardPersonalizationMutationResponse> => {
    const response = await apiClient.patch<BackendPersonalizationMutationPayload>(
      '/admin/dashboard/personalization',
      buildUpdatePayload(payload),
    )
    const normalized = mapPersonalizationResponse(response.data)

    return {
      message: toString(
        response.data.message,
        'Personalizacao do dashboard atualizada com sucesso.',
      ),
      ...normalized,
    }
  },

  reset: async (
    payload?: AdminDashboardPersonalizationResetPayload,
  ): Promise<AdminDashboardPersonalizationMutationResponse> => {
    const response = await apiClient.post<BackendPersonalizationMutationPayload>(
      '/admin/dashboard/personalization/reset',
      buildResetPayload(payload),
    )
    const normalized = mapPersonalizationResponse(response.data)

    return {
      message: toString(response.data.message, 'Dashboard reposto com sucesso.'),
      ...normalized,
    }
  },
}
