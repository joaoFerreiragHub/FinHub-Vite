import type { LoaderFunctionArgs } from '@/lib/reactRouterDomCompat'
import { UserRole } from '@/features/auth/types'
import { requireAdmin } from '@/lib/auth/guards'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import {
  mockAuthenticatedUser,
  mockUnauthenticatedUser,
  resetAuthStore,
} from '@/__tests__/utils/mockAuthStore'

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return {
    ...actual,
    redirect: (to: string) => ({ to }),
  }
})

const makeLoaderArgs = (pathname: string): LoaderFunctionArgs =>
  ({
    request: { url: `http://localhost${pathname}` } as Request,
    params: {},
    context: null,
  }) as LoaderFunctionArgs

const getRedirectLocation = (result: unknown): string | null => {
  if (typeof result === 'object' && result !== null && 'to' in result) {
    return (result as { to: string }).to
  }
  return null
}

const setAdminScopes = (scopes: string[], adminReadOnly = false): void => {
  const currentUser = useAuthStore.getState().user
  if (!currentUser) {
    throw new Error('Nao foi possivel preparar o utilizador admin para o teste.')
  }

  useAuthStore.setState({
    user: {
      ...currentUser,
      role: UserRole.ADMIN,
      adminScopes: scopes,
      adminReadOnly,
    },
    isAuthenticated: true,
    hydrated: true,
  })
}

describe('requireAdmin guard with admin scopes', () => {
  afterEach(() => {
    resetAuthStore()
  })

  it('redirects unauthenticated users to login', () => {
    mockUnauthenticatedUser()

    const result = requireAdmin(makeLoaderArgs('/admin/users'))
    expect(getRedirectLocation(result)).toBe('/login')
  })

  it('redirects non-admin users to homepage', () => {
    mockAuthenticatedUser(UserRole.CREATOR)

    const result = requireAdmin(makeLoaderArgs('/admin/users'))
    expect(getRedirectLocation(result)).toBe('/')
  })

  it('allows admin users when scope grants access to route path', () => {
    mockAuthenticatedUser(UserRole.ADMIN)
    setAdminScopes(['admin.users.read'])

    const result = requireAdmin(makeLoaderArgs('/admin/users'))
    expect(result).toBeNull()
  })

  it('redirects admin users to default admin path when scope is missing', () => {
    mockAuthenticatedUser(UserRole.ADMIN)
    setAdminScopes(['admin.content.read'])

    const result = requireAdmin(makeLoaderArgs('/admin/users'))
    expect(getRedirectLocation(result)).toBe('/admin')
  })

  it('redirects unknown admin paths to default admin path', () => {
    mockAuthenticatedUser(UserRole.ADMIN)
    setAdminScopes(['admin.content.read'])

    const result = requireAdmin(makeLoaderArgs('/admin/nao-existe'))
    expect(getRedirectLocation(result)).toBe('/admin')
  })
})
