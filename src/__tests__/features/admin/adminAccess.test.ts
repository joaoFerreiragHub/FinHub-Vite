import { UserRole, type User } from '@/features/auth/types'
import {
  canAccessAdminPath,
  getAdminModuleForPath,
  getDefaultAdminPath,
} from '@/features/admin/lib/access'

const buildAdminUser = (adminScopes: string[], adminReadOnly = false): User => ({
  id: 'admin-user-id',
  name: 'Admin',
  email: 'admin@finhub.test',
  username: 'admin_test',
  role: UserRole.ADMIN,
  adminScopes,
  adminReadOnly,
  isEmailVerified: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
})

describe('admin access path guards', () => {
  it('resolves admin module from known paths', () => {
    expect(getAdminModuleForPath('/admin/users')?.key).toBe('users')
    expect(getAdminModuleForPath('/admin/users/123')?.key).toBe('users')
    expect(getAdminModuleForPath('/admin/auditoria')?.key).toBe('audit')
    expect(getAdminModuleForPath('/admin/conteudo?status=hidden')?.key).toBe('content')
  })

  it('returns undefined for unknown admin paths', () => {
    expect(getAdminModuleForPath('/admin/nao-existe')).toBeUndefined()
    expect(getAdminModuleForPath('/public')).toBeUndefined()
  })

  it('allows access only when the admin has the module scope', () => {
    const usersOnlyAdmin = buildAdminUser(['admin.users.read'])

    expect(canAccessAdminPath(usersOnlyAdmin, '/admin/users')).toBe(true)
    expect(canAccessAdminPath(usersOnlyAdmin, '/admin/creators')).toBe(true)
    expect(canAccessAdminPath(usersOnlyAdmin, '/admin/conteudo')).toBe(false)
    expect(canAccessAdminPath(usersOnlyAdmin, '/admin/auditoria')).toBe(false)
  })

  it('denies admin path for non-admin users', () => {
    const creatorUser: User = {
      ...buildAdminUser([]),
      role: UserRole.CREATOR,
      adminScopes: undefined,
      adminReadOnly: undefined,
    }

    expect(canAccessAdminPath(creatorUser, '/admin/users')).toBe(false)
  })

  it('returns a safe default path for admin and non-admin users', () => {
    const usersOnlyAdmin = buildAdminUser(['admin.users.read'])

    expect(getDefaultAdminPath(usersOnlyAdmin)).toBe('/admin')
    expect(getDefaultAdminPath(null)).toBe('/')
  })
})
