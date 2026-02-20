import { AuthTokens, User } from '@/features/auth/types'

const ASSISTED_BACKUP_STORAGE_KEY = 'assisted-session-admin-backup'

export interface AssistedSessionAdminBackup {
  user: User
  tokens: AuthTokens
  assistedSessionId: string
  createdAt: string
}

export const saveAssistedSessionAdminBackup = (backup: AssistedSessionAdminBackup): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(ASSISTED_BACKUP_STORAGE_KEY, JSON.stringify(backup))
}

export const getAssistedSessionAdminBackup = (): AssistedSessionAdminBackup | null => {
  if (typeof window === 'undefined') return null

  const raw = localStorage.getItem(ASSISTED_BACKUP_STORAGE_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as Partial<AssistedSessionAdminBackup>
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !parsed.user ||
      !parsed.tokens ||
      typeof parsed.assistedSessionId !== 'string'
    ) {
      return null
    }

    if (
      typeof parsed.tokens.accessToken !== 'string' ||
      typeof parsed.tokens.refreshToken !== 'string'
    ) {
      return null
    }

    return {
      user: parsed.user as User,
      tokens: parsed.tokens as AuthTokens,
      assistedSessionId: parsed.assistedSessionId,
      createdAt: typeof parsed.createdAt === 'string' ? parsed.createdAt : new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export const clearAssistedSessionAdminBackup = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(ASSISTED_BACKUP_STORAGE_KEY)
}
