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

const baseContentRecord = {
  id: 'content-1',
  contentType: 'article',
  title: 'Artigo de teste',
  slug: 'artigo-teste',
  description: 'Conteudo para validar guardrails de moderacao.',
  category: 'noticias',
  status: 'published',
  moderationStatus: 'visible',
  moderationReason: null,
  moderationNote: null,
  moderatedAt: null,
  moderatedBy: null,
  creator: {
    id: 'creator-1',
    name: 'Criador Teste',
    username: 'criador_teste',
    email: 'creator@finhub.test',
    role: 'creator',
  },
  createdAt: NOW,
  updatedAt: NOW,
}

const baseSupportSessionRecord = {
  id: 'session-1',
  adminUser: {
    id: 'e2e-admin-user-1',
    name: 'E2E Admin',
    username: 'e2e-admin',
    email: 'admin@finhub.test',
    role: 'admin',
  },
  targetUser: {
    id: baseUserRecord.id,
    name: baseUserRecord.name,
    username: baseUserRecord.username,
    email: baseUserRecord.email,
    role: baseUserRecord.role,
  },
  scope: 'read_only',
  status: 'approved',
  reason: 'Pedido de suporte para revisar conta.',
  note: null,
  consentExpiresAt: NOW,
  requestedSessionTtlMinutes: 15,
  approvedAt: NOW,
  startedAt: null,
  sessionExpiresAt: NOW,
  declinedAt: null,
  declinedReason: null,
  revokedAt: null,
  revokedBy: null,
  revokedReason: null,
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

const installAdminContentApiMocks = async (page: Page) => {
  await page.route('**/api/admin/**', async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    const { pathname, searchParams } = url
    const method = request.method().toUpperCase()

    if (method === 'GET' && pathname.endsWith('/api/admin/content/queue')) {
      const moderationStatus = searchParams.get('moderationStatus')
      const isFiltered = moderationStatus === 'hidden' || moderationStatus === 'restricted'

      await fulfillJson(route, {
        items: isFiltered ? [] : [baseContentRecord],
        pagination: {
          page: 1,
          limit: 20,
          total: isFiltered ? 0 : 1,
          pages: 1,
        },
      })
      return
    }

    if (method === 'GET' && /\/api\/admin\/content\/[^/]+\/[^/]+\/history$/.test(pathname)) {
      await fulfillJson(route, {
        items: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 1 },
      })
      return
    }

    if (method === 'POST' && /\/api\/admin\/content\/[^/]+\/[^/]+\/hide$/.test(pathname)) {
      await fulfillJson(route, {
        message: 'Conteudo ocultado com sucesso.',
        changed: true,
        fromStatus: 'visible',
        toStatus: 'hidden',
        content: {
          ...baseContentRecord,
          moderationStatus: 'hidden',
          moderationReason: 'Teste E2E',
          moderatedAt: NOW,
        },
      })
      return
    }

    await fulfillJson(route, {
      items: [],
      pagination: { page: 1, limit: 20, total: 0, pages: 1 },
    })
  })
}

