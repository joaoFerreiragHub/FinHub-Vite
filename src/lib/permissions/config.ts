import { UserRole } from '@/features/auth/types'

/**
 * Permissões disponíveis no sistema
 */
export enum Permission {
  // HUB - Articles
  VIEW_ARTICLES = 'hub:articles:view',
  VIEW_ARTICLES_PREMIUM = 'hub:articles:view:premium',
  CREATE_ARTICLES = 'hub:articles:create',
  EDIT_ARTICLES = 'hub:articles:edit',
  DELETE_ARTICLES = 'hub:articles:delete',

  // HUB - Courses
  VIEW_COURSES = 'hub:courses:view',
  VIEW_COURSES_PREMIUM = 'hub:courses:view:premium',
  ENROLL_COURSES = 'hub:courses:enroll',
  CREATE_COURSES = 'hub:courses:create',
  EDIT_COURSES = 'hub:courses:edit',

  // HUB - Videos
  VIEW_VIDEOS = 'hub:videos:view',
  VIEW_VIDEOS_PREMIUM = 'hub:videos:view:premium',
  UPLOAD_VIDEOS = 'hub:videos:upload',

  // HUB - Events
  VIEW_EVENTS = 'hub:events:view',
  REGISTER_EVENTS = 'hub:events:register',
  CREATE_EVENTS = 'hub:events:create',

  // HUB - Creators
  FOLLOW_CREATORS = 'hub:creators:follow',
  BECOME_CREATOR = 'hub:creators:become',
  MANAGE_CREATOR_PAGE = 'hub:creators:manage',

  // TOOLS - Personal Finance
  USE_CALCULATORS = 'tools:calculators:use',
  SAVE_CALCULATIONS = 'tools:calculators:save',

  // TOOLS - Portfolio
  CREATE_PORTFOLIO = 'tools:portfolio:create',
  ADVANCED_ANALYTICS = 'tools:portfolio:analytics',

  // SOCIAL - Comments & Ratings
  POST_COMMENTS = 'social:comments:post',
  RATE_CONTENT = 'social:ratings:post',

  // SOCIAL - Forum
  VIEW_FORUM = 'social:forum:view',
  POST_FORUM = 'social:forum:post',
  CREATE_TOPICS = 'social:forum:create',

  // SOCIAL - Chat
  USE_CHAT = 'social:chat:use',

  // ADMIN
  ADMIN_PANEL = 'admin:panel',
  MANAGE_USERS = 'admin:users:manage',
  MANAGE_CONTENT = 'admin:content:manage',
}

/**
 * Matriz de Permissões por Role
 * Cada role tem um conjunto específico de permissões
 */

// Definir permissões de cada role sequencialmente para evitar referências circulares
const VISITOR_PERMISSIONS: Permission[] = [
  // HUB - Acesso limitado a conteúdo público
  Permission.VIEW_ARTICLES, // Apenas artigos públicos
  Permission.VIEW_COURSES, // Apenas cursos públicos
  Permission.VIEW_VIDEOS, // Apenas vídeos públicos
  Permission.VIEW_EVENTS,
  Permission.VIEW_FORUM,

  // TOOLS - Acesso limitado
  Permission.USE_CALCULATORS, // Sem salvar
]

const FREE_PERMISSIONS: Permission[] = [
  // Herda tudo de VISITOR +
  ...VISITOR_PERMISSIONS,

  // HUB - Mais conteúdo
  Permission.FOLLOW_CREATORS,
  Permission.ENROLL_COURSES,
  Permission.REGISTER_EVENTS,

  // TOOLS - Pode salvar
  Permission.SAVE_CALCULATIONS,
  Permission.CREATE_PORTFOLIO,

  // SOCIAL - Pode interagir
  Permission.POST_COMMENTS,
  Permission.RATE_CONTENT,
  Permission.POST_FORUM,
]

const PREMIUM_PERMISSIONS: Permission[] = [
  // Herda tudo de FREE +
  ...FREE_PERMISSIONS,

  // HUB - Acesso total ao conteúdo
  Permission.VIEW_ARTICLES_PREMIUM,
  Permission.VIEW_COURSES_PREMIUM,
  Permission.VIEW_VIDEOS_PREMIUM,

  // TOOLS - Analytics avançado
  Permission.ADVANCED_ANALYTICS,

  // SOCIAL - Chat
  Permission.USE_CHAT,
  Permission.CREATE_TOPICS,
]

const CREATOR_PERMISSIONS: Permission[] = [
  // Herda tudo de PREMIUM +
  ...PREMIUM_PERMISSIONS,

  // HUB - Pode criar conteúdo
  Permission.CREATE_ARTICLES,
  Permission.EDIT_ARTICLES,
  Permission.CREATE_COURSES,
  Permission.EDIT_COURSES,
  Permission.UPLOAD_VIDEOS,
  Permission.CREATE_EVENTS,
  Permission.MANAGE_CREATOR_PAGE,
]

const ADMIN_PERMISSIONS: Permission[] = [
  // Herda tudo de CREATOR +
  ...CREATOR_PERMISSIONS,

  // ADMIN - Acesso total
  Permission.ADMIN_PANEL,
  Permission.MANAGE_USERS,
  Permission.MANAGE_CONTENT,
  Permission.DELETE_ARTICLES,
]

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.VISITOR]: VISITOR_PERMISSIONS,
  [UserRole.FREE]: FREE_PERMISSIONS,
  [UserRole.PREMIUM]: PREMIUM_PERMISSIONS,
  [UserRole.CREATOR]: CREATOR_PERMISSIONS,
  [UserRole.ADMIN]: ADMIN_PERMISSIONS,
}

/**
 * Verifica se um role tem uma permissão específica
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

/**
 * Verifica se um role tem pelo menos uma das permissões fornecidas
 */
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(role, permission))
}

/**
 * Verifica se um role tem todas as permissões fornecidas
 */
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(role, permission))
}

/**
 * Verifica se um role é pelo menos do nível especificado
 * Útil para verificações hierárquicas
 */
export function isRoleAtLeast(currentRole: UserRole, requiredRole: UserRole): boolean {
  const hierarchy = [
    UserRole.VISITOR,
    UserRole.FREE,
    UserRole.PREMIUM,
    UserRole.CREATOR,
    UserRole.ADMIN,
  ]

  const currentIndex = hierarchy.indexOf(currentRole)
  const requiredIndex = hierarchy.indexOf(requiredRole)

  return currentIndex >= requiredIndex
}
