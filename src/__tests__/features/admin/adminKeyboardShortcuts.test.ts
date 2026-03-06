import { UserRole, type User } from '@/features/auth/types'
import {
  getAdminShortcutForModule,
  isTypingEventTarget,
  resolveAdminShortcutPath,
} from '@/features/admin/lib/keyboardShortcuts'

const buildAdminUser = (adminScopes: string[] = []): User => ({
  id: 'admin-1',
  name: 'Dev',
  lastName: 'Admin',
  email: 'admin@finhub.test',
  username: 'dev-admin',
  role: UserRole.ADMIN,
  adminReadOnly: false,
  adminScopes,
  isEmailVerified: true,
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString(),
})

describe('admin keyboard shortcuts', () => {
  it('maps module key to expected go-shortcut', () => {
    expect(getAdminShortcutForModule('dashboard')).toBe('d')
    expect(getAdminShortcutForModule('content')).toBe('c')
    expect(getAdminShortcutForModule('stats')).toBe('t')
  })

  it('resolves path for shortcut when user has matching scope', () => {
    const user = buildAdminUser(['admin.users.read'])
    expect(resolveAdminShortcutPath(user, 'u')).toBe('/admin/users')
  })

  it('returns null when user lacks scope for target module', () => {
    const user = buildAdminUser(['admin.users.read'])
    expect(resolveAdminShortcutPath(user, 't')).toBeNull()
  })

  it('detects typing targets to avoid shortcut hijacking in inputs', () => {
    const input = document.createElement('input')
    const textarea = document.createElement('textarea')
    const div = document.createElement('div')

    expect(isTypingEventTarget(input)).toBe(true)
    expect(isTypingEventTarget(textarea)).toBe(true)
    expect(isTypingEventTarget(div)).toBe(false)
  })
})
