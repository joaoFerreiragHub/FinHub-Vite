import { expect, test, type Page, type Route } from 'playwright/test'

interface AdminSessionOptions {
  adminReadOnly: boolean
  adminScopes: string[]
}

const NOW = new Date().toISOString()

const buildAuthStorage = ({ adminReadOnly, adminScopes }: AdminSessionOptions) =>
  JSON.stringify({
    state: {
      user: {
        id: 'e2e-admin-user-1',
        name: 'E2E Admin',
        email: 'admin@finhub.test',
        username: 'e2e-admin',
        role: 'admin',
        accountStatus: 'active',
        adminReadOnly,
        adminScopes,
        isEmailVerified: true,
        createdAt: NOW,
        updatedAt: NOW,
      },
      accessToken: 'dev-e2e-access-token',
      refreshToken: 'dev-e2e-refresh-token',
      isAuthenticated: true,
    },
    version: 0,
  })

const installAdminSession = async (page: Page, options: AdminSessionOptions) => {
  const authStorage = buildAuthStorage(options)
  await page.addInitScript((value: string) => {
    window.localStorage.setItem('auth-storage', value)
  }, authStorage)
}

const baseUserRecord = {
  id: 'target-user-1',
  email: 'investidor@finhub.test',
  name: 'Investidor Teste',
  username: 'investidor_teste',
  role: 'free',
  accountStatus: 'active',
  adminReadOnly: false,
  adminScopes: [],
  statusReason: null,
  statusChangedAt: null,
  statusChangedBy: null,
  tokenVersion: 1,
  lastForcedLogoutAt: null,
  lastLoginAt: NOW,
  lastActiveAt: NOW,
  createdAt: NOW,
  updatedAt: NOW,
}

const fulfillJson = async (route: Route, data: unknown) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(data),
  })
}

const installAdminUsersApiMocks = async (page: Page) => {
  await page.route('**/api/admin/**', async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    const { pathname, searchParams } = url
    const method = request.method().toUpperCase()

    if (method === 'GET' && pathname.endsWith('/api/admin/users')) {
      const statusFilter = searchParams.get('accountStatus')
      const item =
        statusFilter === 'suspended'
          ? { ...baseUserRecord, id: 'suspended-user-1', accountStatus: 'suspended' }
          : statusFilter === 'banned'
            ? { ...baseUserRecord, id: 'banned-user-1', accountStatus: 'banned' }
            : baseUserRecord

      const total = statusFilter ? 0 : 1
      const items = statusFilter ? [] : [item]

      await fulfillJson(route, {
        items,
        pagination: { page: 1, limit: 20, total, pages: 1 },
      })
      return
    }

    if (method === 'GET' && /\/api\/admin\/users\/[^/]+\/history$/.test(pathname)) {
      await fulfillJson(route, {
        items: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 1 },
      })
      return
    }

    if (method === 'POST' && /\/api\/admin\/users\/[^/]+\/suspend$/.test(pathname)) {
      await fulfillJson(route, {
        message: 'Conta suspensa com sucesso.',
        changed: true,
        fromStatus: 'active',
        user: { ...baseUserRecord, accountStatus: 'suspended', statusReason: 'Teste E2E' },
      })
      return
    }

    await fulfillJson(route, {
      items: [],
      pagination: { page: 1, limit: 20, total: 0, pages: 1 },
    })
  })
}

test.describe('Admin P2.6 - E2E guardrails e permissao', () => {
  test('admin com escopo users.write executa suspensao com confirmacao dupla', async ({ page }) => {
    await installAdminSession(page, {
      adminReadOnly: false,
      adminScopes: ['admin.users.read', 'admin.users.write'],
    })
    await installAdminUsersApiMocks(page)

    await page.goto('/admin')

    await expect(page.getByText('Painel admin unificado')).toBeVisible()
    await page.getByRole('tab', { name: 'Utilizadores' }).click()

    await expect(page.getByText('@investidor_teste')).toBeVisible()
    await page.getByRole('button', { name: 'Suspender' }).first().click()

    await expect(page.getByRole('heading', { name: 'Suspender utilizador' })).toBeVisible()

    const confirmButton = page.getByRole('button', { name: 'Confirmar suspensao' })
    await expect(confirmButton).toBeDisabled()

    await page.fill('#admin-action-confirm', 'CONFIRMAR')
    await expect(confirmButton).toBeEnabled()

    await confirmButton.click()
    await expect(page.getByText('Conta suspensa com sucesso.')).toBeVisible()
  })

  test('admin read-only nao consegue executar acoes destrutivas e so ve modulos permitidos', async ({
    page,
  }) => {
    await installAdminSession(page, {
      adminReadOnly: true,
      adminScopes: ['admin.users.read', 'admin.users.write'],
    })
    await installAdminUsersApiMocks(page)

    await page.goto('/admin')

    await expect(page.getByText('Perfil em modo read-only')).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Moderacao' })).toHaveCount(0)

    await page.getByRole('tab', { name: 'Utilizadores' }).click()
    await expect(page.getByText('@investidor_teste')).toBeVisible()

    await expect(page.getByRole('button', { name: 'Suspender' }).first()).toBeDisabled()
    await expect(page.getByRole('button', { name: 'Force logout' }).first()).toBeDisabled()
  })
})
