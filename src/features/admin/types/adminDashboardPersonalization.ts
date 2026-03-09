export const ADMIN_DASHBOARD_PRESETS = [
  'operations',
  'moderation',
  'monetization',
  'custom',
] as const

export const ADMIN_DASHBOARD_DENSITY_MODES = ['comfortable', 'compact'] as const
export const ADMIN_DASHBOARD_THEME_MODES = ['system', 'light', 'dark'] as const

export const ADMIN_DASHBOARD_WIDGET_KEYS = [
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
] as const

export type AdminDashboardPreset = (typeof ADMIN_DASHBOARD_PRESETS)[number]
export type AdminDashboardDensityMode = (typeof ADMIN_DASHBOARD_DENSITY_MODES)[number]
export type AdminDashboardThemeMode = (typeof ADMIN_DASHBOARD_THEME_MODES)[number]
export type AdminDashboardWidgetKey = (typeof ADMIN_DASHBOARD_WIDGET_KEYS)[number]

export interface AdminDashboardLayoutItem {
  widgetKey: AdminDashboardWidgetKey
  column: number
  order: number
  width: number
  height: number
  collapsed: boolean
}

export interface AdminDashboardPinnedFilter {
  key: string
  value: string
}

export interface AdminDashboardWidgetCatalogItem {
  key: AdminDashboardWidgetKey
  label: string
  description: string
  requiredScopes: string[]
  dataEndpoint: string
  defaultLayout: {
    column: number
    order: number
    width: number
    height: number
  }
}

export interface AdminDashboardPreference {
  preset: AdminDashboardPreset
  density: AdminDashboardDensityMode
  theme: AdminDashboardThemeMode
  refreshSeconds: number
  layout: AdminDashboardLayoutItem[]
  pinnedFilters: AdminDashboardPinnedFilter[]
  version: number
  createdAt: string
  updatedAt: string
}

export interface AdminDashboardPersonalizationResponse {
  availableWidgets: AdminDashboardWidgetCatalogItem[]
  preference: AdminDashboardPreference
}

export interface AdminDashboardPersonalizationUpdatePayload {
  preset?: AdminDashboardPreset
  density?: AdminDashboardDensityMode
  theme?: AdminDashboardThemeMode
  refreshSeconds?: number
  layout?: AdminDashboardLayoutItem[]
  pinnedFilters?: AdminDashboardPinnedFilter[]
  reason?: string
  note?: string
}

export interface AdminDashboardPersonalizationResetPayload {
  preset?: AdminDashboardPreset
  reason?: string
  note?: string
}

export interface AdminDashboardPersonalizationMutationResponse
  extends AdminDashboardPersonalizationResponse {
  message: string
}
