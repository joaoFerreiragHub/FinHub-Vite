import type { User } from '@/features/auth/types'

export const ADMIN_SCOPES = [
  'admin.users.read',
  'admin.users.write',
  'admin.content.read',
  'admin.content.moderate',
  'admin.content.create',
  'admin.content.edit',
  'admin.content.publish',
  'admin.content.archive',
  'admin.home.curate',
  'admin.directory.manage',
  'admin.claim.review',
  'admin.claim.transfer',
  'admin.brands.read',
  'admin.brands.write',
  'admin.uploads.read',
  'admin.uploads.write',
  'admin.metrics.read',
  'admin.audit.read',
  'admin.support.session.assist',
] as const

export type AdminScope = (typeof ADMIN_SCOPES)[number]

export type AdminModuleKey =
  | 'dashboard'
  | 'users'
  | 'creators'
  | 'content'
  | 'editorial'
  | 'support'
  | 'brands'
  | 'audit'
  | 'stats'

export interface AdminModuleConfig {
  key: AdminModuleKey
  label: string
  path: string
  readScopes: AdminScope[]
  writeScopes: AdminScope[]
  operational: boolean
}

const VALID_SCOPE_SET = new Set<string>(ADMIN_SCOPES)

const parseBooleanEnv = (value: string | undefined, fallback: boolean): boolean => {
  if (typeof value !== 'string') return fallback
  const normalized = value.trim().toLowerCase()
  if (normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on') {
    return true
  }
  if (normalized === '0' || normalized === 'false' || normalized === 'no' || normalized === 'off') {
    return false
  }
  return fallback
}

const ADMIN_SCOPES_FAIL_CLOSED = parseBooleanEnv(
  import.meta.env.VITE_ADMIN_SCOPES_FAIL_CLOSED,
  false,
)

export const ADMIN_MODULES: AdminModuleConfig[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: '/admin',
    readScopes: [],
    writeScopes: [],
    operational: true,
  },
  {
    key: 'users',
    label: 'Utilizadores',
    path: '/admin/users',
    readScopes: ['admin.users.read'],
    writeScopes: ['admin.users.write'],
    operational: true,
  },
  {
    key: 'creators',
    label: 'Creators',
    path: '/admin/creators',
    readScopes: ['admin.users.read'],
    writeScopes: ['admin.users.write'],
    operational: true,
  },
  {
    key: 'content',
    label: 'Moderacao',
    path: '/admin/conteudo',
    readScopes: ['admin.content.read'],
    writeScopes: ['admin.content.moderate'],
    operational: true,
  },
  {
    key: 'editorial',
    label: 'Editorial CMS',
    path: '/admin/editorial',
    readScopes: ['admin.home.curate', 'admin.claim.review', 'admin.claim.transfer'],
    writeScopes: ['admin.home.curate', 'admin.claim.review', 'admin.claim.transfer'],
    operational: true,
  },
  {
    key: 'support',
    label: 'Suporte',
    path: '/admin/suporte',
    readScopes: ['admin.support.session.assist'],
    writeScopes: ['admin.support.session.assist'],
    operational: true,
  },
  {
    key: 'brands',
    label: 'Recursos',
    path: '/admin/recursos',
    readScopes: ['admin.directory.manage'],
    writeScopes: ['admin.directory.manage'],
    operational: true,
  },
  {
    key: 'stats',
    label: 'Estatisticas',
    path: '/admin/stats',
    readScopes: ['admin.metrics.read'],
    writeScopes: [],
    operational: true,
  },
  {
    key: 'audit',
    label: 'Auditoria',
    path: '/admin/auditoria',
    readScopes: ['admin.audit.read'],
    writeScopes: [],
    operational: true,
  },
]

const isAdminUser = (user: User | null | undefined): user is User =>
  Boolean(user && user.role === 'admin')

export const normalizeAdminScopes = (scopes?: string[] | null): AdminScope[] => {
  if (!Array.isArray(scopes) || scopes.length === 0) return []

  const valid: AdminScope[] = []
  for (const scope of scopes) {
    if (typeof scope === 'string' && VALID_SCOPE_SET.has(scope)) {
      valid.push(scope as AdminScope)
    }
  }

  return valid
}

const resolveAdminScopes = (user: User): AdminScope[] => {
  const scopes = normalizeAdminScopes(user.adminScopes)
  if (scopes.length > 0) return scopes
  if (ADMIN_SCOPES_FAIL_CLOSED) return []
  return [...ADMIN_SCOPES]
}

export const hasAdminScope = (user: User | null | undefined, scope: AdminScope): boolean => {
  if (!isAdminUser(user)) return false

  const scopes = resolveAdminScopes(user)
  return scopes.includes(scope)
}

export const hasAnyAdminScope = (user: User | null | undefined, scopes: AdminScope[]): boolean => {
  if (scopes.length === 0) return isAdminUser(user)
  return scopes.some((scope) => hasAdminScope(user, scope))
}

export const canReadAdminModule = (
  user: User | null | undefined,
  moduleConfig: AdminModuleConfig,
): boolean => hasAnyAdminScope(user, moduleConfig.readScopes)

export const canWriteAdminModule = (
  user: User | null | undefined,
  moduleConfig: AdminModuleConfig,
): boolean => {
  if (!isAdminUser(user)) return false
  if (user.adminReadOnly) return false

  // Modulos read-only (sem writeScopes) seguem permissao de leitura.
  if (moduleConfig.writeScopes.length === 0) {
    return canReadAdminModule(user, moduleConfig)
  }

  return hasAnyAdminScope(user, moduleConfig.writeScopes)
}

export const getAccessibleAdminModules = (user: User | null | undefined): AdminModuleConfig[] =>
  ADMIN_MODULES.filter((moduleConfig) => canReadAdminModule(user, moduleConfig))

export const findAdminModule = (key: AdminModuleKey): AdminModuleConfig | undefined =>
  ADMIN_MODULES.find((moduleConfig) => moduleConfig.key === key)
