import type { User } from '@/features/auth/types'

export const ADMIN_SCOPES = [
  'admin.users.read',
  'admin.users.write',
  'admin.content.read',
  'admin.content.moderate',
  'admin.brands.read',
  'admin.brands.write',
  'admin.uploads.read',
  'admin.uploads.write',
  'admin.metrics.read',
  'admin.audit.read',
  'admin.support.session.assist',
] as const

export type AdminScope = (typeof ADMIN_SCOPES)[number]

export type AdminModuleKey = 'dashboard' | 'users' | 'content' | 'support' | 'brands' | 'stats'

export interface AdminModuleConfig {
  key: AdminModuleKey
  label: string
  path: string
  readScopes: AdminScope[]
  writeScopes: AdminScope[]
  operational: boolean
}

const VALID_SCOPE_SET = new Set<string>(ADMIN_SCOPES)

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
    key: 'content',
    label: 'Moderacao',
    path: '/admin/conteudo',
    readScopes: ['admin.content.read'],
    writeScopes: ['admin.content.moderate'],
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
    readScopes: ['admin.brands.read'],
    writeScopes: ['admin.brands.write'],
    operational: false,
  },
  {
    key: 'stats',
    label: 'Estatisticas',
    path: '/admin/stats',
    readScopes: ['admin.metrics.read'],
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

export const hasAdminScope = (user: User | null | undefined, scope: AdminScope): boolean => {
  if (!isAdminUser(user)) return false

  const scopes = normalizeAdminScopes(user.adminScopes)

  // Compatibilidade retroativa: admin sem lista explicita recebe acesso total.
  if (scopes.length === 0) return true

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
