import { screen } from '@testing-library/react'
import AdminAuditLogsPage from '@/features/admin/pages/AdminAuditLogsPage'
import * as adminAuditLogsHooks from '@/features/admin/hooks/useAdminAuditLogs'
import { renderWithProviders } from '@/__tests__/utils/renderWithProviders'

jest.mock('@/features/admin/hooks/useAdminAuditLogs')

const mockedHooks = adminAuditLogsHooks as jest.Mocked<typeof adminAuditLogsHooks>

describe('AdminAuditLogsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockedHooks.useAdminAuditLogs.mockReturnValue({
      data: {
        items: [
          {
            id: 'audit-1',
            createdAt: '2026-03-05T10:00:00.000Z',
            actor: {
              id: 'admin-1',
              username: 'ops-admin',
            },
            actorRole: 'admin',
            action: 'admin.users.write',
            resourceType: 'user',
            resourceId: 'user-42',
            reason: 'Ajuste de permissoes',
            requestId: 'req-1',
            method: 'POST',
            path: '/api/admin/users/user-42/admin-permissions',
            statusCode: 200,
            outcome: 'success',
          },
        ],
        pagination: {
          page: 1,
          limit: 50,
          total: 1,
          pages: 1,
        },
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    } as never)

    mockedHooks.useExportAdminAuditLogsCsv.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    } as never)
  })

  it('renders card mode and table mode structures for audit events', () => {
    renderWithProviders(<AdminAuditLogsPage />, {
      initialRoute: '/admin/auditoria',
      authState: {
        user: {
          id: 'admin-1',
          role: 'admin',
          email: 'admin@example.com',
          name: 'Admin',
          username: 'admin',
          adminReadOnly: false,
          adminScopes: ['admin.audit.read'],
        } as never,
        isAuthenticated: true,
      },
    })

    expect(screen.getByText('Quando')).toBeInTheDocument()
    expect(screen.getByText('Resource')).toBeInTheDocument()
    expect(screen.getByText(/HTTP:/i)).toBeInTheDocument()
  })
})