const installAdminSupportApiMocks = async (page: Page) => {
  await page.route('**/api/admin/**', async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    const { pathname, searchParams } = url
    const method = request.method().toUpperCase()

    if (method === 'GET' && pathname.endsWith('/api/admin/users')) {
      await fulfillJson(route, {
        items: [baseUserRecord],
        pagination: { page: 1, limit: 100, total: 1, pages: 1 },
      })
      return
    }

    if (method === 'GET' && pathname.endsWith('/api/admin/support/sessions')) {
      const status = searchParams.get('status')
      if (status === 'pending') {
        await fulfillJson(route, {
          items: [{ ...baseSupportSessionRecord, id: 'session-pending-1', status: 'pending' }],
          pagination: { page: 1, limit: 20, total: 1, pages: 1 },
        })
        return
      }

      if (status === 'active') {
        await fulfillJson(route, {
          items: [],
          pagination: { page: 1, limit: 20, total: 0, pages: 1 },
        })
        return
      }

      await fulfillJson(route, {
        items: [baseSupportSessionRecord],
        pagination: { page: 1, limit: 20, total: 1, pages: 1 },
      })
      return
    }

    if (method === 'GET' && /\/api\/admin\/support\/sessions\/[^/]+\/history$/.test(pathname)) {
      await fulfillJson(route, {
        items: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 1 },
      })
      return
    }

    if (method === 'POST' && /\/api\/admin\/support\/sessions\/[^/]+\/revoke$/.test(pathname)) {
      await fulfillJson(route, {
        message: 'Sessao assistida revogada.',
        changed: true,
        session: {
          ...baseSupportSessionRecord,
          status: 'revoked',
          revokedAt: NOW,
          revokedBy: 'e2e-admin-user-1',
          revokedReason: 'Teste E2E',
        },
      })
      return
    }

    if (method === 'POST' && /\/api\/admin\/support\/sessions\/[^/]+\/start$/.test(pathname)) {
      await fulfillJson(route, {
        message: 'Sessao assistida iniciada.',
        session: {
          ...baseSupportSessionRecord,
          status: 'active',
          startedAt: NOW,
          sessionExpiresAt: NOW,
        },
        actingUser: {
          id: baseUserRecord.id,
          name: baseUserRecord.name,
          email: baseUserRecord.email,
          username: baseUserRecord.username,
          role: 'free',
          isEmailVerified: true,
          createdAt: NOW,
          updatedAt: NOW,
        },
        tokens: {
          accessToken: 'assist-token-e2e',
          refreshToken: 'assist-refresh-e2e',
        },
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

  test('admin com escopo content.moderate executa hide com confirmacao dupla', async ({ page }) => {
    await installAdminSession(page, {
      adminReadOnly: false,
      adminScopes: ['admin.content.read', 'admin.content.moderate'],
    })
    await installAdminContentApiMocks(page)

    await page.goto('/admin')
    await page.getByRole('tab', { name: 'Moderacao' }).click()

    await expect(page.getByText('/artigo-teste')).toBeVisible()
    await page.getByRole('button', { name: 'Ocultar' }).first().click()
    await expect(page.getByRole('heading', { name: 'Ocultar conteudo' })).toBeVisible()

    const confirmButton = page.getByRole('button', { name: 'Confirmar ocultacao' })
    await expect(confirmButton).toBeDisabled()

    await page.fill('#admin-content-action-confirm', 'CONFIRMAR')
    await expect(confirmButton).toBeEnabled()

    await confirmButton.click()
    await expect(page.getByText('Conteudo ocultado com sucesso.')).toBeVisible()
  })

  test('admin com escopo de suporte pode iniciar sessao assistida', async ({ page }) => {
    await installAdminSession(page, {
      adminReadOnly: false,
      adminScopes: ['admin.users.read', 'admin.support.session.assist'],
    })
    await installAdminSupportApiMocks(page)

    await page.goto('/admin')
    await page.getByRole('tab', { name: 'Suporte' }).click()

    await expect(page.getByRole('heading', { name: 'Acesso assistido' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Iniciar' }).first()).toBeVisible()
    await page.getByRole('button', { name: 'Iniciar' }).first().click()
    await expect(page).toHaveURL(/\/conta$/)
  })

  test('admin com escopo de suporte revoga sessao com guardrail de confirmacao', async ({
    page,
  }) => {
    await installAdminSession(page, {
      adminReadOnly: false,
      adminScopes: ['admin.users.read', 'admin.support.session.assist'],
    })
    await installAdminSupportApiMocks(page)

    await page.goto('/admin')
    await page.getByRole('tab', { name: 'Suporte' }).click()

    await expect(page.getByRole('heading', { name: 'Acesso assistido' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Revogar' }).first()).toBeVisible()
    await page.getByRole('button', { name: 'Revogar' }).first().click()
    await expect(page.getByRole('heading', { name: 'Revogar sessao assistida' })).toBeVisible()

    const revokeButton = page.getByRole('button', { name: 'Revogar' }).last()
    await expect(revokeButton).toBeDisabled()

    await page.fill('#revoke-confirm', 'CONFIRMAR')
    await expect(revokeButton).toBeEnabled()

    await revokeButton.click()
    await expect(page.getByText('Sessao assistida revogada.')).toBeVisible()
  })
})
