import type { User } from '@/features/auth/types'
import type { AdminModuleKey } from './access'
import { canReadAdminModule, findAdminModule } from './access'

export type AdminGoShortcutKey = 'd' | 'u' | 'r' | 'c' | 'e' | 's' | 'b' | 'm' | 'o' | 'a' | 't'

const ADMIN_GO_SHORTCUT_TO_MODULE: Record<AdminGoShortcutKey, AdminModuleKey> = {
  d: 'dashboard',
  u: 'users',
  r: 'creators',
  c: 'content',
  e: 'editorial',
  s: 'support',
  b: 'brands',
  m: 'monetization',
  o: 'operations',
  a: 'audit',
  t: 'stats',
}

const ADMIN_MODULE_TO_GO_SHORTCUT: Record<AdminModuleKey, AdminGoShortcutKey> = {
  dashboard: 'd',
  users: 'u',
  creators: 'r',
  content: 'c',
  editorial: 'e',
  support: 's',
  brands: 'b',
  monetization: 'm',
  operations: 'o',
  audit: 'a',
  stats: 't',
}

export const getAdminShortcutForModule = (moduleKey: AdminModuleKey): AdminGoShortcutKey =>
  ADMIN_MODULE_TO_GO_SHORTCUT[moduleKey]

const isKnownShortcutKey = (key: string): key is AdminGoShortcutKey => {
  return (
    key === 'd' ||
    key === 'u' ||
    key === 'r' ||
    key === 'c' ||
    key === 'e' ||
    key === 's' ||
    key === 'b' ||
    key === 'm' ||
    key === 'o' ||
    key === 'a' ||
    key === 't'
  )
}

export const resolveAdminShortcutPath = (
  user: User | null | undefined,
  rawKey: string,
): string | null => {
  const key = rawKey.trim().toLowerCase()
  if (!isKnownShortcutKey(key)) return null

  const moduleKey = ADMIN_GO_SHORTCUT_TO_MODULE[key]
  const moduleConfig = findAdminModule(moduleKey)
  if (!moduleConfig) return null

  return canReadAdminModule(user, moduleConfig) ? moduleConfig.path : null
}

export const isTypingEventTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false
  const tagName = target.tagName.toLowerCase()

  return (
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'select' ||
    target.isContentEditable === true
  )
}
